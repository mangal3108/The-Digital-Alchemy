import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader, Notice } from "@/components/admin/ui";
import { PostEditor } from "./post-editor";

export const metadata = { title: "Edit article" };
export const dynamic = "force-dynamic";

export default async function PostEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requirePermission("posts.manage");
  const [{ id }, { created }] = await Promise.all([params, searchParams]);

  const isNew = id === "new";
  const post = isNew ? null : await db.post.findUnique({ where: { id } });
  if (!isNew && !post) notFound();

  const [categories, media] = await Promise.all([
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, filename: true },
    }),
  ]);

  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to insights
      </Link>

      <PageHeader
        title={isNew ? "New article" : (post?.title ?? "Edit article")}
        description={isNew ? undefined : `/insights/${post?.slug}`}
      />

      {created ? <Notice>Article created.</Notice> : null}

      <PostEditor
        post={
          post
            ? {
                id: post.id,
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                heroId: post.heroId ?? "",
                categoryId: post.categoryId ?? "",
                status: post.status,
                publishedAt: post.publishedAt
                  ? post.publishedAt.toISOString().slice(0, 16)
                  : "",
                metaTitle: post.metaTitle ?? "",
                metaDescription: post.metaDescription ?? "",
                isFeatured: post.isFeatured,
              }
            : null
        }
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        mediaOptions={media}
        canDelete={can(user.role, "content.delete")}
      />
    </>
  );
}
