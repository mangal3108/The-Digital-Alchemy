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
