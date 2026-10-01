"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button, TextLink } from "@/components/ui/button";
import { megaMenuColumns, primaryNav } from "@/content/navigation";
import { PRIMARY_CTA } from "@/config/site";
import { MobileMenu } from "./mobile-menu";

export interface FeaturedNavItem {
  title: string;
  client: string | null;
  href: string;
  imageUrl: string | null;
  imageAlt: string;
  category: string;
}

/**
 * How the six groups share three columns. "Get more customers" has eight
 * services, so it gets a column to itself; the smaller groups stack.
 */
const MENU_STACKS: string[][] = [
  ["website", "software"],
  ["customers"],
  ["automation", "design", "running"],
];

export function Navbar({ featured }: { featured: FeaturedNavItem | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = React.useRef<HTMLElement>(null);

  // Compact the header once the hero has started to scroll away.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes both menus.
  React.useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Announce an open menu on <html> so fixed-position widgets can step aside.
  // The chat launcher is pinned bottom-right, and on a short laptop window the
  // mega menu reaches down to the same spot: "Start a Project" sat underneath
  // the launcher, so clicking it opened the chat instead. The launcher reads
  // this attribute in CSS, which keeps the two components independent.
  React.useEffect(() => {
    const root = document.documentElement;
    if (openMenu || mobileOpen) root.setAttribute("data-nav-open", "");
    else root.removeAttribute("data-nav-open");
    return () => root.removeAttribute("data-nav-open");
  }, [openMenu, mobileOpen]);

  // Escape closes the mega menu and returns focus to the trigger.
  React.useEffect(() => {
    if (!openMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        headerRef.current
          ?.querySelector<HTMLButtonElement>("[data-menu-trigger]")
          ?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // A short delay stops the panel flickering shut as the pointer crosses the
  // gap between the trigger and the panel.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-header",
          "transition-[background-color,border-color,box-shadow,backdrop-filter]",
          "duration-[var(--duration-standard)] ease-standard",
          scrolled || openMenu
            ? "border-b border-white/10 bg-[rgba(15,15,18,0.85)] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl supports-[not(backdrop-filter:blur(0))]:bg-[#0f0f12]"
            : "border-b border-transparent bg-white/60 backdrop-blur-sm",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container-page">
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              "transition-[height] duration-[var(--duration-standard)] ease-standard",
              scrolled ? "h-16" : "h-[var(--header-height)]",
            )}
          >
            <Logo className={scrolled ? "text-white" : undefined} />

            {/* ---------------- Desktop navigation ---------------- */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-0.5 xl:gap-1 lg:flex"
            >
              {primaryNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                if (item.label === "Services") {
                  const open = openMenu === "services";
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => {
                        cancelClose();
                        setOpenMenu("services");
                      }}
                    >
                      <button
                        type="button"
                        data-menu-trigger=""
                        aria-expanded={open}
                        aria-controls="services-mega-menu"
                        onClick={() => setOpenMenu(open ? null : "services")}
                        className={cn(
                          "inline-flex h-10 items-center gap-1 rounded-md px-2.5 xl:px-3 text-[0.875rem] xl:text-[0.9375rem] font-medium",
                          "transition-colors duration-[var(--duration-fast)]",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                          active || open
                            ? scrolled ? "text-white" : "text-ink"
                            : scrolled ? "text-white/70 hover:text-white" : "text-ink-muted hover:text-ink",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "size-4 transition-transform duration-[var(--duration-fast)] ease-standard",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={scheduleClose}
                    className={cn(
                      "inline-flex h-10 items-center rounded-md px-2.5 xl:px-3 text-[0.875rem] xl:text-[0.9375rem] font-medium",
                      "transition-colors duration-[var(--duration-fast)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                      active
                        ? scrolled ? "text-white" : "text-ink"
                        : scrolled ? "text-white/70 hover:text-white" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                href={PRIMARY_CTA.href}
                size="sm"
                withArrow
                className="hidden sm:inline-flex"
              >
                {PRIMARY_CTA.label}
              </Button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-md transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden",
                  scrolled ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface-2"
                )}
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Mega menu panel ---------------- */}
        {/*
          Visibility is driven by `visibility`, not the `hidden` attribute: a
          `hidden` attribute loses to the `lg:block` utility on specificity, so
          the panel would stay in the accessibility tree while looking closed.
          `invisible` removes it from the tree *and* allows a transition.
        */}
        <div
          id="services-mega-menu"
          aria-hidden={openMenu !== "services"}
          onMouseEnter={cancelClose}
          className={cn(
            "absolute inset-x-0 top-full hidden border-b border-hairline bg-canvas shadow-lg lg:block",
            "transition-[opacity,transform,visibility] duration-[var(--duration-fast)] ease-standard",
            openMenu === "services"
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-1 opacity-0",
          )}
        >
          {/*
            Capped to the space under the header: with a one-line description
            under every service the panel is tall, and on a short laptop window
            it would otherwise run off the bottom of the screen.
          */}
          <div className="container-page max-h-[calc(100dvh-var(--header-height))] overflow-y-auto py-6">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-9 grid grid-cols-3 gap-x-8">
                {MENU_STACKS.map((keys) => (
                  <div key={keys.join("-")} className="space-y-6">
                    {keys.map((key) => {
                      const column = megaMenuColumns.find((c) => c.key === key);
                      if (!column) return null;
                      return (
                        <div key={column.key}>
                          <p className="eyebrow">{column.label}</p>
                          <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-subtle">
                            {column.blurb}
                          </p>
                          <ul className="mt-3 space-y-0.5">
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="block rounded-sm px-2 py-1 -mx-2 transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                  <span className="block text-[0.875rem] font-medium text-ink">
                                    {link.label}
                                  </span>
                                  {link.description ? (
                                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/*
                The actions live here, top right, rather than in a row under
                the groups: with a description under every service the groups
                are tall, and a bottom row fell below the fold on an 800px-high
                laptop screen. Up here they are visible at any height.
              */}
              <div className="col-span-3 space-y-4">
                <div className="rounded-lg border border-hairline bg-surface p-5">
                  <p className="eyebrow">Not sure what you need?</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">
                    Answer a few quick questions and we will point you to the
                    right service.
                  </p>
                  <div className="mt-4">
                    <TextLink href="/services#help-me-choose">Help me choose</TextLink>
                  </div>
                </div>
                <FeaturedPanel featured={featured} />
                <div className="flex items-center gap-5 px-1">
                  <TextLink href="/services">All services</TextLink>
                  <TextLink href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</TextLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function FeaturedPanel({ featured }: { featured: FeaturedNavItem | null }) {
  if (featured) {
    return (
      <Link
        href={featured.href}
        className="group block overflow-hidden rounded-lg border border-hairline bg-surface transition-shadow duration-[var(--duration-standard)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          {featured.imageUrl ? (
            <Image
              src={featured.imageUrl}
              alt={featured.imageAlt}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}
        </div>
        <div className="p-4">
          <p className="eyebrow">{featured.category}</p>
          <p className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">
            {featured.title}
          </p>
          {featured.client ? (
            <p className="mt-0.5 text-[0.8125rem] text-ink-subtle">
              {featured.client}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  // No published case study yet. Rather than showing a placeholder that
  // pretends to be work, the panel points at how the studio operates.
  return (
    <div className="rounded-lg border border-hairline bg-surface p-5">
      <p className="eyebrow">How we work</p>
      <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-ink">
        One team, start to finish.
      </p>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
        One team plans, designs, builds and markets your project, so nothing
        gets lost between teams.
      </p>
      <div className="mt-4">
        <TextLink href="/about">How we work</TextLink>
      </div>
    </div>
  );
}
