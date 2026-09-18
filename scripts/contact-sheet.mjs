/**
 * Builds a labelled contact sheet from a list of images.
 *
 * Exists so picks get looked at before they ship. The whole reason this
 * imagery was rebuilt twice is that nobody saw the garbled text in the first
 * hero until it was on the homepage.
 *
 * Usage: node scripts/contact-sheet.mjs out.png dir file1 file2 ...
 */
import sharp from "sharp";
import path from "node:path";

const [out, dir, ...files] = process.argv.slice(2);
if (!out || !dir || files.length === 0) {
  console.error("usage: node scripts/contact-sheet.mjs out.png dir file...");
  process.exit(1);
}

const COLS = Math.min(3, files.length);
const CELL_W = 520;
const LABEL_H = 26;

const cells = [];
for (const f of files) {
  const img = sharp(path.join(dir, f)).resize(CELL_W, null, { fit: "inside" });
  const buf = await img.png().toBuffer();
  const meta = await sharp(buf).metadata();
  cells.push({ buf, h: meta.height, w: meta.width, name: f });
}

const rowH = Math.max(...cells.map((c) => c.h)) + LABEL_H;
const rows = Math.ceil(cells.length / COLS);
const W = COLS * CELL_W;
const H = rows * rowH;

const label = (text, w) =>
  Buffer.from(
    `<svg width="${w}" height="${LABEL_H}"><rect width="${w}" height="${LABEL_H}" fill="#111"/>` +
      `<text x="8" y="18" font-family="monospace" font-size="13" fill="#eee">${text
        .replace(/[<>&]/g, "")
        .slice(0, 62)}</text></svg>`,
  );

const composite = [];
cells.forEach((c, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  composite.push({ input: c.buf, left: col * CELL_W, top: row * rowH });
  composite.push({ input: label(c.name, CELL_W), left: col * CELL_W, top: row * rowH + c.h });
});

await sharp({ create: { width: W, height: H, channels: 4, background: "#2a2a2a" } })
  .composite(composite)
  .png()
  .toFile(out);

console.log(`  ${out}  ${W}×${H}  ${cells.length} images`);
