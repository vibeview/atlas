// Writes the TV app art from the Atlas compass icon: lagoon background,
// compass, and the "Atlas" wordmark on the wide sizes. Apple TV / Android TV
// art goes to tv/assets/tv/, Roku icons and splash screens to roku/images/.
// Run once after changing the icon: node make-tv-art.mjs
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'tv', 'assets', 'tv');
const icon = join(root, 'assets', 'images', 'icon.png');
const roku = join(root, 'roku', 'images');
const LAGOON = '#0E7C86';
const INK = '#0B1016';
mkdirSync(out, { recursive: true });
mkdirSync(roku, { recursive: true });

// The icon is a white compass on lagoon; crop to the compass ring.
const compass = (size) => sharp(icon).extract({ left: 190, top: 190, width: 644, height: 644 }).resize(size, size).png().toBuffer();

async function art(name, width, height, { wordmark, dir = out, background = LAGOON, scale = 1 }) {
  const c = Math.round(height * 0.46 * scale);
  const text = Math.round(height * 0.3 * scale);
  const layers = [];
  if (wordmark) {
    const gap = Math.round(height * 0.12);
    const textWidth = Math.round(text * 2.6);
    const left = Math.round((width - (c + gap + textWidth)) / 2);
    layers.push({ input: await compass(c), top: Math.round((height - c) / 2), left });
    const svg = `<svg width="${textWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="${Math.round(height / 2 + text * 0.36)}" font-family="Helvetica Neue, Helvetica, Arial" font-weight="700" font-size="${text}" fill="#fff">Atlas</text></svg>`;
    layers.push({ input: Buffer.from(svg), top: 0, left: left + c + gap });
  } else {
    layers.push({ input: await compass(c), top: Math.round((height - c) / 2), left: Math.round((width - c) / 2) });
  }
  await sharp({ create: { width, height, channels: 4, background } }).composite(layers).png(dir === out ? {} : { compressionLevel: 9, palette: true }).toFile(join(dir, name));
}

await art('appletv-icon-400x240.png', 400, 240, { wordmark: false });
await art('appletv-icon-800x480.png', 800, 480, { wordmark: false });
await art('appletv-icon-1280x768.png', 1280, 768, { wordmark: false });
await art('appletv-topshelf-1920x720.png', 1920, 720, { wordmark: true });
await art('appletv-topshelf-3840x1440.png', 3840, 1440, { wordmark: true });
await art('appletv-topshelfwide-2320x720.png', 2320, 720, { wordmark: true });
await art('appletv-topshelfwide-4640x1440.png', 4640, 1440, { wordmark: true });
await art('android-banner-320x180.png', 320, 180, { wordmark: true });
await art('android-icon-512x512.png', 512, 512, { wordmark: false });
// Roku manifest sizes (mm_icon_focus_*, splash_screen_*). The splash is the
// channel's ink background with a smaller mark, so launch fades into Home.
await art('icon_fhd.png', 540, 405, { wordmark: true, dir: roku, scale: 0.72 });
await art('icon_hd.png', 290, 218, { wordmark: true, dir: roku, scale: 0.72 });
await art('icon_sd.png', 214, 144, { wordmark: true, dir: roku, scale: 0.72 });
await art('splash_fhd.png', 1920, 1080, { wordmark: true, dir: roku, background: INK, scale: 0.4 });
await art('splash_hd.png', 1280, 720, { wordmark: true, dir: roku, background: INK, scale: 0.4 });
await art('splash_sd.png', 720, 480, { wordmark: true, dir: roku, background: INK, scale: 0.4 });
console.log('tv art written');
