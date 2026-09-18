import { cache } from "react";
import { db } from "./db";
import { siteConfig } from "@/config/site";

/**
 * Site settings resolution.
 *
 * `siteConfig` holds the verified defaults migrated from the previous site.
 * The database overlays them, so an administrator can change the phone number,
 * add social profiles or set analytics IDs without a deployment — and nothing
 * in the codebase hard-codes a contact detail.
 *
 * Reads are wrapped in React's `cache` so a page render performs one query
 * regardless of how many components ask for settings.
 */

export interface ResolvedSettings {
  companyName: string;
  tagline: string;
  shortDescription: string;
  email: string;
  phone: string;
  phoneE164: string;
  whatsapp: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  addressStreet: string;
  mapsUrl: string;
  businessHours: string;
  footerNote: string;
  social: Record<string, string>;
  analytics: {
    ga4: string;
    gtm: string;
    metaPixel: string;
    clarity: string;
  };
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

const SOCIAL_KEYS = [
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
  "x",
  "behance",
  "dribbble",
  "github",
] as const;

/**
 * The settings an administrator can edit, with the verified defaults. This
 * array is also what seeds and renders the /admin/settings form, so adding a
 * setting is a one-line change in one place.
 */
export const SETTING_DEFINITIONS: {
  key: string;
  label: string;
  group: string;
  type: string;
  hint?: string;
  default: string;
}[] = [
  // -- Company -------------------------------------------------------------
  {
    key: "company.name",
    label: "Company name",
    group: "company",
    type: "text",
    default: siteConfig.name,
  },
  {
    key: "company.tagline",
    label: "Tagline",
    group: "company",
    type: "text",
    hint: "Short positioning line used in the footer and metadata.",
    default: siteConfig.tagline,
  },
  {
    key: "company.description",
    label: "Short description",
    group: "company",
    type: "textarea",
    hint: "One or two sentences. Used as the default meta description.",
    default: siteConfig.shortDescription,
  },
  {
    key: "company.footerNote",
    label: "Footer note",
    group: "company",
    type: "textarea",
    default: "",
  },

  // -- Contact -------------------------------------------------------------
  {
    key: "contact.email",
    label: "Email address",
    group: "contact",
    type: "email",
    default: siteConfig.email,
  },
  {
    key: "contact.phone",
    label: "Phone (display)",
    group: "contact",
    type: "tel",
    default: siteConfig.phone,
  },
  {
    key: "contact.phoneE164",
    label: "Phone (dialling format)",
    group: "contact",
    type: "tel",
    hint: "Used for tel: links. Include the country code, no spaces.",
    default: siteConfig.phoneE164,
  },
  {
    key: "contact.whatsapp",
    label: "WhatsApp number",
    group: "contact",
    type: "tel",
    hint: "Digits only, including country code. Leave blank to hide WhatsApp links.",
    default: siteConfig.whatsapp,
  },
  {
    key: "contact.businessHours",
    label: "Business hours",
    group: "contact",
    type: "text",
    hint: "Leave blank to hide. Example: Mon–Fri, 10:00–19:00 IST",
    default: siteConfig.businessHours,
  },

  // -- Address -------------------------------------------------------------
  {
    key: "address.street",
    label: "Street address",
    group: "address",
    type: "text",
    hint: "Not published on the previous site — add it to improve local search.",
    default: siteConfig.address.street,
  },
  {
    key: "address.locality",
    label: "Locality",
    group: "address",
    type: "text",
    default: siteConfig.address.locality,
  },
  {
    key: "address.region",
    label: "City / region",
    group: "address",
    type: "text",
    default: siteConfig.address.region,
  },
  {
    key: "address.postalCode",
    label: "Postal code",
    group: "address",
    type: "text",
    default: siteConfig.address.postalCode,
  },
  {
    key: "address.country",
    label: "Country",
    group: "address",
    type: "text",
    default: siteConfig.address.country,
  },
  {
    key: "address.mapsUrl",
    label: "Google Maps / Business Profile URL",
    group: "address",
    type: "url",
    default: siteConfig.address.mapsUrl,
  },

  // -- Social --------------------------------------------------------------
  ...SOCIAL_KEYS.map((key) => ({
    key: `social.${key}`,
    label: key === "x" ? "X (Twitter)" : key[0].toUpperCase() + key.slice(1),
    group: "social",
    type: "url",
    hint: "Leave blank to hide. Blank profiles are omitted from schema markup.",
    default: siteConfig.social[key] ?? "",
  })),

  // -- SEO -----------------------------------------------------------------
  {
    key: "seo.defaultTitle",
    label: "Default meta title",
    group: "seo",
    type: "text",
    default: `${siteConfig.name} | AI Automation, AI-Ready Products & Digital Software Studio`,
  },
  {
    key: "seo.defaultDescription",
    label: "Default meta description",
    group: "seo",
    type: "textarea",
    default: siteConfig.shortDescription,
  },

  // -- Analytics -----------------------------------------------------------
  {
    key: "analytics.ga4",
    label: "Google Analytics 4 measurement ID",
    group: "analytics",
    type: "text",
    hint: "Example: G-XXXXXXXXXX. Loads only after analytics consent.",
    default: "",
  },
  {
    key: "analytics.gtm",
    label: "Google Tag Manager container ID",
    group: "analytics",
    type: "text",
    hint: "Example: GTM-XXXXXXX. Loads only after analytics consent.",
    default: "",
  },
  {
    key: "analytics.metaPixel",
    label: "Meta Pixel ID",
    group: "analytics",
    type: "text",
    hint: "Loads only after marketing consent.",
    default: "",
  },
  {
    key: "analytics.clarity",
    label: "Microsoft Clarity project ID",
    group: "analytics",
    type: "text",
    hint: "Loads only after analytics consent.",
    default: "",
  },
];

const DEFAULTS = new Map(
  SETTING_DEFINITIONS.map((definition) => [definition.key, definition.default]),
);

export const SETTING_GROUPS: { key: string; label: string; blurb: string }[] = [
  { key: "company", label: "Company", blurb: "Name, positioning and footer copy." },
  { key: "contact", label: "Contact", blurb: "Used across the site and in schema markup." },
  { key: "address", label: "Address", blurb: "Drives local SEO and the LocalBusiness schema." },
  { key: "social", label: "Social profiles", blurb: "Blank profiles are hidden, never guessed." },
  { key: "seo", label: "SEO defaults", blurb: "Fallbacks for pages without their own metadata." },
  { key: "analytics", label: "Analytics", blurb: "Loaded only after the visitor consents." },
];

/** Raw key/value map, database over defaults. */
export const getSettingsMap = cache(async (): Promise<Map<string, string>> => {
  const map = new Map(DEFAULTS);
  try {
    const rows = await db.siteSetting.findMany();
    for (const row of rows) {
      // An empty stored value is a deliberate "hide this", so it overrides.
      map.set(row.key, row.value);
    }
  } catch {
    // Rendering must not depend on the database being reachable. Falling back
    // to verified defaults keeps the public site up if the DB is unavailable.
  }
  return map;
});

export const getSiteSettings = cache(async (): Promise<ResolvedSettings> => {
  const map = await getSettingsMap();
  const get = (key: string) => map.get(key) ?? DEFAULTS.get(key) ?? "";

  const social: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const value = get(`social.${key}`);
    if (value) social[key] = value;
  }

  return {
    companyName: get("company.name"),
    tagline: get("company.tagline"),
    shortDescription: get("company.description"),
    footerNote: get("company.footerNote"),
    email: get("contact.email"),
    phone: get("contact.phone"),
    phoneE164: get("contact.phoneE164"),
    whatsapp: get("contact.whatsapp"),
    businessHours: get("contact.businessHours"),
    addressStreet: get("address.street"),
    addressLocality: get("address.locality"),
    addressRegion: get("address.region"),
    addressPostalCode: get("address.postalCode"),
    addressCountry: get("address.country"),
    mapsUrl: get("address.mapsUrl"),
    social,
    analytics: {
      ga4: get("analytics.ga4") || siteConfig.analytics.ga4,
      gtm: get("analytics.gtm") || siteConfig.analytics.gtm,
      metaPixel: get("analytics.metaPixel") || siteConfig.analytics.metaPixel,
      clarity: get("analytics.clarity") || siteConfig.analytics.clarity,
    },
    defaultMetaTitle: get("seo.defaultTitle"),
    defaultMetaDescription: get("seo.defaultDescription"),
  };
});

/** Human-readable single-line address, omitting blank parts. */
export function formatAddress(settings: ResolvedSettings): string {
  return [
    settings.addressStreet,
    settings.addressLocality,
    settings.addressRegion,
    settings.addressPostalCode,
    settings.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");
}

export function whatsappLink(settings: ResolvedSettings, message?: string): string {
  if (!settings.whatsapp) return "";
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${settings.whatsapp}${query}`;
}
