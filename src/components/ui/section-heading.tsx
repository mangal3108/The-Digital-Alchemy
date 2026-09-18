import * as React from "react";
import { cn } from "@/lib/utils";
import { revealProps } from "@/lib/reveal";

/**
 * The standard band header. Every section uses it, which is what keeps the
 * vertical rhythm and heading hierarchy consistent across forty-odd pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        action && !centered
          ? "md:flex-row md:items-end md:justify-between"
          : null,
        className,
      )}
    >
      <div
        {...revealProps()}
        className={cn("max-w-2xl", centered && "mx-auto text-center")}
      >
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Tag
          className={cn(
            "text-balance text-ink",
            Tag === "h1" ? "text-display-1" : "text-display-3",
            eyebrow && "mt-3.5",
          )}
        >
          {title}
        </Tag>
        {lede ? (
          <p
            className={cn(
              "mt-4 text-lede text-ink-muted",
              centered && "mx-auto",
            )}
          >
            {lede}
          </p>
        ) : null}
      </div>

      {action ? (
        <div
          {...revealProps(80)}
          className={cn("shrink-0", centered && "mx-auto")}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}

/** Full-bleed band wrapper with consistent padding and optional dark surface. */
export function Section({
  children,
  id,
  dark,
  size = "default",
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  id?: string;
  dark?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      {...(dark ? { "data-surface": "dark" } : {})}
      className={cn(
        "relative",
        dark && "bg-canvas text-ink",
        size === "sm" && "section-y-sm",
        size === "default" && "section-y",
        size === "lg" && "section-y-lg",
        className,
      )}
    >
      <div className={cn("container-page", containerClassName)}>{children}</div>
    </section>
  );
}
