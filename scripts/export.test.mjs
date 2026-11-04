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

// ---- Roku ----
import { exportRoku } from './export.mjs';
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

async function rokuRoot() {
  const root = mkdtempSync(join(tmpdir(), 'atlas-roku-'));
  mkdirSync(join(root, 'content', 'photos'), { recursive: true });
  const slugs = ['kyoto', 'porto', 'hoi-an'];
  const data = {
    rows: [
      { id: 'popular', title: 'Featured', slugs: ['kyoto'] },
      { id: 'cities', title: 'Cities', slugs: ['porto', 'hoi-an'] },
    ],
    destinations: [
      { slug: 'kyoto', name: 'Kyoto', country: 'Japan' },
      { slug: 'porto', name: 'Porto', country: 'Portugal' },
      { slug: 'hoi-an', name: 'Hội An', country: 'Vietnam' },
    ],
  };
  writeFileSync(join(root, 'content', 'destinations.json'), JSON.stringify(data));
  for (const slug of slugs) {
    const buf = await sharp({ create: { width: 1920, height: 1280, channels: 3, background: '#357' } }).jpeg().toBuffer();
    writeFileSync(join(root, 'content', 'photos', `${slug}.jpg`), buf);
  }
  // The channel's own files: package.sh and whatever it zips.
  mkdirSync(join(root, 'roku'), { recursive: true });
  cpSync(join(repo, 'roku', 'package.sh'), join(root, 'roku', 'package.sh'));
  for (const dir of ['source', 'components', 'fonts']) mkdirSync(join(root, 'roku', dir), { recursive: true });
  writeFileSync(join(root, 'roku', 'manifest'), 'title=Atlas\n');
  return root;
}

test('roku: Featured backdrops are 1280×720, the rest 960×540, tiles 480×270', async () => {
  const root = await rokuRoot();
  await exportRoku({ root });
  const size = async (f) => {
    const m = await sharp(join(root, 'roku', 'images', 'destinations', f)).metadata();
    return [m.width, m.height];
  };
  assert.deepEqual(await size('kyoto-backdrop.jpg'), [1280, 720]);
  assert.deepEqual(await size('porto-backdrop.jpg'), [960, 540]);
  assert.deepEqual(await size('hoi-an-tile.jpg'), [480, 270]);
});

test('roku: data carries folded search keys and the seed list', async () => {
  const root = await rokuRoot();
  await exportRoku({ root });
  const data = JSON.parse(readFileSync(join(root, 'roku', 'data', 'destinations.json'), 'utf8'));
  const hoiAn = data.destinations.find((d) => d.slug === 'hoi-an');
  assert.equal(hoiAn.searchName, 'hoi an');
  assert.equal(hoiAn.searchCountry, 'vietnam');
  assert.deepEqual(data.seedSaved, ['santorini', 'hoi-an', 'lofoten']);
});

test('roku: scrims are written as PNGs with alpha', async () => {
  const root = await rokuRoot();
  await exportRoku({ root });
  for (const f of ['scrim-home.png', 'scrim-detail.png', 'scrim-tile.png', 'pill.9.png', 'button.9.png', 'shadow.9.png']) {
    const m = await sharp(join(root, 'roku', 'images', f)).metadata();
    assert.equal(m.format, 'png');
    assert.equal(m.channels, 4);
  }
});

test('roku: output is byte-identical on a second run', async () => {
  const root = await rokuRoot();
  await exportRoku({ root });
  const first = snapshot(join(root, 'roku', 'images', 'destinations'));
  const data1 = readFileSync(join(root, 'roku', 'data', 'destinations.json'), 'utf8');
  await exportRoku({ root });
  assert.deepEqual(snapshot(join(root, 'roku', 'images', 'destinations')), first);
  assert.equal(readFileSync(join(root, 'roku', 'data', 'destinations.json'), 'utf8'), data1);
});

test('roku: measures the packaged zip and fails over the limit', async () => {
  const root = await rokuRoot();
  const { zipBytes } = await exportRoku({ root });
  assert.ok(zipBytes > 0);
  await assert.rejects(exportRoku({ root, limit: 1000 }), /over 1000/);
});

test('roku: seed list matches the tv app', async () => {
  const { SEED_SAVED } = await import('./export.mjs');
  const ts = readFileSync(join(repo, 'tv', 'src', 'lib', 'saved.ts'), 'utf8');
  const tvSeed = JSON.parse(ts.match(/SEED_SAVED[^=]*=\s*(\[[^\]]*\])/)[1].replace(/'/g, '"'));
  assert.deepEqual(SEED_SAVED, tvSeed);
});
