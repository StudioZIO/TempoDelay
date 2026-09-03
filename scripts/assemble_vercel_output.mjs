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
/* The security headers, byte-identical to the `headers` block in vercel.json.
   They are stated twice because the two deploy paths read different files:
   production goes through the Vercel Git integration, which reads vercel.json
   and ignores this file entirely; preview goes through `vercel deploy
   --prebuilt`, which reads this file and ignores vercel.json. A header added to
   only one of them protects only half the estate. verify_vercel_config.mjs
   compares the two and fails if they drift.

   style-src carries 'unsafe-inline' because the prerender inlines the whole
   stylesheet into a <style> block and React server-renders six style attributes
   (the live meter and progress fills). script-src does NOT: the one inline
   script is Google's gtag bootstrap, pinned by its SHA-256, so the policy still
   refuses any inline script but that exact one. */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // The one inline script on the page is Google's gtag bootstrap. It is pinned
  // by hash rather than allowed with 'unsafe-inline', so the policy still
  // refuses every other inline script, including any an injection would add.
  "script-src 'self' https://www.googletagmanager.com 'sha256-hvBnSu/0T6os9VuaQ226TdI+jTfXgQvnA0usLIqgrpk='",
  // The prerender inlines the whole stylesheet into a <style> block, and React
  // server-renders six style attributes (the live meter and progress fills).
  // A hash cannot pin these: the CSS changes with every build.
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

const SECURITY_HEADERS = {
  'content-security-policy': CONTENT_SECURITY_POLICY,
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
};

const config = {
  version: 3,
  routes: [
    { src: '/(.*)', headers: SECURITY_HEADERS, continue: true },
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
