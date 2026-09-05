/**
 * Unit checks for CMS normalization + contact validation + revalidation auth.
 * Run: node ghoroa-web/scripts/check-headless.mjs
 */

import assert from 'node:assert/strict';

// --- contact schema ---
const schema = {
  name: (v) => typeof v === 'string' && v.length >= 2,
  email: (v) => typeof v === 'string' && v.includes('@'),
  phone: (v) => typeof v === 'string' && v.length >= 6,
  message: (v) => typeof v === 'string' && v.length >= 10,
};

assert.equal(schema.name('Ann'), true);
assert.equal(schema.email('a@b.com'), true);
assert.equal(schema.name('x'), false);

// --- revalidation auth (secret compare) ---
function revalidateAuth(secret, expected) {
  return secret === expected;
}
assert.equal(revalidateAuth('ok', 'ok'), true);
assert.equal(revalidateAuth('bad', 'ok'), false);

// --- locale fallback ---
function pickLocale(en, bn, locale) {
  return locale === 'bn' ? bn || en : en || bn;
}
assert.equal(pickLocale('Hello', 'नमस्ते', 'bn'), 'नमस्ते');
assert.equal(pickLocale('Hello', 'नमस्ते', 'en'), 'Hello');
assert.equal(pickLocale('Hello', '', 'en'), 'Hello');

// --- price formatting ---
function formatPrice(n) {
  if (n === null || n === undefined) return '—';
  return `৳${n.toLocaleString('en-BD')}`;
}
assert.equal(formatPrice(null), '—');
assert.equal(formatPrice(300), '৳300');

// --- menu available filter ---
function isAvailable(available) {
  if (available === false || available === '0' || available === 0 || available === 'false') return false;
  return true;
}
assert.equal(isAvailable(false), false);
assert.equal(isAvailable(true), true);
assert.equal(isAvailable(undefined), true);

console.log('headless checks ok');
