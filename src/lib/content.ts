import { cache } from "react";
import { db } from "./db";
import { parseJson } from "./utils";

/**
 * Read-side helpers for CMS content.
 *
 * Every query here is wrapped so a database failure degrades the page rather
 * than breaking it: sections that have no content simply do not render. That
 * is also what keeps the "never invent client logos or statistics" rule
 * structural rather than a matter of discipline — an empty table means an
 * absent section, not a placeholder.
 */

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("[content] query failed", error);
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Projects / case studies
// ---------------------------------------------------------------------------

const publishedProject = { status: "PUBLISHED" as const };

export const getPublishedProjects = cache(async (limit?: number) =>
  safe(
    db.project.findMany({
      where: publishedProject,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        hero: true,
        client: true,
        results: { orderBy: { order: "asc" } },
      },
    }),
    [],
  ),
);

export const getFeaturedProjects = cache(async (limit = 3) =>
  safe(
    db.project.findMany({
      where: { ...publishedProject, isFeatured: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        hero: true,
        client: true,
        results: { orderBy: { order: "asc" } },
      },
    }),
    [],
  ),
);

export const getProjectBySlug = cache(async (slug: string) =>
  safe(
    db.project.findFirst({
      where: { slug, ...publishedProject },
      include: {
        hero: true,
        client: { include: { logo: true } },
        media: { include: { media: true }, orderBy: { order: "asc" } },
        results: { orderBy: { order: "asc" } },
        testimonials: {
          where: { isPublished: true },
          include: { photo: true },
          take: 1,
        },
      },
    }),
    null,
  ),
);

/** Projects tagged with a given service slug, for related-work sections. */
export const getProjectsForService = cache(async (serviceSlug: string, limit = 3) => {
  const projects = await getPublishedProjects();
  return projects
    .filter((project) =>
      parseJson<string[]>(project.services, []).includes(serviceSlug),
    )
    .slice(0, limit);
});

export const getAdjacentProject = cache(async (slug: string) => {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return projects[(index + 1) % projects.length] ?? null;
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const getPublishedProducts = cache(async () =>
  safe(
    db.product.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { logo: true, media: { include: { media: true }, orderBy: { order: "asc" } } },
    }),
    [],
  ),
);

export const getProductBySlug = cache(async (slug: string) =>
  safe(
    db.product.findFirst({
      where: { slug, isPublished: true },
      include: { logo: true, media: { include: { media: true }, orderBy: { order: "asc" } } },
    }),
    null,
  ),
);

// ---------------------------------------------------------------------------
// Testimonials, clients, team, metrics
// ---------------------------------------------------------------------------

export const getTestimonials = cache(async (limit?: number) =>
  safe(
    db.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      take: limit,
      include: { photo: true, project: true, client: { include: { logo: true } } },
    }),
    [],
  ),
);

/**
 * Clients approved for public display.
 *
 * `showLogo` is the approval flag, and it is the only gate. A client without
 * artwork is still included: the strip renders their name instead, and a
 * client can permit being named without supplying a mark. Requiring a logo
 * here meant an approved client simply never appeared, with nothing to
 * indicate why.
 */
export const getLogoWallClients = cache(async () =>
  safe(
    db.client.findMany({
      where: { isPublished: true, showLogo: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { logo: true },
    }),
    [],
  ),
);

export const getPublishedClients = cache(async () =>
  safe(
    db.client.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { logo: true, projects: { where: publishedProject } },
    }),
    [],
  ),
);

export const getTeam = cache(async () =>
  safe(
    db.teamMember.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { photo: true },
    }),
    [],
  ),
);

/** Metrics are unpublished by default, so nothing invented can reach a page. */
export const getPublishedMetrics = cache(async () =>
  safe(
    db.metric.findMany({
      where: { isPublished: true, NOT: { value: "" } },
      orderBy: { order: "asc" },
    }),
    [],
  ),
);

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export const getPublishedPosts = cache(async (limit?: number) =>
  safe(
    db.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: { hero: true, author: true, category: true },
    }),
    [],
  ),
);

export const getPostBySlug = cache(async (slug: string) =>
  safe(
    db.post.findFirst({
      where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      include: {
        hero: true,
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    null,
  ),
);

export const getCategories = cache(async () =>
  safe(db.category.findMany({ orderBy: { order: "asc" } }), []),
);

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

/**
 * Extra FAQs an administrator has attached to a page, merged with the registry.
 *
 * An unscoped FAQ is matched with `isSet: false` rather than `null`: MongoDB
 * omits an unset optional field rather than storing a null, so `scopeKey: null`
 * matches no document at all. Only the "general" scope is affected — service,
 * industry and location always carry a key — but that is the scope `/contact`
 * and `/services` read, so getting it wrong empties both of them.
 */
export const getScopedFaqs = cache(
  async (scopeType: string, scopeKey?: string) =>
    safe(
      db.faq.findMany({
        where: {
          scopeType,
          scopeKey: scopeKey ? scopeKey : { isSet: false },
          isPublished: true,
        },
        orderBy: { order: "asc" },
      }),
      [],
    ),
);

// ---------------------------------------------------------------------------
// Navigation featured item
// ---------------------------------------------------------------------------

export const getNavFeatured = cache(async () => {
  const [project] = await getFeaturedProjects(1);
  if (!project) return null;
  return {
    title: project.title,
    client: project.client?.name ?? project.clientName ?? null,
    href: `/work/${project.slug}`,
    imageUrl: project.hero?.url ?? null,
    imageAlt: project.hero?.alt || project.title,
    category: project.category,
  };
});

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

/**
 * Open roles, in display order.
 *
 * A role stays visible only while it is PUBLISHED and, if a closing date was
 * set, while that date has not passed. Expiring on `closesAt` matters more
 * than it looks: Google Jobs treats a listing that outlives its stated close
 * date as stale, and an applicant who finds one has been wasted.
 */
export const getPublishedJobs = cache(async () =>
  safe(
    db.jobOpening.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ closesAt: { isSet: false } }, { closesAt: { gte: new Date() } }],
      },
      orderBy: [{ orderIndex: "asc" }, { publishedAt: "desc" }],
    }),
    [],
  ),
);

export const getJobBySlug = cache(async (slug: string) =>
  safe(
    db.jobOpening.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        OR: [{ closesAt: { isSet: false } }, { closesAt: { gte: new Date() } }],
      },
    }),
    null,
  ),
);
