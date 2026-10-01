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

/**
 * Services are grouped by what the customer wants, not by which of our teams
 * does the work. Visitors think "I need more customers", not "I need growth
 * marketing" — so the groups are named in their words.
 */
export type ServiceGroup =
  | "website"
  | "software"
  | "customers"
  | "automation"
  | "design"
  | "running";

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
  /**
   * One plain sentence saying what this is, for someone with no technical
   * background. Shown under the service name in the menu, and the base for the
   * page's intro. No jargon: if a word needs explaining, it does not belong here.
   */
  oneLiner: string;
  /**
   * Finishes the sentence "You need this when…". Shown on related-service
   * cards, so a visitor can tell whether the neighbouring service is for them.
   */
  needItWhen: string;
  /**
   * A before-and-after for a typical business. Always rendered under an
   * "Example" label and never presented as a client story: nobody named here is
   * a client. No figures, because an example cannot promise a result.
   */
  example: { business: string; before: string; after: string };
  /**
   * Starting price, including currency ("₹60,000"). Empty until the owner sets
   * it — in this file or in Admin → Page copy. The key must exist even when
   * empty, because admin overrides only replace keys the object already has.
   * While empty, the page says every project is priced on what it needs.
   */
  priceFrom: string;
  /** Typical time from start to launch ("4 to 8 weeks"). Empty until set. */
  typicalTimeline: string;
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
  /** Shown as one of the six primary cards on the homepage. */
  featured?: boolean;
}

export const SERVICE_GROUPS: Record<
  ServiceGroup,
  { label: string; blurb: string }
> = {
  website: {
    label: "Get a website",
    blurb: "A business website or online store that loads fast and brings you enquiries.",
  },
  software: {
    label: "Build an app or software",
    blurb: "Apps, portals and software made for the way your business works.",
  },
  customers: {
    label: "Get more customers",
    blurb: "We bring people to your business through Google, Instagram and more.",
  },
  automation: {
    label: "Automate your work with AI",
    blurb: "Tools that do your repetitive work for you, like replying to leads or sending invoices.",
  },
  design: {
    label: "Design & branding",
    blurb: "Make your brand look good and your app easy to use.",
  },
  running: {
    label: "Keep it running",
    blurb: "Hosting, updates and fixes that keep your website or app fast, safe and online.",
  },
};

/** The order groups appear in the menu, on /services and in the picker. */
export const SERVICE_GROUP_ORDER: ServiceGroup[] = [
  "website",
  "software",
  "customers",
  "automation",
  "design",
  "running",
];
