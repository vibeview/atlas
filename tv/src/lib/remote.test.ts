import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isPress } from './remote.ts';

test('remote presses end the settle window', () => {
  for (const t of ['up', 'down', 'left', 'right', 'select']) assert.equal(isPress(t), true, t);
});

test('focus events from the TV event handler do not', () => {
  for (const t of ['focus', 'blur', 'pan', undefined]) assert.equal(isPress(t), false, String(t));
});
