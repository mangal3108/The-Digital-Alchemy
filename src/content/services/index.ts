import { developmentServices } from "./development";
import { designServices } from "./design";
import { growthServices } from "./growth";
import { technologyServices } from "./technology";
import { SERVICE_GROUP_ORDER, type Service, type ServiceGroup } from "./types";

export * from "./types";

/**
 * Display order within each group. Which group a service is in comes from its
 * own `group` field; this only says where it sits. Overview pages come before
 * the services they summarise (Digital Marketing, then Performance Marketing
 * before Google Ads and Meta Ads).
 */
const SERVICE_ORDER = [
  // Get a website
  "web-development",
  "ecommerce-development",
  // Build an app or software
  "mobile-app-development",
  "web-application-development",
  "custom-software-development",
  "saas-development",
  // Get more customers
  "digital-marketing",
  "search-engine-optimization",
  "performance-marketing",
  "google-ads",
  "meta-ads",
  "social-media-management",
  "lead-generation",
  "marketing-funnels",
  // Automate your work with AI
  "automation-integrations",
  // Design & branding
  "ui-ux-design",
  "product-design",
  "branding",
  // Keep it running
  "cloud-solutions",
  "maintenance-support",
];

const rank = (service: Service) =>
  SERVICE_GROUP_ORDER.indexOf(service.group) * 100 + SERVICE_ORDER.indexOf(service.slug);

/** Every service, grouped by what the customer wants, in display order. */
export const services: Service[] = [
  ...developmentServices,
  ...designServices,
  ...growthServices,
  ...technologyServices,
].sort((a, b) => rank(a) - rank(b));

const bySlug = new Map(services.map((service) => [service.slug, service]));

export function getService(slug: string): Service | undefined {
  return bySlug.get(slug);
}

export function getServices(slugs: readonly string[]): Service[] {
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((service): service is Service => Boolean(service));
}

export function getServicesByGroup(group: ServiceGroup): Service[] {
  return services.filter((service) => service.group === group);
}

/** The six primary cards on the homepage. */
export function getFeaturedServices(): Service[] {
  return services.filter((service) => service.featured);
}

export const serviceSlugs = services.map((service) => service.slug);

export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

/**
 * Development-time guard. A typo in a `related` array would silently produce a
 * dead internal link, which is exactly the kind of rot this site is meant to
 * avoid, so it fails loudly during the build instead.
 */
if (process.env.NODE_ENV !== "production") {
  for (const service of services) {
    for (const related of service.related) {
      if (!bySlug.has(related)) {
        throw new Error(
          `Service "${service.slug}" links to unknown related service "${related}".`,
        );
      }
    }
    if (service.related.includes(service.slug)) {
      throw new Error(`Service "${service.slug}" lists itself as related.`);
    }
  }

  // A service missing from SERVICE_ORDER would still render, but sort to an
  // arbitrary position; one with no one-liner would show a blank line in the
  // menu. Both are caught here rather than noticed on the live site.
  for (const service of services) {
    if (!SERVICE_ORDER.includes(service.slug)) {
      throw new Error(`Service "${service.slug}" is missing from SERVICE_ORDER.`);
    }
    if (!service.oneLiner?.trim()) {
      throw new Error(`Service "${service.slug}" has no oneLiner.`);
    }
  }

  const duplicates = serviceSlugs.filter(
    (slug, index) => serviceSlugs.indexOf(slug) !== index,
  );
  if (duplicates.length) {
    throw new Error(`Duplicate service slugs: ${duplicates.join(", ")}`);
  }
}
