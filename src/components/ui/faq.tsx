import { Plus } from "lucide-react";
import { Section, SectionHeading } from "./section-heading";
import { revealProps } from "@/lib/reveal";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ accordion built on native <details>.
 *
 * No JavaScript, keyboard accessible for free, and the answers are present in
 * the DOM whether or not a panel is open — which matters because we emit
 * FAQPage structured data for these, and marking up content that is not
 * actually on the page is a schema violation.
 */
export function FaqList({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((item, index) => (
        <details
          key={item.question}
          {...revealProps(Math.min(index, 6) * 40)}
          className="group"
          name="faq"
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-5 py-5",
              "text-[1.0625rem] font-medium text-ink",
              "transition-colors duration-[var(--duration-fast)] hover:text-accent-text",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="min-w-0">{item.question}</span>
            <Plus
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-ink-subtle transition-transform duration-[var(--duration-standard)] ease-standard group-open:rotate-45"
            />
          </summary>
          <div className="pb-6 pr-8">
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** FAQ as a full page band, with the standard heading treatment. */
export function FaqSection({
  items,
  title = "Common questions",
  eyebrow = "FAQ",
  lede,
}: {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
  lede?: string;
}) {
  if (!items.length) return null;

  return (
    <Section className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />
        <FaqList items={items} />
      </div>
    </Section>
  );
}
