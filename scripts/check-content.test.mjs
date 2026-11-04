import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { checkContent, PHONE_IDS } from './check-content.mjs';

const ROW_IDS = ['popular', 'cities', 'coast', 'mountains'];
let photoDir;

function destination(slug) {
  return {
    slug,
    name: slug,
    country: 'Testland',
    tagline: 'A short line.',
    description: 'One sentence here. Two sentences here. Three sentences here.',
    tags: ['Old town', 'Food'],
    bestMonths: 'May to September',
    timeZone: 'UTC+1, UTC+2 in summer',
    airport: 'Test (TST), 20 min by train',
    rating: 4.6,
    experiences: [
      { title: 'A', line: 'One.', icon: 'walk' },
      { title: 'B', line: 'Two.', icon: 'boat' },
      { title: 'C', line: 'Three.', icon: 'food' },
    ],
    photo: { unsplashId: 'abc', photographer: 'Someone', url: 'https://unsplash.com/photos/abc', checkedOn: '2026-11-04' },
  };
}

function valid() {
  const slugs = [...PHONE_IDS];
  for (let i = slugs.length; i < 24; i++) slugs.push(`place-${i}`);
  return {
    rows: ROW_IDS.map((id, r) => ({ id, title: id, slugs: slugs.slice(r * 6, r * 6 + 6) })),
    destinations: slugs.map(destination),
  };
}

before(async () => {
  photoDir = mkdtempSync(join(tmpdir(), 'atlas-photos-'));
  const img = sharp({ create: { width: 1920, height: 1280, channels: 3, background: '#336' } }).jpeg();
  const buf = await img.toBuffer();
  const { writeFileSync } = await import('node:fs');
  for (const d of valid().destinations) writeFileSync(join(photoDir, `${d.slug}.jpg`), buf);
});

const run = (data) => checkContent(data, { photoDir });

test('accepts the valid fixture', async () => {
  assert.deepEqual(await run(valid()), []);
});

test('rejects a destination in two rows', async () => {
  const d = valid();
  d.rows[1].slugs[0] = d.rows[0].slugs[0];
  assert.ok((await run(d)).some((p) => /more than one row/.test(p)));
});

test('rejects rows not of six', async () => {
  const d = valid();
  d.rows[0].slugs.pop();
  assert.ok((await run(d)).some((p) => /six/.test(p)));
});

test('rejects a missing field', async () => {
  const d = valid();
  delete d.destinations[3].airport;
  assert.ok((await run(d)).some((p) => /airport/.test(p)));
});

test('rejects a description that is not three sentences', async () => {
  const d = valid();
  d.destinations[0].description = 'Only one sentence.';
  assert.ok((await run(d)).some((p) => /three sentences/.test(p)));
});

test('rejects banned phrases', async () => {
  const d = valid();
  d.destinations[2].tagline = 'A hidden gem by the sea.';
  assert.ok((await run(d)).some((p) => /hidden gem/.test(p)));
});

test('rejects time zone "GMT+1" and accepts the summer form', async () => {
  const d = valid();
  d.destinations[0].timeZone = 'GMT+1';
  assert.ok((await run(d)).some((p) => /time zone/.test(p)));
  d.destinations[0].timeZone = 'UTC+1, UTC+2 in summer';
  d.destinations[1].timeZone = 'UTC+9';
  d.destinations[2].timeZone = 'UTC+5:30';
  assert.deepEqual(await run(d), []);
});

test('rejects a slug whose photo master is missing or under 1920 px wide', async () => {
  const d = valid();
  d.destinations[5].slug = 'no-photo';
  d.rows[0].slugs[5] = 'no-photo';
  const small = mkdtempSync(join(tmpdir(), 'atlas-small-'));
  const { writeFileSync, readdirSync, copyFileSync } = await import('node:fs');
  for (const f of readdirSync(photoDir)) copyFileSync(join(photoDir, f), join(small, f));
  writeFileSync(join(small, 'kyoto.jpg'), await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#000' } }).jpeg().toBuffer());
  const problems = await checkContent(d, { photoDir: small });
  assert.ok(problems.some((p) => /no-photo.*photo/.test(p)));
  assert.ok(problems.some((p) => /kyoto.*1920/.test(p)));
});

test('requires the phone ids', async () => {
  const d = valid();
  const i = d.destinations.findIndex((x) => x.slug === 'tulum');
  d.destinations[i].slug = 'elsewhere';
  d.rows.forEach((r) => (r.slugs = r.slugs.map((s) => (s === 'tulum' ? 'elsewhere' : s))));
  const { copyFileSync } = await import('node:fs');
  copyFileSync(join(photoDir, 'tulum.jpg'), join(photoDir, 'elsewhere.jpg'));
  assert.ok((await run(d)).some((p) => /tulum/.test(p)));
});
