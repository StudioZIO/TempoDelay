import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verifierPath = path.join(repositoryRoot, 'scripts', 'verify_vercel_config.mjs');
const EXPECTED_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com 'sha256-yEmoheAcAc1jIhLM0zddY4EcifLaLpUk4J9eKfWcjTM='",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net https://www.google.com",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://*.g.doubleclick.net https://www.google.com",
  "frame-src https://td.doubleclick.net https://www.googletagmanager.com",
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
    { src: '/contact', headers: { Location: 'https://studiozio.vercel.app/contact/' }, status: 308 },
    { handle: 'filesystem' },
    { handle: 'miss' },
    { src: '/(.*)', status: 404, dest: '/404.html' },
  ],
};

const fail = (detail) => {
  throw new Error(`[VERIFY_VERCEL_CONFIG_TEST] ${detail}`);
};

const runVerifier = (root) => spawnSync(process.execPath, [verifierPath, root], {
  cwd: repositoryRoot,
  encoding: 'utf8',
});

const output = (result) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

const writeConfig = async (root, config) => {
  await writeFile(path.join(root, 'config.json'), `${JSON.stringify(config, null, 2)}\n`, 'utf8');
};

const readConfig = async (root) => JSON.parse(await readFile(path.join(root, 'config.json'), 'utf8'));

const run = async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'studiozio-vercel-config-'));
  const validRoot = path.join(tempRoot, 'valid');
  await mkdir(path.join(validRoot, 'static'), { recursive: true });
  await writeConfig(validRoot, expectedConfig);

  const positive = runVerifier(validRoot);
  if (positive.status !== 0 || !output(positive).includes('VERIFY_VERCEL_CONFIG_PASS')) {
    fail(`valid config should pass: ${output(positive)}`);
  }
  console.log('FIXTURE_PASS name=exact_static_contract_with_headers expected=VERIFY_VERCEL_CONFIG_PASS');

  const fixtures = [
    {
      name: 'external_redirect',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes.push({ src: '/redirect', status: 308, headers: { Location: 'https://evil.invalid' } });
        await writeConfig(root, config);
      },
    },
    {
      name: 'external_rewrite',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[3].dest = 'https://evil.invalid/404.html';
        await writeConfig(root, config);
      },
    },
    {
      // The regression this whole routing change exists to prevent: the SPA
      // catch-all answering every invented URL with a 200 carrying the homepage.
      name: 'spa_catchall_restored',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[3] = { src: '/(.*)', dest: '/index.html' };
        await writeConfig(root, config);
      },
    },
    {
      // The one deliberate redirect must keep pointing at our own contact desk.
      name: 'contact_redirect_hijacked',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[0].headers.Location = 'https://evil.invalid/contact';
        await writeConfig(root, config);
      },
    },
    {
      name: 'unexpected_route',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes.push({ src: '/admin/(.*)', dest: '/index.html' });
        await writeConfig(root, config);
      },
    },
    {
      name: 'function_primitive',
      contract: 'VERCEL_OUTPUT_PRIMITIVES',
      mutate: async (root) => {
        await mkdir(path.join(root, 'functions'), { recursive: true });
      },
    },
    {
      name: 'middleware_route',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[2].middlewarePath = 'middleware.js';
        await writeConfig(root, config);
      },
    },
    {
      name: 'unexpected_top_level_key',
      contract: 'VERCEL_CONFIG_TOP_LEVEL',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.crons = [{ path: '/task', schedule: '* * * * *' }];
        await writeConfig(root, config);
      },
    },
    {
      name: 'filesystem_override',
      contract: 'VERCEL_CONFIG_TOP_LEVEL',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.overrides = { 'static/index.html': { path: 'alternate.html' } };
        await writeConfig(root, config);
      },
    },
    {
      name: 'unapproved_response_header',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[4].headers = { 'x-unapproved': 'true' };
        await writeConfig(root, config);
      },
    },
    {
      // The header route is a security contract, not decoration: silently
      // dropping a directive from it must fail exactly as loudly as adding a
      // rogue route.
      name: 'weakened_csp',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes[0].headers['content-security-policy'] =
          config.routes[0].headers['content-security-policy'].replace("; object-src 'none'", '');
        await writeConfig(root, config);
      },
    },
    {
      name: 'missing_security_header_route',
      contract: 'VERCEL_CONFIG_ROUTES',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.routes.shift();
        await writeConfig(root, config);
      },
    },
    {
      name: 'wrong_api_version',
      contract: 'VERCEL_CONFIG_VERSION',
      mutate: async (root) => {
        const config = await readConfig(root);
        config.version = 4;
        await writeConfig(root, config);
      },
    },
  ];

  try {
    for (const fixture of fixtures) {
      const fixtureRoot = path.join(tempRoot, fixture.name);
      await cp(validRoot, fixtureRoot, { recursive: true, dereference: false, verbatimSymlinks: true });
      await fixture.mutate(fixtureRoot);
      const result = runVerifier(fixtureRoot);
      if (result.status === 0) fail(`${fixture.name} unexpectedly passed`);
      if (!output(result).includes(`[${fixture.contract}]`)) {
        fail(`${fixture.name} failed for the wrong reason; expected [${fixture.contract}]: ${output(result)}`);
      }
      console.log(`FIXTURE_PASS name=${fixture.name} expected=${fixture.contract}`);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }

  console.log(`VERIFY_VERCEL_CONFIG_TEST_PASS positive=1 negative=${fixtures.length}`);
};

run().catch((error) => {
  console.error(`VERIFY_VERCEL_CONFIG_TEST_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
