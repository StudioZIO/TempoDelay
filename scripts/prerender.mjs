import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Injects the build-time render of the home route into dist/index.html.
 *
 * The site is a client-rendered SPA, so nothing painted until the bundle had
 * downloaded, parsed and run — first contentful paint sat at 2.3s on a
 * throttled mobile connection with a speed index of 4.2s. Shipping the home
 * markup in the document removes that wait entirely; the bundle still loads
 * and hydrates, so behaviour is unchanged.
 */
const distDirectory = process.argv[2] ?? 'dist';
const serverDirectory = process.argv[3] ?? 'dist-ssr';

const fail = (detail) => {
  console.error(`[prerender] ${detail}`);
  process.exit(1);
};

const indexPath = path.join(distDirectory, 'index.html');
const html = await readFile(indexPath, 'utf8');

const MOUNT = '<div id="root"></div>';
if (!html.includes(MOUNT)) {
  fail(`expected an empty ${MOUNT} to inject into; the document may already be prerendered`);
}

const { render } = await import(
  path.resolve(serverDirectory, 'entry-server.js')
).catch((error) => fail(`could not load the server bundle: ${error.message}`));

const markup = render();
if (typeof markup !== 'string' || markup.length === 0) {
  fail('the server render produced no markup');
}

// A prerendered document that still declares an empty mount point would
// hydrate against the wrong tree, so replace the whole element.
let document = html.replace(MOUNT, `<div id="root">${markup}</div>`);

// With the markup in the document, the stylesheet became the only thing
// standing between the response and the first paint: a separate request the
// browser has to finish before it will render anything. Inlining it removes
// that round trip. There is nothing to lose by doing so here — both routes are
// served from this one document, so no second page benefits from the
// stylesheet being separately cacheable.
const assetsDirectory = path.join(distDirectory, 'assets');
const styleSheets = (await readdir(assetsDirectory)).filter((name) => name.endsWith('.css'));
if (styleSheets.length !== 1) {
  fail(`expected exactly one built stylesheet to inline, found ${styleSheets.length}`);
}
const styleSheet = styleSheets[0];
const css = await readFile(path.join(assetsDirectory, styleSheet), 'utf8');

const linkPattern = new RegExp(`\\s*<link[^>]*href="/assets/${styleSheet.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i');
if (!linkPattern.test(document)) {
  fail(`could not find the stylesheet link for ${styleSheet} to replace`);
}
if (css.includes('</style')) {
  fail('the stylesheet contains a closing style tag and cannot be inlined safely');
}
document = document.replace(linkPattern, `\n    <style>${css}</style>`);

await writeFile(indexPath, document, 'utf8');
await rm(path.join(assetsDirectory, styleSheet), { force: true });
await rm(serverDirectory, { recursive: true, force: true });

console.log(`PRERENDER_OK route=/ markup=${markup.length}B css_inlined=${css.length}B`);
