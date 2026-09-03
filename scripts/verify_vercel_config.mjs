import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

/* Pinned to the post-SPA routing contract, and to the security headers.

   The header literal below is an INDEPENDENT copy of the one in
   assemble_vercel_output.mjs -- that is the point. The assembler is the
   implementation and this file is the specification, so a deep-equal between
   them is a real assertion. Both are also compared against vercel.json, which
   is what production actually reads; see verifyProductionHeaderParity below. The `/(.*)` -> /index.html fallback
   this used to assert is exactly the defect it now guards against: it answered
   every invented URL with a 200 carrying the homepage. The assertion is no
   weaker for the change -- it is still an exact deep-equal against one literal,
   so any drift in either direction fails the build. */
const EXPECTED_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com 'sha256-hvBnSu/0T6os9VuaQ226TdI+jTfXgQvnA0usLIqgrpk='",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const EXPECTED_SECURITY_HEADERS = {
  'content-security-policy': EXPECTED_CONTENT_SECURITY_POLICY,
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
};

const expectedConfig = {
  version: 3,
  routes: [
    { src: '/(.*)', headers: EXPECTED_SECURITY_HEADERS, continue: true },
    { src: '/contact', headers: { Location: 'https://studiozio.vercel.app/contact' }, status: 308 },
    { handle: 'filesystem' },
    { handle: 'miss' },
    { src: '/(.*)', status: 404, dest: '/404.html' },
  ],
};

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

const sortedKeys = (value) => Object.keys(value).sort();

const verifyRegularEntry = async (entryPath, kind, contract) => {
  let metadata;
  try {
    metadata = await lstat(entryPath);
  } catch {
    fail(contract, `missing required ${kind}: ${entryPath}`);
  }
  if (metadata.isSymbolicLink()) fail(contract, `symbolic links are not permitted: ${entryPath}`);
  if (kind === 'file' && !metadata.isFile()) fail(contract, `expected a regular file: ${entryPath}`);
  if (kind === 'directory' && !metadata.isDirectory()) fail(contract, `expected a regular directory: ${entryPath}`);
};

const verifyConfig = async (requestedRoot) => {
  const outputRoot = path.resolve(requestedRoot);
  await verifyRegularEntry(outputRoot, 'directory', 'VERCEL_OUTPUT_PRIMITIVES');

  const entries = (await readdir(outputRoot)).sort();
  const expectedEntries = ['config.json', 'static'];
  if (JSON.stringify(entries) !== JSON.stringify(expectedEntries)) {
    fail(
      'VERCEL_OUTPUT_PRIMITIVES',
      `only config.json and static are permitted at the Build Output API root; found ${entries.join(', ') || 'nothing'}`,
    );
  }

  const configPath = path.join(outputRoot, 'config.json');
  const staticPath = path.join(outputRoot, 'static');
  await verifyRegularEntry(configPath, 'file', 'VERCEL_OUTPUT_PRIMITIVES');
  await verifyRegularEntry(staticPath, 'directory', 'VERCEL_OUTPUT_PRIMITIVES');

  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf8'));
  } catch (error) {
    fail('VERCEL_CONFIG_PARSE', `config.json must be valid JSON: ${error.message}`);
  }

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    fail('VERCEL_CONFIG_TOP_LEVEL', 'config.json must be an object');
  }
  const keys = sortedKeys(config);
  const expectedKeys = sortedKeys(expectedConfig);
  if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) {
    fail('VERCEL_CONFIG_TOP_LEVEL', `expected only routes and version; found ${keys.join(', ') || 'no keys'}`);
  }
  if (config.version !== 3) {
    fail('VERCEL_CONFIG_VERSION', `Build Output API version must be exactly 3; found ${JSON.stringify(config.version)}`);
  }
  if (JSON.stringify(config.routes) !== JSON.stringify(expectedConfig.routes)) {
    fail(
      'VERCEL_CONFIG_ROUTES',
      'routes must be exactly: the /contact permanent redirect, filesystem handling, miss handling, then the 404 terminator',
    );
  }

  await verifyProductionHeaderParity();

  console.log(`VERIFY_VERCEL_CONFIG_PASS root=${outputRoot} version=3 routes=${expectedConfig.routes.length} headers=${Object.keys(EXPECTED_SECURITY_HEADERS).length}`);
};

/* Production and preview read different files. This config governs preview
   only; www.tempodelay.tech is served by the Vercel Git integration, which
   reads vercel.json and never sees this file. Two files, one policy -- so the
   two are compared here rather than trusted to stay in step by hand. */
const verifyProductionHeaderParity = async () => {
  const manifestPath = path.join(process.cwd(), 'vercel.json');
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    fail('VERCEL_PRODUCTION_HEADERS', `vercel.json must be readable JSON: ${error.message}`);
  }

  const block = (manifest.headers ?? []).find((entry) => entry.source === '/(.*)');
  if (!block) {
    fail('VERCEL_PRODUCTION_HEADERS', 'vercel.json must set headers for /(.*); production would ship bare');
  }

  const served = new Map(block.headers.map((h) => [h.key.toLowerCase(), h.value]));
  for (const [key, value] of Object.entries(EXPECTED_SECURITY_HEADERS)) {
    if (!served.has(key)) {
      fail('VERCEL_PRODUCTION_HEADERS', `vercel.json is missing ${key}; preview would be protected and production would not`);
    }
    if (served.get(key) !== value) {
      fail(
        'VERCEL_PRODUCTION_HEADERS',
        `${key} differs between vercel.json and the Build Output config, so production and preview would enforce different policies`,
      );
    }
  }
  if (served.size !== Object.keys(EXPECTED_SECURITY_HEADERS).length) {
    fail('VERCEL_PRODUCTION_HEADERS', `vercel.json sets headers this contract does not know about: ${[...served.keys()].join(', ')}`);
  }
};

verifyConfig(process.argv[2] ?? '.vercel/output').catch((error) => {
  console.error(`VERIFY_VERCEL_CONFIG_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
