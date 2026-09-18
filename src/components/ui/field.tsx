"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Every control is wrapped by `Field`, which owns the label/description/error
 * relationship via aria-describedby and aria-invalid. Doing this once here is
 * what stops accessible labelling from being something each form remembers to
 * do — the public enquiry form and the whole admin panel share these.
 */

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const reactId = React.useId();
  const id = `field-${reactId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className="block text-[0.875rem] font-medium text-ink"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-accent-text">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-[0.75rem] font-normal text-ink-subtle">
            optional
          </span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-[0.8125rem] text-ink-subtle">
          {hint}
        </p>
      ) : null}

      <div className="mt-2">
        {children({ id, describedBy, invalid: Boolean(error) })}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[0.8125rem] font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlBase = [
  "w-full rounded-md border bg-surface px-3.5 text-[0.9375rem] text-ink",
  "placeholder:text-ink-subtle",
  "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-standard",
  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "h-12",
        invalid ? "border-danger" : "border-hairline-strong",
        className,
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "min-h-32 resize-y py-3 leading-relaxed",
        invalid ? "border-danger" : "border-hairline-strong",
        className,
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "h-12 appearance-none bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10",
        invalid ? "border-danger" : "border-hairline-strong",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2374747f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
});

/** Large tappable choice used by the multi-step enquiry form. */
export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
  type = "checkbox",
  name,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-start gap-3 rounded-md border p-3.5",
        "transition-[border-color,background-color] duration-[var(--duration-fast)] ease-standard",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
        selected
          ? "border-accent bg-accent-soft"
          : "border-hairline-strong bg-surface hover:border-ink-subtle",
      )}
    >
      <input
        type={type}
        name={name}
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent-strong)]"
      />
      <span className="min-w-0">
        <span className="block text-[0.9375rem] font-medium text-ink">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
