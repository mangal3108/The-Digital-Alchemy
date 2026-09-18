"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { uploadMedia, updateMediaMeta, removeMedia, type MediaState } from "./actions";

const INITIAL: MediaState = {};

function PendingButton({
  label,
  pendingLabel,
  variant = "primary",
  className,
}: {
  label: string;
  pendingLabel: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      variant={variant}
      loading={pending}
      className={className}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function MediaUploader() {
  const [state, action] = useActionState(uploadMedia, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [names, setNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setNames([]);
    }
  }, [state.ok]);

  return (
    <Card
      title="Upload"
      description="JPEG, PNG, WebP, AVIF or GIF. Up to 12MB each."
    >
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Field label="Files" required hint="Select up to 10 at once.">
          {({ id }) => (
            <input
              id={id}
              name="files"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              required
              onChange={(event) =>
                setNames(Array.from(event.target.files ?? []).map((f) => f.name))
              }
              className="w-full rounded-md border border-hairline-strong bg-surface px-3 py-2.5 text-[0.875rem] text-ink file:mr-3 file:rounded file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-medium file:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            />
          )}
        </Field>

        {names.length === 1 ? (
          <Field
            label="Alt text"
            hint="Describe what the image shows, for screen readers and search."
          >
            {({ id }) => <Input id={id} name="alt" />}
          </Field>
        ) : null}

        {names.length > 1 ? (
          <p className="text-[0.75rem] text-ink-subtle">
            {names.length} files selected. Add alt text to each after uploading.
          </p>
        ) : null}

        <PendingButton label="Upload" pendingLabel="Uploading" />

        <p className="border-t border-hairline pt-3 text-[0.75rem] leading-relaxed text-ink-subtle">
          SVG is not accepted: it can contain scripts, and serving one from this
          domain would be a security risk.
        </p>
      </form>
    </Card>
  );
}

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  alt: string;
  title: string;
  caption: string;
  width: number | null;
  height: number | null;
  sizeLabel: string;
  uploadedBy: string | null;
  createdAt: string;
  usage: string[];
}

export function MediaItem({
  file,
  canDelete,
  children,
}: {
  file: MediaFile;
  canDelete: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [metaState, metaAction] = useActionState(updateMediaMeta, INITIAL);
  const [deleteState, deleteAction] = useActionState(removeMedia, INITIAL);

  const missingAlt = !file.alt.trim();

  return (
    <li className="overflow-hidden rounded-md border border-hairline bg-canvas">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="block w-full text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
      >
        <span className="relative block aspect-square overflow-hidden bg-surface-2">
          {children}
        </span>
        <span className="block px-2.5 py-2">
          <span className="block truncate text-[0.75rem] font-medium text-ink">
            {file.filename}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[0.6875rem] text-ink-subtle">
            {file.width && file.height ? `${file.width}×${file.height}` : null}
            <span>· {file.sizeLabel}</span>
          </span>
          {missingAlt ? (
            <span className="mt-1 inline-block rounded-full bg-copper-50 px-1.5 py-0.5 text-[0.625rem] font-medium text-warning">
              No alt text
            </span>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="border-t border-hairline bg-surface px-3 py-3">
          <form action={metaAction} className="space-y-2.5">
            <input type="hidden" name="id" value={file.id} />
            <Field label="Alt text">
              {({ id }) => (
                <Input
                  id={id}
                  name="alt"
                  defaultValue={file.alt}
                  className="h-9 text-[0.8125rem]"
                />
              )}
            </Field>
            <Field label="Caption">
              {({ id }) => (
                <Input
                  id={id}
                  name="caption"
                  defaultValue={file.caption}
                  className="h-9 text-[0.8125rem]"
                />
              )}
            </Field>
            {metaState.message ? (
              <p className="text-[0.75rem] font-medium text-success">
                {metaState.message}
              </p>
            ) : null}
            <PendingButton
              label="Save"
              pendingLabel="Saving"
              variant="secondary"
            />
          </form>

          <p className="mt-3 border-t border-hairline pt-2.5 text-[0.6875rem] leading-relaxed text-ink-subtle">
            {file.usage.length
              ? `In use: ${file.usage.join(", ")}`
              : "Not currently used anywhere."}
            <br />
            Uploaded {file.createdAt}
            {file.uploadedBy ? ` by ${file.uploadedBy}` : ""}
          </p>

          {canDelete ? (
            <form action={deleteAction} className="mt-2.5">
              <input type="hidden" name="id" value={file.id} />
              {deleteState.error ? (
                <p
                  role="alert"
                  className="mb-2 text-[0.6875rem] font-medium text-danger"
                >
                  {deleteState.error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={file.usage.length > 0}
                className="rounded-md border border-hairline px-2.5 py-1 text-[0.6875rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                title={
                  file.usage.length
                    ? "Remove the references to this file first"
                    : undefined
                }
              >
                Delete
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
