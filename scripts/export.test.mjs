import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { exportTv } from './export.mjs';

async function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'atlas-export-'));
  mkdirSync(join(root, 'content', 'photos'), { recursive: true });
  const data = {
    rows: [{ id: 'popular', title: 'Popular this week', slugs: ['kyoto', 'porto'] }],
    destinations: ['kyoto', 'porto'].map((slug) => ({ slug, name: slug, photo: { unsplashId: 'x' } })),
  };
  writeFileSync(join(root, 'content', 'destinations.json'), JSON.stringify(data));
  for (const [slug, colour] of [['kyoto', '#a33'], ['porto', '#3a3']]) {
    const buf = await sharp({ create: { width: 1920, height: 1280, channels: 3, background: colour } }).jpeg().toBuffer();
    writeFileSync(join(root, 'content', 'photos', `${slug}.jpg`), buf);
  }
  return root;
}

const snapshot = (dir) =>
  Object.fromEntries(readdirSync(dir).sort().map((f) => [f, readFileSync(join(dir, f)).toString('base64')]));

test('export writes a backdrop and a tile per slug at exact sizes', async () => {
  const root = await fixtureRoot();
  await exportTv({ root });
  for (const slug of ['kyoto', 'porto']) {
    const b = await sharp(join(root, 'tv', 'assets', 'destinations', `${slug}-backdrop.jpg`)).metadata();
    const t = await sharp(join(root, 'tv', 'assets', 'destinations', `${slug}-tile.jpg`)).metadata();
    assert.deepEqual([b.width, b.height], [1920, 1080]);
    assert.deepEqual([t.width, t.height], [480, 270]);
  }
  const data = JSON.parse(readFileSync(join(root, 'tv', 'src', 'data', 'destinations.json'), 'utf8'));
  assert.equal(data.destinations.length, 2);
});

test('export output is byte-identical on a second run', async () => {
  const root = await fixtureRoot();
  await exportTv({ root });
  const first = snapshot(join(root, 'tv', 'assets', 'destinations'));
  const images1 = readFileSync(join(root, 'tv', 'src', 'data', 'images.ts'), 'utf8');
  await exportTv({ root });
  assert.deepEqual(snapshot(join(root, 'tv', 'assets', 'destinations')), first);
  assert.equal(readFileSync(join(root, 'tv', 'src', 'data', 'images.ts'), 'utf8'), images1);
});

test('images.ts lists every slug', async () => {
  const root = await fixtureRoot();
  await exportTv({ root });
  const ts = readFileSync(join(root, 'tv', 'src', 'data', 'images.ts'), 'utf8');
  for (const slug of ['kyoto', 'porto']) {
    assert.match(ts, new RegExp(`'${slug}': require\\('../../assets/destinations/${slug}-backdrop.jpg'\\)`));
    assert.match(ts, new RegExp(`'${slug}': require\\('../../assets/destinations/${slug}-tile.jpg'\\)`));
  }
});
