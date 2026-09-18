"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Badge } from "@/components/admin/ui";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveMetric, type MetricState } from "./actions";

const INITIAL: MetricState = {};

interface Metric {
  id: string;
  key: string;
  label: string;
  value: string;
  prefix: string;
  suffix: string;
  note: string;
  isPublished: boolean;
  order: number;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" loading={pending}>
      {pending ? "Saving" : "Save"}
    </Button>
  );
}

export function MetricRow({ metric }: { metric: Metric }) {
  const [state, action] = useActionState(saveMetric, INITIAL);
  const live = metric.isPublished && metric.value.trim() !== "";

  return (
    <li className="px-5 py-4">
      <form action={action}>
        <input type="hidden" name="id" value={metric.id} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[0.9375rem] font-medium text-ink">
              {metric.label}
            </span>
            <Badge tone={live ? "success" : "neutral"}>
              {live ? "Visible" : "Hidden"}
            </Badge>
          </div>
          <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={metric.isPublished}
              className="size-4 accent-[var(--color-accent-strong)]"
            />
            Show on site
          </label>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[6rem_1fr_6rem_minmax(0,1.4fr)]">
          <Field label="Prefix">
            {({ id }) => (
              <Input
                id={id}
                name="prefix"
                defaultValue={metric.prefix}
                placeholder="₹"
                className="h-10"
              />
            )}
          </Field>
          <Field label="Value">
            {({ id }) => (
              <Input
                id={id}
                name="value"
                defaultValue={metric.value}
                placeholder="Leave blank to hide"
                className="h-10"
              />
            )}
          </Field>
          <Field label="Suffix">
            {({ id }) => (
              <Input
                id={id}
                name="suffix"
                defaultValue={metric.suffix}
                placeholder="+"
                className="h-10"
              />
            )}
          </Field>
          <Field label="Note">
            {({ id }) => (
              <Input
                id={id}
                name="note"
                defaultValue={metric.note}
                placeholder="Optional qualifier, e.g. since 2021"
                className="h-10"
              />
            )}
          </Field>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <SaveButton />
          {state.message ? (
            <span className="text-[0.8125rem] font-medium text-success">
              {state.message}
            </span>
          ) : null}
          {state.error ? (
            <span role="alert" className="text-[0.8125rem] font-medium text-danger">
              {state.error}
            </span>
          ) : null}
        </div>
      </form>
    </li>
  );
}
