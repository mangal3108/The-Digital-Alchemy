import * as React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base = [
  "group relative inline-flex items-center justify-center gap-2",
  "font-medium whitespace-nowrap select-none",
  "transition-[background-color,color,border-color,box-shadow,transform]",
  "duration-[var(--duration-fast)] ease-standard",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  "disabled:pointer-events-none disabled:opacity-45",
  "active:translate-y-px",
].join(" ");

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ink-inverse rounded-md shadow-sm hover:bg-ink-800 hover:shadow-md",
  accent:
    "bg-accent-strong text-on-accent rounded-md shadow-sm hover:bg-accent hover:shadow-accent",
  secondary:
    "bg-transparent text-ink rounded-md border border-hairline-strong hover:border-ink hover:bg-surface",
  ghost: "bg-transparent text-ink rounded-md hover:bg-surface-2",
  link: "bg-transparent text-accent-text rounded-xs px-0 underline-offset-4 hover:underline",
};

/** Every size except the inline link keeps a 40px+ touch target. */
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Chevron that slides on hover — used on calls to action. */
  withArrow?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonOrLinkProps = ButtonProps | AnchorProps;

function Content({
  children,
  withArrow,
  loading,
}: {
  children: React.ReactNode;
  withArrow?: boolean;
  loading?: boolean;
}) {
  return (
    <>
      {loading ? (
        <Loader2
          aria-hidden="true"
          className="size-4 animate-spin motion-reduce:animate-none"
        />
      ) : null}
      <span>{children}</span>
      {withArrow && !loading ? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-[var(--duration-fast)] ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      ) : null}
    </>
  );
}

export function Button(props: ButtonOrLinkProps) {
  const {
    variant = "primary",
    size = "md",
    withArrow,
    loading,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    variants[variant],
    variant === "link" ? "h-auto py-1" : sizes[size],
    className,
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as AnchorProps;
    const isExternal =
      /^https?:\/\//.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...anchorProps}
        >
          <Content withArrow={withArrow} loading={loading}>
            {children}
          </Content>
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        <Content withArrow={withArrow} loading={loading}>
          {children}
        </Content>
      </Link>
    );
  }

  const { disabled, type, ...buttonProps } = rest as ButtonProps;
  return (
    <button
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      <Content withArrow={withArrow} loading={loading}>
        {children}
      </Content>
    </button>
  );
}

/** Inline text call to action — label plus a directional arrow. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium",
        "text-accent-text underline-offset-4 hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-[var(--duration-fast)] ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </Link>
  );
}
