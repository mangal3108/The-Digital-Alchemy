import type { Metadata } from "next";
import { db } from "./db";
import { getSiteSettings, formatAddress } from "./settings";
import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * SEO metadata is built in one place so no page hard-codes a title template,
 * an OG image path or a canonical rule. Per-path overrides set in the admin
 * SEO editor take precedence over whatever the page passes in.
 */

export interface PageSeo {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/services/saas-development" */
  path: string;
  /** Absolute or site-relative image URL. Falls back to the generated OG image. */
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export async function buildMetadata(input: PageSeo): Promise<Metadata> {
  const settings = await getSiteSettings();

  const override = await db.seoOverride
    .findUnique({ where: { path: input.path } })
    .catch(() => null);

  const title = override?.title || input.title;
  const description =
    override?.description || input.description || settings.defaultMetaDescription;
  const canonical = override?.canonical || absoluteUrl(input.path);
  const noindex = override?.noindex || input.noindex || false;

  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : absoluteUrl(input.image)
    : absoluteUrl(siteConfig.ogImage);

  return {
    // Absolute, not templated: pages supply their complete title (service
    // pages already carry the brand suffix), so letting the root template
    // append the company name again would double it.
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: input.type ?? "website",
      title: override?.ogTitle || title,
      description: override?.ogDescription || description,
      url: canonical,
      siteName: settings.companyName,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: input.authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: override?.ogTitle || title,
      description: override?.ogDescription || description,
      images: [image],
    },
  };
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

type JsonLd = Record<string, unknown>;

/**
 * Organization + LocalBusiness.
 *
 * `sameAs` is omitted entirely when no social profiles are configured rather
 * than emitted empty, and no aggregateRating is ever included — review schema
 * without genuine reviews behind it is exactly the kind of thing that earns a
 * manual action.
 */
export async function organizationSchema(): Promise<JsonLd> {
  const settings = await getSiteSettings();
  const sameAs = Object.values(settings.social).filter(Boolean);

  const address: JsonLd = {
    "@type": "PostalAddress",
    addressCountry: settings.addressCountry || undefined,
    addressRegion: settings.addressRegion || undefined,
    addressLocality: settings.addressLocality || undefined,
    postalCode: settings.addressPostalCode || undefined,
    streetAddress: settings.addressStreet || undefined,
  };

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": absoluteUrl("/#organization"),
    name: settings.companyName,
    description: settings.shortDescription,
    url: absoluteUrl("/"),
    email: settings.email || undefined,
    telephone: settings.phoneE164 || undefined,
    address,
    ...(settings.mapsUrl ? { hasMap: settings.mapsUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: siteConfig.markets.map((market) => ({
      "@type": "Country",
      name: market.name,
    })),
  };
}

export function websiteSchema(companyName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: companyName,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; href: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  companyName: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: siteConfig.markets.map((market) => ({
      "@type": "Country",
      name: market.name,
    })),
  };
}

/**
 * FAQPage. Only emitted when there are genuine questions and answers on the
 * page — schema describing content that is not visible is a violation.
 */
export function faqSchema(
  faqs: { question: string; answer: string }[],
): JsonLd | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorName?: string | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.image ? { image: [absoluteUrl(input.image)] } : {}),
    ...(input.publishedAt
      ? { datePublished: input.publishedAt.toISOString() }
      : {}),
    ...(input.updatedAt ? { dateModified: input.updatedAt.toISOString() } : {}),
    ...(input.authorName
      ? { author: { "@type": "Person", name: input.authorName } }
      : {}),
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function personSchema(input: {
  name: string;
  role: string;
  path: string;
  image?: string;
  linkedin?: string | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.role,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.linkedin ? { sameAs: [input.linkedin] } : {}),
    worksFor: { "@id": absoluteUrl("/#organization") },
  };
}

/** Rendered by the JsonLd component; kept here so callers stay declarative. */
export async function localBusinessSchema(): Promise<JsonLd | null> {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  if (!address || !settings.addressLocality) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#localbusiness"),
    name: settings.companyName,
    image: absoluteUrl(siteConfig.ogImage),
    url: absoluteUrl("/"),
    email: settings.email || undefined,
    telephone: settings.phoneE164 || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressStreet || undefined,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion || undefined,
      postalCode: settings.addressPostalCode || undefined,
      addressCountry: settings.addressCountry || undefined,
    },
    ...(settings.businessHours
      ? { openingHours: settings.businessHours }
      : {}),
    ...(settings.mapsUrl ? { hasMap: settings.mapsUrl } : {}),
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}
