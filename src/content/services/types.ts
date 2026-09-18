/**
 * The service registry is code-owned editorial content.
 *
 * Why code and not the CMS: these twenty pages are the commercial spine of the
 * site. Their structure (capabilities, process, FAQs, internal links) is what
 * makes them rank and convert, and it needs to stay consistent. The CMS layers
 * *on top* — an administrator can override the SEO fields, attach case studies,
 * testimonials and insights, and reorder the featured set, without being able
 * to accidentally gut a page's structure.
 */

export type ServiceGroup = "development" | "design" | "growth" | "technology";

/** Which signature graphic the page hero renders. */
export type ServiceVisual =
  | "saas"
  | "software"
  | "web"
  | "webapp"
  | "mobile"
  | "ecommerce"
  | "uiux"
  | "product-design"
  | "branding"
  | "marketing"
  | "social"
  | "seo"
  | "performance"
  | "google-ads"
  | "meta-ads"
  | "leadgen"
  | "funnels"
  | "automation"
  | "cloud"
  | "support";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceCapability {
  title: string;
  body: string;
}

export interface ServiceProblem {
  title: string;
  body: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  body: string;
}

export interface Service {
  slug: string;
  /** Short label used in navigation and the mega menu. */
  name: string;
  /** Page H1. Written as an outcome, not a keyword. */
  title: string;
  group: ServiceGroup;
  visual: ServiceVisual;
  eyebrow: string;
  /** Hero supporting paragraph. */
  lede: string;
  /** One-line summary used on cards and in the mega menu. */
  summary: string;

  metaTitle: string;
  metaDescription: string;

  /** Who the service is for — rendered as a qualifying list. */
  whoFor: string[];
  /** Problems it solves, in the client's language. */
  problems: ServiceProblem[];
  /** What is actually delivered. */
  capabilities: ServiceCapability[];
  /** How the engagement runs. */
  process: ServiceProcessStep[];
  /** Concrete artefacts the client receives. */
  deliverables: string[];
  /** Keys into the technology registry. */
  technologies: string[];
  /** Keys into the engagement-model registry. */
  engagement: string[];
  faqs: ServiceFaq[];
  /** Slugs of related services — powers deliberate internal linking. */
  related: string[];
  /** Page-specific call to action label. */
  ctaLabel: string;
  /** Shown as one of the six primary cards on the homepage. */
  featured?: boolean;
}

export const SERVICE_GROUPS: Record<
  ServiceGroup,
  { label: string; blurb: string }
> = {
  development: {
    label: "Development",
    blurb: "Products and platforms, built to be maintained.",
  },
  design: {
    label: "Design",
    blurb: "Interfaces and identity that make the work legible.",
  },
  growth: {
    label: "Growth",
    blurb: "Demand, measured end to end rather than by impressions.",
  },
  technology: {
    label: "Technology",
    blurb: "The plumbing that keeps everything connected and running.",
  },
};
