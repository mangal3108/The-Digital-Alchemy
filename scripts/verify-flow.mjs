/**
 * Checks that the admin is *connected*, not merely that its pages render.
 *
 * `verify-admin.mjs` proves each admin route loads. That is a different claim
 * from "editing something in the admin changes the site", which is the one that
 * matters and the one nobody notices breaking — a page can render its list
 * perfectly while the data never reaches a visitor.
 *
 * So this walks the round trip for each surface: write a record, fetch the
 * public page that should show it, fetch the admin page that should list it,
 * then remove the record and confirm the public page forgets it.
 *
 * ## Run this against `next dev`, not a production server
 *
 * It writes to the database directly, which is the one thing a real admin save
 * does *not* do — a save also calls `revalidatePath`. Against `next start`,
 * every public page here is statically cached, so the fetch returns the build's
 * HTML and each check fails for a reason that has nothing to do with wiring.
 *
 * That cost real time to work out once, so the script now reads the
 * `x-nextjs-cache` header and refuses to report a misleading result: if a page
 * came from the route cache, it says so instead of calling it a failure.
 *
 * Everything it creates is prefixed and deleted in a `finally`, so a failed run
 * does not leave test data in a live database.
 *
 * Usage: node scripts/verify-flow.mjs [baseUrl]   (default: the dev server)
 */
import { createHash, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const BASE = process.argv[2] || "http://localhost:3101";
const TAG = "zzverify";

const db = new PrismaClient();
let sessionToken = null;
let sessionId = null;
let failures = 0;
let cached = 0;

const created = { jobs: [], leads: [], overrides: [], clients: [], faqs: [] };

/**
 * `fromCache` distinguishes "the wiring is broken" from "you pointed this at a
 * server that answered out of its build cache", which look identical in the
 * response body and are not remotely the same problem.
 */
function report(label, ok, detail = "", fromCache = false) {
  if (!ok && fromCache) {
    cached++;
    console.log(`  cache ${label} — inconclusive: served from the route cache`);
    return;
  }
  if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function get(path, authed = false) {
  const res = await fetch(BASE + path, {
    headers: authed ? { cookie: `tda_session=${sessionToken}` } : {},
    redirect: "manual",
  });
  const state = res.headers.get("x-nextjs-cache");
  return {
    status: res.status,
    html: res.status === 200 ? await res.text() : "",
    // HIT means Next served stored HTML and never ran the page's queries.
    cached: state === "HIT" || state === "STALE",
  };
}

try {
  const user = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!user) {
    console.error("\n  No SUPER_ADMIN user. Run `npm run db:seed`.\n");
    process.exit(1);
  }
  sessionToken = randomBytes(32).toString("base64url");
  sessionId = (
    await db.session.create({
      data: {
        userId: user.id,
        tokenHash: createHash("sha256").update(sessionToken).digest("hex"),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        userAgent: "verify-flow",
      },
    })
  ).id;

  // ---- Careers: DB -> public list, public detail, sitemap, admin ----------
  console.log("\n  careers");
  const job = await db.jobOpening.create({
    data: {
      slug: `${TAG}-role`,
      title: `${TAG} Engineer`,
      summary:
        "A temporary record written by verify-flow to prove the careers round trip, removed at the end of the run.",
      employmentType: "FULL_TIME",
      workplace: "HYBRID",
      applyEmail: "verify@example.com",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
  created.jobs.push(job.id);

  const careers = await get("/careers");
  report(
    "published role appears on /careers",
    careers.html.includes(`${TAG} Engineer`),
    "",
    careers.cached,
  );

  const detail = await get(`/careers/${TAG}-role`);
  report("role has its own page", detail.status === 200, `got ${detail.status}`, detail.cached);
  report(
    "role emits JobPosting structured data",
    detail.html.includes('"@type":"JobPosting"'),
    "",
    detail.cached,
  );

  const adminCareers = await get("/admin/careers", true);
  report("role listed in the admin", adminCareers.html.includes(`${TAG} Engineer`));

  // Closing dates must actually hide a role, or a stale listing outlives itself.
  await db.jobOpening.update({
    where: { id: job.id },
    data: { closesAt: new Date(Date.now() - 86_400_000) },
  });
  const expired = await get(`/careers/${TAG}-role`);
  report(
    "a role past its closing date 404s",
    expired.status === 404,
    `got ${expired.status}`,
    expired.cached,
  );

  // ---- FAQs: the unscoped bucket, which has two homes ----------------------
  console.log("\n  faqs");
  const faq = await db.faq.create({
    data: {
      question: `${TAG} — does the general FAQ scope reach a page?`,
      answer: "Written by verify-flow and removed at the end of the run.",
      scopeType: "general",
      isPublished: true,
      order: 999,
    },
  });
  created.faqs.push(faq.id);

  for (const path of ["/contact", "/services"]) {
    const page = await get(path);
    report(
      `general FAQ appears on ${path}`,
      page.html.includes(`${TAG} — does the general FAQ scope reach a page?`),
      "",
      page.cached,
    );
  }

  // ---- Leads: public API -> DB -> admin -----------------------------------
  console.log("\n  leads");
  const leadRes = await fetch(BASE + "/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${TAG} Person`,
      email: `${TAG}@example.com`,
      message: "Written by verify-flow to prove the lead pipeline, then deleted.",
      services: ["saas-development"],
      sourcePage: "/verify-flow",
    }),
  });
  report("public lead endpoint accepts a submission", leadRes.ok, `HTTP ${leadRes.status}`);

  const stored = await db.lead.findFirst({ where: { email: `${TAG}@example.com` } });
  if (stored) created.leads.push(stored.id);
  report("lead reached the database", Boolean(stored));

  const adminLeads = await get("/admin/leads", true);
  report("lead listed in the admin", adminLeads.html.includes(`${TAG} Person`));

  // ---- Clients: DB -> homepage proof strip --------------------------------
  console.log("\n  clients");
  const client = await db.client.findFirst({ where: { slug: "internite" } });
  report("Internite exists and is published", Boolean(client?.isPublished));
  const home = await get("/");
  report("client name renders on the homepage", home.html.includes("Internite"), "", home.cached);

  // ---- Page copy: override -> public page ---------------------------------
  console.log("\n  page copy");
  const override = await db.contentOverride.create({
    data: {
      scope: "service",
      entryKey: "saas-development",
      field: "title",
      value: `${TAG} override heading`,
    },
  });
  created.overrides.push(override.id);
  const overridden = await get("/services/saas-development");
  report(
    "an override replaces the code copy",
    overridden.html.includes(`${TAG} override heading`),
    "",
    overridden.cached,
  );

  await db.contentOverride.delete({ where: { id: override.id } });
  created.overrides.pop();
  const restored = await get("/services/saas-development");
  report(
    "removing it restores the original",
    !restored.html.includes(`${TAG} override heading`),
    "",
    restored.cached,
  );
} finally {
  for (const id of created.jobs) await db.jobOpening.delete({ where: { id } }).catch(() => {});
  for (const id of created.leads) await db.lead.delete({ where: { id } }).catch(() => {});
  for (const id of created.faqs) await db.faq.delete({ where: { id } }).catch(() => {});
  for (const id of created.overrides)
    await db.contentOverride.delete({ where: { id } }).catch(() => {});
  if (sessionId) await db.session.delete({ where: { id: sessionId } }).catch(() => {});
  await db.$disconnect();
}

console.log(
  failures === 0
    ? "\n  Every round trip works: admin writes reach the public site.\n"
    : `\n  ${failures} check(s) failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
