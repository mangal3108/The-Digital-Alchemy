"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db, PROJECT_CATEGORIES } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export interface ProjectState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function text(formData: FormData, key: string, max = 8000): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function optional(formData: FormData, key: string, max = 300): string | null {
  const value = text(formData, key, max);
  return value === "" ? null : value;
}

function revalidateProject(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");
}

export async function saveProject(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  const user = await requirePermission("projects.manage");

  const id = text(formData, "id", 40);
  const title = text(formData, "title", 200);
  if (title.length < 2) return { ok: false, error: "Enter a project title." };

  const rawSlug = text(formData, "slug", 120);
  const slug = slugify(rawSlug || title);
  if (!slug) return { ok: false, error: "Could not derive a URL slug." };

  const category = text(formData, "category", 40);
  if (!PROJECT_CATEGORIES.includes(category as never)) {
    return { ok: false, error: "Choose a valid category." };
  }

  const status = text(formData, "status", 20);
  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  // Slugs are public URLs, so a collision would silently shadow another page.
  const clash = await db.project.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) {
    return { ok: false, error: `The slug "${slug}" is already in use.` };
  }

  const yearRaw = text(formData, "year", 8);
  const year = yearRaw ? Number(yearRaw) : null;
  if (year !== null && (!Number.isInteger(year) || year < 1990 || year > 2100)) {
    return { ok: false, error: "Enter a valid year." };
  }

  const services = formData
    .getAll("services")
    .map((value) => String(value))
    .filter(Boolean);
  const techStack = text(formData, "techStack", 1000)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const data = {
    slug,
    title,
    clientName: optional(formData, "clientName", 140),
    clientId: optional(formData, "clientId", 40),
    category,
    industry: optional(formData, "industry", 80),
    country: optional(formData, "country", 80),
    year,
    durationText: optional(formData, "durationText", 80),
    summary: text(formData, "summary", 600),
    challenge: optional(formData, "challenge", 8000),
    strategy: optional(formData, "strategy", 8000),
    research: optional(formData, "research", 8000),
    design: optional(formData, "design", 8000),
    technology: optional(formData, "technology", 8000),
    development: optional(formData, "development", 8000),
    marketing: optional(formData, "marketing", 8000),
    outcome: optional(formData, "outcome", 8000),
    websiteUrl: optional(formData, "websiteUrl", 400),
    heroId: optional(formData, "heroId", 40),
    services: JSON.stringify(services),
    techStack: JSON.stringify(techStack),
    isFeatured: formData.get("isFeatured") === "on",
    status,
    order: Number(text(formData, "order", 6)) || 0,
    publishedAt:
      status === "PUBLISHED" ? new Date() : null,
  };

  if (id) {
    const before = await db.project.findUnique({ where: { id } });
    if (!before) return { ok: false, error: "Project not found." };

    // Keep the original publish date rather than resetting it on every save.
    await db.project.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          status === "PUBLISHED" ? (before.publishedAt ?? new Date()) : null,
      },
    });

    await recordAudit({
      userId: user.id,
      action:
        before.status !== status && status === "PUBLISHED"
          ? "project.published"
          : "project.updated",
      entity: "Project",
      entityId: id,
      summary: `${title} (${status})`,
    });

    revalidateProject(slug);
    if (before.slug !== slug) revalidateProject(before.slug);

    return { ok: true, message: "Project saved." };
  }

  const created = await db.project.create({ data });

  await recordAudit({
    userId: user.id,
    action: "project.created",
    entity: "Project",
    entityId: created.id,
    summary: `${title} (${status})`,
  });

  revalidateProject(slug);
  redirect(`/admin/projects/${created.id}?created=1`);
}

export async function deleteProject(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return;

  await db.project.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "project.deleted",
    entity: "Project",
    entityId: id,
    summary: `Deleted ${existing.title}`,
  });

  revalidateProject(existing.slug);
  redirect("/admin/projects");
}

export async function addProjectResult(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await requirePermission("projects.manage");

  const projectId = String(formData.get("projectId") ?? "");
  const label = text(formData, "label", 80);
  const value = text(formData, "value", 40);

  if (!projectId) return { ok: false, error: "Project not found." };
  if (!label || !value) {
    return { ok: false, error: "A result needs both a label and a value." };
  }

  const count = await db.projectResult.count({ where: { projectId } });

  await db.projectResult.create({
    data: {
      projectId,
      label,
      value,
      note: optional(formData, "note", 200),
      order: count,
    },
  });

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { slug: true },
  });
  revalidateProject(project?.slug);

  return { ok: true, message: "Result added." };
}

export async function deleteProjectResult(formData: FormData) {
  await requirePermission("projects.manage");
  const id = String(formData.get("id") ?? "");

  const result = await db.projectResult.findUnique({
    where: { id },
    include: { project: { select: { slug: true } } },
  });
  if (!result) return;

  await db.projectResult.delete({ where: { id } });
  revalidateProject(result.project.slug);
}
