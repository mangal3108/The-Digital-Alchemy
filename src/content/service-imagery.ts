import type { BrandImageName } from "@/components/ui/brand-image";

/**
 * Which image belongs to which service.
 *
 * One per page now, and every one is a photograph of real hardware rather than
 * a rendered interface: rack rails for SaaS, a part-machined billet for custom
 * software, a fibre patch panel for web. Earlier versions shared twelve assets
 * across twenty pages, and before that used renders whose invented dashboards
 * carried garbled text.
 *
 * Nothing in these images is a screen. Where a page needs to show software it
 * gets a real screenshot composited into a device frame — see
 * `scripts/capture-ui.mjs`.
 *
 * Accents are set separately in `accents.ts`; each image was generated to carry
 * its page's accent on one element, so the two stay in step.
 */
export const serviceImagery: Record<string, BrandImageName> = {
  "saas-development": "service-saas-development",
  "custom-software-development": "service-custom-software-development",
  "web-development": "service-web-development",
  "web-application-development": "service-web-application-development",
  "mobile-app-development": "service-mobile-app-development",
  "ecommerce-development": "service-ecommerce-development",
  "ui-ux-design": "service-ui-ux-design",
  "product-design": "service-product-design",
  branding: "service-branding",
  "digital-marketing": "service-digital-marketing",
  "search-engine-optimization": "service-search-engine-optimization",
  "social-media-management": "service-social-media-management",
  "performance-marketing": "service-performance-marketing",
  "google-ads": "service-google-ads",
  "meta-ads": "service-meta-ads",
  "lead-generation": "service-lead-generation",
  "marketing-funnels": "service-marketing-funnels",
  "automation-integrations": "service-automation-integrations",
  "cloud-solutions": "service-cloud-solutions",
  "maintenance-support": "service-maintenance-support",
};

export function getServiceImage(slug: string): BrandImageName | undefined {
  return serviceImagery[slug];
}

export const serviceAltText: Record<string, string> = {
  "custom-software-development":
    "Dual desktop monitors displaying an internal operations dashboard with data tables alongside a tablet system architecture diagram on a dark workspace",
  "web-development":
    "Large widescreen display showing a responsive corporate website layout with a vertical code editor and synchronized mobile device on a desk",
  "saas-development":
    "Open laptop on a dark desk showing a SaaS product analytics dashboard with recurring revenue graphs and user activity metrics",
  "mobile-app-development":
    "Dark-mode smartphone on an aluminum dock displaying application controls with floating translucent UI cards",
  "web-application-development":
    "Curved widescreen monitor running an interactive browser application with modular widgets and data feeds",
  "ui-ux-design":
    "Designer working on a digital drawing tablet with a stylus sketching mobile wireframe flows next to color swatch chips",
  "product-design":
    "Close-up of interactive prototyping wireframes and digital component blueprints on a tablet workspace",
  branding:
    "Thick cream stationery debossed with an abstract geometric gold-foil emblem resting on a textured dark slate slab under warm studio light",
  "ecommerce-development":
    "Laptop and phone displaying an upscale online store interface with product grid cards, slide-out shopping cart, and checkout summary",
  "digital-marketing":
    "Multi-channel marketing intelligence dashboard showing growth trends, conversion attribution charts, and performance heatmaps",
  "search-engine-optimization":
    "Curved monitor showing search engine visibility curves, ranking trajectory charts, and site health speedometers in soft mint lighting",
  "social-media-management":
    "Mobile creative feed mockups and visual content scheduling cards with engagement metrics",
  "performance-marketing":
    "Real-time advertising dashboard showing ROAS analytics, conversion rate indicators, and audience attribution breakdowns",
  "google-ads":
    "Search ad management display showing keyword bidding performance curves and conversion rate gauges",
  "meta-ads":
    "Smartphone screen displaying social media ad creative cards with performance tags against dark ambient lighting",
  "lead-generation":
    "Dark workstation with a laptop alongside a glassmorphic inbound lead capture form card featuring input fields, consent checkbox, and an emerald submit button",
  "marketing-funnels":
    "Digital conversion funnel architecture diagram illustrating interconnected landing page and automated sequence stages",
  "automation-integrations":
    "Visual node-graph automation canvas connecting modular service endpoints with glowing data flow lines",
  "cloud-solutions":
    "Diagnostic laptop displaying automated CI/CD deployment pipelines in a pristine data center server corridor with blue LED lighting",
  "maintenance-support":
    "Operations monitoring workstation displaying 24/7 uptime health dashboards with green latency telemetry waves and security shield badges",
};

export function getServiceAltText(slug: string): string {
  return serviceAltText[slug] || "Digital technology workspace and interface";
}

/** Industry pages follow the same pattern, one photograph each. */
export const industryImagery: Record<string, BrandImageName> = {
  startups: "industry-startups",
  ecommerce: "industry-ecommerce",
  healthcare: "industry-healthcare",
  education: "industry-education",
  "real-estate": "industry-real-estate",
  finance: "industry-finance",
  hospitality: "industry-hospitality",
  "professional-services": "industry-professional-services",
  retail: "industry-retail",
};

export function getIndustryImage(slug: string): BrandImageName | undefined {
  return industryImagery[slug];
}

export const industryAltText: Record<string, string> = {
  startups:
    "High-growth startup workstation with a laptop showing MVP launch metrics and scaling curves",
  ecommerce:
    "E-commerce platform operations interface showing product catalog and order processing feeds",
  healthcare:
    "Digital health telemedicine portal and patient consultation scheduling calendar displayed on a tablet",
  education:
    "EdTech learning management platform on a laptop displaying course modules and student progress tracking",
  "real-estate":
    "Digital property development portal with architectural floor plans and property listing cards",
  finance:
    "Secure FinTech banking and investment dashboard displaying portfolio performance and compliance logs",
  hospitality:
    "Direct hospitality reservation engine with date selector and boutique suite preview cards",
  "professional-services":
    "Executive client portal on a desktop setup showing matter management and automated billing summaries",
  retail:
    "Omnichannel retail management terminal showing store inventory levels and customer loyalty sync",
};

export function getIndustryAltText(slug: string): string {
  return industryAltText[slug] || "Sector digital technology and interface";
}

