/**
 * Database seed.
 *
 * Runs with `npm run db:seed` (Node strips the types directly — no extra
 * toolchain). Deliberately self-contained: it imports only Prisma and bcrypt,
 * so it cannot drift out of sync with application module resolution.
 *
 * PROVENANCE RULES
 *  - Content marked MIGRATED came from the live WordPress site at
 *    thedigitalalchemy.co.in, audited 2026-09-06.
 *  - Metrics are created with EMPTY values and isPublished = false. Nothing
 *    invents a statistic; an administrator has to enter real figures and turn
 *    each one on before it appears anywhere.
 *  - No client logos, case studies, team members or awards are seeded, because
 *    none could be verified.
 *
 * Site settings are intentionally NOT seeded: `getSiteSettings()` already
 * falls back to the verified defaults in src/config/site.ts, and the admin
 * settings screen writes rows only when a value is actually changed. That
 * keeps one source of truth instead of two.
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
  if (!email) {
    console.log(
      "\n[seed] No ADMIN_EMAIL set — skipping admin user.\n" +
        "       Set ADMIN_EMAIL (and optionally ADMIN_PASSWORD) in .env, then re-run\n" +
        "       `npm run db:seed` to create the first Super Admin.\n",
    );
    return;
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] Admin user already exists: ${email}`);
    return;
  }

  // Never invent a credential silently: if none is supplied we generate a
  // strong one and print it exactly once.
  const supplied = process.env.ADMIN_PASSWORD;
  const password = supplied || randomBytes(18).toString("base64url");

  await db.user.create({
    data: {
      email,
      name: process.env.ADMIN_NAME ?? "Administrator",
      passwordHash: await bcrypt.hash(password, 12),
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log(`\n[seed] Created Super Admin: ${email}`);
  if (!supplied) {
    console.log(`[seed] Generated password: ${password}`);
    console.log("[seed] Store it now — it is not recoverable, only resettable.\n");
  }
}

/**
 * Metric slots, ready for real numbers. Every one is unpublished with an empty
 * value: the previous site displayed counters stuck at "1", and showing
 * nothing is strictly better than showing a wrong or invented figure.
 */
const METRICS = [
  { key: "projects-delivered", label: "Projects delivered", order: 0 },
  { key: "clients", label: "Clients", order: 1 },
  { key: "countries-served", label: "Countries served", order: 2 },
  { key: "years-experience", label: "Years in business", order: 3 },
  { key: "customer-satisfaction", label: "Client satisfaction", order: 4, suffix: "%" },
  { key: "ad-spend-managed", label: "Ad spend managed", order: 5 },
  { key: "leads-generated", label: "Leads generated", order: 6 },
];

async function seedMetrics() {
  for (const metric of METRICS) {
    await db.metric.upsert({
      where: { key: metric.key },
      update: {},
      create: {
        key: metric.key,
        label: metric.label,
        value: "",
        suffix: metric.suffix ?? null,
        note: null,
        isPublished: false,
        order: metric.order,
      },
    });
  }
  console.log(`[seed] Metric slots ready: ${METRICS.length} (all unpublished)`);
}

/**
 * MIGRATED — 301s from the WordPress URL structure.
 * Verified live paths: /, /about/, /services-2/, /contact-2/, /portfolio/,
 * /home-2/. Losing these would discard the search history the domain already
 * has, so they are seeded rather than left to be remembered at launch.
 */
const REDIRECTS: { source: string; destination: string; note: string }[] = [
  { source: "/home-2", destination: "/", note: "WordPress duplicate home page" },
  { source: "/home-2/", destination: "/", note: "WordPress duplicate home page" },
  { source: "/services-2", destination: "/services", note: "WordPress services page" },
  { source: "/services-2/", destination: "/services", note: "WordPress services page" },
  { source: "/contact-2", destination: "/contact", note: "WordPress contact page" },
  { source: "/contact-2/", destination: "/contact", note: "WordPress contact page" },
  { source: "/portfolio", destination: "/work", note: "WordPress portfolio page (was empty)" },
  { source: "/portfolio/", destination: "/work", note: "WordPress portfolio page (was empty)" },
  { source: "/about/", destination: "/about", note: "Trailing-slash normalisation" },
  { source: "/feed", destination: "/insights", note: "WordPress RSS feed" },
  { source: "/feed/", destination: "/insights", note: "WordPress RSS feed" },
  { source: "/comments/feed", destination: "/insights", note: "WordPress comments feed" },
  { source: "/comments/feed/", destination: "/insights", note: "WordPress comments feed" },
];

async function seedRedirects() {
  for (const redirect of REDIRECTS) {
    await db.redirect.upsert({
      where: { source: redirect.source },
      update: {},
      create: {
        source: redirect.source,
        destination: redirect.destination,
        statusCode: 301,
        isActive: true,
        note: redirect.note,
      },
    });
  }
  console.log(`[seed] Redirects ready: ${REDIRECTS.length}`);
}

const CATEGORIES = [
  { slug: "saas", name: "SaaS", order: 0 },
  { slug: "software-development", name: "Software Development", order: 1 },
  { slug: "web-development", name: "Web Development", order: 2 },
  { slug: "app-development", name: "App Development", order: 3 },
  { slug: "ui-ux", name: "UI/UX", order: 4 },
  { slug: "digital-marketing", name: "Digital Marketing", order: 5 },
  { slug: "seo", name: "SEO", order: 6 },
  { slug: "social-media", name: "Social Media", order: 7 },
  { slug: "business-growth", name: "Business Growth", order: 8 },
];

async function seedCategories() {
  for (const category of CATEGORIES) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`[seed] Insight categories ready: ${CATEGORIES.length}`);
}

/**
 * MIGRATED — the only testimonial published on the live site, carried over
 * verbatim. It is flagged `isMigrated` so the admin list shows it as needing
 * verification: the source gives a first name and a vague role only, and the
 * "200% in 3 months" claim should be confirmed with the client before it keeps
 * running on the new site.
 */
async function seedMigratedTestimonial() {
  const quote =
    "The Digital Alchemy helped us increase leads by 200% in 3 months. Highly recommended!";

  const existing = await db.testimonial.findFirst({ where: { quote } });
  if (existing) {
    console.log("[seed] Migrated testimonial already present");
    return;
  }

  await db.testimonial.create({
    data: {
      quote,
      authorName: "Aakash",
      position: "Digital marketing",
      company: null,
      country: null,
      rating: 5,
      isMigrated: true,
      // Published because it is the client's own existing content, but flagged
      // for verification rather than quietly presented as newly sourced.
      isPublished: true,
      isFeatured: true,
      order: 0,
    },
  });

  console.log("[seed] Migrated 1 testimonial from the previous site");
}

async function main() {
  console.log("[seed] Starting…");
  await seedAdminUser();
  await seedMetrics();
  await seedRedirects();
  await seedCategories();
  await seedMigratedTestimonial();
  console.log("[seed] Done.");
}

main()
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
