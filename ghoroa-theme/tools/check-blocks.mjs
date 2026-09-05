/**
 * Structural check for hand-written block markup.
 *
 * Templates, parts and patterns are authored by hand rather than exported from the
 * Site Editor, and WordPress fails quietly on malformed block comments: it drops the
 * block and shows a blank region. These two mistakes cause almost all of it.
 *
 *   1. Unbalanced or mismatched `<!-- wp:x -->` / `<!-- /wp:x -->` pairs.
 *   2. A block comment nested inside a text element such as <p> or <h2>.
 *
 * Run: node ghoroa-theme/tools/check-blocks.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join } from 'node:path';

const themeDir = join(dirname(fileURLToPath(import.meta.url)), '..');

const files = ['templates', 'parts', 'patterns'].flatMap((folder) => {
  const dir = join(themeDir, folder);
  return readdirSync(dir)
    .filter((name) => ['.html', '.php'].includes(extname(name)))
    .map((name) => ({ label: `${folder}/${name}`, path: join(dir, name) }));
});

const BLOCK = /<!--\s*(\/?)wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)([\s\S]*?)(\/?)-->/g;
const NESTED = /<(p|h[1-6]|span|a|li|figcaption)\b[^>]*>[^<]*<!--\s*wp:/g;

let problems = 0;

for (const { label, path } of files) {
  const source = readFileSync(path, 'utf8');
  const errors = [];
  const stack = [];

  for (const [, closing, name, , selfClosing] of source.matchAll(BLOCK)) {
    if (selfClosing === '/') continue;

    if (closing === '/') {
      if (stack.length === 0) {
        errors.push(`closing wp:${name} with nothing open`);
      } else if (stack.at(-1) !== name) {
        errors.push(`closing wp:${name} but wp:${stack.at(-1)} is open`);
      } else {
        stack.pop();
      }
    } else {
      stack.push(name);
    }
  }

  if (stack.length > 0) {
    errors.push(`never closed: ${stack.map((n) => `wp:${n}`).join(', ')}`);
  }

  for (const [, tag] of source.matchAll(NESTED)) {
    errors.push(`block comment nested inside <${tag}> — WordPress will drop it`);
  }

  if (errors.length > 0) {
    problems += errors.length;
    console.log(`  FAIL  ${label}`);
    for (const error of errors) console.log(`        ${error}`);
  } else {
    console.log(`  ok    ${label}`);
  }
}

console.log(
  problems === 0
    ? `\nAll ${files.length} files have valid block markup.\n`
    : `\n${problems} problem(s) found.\n`,
);

process.exit(problems === 0 ? 0 : 1);
