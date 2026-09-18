/**
 * Shared vocabulary for job openings.
 *
 * Kept out of the server-action file on purpose: a module marked `"use server"`
 * may only export async functions, so constants imported by a page from there
 * break the build even though they type-check.
 */

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;

export const WORKPLACES = ["ON_SITE", "HYBRID", "REMOTE"] as const;

export const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"] as const;

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const WORKPLACE_LABELS: Record<string, string> = {
  ON_SITE: "On site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

/** schema.org employmentType values, for the JobPosting block. */
export const SCHEMA_EMPLOYMENT_TYPE: Record<string, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
};
