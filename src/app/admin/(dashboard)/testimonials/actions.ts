"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { testimonialSchema, fieldErrors } from "@/lib/validation";

export interface TestimonialState {
  ok?: boolean;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
}

function readForm(formData: FormData) {
  const rating = String(formData.get("rating") ?? "");
  return {
    quote: formData.get("quote"),
    authorName: formData.get("authorName"),
    position: formData.get("position"),
    company: formData.get("company"),
    country: formData.get("country"),
    rating: rating === "" ? undefined : rating,
    videoUrl: formData.get("videoUrl"),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    order: formData.get("order") ?? 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/testimonials");
}

export async function saveTestimonial(
  _prev: TestimonialState,
  formData: FormData,
): Promise<TestimonialState> {
  const user = await requirePermission("testimonials.manage");

  const id = String(formData.get("id") ?? "");
  const parsed = testimonialSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fields: fieldErrors(parsed.error),
    };
  }

  const data = {
    ...parsed.data,
    position: parsed.data.position || null,
    company: parsed.data.company || null,
    country: parsed.data.country || null,
    videoUrl: parsed.data.videoUrl || null,
    rating: parsed.data.rating ?? null,
  };

  if (id) {
    const before = await db.testimonial.findUnique({ where: { id } });
    if (!before) return { ok: false, error: "Testimonial not found." };

    await db.testimonial.update({
      where: { id },
      // Editing a migrated quote means it has been reviewed, so the flag is
      // cleared and it stops appearing in the "needs verifying" list.
      data: { ...data, isMigrated: false },
    });

    await recordAudit({
      userId: user.id,
      action: before.isPublished !== data.isPublished
        ? data.isPublished
          ? "testimonial.published"
          : "testimonial.unpublished"
        : "testimonial.updated",
      entity: "Testimonial",
      entityId: id,
      summary: `${data.authorName}${data.company ? ` (${data.company})` : ""}`,
    });

    revalidate();
    return { ok: true, message: "Testimonial saved." };
  }

  const created = await db.testimonial.create({ data });

  await recordAudit({
    userId: user.id,
    action: "testimonial.created",
    entity: "Testimonial",
    entityId: created.id,
    summary: `${data.authorName}${data.company ? ` (${data.company})` : ""}`,
  });

  revalidate();
  return { ok: true, message: "Testimonial added." };
}

export async function deleteTestimonial(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return;

  await db.testimonial.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "testimonial.deleted",
    entity: "Testimonial",
    entityId: id,
    summary: `Deleted testimonial from ${existing.authorName}`,
  });

  revalidate();
}
