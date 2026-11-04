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

import { returnTarget } from './saved.ts';

test('return target is the opened place while it is still saved', () =>
  assert.equal(returnTarget(['a', 'b', 'c'], 'b', 1), 'b'));
test('return target is the neighbour that took its place after an unsave', () =>
  assert.equal(returnTarget(['a', 'c'], 'b', 1), 'c'));
test('return target is the new last place when the last one was unsaved', () =>
  assert.equal(returnTarget(['a', 'b'], 'c', 2), 'b'));
test('return target is null when Saved is now empty', () => assert.equal(returnTarget([], 'a', 0), null));
