"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { megaMenuColumns, primaryNav } from "@/content/navigation";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/config/site";

/**
 * Full-screen mobile navigation.
 *
 * Behaves like a native sheet: it traps focus, locks background scroll,
 * restores focus to the trigger on close, and closes on Escape. Service groups
 * are collapsible so the whole menu is reachable without a long scroll.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>("development");

  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Lock scroll without the page shifting as the scrollbar disappears.
    const { body } = document;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Move focus into the sheet so the keyboard journey starts inside it.
    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-close-button]")
        ?.focus();
    }, 20);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-modal bg-canvas lg:hidden",
        "transition-[opacity,visibility] duration-[var(--duration-standard)] ease-standard",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div ref={panelRef} className="flex h-dvh flex-col">
        <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-hairline px-5">
          <Logo />
          <button
            type="button"
            data-close-button=""
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6"
        >
          <ul className="space-y-1">
            {primaryNav
              .filter((item) => item.label !== "Services")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-12 items-center rounded-md px-2 -mx-2 font-display text-xl font-medium tracking-[-0.02em] text-ink transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="mt-7 border-t border-hairline pt-6">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow">Services</p>
              <Link
                href="/services"
                onClick={onClose}
                className="text-[0.8125rem] font-medium text-accent-text underline underline-offset-4"
              >
                View all
              </Link>
            </div>

            <div className="mt-3 space-y-1">
              {megaMenuColumns.map((column) => {
                const isOpen = expanded === column.key;
                return (
                  <div
                    key={column.key}
                    className="overflow-hidden rounded-md border border-hairline"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : column.key)}
                      className="flex min-h-12 w-full items-center justify-between gap-3 px-3.5 text-left text-[0.9375rem] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                    >
                      {column.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-ink-subtle transition-transform duration-[var(--duration-fast)] ease-standard",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {isOpen ? (
                      <ul className="border-t border-hairline bg-surface px-1.5 py-1.5">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="flex min-h-11 items-center rounded-sm px-2 text-[0.875rem] text-ink-muted transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="shrink-0 space-y-2 border-t border-hairline bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            href={PRIMARY_CTA.href}
            onClick={onClose}
            withArrow
            className="w-full"
          >
            {PRIMARY_CTA.label}
          </Button>
          <Button
            href={SECONDARY_CTA.href}
            onClick={onClose}
            variant="secondary"
            className="w-full"
          >
            {SECONDARY_CTA.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
