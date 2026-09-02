import { cp, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(repositoryRoot, 'dist');
const vercelRoot = path.join(repositoryRoot, '.vercel');
const outputRoot = path.join(vercelRoot, 'output');
const staticRoot = path.join(outputRoot, 'static');

/* One document, one route -- and every other path is a real 404.
   The old `/(.*)` -> /index.html fallback existed for the client-side router,
   which was retired with the contact page. Left in place it answered every
   invented URL with a 200 carrying the homepage: a soft-404 for crawlers and an
   unbounded duplicate-URL space with no canonical to consolidate it.
   `/contact` is the one path that still means something, so it gets a
   permanent redirect to the desk that replaced it rather than a 404. */
const config = {
  version: 3,
  routes: [
    { src: '/contact', headers: { Location: 'https://studiozio.vercel.app/contact' }, status: 308 },
    { handle: 'filesystem' },
    { handle: 'miss' },
    { src: '/(.*)', status: 404, dest: '/404.html' },
  ],
};

const fail = (detail) => {
  throw new Error(`[VERCEL_ASSEMBLY] ${detail}`);
};

const assertRegularDirectory = async (directory, label) => {
  let metadata;
  try {
    metadata = await lstat(directory);
  } catch {
    fail(`${label} does not exist: ${directory}`);
  }
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    fail(`${label} must be a regular directory: ${directory}`);
  }
};

const assemble = async () => {
  await assertRegularDirectory(distRoot, 'verified dist root');

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(staticRoot, { recursive: true });
  await cp(distRoot, staticRoot, {
    recursive: true,
    dereference: false,
    preserveTimestamps: true,
    verbatimSymlinks: true,
  });
  await writeFile(path.join(outputRoot, 'config.json'), `${JSON.stringify(config, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
  });

  const writtenConfig = JSON.parse(await readFile(path.join(outputRoot, 'config.json'), 'utf8'));
  if (JSON.stringify(writtenConfig) !== JSON.stringify(config)) {
    fail('written Build Output API configuration does not match the assembly contract');
  }

  console.log(`VERCEL_ASSEMBLY_PASS output=${outputRoot}`);
};

assemble().catch((error) => {
  console.error(`VERCEL_ASSEMBLY_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
