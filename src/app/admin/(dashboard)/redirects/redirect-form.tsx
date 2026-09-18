"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createRedirect, type RedirectState } from "./actions";

const INITIAL: RedirectState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Adding" : "Add redirect"}
    </Button>
  );
}

export function RedirectForm() {
  const [state, action] = useActionState(createRedirect, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Add a redirect">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Field
          label="From"
          required
          hint="Old path, starting with a slash."
          error={state.fields?.source}
        >
          {({ id, invalid }) => (
            <Input
              id={id}
              name="source"
              placeholder="/old-page"
              required
              invalid={invalid}
            />
          )}
        </Field>

        <Field
          label="To"
          required
          hint="New path, or a full URL for an external destination."
          error={state.fields?.destination}
        >
          {({ id, invalid }) => (
            <Input
              id={id}
              name="destination"
              placeholder="/services/web-development"
              required
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Type" required>
          {({ id }) => (
            <Select id={id} name="statusCode" defaultValue="301">
              <option value="301">301 — Permanent</option>
              <option value="302">302 — Temporary</option>
            </Select>
          )}
        </Field>

        <Field label="Note">
          {({ id }) => (
            <Input id={id} name="note" placeholder="Why this exists" />
          )}
        </Field>

        <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked
            className="size-4 accent-[var(--color-accent-strong)]"
          />
          Active immediately
        </label>

        <SubmitButton />
      </form>
    </Card>
  );
}
