import { getServices, serviceHref, type Service } from "./services";
import { industries } from "./industries";
import { markets } from "./locations";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  key: string;
  label: string;
  blurb: string;
  links: NavLink[];
}

/**
 * The mega menu is generated from the service registry rather than maintained
 * separately, so a new service cannot end up unlinked from navigation.
 */
function toLinks(services: Service[]): NavLink[] {
  return services.map((service) => ({
    label: service.name,
    href: serviceHref(service.slug),
    description: service.summary,
  }));
}

export const megaMenuColumns: MegaMenuColumn[] = [
  {
    key: "development",
    label: "Development",
    blurb: "AI-ready products, SaaS platforms, and custom software built to scale.",
    links: toLinks(
      getServices([
        "saas-development",
        "custom-software-development",
        "web-development",
        "web-application-development",
        "mobile-app-development",
        "ecommerce-development",
      ]),
    ),
  },
  {
    key: "design",
    label: "Design",
    blurb: "Apple-grade interfaces and brand identity that make products feel effortless.",
    links: toLinks(getServices(["ui-ux-design", "product-design", "branding"])),
  },
  {
    key: "growth",
    label: "Growth",
    blurb: "Demand generation, measured end to end.",
    links: toLinks(
      getServices([
        "digital-marketing",
        "search-engine-optimization",
        "social-media-management",
        "performance-marketing",
        "google-ads",
        "meta-ads",
        "lead-generation",
        "marketing-funnels",
      ]),
    ),
  },
  {
    key: "technology",
    label: "AI & Technology",
    blurb: "Intelligent agent automations, integrations, and cloud infrastructure.",
    links: toLinks(
      getServices([
        "automation-integrations",
        "cloud-solutions",
        "maintenance-support",
      ]),
    ),
  },
];

export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Which top-level items open a panel rather than navigating immediately. */
export const NAV_WITH_MENU = new Set(["Services"]);

export const industryNav: NavLink[] = industries.map((industry) => ({
  label: industry.name,
  href: `/industries/${industry.slug}`,
  description: industry.summary,
}));

export const marketNav: NavLink[] = markets.map((market) => ({
  label: market.country,
  href: `/locations/${market.slug}`,
  description:
    market.type === "headquarters"
      ? "Where the studio is based"
      : "Clients served remotely",
}));

export const footerColumns: { label: string; links: NavLink[] }[] = [
  {
    label: "Services",
    links: [
      ...toLinks(
        getServices([
          "automation-integrations",
          "saas-development",
          "custom-software-development",
          "web-development",
          "mobile-app-development",
          "ui-ux-design",
          "digital-marketing",
          "search-engine-optimization",
        ]),
      ).map(({ label, href }) => ({ label, href })),
      { label: "All services", href: "/services" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Products", href: "/products" },
      { label: "Industries", href: "/industries" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Markets",
    links: markets.map((market) => ({
      label: market.country,
      href: `/locations/${market.slug}`,
    })),
  },
  {
    label: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Start a Project", href: "/start-a-project" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
