import { PrismaClient } from "@prisma/client";

/**
 * A single Prisma client per process. Next.js hot-reloads modules in
 * development, which would otherwise open a new connection pool on every edit
 * until the database refuses them.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/** Status vocabularies. Kept here because the schema stores them as strings. */
export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
  "SPAM",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CONTENT_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const PRODUCT_STATUSES = ["LIVE", "BETA", "COMING_SOON"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PROJECT_CATEGORIES = [
  "saas",
  "software",
  "web",
  "mobile",
  "marketing",
  "branding",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  saas: "SaaS",
  software: "Software",
  web: "Web",
  mobile: "Mobile",
  marketing: "Marketing",
  branding: "Branding",
};
