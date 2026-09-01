import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = process.argv[2] ?? 'dist';

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

const countMatches = (text, expression) => [...text.matchAll(expression)].length;

const assetNames = await readdir(path.join(distDirectory, 'assets'));
const scriptName = assetNames.find((name) => /^index-.+\.js$/.test(name));
if (!scriptName) {
  fail('A11Y_CONTRACT', `fingerprinted bundle script not found in ${distDirectory}/assets`);
}

const script = await readFile(path.join(distDirectory, 'assets', scriptName), 'utf8');

// The build inlines the stylesheet into the document so the first paint does
// not wait on a second request, so the CSS to check lives there, not in a file.
const document = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
const styleMatch = document.match(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/i);
if (!styleMatch) {
  fail('A11Y_CONTRACT', `no inline stylesheet found in ${distDirectory}/index.html`);
}
const style = styleMatch[1];

const requiredScriptLiterals = [
  ['Tempo in BPM', 'tempo range input must keep its accessible name'],
  ['Left delay division', 'left division select must keep its accessible name'],
  ['Right delay division', 'right division select must keep its accessible name'],
  ['Search 32 parameters', 'parameter search field must keep its accessible name'],
  ['StudioZIO properties', 'the four-link navigation must keep its accessible name'],
  ['StudioZIO properties, compact menu', 'the compact navigation must keep its accessible name'],
  ['aria-pressed', 'toggle controls must keep aria-pressed state'],
];

for (const [literal, reason] of requiredScriptLiterals) {
  if (!script.includes(literal)) {
    fail('A11Y_CONTRACT', `bundle is missing "${literal}": ${reason}`);
  }
}

const overviewIdCount = countMatches(script, /id:\s*[`"']overview[`"']/g);
if (overviewIdCount !== 1) {
  fail('A11Y_CONTRACT', `expected exactly one id:"overview" section, found ${overviewIdCount}`);
}

if (!style.includes('prefers-reduced-motion')) {
  fail('A11Y_CONTRACT', 'stylesheet must keep the prefers-reduced-motion block');
}

if (!style.includes('heroSweep')) {
  fail('A11Y_CONTRACT', 'stylesheet must keep the CSS-driven hero sweep animation');
}

console.log('[A11Y_CONTRACT] built bundle satisfies the accessibility contract');
