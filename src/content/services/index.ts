import { developmentServices } from "./development";
import { designServices } from "./design";
import { growthServices } from "./growth";
import { technologyServices } from "./technology";
import type { Service, ServiceGroup } from "./types";

export * from "./types";

/** Every service, in the order they appear on /services. */
export const services: Service[] = [
  ...developmentServices,
  ...designServices,
  ...growthServices,
  ...technologyServices,
];

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

  const duplicates = serviceSlugs.filter(
    (slug, index) => serviceSlugs.indexOf(slug) !== index,
  );
  if (duplicates.length) {
    throw new Error(`Duplicate service slugs: ${duplicates.join(", ")}`);
  }
}
