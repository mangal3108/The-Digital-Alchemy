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
          <div className="container-page py-8">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-9 grid grid-cols-4 gap-x-6 gap-y-8">
                {megaMenuColumns.map((column) => (
                  <div key={column.key}>
                    <p className="eyebrow">{column.label}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-subtle">
                      {column.blurb}
                    </p>
                    <ul className="mt-3.5 space-y-0.5">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block rounded-sm px-2 py-1.5 -mx-2 text-[0.875rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="col-span-3">
                <FeaturedPanel featured={featured} />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-hairline pt-5">
              <p className="text-sm text-ink-muted">
                Not sure which you need? Start with a conversation.
              </p>
              <div className="flex items-center gap-5">
                <TextLink href="/services">All services</TextLink>
                <TextLink href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</TextLink>
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
        Strategy, design, engineering and growth in one team.
      </p>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
        Most projects fail in the handovers between those four. We removed the
        handovers.
      </p>
      <div className="mt-4">
        <TextLink href="/about">How we work</TextLink>
      </div>
    </div>
  );
}
