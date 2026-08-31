import { createReadStream } from 'node:fs';
import { lstat } from 'node:fs/promises';
import path from 'node:path';
import { TextDecoder } from 'node:util';
import { createGunzip } from 'node:zlib';

const BLOCK_SIZE = 512;
const MAX_ENTRIES = 2_000_000;
const MAX_PAX_BYTES = 1024 * 1024;
const MAX_LOGICAL_PATH_BYTES = 4096;
const utf8 = new TextDecoder('utf-8', { fatal: true });

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

class StreamReader {
  constructor(stream) {
    this.iterator = stream[Symbol.asyncIterator]();
    this.chunk = Buffer.alloc(0);
    this.offset = 0;
    this.ended = false;
  }

  async refill() {
    while (this.offset >= this.chunk.length && !this.ended) {
      const next = await this.iterator.next();
      this.ended = Boolean(next.done);
      this.chunk = this.ended ? Buffer.alloc(0) : Buffer.from(next.value);
      this.offset = 0;
    }
  }

  async readExactly(length, label) {
    if (!Number.isSafeInteger(length) || length < 0) fail('ARCHIVE_FORMAT', `invalid read length for ${label}`);
    const pieces = [];
    let remaining = length;
    while (remaining > 0) {
      await this.refill();
      if (this.ended) fail('ARCHIVE_TRUNCATED', `${label} ended ${remaining} byte(s) early`);
      const available = this.chunk.length - this.offset;
      const take = Math.min(available, remaining);
      pieces.push(this.chunk.subarray(this.offset, this.offset + take));
      this.offset += take;
      remaining -= take;
    }
    return pieces.length === 1 ? Buffer.from(pieces[0]) : Buffer.concat(pieces, length);
  }

  async skipExactly(length, label) {
    if (!Number.isSafeInteger(length) || length < 0) fail('ARCHIVE_FORMAT', `invalid skip length for ${label}`);
    let remaining = length;
    while (remaining > 0) {
      await this.refill();
      if (this.ended) fail('ARCHIVE_TRUNCATED', `${label} ended ${remaining} byte(s) early`);
      const take = Math.min(this.chunk.length - this.offset, remaining);
      this.offset += take;
      remaining -= take;
    }
  }

  async requireOnlyZeroPadding() {
    while (true) {
      await this.refill();
      if (this.ended) return;
      for (let index = this.offset; index < this.chunk.length; index += 1) {
        if (this.chunk[index] !== 0) fail('ARCHIVE_TRAILING_DATA', 'non-zero data follows the tar end marker');
      }
      this.offset = this.chunk.length;
    }
  }
}

const decodeField = (field, label) => {
  const nullIndex = field.indexOf(0);
  const used = nullIndex < 0 ? field : field.subarray(0, nullIndex);
  if (nullIndex >= 0) {
    for (let index = nullIndex; index < field.length; index += 1) {
      if (field[index] !== 0) fail('ARCHIVE_FORMAT', `${label} has non-null data after its terminator`);
    }
  }
  try {
    return utf8.decode(used);
  } catch {
    fail('ARCHIVE_FORMAT', `${label} is not valid UTF-8`);
  }
};

const parseOctal = (field, label) => {
  if ((field[0] & 0x80) !== 0) fail('ARCHIVE_FORMAT', `${label} uses unsupported base-256 encoding`);
  const value = field.toString('ascii').replace(/\0.*$/s, '').trim();
  if (value === '') return 0;
  if (!/^[0-7]+$/.test(value)) fail('ARCHIVE_FORMAT', `${label} is not a valid octal value`);
  const parsed = Number.parseInt(value, 8);
  if (!Number.isSafeInteger(parsed) || parsed < 0) fail('ARCHIVE_FORMAT', `${label} exceeds the safe numeric range`);
  return parsed;
};

const isZeroBlock = (block) => block.every((byte) => byte === 0);

const parseHeader = (header) => {
  const recordedChecksum = parseOctal(header.subarray(148, 156), 'header checksum');
  let calculatedChecksum = 0;
  for (let index = 0; index < header.length; index += 1) {
    calculatedChecksum += index >= 148 && index < 156 ? 0x20 : header[index];
  }
  if (recordedChecksum !== calculatedChecksum) {
    fail('ARCHIVE_CHECKSUM', `header checksum ${recordedChecksum} does not match ${calculatedChecksum}`);
  }

  const magic = decodeField(header.subarray(257, 263), 'tar magic');
  if (magic !== 'ustar') fail('ARCHIVE_FORMAT', `unsupported tar format magic: ${JSON.stringify(magic)}`);

  const name = decodeField(header.subarray(0, 100), 'entry name');
  const prefix = decodeField(header.subarray(345, 500), 'entry prefix');
  const headerPath = prefix ? `${prefix}/${name}` : name;
  const linkPath = decodeField(header.subarray(157, 257), 'link target');
  const typeByte = header[156];

  return {
    headerPath,
    linkPath,
    size: parseOctal(header.subarray(124, 136), 'entry size'),
    type: typeByte === 0 ? '0' : String.fromCharCode(typeByte),
  };
};

const parsePax = (payload) => {
  const values = new Map();
  let offset = 0;
  while (offset < payload.length) {
    const space = payload.indexOf(0x20, offset);
    if (space < 0) fail('PAX_FORMAT', 'PAX record is missing its length separator');
    const lengthText = payload.subarray(offset, space).toString('ascii');
    if (!/^[1-9][0-9]*$/.test(lengthText)) fail('PAX_FORMAT', 'PAX record has an invalid length');
    const recordLength = Number.parseInt(lengthText, 10);
    if (!Number.isSafeInteger(recordLength) || recordLength <= 0 || offset + recordLength > payload.length) {
      fail('PAX_FORMAT', 'PAX record length exceeds its metadata payload');
    }
    const record = payload.subarray(space + 1, offset + recordLength);
    if (record.length < 2 || record.at(-1) !== 0x0a) fail('PAX_FORMAT', 'PAX record is missing its newline terminator');
    const body = record.subarray(0, -1);
    const equals = body.indexOf(0x3d);
    if (equals <= 0) fail('PAX_FORMAT', 'PAX record is missing a valid key/value separator');
    const key = body.subarray(0, equals).toString('ascii');
    if (!/^[A-Za-z0-9_.-]+$/.test(key)) fail('PAX_FORMAT', `invalid PAX key: ${JSON.stringify(key)}`);
    if (values.has(key)) fail('PAX_FORMAT', `duplicate PAX key: ${key}`);
    let value;
    try {
      value = utf8.decode(body.subarray(equals + 1));
    } catch {
      fail('PAX_FORMAT', `PAX value for ${key} is not valid UTF-8`);
    }
    values.set(key, value);
    offset += recordLength;
  }

  const allowedKeys = new Set(['path', 'linkpath', 'size', 'mtime']);
  for (const key of values.keys()) {
    if (!allowedKeys.has(key)) fail('PAX_FORMAT', `unsupported PAX key: ${key}`);
  }
  if (values.has('size') && !/^(?:0|[1-9][0-9]*)$/.test(values.get('size'))) {
    fail('PAX_FORMAT', 'PAX size is not a non-negative decimal integer');
  }
  if (values.has('mtime') && !/^-?[0-9]+(?:\.[0-9]+)?$/.test(values.get('mtime'))) {
    fail('PAX_FORMAT', 'PAX mtime is malformed');
  }
  return values;
};

const rejectControlText = (value, label) => {
  if (Buffer.byteLength(value, 'utf8') > MAX_LOGICAL_PATH_BYTES) fail('PATH_LENGTH', `${label} exceeds ${MAX_LOGICAL_PATH_BYTES} bytes`);
  if (value.includes('\\')) fail('PATH_FORMAT', `${label} contains a platform-ambiguous backslash`);
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code < 0x20 || code === 0x7f) fail('PATH_FORMAT', `${label} contains a control character`);
  }
};

const normalizeMemberPath = (rawPath, label) => {
  rejectControlText(rawPath, label);
  if (rawPath === '' || path.posix.isAbsolute(rawPath)) fail('MEMBER_PATH', `${label} must be a non-empty relative POSIX path: ${JSON.stringify(rawPath)}`);
  const withoutTrailingSlash = rawPath.replace(/\/+$/u, '');
  if (withoutTrailingSlash === '') fail('MEMBER_PATH', `${label} does not identify a relative member`);
  const components = withoutTrailingSlash.split('/');
  if (components.some((component) => component === '' || component === '.' || component === '..')) {
    fail('MEMBER_PATH', `${label} contains an empty, dot, or traversal component: ${JSON.stringify(rawPath)}`);
  }
  const normalized = path.posix.normalize(withoutTrailingSlash);
  if (normalized !== withoutTrailingSlash) fail('MEMBER_PATH', `${label} is not canonically normalized: ${JSON.stringify(rawPath)}`);
  return normalized;
};

const isWithinRoot = (candidate, acceptedRoot) => candidate === acceptedRoot || candidate.startsWith(`${acceptedRoot}/`);

const resolveLinkTarget = (rawTarget, entry, acceptedRoot) => {
  const label = `${entry.type === 'symlink' ? 'symlink' : 'hardlink'} target for ${entry.path}`;
  rejectControlText(rawTarget, label);
  if (rawTarget === '') fail('LINK_TARGET', `${label} is empty`);
  if (path.posix.isAbsolute(rawTarget)) fail('LINK_ESCAPE', `${label} is absolute: ${JSON.stringify(rawTarget)}`);

  const components = rawTarget.split('/');
  if (components.some((component, index) => component === '' && index !== components.length - 1)) {
    fail('LINK_TARGET', `${label} contains an empty path component`);
  }
  const resolved = entry.type === 'symlink'
    ? path.posix.normalize(path.posix.join(path.posix.dirname(entry.path), rawTarget))
    : path.posix.normalize(rawTarget);
  if (resolved === '..' || resolved.startsWith('../') || !isWithinRoot(resolved, acceptedRoot)) {
    fail('LINK_ESCAPE', `${label} resolves outside ${acceptedRoot}: ${JSON.stringify(rawTarget)} -> ${resolved}`);
  }
  return resolved.replace(/\/+$/u, '');
};

const validateEntryGraph = (entries, acceptedRoot) => {
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  const rootEntry = byPath.get(acceptedRoot);
  if (!rootEntry || rootEntry.type !== 'directory') fail('ARCHIVE_ROOT', `archive must contain directory root ${acceptedRoot}`);

  for (const entry of entries) {
    const components = entry.path.split('/');
    for (let length = acceptedRoot.split('/').length; length < components.length; length += 1) {
      const ancestorPath = components.slice(0, length).join('/');
      const ancestor = byPath.get(ancestorPath);
      if (ancestor?.type === 'symlink' || ancestor?.type === 'hardlink') {
        fail('PARENT_LINK', `${entry.path} would be written through link ancestor ${ancestorPath}`);
      }
    }

    if (entry.type === 'symlink' || entry.type === 'hardlink') {
      entry.resolvedTarget = resolveLinkTarget(entry.linkPath, entry, acceptedRoot);
      if (!byPath.has(entry.resolvedTarget)) {
        fail('LINK_TARGET', `${entry.type} ${entry.path} references missing archive member ${entry.resolvedTarget}`);
      }
    }
  }

  const resolveTerminal = (startPath, stack = []) => {
    const entry = byPath.get(startPath);
    if (!entry) fail('LINK_TARGET', `link chain references missing archive member ${startPath}`);
    if (entry.type !== 'symlink' && entry.type !== 'hardlink') return entry;
    if (stack.includes(startPath)) fail('LINK_CYCLE', `link cycle detected: ${[...stack, startPath].join(' -> ')}`);
    return resolveTerminal(entry.resolvedTarget, [...stack, startPath]);
  };

  for (const entry of entries) {
    if (entry.type !== 'symlink' && entry.type !== 'hardlink') continue;
    const terminal = resolveTerminal(entry.path);
    if (entry.type === 'hardlink' && terminal.type !== 'regular') {
      fail('HARDLINK_TARGET', `hardlink ${entry.path} must terminate at a regular file, not ${terminal.type}`);
    }
  }
};

const verifyArchive = async (archivePath, acceptedRootInput) => {
  const acceptedRoot = normalizeMemberPath(acceptedRootInput, 'accepted archive root');
  const archiveMetadata = await lstat(archivePath).catch(() => null);
  if (!archiveMetadata || !archiveMetadata.isFile() || archiveMetadata.isSymbolicLink()) {
    fail('ARCHIVE_INPUT', `archive must be a regular file: ${archivePath}`);
  }

  const compressed = createReadStream(archivePath);
  const gunzip = createGunzip();
  compressed.pipe(gunzip);
  const reader = new StreamReader(gunzip);
  const entries = [];
  const paths = new Set();
  let pendingPax = null;

  try {
    while (true) {
      const header = await reader.readExactly(BLOCK_SIZE, 'tar header');
      if (isZeroBlock(header)) {
        const secondEndBlock = await reader.readExactly(BLOCK_SIZE, 'second tar end block');
        if (!isZeroBlock(secondEndBlock)) fail('ARCHIVE_FORMAT', 'tar archive has only one zero end block');
        if (pendingPax) fail('PAX_FORMAT', 'PAX metadata is not followed by an archive entry');
        await reader.requireOnlyZeroPadding();
        break;
      }

      const parsed = parseHeader(header);
      if (parsed.type === 'x') {
        if (pendingPax) fail('PAX_FORMAT', 'consecutive per-entry PAX headers are not accepted');
        if (parsed.size > MAX_PAX_BYTES) fail('PAX_FORMAT', `PAX payload exceeds ${MAX_PAX_BYTES} bytes`);
        const paxPayload = await reader.readExactly(parsed.size, 'PAX payload');
        pendingPax = parsePax(paxPayload);
        await reader.skipExactly((BLOCK_SIZE - (parsed.size % BLOCK_SIZE)) % BLOCK_SIZE, 'PAX padding');
        continue;
      }
      if (parsed.type === 'g') fail('ENTRY_TYPE', 'global PAX headers are not accepted');

      const rawPath = pendingPax?.get('path') ?? parsed.headerPath;
      const rawLinkPath = pendingPax?.get('linkpath') ?? parsed.linkPath;
      const effectiveSizeText = pendingPax?.get('size');
      const effectiveSize = effectiveSizeText === undefined ? parsed.size : Number.parseInt(effectiveSizeText, 10);
      pendingPax = null;
      if (!Number.isSafeInteger(effectiveSize) || effectiveSize < 0) fail('ARCHIVE_FORMAT', `entry size for ${rawPath} is outside the safe numeric range`);

      const memberPath = normalizeMemberPath(rawPath, 'archive member');
      if (!isWithinRoot(memberPath, acceptedRoot)) fail('MEMBER_PATH', `${memberPath} is outside accepted root ${acceptedRoot}`);
      if (paths.has(memberPath)) fail('DUPLICATE_PATH', `duplicate archive member: ${memberPath}`);
      paths.add(memberPath);

      const typeNames = new Map([
        ['0', 'regular'],
        ['5', 'directory'],
        ['2', 'symlink'],
        ['1', 'hardlink'],
      ]);
      const type = typeNames.get(parsed.type);
      if (!type) fail('ENTRY_TYPE', `archive member ${memberPath} uses rejected tar type ${JSON.stringify(parsed.type)}`);
      if (type !== 'regular' && effectiveSize !== 0) fail('ENTRY_TYPE', `${type} ${memberPath} has a non-zero payload size`);
      if ((type === 'symlink' || type === 'hardlink') && rawLinkPath === '') fail('LINK_TARGET', `${type} ${memberPath} has an empty target`);
      if (type !== 'symlink' && type !== 'hardlink' && rawLinkPath !== '') fail('ENTRY_TYPE', `${type} ${memberPath} unexpectedly carries link metadata`);

      entries.push({ path: memberPath, type, linkPath: rawLinkPath });
      if (entries.length > MAX_ENTRIES) fail('ENTRY_LIMIT', `archive exceeds ${MAX_ENTRIES} entries`);
      await reader.skipExactly(effectiveSize, `payload for ${memberPath}`);
      await reader.skipExactly((BLOCK_SIZE - (effectiveSize % BLOCK_SIZE)) % BLOCK_SIZE, `padding for ${memberPath}`);
    }
  } finally {
    compressed.destroy();
    gunzip.destroy();
  }

  if (entries.length === 0) fail('ARCHIVE_FORMAT', 'archive contains no extractable entries');
  validateEntryGraph(entries, acceptedRoot);
  const symlinks = entries.filter((entry) => entry.type === 'symlink').length;
  const hardlinks = entries.filter((entry) => entry.type === 'hardlink').length;
  console.log(`VERIFY_TAR_ARCHIVE_PASS archive=${archivePath} root=${acceptedRoot} entries=${entries.length} symlinks=${symlinks} hardlinks=${hardlinks}`);
};

const [archivePath, acceptedRoot] = process.argv.slice(2);
if (!archivePath || !acceptedRoot || process.argv.length !== 4) {
  console.error('Usage: node scripts/verify_tar_archive.mjs <archive.tgz> <accepted-root>');
  process.exitCode = 2;
} else {
  verifyArchive(archivePath, acceptedRoot).catch((error) => {
    console.error(`VERIFY_TAR_ARCHIVE_FAIL ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
