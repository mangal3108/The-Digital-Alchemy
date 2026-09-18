"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveJob, deleteJob, type JobState } from "./actions";
import { EMPLOYMENT_TYPE_LABELS, WORKPLACE_LABELS } from "@/content/careers";

const INITIAL: JobState = { ok: false };

export interface Job {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  employmentType: string;
  workplace: string;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  salaryRange: string;
  applyEmail: string;
  applyUrl: string;
  status: string;
  closesAt: string;
  metaTitle: string;
  metaDescription: string;
  orderIndex: number;
}

export const BLANK_JOB: Job = {
  slug: "",
  title: "",
  summary: "",
  employmentType: "FULL_TIME",
  workplace: "HYBRID",
  location: "",
  description: "",
  responsibilities: "",
  requirements: "",
  salaryRange: "",
  applyEmail: "",
  applyUrl: "",
  status: "DRAFT",
  closesAt: "",
  metaTitle: "",
  metaDescription: "",
  orderIndex: 0,
};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : label}
    </Button>
  );
}

function Fields({ job }: { job: Job }) {
  const [status, setStatus] = React.useState(job.status);

  return (
    <div className="grid gap-4">
      <input type="hidden" name="id" defaultValue={job.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job title" required>
          {({ id }) => (
            <Input id={id} name="title" defaultValue={job.title} required maxLength={160} />
          )}
        </Field>
        <Field label="URL slug" hint="Leave blank to generate one from the title.">
          {({ id }) => (
            <Input id={id} name="slug" defaultValue={job.slug} maxLength={160} />
          )}
        </Field>
      </div>

      <Field
        label="Summary"
        required
        hint="One or two sentences. Shown on the careers list and used as the search description."
      >
        {({ id }) => (
          <Textarea
            id={id}
            name="summary"
            defaultValue={job.summary}
            rows={2}
            required
            maxLength={400}
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Employment type" required>
          {({ id }) => (
            <Select id={id} name="employmentType" defaultValue={job.employmentType}>
              {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Workplace" required>
          {({ id }) => (
            <Select id={id} name="workplace" defaultValue={job.workplace}>
              {Object.entries(WORKPLACE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Location" hint="For example: New Delhi, India.">
          {({ id }) => (
            <Input id={id} name="location" defaultValue={job.location} maxLength={160} />
          )}
        </Field>
      </div>

      <Field label="Description" hint="Markdown. The full role description on its own page.">
        {({ id }) => (
          <Textarea
            id={id}
            name="description"
            defaultValue={job.description}
            rows={8}
            maxLength={12000}
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Responsibilities" hint="One per line.">
          {({ id }) => (
            <Textarea
              id={id}
              name="responsibilities"
              defaultValue={job.responsibilities}
              rows={5}
              maxLength={4000}
            />
          )}
        </Field>
        <Field label="Requirements" hint="One per line.">
          {({ id }) => (
            <Textarea
              id={id}
              name="requirements"
              defaultValue={job.requirements}
              rows={5}
              maxLength={4000}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Salary range"
          hint="Optional, and only if you intend to honour it. Leave blank rather than guessing."
        >
          {({ id }) => (
            <Input id={id} name="salaryRange" defaultValue={job.salaryRange} maxLength={120} />
          )}
        </Field>
        <Field label="Closing date" hint="Optional.">
          {({ id }) => (
            <Input id={id} type="date" name="closesAt" defaultValue={job.closesAt} />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Application email"
          hint="Where applications go. One of these two is required to publish."
        >
          {({ id }) => (
            <Input
              id={id}
              type="email"
              name="applyEmail"
              defaultValue={job.applyEmail}
              maxLength={160}
            />
          )}
        </Field>
        <Field label="Application URL" hint="An external form or ATS link.">
          {({ id }) => (
            <Input
              id={id}
              type="url"
              name="applyUrl"
              defaultValue={job.applyUrl}
              maxLength={400}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meta title" hint="Optional. Falls back to the job title.">
          {({ id }) => (
            <Input id={id} name="metaTitle" defaultValue={job.metaTitle} maxLength={160} />
          )}
        </Field>
        <Field label="Meta description" hint="Optional. Falls back to the summary.">
          {({ id }) => (
            <Input
              id={id}
              name="metaDescription"
              defaultValue={job.metaDescription}
              maxLength={320}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" required>
          {({ id }) => (
            <Select
              id={id}
              name="status"
              defaultValue={job.status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="DRAFT">Draft — not on the site</option>
              <option value="PUBLISHED">Published — live on /careers</option>
              <option value="CLOSED">Closed — hidden, kept for the record</option>
            </Select>
          )}
        </Field>
        <Field label="Order" hint="Lower numbers appear first.">
          {({ id }) => (
            <Input
              id={id}
              type="number"
              name="orderIndex"
              defaultValue={job.orderIndex}
              min={0}
              max={999}
            />
          )}
        </Field>
      </div>

      {status === "PUBLISHED" ? (
        <Notice>
          Publishing puts this role on <code>/careers</code> with a JobPosting
          structured-data block, which is what makes it eligible for Google
          Jobs. Everything above is what gets indexed, so it is worth reading
          once more.
        </Notice>
      ) : null}
    </div>
  );
}

export function JobEditor({ job }: { job: Job }) {
  const [state, action] = useActionState(saveJob, INITIAL);
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold text-ink">
            {job.title}
          </p>
          <p className="mt-1 text-[0.8125rem] text-ink-subtle">
            {EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType} ·{" "}
            {WORKPLACE_LABELS[job.workplace] ?? job.workplace}
            {job.location ? ` · ${job.location}` : ""} ·{" "}
            {job.status.toLowerCase()}
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Edit"}
        </Button>
      </div>

      {open ? (
        <>
          <form action={action} className="mt-5 grid gap-4">
            <Fields job={job} />
            {state.error ? <Notice tone="error">{state.error}</Notice> : null}
            {state.message ? (
              <Notice tone="success">{state.message}</Notice>
            ) : null}
            <div className="flex justify-end">
              <SaveButton label="Save role" />
            </div>
          </form>

          <form
            action={deleteJob}
            className="mt-3 flex justify-end border-t border-hairline pt-3"
          >
            <input type="hidden" name="id" defaultValue={job.id} />
            <Button type="submit" size="sm" variant="ghost">
              Delete this role
            </Button>
          </form>
        </>
      ) : null}
    </Card>
  );
}

/**
 * Adding a role: the button and the form it opens.
 *
 * These are two components sharing one piece of state rather than one
 * component that swaps between them, because they render in two different
 * places. The button belongs in the page header; the form does not — the
 * header's action slot is `shrink-0`, so a full-width form placed there could
 * not shrink, ran off the right of the page and overlapped the heading beside
 * it. The form now opens in the page body, directly above the list it adds to.
 */
const AddRoleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useAddRole() {
  const context = React.useContext(AddRoleContext);
  if (!context) {
    throw new Error("Add-role controls must be rendered inside <AddRoleProvider>.");
  }
  return context;
}

export function AddRoleProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return <AddRoleContext.Provider value={value}>{children}</AddRoleContext.Provider>;
}

export function AddRoleButton() {
  const { open, setOpen } = useAddRole();
  return (
    <Button size="sm" variant={open ? "secondary" : "primary"} onClick={() => setOpen(!open)}>
      {open ? "Cancel" : "Add a role"}
    </Button>
  );
}

export function AddRolePanel() {
  const { open, setOpen } = useAddRole();
  const [state, action] = useActionState(saveJob, INITIAL);

  // A saved role arrives in the list below on the next render, so leaving the
  // blank form open would look like the save had not worked.
  React.useEffect(() => {
    if (state.message) setOpen(false);
  }, [state.message, setOpen]);

  if (!open) return null;

  return (
    <Card className="mb-4">
      <form action={action} className="grid gap-4">
        <Fields job={BLANK_JOB} />
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        {state.message ? <Notice tone="success">{state.message}</Notice> : null}
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <SaveButton label="Add role" />
        </div>
      </form>
    </Card>
  );
}
