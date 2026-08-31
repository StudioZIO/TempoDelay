import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verifierPath = path.join(repositoryRoot, 'scripts', 'verify_tar_archive.mjs');

const fail = (detail) => {
  throw new Error(`[TAR_ARCHIVE_TEST] ${detail}`);
};

const writeString = (buffer, offset, length, value) => {
  const bytes = Buffer.from(value, 'utf8');
  if (bytes.length > length) fail(`fixture field exceeds ${length} bytes: ${value}`);
  bytes.copy(buffer, offset);
};

const writeOctal = (buffer, offset, length, value) => {
  const encoded = value.toString(8).padStart(length - 1, '0');
  if (encoded.length > length - 1) fail(`fixture numeric value exceeds ${length} bytes: ${value}`);
  buffer.write(encoded, offset, length - 1, 'ascii');
  buffer[offset + length - 1] = 0;
};

const tarHeader = ({ name, type = '0', linkname = '', size = 0 }) => {
  const header = Buffer.alloc(512);
  writeString(header, 0, 100, name);
  writeOctal(header, 100, 8, type === '5' ? 0o755 : 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, 0);
  header.fill(0x20, 148, 156);
  header.write(type, 156, 1, 'ascii');
  writeString(header, 157, 100, linkname);
  header.write('ustar\0', 257, 6, 'ascii');
  header.write('00', 263, 2, 'ascii');
  writeString(header, 265, 32, 'root');
  writeString(header, 297, 32, 'root');
  let checksum = 0;
  for (const byte of header) checksum += byte;
  const checksumText = checksum.toString(8).padStart(6, '0');
  header.write(checksumText, 148, 6, 'ascii');
  header[154] = 0;
  header[155] = 0x20;
  return header;
};

const paxRecord = (key, value) => {
  const suffix = ` ${key}=${value}\n`;
  let length = Buffer.byteLength(suffix) + 1;
  while (Buffer.byteLength(String(length)) + Buffer.byteLength(suffix) !== length) {
    length = Buffer.byteLength(String(length)) + Buffer.byteLength(suffix);
  }
  return `${length}${suffix}`;
};

const buildArchive = (entries) => {
  const blocks = [];
  for (const entry of entries) {
    const content = Buffer.isBuffer(entry.content) ? entry.content : Buffer.from(entry.content ?? '', 'utf8');
    blocks.push(tarHeader({ ...entry, size: content.length }));
    if (content.length > 0) {
      blocks.push(content);
      const padding = (512 - (content.length % 512)) % 512;
      if (padding) blocks.push(Buffer.alloc(padding));
    }
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks), { level: 9, mtime: 0 });
};

const baseDirectories = [
  { name: 'node_modules/', type: '5' },
  { name: 'node_modules/.bin/', type: '5' },
  { name: 'node_modules/vercel/', type: '5' },
  { name: 'node_modules/vercel/dist/', type: '5' },
];

const runVerifier = (archivePath, root = 'node_modules') => spawnSync(
  process.execPath,
  [verifierPath, archivePath, root],
  { encoding: 'utf8' },
);

const emitted = (result) => `${result.stdout ?? ''}${result.stderr ?? ''}`;

const main = async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'studiozio-tar-safety-'));
  let positiveCount = 0;
  let negativeCount = 0;

  const positive = async (name, entries, root = 'node_modules') => {
    const archivePath = path.join(temporaryRoot, `${name}.tgz`);
    await writeFile(archivePath, buildArchive(entries));
    const result = runVerifier(archivePath, root);
    if (result.status !== 0 || !emitted(result).includes('VERIFY_TAR_ARCHIVE_PASS')) {
      fail(`positive fixture ${name} failed: ${emitted(result)}`);
    }
    positiveCount += 1;
    console.log(`FIXTURE_PASS name=${name} expected=VERIFY_TAR_ARCHIVE_PASS`);
  };

  const negative = async (name, entries, contract, root = 'node_modules') => {
    const archivePath = path.join(temporaryRoot, `${name}.tgz`);
    await writeFile(archivePath, buildArchive(entries));
    const result = runVerifier(archivePath, root);
    if (result.status === 0 || !emitted(result).includes(`[${contract}]`)) {
      fail(`negative fixture ${name} did not fail with ${contract}: ${emitted(result)}`);
    }
    negativeCount += 1;
    console.log(`FIXTURE_PASS name=${name} expected=${contract}`);
  };

  try {
    await positive('regular_files_and_directories', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/index.js', content: 'export default true;\n' },
    ]);
    await positive('safe_internal_symlink', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/index.js', content: 'export default true;\n' },
      { name: 'node_modules/.bin/vercel', type: '2', linkname: '../vercel/dist/index.js' },
    ]);
    await positive('safe_internal_hardlink', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/index.js', content: 'export default true;\n' },
      { name: 'node_modules/vercel/dist/index-copy.js', type: '1', linkname: 'node_modules/vercel/dist/index.js' },
    ]);
    await positive('representative_node_modules_links', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/index.js', content: '#!/usr/bin/env node\n' },
      { name: 'node_modules/.bin/vercel', type: '2', linkname: '../vercel/dist/index.js' },
      { name: 'node_modules/vercel/dist/index-hardlink.js', type: '1', linkname: 'node_modules/vercel/dist/index.js' },
    ]);
    const longPath = `node_modules/${'nested-package-segment/'.repeat(6)}index.js`;
    const paxPayload = paxRecord('path', longPath);
    await positive('posix_pax_long_path', [
      { name: 'node_modules/', type: '5' },
      { name: 'PaxHeaders.0/index.js', type: 'x', content: paxPayload },
      { name: 'node_modules/placeholder.js', content: 'long path payload\n' },
    ]);
    await positive('build_output_regular_tree', [
      { name: '.vercel/output/', type: '5' },
      { name: '.vercel/output/static/', type: '5' },
      { name: '.vercel/output/config.json', content: '{"version":3}\n' },
      { name: '.vercel/output/static/index.html', content: '<!doctype html>\n' },
    ], '.vercel/output');

    await negative('member_parent_traversal', [
      ...baseDirectories,
      { name: '../outside.txt', content: 'bad' },
    ], 'MEMBER_PATH');
    await negative('absolute_member', [
      ...baseDirectories,
      { name: '/etc/passwd', content: 'bad' },
    ], 'MEMBER_PATH');
    await negative('symlink_parent_escape', [
      ...baseDirectories,
      { name: 'node_modules/.bin/bad', type: '2', linkname: '../../outside' },
    ], 'LINK_ESCAPE');
    await negative('symlink_absolute_target', [
      ...baseDirectories,
      { name: 'node_modules/.bin/bad', type: '2', linkname: '/etc/passwd' },
    ], 'LINK_ESCAPE');
    await negative('hardlink_parent_escape', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/bad', type: '1', linkname: '../../outside' },
    ], 'LINK_ESCAPE');
    await negative('hardlink_absolute_target', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/bad', type: '1', linkname: '/etc/passwd' },
    ], 'LINK_ESCAPE');
    await negative('eventual_link_chain_escape', [
      ...baseDirectories,
      { name: 'node_modules/.bin/first', type: '2', linkname: 'second' },
      { name: 'node_modules/.bin/second', type: '2', linkname: '../../outside' },
    ], 'LINK_ESCAPE');
    await negative('link_cycle', [
      ...baseDirectories,
      { name: 'node_modules/.bin/first', type: '2', linkname: 'second' },
      { name: 'node_modules/.bin/second', type: '2', linkname: 'first' },
    ], 'LINK_CYCLE');
    await negative('fifo_special_type', [
      ...baseDirectories,
      { name: 'node_modules/fifo', type: '6' },
    ], 'ENTRY_TYPE');
    await negative('character_device_type', [
      ...baseDirectories,
      { name: 'node_modules/character-device', type: '3' },
    ], 'ENTRY_TYPE');
    await negative('block_device_type', [
      ...baseDirectories,
      { name: 'node_modules/block-device', type: '4' },
    ], 'ENTRY_TYPE');
    await negative('unknown_tar_type', [
      ...baseDirectories,
      { name: 'node_modules/unknown', type: '7' },
    ], 'ENTRY_TYPE');
    await negative('empty_link_target', [
      ...baseDirectories,
      { name: 'node_modules/.bin/bad', type: '2', linkname: '' },
    ], 'LINK_TARGET');
    await negative('parent_symlink_nested_write', [
      ...baseDirectories,
      { name: 'node_modules/target/', type: '5' },
      { name: 'node_modules/redirect', type: '2', linkname: 'target' },
      { name: 'node_modules/redirect/payload.js', content: 'bad write' },
    ], 'PARENT_LINK');
    await negative('duplicate_member_overwrite', [
      ...baseDirectories,
      { name: 'node_modules/vercel/dist/index.js', content: 'first' },
      { name: 'node_modules/vercel/dist/index.js', content: 'second' },
    ], 'DUPLICATE_PATH');

    console.log(`VERIFY_TAR_ARCHIVE_TEST_PASS positive=${positiveCount} negative=${negativeCount}`);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(`VERIFY_TAR_ARCHIVE_TEST_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
