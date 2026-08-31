import { readFile } from 'node:fs/promises';
import path from 'node:path';

const workflowPath = path.resolve('.github/workflows/deploy.yml');

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

const count = (text, expression) => [...text.matchAll(expression)].length;

const verify = async () => {
  const workflow = await readFile(workflowPath, 'utf8');

  if (!/^on:\s*\n\s+workflow_dispatch:\s*$/m.test(workflow)) {
    fail('PREVIEW_TRIGGER', 'deployment workflow must be manual workflow_dispatch only');
  }
  const prohibitedProductionTokens = [
    /--prod(?:\s|$)/m,
    /--environment[= ]production\b/i,
    /--target[= ]production\b/i,
    /\bvercel\s+(?:alias|promote)\b/i,
    /^\s+(?:push|pull_request):/m,
  ];
  for (const expression of prohibitedProductionTokens) {
    if (expression.test(workflow)) fail('NO_PRODUCTION_PATH', `prohibited production behavior matches ${expression}`);
  }

  if (count(workflow, /\bvercel"?\s+pull\s+--yes\s+--environment=preview\s+--token="\$VERCEL_TOKEN"/g) !== 1) {
    fail('PREVIEW_PULL', 'expected exactly one preview-only vercel pull command');
  }
  if (count(workflow, /\bvercel"?\s+deploy\s+--prebuilt\s+--target=preview\s+--yes\s+--token="\$VERCEL_TOKEN"/g) !== 1) {
    fail('PREVIEW_DEPLOY', 'expected exactly one preview-only prebuilt deploy command');
  }
  if (/--skip-domain/.test(workflow)) {
    fail('NO_PRODUCTION_PATH', '--skip-domain is production-only in the pinned Vercel CLI and must not appear in preview deployment');
  }
  if (/\bvercel"?\s+build\b/.test(workflow)) {
    fail('SINGLE_BUILD', 'vercel build is prohibited because the application has one authoritative Vite build');
  }

  if (count(workflow, /VERCEL_TOKEN:\s*\$\{\{\s*secrets\.VERCEL_TOKEN\s*\}\}/g) !== 2) {
    fail('TOKEN_BOUNDARY', 'the Vercel token must be injected exactly twice');
  }
  if (count(workflow, /--token="\$VERCEL_TOKEN"/g) !== 2) {
    fail('TOKEN_BOUNDARY', 'the Vercel token may be consumed only by preview pull and preview deploy');
  }

  const appBuildStart = workflow.indexOf('  build-preview-artifact:');
  const deployStart = workflow.indexOf('  deploy-preview:');
  if (appBuildStart < 0 || deployStart < 0 || deployStart <= appBuildStart) {
    fail('WORKFLOW_TOPOLOGY', 'missing build-preview-artifact or deploy-preview job');
  }
  const appBuildJob = workflow.slice(appBuildStart, deployStart);
  if (/secrets\.VERCEL_TOKEN|--token=|VERCEL_ORG_ID|VERCEL_PROJECT_ID/.test(appBuildJob)) {
    fail('TOKEN_BOUNDARY', 'application build job contains Vercel credentials or project identity');
  }

  const deployJob = workflow.slice(deployStart);
  if (/actions\/checkout@/.test(deployJob)) fail('DEPLOY_ISOLATION', 'deploy job must not check out application source');
  if (/\bnpm\s+(?:ci|install|run)\b/.test(deployJob)) fail('DEPLOY_ISOLATION', 'deploy job must not install or run application dependencies');
  if (count(workflow, /uses:\s+[^\s]+@[0-9a-f]{40}\s*$/gm) !== count(workflow, /^\s*uses:\s+/gm)) {
    fail('ACTION_PINNING', 'every GitHub Action must be pinned to a full commit SHA');
  }
  if (count(workflow, /sha256sum vercel-cli-node-modules\.tgz >/g) !== 1) {
    fail('CLI_INTEGRITY', 'the isolated CLI capsule must receive exactly one SHA-256 digest');
  }
  if (count(workflow, /sha256sum --check vercel-cli-node-modules\.tgz\.sha256/g) !== 2) {
    fail('CLI_INTEGRITY', 'both credential-bearing jobs must verify the transferred CLI digest before use');
  }
  if (count(workflow, /sha256sum vercel-prebuilt-output\.tgz >/g) !== 1
    || count(workflow, /sha256sum --check vercel-prebuilt-output\.tgz\.sha256/g) !== 1) {
    fail('ARTIFACT_INTEGRITY', 'the prebuilt output must be digested once and verified once before deployment');
  }
  if (count(workflow, /sha256sum verify_tar_archive\.mjs >/g) !== 1
    || count(workflow, /sha256sum --check verify_tar_archive\.mjs\.sha256/g) !== 2) {
    fail('ARCHIVE_VERIFIER_INTEGRITY', 'the archive verifier must be digested once and verified by both credential-bearing consumers');
  }
  const archiveSafetyCommands = [
    {
      verify: 'node .tooling-capsule/verify_tar_archive.mjs .tooling-capsule/vercel-cli-node-modules.tgz node_modules',
      extract: 'tar -xzf .tooling-capsule/vercel-cli-node-modules.tgz -C .preview-tooling',
    },
    {
      verify: 'node .cli-artifact/verify_tar_archive.mjs .cli-artifact/vercel-cli-node-modules.tgz node_modules',
      extract: 'tar -xzf .cli-artifact/vercel-cli-node-modules.tgz -C .deployment-tools',
    },
    {
      verify: 'node .cli-artifact/verify_tar_archive.mjs .prebuilt-artifact/vercel-prebuilt-output.tgz .vercel/output',
      extract: 'tar -xzf .prebuilt-artifact/vercel-prebuilt-output.tgz -C .',
    },
  ];
  for (const { verify: verifyCommand, extract } of archiveSafetyCommands) {
    const verifyIndex = workflow.indexOf(verifyCommand);
    const extractIndex = workflow.indexOf(extract);
    if (verifyIndex < 0 || extractIndex < 0 || verifyIndex >= extractIndex) {
      fail('ARCHIVE_EXTRACTION_ORDER', `archive verification must precede extraction: ${extract}`);
    }
  }
  if (/tar\s+-tzf\b/.test(workflow)) {
    fail('ARCHIVE_METADATA', 'string-only tar member listing must not substitute for metadata and link validation');
  }
  if (!workflow.includes('npm ci --ignore-scripts')) {
    fail('CLI_INTEGRITY', 'the isolated tooling install must disable all package lifecycle scripts');
  }
  if (!workflow.includes('tar --format=posix --sort=name')) {
    fail('ARTIFACT_INTEGRITY', 'artifacts must be constructed with deterministic archive metadata');
  }

  console.log('VERIFY_PREVIEW_WORKFLOW_PASS trigger=manual token_steps=2 app_builds=1 production_paths=0');
};

verify().catch((error) => {
  console.error(`VERIFY_PREVIEW_WORKFLOW_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
