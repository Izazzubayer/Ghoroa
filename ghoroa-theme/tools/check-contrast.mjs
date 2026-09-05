/**
 * Contrast guard for the forest / terracotta-red accent palette.
 *
 * Run: node ghoroa-theme/tools/check-contrast.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const theme = JSON.parse(readFileSync(join(here, '..', 'theme.json'), 'utf8'));

const palette = Object.fromEntries(
  theme.settings.color.palette.map(({ slug, color }) => [slug, color]),
);

const luminance = (hex) => {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)
    .map((pair) => {
      const channel = parseInt(pair, 16) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const over = (fg, bg, alpha) =>
  '#' +
  [0, 2, 4]
    .map((i) => {
      const f = parseInt(fg.slice(1 + i, 3 + i), 16);
      const b = parseInt(bg.slice(1 + i, 3 + i), 16);
      return Math.round(f * alpha + b * (1 - alpha)).toString(16).padStart(2, '0');
    })
    .join('');

const t = {
  dark: palette.dark,
  forest: palette.forest,
  forestDeep: palette['forest-deep'],
  gold: palette.gold,
  goldDeep: palette['gold-deep'],
  cream: palette.cream,
  parchment: palette.parchment,
  terracotta: palette.terracotta,
  terracottaDeep: palette['terracotta-deep'],
  muted: palette.muted,
  ink: palette.ink,
};

const PAIRS = [
  ['accent on dark', t.gold, t.dark, 4.5],
  ['accent-deep on dark', t.goldDeep, t.dark, 4.5],
  ['accent on forest', t.gold, t.forest, 4.5],
  ['cream on dark', t.cream, t.dark, 4.5],
  ['cream on forest-deep', t.cream, t.forestDeep, 4.5],
  ['cream/70 on dark (menu notes)', over(t.cream, t.dark, 0.7), t.dark, 4.5],
  ['cream/60 on dark (copyright)', over(t.cream, t.dark, 0.6), t.dark, 4.5],
  ['terracotta on parchment', t.terracotta, t.parchment, 4.5],
  ['muted on parchment', t.muted, t.parchment, 4.5],
  ['ink on parchment', t.ink, t.parchment, 4.5],
  ['cream on forest (button)', t.cream, t.forest, 4.5],
  ['cream on terracotta (CTA)', t.cream, t.terracotta, 4.5],
  ['cream on terracotta-deep (CTA hover)', t.cream, t.terracottaDeep, 4.5],
  ['accent on forest-deep (footer links)', t.gold, t.forestDeep, 4.5],
];

/* Must stay *below* AA — do not use these as text on dark without a brighter token. */
const FORBIDDEN = [
  ['accent/70 on dark (use full accent)', over(t.gold, t.dark, 0.7), t.dark, 4.5],
  ['accent-deep/70 on dark', over(t.goldDeep, t.dark, 0.7), t.dark, 4.5],
];

let failed = 0;

console.log('Contrast (WCAG AA)\n');

for (const [label, fg, bg, min] of PAIRS) {
  const value = ratio(fg, bg);
  const ok = value >= min;
  if (!ok) failed += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${value.toFixed(2)}:1 (min ${min})  ${label}`);
}

console.log('\nForbidden pairs (must stay under AA — faded accents)\n');
for (const [label, fg, bg, min] of FORBIDDEN) {
  const value = ratio(fg, bg);
  const ok = value < min;
  if (!ok) failed += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${value.toFixed(2)}:1 (must be < ${min})  ${label}`);
}

console.log(
  failed === 0
    ? '\nAll contrast pairs pass.\n'
    : `\n${failed} pair(s) below the minimum.\n`,
);

process.exit(failed === 0 ? 0 : 1);
