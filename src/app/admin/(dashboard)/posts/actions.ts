"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify, readingTime, stripHtml } from "@/lib/utils";

export interface PostState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function text(formData: FormData, key: string, max = 100_000): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function revalidatePost(slug?: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/sitemap.xml");
}

export async function savePost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const user = await requirePermission("posts.manage");

  const id = text(formData, "id", 40);
  const title = text(formData, "title", 200);
  if (title.length < 3) return { ok: false, error: "Enter a title." };

  const slug = slugify(text(formData, "slug", 120) || title);
  if (!slug) return { ok: false, error: "Could not derive a URL slug." };

  const status = text(formData, "status", 20);
  if (!["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"].includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const clash = await db.post.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `The slug "${slug}" is already in use.` };

  const content = text(formData, "content");
  const scheduledFor = text(formData, "publishedAt", 40);

  if (status === "SCHEDULED" && !scheduledFor) {
    return { ok: false, error: "A scheduled post needs a publish date." };
  }

  let publishedAt: Date | null = null;
  if (status === "PUBLISHED") {
    publishedAt = scheduledFor ? new Date(scheduledFor) : new Date();
  } else if (status === "SCHEDULED") {
    publishedAt = new Date(scheduledFor);
    if (Number.isNaN(publishedAt.getTime())) {
      return { ok: false, error: "That publish date is not valid." };
    }
  }

  const data = {
    slug,
    title,
    excerpt: text(formData, "excerpt", 400),
    content,
    heroId: text(formData, "heroId", 40) || null,
    categoryId: text(formData, "categoryId", 40) || null,
    authorId: user.id,
    status,
    publishedAt,
    readingMinutes: readingTime(stripHtml(content)),
    metaTitle: text(formData, "metaTitle", 200) || null,
    metaDescription: text(formData, "metaDescription", 400) || null,
    isFeatured: formData.get("isFeatured") === "on",
  };

  if (id) {
    const before = await db.post.findUnique({ where: { id } });
    if (!before) return { ok: false, error: "Article not found." };

    await db.post.update({
      where: { id },
      data: {
        ...data,
        // Preserve the original publish date on edits so the article does not
        // jump to the top of the list every time a typo is fixed.
        publishedAt:
          status === "PUBLISHED"
            ? (before.publishedAt ?? publishedAt ?? new Date())
            : publishedAt,
        // Authorship stays with whoever wrote it.
        authorId: before.authorId ?? user.id,
      },
    });

    await recordAudit({
      userId: user.id,
      action:
        before.status !== status && status === "PUBLISHED"
          ? "post.published"
          : "post.updated",
      entity: "Post",
      entityId: id,
      summary: `${title} (${status})`,
    });

    revalidatePost(slug);
    if (before.slug !== slug) revalidatePost(before.slug);
    return { ok: true, message: "Article saved." };
  }

  const created = await db.post.create({ data });

  await recordAudit({
    userId: user.id,
    action: "post.created",
    entity: "Post",
    entityId: created.id,
    summary: `${title} (${status})`,
  });

  revalidatePost(slug);
  redirect(`/admin/posts/${created.id}?created=1`);
}

export async function deletePost(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.post.findUnique({ where: { id } });
  if (!existing) return;

  await db.post.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "post.deleted",
    entity: "Post",
    entityId: id,
    summary: `Deleted ${existing.title}`,
  });

  revalidatePost(existing.slug);
  redirect("/admin/posts");
}
