/**
 * Generates the WhatsApp QR code as a crisp SVG.
 *
 * WHY NOT THE SUPPLIED PHOTO
 * The QR was supplied as a photograph of a phone screen
 * (`images/WhatsApp Image 2026-09-13 at 11.16.55 PM.jpeg`), and two things are
 * wrong with using it directly.
 *
 * The first is practical: it is shot at an angle, with screen glare and a
 * hand across the frame, so a crop of it is soft, keystoned and unreliable to
 * scan — exactly the failure that matters, because a QR that does not scan is
 * worse than no QR.
 *
 * The second is that WhatsApp labels that screen "Your QR code is private" for
 * a reason. It is a personal contact code tied to an individual account, not a
 * business link, and publishing it puts a private code on every page of a
 * public website.
 *
 * A `wa.me` link avoids both. It opens the same chat with the same number —
 * the one already recorded as verified business information in
 * `src/config/site.ts` — and encodes to a mathematically perfect QR at any
 * size, in about 2KB of SVG rather than 200KB of photograph.
 *
 * Usage: node scripts/build-qr.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import QRCode from "qrcode";

const OUT_DIR = "public/brand";

/**
 * Read from the config file rather than duplicated here, so the QR cannot
 * drift away from the number the rest of the site publishes.
 */
const source = await import("../src/config/site.ts").catch(() => null);
const whatsapp =
  source?.siteConfig?.whatsapp ??
  // The config is TypeScript; if the runtime cannot load it, parse the literal
  // rather than hardcoding a second copy of the number.
  (await import("node:fs")).readFileSync("src/config/site.ts", "utf8")
    .match(/whatsapp:\s*"(\d+)"/)?.[1];

if (!whatsapp) {
  console.error("No WhatsApp number found in src/config/site.ts");
  process.exit(1);
}

const target = `https://wa.me/${whatsapp}`;

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Error correction level M. High enough to survive a phone camera at an angle
 * or a partially obscured print, without inflating the module count to the
 * point where it stops scanning at the small size this renders at.
 */
const svg = await QRCode.toString(target, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  // Pure black on transparent. The page tints it with currentColor, so the
  // same file works on the light contact panel and on the dark footer.
  color: { dark: "#000000", light: "#0000" },
});

const file = `${OUT_DIR}/whatsapp-qr.svg`;
writeFileSync(file, svg);

writeFileSync(
  "src/content/generated/whatsapp-qr.json",
  JSON.stringify({ src: "/brand/whatsapp-qr.svg", target, number: whatsapp }, null, 1) + "\n",
);

console.log(
  `  ${file}  ${Math.round(Buffer.byteLength(svg) / 102.4) / 10}KB` +
    `\n  encodes: ${target}` +
    `\n  manifest: src/content/generated/whatsapp-qr.json`,
);
