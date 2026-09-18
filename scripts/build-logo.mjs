/**
 * Turns the supplied logo JPEG into transparent brand assets.
 *
 * The source (`images/logo.jpeg`) is a flat white JPEG: a circuit-etched hand
 * holding three isometric cubes, with "THE DIGITAL ALCHEMY" set beneath. JPEG
 * has no alpha, so on any surface that is not pure white it renders as a white
 * card. This script keys the background out and emits two assets:
 *
 *   logo-mark      the hand and cubes, cropped to their bounding box
 *   logo-lockup    mark and wordmark together, for wide brand placements
 *
 * WHY FLOOD FILL RATHER THAN A COLOUR KEY
 * A plain "make white transparent" pass would punch holes through the logo:
 * the highlight along the thumb and the gaps inside the circuit tracery are
 * also white. Filling inward from the border only removes white that is
 * actually connected to the outside, so enclosed white stays put.
 *
 * WHY THE EDGE PASS
 * JPEG anti-aliasing blends the artwork's edge toward the white it was
 * composited on. Keying alone leaves a pale halo. Pixels bordering the removed
 * background get a partial alpha and are un-multiplied back out of white, so
 * the edge stays clean on a dark surface.
 *
 * Usage: node scripts/build-logo.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "images/logo.jpeg";
const OUT_DIR = "public/brand";

/** A pixel at or above this on every channel counts as background. */
const WHITE = 240;
/** Edge pixels lighter than this get feathered rather than left opaque. */
const EDGE_LIGHT = 200;

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels: C } = info;
const at = (x, y) => (y * W + x) * C;
const isWhite = (i) =>
  data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE;

// ---- Flood fill inward from every border pixel -------------------------
const background = new Uint8Array(W * H);
const queue = [];

const push = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const p = y * W + x;
  if (background[p]) return;
  if (!isWhite(at(x, y))) return;
  background[p] = 1;
  queue.push(p);
};

for (let x = 0; x < W; x++) {
  push(x, 0);
  push(x, H - 1);
}
for (let y = 0; y < H; y++) {
  push(0, y);
  push(W - 1, y);
}

for (let head = 0; head < queue.length; head++) {
  const p = queue[head];
  const x = p % W;
  const y = (p - x) / W;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

for (let p = 0; p < W * H; p++) {
  if (background[p]) data[p * C + 3] = 0;
}

// ---- Feather the edge and pull the white back out ----------------------
let feathered = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (background[p]) continue;
    const touchesBackground =
      (x > 0 && background[p - 1]) ||
      (x < W - 1 && background[p + 1]) ||
      (y > 0 && background[p - W]) ||
      (y < H - 1 && background[p + W]);
    if (!touchesBackground) continue;

    const i = at(x, y);
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum <= EDGE_LIGHT) continue;

    const alpha = Math.max(0, Math.min(255, Math.round((255 - lum) * (255 / (255 - EDGE_LIGHT)))));
    if (alpha === 0) {
      data[i + 3] = 0;
      continue;
    }
    // Un-composite from white: c = (c' - (1 - a) * 255) / a
    const a = alpha / 255;
    for (let k = 0; k < 3; k++) {
      data[i + k] = Math.max(0, Math.min(255, Math.round((data[i + k] - (1 - a) * 255) / a)));
    }
    data[i + 3] = alpha;
    feathered++;
  }
}

// ---- Bounding boxes ----------------------------------------------------
/** Tight box around everything with meaningful opacity in a row range. */
function bounds(fromY, toY) {
  let minX = W;
  let maxX = -1;
  let minY = H;
  let maxY = -1;
  for (let y = fromY; y <= toY; y++) {
    for (let x = 0; x < W; x++) {
      if (data[at(x, y) + 3] < 8) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Row ranges that contain ink, so the wordmark can be told from the mark. */
const rowHasInk = [];
for (let y = 0; y < H; y++) {
  let ink = 0;
  for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 24) ink++;
  rowHasInk.push(ink > 0);
}
const bands = [];
let current = null;
rowHasInk.forEach((ink, y) => {
  if (ink) {
    if (!current) current = { from: y };
    current.to = y;
  } else if (current) {
    bands.push(current);
    current = null;
  }
});
if (current) bands.push(current);

const solid = bands.filter((b) => b.to - b.from > 4);
if (solid.length < 2) {
  throw new Error(
    `Expected a mark band and a wordmark band, found ${solid.length}. ` +
      `Has the source logo changed shape?`,
  );
}

const markBand = solid[0];
const full = bounds(0, H - 1);
const mark = bounds(markBand.from, markBand.to);

mkdirSync(OUT_DIR, { recursive: true });

const raw = { raw: { width: W, height: H, channels: C } };

/** Equal padding so the mark is not flush against its own edge. */
const PAD = Math.round(mark.width * 0.02);
const padded = {
  left: Math.max(0, mark.left - PAD),
  top: Math.max(0, mark.top - PAD),
  width: Math.min(W, mark.width + PAD * 2),
  height: Math.min(H, mark.height + PAD * 2),
};

const outputs = [];

for (const [name, box, maxEdge] of [
  ["logo-mark", padded, 256],
  ["logo-lockup", full, 1024],
]) {
  const target = path.join(OUT_DIR, `${name}.png`);
  const info2 = await sharp(Buffer.from(data), raw)
    .extract(box)
    .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(target);
  outputs.push([name, info2]);
  console.log(
    `  ${name.padEnd(12)} ${String(info2.width).padStart(4)}×${String(info2.height).padEnd(4)} ` +
      `${Math.round(info2.size / 1024)}KB`,
  );
}

// A 16px blur placeholder is pointless for a logo, but the intrinsic size is
// needed so the header reserves the right space before the file arrives.
const meta = {};
for (const [name, i] of outputs) {
  meta[name] = { src: `/brand/${name}.png`, width: i.width, height: i.height };
}
writeFileSync(
  "src/content/generated/logo.json",
  JSON.stringify(meta, null, 1) + "\n",
);

const removed = background.reduce((n, v) => n + v, 0);
console.log(
  `\n  background removed: ${Math.round((removed / (W * H)) * 100)}% of pixels` +
    `\n  edge pixels feathered: ${feathered}` +
    `\n  mark band y ${markBand.from}–${markBand.to}, wordmark band y ${solid[1].from}–${solid[1].to}` +
    `\n  manifest: src/content/generated/logo.json`,
);
