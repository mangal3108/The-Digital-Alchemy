import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { getPublishedProducts } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  LIVE: "Live",
  BETA: "Beta",
  COMING_SOON: "Coming soon",
};

export function ProductStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.75rem] font-medium",
        status === "LIVE" && "border-secondary/40 text-secondary",
        status === "BETA" && "border-accent/40 text-accent-text",
        status === "COMING_SOON" && "border-hairline-strong text-ink-subtle",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          status === "LIVE" && "bg-secondary",
          status === "BETA" && "bg-accent",
          status === "COMING_SOON" && "bg-ink-subtle",
        )}
      />
      {PRODUCT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

/**
 * Our own products. Hidden entirely until an administrator publishes one —
 * an empty "Products" band would raise a question the site cannot answer.
 */
export async function ProductsPreview() {
  const products = await getPublishedProducts();
  if (!products.length) return null;

  return (
    <Section id="products" className="relative overflow-hidden bg-surface">
      <SectionBackdrop name="hero-products" from="var(--color-surface)" opacity={0.16} side="right" />
      <div className="relative">
        <SectionHeading
          eyebrow="Our products"
          title="Things we build for ourselves."
          lede="Working on our own products keeps us honest about what it takes to ship, price and support software — rather than only advising on it."
          action={
            products.length > 2 ? (
              <Button href="/products" variant="secondary" withArrow>
                All products
              </Button>
            ) : undefined
          }
        />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 6).map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            {...revealProps(index * 70)}
            className="group flex flex-col rounded-lg border border-hairline bg-canvas p-6 transition-[box-shadow,border-color,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              {product.logo ? (
                <Image
                  src={product.logo.url}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-md object-contain"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-md bg-accent-soft font-semibold text-accent-text"
                >
                  {product.name.charAt(0)}
                </span>
              )}
              <ArrowUpRight
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
              />
            </div>

            <h3 className="mt-5 text-title text-ink">{product.name}</h3>
            {product.tagline ? (
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                {product.tagline}
              </p>
            ) : null}

            <div className="mt-5">
              <ProductStatusBadge status={product.status} />
            </div>
          </Link>
        ))}
      </div>
      </div>
    </Section>
  );
}
