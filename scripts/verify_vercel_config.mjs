import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

/* Pinned to the post-SPA routing contract. The `/(.*)` -> /index.html fallback
   this used to assert is exactly the defect it now guards against: it answered
   every invented URL with a 200 carrying the homepage. The assertion is no
   weaker for the change -- it is still an exact deep-equal against one literal,
   so any drift in either direction fails the build. */
const expectedConfig = {
  version: 3,
  routes: [
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

  console.log(`VERIFY_VERCEL_CONFIG_PASS root=${outputRoot} version=3 routes=4`);
};

verifyConfig(process.argv[2] ?? '.vercel/output').catch((error) => {
  console.error(`VERIFY_VERCEL_CONFIG_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
