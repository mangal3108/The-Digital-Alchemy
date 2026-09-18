"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { seoOverrideSchema, fieldErrors } from "@/lib/validation";

export interface SeoState {
  ok?: boolean;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
}

export async function saveSeoOverride(
  _prev: SeoState,
  formData: FormData,
): Promise<SeoState> {
  const user = await requirePermission("seo.manage");

  const parsed = seoOverrideSchema.safeParse({
    path: formData.get("path"),
    title: formData.get("title"),
    description: formData.get("description"),
    canonical: formData.get("canonical"),
    ogTitle: formData.get("ogTitle"),
    ogDescription: formData.get("ogDescription"),
    noindex: formData.get("noindex") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fields: fieldErrors(parsed.error),
    };
  }

  const { path, noindex, ...rest } = parsed.data;

  // A canonical pointing somewhere else tells search engines to index that
  // page instead — worth blocking when it is obviously a mistake.
  if (rest.canonical && !/^https?:\/\//i.test(rest.canonical)) {
    return {
      ok: false,
      error: "The canonical URL must be absolute, starting with https://",
    };
  }

  const data = {
    title: rest.title || null,
    description: rest.description || null,
    canonical: rest.canonical || null,
    ogTitle: rest.ogTitle || null,
    ogDescription: rest.ogDescription || null,
    noindex,
  };

  const existing = await db.seoOverride.findUnique({ where: { path } });

  await db.seoOverride.upsert({
    where: { path },
    update: data,
    create: { path, ...data },
  });

  await recordAudit({
    userId: user.id,
    action: existing ? "seo.updated" : "seo.created",
    entity: "SeoOverride",
    entityId: path,
    summary: `${path}${noindex ? " (noindex)" : ""}`,
  });

  revalidatePath(path);
  revalidatePath("/admin/seo");
  revalidatePath("/sitemap.xml");

  return { ok: true, message: `Saved overrides for ${path}.` };
}

export async function deleteSeoOverride(formData: FormData) {
  const user = await requirePermission("seo.manage");
  const id = String(formData.get("id") ?? "");

  const existing = await db.seoOverride.findUnique({ where: { id } });
  if (!existing) return;

  await db.seoOverride.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "seo.deleted",
    entity: "SeoOverride",
    entityId: existing.path,
    summary: `Removed overrides for ${existing.path}`,
  });

  revalidatePath(existing.path);
  revalidatePath("/admin/seo");
  revalidatePath("/sitemap.xml");
}
