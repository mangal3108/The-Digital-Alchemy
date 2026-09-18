/**
 * Asserts that every class the site actually renders has a rule in the CSS.
 *
 * This exists because of a failure that shipped: Tailwind's scanner could not
 * read the filesystem, generated zero utilities, and still produced a large,
 * valid stylesheet — the theme block and hand-written rules in `globals.css`
 * pass through regardless. Type checking, linting, the production build and the
 * SEO audit all passed. Every page rendered unstyled.
 *
 * The lesson is that checking the stylesheet for tokens proves nothing, because
 * tokens are exactly the part that survives the failure. The only honest check
 * compares the two sides against each other: pull the classes out of the
 * rendered HTML, pull the selectors out of the served CSS, and diff them.
 *
 * Usage: node scripts/verify-css.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:3000";

/** A representative page per layout family, not every route. */
const ROUTES = [
  "/",
  "/services",
  "/services/saas-development",
  "/services/ui-ux-design",
  "/industries/healthcare",
  "/locations/india",
  "/work",
  "/about",
  "/contact",
  "/start-a-project",
  "/insights",
  "/careers",
  "/privacy",
];

/**
 * Classes that correctly have no rule of their own: styling hooks that only
 * ever appear in a descendant selector, and icon-library identifiers.
 */
const MARKERS = new Set(["group", "peer", "lucide", "dark", "light"]);
const MARKER_PREFIXES = ["lucide-", "swiper-", "sr-"];

function isMarker(cls) {
  return MARKERS.has(cls) || MARKER_PREFIXES.some((p) => cls.startsWith(p));
}

/** Tailwind escapes CSS-special characters in selectors, e.g. `.lg\:hidden`. */
function selectorRe(cls) {
  const body = [...cls]
    .map((ch) =>
      /[a-zA-Z0-9_-]/.test(ch)
        ? ch
        : "\\\\?" + ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("");
  return new RegExp("\\." + body + "(?![a-zA-Z0-9_\\-])");
}

/**
 * Class attributes arrive HTML-escaped, so `[&>div]:h-2` is served as
 * `[&amp;&gt;div]:h-2`. Comparing that against the CSS reports a false miss.
 */
function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, "&");
}

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const classes = new Set();
const cssUrls = new Set();
const reached = [];

for (const route of ROUTES) {
  let html;
  try {
    html = await get(BASE + route);
  } catch (err) {
    console.error(`  ! ${route} — ${err.message}`);
    continue;
  }
  reached.push(route);
  for (const m of html.matchAll(/class(?:Name)?="([^"]*)"/g)) {
    for (const cls of decodeEntities(m[1]).split(/\s+/)) if (cls) classes.add(cls);
  }
  // The dev server appends a `?v=` cache-buster the production build omits.
  for (const m of html.matchAll(
    /href="(\/_next\/static\/css\/[^"]+?\.css(?:\?[^"]*)?)"/g,
  )) {
    cssUrls.add(decodeEntities(m[1]));
  }
}

if (reached.length === 0) {
  console.error(`\nNo pages reachable at ${BASE}. Is the server running?\n`);
  process.exit(1);
}

let css = "";
for (const url of cssUrls) css += await get(BASE + url);

if (css.length === 0) {
  console.error("\nNo stylesheet found on any page.\n");
  process.exit(1);
}

const missing = [...classes]
  .filter((c) => !isMarker(c))
  .filter((c) => !selectorRe(c).test(css))
  .sort();

console.log(`\n  pages    ${reached.length}/${ROUTES.length}`);
console.log(`  stylesheets ${cssUrls.size} · ${css.length} bytes`);
console.log(`  classes  ${classes.size} distinct`);
console.log(`  missing  ${missing.length}`);

if (missing.length > 0) {
  console.error("\nClasses used in HTML with no rule in the CSS:\n");
  for (const c of missing.slice(0, 60)) console.error("  " + c);
  if (missing.length > 60) console.error(`  … and ${missing.length - 60} more`);
  console.error(
    "\nIf these are Tailwind utilities, the class list handed to Tailwind is\n" +
      "incomplete — see scripts/postcss-inline-sources.cjs.\n",
  );
  process.exit(1);
}

console.log("\nEvery rendered class has a matching rule.\n");
