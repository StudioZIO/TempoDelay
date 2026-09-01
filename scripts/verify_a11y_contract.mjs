import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = process.argv[2] ?? 'dist';

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

const countMatches = (text, expression) => [...text.matchAll(expression)].length;

const assetNames = await readdir(path.join(distDirectory, 'assets'));
const scriptName = assetNames.find((name) => /^index-.+\.js$/.test(name));
const styleName = assetNames.find((name) => /^index-.+\.css$/.test(name));
if (!scriptName || !styleName) {
  fail('A11Y_CONTRACT', `fingerprinted bundle assets not found in ${distDirectory}/assets`);
}

const script = await readFile(path.join(distDirectory, 'assets', scriptName), 'utf8');
const style = await readFile(path.join(distDirectory, 'assets', styleName), 'utf8');

const requiredScriptLiterals = [
  ['Tempo in BPM', 'tempo range input must keep its accessible name'],
  ['Left delay division', 'left division select must keep its accessible name'],
  ['Right delay division', 'right division select must keep its accessible name'],
  ['Search 32 parameters', 'parameter search field must keep its accessible name'],
  ['StudioZIO properties', 'the four-link navigation must keep its accessible name'],
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
