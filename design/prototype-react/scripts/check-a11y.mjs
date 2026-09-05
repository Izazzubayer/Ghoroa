// Guards the two things that silently broke this page before:
//   1. palette pairs that fall under WCAG AA
//   2. numerals styled with the display face (Rottering ships no digit glyphs)
// Run: npm run check
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import assert from 'node:assert/strict'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const relLum = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
const contrast = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
/** Flatten `fg` at `alpha` over opaque `bg` — Tailwind's /NN opacity utilities. */
const over = (fg, bg, alpha) =>
  '#' +
  [0, 2, 4]
    .map((i) => {
      const f = parseInt(fg.slice(1 + i, 3 + i), 16)
      const b = parseInt(bg.slice(1 + i, 3 + i), 16)
      return Math.round(f * alpha + b * (1 - alpha)).toString(16).padStart(2, '0')
    })
    .join('')

const t = {
  dark: '#080d09',
  forest: '#062e1b',
  forestDeep: '#0d2016',
  gold: '#ecb174',
  goldDeep: '#c5a059',
  cream: '#e8dac6',
  parchment: '#f2e9da',
  terracotta: '#a13828',
  muted: '#55523f',
}

// [label, foreground, background, minimum] — 4.5 for body copy, 3.0 for large display text.
const PAIRS = [
  ['gold on dark', t.gold, t.dark, 4.5],
  ['gold-deep on dark (eyebrow)', t.goldDeep, t.dark, 4.5],
  ['gold on forest', t.gold, t.forest, 4.5],
  ['gold-deep on forest-deep', t.goldDeep, t.forestDeep, 4.5],
  ['cream on dark', t.cream, t.dark, 4.5],
  ['cream/70 on dark (menu notes)', over(t.cream, t.dark, 0.7), t.dark, 4.5],
  ['cream/60 on dark (copyright)', over(t.cream, t.dark, 0.6), t.dark, 4.5],
  ['gold/70 on dark (bengali names)', over(t.gold, t.dark, 0.7), t.dark, 4.5],
  // FAQ accordion panels sit on forest-deep flattened over dark.
  ['cream/80 on accordion panel', over(t.cream, over(t.forestDeep, t.dark, 0.8), 0.8), over(t.forestDeep, t.dark, 0.8), 4.5],
  ['gold on accordion header', t.gold, over(t.forestDeep, t.dark, 0.8), 4.5],
  ['cream on accordion header (closed)', t.cream, over(t.forestDeep, t.dark, 0.4), 4.5],
  ['terracotta on parchment', t.terracotta, t.parchment, 4.5],
  ['muted on parchment (body)', t.muted, t.parchment, 4.5],
  ['forest on parchment', t.forest, t.parchment, 4.5],
  ['cream on forest (solid button)', t.cream, t.forest, 4.5],
  ['forest on gold (button hover)', t.forest, t.gold, 4.5],
]

let failures = 0
for (const [label, fg, bg, min] of PAIRS) {
  const ratio = contrast(fg, bg)
  const ok = ratio >= min
  if (!ok) failures++
  console.log(`${ok ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  ${label}`)
}
assert.equal(failures, 0, `${failures} colour pair(s) below WCAG AA`)

// Rottering has no 0/2-9 glyphs, so any digit rendered in `.display` turns to tofu.
const NUMERIC = [
  ['src/components/Story.tsx', '{s.value}'],
  ['src/components/Signatures.tsx', '{item.price}'],
]
for (const [file, needle] of NUMERIC) {
  const line = readFileSync(join(root, file), 'utf8')
    .split('\n')
    .find((l) => l.includes(needle))
  assert.ok(line, `${file}: expected a line rendering ${needle}`)
  assert.ok(
    !/\bdisplay\b/.test(line),
    `${file}: numerals must not use the display font — Rottering has no digit glyphs\n  ${line.trim()}`,
  )
  console.log(`pass  numerals off display face  ${file}`)
}

console.log('\nAll accessibility checks passed.')
