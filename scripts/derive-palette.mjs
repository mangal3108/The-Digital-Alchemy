/**
 * Derives the usable variants of each brand accent.
 *
 * A vivid accent is a fill colour, not a text colour — #FF5A36 on warm canvas
 * measures about 3:1, well under the 4.5:1 WCAG AA needs for body text. So for
 * every accent this computes:
 *
 *   base   the supplied vivid colour, for fills, graphics and 3D
 *   text   darkened until it clears 4.5:1 on the warm canvas
 *   soft   a pale tint for chips, hover fields and section washes
 *   on     white or near-black, whichever is legible on `base`
 *   onDark a lightened variant that clears 4.5:1 on the charcoal ground
 *
 * Usage: node scripts/derive-palette.mjs
 */

const CANVAS = "#f7f7f5";
const DARK = "#1d1d1f";
const AA = 4.5;

const ACCENTS = {
  coral: "#ff5a36",
  tangerine: "#ff8a3d",
  gold: "#ffd166",
  blue: "#5b8cff",
  violet: "#7c6cff",
  mint: "#38c7a5",
  pink: "#ff6fae",
  indigo: "#6d7cff",
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = ([r, g, b]) =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const l1 = luminance(hexToRgb(a));
  const l2 = luminance(hexToRgb(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/** Scale toward black, preserving hue, until the target ratio is met. */
const darkenUntil = (hex, against, target) => {
  const rgb = hexToRgb(hex);
  for (let step = 0; step <= 100; step++) {
    const factor = 1 - step / 100;
    const candidate = rgbToHex(rgb.map((v) => v * factor));
    if (contrast(candidate, against) >= target) return candidate;
  }
  return "#000000";
};

/** Blend toward white, preserving hue, until the target ratio is met. */
const lightenUntil = (hex, against, target) => {
  const rgb = hexToRgb(hex);
  for (let step = 0; step <= 100; step++) {
    const t = step / 100;
    const candidate = rgbToHex(rgb.map((v) => v + (255 - v) * t));
    if (contrast(candidate, against) >= target) return candidate;
  }
  return "#ffffff";
};

/** Pale tint for chips and washes — 92% toward the canvas. */
const soften = (hex) => {
  const rgb = hexToRgb(hex);
  const bg = hexToRgb(CANVAS);
  return rgbToHex(rgb.map((v, i) => v + (bg[i] - v) * 0.9));
};

const rows = [];
for (const [name, base] of Object.entries(ACCENTS)) {
  const text = darkenUntil(base, CANVAS, AA);
  const onDark = lightenUntil(base, DARK, AA);
  const onWhite = contrast("#ffffff", base);
  const onBlack = contrast("#111111", base);
  const on = onWhite >= onBlack ? "#ffffff" : "#111111";

  rows.push({
    name,
    base,
    baseOnCanvas: contrast(base, CANVAS).toFixed(2),
    text,
    textRatio: contrast(text, CANVAS).toFixed(2),
    soft: soften(base),
    on,
    onRatio: contrast(on, base).toFixed(2),
    onDark,
    onDarkRatio: contrast(onDark, DARK).toFixed(2),
  });
}

console.log(
  "accent      base      (on canvas)  text      (ratio)  soft      on        (ratio)  onDark    (ratio)",
);
for (const r of rows) {
  console.log(
    `${r.name.padEnd(11)} ${r.base}  ${r.baseOnCanvas.padStart(5)}       ` +
      `${r.text}  ${r.textRatio.padStart(5)}   ${r.soft}  ${r.on}  ` +
      `${r.onRatio.padStart(5)}   ${r.onDark}  ${r.onDarkRatio.padStart(5)}`,
  );
}

console.log("\n--- CSS tokens ---");
for (const r of rows) {
  console.log(`  --color-${r.name}: ${r.base};`);
  console.log(`  --color-${r.name}-text: ${r.text};`);
  console.log(`  --color-${r.name}-soft: ${r.soft};`);
  console.log(`  --color-${r.name}-on: ${r.on};`);
  console.log(`  --color-${r.name}-bright: ${r.onDark};`);
}
