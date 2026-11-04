// The Roku channel uses the tv/ app's element ids (spec "Element ids"), so a
// test recorded on Apple TV can find the same elements on Roku.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (dir, ext) =>
  readdirSync(join(repo, dir), { recursive: true })
    .filter((f) => f.endsWith(ext))
    .map((f) => readFileSync(join(repo, dir, f), 'utf8'))
    .join('\n');

test('fixed ids match the tv app', () => {
  const tv = read('tv/src', '.tsx');
  const roku = read('roku/components', '.xml') + read('roku/components', '.brs');
  for (const id of ['nav-home', 'nav-search', 'nav-saved', 'btn-plan-trip', 'btn-save', 'search-field']) {
    assert.ok(tv.includes(`'${id}'`) || tv.includes(`"${id}"`), `${id} not in tv/`);
    assert.ok(roku.includes(`"${id}"`), `${id} not in roku/`);
  }
});

test('tile id prefixes match the tv app', () => {
  const roku = read('roku/components', '.xml') + read('roku/components', '.brs');
  for (const prefix of ['tile', 'search-tile', 'saved-tile']) assert.ok(roku.includes(`"${prefix}"`), prefix);
  assert.match(read('roku/components', '.brs'), /m\.top\.id = m\.top\.prefix \+ "-" \+ d\.slug/);
});
