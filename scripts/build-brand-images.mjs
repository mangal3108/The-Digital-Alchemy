/**
 * Curates, colour-grades and optimises the generated brand imagery.
 *
 * Source files land in /images with opaque hashed names. This script is the
 * only place that knows about them: it selects the ones worth keeping, grades
 * each into the site's palette, writes optimised WebP into /public/images, and
 * emits a manifest with dimensions and a blur placeholder so nothing shifts on
 * load.
 *
 * WHY GRADE
 * The generated set arrived largely blue, teal, navy and purple. The site's
 * palette is warm paper with copper and verdigris, and the brief explicitly
 * rules out purple and neon. Hue-rotating in HSL fixes this cheaply and
 * safely: neutrals have no saturation so device bodies, shadows and studio
 * backgrounds are untouched, while the coloured accents swing onto brand.
 * Rotation values below were arrived at by rendering sweeps and looking at
 * them, not by theory.
 *
 * Usage: node scripts/build-brand-images.mjs
 */
import { readdirSync, mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "images";
const OUT_DIR = "public/images";
const MANIFEST = "src/content/generated/brand-images.json";

/** Longest edge. Beyond this we are storing detail no layout ever shows. */
const MAX_EDGE = 1600;

/**
 * The curated set.
 *
 * `match` is a unique filename prefix — the source names are hashes, so this
 * keeps the mapping readable and survives re-downloads.
 * `hue` is degrees of HSL rotation, `saturation` a multiplier.
 * `note` records why each was chosen, and `caption` marks images whose screens
 * contain invented figures so the UI can label them as illustrative.
 */
const CURATED = [
  {
    name: "world-globe-light",
    category: "global",
    match: "HgyBh-mD",
    hue: 25,
    saturation: 0.4,
    note: "Near-white wireframe globe. Barely graded; used as a faint layer.",
  },
  // -------------------------------------------------------------------------
  // The v2 brief (docs/image-brief.html).
  //
  // None of these contain an interface. Screens are composited from real
  // screenshots taken by scripts/capture-ui.mjs, so nothing generated here can
  // carry invented figures or garbled lettering — which is why none of them
  // sets `caption`. Entries whose file has not been supplied yet are reported
  // and skipped, not built from something else.
  //
  // Ungraded throughout: each prompt already names its accent, and V2 rules out
  // a global hue rotation. The point of an eight-accent system is that not
  // everything gets pushed to one hue.
  // -------------------------------------------------------------------------

  // The supplied lineup render, restored at your request. Its screens carry
  // invented figures and the dashboard lettering is garbled in places, so it
  // stays flagged illustrative until a clean replacement is generated.
  { name: "platform-devices", category: "hero", match: "1.png", hue: 0, saturation: 1, trim: 10, maxEdge: 2200, note: "Homepage hero — supplied device lineup.", caption: true },

  // ---- Plates: surfaces the device composites sit on ----
  { name: "plate-bench-aluminium", category: "plates", match: "plates/plate-bench-aluminium", hue: 0, saturation: 1, maxEdge: 2560, note: "Background for device composites." },
  { name: "plate-rack-dark", category: "plates", match: "plates/plate-rack-dark", hue: 0, saturation: 1, maxEdge: 2560, note: "Background for device composites." },
  { name: "plate-bench-light", category: "plates", match: "plates/plate-bench-light", hue: 0, saturation: 1, maxEdge: 2560, note: "Background for device composites." },
  { name: "plate-esd-mat", category: "plates", match: "plates/plate-esd-mat", hue: 0, saturation: 1, maxEdge: 2560, note: "Background for device composites." },

  // ---- Objects: the colour system made physical ----
  { name: "object-alchemy-core", category: "objects", match: "objects/object-alchemy-core", hue: 0, saturation: 1, trim: 6, maxEdge: 1600, note: "Brand object." },
  { name: "object-silicon-wafer", category: "objects", match: "objects/object-silicon-wafer", hue: 0, saturation: 1, trim: 6, maxEdge: 1600, note: "Brand object." },
  { name: "object-machined-forms", category: "objects", match: "objects/object-machined-forms", hue: 0, saturation: 1, trim: 6, maxEdge: 1600, note: "Brand object." },

  // ---- Services: one real subject per page ----
  { name: "service-saas-development", category: "services", match: "services/service-saas-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/saas-development — accent blue." },
  { name: "service-custom-software-development", category: "services", match: "services/service-custom-software-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/custom-software-development — accent indigo." },
  { name: "service-web-development", category: "services", match: "services/service-web-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/web-development — accent mint." },
  { name: "service-web-application-development", category: "services", match: "services/service-web-application-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/web-application-development — accent blue." },
  { name: "service-mobile-app-development", category: "services", match: "services/service-mobile-app-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/mobile-app-development — accent coral." },
  { name: "service-ecommerce-development", category: "services", match: "services/service-ecommerce-development", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/ecommerce-development — accent pink." },
  { name: "service-ui-ux-design", category: "services", match: "services/service-ui-ux-design", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/ui-ux-design — accent violet." },
  { name: "service-product-design", category: "services", match: "services/service-product-design", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/product-design — accent indigo." },
  { name: "service-branding", category: "services", match: "services/service-branding", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/branding — accent gold." },
  { name: "service-digital-marketing", category: "services", match: "services/service-digital-marketing", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/digital-marketing — accent tangerine." },
  { name: "service-search-engine-optimization", category: "services", match: "services/service-search-engine-optimization", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/search-engine-optimization — accent mint." },
  { name: "service-social-media-management", category: "services", match: "services/service-social-media-management", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/social-media-management — accent pink." },
  { name: "service-performance-marketing", category: "services", match: "services/service-performance-marketing", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/performance-marketing — accent coral." },
  { name: "service-google-ads", category: "services", match: "services/service-google-ads", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/google-ads — accent tangerine." },
  { name: "service-meta-ads", category: "services", match: "services/service-meta-ads", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/meta-ads — accent pink." },
  { name: "service-lead-generation", category: "services", match: "services/service-lead-generation", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/lead-generation — accent coral." },
  { name: "service-marketing-funnels", category: "services", match: "services/service-marketing-funnels", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/marketing-funnels — accent violet." },
  { name: "service-automation-integrations", category: "services", match: "services/service-automation-integrations", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/automation-integrations — accent indigo." },
  { name: "service-cloud-solutions", category: "services", match: "services/service-cloud-solutions", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/cloud-solutions — accent blue." },
  { name: "service-maintenance-support", category: "services", match: "services/service-maintenance-support", hue: 0, saturation: 1, maxEdge: 1600, note: "/services/maintenance-support — accent mint." },

  // ---- Industries: sector hardware, never sector clichés ----
  { name: "industry-startups", category: "industries", match: "industries/industry-startups", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/startups — sector hardware, not a claim about sector-specific software." },
  { name: "industry-ecommerce", category: "industries", match: "industries/industry-ecommerce", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/ecommerce — sector hardware, not a claim about sector-specific software." },
  { name: "industry-healthcare", category: "industries", match: "industries/industry-healthcare", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/healthcare — sector hardware, not a claim about sector-specific software." },
  { name: "industry-education", category: "industries", match: "industries/industry-education", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/education — sector hardware, not a claim about sector-specific software." },
  { name: "industry-real-estate", category: "industries", match: "industries/industry-real-estate", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/real-estate — sector hardware, not a claim about sector-specific software." },
  { name: "industry-finance", category: "industries", match: "industries/industry-finance", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/finance — sector hardware, not a claim about sector-specific software." },
  { name: "industry-hospitality", category: "industries", match: "industries/industry-hospitality", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/hospitality — sector hardware, not a claim about sector-specific software." },
  { name: "industry-professional-services", category: "industries", match: "industries/industry-professional-services", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/professional-services — sector hardware, not a claim about sector-specific software." },
  { name: "industry-retail", category: "industries", match: "industries/industry-retail", hue: 0, saturation: 1, maxEdge: 1600, note: "/industries/retail — sector hardware, not a claim about sector-specific software." },

  // ---- Page heroes: full-bleed bands under each page title ----
  // `hero-lineup` is deliberately absent: it is produced by
  // scripts/build-hero-composite.mjs from real screenshots, not from a Flow
  // drop, and listing it here would let a stray file overwrite the composite.
  { name: "hero-services", category: "heroes", match: "heroes/hero-services", hue: 0, saturation: 1, maxEdge: 2400, note: "/services index." },
  { name: "hero-industries", category: "heroes", match: "heroes/hero-industries", hue: 0, saturation: 1, maxEdge: 2400, note: "/industries index." },
  { name: "hero-insights", category: "heroes", match: "heroes/hero-insights", hue: 0, saturation: 1, maxEdge: 2400, note: "/insights index." },
  { name: "hero-clients", category: "heroes", match: "heroes/hero-clients", hue: 0, saturation: 1, maxEdge: 2400, note: "/clients — a blanking panel, for a page about being empty." },
  { name: "hero-products", category: "heroes", match: "heroes/hero-products", hue: 0, saturation: 1, maxEdge: 2400, note: "/products — replaces a drawn dashboard with invented figures." },
  { name: "hero-contact", category: "heroes", match: "heroes/hero-contact", hue: 0, saturation: 1, maxEdge: 2400, note: "/contact." },
  { name: "hero-start-project", category: "heroes", match: "heroes/hero-start-project", hue: 0, saturation: 1, maxEdge: 2400, note: "/start-a-project — uncut stock with the first scribe line." },
  { name: "hero-work", category: "heroes", match: "heroes/hero-work", hue: 0, saturation: 1, maxEdge: 2400, note: "/work — architectural glass and black anodised prism block." },
  { name: "hero-about", category: "heroes", match: "heroes/hero-about", hue: 0, saturation: 1, maxEdge: 2400, note: "/about — modern design engineering lab workbench." },
  { name: "hero-careers", category: "heroes", match: "heroes/hero-careers", hue: 0, saturation: 1, maxEdge: 2400, note: "/careers — minimalist studio workspace." },

  // ---- Homepage bands still drawn in CSS ----
  { name: "section-ideas-canvas", category: "sections", match: "sections/section-ideas-canvas", hue: 0, saturation: 1, maxEdge: 2400, note: "Homepage — where ideas take shape." },
  { name: "section-technology", category: "sections", match: "sections/section-technology", hue: 0, saturation: 1, maxEdge: 2400, note: "Homepage technology band, dark." },
  { name: "section-why-us", category: "sections", match: "sections/section-why-us", hue: 0, saturation: 1, maxEdge: 2400, note: "Homepage why-us section, precision engineering." },

  // ---- Replaces the last asset from the original supplied set ----
  { name: "object-globe-etched", category: "objects", match: "objects/object-globe-etched", hue: 0, saturation: 1, trim: 6, maxEdge: 1200, note: "Static layer behind the live globe on location pages. Deliberately uncoloured — the interface tints it per market." },

  // ---- Studio and world ----
  { name: "studio-bench", category: "studio", match: "studio/studio-bench", hue: 0, saturation: 1, maxEdge: 1600, note: "/about — an electronics bench, nobody at it." },
  { name: "studio-seats", category: "studio", match: "studio/studio-seats", hue: 0, saturation: 1, maxEdge: 1600, note: "/careers — one stool pulled out, room empty." },
  { name: "world-etched-light", category: "studio", match: "studio/world-etched-light", hue: 0, saturation: 1, maxEdge: 2400, note: "Reach band and locations index, under a radial mask." },
  { name: "world-etched-dark", category: "studio", match: "studio/world-etched-dark", hue: 0, saturation: 1, maxEdge: 2400, note: "Footer band, full-bleed and cropped right." },
];

/**
 * Deliberately excluded, recorded so the decision is not re-litigated:
 *  - 4fVwNSE5  blue orbital sphere on a plinth — reads as an award trophy
 *              rather than a core; the built WebGL core is stronger.
 *  - LCH8pzMc  UI panel encased in ice — off-concept and low quality.
 *  - LfTckQJl  bronze globe close-up — redundant with the two kept maps.
 *  - RoZdeMFD  navy wireframe globe — redundant, and reads cyberpunk.
 *  - Tkmfy6IG  two phones on a desk — only 640px wide and generic.
 *  - CySG4xvj  cube cloud — its base hue is cyan, which lands in green at
 *              every rotation that would bring it near copper. Unrescuable
 *              without repainting it, so the cloud page keeps its CSS visual.
 */

/**
 * Sources are found recursively, so the brief's folders — `plates/`,
 * `objects/`, `world/`, `studio/` — work alongside the original flat drop of
 * hash-named renders.
 */
function walk(dir, base = "") {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(rel);
  }
  return out;
}

const sourceFiles = walk(SOURCE_DIR);

/**
 * `match` is either a full relative path (`plates/plate-studio-light.png`) or a
 * unique filename prefix — the first renders arrived with hashed names, and
 * keeping prefix matching means those mappings stay readable.
 *
 * Returns null rather than throwing when nothing matches. The curated list
 * below names every asset the brief asks for, most of which do not exist yet;
 * a missing file should be a line of output, not a failed build.
 */
const resolve = (match) => {
  const hit =
    sourceFiles.find((f) => f === match) ??
    sourceFiles.find((f) => path.basename(f).startsWith(path.basename(match))) ??
    sourceFiles.find((f) => f.startsWith(match));
  return hit ? path.join(SOURCE_DIR, hit) : null;
};

const manifest = {};
let totalIn = 0;
let totalOut = 0;

const pending = [];

for (const item of CURATED) {
  const source = resolve(item.match);
  if (!source) {
    pending.push(item.match);
    continue;
  }
  const outDir = path.join(OUT_DIR, item.category);
  mkdirSync(outDir, { recursive: true });

  const target = path.join(outDir, `${item.name}.webp`);

  let pipeline = sharp(source).rotate();

  // A source with alpha has to be put on white before trimming, or the studio
  // background is transparent and there is no edge to trim against.
  if (item.trim) {
    pipeline = pipeline
      .flatten({ background: "#ffffff" })
      .trim({ threshold: item.trim });
  }

  const edge = item.maxEdge ?? MAX_EDGE;
  const metadata = await sharp(source).metadata();
  if (Math.max(metadata.width, metadata.height) > edge) {
    pipeline = pipeline.resize(edge, edge, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (item.hue || item.saturation !== 1) {
    pipeline = pipeline.modulate({
      hue: item.hue || 0,
      saturation: item.saturation ?? 1,
    });
  }

  const { info } = await pipeline
    .webp({ quality: 86, effort: 5 })
    .toFile(target)
    .then(async (i) => ({ info: i }));

  // 16px-wide blur placeholder, inlined in the manifest so there is no second
  // request and no flash of empty space.
  // Trimmed identically, or the placeholder is framed differently from the
  // image that replaces it and the swap visibly jumps.
  const blurSource = item.trim
    ? sharp(source).flatten({ background: "#ffffff" }).trim({ threshold: item.trim })
    : sharp(source);

  const blur = await blurSource
    .resize(16, 16, { fit: "inside" })
    .modulate({ hue: item.hue || 0, saturation: item.saturation ?? 1 })
    .webp({ quality: 40 })
    .toBuffer();

  const inBytes = statSync(source).size;
  totalIn += inBytes;
  totalOut += info.size;

  manifest[item.name] = {
    src: `/images/${item.category}/${item.name}.webp`,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    illustrative: Boolean(item.caption),
  };

  console.log(
    `  ${item.name.padEnd(20)} ${String(info.width).padStart(4)}×${String(info.height).padEnd(4)}  ` +
      `${Math.round(inBytes / 1024)}KB → ${Math.round(info.size / 1024)}KB` +
      (item.hue ? `  hue+${item.hue}` : ""),
  );
}

mkdirSync(path.dirname(MANIFEST), { recursive: true });

// Merged, not replaced. Assets in the brief that have not been generated yet
// keep whatever they were last built from, and `platform-devices` — which is
// composited from real screenshots by build-hero-composite.mjs rather than
// generated — survives a run of this script.
let existing = {};
try {
  existing = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch {
  /* first run */
}
writeFileSync(MANIFEST, JSON.stringify({ ...existing, ...manifest }, null, 1));

const built = Object.keys(manifest).length;
console.log(
  `\n${built} built (of ${CURATED.length} in the brief, ${sourceFiles.length} files supplied) → ${OUT_DIR}` +
    `\n${Math.round(totalIn / 1024)}KB → ${Math.round(totalOut / 1024)}KB` +
    `\nmanifest: ${MANIFEST}`,
);

if (pending.length) {
  console.log(`\nNot yet supplied (${pending.length}) — see docs/image-brief.html:`);
  for (const p of pending) console.log(`  ${p}`);
}
