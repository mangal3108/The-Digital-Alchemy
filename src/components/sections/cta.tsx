import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { getSiteSettings } from "@/lib/settings";
import { PRIMARY_CTA } from "@/config/site";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Mid-page call to action.
 *
 * Kept to one primary action and at most one secondary. Pages that stack five
 * competing CTAs convert worse than pages with one, and the footer already
 * carries the closing invitation.
 */
export async function CtaSection({
  title = "Have an idea worth building?",
  body = "Tell us what you are working on. We will come back with questions, a suggested next step, or an honest no.",
  ctaLabel = PRIMARY_CTA.label,
  ctaHref = PRIMARY_CTA.href,
  secondary,
}: {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondary?: { label: string; href: string };
}) {
  const settings = await getSiteSettings();

  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface">
      <SectionBackdrop name="hero-start-project" from="var(--color-surface)" opacity={0.14} side="both" />
      <div className="container-page relative section-y">
        <div
          {...revealProps()}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-display-3 text-ink">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lede text-ink-muted">
            {body}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={ctaHref} size="lg" withArrow>
              {ctaLabel}
            </Button>
            {secondary ? (
              <Button href={secondary.href} variant="secondary" size="lg">
                {secondary.label}
              </Button>
            ) : null}
          </div>

          {settings.email ? (
            <p className="mt-6 text-[0.875rem] text-ink-subtle">
              Or email us directly at{" "}
              <a
                href={`mailto:${settings.email}`}
                data-analytics="email_click"
                className="text-accent-text underline underline-offset-4"
              >
                {settings.email}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
