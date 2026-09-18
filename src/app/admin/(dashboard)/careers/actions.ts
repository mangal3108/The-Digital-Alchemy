"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

/** Local, matching the other admin actions rather than inventing a shared one. */
function text(formData: FormData, key: string, max = 4000): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

export type JobState = { ok: boolean; message?: string; error?: string };

import {
  EMPLOYMENT_TYPES,
  WORKPLACES,
  JOB_STATUSES as STATUSES,
} from "@/content/careers";

function revalidateCareers(slug?: string | null) {
  revalidatePath("/careers");
  if (slug) revalidatePath(`/careers/${slug}`);
  revalidatePath("/admin/careers");
  // The sitemap enumerates published roles, so a publish has to invalidate it.
  revalidatePath("/sitemap.xml");
}

export async function saveJob(
  _prev: JobState,
  formData: FormData,
): Promise<JobState> {
  const user = await requirePermission("careers.manage");

  const id = text(formData, "id", 40);
  const title = text(formData, "title", 160);
  const summary = text(formData, "summary", 400);
  const employmentType = text(formData, "employmentType", 20);
  const workplace = text(formData, "workplace", 20);
  const status = text(formData, "status", 20);

  if (title.length < 3) return { ok: false, error: "Enter a job title." };
  if (summary.length < 20) {
    return { ok: false, error: "Write a summary of at least 20 characters." };
  }
  if (!EMPLOYMENT_TYPES.includes(employmentType as never)) {
    return { ok: false, error: "Choose an employment type." };
  }
  if (!WORKPLACES.includes(workplace as never)) {
    return { ok: false, error: "Choose a workplace arrangement." };
  }
  if (!STATUSES.includes(status as never)) {
    return { ok: false, error: "Choose a status." };
  }

  const applyEmail = text(formData, "applyEmail", 160) || null;
  const applyUrl = text(formData, "applyUrl", 400) || null;

  if (applyUrl && !/^https?:\/\//i.test(applyUrl)) {
    return { ok: false, error: "The application URL must start with http:// or https://." };
  }
  if (applyEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(applyEmail)) {
    return { ok: false, error: "That application email does not look valid." };
  }

  // A published role nobody can apply to is a dead end, and the public page
  // has no other route to a human.
  if (status === "PUBLISHED" && !applyEmail && !applyUrl) {
    return {
      ok: false,
      error: "A published role needs an application email or URL.",
    };
  }

  const slug = text(formData, "slug", 160) || slugify(title);

  // Slugs are in the public URL, so a collision would silently point two roles
  // at one page.
  const clash = await db.jobOpening.findUnique({ where: { slug } });
  if (clash && clash.id !== id) {
    return { ok: false, error: `The slug "${slug}" is already used by another role.` };
  }

  const closesAtRaw = text(formData, "closesAt", 24);
  const closesAt = closesAtRaw ? new Date(closesAtRaw) : null;
  if (closesAt && Number.isNaN(closesAt.getTime())) {
    return { ok: false, error: "That closing date is not valid." };
  }

  const data = {
    slug,
    title,
    summary,
    employmentType,
    workplace,
    status,
    location: text(formData, "location", 160) || null,
    description: text(formData, "description", 12000),
    responsibilities: text(formData, "responsibilities", 4000),
    requirements: text(formData, "requirements", 4000),
    salaryRange: text(formData, "salaryRange", 120) || null,
    applyEmail,
    applyUrl,
    metaTitle: text(formData, "metaTitle", 160) || null,
    metaDescription: text(formData, "metaDescription", 320) || null,
    orderIndex: Number(text(formData, "orderIndex", 6)) || 0,
    closesAt,
    // Stamped on the first publish and kept thereafter, so re-publishing an
    // edited role does not reset how long it has been open.
    publishedAt:
      status === "PUBLISHED"
        ? ((await db.jobOpening.findUnique({ where: { id: id || "" } }))?.publishedAt ??
          new Date())
        : null,
  };

  if (id) {
    await db.jobOpening.update({ where: { id }, data });
    await recordAudit({
      userId: user.id,
      action: "job.updated",
      entity: "JobOpening",
      entityId: id,
      summary: `${title} (${status.toLowerCase()})`.slice(0, 80),
    });
  } else {
    const created = await db.jobOpening.create({ data });
    await recordAudit({
      userId: user.id,
      action: "job.created",
      entity: "JobOpening",
      entityId: created.id,
      summary: `${title} (${status.toLowerCase()})`.slice(0, 80),
    });
  }

  revalidateCareers(slug);
  return { ok: true, message: id ? "Role saved." : "Role added." };
}

export async function deleteJob(formData: FormData) {
  const user = await requirePermission("careers.manage");
  const id = String(formData.get("id") ?? "");

  const existing = await db.jobOpening.findUnique({ where: { id } });
  if (!existing) return;

  await db.jobOpening.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "job.deleted",
    entity: "JobOpening",
    entityId: id,
    summary: existing.title.slice(0, 80),
  });

  revalidateCareers(existing.slug);
}
