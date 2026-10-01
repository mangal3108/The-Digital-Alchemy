import {
  getServices,
  getServicesByGroup,
  serviceHref,
  SERVICE_GROUP_ORDER,
  SERVICE_GROUPS,
  type Service,
} from "./services";
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
    // The plain one-liner, not the page summary: this is read by someone
    // deciding where to click, and the summaries were written for a different
    // job (several carried terms like "multi-tenant" onto every page).
    description: service.oneLiner,
  }));
}

/**
 * One column per customer need, in the order visitors are most likely to be
 * looking for them. Membership comes from each service's `group`, so the menu
 * cannot disagree with /services.
 */
export const megaMenuColumns: MegaMenuColumn[] = SERVICE_GROUP_ORDER.map((group) => ({
  key: group,
  label: SERVICE_GROUPS[group].label,
  blurb: SERVICE_GROUPS[group].blurb,
  links: toLinks(getServicesByGroup(group)),
}));

/**
 * Six top-level items at most. Products and Careers moved to the footer: both
 * pages stay live and linked, but neither has anything published yet, and a
 * visitor choosing where to go first is better served by fewer choices.
 */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
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
