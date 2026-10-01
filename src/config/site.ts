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

/**
 * The one production origin. www + https is what the domain actually serves:
 * the apex and plain-http variants all 308 here.
 */
export const PRODUCTION_ORIGIN = "https://www.thedigitalalchemy.co.in";

/**
 * Where canonical URLs, the sitemap, robots.txt and Open Graph tags point.
 *
 * `NEXT_PUBLIC_SITE_URL` is honoured, except in one case: a loopback address in
 * a production build. That is never correct, and it is not hypothetical. The
 * live site shipped `http://localhost:3000` as its canonical on every page, in
 * all 49 sitemap URLs and in robots.txt, because that value — copied from
 * `.env.example` — was set in the hosting environment. `??` only falls back
 * when the variable is absent, so a wrong value went straight through.
 *
 * Development keeps whatever is configured, so local links still work.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!configured) return PRODUCTION_ORIGIN;

  const isLoopback = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
    configured,
  );
  if (isLoopback && process.env.NODE_ENV === "production") {
    // Once per server process: this module is evaluated by many routes.
    const flag = globalThis as { __tdaSiteUrlWarned?: boolean };
    if (typeof window === "undefined" && !flag.__tdaSiteUrlWarned) {
      flag.__tdaSiteUrlWarned = true;
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL is "${configured}" in a production build. ` +
          `Ignoring it and using ${PRODUCTION_ORIGIN}. Fix the environment variable.`,
      );
    }
    return PRODUCTION_ORIGIN;
  }
  return configured;
}

export const siteConfig = {
  /** VERIFIED — og:site_name on the live site */
  name: "The Digital Alchemy",
  legalName: "The Digital Alchemy Media Private Limited",

  /**
   * Repositioning: the live site presents the company as a social-media and
   * ads agency. The brief repositions it as a digital product, software and
   * growth studio. This describes capability, not claimed scale.
   */
  tagline: "Websites, apps, AI tools and online marketing",
  shortDescription:
    "We build websites, apps and AI tools, and bring you customers from Google and Instagram. A New Delhi team working with businesses in India and abroad.",

  /** The canonical origin. See `resolveSiteUrl` for why this is not read raw. */
  url: resolveSiteUrl(),

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
/**
 * The one main call to action, used everywhere. It replaced 22 different
 * labels ("Scope My SaaS Product", "Map My Automations"…) that each asked for
 * the same thing. "Free" is a promise about price: it matches what the site
 * says about the first call ("no obligation"). If that changes, change it here.
 */
export const PRIMARY_CTA = {
  label: "Get a free consultation",
  href: "/start-a-project",
} as const;

/** At most one secondary action per section. Points at the services, not the
 * (still empty) work page. */
export const SECONDARY_CTA = {
  label: "See what we do",
  href: "/services",
} as const;

/** Absolute URL helper — always builds from the configured origin. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
