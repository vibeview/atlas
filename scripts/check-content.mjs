// Checks content/destinations.json against content/schema.md.
// Usage: node check-content.mjs   (exits 1 and lists problems when invalid)
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const ROW_IDS = ['popular', 'cities', 'coast', 'mountains'];
// The phone app's destinations (src/data/destinations.ts); the TV set keeps them all.
export const PHONE_IDS = ['santorini', 'kyoto', 'bali', 'lago-di-braies', 'porto', 'zermatt', 'tulum'];
export const BANNED = [
  'come for',
  'stay for',
  'nestled',
  'hidden gem',
  'breathtaking',
  'vibrant',
  "whether you're",
  'whether you’re',
  'paradise',
  'something for everyone',
];
const TEXT_FIELDS = ['name', 'country', 'tagline', 'description', 'bestMonths', 'timeZone', 'airport'];
const OFFSET = 'UTC[+-]\\d{1,2}(:[0-5]\\d)?';
const TIME_ZONE = new RegExp(`^${OFFSET}(, ${OFFSET} in summer)?$`);
const MIN_MASTER_WIDTH = 1920;

const sentences = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;

export async function checkContent(data, { photoDir }) {
  const problems = [];
  const rows = data.rows ?? [];
  const dests = data.destinations ?? [];

  if (rows.map((r) => r.id).join() !== ROW_IDS.join()) problems.push(`rows must be ${ROW_IDS.join(', ')} in that order`);
  const seenInRow = new Map();
  for (const row of rows) {
    if (!row.title) problems.push(`row ${row.id}: missing title`);
    if ((row.slugs ?? []).length !== 6) problems.push(`row ${row.id}: must hold six destinations`);
    for (const slug of row.slugs ?? []) {
      if (seenInRow.has(slug)) problems.push(`${slug}: in more than one row (${seenInRow.get(slug)}, ${row.id})`);
      seenInRow.set(slug, row.id);
    }
  }

  const bySlug = new Map();
  for (const d of dests) {
    const s = d.slug ?? '(no slug)';
    if (bySlug.has(s)) problems.push(`${s}: duplicate slug`);
    bySlug.set(s, d);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) problems.push(`${s}: slug must be lowercase-hyphenated`);
    for (const f of TEXT_FIELDS) if (typeof d[f] !== 'string' || !d[f].trim()) problems.push(`${s}: missing ${f}`);
    if (typeof d.description === 'string' && ![2, 3].includes(sentences(d.description)))
      problems.push(`${s}: description must be two or three sentences`);
    if (typeof d.timeZone === 'string' && !TIME_ZONE.test(d.timeZone))
      problems.push(`${s}: time zone "${d.timeZone}" must look like "UTC+2" or "UTC+2, UTC+3 in summer"`);
    if (!Array.isArray(d.tags) || d.tags.length < 2 || d.tags.length > 3) problems.push(`${s}: needs 2 or 3 tags`);
    if (typeof d.rating !== 'number' || d.rating < 4 || d.rating > 5 || Math.round(d.rating * 10) !== d.rating * 10)
      problems.push(`${s}: rating must be 4.0–5.0 with one decimal`);
    const ex = d.experiences ?? [];
    if (ex.length !== 3) problems.push(`${s}: needs three experiences`);
    for (const e of ex) if (!e.title || !e.line || !e.icon) problems.push(`${s}: experience needs title, line and icon`);
    const p = d.photo ?? {};
    for (const f of ['unsplashId', 'photographer', 'url', 'checkedOn']) if (!p[f]) problems.push(`${s}: photo missing ${f}`);
    if (p.checkedOn && !/^\d{4}-\d{2}-\d{2}$/.test(p.checkedOn)) problems.push(`${s}: photo checkedOn must be YYYY-MM-DD`);
    if (p.url && !/^https:\/\/unsplash\.com\/photos\//.test(p.url)) problems.push(`${s}: photo url must be an unsplash.com/photos/ page`);

    const text = [d.tagline, d.description, ...ex.flatMap((e) => [e.title, e.line])].join(' ').toLowerCase();
    for (const phrase of BANNED) if (text.includes(phrase)) problems.push(`${s}: banned phrase "${phrase}"`);

    const master = join(photoDir, `${s}.jpg`);
    if (!existsSync(master)) problems.push(`${s}: photo master ${s}.jpg missing`);
    else {
      const { width } = await sharp(master).metadata();
      if (width < MIN_MASTER_WIDTH) problems.push(`${s}: photo master is ${width} px wide, needs ${MIN_MASTER_WIDTH}`);
    }
  }

  if (dests.length !== 24) problems.push(`need 24 destinations, found ${dests.length}`);
  for (const slug of seenInRow.keys()) if (!bySlug.has(slug)) problems.push(`${slug}: in a row but not a destination`);
  for (const slug of bySlug.keys()) if (!seenInRow.has(slug)) problems.push(`${slug}: not in any row`);
  for (const id of PHONE_IDS) if (!bySlug.has(id)) problems.push(`${id}: phone destination missing from the TV set`);
  // No live data behind the app, so the first row can't claim to measure anything.
  const popularRow = rows.find((r) => r.id === 'popular');
  if (popularRow && /popular|trending|this week/i.test(popularRow.title ?? '')) problems.push('popular: title must not claim live data ("Featured")');
  const popular = popularRow?.slugs ?? [];
  if (popular.filter((x) => PHONE_IDS.includes(x)).length !== 6) problems.push('popular: must hold six of the phone destinations');

  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
  const data = JSON.parse(readFileSync(join(root, 'destinations.json'), 'utf8'));
  const problems = await checkContent(data, { photoDir: join(root, 'photos') });
  for (const p of problems) console.log(`- ${p}`);
  console.log(problems.length ? `${problems.length} problem(s)` : 'content ok');
  process.exit(problems.length ? 1 : 0);
}
