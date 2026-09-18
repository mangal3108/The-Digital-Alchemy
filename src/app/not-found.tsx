import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { AlchemySigil } from "@/components/visuals/alchemy-sigil";
import { megaMenuColumns } from "@/content/navigation";

export const metadata = {
  title: "Page not found | The Digital Alchemy",
  robots: { index: false, follow: true },
};

/**
 * Branded 404.
 *
 * Root-level rather than inside the (site) group, so it also covers unmatched
 * top-level paths. It carries its own minimal chrome and, more usefully, a set
 * of real destinations — a 404 that only offers "go home" wastes the visit.
 */
export default function NotFound() {
  const suggestions = megaMenuColumns.flatMap((column) =>
    column.links.slice(0, 2),
  );

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
        style={{
          background:
            "radial-gradient(56% 44% at 68% 18%, color-mix(in srgb, var(--color-accent) 14%, transparent) 0%, transparent 72%)",
        }}
      />

      <header className="container-page relative flex h-[var(--header-height)] items-center">
        <Logo />
      </header>

      <main className="container-page relative flex flex-1 items-center py-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="eyebrow">404</p>
            <h1 className="mt-4 text-display-1 text-ink">
              Something got lost in the transformation.
            </h1>
            <p className="mt-5 max-w-lg text-lede text-ink-muted">
              The page you were after does not exist, or it moved during our
              site rebuild. Nothing dramatic — here is the way back.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/" size="lg" withArrow>
                Return home
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Explore services
              </Button>
            </div>

            <div className="mt-10 border-t border-hairline pt-6">
              <p className="eyebrow">Or try one of these</p>
              <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
                {suggestions.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.875rem] text-ink-muted underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-[0.875rem] text-ink-muted underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AlchemySigil className="size-64 text-ink sm:size-80" />
          </div>
        </div>
      </main>
    </div>
  );
}
