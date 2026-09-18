/**
 * SEO audit.
 *
 * Crawls the sitemap of a running instance and checks what is actually served
 * — which catches CMS overrides and per-page mistakes that a check against the
 * source content would miss.
 *
 * Usage:
 *   node scripts/seo-audit.mjs                      # http://localhost:3000
 *   node scripts/seo-audit.mjs http://localhost:3100
 *
 * Exits non-zero if any page has an error-level problem, so it can gate a
 * deploy in CI.
 */

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const TITLE_LIMIT = 62;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_LIMIT = 160;

function attr(html, selector) {
  const match = html.match(selector);
  return match?.[1] ?? "";
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) {
  console.error(`Could not read ${base}/sitemap.xml — is the server running?`);
  process.exit(1);
}

const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const url = new URL(m[1]);
  return url.pathname;
});

console.log(`Auditing ${urls.length} URLs from the sitemap…\n`);

const titles = new Map();
const descriptions = new Map();
let errors = 0;
let warnings = 0;

for (const path of urls) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  const issues = [];

  if (response.status !== 200) {
    issues.push(["error", `HTTP ${response.status}`]);
  }

  const title = decode(attr(html, /<title>([^<]*)<\/title>/));
  const description = decode(
    attr(html, /<meta name="description" content="([^"]*)"/),
  );
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) issues.push(["error", "missing title"]);
  if (!description) issues.push(["error", "missing meta description"]);
  if (!canonical) issues.push(["error", "missing canonical"]);
  if (!ogImage) issues.push(["warn", "missing og:image"]);
  if (h1Count === 0) issues.push(["error", "no h1"]);
  if (h1Count > 1) issues.push(["error", `${h1Count} h1 elements`]);
  if (robots.includes("noindex")) {
    issues.push(["error", "noindex but present in sitemap"]);
  }
  if (title.length > TITLE_LIMIT) {
    issues.push(["warn", `title ${title.length} chars (over ${TITLE_LIMIT})`]);
  }
  if (description && description.length > DESCRIPTION_LIMIT) {
    issues.push([
      "warn",
      `description ${description.length} chars (over ${DESCRIPTION_LIMIT})`,
    ]);
  }
  if (description && description.length < DESCRIPTION_MIN) {
    issues.push(["warn", `description only ${description.length} chars`]);
  }

  // Structured data must parse — invalid JSON-LD is silently ignored by
  // search engines, so it fails without any visible symptom.
  for (const block of html.matchAll(
    /<script id="[^"]*" type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(block[1].replace(/\\u003c/g, "<"));
    } catch {
      issues.push(["error", "invalid JSON-LD"]);
    }
  }

  if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
  if (description) {
    descriptions.set(description, [
      ...(descriptions.get(description) ?? []),
      path,
    ]);
  }

  if (issues.length) {
    console.log(path);
    for (const [level, message] of issues) {
      console.log(`  ${level === "error" ? "✗" : "!"} ${message}`);
      if (level === "error") errors += 1;
      else warnings += 1;
    }
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1) {
    errors += 1;
    console.log(`✗ duplicate title on ${paths.join(", ")}\n    "${title}"`);
  }
}
for (const [description, paths] of descriptions) {
  if (paths.length > 1) {
    errors += 1;
    console.log(
      `✗ duplicate description on ${paths.join(", ")}\n    "${description.slice(0, 70)}…"`,
    );
  }
}

console.log(
  `\n${urls.length} pages · ${errors} error(s) · ${warnings} warning(s)`,
);
process.exit(errors ? 1 : 0);
