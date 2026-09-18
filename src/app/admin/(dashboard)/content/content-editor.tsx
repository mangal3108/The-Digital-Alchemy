"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveContent, resetContent, type ContentState } from "./actions";
import type { EditableField } from "@/content/editable";

const INITIAL: ContentState = { ok: false };

export interface EntryValues {
  /** The value in the repository, always shown as the placeholder. */
  defaults: Record<string, string>;
  /** Only fields somebody has changed. */
  overrides: Record<string, string>;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : "Save copy"}
    </Button>
  );
}

function FieldRow({
  field,
  def,
  override,
}: {
  field: EditableField;
  def: string;
  override: string;
}) {
  const [value, setValue] = React.useState(override);
  const isOverridden = value.trim().length > 0;
  const Control = field.multiline ? Textarea : Input;

  return (
    <Field
      label={field.label}
      hint={
        field.hint
          ? `${field.hint}${field.guide ? ` Around ${field.guide} characters.` : ""}`
          : undefined
      }
    >
      {({ id }) => (
        <div className="grid gap-1.5">
          <Control
            id={id}
            name={`field:${field.name}`}
            value={value}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setValue(event.target.value)}
            rows={field.multiline ? 3 : undefined}
            // The repository copy is the placeholder, so an editor can always
            // see what they are replacing and what clearing the box restores.
            placeholder={def}
            maxLength={4000}
          />
          <div className="flex items-center justify-between gap-3 text-[0.75rem]">
            <span className={isOverridden ? "text-accent-text" : "text-ink-subtle"}>
              {isOverridden ? "Edited — differs from the code" : "Using the original copy"}
            </span>
            {isOverridden ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="rounded-xs text-ink-subtle underline underline-offset-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Reset this field
              </button>
            ) : null}
          </div>
        </div>
      )}
    </Field>
  );
}

export function ContentEditor({
  scope,
  entryKey,
  label,
  fields,
  values,
}: {
  scope: string;
  entryKey: string;
  label: string;
  fields: EditableField[];
  values: EntryValues;
}) {
  const [state, action] = useActionState(saveContent, INITIAL);
  const overriddenCount = Object.keys(values.overrides).length;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-semibold text-ink">{label}</p>
          <p className="mt-1 font-mono text-[0.75rem] text-ink-subtle">
            {scope === "page" ? entryKey : `${scope}/${entryKey}`}
          </p>
        </div>
        <span className="shrink-0 text-[0.75rem] text-ink-subtle">
          {overriddenCount
            ? `${overriddenCount} field${overriddenCount === 1 ? "" : "s"} edited`
            : "Unchanged"}
        </span>
      </div>

      <form action={action} className="mt-5 grid gap-4">
        <input type="hidden" name="scope" value={scope} />
        <input type="hidden" name="entryKey" value={entryKey} />

        {fields.map((field) => (
          <FieldRow
            key={field.name}
            field={field}
            def={values.defaults[field.name] ?? ""}
            override={values.overrides[field.name] ?? ""}
          />
        ))}

        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        {state.message ? <Notice tone="success">{state.message}</Notice> : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.75rem] text-ink-subtle">
            Clearing a box restores the original wording from the repository.
          </p>
          <SaveButton />
        </div>
      </form>

      {overriddenCount ? (
        <form
          action={resetContent}
          className="mt-3 flex justify-end border-t border-hairline pt-3"
        >
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="entryKey" value={entryKey} />
          <Button type="submit" size="sm" variant="ghost">
            Reset this page to the original copy
          </Button>
        </form>
      ) : null}
    </Card>
  );
}
