"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORIES, PROJECT_CATEGORY_LABELS } from "@/lib/db";
import { slugify, cn } from "@/lib/utils";
import {
  saveProject,
  deleteProject,
  addProjectResult,
  deleteProjectResult,
  type ProjectState,
} from "../actions";

const INITIAL: ProjectState = {};

interface ProjectResult {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface ProjectData {
  id: string;
  slug: string;
  title: string;
  clientId: string;
  clientName: string;
  category: string;
  industry: string;
  country: string;
  year: string;
  durationText: string;
  summary: string;
  challenge: string;
  strategy: string;
  research: string;
  design: string;
  technology: string;
  development: string;
  marketing: string;
  outcome: string;
  websiteUrl: string;
  heroId: string;
  services: string[];
  techStack: string;
  isFeatured: boolean;
  status: string;
  order: number;
  results: ProjectResult[];
}

const NARRATIVE_FIELDS = [
  { key: "challenge", label: "The challenge", hint: "What the client came to us with." },
  { key: "strategy", label: "Strategy", hint: "The approach and why." },
  { key: "research", label: "Research", hint: "Optional." },
  { key: "design", label: "Design" },
  { key: "technology", label: "Technology" },
  { key: "development", label: "Development" },
  { key: "marketing", label: "Marketing" },
  { key: "outcome", label: "Outcome", hint: "What changed. Keep it to what you can evidence." },
] as const;

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {pending ? "Saving" : isNew ? "Create project" : "Save project"}
    </Button>
  );
}

export function ProjectEditor({
  project,
  serviceOptions,
  mediaOptions,
  clientOptions,
  canDelete,
}: {
  project: ProjectData | null;
  serviceOptions: { slug: string; name: string }[];
  mediaOptions: { id: string; url: string; filename: string }[];
  clientOptions: { id: string; name: string }[];
  canDelete: boolean;
}) {
  const [state, action] = useActionState(saveProject, INITIAL);
  const isNew = !project;

  const [title, setTitle] = React.useState(project?.title ?? "");
  const [slug, setSlug] = React.useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(project?.slug));
  const [heroId, setHeroId] = React.useState(project?.heroId ?? "");

  // Auto-derive the slug until an editor types their own.
  React.useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={project?.id ?? ""} />
        <input type="hidden" name="heroId" value={heroId} />

        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Card title="Basics">
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <Field label="Title" required className="sm:col-span-2">
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

            <Field
              label="URL slug"
              required
              hint="The public address: /work/<slug>"
              className="sm:col-span-2"
            >
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

            <Field label="Client (from list)">
              {({ id }) => (
                <Select id={id} name="clientId" defaultValue={project?.clientId ?? ""}>
                  <option value="">Not linked</option>
                  {clientOptions.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Client name (free text)" hint="Used when no client record exists.">
              {({ id }) => (
                <Input id={id} name="clientName" defaultValue={project?.clientName ?? ""} />
              )}
            </Field>

            <Field label="Category" required>
              {({ id }) => (
                <Select id={id} name="category" defaultValue={project?.category ?? "web"}>
                  {PROJECT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {PROJECT_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Industry" hint="Links the project to that industry page.">
              {({ id }) => (
                <Input id={id} name="industry" defaultValue={project?.industry ?? ""} />
              )}
            </Field>

            <Field label="Market / country">
              {({ id }) => (
                <Input id={id} name="country" defaultValue={project?.country ?? ""} />
              )}
            </Field>

            <Field label="Year">
              {({ id }) => (
                <Input id={id} name="year" type="number" defaultValue={project?.year ?? ""} />
              )}
            </Field>

            <Field label="Duration" hint="e.g. 14 weeks">
              {({ id }) => (
                <Input
                  id={id}
                  name="durationText"
                  defaultValue={project?.durationText ?? ""}
                />
              )}
            </Field>

            <Field label="Live URL">
              {({ id }) => (
                <Input
                  id={id}
                  name="websiteUrl"
                  type="url"
                  defaultValue={project?.websiteUrl ?? ""}
                />
              )}
            </Field>

            <Field
              label="Summary"
              className="sm:col-span-2"
              hint="One or two sentences. Used on cards and as the meta description."
            >
              {({ id }) => (
                <Textarea
                  id={id}
                  name="summary"
                  rows={3}
                  defaultValue={project?.summary ?? ""}
                  className="min-h-20"
                />
              )}
            </Field>
          </div>
        </Card>

        <Card title="Hero image">
          <div className="px-5 py-4">
            {mediaOptions.length ? (
              <>
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
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[0.75rem] text-ink-subtle">
                  No hero image? The case study falls back to a neutral browser
                  frame rather than a stock photo.
                </p>
              </>
            ) : (
              <p className="text-[0.875rem] text-ink-muted">
                No media uploaded yet. Add images under Media first.
              </p>
            )}
          </div>
        </Card>

        <Card
          title="Services and technology"
          description="Drives the related-work sections on service pages."
        >
          <div className="px-5 py-4">
            <fieldset>
              <legend className="text-[0.875rem] font-medium text-ink">
                Services involved
              </legend>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service.slug}
                    className="flex items-center gap-2 text-[0.8125rem] text-ink-muted"
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service.slug}
                      defaultChecked={project?.services.includes(service.slug)}
                      className="size-4 accent-[var(--color-accent-strong)]"
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <Field
                label="Technology"
                hint="Comma separated keys, e.g. nextjs, postgresql, stripe"
              >
                {({ id }) => (
                  <Input
                    id={id}
                    name="techStack"
                    defaultValue={project?.techStack ?? ""}
                  />
                )}
              </Field>
            </div>
          </div>
        </Card>

        <Card
          title="The story"
          description="Leave any section blank and it will not render on the page."
        >
          <div className="grid gap-4 px-5 py-4">
            {NARRATIVE_FIELDS.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                hint={"hint" in field ? field.hint : undefined}
              >
                {({ id }) => (
                  <Textarea
                    id={id}
                    name={field.key}
                    rows={4}
                    defaultValue={project?.[field.key] ?? ""}
                  />
                )}
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Publishing">
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-3">
            <Field label="Status" required>
              {({ id }) => (
                <Select id={id} name="status" defaultValue={project?.status ?? "DRAFT"}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              )}
            </Field>
            <Field label="Display order">
              {({ id }) => (
                <Input
                  id={id}
                  name="order"
                  type="number"
                  min={0}
                  defaultValue={project?.order ?? 0}
                />
              )}
            </Field>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={project?.isFeatured}
                  className="size-4 accent-[var(--color-accent-strong)]"
                />
                Feature on the homepage
              </label>
            </div>
          </div>

          <div className="border-t border-hairline px-5 py-4">
            <SaveButton isNew={isNew} />
          </div>
        </Card>
      </form>

      {/* Results live outside the main form so adding one does not require
          saving the whole project. */}
      {project ? (
        <ResultsCard projectId={project.id} results={project.results} />
      ) : null}

      {project && canDelete ? (
        <Card title="Danger zone">
          <form action={deleteProject} className="px-5 py-4">
            <input type="hidden" name="id" value={project.id} />
            <p className="mb-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              Deleting removes the case study, its results and its gallery
              links. Archiving is usually better — it keeps the record and takes
              the page offline.
            </p>
            <button
              type="submit"
              className="rounded-md border border-hairline px-3 py-1.5 text-[0.8125rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Delete project
            </button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

function ResultsCard({
  projectId,
  results,
}: {
  projectId: string;
  results: ProjectResult[];
}) {
  const [state, action] = useActionState(addProjectResult, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card
      title="Results"
      description="Only add figures the client has confirmed. With none, the results block does not render at all."
    >
      {results.length ? (
        <ul className="divide-y divide-hairline">
          {results.map((result) => (
            <li
              key={result.id}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <span className="min-w-0">
                <span className="numeric text-[1.125rem] font-semibold text-ink">
                  {result.value}
                </span>
                <span className="ml-2 text-[0.875rem] text-ink-muted">
                  {result.label}
                </span>
                {result.note ? (
                  <span className="block text-[0.75rem] text-ink-subtle">
                    {result.note}
                  </span>
                ) : null}
              </span>
              <form action={deleteProjectResult}>
                <input type="hidden" name="id" value={result.id} />
                <button
                  type="submit"
                  className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : null}

      <form
        ref={formRef}
        action={action}
        className="grid gap-3 border-t border-hairline px-5 py-4 sm:grid-cols-[8rem_1fr_1fr_auto] sm:items-end"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <Field label="Value">
          {({ id }) => (
            <Input id={id} name="value" placeholder="+142%" className="h-10" />
          )}
        </Field>
        <Field label="Label">
          {({ id }) => (
            <Input
              id={id}
              name="label"
              placeholder="Organic enquiries"
              className="h-10"
            />
          )}
        </Field>
        <Field label="Note">
          {({ id }) => (
            <Input
              id={id}
              name="note"
              placeholder="Six months post-launch"
              className="h-10"
            />
          )}
        </Field>
        <Button type="submit" size="sm" variant="secondary" className="mb-0.5">
          Add
        </Button>

        {state.error ? (
          <p
            role="alert"
            className="text-[0.8125rem] font-medium text-danger sm:col-span-4"
          >
            {state.error}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
