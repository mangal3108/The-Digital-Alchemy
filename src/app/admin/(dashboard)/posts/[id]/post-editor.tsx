"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { slugify, readingTime, cn } from "@/lib/utils";
import { savePost, deletePost, type PostState } from "../actions";

const INITIAL: PostState = {};

interface PostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroId: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {pending ? "Saving" : isNew ? "Create article" : "Save article"}
    </Button>
  );
}

export function PostEditor({
  post,
  categories,
  mediaOptions,
  canDelete,
}: {
  post: PostData | null;
  categories: { id: string; name: string }[];
  mediaOptions: { id: string; url: string; filename: string }[];
  canDelete: boolean;
}) {
  const [state, action] = useActionState(savePost, INITIAL);
  const isNew = !post;

  const [title, setTitle] = React.useState(post?.title ?? "");
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(post?.slug));
  const [content, setContent] = React.useState(post?.content ?? "");
  const [status, setStatus] = React.useState(post?.status ?? "DRAFT");
  const [heroId, setHeroId] = React.useState(post?.heroId ?? "");

  React.useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  const minutes = readingTime(content);
  const headings = (content.match(/^##\s+.+$/gm) ?? []).length;

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <input type="hidden" name="heroId" value={heroId} />

        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Card title="Article">
          <div className="grid gap-4 px-5 py-4">
            <Field label="Title" required>
              {({ id }) => (
                <Input
                  id={id}
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              )}
            </Field>

            <Field label="URL slug" required hint="/insights/<slug>">
              {({ id }) => (
                <Input
                  id={id}
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    setSlug(event.target.value);
                  }}
                  required
                />
              )}
            </Field>

            <Field
              label="Excerpt"
              hint="Shown on cards and used as the meta description if none is set."
            >
              {({ id }) => (
                <Textarea
                  id={id}
                  name="excerpt"
                  rows={2}
                  defaultValue={post?.excerpt ?? ""}
                  className="min-h-16"
                />
              )}
            </Field>

            <Field
              label="Content"
              required
              hint={`Markdown. ## headings become the table of contents. ${minutes} min read · ${headings} section${headings === 1 ? "" : "s"}.`}
            >
              {({ id }) => (
                <Textarea
                  id={id}
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={20}
                  required
                  className="min-h-[28rem] font-mono text-[0.8125rem] leading-relaxed"
                />
              )}
            </Field>
          </div>
        </Card>

        <Card title="Hero image">
          <div className="px-5 py-4">
            {mediaOptions.length ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setHeroId("")}
                  className={cn(
                    "flex size-20 items-center justify-center rounded-md border text-[0.6875rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    heroId === ""
                      ? "border-accent bg-accent-soft text-accent-text"
                      : "border-hairline text-ink-subtle hover:border-hairline-strong",
                  )}
                >
                  None
                </button>
                {mediaOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroId(item.id)}
                    aria-pressed={heroId === item.id}
                    title={item.filename}
                    className={cn(
                      "relative size-20 overflow-hidden rounded-md border transition-[border-color] duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                      heroId === item.id
                        ? "border-accent ring-2 ring-accent-soft"
                        : "border-hairline hover:border-hairline-strong",
                    )}
                  >
                    <Image src={item.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[0.875rem] text-ink-muted">
                No media uploaded yet.
              </p>
            )}
          </div>
        </Card>

        <Card title="SEO">
          <div className="grid gap-4 px-5 py-4">
            <Field label="Meta title" hint="Leave blank to use the article title.">
              {({ id }) => (
                <Input id={id} name="metaTitle" defaultValue={post?.metaTitle ?? ""} />
              )}
            </Field>
            <Field label="Meta description" hint="Leave blank to use the excerpt.">
              {({ id }) => (
                <Textarea
                  id={id}
                  name="metaDescription"
                  rows={2}
                  defaultValue={post?.metaDescription ?? ""}
                  className="min-h-16"
                />
              )}
            </Field>
          </div>
        </Card>

        <Card title="Publishing">
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-3">
            <Field label="Category">
              {({ id }) => (
                <Select id={id} name="categoryId" defaultValue={post?.categoryId ?? ""}>
                  <option value="">Uncategorised</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Status" required>
              {({ id }) => (
                <Select
                  id={id}
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              )}
            </Field>

            <Field
              label="Publish date"
              hint={
                status === "SCHEDULED"
                  ? "Required — it goes live at this time."
                  : "Optional."
              }
            >
              {({ id }) => (
                <Input
                  id={id}
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={post?.publishedAt ?? ""}
                />
              )}
            </Field>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-hairline px-5 py-4">
            <SaveButton isNew={isNew} />
            <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={post?.isFeatured}
                className="size-4 accent-[var(--color-accent-strong)]"
              />
              Featured
            </label>
          </div>
        </Card>
      </form>

      {post && canDelete ? (
        <Card title="Danger zone">
          <form action={deletePost} className="px-5 py-4">
            <input type="hidden" name="id" value={post.id} />
            <p className="mb-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              If the article has been indexed, archive it and add a redirect
              rather than deleting — a bare 404 loses whatever link value it
              had.
            </p>
            <button
              type="submit"
              className="rounded-md border border-hairline px-3 py-1.5 text-[0.8125rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Delete article
            </button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
