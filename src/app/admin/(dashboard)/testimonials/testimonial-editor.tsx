"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  saveTestimonial,
  deleteTestimonial,
  type TestimonialState,
} from "./actions";

const INITIAL: TestimonialState = {};

interface Testimonial {
  id?: string;
  quote: string;
  authorName: string;
  position: string;
  company: string;
  country: string;
  rating?: number;
  videoUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
}

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : label}
    </Button>
  );
}

function Fields({
  testimonial,
  errors,
}: {
  testimonial: Testimonial;
  errors?: Record<string, string>;
}) {
  return (
    <>
      <Field label="Quote" required error={errors?.quote}>
        {({ id, invalid }) => (
          <Textarea
            id={id}
            name="quote"
            defaultValue={testimonial.quote}
            invalid={invalid}
            rows={4}
            className="min-h-24"
          />
        )}
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" required error={errors?.authorName}>
          {({ id, invalid }) => (
            <Input
              id={id}
              name="authorName"
              defaultValue={testimonial.authorName}
              invalid={invalid}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Position" error={errors?.position}>
          {({ id }) => (
            <Input
              id={id}
              name="position"
              defaultValue={testimonial.position}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Company" error={errors?.company}>
          {({ id }) => (
            <Input
              id={id}
              name="company"
              defaultValue={testimonial.company}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Country" error={errors?.country}>
          {({ id }) => (
            <Input
              id={id}
              name="country"
              defaultValue={testimonial.country}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Rating" hint="Leave blank to hide stars.">
          {({ id }) => (
            <Select
              id={id}
              name="rating"
              defaultValue={testimonial.rating ? String(testimonial.rating) : ""}
              className="h-10"
            >
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
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
              defaultValue={testimonial.order}
              className="h-10"
            />
          )}
        </Field>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={testimonial.isPublished}
            className="size-4 accent-[var(--color-accent-strong)]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={testimonial.isFeatured}
            className="size-4 accent-[var(--color-accent-strong)]"
          />
          Featured
        </label>
      </div>
    </>
  );
}

export function TestimonialEditor({
  testimonial,
  canDelete,
}: {
  testimonial: Testimonial;
  canDelete: boolean;
}) {
  const [state, action] = useActionState(saveTestimonial, INITIAL);

  return (
    <div className="space-y-4 px-5 py-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={testimonial.id} />
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Fields testimonial={testimonial} errors={state.fields} />
        <SaveButton />
      </form>

      {canDelete ? (
        <form
          action={deleteTestimonial}
          className="border-t border-hairline pt-3"
        >
          <input type="hidden" name="id" value={testimonial.id} />
          <button
            type="submit"
            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Delete testimonial
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function NewTestimonial() {
  const [state, action] = useActionState(saveTestimonial, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card
      title="Add a testimonial"
      description="Only add quotes you have actual permission to publish."
    >
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Fields
          testimonial={{
            quote: "",
            authorName: "",
            position: "",
            company: "",
            country: "",
            videoUrl: "",
            isPublished: false,
            isFeatured: false,
            order: 0,
          }}
          errors={state.fields}
        />
        <SaveButton label="Add testimonial" />
      </form>
    </Card>
  );
}
