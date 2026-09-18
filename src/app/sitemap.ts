import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { serviceSlugs } from "@/content/services";
import { industrySlugs } from "@/content/industries";
import { marketSlugs } from "@/content/locations";
import { db } from "@/lib/db";

/**
 * Sitemap.
 *
 * Regenerated on a short revalidation window so CMS changes appear without a
 * deploy. Excluded on purpose: /admin, the API routes, anything unpublished,
 * and pages marked noindex in the SEO editor — a sitemap listing pages we tell
 * crawlers not to index is a contradictory signal.
 */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] =
  [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/products", priority: 0.7, changeFrequency: "monthly" },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" },
    { path: "/locations", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
    { path: "/clients", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/start-a-project", priority: 0.9, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Paths an administrator has marked noindex are dropped from the sitemap.
  const noindexPaths = new Set(
    await db.seoOverride
      .findMany({ where: { noindex: true }, select: { path: true } })
      .then((rows) => rows.map((row) => row.path))
      .catch(() => []),
  );

  const entries: Entry[] = [];

  const push = (entry: Entry) => {
    const path = new URL(entry.url).pathname;
    if (noindexPaths.has(path)) return;
    entries.push(entry);
  };

  for (const route of STATIC_ROUTES) {
    push({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  for (const slug of serviceSlugs) {
    push({
      url: absoluteUrl(`/services/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  for (const slug of industrySlugs) {
    push({
      url: absoluteUrl(`/industries/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const slug of marketSlugs) {
    push({
      url: absoluteUrl(`/locations/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const [projects, products, posts, jobs] = await Promise.all([
    db.project
      .findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
    db.product
      .findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
    db.post
      .findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: now } },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
    // Expired roles are excluded here as well as on the page itself. A closed
    // listing left in the sitemap is a crawl budget spent on a 404.
    db.jobOpening
      .findMany({
        where: {
          status: "PUBLISHED",
          OR: [{ closesAt: { isSet: false } }, { closesAt: { gte: now } }],
        },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
  ]);

  for (const project of projects) {
    push({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const product of products) {
    push({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  for (const post of posts) {
    push({
      url: absoluteUrl(`/insights/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const job of jobs) {
    push({
      url: absoluteUrl(`/careers/${job.slug}`),
      lastModified: job.updatedAt,
      // Roles change state more often than editorial content and have a real
      // expiry, so they are worth recrawling sooner.
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
