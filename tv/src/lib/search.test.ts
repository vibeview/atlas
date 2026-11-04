import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchDestinations } from './search.ts';

const all = [
  { slug: 'kyoto', name: 'Kyoto', country: 'Japan' },
  { slug: 'hoi-an', name: 'Hội An', country: 'Vietnam' },
  { slug: 'porto', name: 'Porto', country: 'Portugal' },
  { slug: 'bali', name: 'Bali', country: 'Indonesia' },
];
const slugs = (q: string) => searchDestinations(all, q).map((d) => d.slug);

test('kyo matches Kyoto', () => assert.deepEqual(slugs('kyo'), ['kyoto']));
test('hoi an matches Hội An without accents', () => assert.deepEqual(slugs('hoi an'), ['hoi-an']));
test('matching is case-insensitive', () => assert.deepEqual(slugs('PORTO'), ['porto']));
test('matches the country too, in list order', () => assert.deepEqual(slugs('port'), ['porto']));
test('no match returns []', () => assert.deepEqual(slugs('zzz'), []));
test('empty or blank query returns []', () => {
  assert.deepEqual(slugs(''), []);
  assert.deepEqual(slugs('   '), []);
});
