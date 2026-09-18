/**
 * Maps Flow's descriptive filenames onto the brief's asset names.
 *
 * Flow names its output after the prompt — "Server_unit_pulled_from_stack_
 * 20260913171808.jpeg" — and usually returns two or three variants of each
 * subject. The build resolves assets by exact filename, so something has to
 * bridge the two, and doing it by hand across a hundred files is how mistakes
 * get made.
 *
 * Each target carries keyword groups. A candidate scores by how many groups it
 * satisfies, so "Fibre_optic_patch_panel" beats "Fibre_optic_strands" for the
 * patch-panel slot without either needing an exact name. Ties and near-ties are
 * reported rather than guessed — those are the ones worth looking at.
 *
 * Usage:
 *   node scripts/map-inbox.mjs          list the mapping, write nothing
 *   node scripts/map-inbox.mjs --apply  copy the winners into place
 *   node scripts/map-inbox.mjs --pick target=filename   override one choice
 */
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const INBOX = "images/_inbox";
const ROOT = "images";

/**
 * Flow stamps a four-pointed badge into the bottom-right of every frame, at
 * roughly x 0.86–0.95, y 0.81–0.94. It has to go — a sparkle in the corner of
 * every image on the site reads as a broken asset.
 *
 * Cropping rather than patching. Sampling a replacement from the region above
 * and feathering it in was tried first and leaves a visible rectangle on any
 * surface with structure — brushed aluminium showed it immediately. Taking the
 * corner off is lossy but never wrong, and the prompts asked for generous
 * margin precisely so there is room to do this.
 *
 * The originals in _inbox are left untouched, so this is reversible.
 */
const CROP_RIGHT = 0.15;
const CROP_BOTTOM = 0.15;

/** [folder, name, ...keyword groups]. Every group must match to score. */
const TARGETS = [
  // ---- Plates ----
  ["plates", "plate-bench-aluminium", ["aluminum", "aluminium"], ["workbench", "bench"], ["empty", "brushed", "surface"]],
  ["plates", "plate-rack-dark", ["perforated"], ["steel", "panel"]],
  ["plates", "plate-bench-light", ["sunlight", "sunlit"], ["workbench", "workshop", "bench"]],
  ["plates", "plate-esd-mat", ["anti-static", "bench_mat", "mat"], ["charcoal", "grey"]],

  // ---- Objects ----
  ["objects", "object-alchemy-core", ["sphere"], ["ribbon", "colored", "colorful", "colour"]],
  ["objects", "object-silicon-wafer", ["wafer"], ["silicon"]],
  ["objects", "object-machined-forms", ["block"], ["aluminum", "aluminium"], ["lifting", "interlocking", "assembly"]],

  // ---- Services ----
  ["services", "service-saas-development", ["server"], ["stack", "rail", "pulled"]],
  ["services", "service-custom-software-development", ["machining"], ["billet", "part", "aluminum", "aluminium"]],
  ["services", "service-web-development", ["patch_panel", "patch"], ["fibre", "fiber"], ["panel"]],
  ["services", "service-web-application-development", ["switch"], ["network"]],
  ["services", "service-mobile-app-development", ["smartphone"], ["exploded", "internals"]],
  ["services", "service-ecommerce-development", ["payment"], ["terminal"]],
  ["services", "service-ui-ux-design", ["display"], ["macro", "panel"], ["target"]],
  ["services", "service-product-design", ["prototype"], ["lined", "parts"]],
  ["services", "service-branding", ["coupon"], ["arc", "anodized", "test"]],
  ["services", "service-digital-marketing", ["antenna"], ["phased", "array"]],
  ["services", "service-search-engine-optimization", ["strand"], ["fibre", "fiber"], ["connecting", "surface", "optic"]],
  ["services", "service-social-media-management", ["camera"], ["module", "disassembled"]],
  ["services", "service-performance-marketing", ["signal"], ["generator"]],
  ["services", "service-google-ads", ["relay"], ["grid", "precision"]],
  ["services", "service-meta-ads", ["transceiver"], ["radio", "board"]],
  ["services", "service-lead-generation", ["converging"], ["ferrule", "polished", "fibre", "fiber"]],
  ["services", "service-marketing-funnels", ["waveguide"], ["section", "machined"]],
  ["services", "service-automation-integrations", ["patch_bay", "patch"], ["cable", "routed", "connected"]],
  ["services", "service-cloud-solutions", ["cold_aisle", "aisle"], ["data", "centre", "center"]],
  ["services", "service-maintenance-support", ["status_panel", "status"], ["light", "machined"]],

  // ---- Industries ----
  ["industries", "industry-startups", ["development_board", "development"], ["board"]],
  ["industries", "industry-ecommerce", ["conveyor"], ["roller", "scanner"]],
  ["industries", "industry-healthcare", ["medical"], ["enclosure"]],
  ["industries", "industry-education", ["thin-client", "thin_client", "terminal"], ["stacked", "thin"]],
  ["industries", "industry-real-estate", ["surveyor", "total_station"], ["station", "close"]],
  ["industries", "industry-finance", ["security_module", "security"], ["hardware", "module"]],
  ["industries", "industry-hospitality", ["access_point", "access"], ["wireless", "point"]],
  ["industries", "industry-professional-services", ["scanner"], ["document", "optical"]],
  ["industries", "industry-retail", ["e-ink", "eink", "shelf"], ["label"]],

  // ---- Studio & world ----
  ["studio", "studio-bench", ["workbench", "electronics"], ["solder", "electronics", "mid-project"]],
  ["studio", "studio-seats", ["stool", "workshop"], ["empty", "room", "bench"]],
  // Keyword matching cannot tell these two apart — "etched in aluminium" came
  // back as a dark plate and "on aluminium plate" as a bright one, the opposite
  // of what the names suggest. Both are pinned by filename after looking at them.
  ["studio", "world-etched-light", ["world_map_on_aluminum_plate"]],
  ["studio", "world-etched-dark", ["world_map_plaster_relief"]],
];

const files = readdirSync(INBOX).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const norm = (s) => s.toLowerCase().replace(/[\s-]+/g, "_");

function score(file, groups) {
  const n = norm(file);
  let hits = 0;
  for (const group of groups) {
    if (group.some((k) => n.includes(norm(k)))) hits++;
    else return -1; // every group must match
  }
  return hits;
}

const overrides = new Map();
for (const arg of process.argv.slice(2)) {
  if (!arg.startsWith("--pick")) continue;
  const [, pair] = arg.split("=", 1).length ? [null, arg.replace(/^--pick[= ]?/, "")] : [];
  const eq = pair.indexOf("=");
  if (eq > 0) overrides.set(pair.slice(0, eq), pair.slice(eq + 1));
}

const apply = process.argv.includes("--apply");
const used = new Set();
const rows = [];

for (const [folder, name, ...groups] of TARGETS) {
  const ranked = files
    .map((f) => ({ f, s: score(f, groups) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.f.length - b.f.length);

  const forced = overrides.get(name);
  const pick = forced ?? ranked.find((r) => !used.has(r.f))?.f ?? ranked[0]?.f ?? null;
  if (pick) used.add(pick);

  rows.push({
    folder,
    name,
    pick,
    alternatives: ranked.map((r) => r.f).filter((f) => f !== pick),
    forced: Boolean(forced),
  });
}

let copied = 0;
for (const row of rows) {
  const alt = row.alternatives.length;
  const flag = row.pick ? (alt ? `${alt} alt` : "") : "MISSING";
  console.log(
    `  ${row.name.padEnd(40)} ${(row.pick ?? "—").slice(0, 46).padEnd(48)} ${flag}`,
  );
  if (apply && row.pick) {
    const dir = path.join(ROOT, row.folder);
    mkdirSync(dir, { recursive: true });
    const src = path.join(INBOX, row.pick);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: 0,
        top: 0,
        width: Math.round(meta.width * (1 - CROP_RIGHT)),
        height: Math.round(meta.height * (1 - CROP_BOTTOM)),
      })
      .png()
      .toFile(path.join(dir, row.name + ".png"));
    copied++;
  }
}

const unmatched = files.filter((f) => !used.has(f));
console.log(
  `\n  ${rows.filter((r) => r.pick).length}/${TARGETS.length} targets matched` +
    (apply ? `, ${copied} copied into images/` : " (dry run — pass --apply)"),
);
if (unmatched.length) {
  console.log(`\n  ${unmatched.length} inbox files unused:`);
  for (const f of unmatched) console.log(`    ${f}`);
}
if (!existsSync(INBOX)) console.error(`\n  ${INBOX} not found.`);
