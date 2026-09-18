import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { revealProps } from "@/lib/reveal";

/**
 * Shared shell for the legal pages.
 *
 * The notice at the top is deliberate: these documents describe accurately
 * what this website does with data, but they are not legal advice and have not
 * been reviewed by a solicitor. Presenting a generated policy as though it had
 * been would be worse than saying so.
 */
export function LegalPage({
  title,
  updated,
  crumbs,
  children,
}: {
  title: string;
  updated: string;
  crumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="container-page pb-10 pt-8">
          <Breadcrumb crumbs={crumbs} className="mb-8" />
          <div {...revealProps()} className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-4 text-display-2 text-ink">{title}</h1>
            <p className="mt-4 text-[0.875rem] text-ink-subtle">
              Last updated {updated}
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-prose">
          <p className="mb-10 rounded-md border border-hairline bg-surface p-4 text-[0.8125rem] leading-relaxed text-ink-muted">
            <strong className="font-medium text-ink">
              A note before you read.
            </strong>{" "}
            This document describes how this website actually works and what it
            does with information. It is not legal advice, and it has not been
            reviewed by a qualified adviser. Before relying on it commercially,
            have it checked against your obligations in the jurisdictions you
            operate in.
          </p>

          <div className="prose prose-alchemy max-w-none">{children}</div>
        </div>
      </div>
    </>
  );
}
