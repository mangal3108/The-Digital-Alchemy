import { z } from "zod";
import { serviceSlugs } from "@/content/services";

/**
 * Every form is validated twice: in the browser for immediate feedback, and
 * again on the server, which is the check that actually matters. Both use the
 * schemas below so the rules cannot drift apart.
 */

const trimmed = (max: number) => z.string().trim().max(max);

export const BUDGET_OPTIONS = [
  { value: "under-1l", label: "Under ₹1,00,000 / under $1,500" },
  { value: "1l-3l", label: "₹1,00,000 – ₹3,00,000 / $1,500 – $4,000" },
  { value: "3l-8l", label: "₹3,00,000 – ₹8,00,000 / $4,000 – $10,000" },
  { value: "8l-20l", label: "₹8,00,000 – ₹20,00,000 / $10,000 – $25,000" },
  { value: "20l-plus", label: "Above ₹20,00,000 / above $25,000" },
  { value: "not-sure", label: "Not sure yet — help me scope it" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "researching", label: "Researching for now" },
] as const;

/** Service choices offered on the enquiry form, plus a catch-all. */
export const ENQUIRY_SERVICE_OPTIONS = [
  { value: "saas-development", label: "SaaS product" },
  { value: "custom-software-development", label: "Custom software" },
  { value: "web-development", label: "Website" },
  { value: "web-application-development", label: "Web application" },
  { value: "mobile-app-development", label: "Mobile app" },
  { value: "ecommerce-development", label: "E-commerce store" },
  { value: "ui-ux-design", label: "Design" },
  { value: "branding", label: "Branding" },
  { value: "digital-marketing", label: "Digital marketing" },
  { value: "social-media-management", label: "Social media" },
  { value: "search-engine-optimization", label: "SEO" },
  { value: "performance-marketing", label: "Paid advertising" },
  { value: "other", label: "Something else" },
] as const;

const enquiryServiceValues = ENQUIRY_SERVICE_OPTIONS.map(
  (option) => option.value,
) as string[];

export const leadSchema = z.object({
  name: trimmed(120).min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .max(180)
    .email("Please enter a valid email address."),
  phone: trimmed(40).optional().or(z.literal("")),
  company: trimmed(140).optional().or(z.literal("")),
  country: trimmed(80).optional().or(z.literal("")),
  services: z
    .array(z.string())
    .max(13)
    .default([])
    .refine(
      (values) =>
        values.every(
          (value) =>
            enquiryServiceValues.includes(value) ||
            serviceSlugs.includes(value),
        ),
      "Unrecognised service selection.",
    ),
  budget: trimmed(40).optional().or(z.literal("")),
  timeline: trimmed(40).optional().or(z.literal("")),
  message: trimmed(5000).min(10, "Please tell us a little about the project."),

  // Attribution — collected from the page, not typed by the visitor.
  sourcePage: trimmed(300).optional().or(z.literal("")),
  referrer: trimmed(300).optional().or(z.literal("")),
  utmSource: trimmed(120).optional().or(z.literal("")),
  utmMedium: trimmed(120).optional().or(z.literal("")),
  utmCampaign: trimmed(160).optional().or(z.literal("")),
  utmTerm: trimmed(160).optional().or(z.literal("")),
  utmContent: trimmed(160).optional().or(z.literal("")),

  /**
   * Honeypot. Real people never see this field, so anything in it is a bot.
   * Paired with the timing check below rather than used alone.
   */
  website: z.string().max(200).optional().or(z.literal("")),
  /** Milliseconds since the form mounted. Submissions under ~2s are automated. */
  elapsedMs: z.coerce.number().int().min(0).max(1000 * 60 * 60 * 6).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const MIN_FORM_ELAPSED_MS = 2000;

/** Returns true when a submission looks automated. */
export function looksAutomated(input: LeadInput): boolean {
  if (input.website && input.website.trim().length > 0) return true;
  if (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_FORM_ELAPSED_MS) {
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Admin schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(200);

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
  "SPAM",
]);

export const seoOverrideSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^\//, "Path must start with a slash."),
  title: trimmed(200).optional().or(z.literal("")),
  description: trimmed(400).optional().or(z.literal("")),
  canonical: trimmed(400).optional().or(z.literal("")),
  ogTitle: trimmed(200).optional().or(z.literal("")),
  ogDescription: trimmed(400).optional().or(z.literal("")),
  noindex: z.coerce.boolean().default(false),
});

export const redirectSchema = z.object({
  source: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^\//, "Source must start with a slash."),
  destination: z.string().trim().min(1).max(400),
  statusCode: z.coerce.number().int().refine((n) => n === 301 || n === 302, {
    message: "Use 301 (permanent) or 302 (temporary).",
  }),
  isActive: z.coerce.boolean().default(true),
  note: trimmed(300).optional().or(z.literal("")),
});

export const metricSchema = z.object({
  key: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(120),
  value: trimmed(40),
  prefix: trimmed(10).optional().or(z.literal("")),
  suffix: trimmed(10).optional().or(z.literal("")),
  note: trimmed(200).optional().or(z.literal("")),
  isPublished: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10).max(2000),
  authorName: z.string().trim().min(2).max(120),
  position: trimmed(120).optional().or(z.literal("")),
  company: trimmed(140).optional().or(z.literal("")),
  country: trimmed(80).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  videoUrl: trimmed(400).optional().or(z.literal("")),
  isPublished: z.coerce.boolean().default(false),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

/** Flattens Zod issues into a field → message map for form rendering. */
export function fieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!output[key]) output[key] = issue.message;
  }
  return output;
}
