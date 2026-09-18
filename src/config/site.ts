/**
 * Canonical company facts.
 *
 * IMPORTANT — provenance rules for this file:
 *  - Every value below marked VERIFIED was migrated from the live WordPress
 *    site at https://thedigitalalchemy.co.in (audited 2026-09-06).
 *  - Values marked UNVERIFIED are deliberately empty. They are surfaced in the
 *    admin panel as "needs completion" and are hidden from the public site
 *    until an administrator fills them in. Do not invent replacements.
 *
 * At runtime these are only *defaults*. `getSiteSettings()` in
 * `src/lib/settings.ts` overlays the values stored in the database, so the
 * business can edit all of them from /admin/settings without a code change.
 */

export const siteConfig = {
  /** VERIFIED — og:site_name on the live site */
  name: "The Digital Alchemy",
  legalName: "The Digital Alchemy",

  /**
   * Repositioning: the live site presents the company as a social-media and
   * ads agency. The brief repositions it as a digital product, software and
   * growth studio. This describes capability, not claimed scale.
   */
  tagline: "AI Automation, AI-Ready Products & Digital Software Studio",
  shortDescription:
    "We architect and scale AI automation systems, autonomous workflows, AI-ready SaaS platforms, and digital growth engines for ambitious businesses worldwide.",

  /** VERIFIED — production domain of the existing site */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedigitalalchemy.co.in",

  /** VERIFIED — from the live /contact-2/ page */
  email: "support@thedigitalalchemy.co.in",

  /**
   * Contact number. Supplied directly by the owner, replacing the one
   * published on the old site.
   *
   * These three fields are the only place the number appears — everything
   * else (tel: links, the wa.me link, the WhatsApp QR, the LocalBusiness and
   * Organization structured data, the chatbot) derives from them. Changing it
   * here and re-running `npm run build:qr` updates the whole site.
   */
  phone: "+91 9990463175",
  /** E.164, used for tel: and wa.me links */
  phoneE164: "+919990463175",
  whatsapp: "919990463175",

  /** VERIFIED — from the live /contact-2/ page. This is the only real location. */
  address: {
    locality: "Uttam Nagar",
    region: "New Delhi",
    postalCode: "110059",
    country: "India",
    countryCode: "IN",
    /** UNVERIFIED — no street line published on the live site */
    street: "",
    /** UNVERIFIED — admin should paste the Google Business Profile link */
    mapsUrl: "",
  },

  /**
   * UNVERIFIED — the live site publishes no social profiles. Left empty on
   * purpose; the footer and Organization schema omit `sameAs` entirely rather
   * than linking to guessed handles.
   */
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
    x: "",
    behance: "",
    dribbble: "",
    github: "",
  } as Record<string, string>,

  /**
   * UNVERIFIED — no published business hours. Hidden until set.
   */
  businessHours: "",

  /**
   * Markets the studio sells into. India is where the business is actually
   * located; the rest are client markets served remotely. The distinction is
   * enforced by the `type` field and rendered explicitly — we never imply an
   * office that does not exist.
   */
  markets: [
    { code: "IN", name: "India", type: "headquarters" },
    { code: "US", name: "United States", type: "client-market" },
    { code: "AU", name: "Australia", type: "client-market" },
    { code: "GB", name: "United Kingdom", type: "client-market" },
    { code: "CA", name: "Canada", type: "client-market" },
    { code: "AE", name: "United Arab Emirates", type: "client-market" },
  ] as const,

  /** Default OG image; generated at /opengraph-image so it always exists. */
  ogImage: "/opengraph-image",

  /** UNVERIFIED — analytics IDs come from env / admin, never hard-coded. */
  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    clarity: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Primary conversion action, used consistently across the site. */
export const PRIMARY_CTA = {
  label: "Start a Project",
  href: "/start-a-project",
} as const;

export const SECONDARY_CTA = {
  label: "View Our Work",
  href: "/work",
} as const;

/** Absolute URL helper — always builds from the configured origin. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
