/**
 * Accent identity per service and section.
 *
 * The brand is the neutral system plus the *range* of these accents — no
 * single colour owns the site. A page sets `data-accent` once on its shell and
 * every component inside inherits it, so a service page needs no bespoke
 * styling to carry its own identity.
 *
 * Pairings are defined in globals.css, not here; this file only chooses which
 * scope each surface uses.
 */

export const ACCENTS = [
  "coral",
  "tangerine",
  "gold",
  "blue",
  "violet",
  "mint",
  "pink",
  "indigo",
] as const;

export type Accent = (typeof ACCENTS)[number];

/**
 * Service → accent.
 *
 * Chosen so that adjacent items in the navigation and on the services page do
 * not repeat, and so the palette reads as a spectrum rather than a set of
 * arbitrary assignments: build work sits in the blues and indigos, design in
 * violet and pink, growth in the warm end, infrastructure in mint and cyan.
 */
export const serviceAccents: Record<string, Accent> = {
  // Development — cool, structural
  "saas-development": "blue",
  "custom-software-development": "indigo",
  "web-development": "mint",
  "web-application-development": "blue",
  "mobile-app-development": "coral",
  "ecommerce-development": "pink",

  // Design — expressive
  "ui-ux-design": "violet",
  "product-design": "indigo",
  branding: "gold",

  // Growth — warm
  "digital-marketing": "tangerine",
  "search-engine-optimization": "mint",
  "social-media-management": "pink",
  "performance-marketing": "coral",
  "google-ads": "tangerine",
  "meta-ads": "pink",
  "lead-generation": "coral",
  "marketing-funnels": "violet",

  // Technology — technical, cool
  "automation-integrations": "indigo",
  "cloud-solutions": "blue",
  "maintenance-support": "mint",
};

export function getServiceAccent(slug: string): Accent {
  return serviceAccents[slug] ?? "coral";
}

/** Industry pages get their own accent so they do not all read the same. */
export const industryAccents: Record<string, Accent> = {
  startups: "coral",
  ecommerce: "pink",
  healthcare: "mint",
  education: "blue",
  "real-estate": "gold",
  finance: "indigo",
  hospitality: "tangerine",
  "professional-services": "violet",
  retail: "coral",
};

export function getIndustryAccent(slug: string): Accent {
  return industryAccents[slug] ?? "coral";
}

/** Market pages. Kept cool so the maps and globes stay calm. */
export const marketAccents: Record<string, Accent> = {
  india: "tangerine",
  "united-states": "blue",
  australia: "mint",
  "united-kingdom": "indigo",
  canada: "coral",
  uae: "gold",
};

export function getMarketAccent(slug: string): Accent {
  return marketAccents[slug] ?? "blue";
}

/**
 * Data-visualisation series colours.
 *
 * Charts previously drew every series in the house accent, which made them
 * decorative rather than readable. These are ordered so the first few are
 * maximally distinguishable, including for the most common forms of colour
 * blindness — blue and orange first, then mint, then violet.
 */
export const SERIES_COLORS = [
  "var(--color-blue)",
  "var(--color-coral)",
  "var(--color-mint)",
  "var(--color-violet)",
  "var(--color-gold)",
  "var(--color-pink)",
] as const;

/** Named channels, so the same source is the same colour on every chart. */
export const CHANNEL_COLORS: Record<string, string> = {
  organic: "var(--color-mint)",
  paid: "var(--color-coral)",
  social: "var(--color-pink)",
  referral: "var(--color-blue)",
  direct: "var(--color-violet)",
  email: "var(--color-gold)",
};
