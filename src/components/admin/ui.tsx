import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Shared admin building blocks — clean, dense, and free of site decoration. */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[1.375rem] font-semibold tracking-[-0.025em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {/*
        `action` is for a control — a button or a small group of them. It is
        `shrink-0` so a button never gets squeezed, which means anything large
        put here cannot shrink either: it overflows the page and crushes the
        title column beside it. Panels and forms belong in the page body.
      */}
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-hairline bg-surface",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[0.9375rem] font-semibold text-ink">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          {/*
        `action` is for a control — a button or a small group of them. It is
        `shrink-0` so a button never gets squeezed, which means anything large
        put here cannot shrink either: it overflows the page and crushes the
        title column beside it. Panels and forms belong in the page body.
      */}
      {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-[0.8125rem] font-medium text-ink-muted">{label}</p>
      <p className="numeric mt-1.5 text-[1.75rem] font-semibold leading-none text-ink">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-[0.75rem] text-ink-subtle">{hint}</p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-lg border border-hairline bg-surface p-4 transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-hairline-strong hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      {body}
    </div>
  );
}

const BADGE_TONES = {
  neutral: "bg-surface-2 text-ink-muted",
  accent: "bg-accent-soft text-accent-text",
  success: "bg-verdigris-50 text-verdigris-700",
  warning: "bg-copper-50 text-warning",
  danger: "bg-danger/10 text-danger",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof BADGE_TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.75rem] font-medium",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="text-[0.9375rem] font-medium text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-[0.875rem] leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/** Horizontally scrollable table wrapper — tables never overflow the page. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-[0.875rem]">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-hairline px-4 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-subtle",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-hairline px-4 py-3 align-middle text-ink-muted",
        className,
      )}
    >
      {children}
    </td>
  );
}

/** Inline success/error banner used after a server action completes. */
export function Notice({
  tone = "success",
  children,
}: {
  tone?: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      role="status"
      className={cn(
        "mb-5 rounded-md border px-3.5 py-2.5 text-[0.8125rem] font-medium",
        tone === "success"
          ? "border-secondary/30 bg-secondary-soft text-success"
          : "border-danger/30 bg-danger/5 text-danger",
      )}
    >
      {children}
    </p>
  );
}
