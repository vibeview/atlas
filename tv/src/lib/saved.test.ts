import { test } from 'node:test';
import assert from 'node:assert/strict';
import { savedReducer, SEED_SAVED } from './saved.ts';

test('toggle adds then removes', () => {
  const added = savedReducer([], { type: 'toggle', slug: 'kyoto' });
  assert.deepEqual(added, ['kyoto']);
  assert.deepEqual(savedReducer(added, { type: 'toggle', slug: 'kyoto' }), []);
});
test('toggle never duplicates', () => {
  let s = savedReducer(['porto'], { type: 'toggle', slug: 'kyoto' });
  s = savedReducer(s, { type: 'toggle', slug: 'kyoto' });
  s = savedReducer(s, { type: 'toggle', slug: 'kyoto' });
  assert.deepEqual(s, ['porto', 'kyoto']);
});
test('removing all seeded leaves []', () => {
  let s = [...SEED_SAVED];
  for (const slug of SEED_SAVED) s = savedReducer(s, { type: 'toggle', slug });
  assert.deepEqual(s, []);
});
test('reset returns SEED_SAVED', () => assert.deepEqual(savedReducer(['x'], { type: 'reset' }), SEED_SAVED));
test('SEED_SAVED holds three different slugs', () => {
  assert.equal(SEED_SAVED.length, 3);
  assert.equal(new Set(SEED_SAVED).size, 3);
});
