"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveSeoOverride, type SeoState } from "./actions";
import { siteConfig } from "@/config/site";

const INITIAL: SeoState = {};

interface Existing {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  noindex: boolean;
}

/**
 * Google truncates by pixel width, not character count, so these are guidance
 * rather than hard limits — the field never blocks you from exceeding them.
 */
const TITLE_GUIDE = 60;
const DESCRIPTION_GUIDE = 155;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : "Save overrides"}
    </Button>
  );
}

export function SeoForm({
  paths,
  existing,
}: {
  paths: { path: string; label: string }[];
  existing: Existing[];
}) {
  const [state, action] = useActionState(saveSeoOverride, INITIAL);
  const [path, setPath] = React.useState(paths[0]?.path ?? "/");

  const current = existing.find((item) => item.path === path);

  const [title, setTitle] = React.useState(current?.title ?? "");
  const [description, setDescription] = React.useState(
    current?.description ?? "",
  );

  // Reload the fields whenever a different page is selected.
  React.useEffect(() => {
    const match = existing.find((item) => item.path === path);
    setTitle(match?.title ?? "");
    setDescription(match?.description ?? "");
  }, [path, existing]);

  // The canonical host, not `window.location.host`.
  //
  // Two reasons. It is a preview of a Google result, so it has to show the
  // domain the page will actually be indexed under — an operator editing on
  // localhost was being shown "localhost:3000" as their search snippet. And
  // reading `window` during render made the server and client produce
  // different HTML, which is a hydration mismatch: React throws the server
  // markup away and re-renders the subtree on the client.
  const host = new URL(siteConfig.url).host;

  return (
    <div className="grid gap-4">
      <Card title="Edit a page">
        <form action={action} className="space-y-4 px-5 py-4">
          {state.message ? <Notice>{state.message}</Notice> : null}
          {state.error ? <Notice tone="error">{state.error}</Notice> : null}

          <Field label="Page" required>
            {({ id }) => (
              <Select
                id={id}
                name="path"
                value={path}
                onChange={(event) => setPath(event.target.value)}
              >
                {paths.map((entry) => (
                  <option key={entry.path} value={entry.path}>
                    {entry.label} — {entry.path}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Title"
            hint={`${title.length} characters — around ${TITLE_GUIDE} is usually shown.`}
            error={state.fields?.title}
          >
            {({ id }) => (
              <Input
                id={id}
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Leave blank to use the page's own title"
              />
            )}
          </Field>

          <Field
            label="Meta description"
            hint={`${description.length} characters — around ${DESCRIPTION_GUIDE} is usually shown.`}
            error={state.fields?.description}
          >
            {({ id }) => (
              <Textarea
                id={id}
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="min-h-20"
                placeholder="Leave blank to use the page's own description"
              />
            )}
          </Field>

          <Field
            label="Canonical URL"
            hint="Only set this if this page duplicates another. Absolute URL."
            error={state.fields?.canonical}
          >
            {({ id }) => (
              <Input
                id={id}
                name="canonical"
                defaultValue={current?.canonical ?? ""}
                placeholder="https://…"
              />
            )}
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Social title">
              {({ id }) => (
                <Input
                  id={id}
                  name="ogTitle"
                  defaultValue={current?.ogTitle ?? ""}
                  className="h-10"
                />
              )}
            </Field>
            <Field label="Social description">
              {({ id }) => (
                <Input
                  id={id}
                  name="ogDescription"
                  defaultValue={current?.ogDescription ?? ""}
                  className="h-10"
                />
              )}
            </Field>
          </div>

          <label className="flex items-start gap-2.5 rounded-md border border-hairline bg-canvas p-3">
            <input
              type="checkbox"
              name="noindex"
              defaultChecked={current?.noindex ?? false}
              className="mt-0.5 size-4 accent-[var(--color-accent-strong)]"
            />
            <span>
              <span className="block text-[0.8125rem] font-medium text-ink">
                Hide from search engines
              </span>
              <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-ink-subtle">
                Adds a noindex directive and removes the page from the sitemap.
                Use for thin or duplicate pages you still want reachable.
              </span>
            </span>
          </label>

          <SaveButton />
        </form>
      </Card>

      {/* ---- Previews ---- */}
      <Card
        title="Preview"
        description="Approximate. Search engines rewrite titles and descriptions when they judge a different one more useful."
      >
        <div className="space-y-5 px-5 py-4">
          <div>
            <p className="eyebrow mb-2.5">Search result</p>
            <div className="rounded-md border border-hairline bg-canvas p-4">
              <p className="text-[0.75rem] text-ink-muted">
                {host}
                <span className="text-ink-subtle">
                  {path === "/" ? "" : ` › ${path.slice(1).split("/").join(" › ")}`}
                </span>
              </p>
              <p
                className={cn(
                  "mt-1 text-[1.0625rem] leading-snug text-[#1a0dab]",
                  title.length > TITLE_GUIDE && "line-clamp-1",
                )}
              >
                {title || "Uses the page's own title"}
              </p>
              <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                {description || "Uses the page's own meta description."}
              </p>
            </div>
            {title.length > TITLE_GUIDE ? (
              <p className="mt-2 text-[0.75rem] text-warning">
                This title is longer than usually displayed and may be
                truncated.
              </p>
            ) : null}
            {description.length > DESCRIPTION_GUIDE + 15 ? (
              <p className="mt-1 text-[0.75rem] text-warning">
                This description is likely to be cut short.
              </p>
            ) : null}
          </div>

          <div>
            <p className="eyebrow mb-2.5">Social card</p>
            <div className="overflow-hidden rounded-md border border-hairline">
              <div className="flex aspect-[1.91/1] items-center justify-center bg-ink-900">
                <span className="text-[0.75rem] text-ink-300">
                  Generated share image
                </span>
              </div>
              <div className="bg-canvas px-3.5 py-2.5">
                <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-ink-subtle">
                  {host}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[0.875rem] font-medium text-ink">
                  {title || "Page title"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[0.75rem] text-ink-muted">
                  {description || "Page description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
