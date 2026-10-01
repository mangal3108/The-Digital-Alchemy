/**
 * Checks what visitors actually read, on every page in the sitemap.
 *
 * The plain-language rework has a testable finish line: no word from the
 * "remove" list anywhere in rendered copy. Grepping the source cannot prove
 * that — copy is assembled from data files, shared summaries and components,
 * and one reused sentence can put a term on sixteen pages. So this reads the
 * served HTML instead: body text including the header and footer, plus titles,
 * meta descriptions and image alt text.
 *
 * It also checks the things that must never regress, whatever phase we are in:
 *
 *   - "localhost" anywhere in a page (it once shipped as every canonical URL)
 *   - a "{{TODO" placeholder (prices and timelines the owner has not set yet)
 *   - a note meant for the administrator ("Admin → …") in a page's visible text
 *   - canonical URLs on a different origin from the sitemap's
 *   - exactly one <h1> per page
 *   - a title and a meta description on every page
 *   - internal links that do not resolve
 *
 * Those always fail the run. Jargon is reported, and fails the run only with
 * --strict, because until the copy rewrite is finished it is expected.
 *
 * Limits, stated so nobody over-trusts a pass:
 *   - It sees server-rendered HTML. UI that only renders after interaction
 *     (the open mega menu, the chatbot's replies) is not read.
 *   - "Explain" terms are counted, not judged: whether a term was explained in
 *     plain words the first time it appears still needs a human.
 *
 * Usage: node scripts/audit-copy.mjs [baseUrl] [--strict] [--json path]
 */
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:\/\//.test(a)) || "http://127.0.0.1:3100").replace(/\/$/, "");
const STRICT = args.includes("--strict");
const jsonAt = args.indexOf("--json");
const JSON_OUT = jsonAt >= 0 ? args[jsonAt + 1] : null;

/** Terms the brief removes outright. Each needs a plain replacement, not a gloss. */
export const REMOVE = {
  "AI-ready": /\bAI[- ]ready\b/gi,
  "AI-native": /\bAI[- ]native\b/gi,
  autonomous: /\bautonomous(ly)?\b/gi,
  agentic: /\bagentic\b/gi,
  "compound growth / growth engine": /\bcompound(ing)? growth\b|\bgrowth engines?\b|\bcompound(s)? in value\b/gi,
  "10x / leverage": /\b10x\b|\bleverage\b/gi,
  "unfair advantage": /\bunfair advantage\b/gi,
  "Apple-grade": /\bApple[- ]grade\b/gi,
  "architect (verb)": /\barchitect(s|ed|ing)?\b(?!ure)/gi,
  idempotency: /\bidempoten(cy|t)\b/gi,
  "dead-letter": /\bdead[- ]letter\b/gi,
  "multi-tenant": /\bmulti[- ]?tenan(t|cy)\b/gi,
  RAG: /\bRAG\b/g,
  deterministic: /\bdeterministic\b/gi,
  orchestration: /\borchestrat(e|es|ed|ion|ing)\b/gi,
};

/** Terms that may stay only if explained in plain words the first time. */
export const EXPLAIN = {
  SaaS: /\bSaaS\b/g,
  API: /\bAPIs?\b/g,
  CRM: /\bCRMs?\b/g,
  LLM: /\bLLMs?\b/g,
  conversion: /\bconversions?\b/gi,
  funnel: /\bfunnels?\b/gi,
  pipeline: /\bpipelines?\b/gi,
  workflow: /\bworkflows?\b/gi,
  integration: /\bintegrations?\b/gi,
  scalable: /\bscal(able|ability)\b/gi,
  MVP: /\bMVPs?\b/g,
  "ROI / ROAS": /\b(ROI|ROAS)\b/g,
  "CPA / CPL / CTR / CAC": /\b(CPA|CPL|CTR|CAC|LTV)\b/g,
  "B2B / B2C / D2C": /\b(B2B|B2C|D2C)\b/g,
};

/** Anything a visitor could read as a factual claim. Each one must be real. */
const STAT =
  /(?:[$₹€£]\s?\d[\d,.]*\s?(?:k|K|L|lakh|crore|M|million)?|\b\d[\d,.]*\s?%|\b\d+(?:\.\d+)?\s?x\b|\b\d+(?:\.\d+)?\s?\/\s?5(?:\.0)?\b|\b\d{2,}[\d,]*\s?K\b)/g;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

function visibleText(html) {
  return decode(
    html
      .replace(/<head[\s\S]*?<\/head>/i, " ")
      // Next 15 streams metadata into the body; the title is read separately.
      .replace(/<title[\s\S]*?<\/title>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

const attr = (html, re) => decode((html.match(re) || [])[1] || "");
const snippet = (text, index, len) =>
  "…" + text.slice(Math.max(0, index - 45), index + len + 45).trim() + "…";

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  return { status: res.status, html: res.status < 300 ? await res.text() : "" };
}

// ---- Collect pages from the sitemap ---------------------------------------
const sitemap = await get("/sitemap.xml");
if (sitemap.status !== 200) {
  console.error(`\n  Could not read ${BASE}/sitemap.xml (HTTP ${sitemap.status}).\n`);
  process.exit(1);
}
const locs = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const origins = new Set(locs.map((u) => new URL(u).origin));
const paths = [...new Set(locs.map((u) => new URL(u).pathname))];

const hard = [];
const pages = [];
const links = new Map();

for (const origin of origins) {
  if (/localhost|127\.0\.0\.1/.test(origin)) hard.push(`sitemap: URLs point at ${origin}`);
}

for (const path of paths) {
  const { status, html } = await get(path);
  if (status !== 200) {
    hard.push(`${path}: HTTP ${status}`);
    continue;
  }

  const body = visibleText(html);
  const title = attr(html, /<title>([\s\S]*?)<\/title>/i);
  const description = attr(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/i);
  const alts = [...html.matchAll(/<img\b[^>]*\balt="([^"]+)"/gi)].map((m) => decode(m[1]));
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const readable = [title, description, body, ...alts].join(" ‖ ");

  if (/localhost/.test(html)) hard.push(`${path}: "localhost" appears ${(html.match(/localhost/g) || []).length}×`);
  if (/\{\{\s*TODO|TODO \(only visible in development\)/.test(html)) hard.push(`${path}: an owner TODO placeholder is on the public page`);
  if (/site administrator|Admin →/i.test(body)) hard.push(`${path}: a note meant for the site administrator is on the public page`);
  if (canonical && !origins.has(new URL(canonical, BASE).origin))
    hard.push(`${path}: canonical ${canonical} is off the sitemap origin`);
  if (h1 !== 1) hard.push(`${path}: ${h1} <h1> elements`);
  if (!title) hard.push(`${path}: no <title>`);
  if (!description) hard.push(`${path}: no meta description`);

  const remove = [];
  for (const [term, re] of Object.entries(REMOVE)) {
    for (const m of readable.matchAll(re)) remove.push({ term, at: snippet(readable, m.index, m[0].length) });
  }
  const explain = {};
  for (const [term, re] of Object.entries(EXPLAIN)) {
    const n = (readable.match(re) || []).length;
    if (n) explain[term] = n;
  }
  const stats = [...new Set((body.match(STAT) || []).map((s) => s.trim()))];

  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)[^"]*"/gi)) {
    const href = m[1] === "" ? "/" : m[1];
    if (!links.has(href)) links.set(href, new Set());
    links.get(href).add(path);
  }

  pages.push({ path, title, description, h1, remove, explain, stats });
}

// ---- Every internal link must resolve -------------------------------------
for (const [href, from] of links) {
  if (/^\/(_next|api)\//.test(href) || /\.[a-z0-9]{2,5}$/i.test(href)) continue;
  const res = await fetch(BASE + href, { redirect: "manual" });
  if (res.status >= 400) hard.push(`broken link ${href} (HTTP ${res.status}) on ${[...from].slice(0, 3).join(", ")}`);
}

// ---- Report ---------------------------------------------------------------
const totals = {};
for (const p of pages) for (const r of p.remove) totals[r.term] = (totals[r.term] || 0) + 1;
const jargonPages = pages.filter((p) => p.remove.length);
const allStats = {};
for (const p of pages) for (const s of p.stats) (allStats[s] ||= []).push(p.path);

console.log(`\n  ${BASE} — ${pages.length} pages, ${links.size} internal links\n`);

console.log(hard.length ? `  MUST FIX (${hard.length})` : "  must-fix checks: all pass");
for (const h of hard) console.log(`    ✗ ${h}`);

console.log(`\n  Remove-list terms: ${Object.values(totals).reduce((a, b) => a + b, 0)} on ${jargonPages.length} pages`);
for (const [term, n] of Object.entries(totals).sort((a, b) => b[1] - a[1]))
  console.log(`    ${String(n).padStart(4)}  ${term}`);

console.log(`\n  Statistic-shaped text (each must be real): ${Object.keys(allStats).length}`);
for (const [s, where] of Object.entries(allStats))
  console.log(`    ${s.padEnd(12)} ${where.slice(0, 4).join(", ")}${where.length > 4 ? " …" : ""}`);

if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify({ base: BASE, hard, pages }, null, 1));
  console.log(`\n  per-page detail: ${JSON_OUT}`);
}

const jargonFails = STRICT && jargonPages.length > 0;
console.log(
  hard.length === 0 && !jargonFails
    ? "\n  PASS\n"
    : `\n  FAIL${jargonFails ? " (--strict: remove-list terms remain)" : ""}\n`,
);
process.exit(hard.length === 0 && !jargonFails ? 0 : 1);
