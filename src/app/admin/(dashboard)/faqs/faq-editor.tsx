"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveFaq, deleteFaq, type FaqState } from "./actions";

const INITIAL: FaqState = {};

interface Faq {
  id?: string;
  question: string;
  answer: string;
  scopeType: string;
  scopeKey: string;
  isPublished: boolean;
  order: number;
}

type ScopeOptions = Record<string, { value: string; label: string }[]>;

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : label}
    </Button>
  );
}

function Fields({
  faq,
  scopeOptions,
}: {
  faq: Faq;
  scopeOptions: ScopeOptions;
}) {
  const [scopeType, setScopeType] = React.useState(faq.scopeType);
  const options = scopeOptions[scopeType] ?? [];

  return (
    <>
      <Field label="Question" required>
        {({ id }) => (
          <Input id={id} name="question" defaultValue={faq.question} required />
        )}
      </Field>

      <Field label="Answer" required>
        {({ id }) => (
          <Textarea
            id={id}
            name="answer"
            rows={4}
            defaultValue={faq.answer}
            required
            className="min-h-24"
          />
        )}
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Appears on" required>
          {({ id }) => (
            <Select
              id={id}
              name="scopeType"
              value={scopeType}
              onChange={(event) => setScopeType(event.target.value)}
              className="h-10"
            >
              <option value="general">General</option>
              <option value="service">A service page</option>
              <option value="industry">An industry page</option>
              <option value="location">A market page</option>
            </Select>
          )}
        </Field>

        <Field label="Which page" required={scopeType !== "general"}>
          {({ id }) => (
            <Select
              id={id}
              name="scopeKey"
              defaultValue={faq.scopeKey}
              disabled={scopeType === "general"}
              className="h-10"
            >
              <option value="">
                {scopeType === "general" ? "Not applicable" : "Choose…"}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Order">
          {({ id }) => (
            <Input
              id={id}
              name="order"
              type="number"
              min={0}
              defaultValue={faq.order}
              className="h-10"
            />
          )}
        </Field>
      </div>

      <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={faq.isPublished}
          className="size-4 accent-[var(--color-accent-strong)]"
        />
        Visible on the site
      </label>
    </>
  );
}

export function FaqEditor({
  faq,
  scopeOptions,
}: {
  faq: Faq;
  scopeOptions: ScopeOptions;
}) {
  const [state, action] = useActionState(saveFaq, INITIAL);

  return (
    <div className="space-y-4 px-5 py-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={faq.id} />
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields faq={faq} scopeOptions={scopeOptions} />
        <SaveButton label="Save" />
      </form>

      <form action={deleteFaq} className="border-t border-hairline pt-3">
        <input type="hidden" name="id" value={faq.id} />
        <button
          type="submit"
          className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Delete
        </button>
      </form>
    </div>
  );
}

export function NewFaq({ scopeOptions }: { scopeOptions: ScopeOptions }) {
  const [state, action] = useActionState(saveFaq, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Add an FAQ">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields
          faq={{
            question: "",
            answer: "",
            scopeType: "general",
            scopeKey: "",
            isPublished: true,
            order: 0,
          }}
          scopeOptions={scopeOptions}
        />
        <SaveButton label="Add FAQ" />
      </form>
    </Card>
  );
}
