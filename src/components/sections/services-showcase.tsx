import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { BrandImage } from "@/components/ui/brand-image";
import { getServiceImage } from "@/content/service-imagery";
import { withOverridesAll } from "@/lib/content-overrides";
import { getFeaturedServices, serviceHref, type Service } from "@/content/services";
import { getServiceAccent } from "@/content/accents";
import { FeatureBand } from "@/components/sections/feature-band";

/**
 * The six primary capabilities, as feature bands rather than a card grid.
 *
 * The grid this replaces put six equal boxes in a row, which is the shape that
 * made the page read as a template: same size, same rhythm, nothing leading.
 * Apple's homepage is the reference — two full-bleed bands carrying the
 * headline acts, then a quieter grid underneath for the rest. Hierarchy comes
 * from size and bleed, not from borders.
 *
 * Each band declares its own `data-accent`, so the eyebrow, the link and the
 * rule beneath it all take that service's colour without a bespoke style. The
 * second band runs dark, which is what keeps a long white page from flattening
 * out.
 */
export async function ServicesShowcase() {
  const services = await withOverridesAll(
    "service",
    getFeaturedServices(),
    (service) => service.slug,
  );
  const [lead, second, ...rest] = services;

  return (
    <section id="services" className="relative">
      <div className="container-page pb-14 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Capabilities & AI Architecture"
          title="AI Automation, AI-Ready Products & Digital Software Engineering."
          lede="From autonomous agent workflows and AI-ready SaaS platforms to precision UI/UX design and cloud engineering — unified under one senior team without vendor handoff friction."
          action={
            <Button href="/services" variant="secondary" withArrow>
              Explore all capabilities
            </Button>
          }
        />
      </div>

      {lead ? <ServiceBand service={lead} priority /> : null}
      {second ? <ServiceBand service={second} dark /> : null}

      {rest.length ? (
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((service, index) => (
              <ServiceTile key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/**
 * Maps a service onto the shared band. Kept as an adapter rather than widening
 * `FeatureBand` itself, so the band stays content-agnostic and other sections
 * can use it without knowing what a Service is.
 */
function ServiceBand({
  service,
  dark,
  priority,
}: {
  service: Service;
  dark?: boolean;
  priority?: boolean;
}) {
  return (
    <div data-accent={getServiceAccent(service.slug)}>
      <FeatureBand
        eyebrow={service.eyebrow}
        title={service.name}
        body={service.summary}
        image={getServiceImage(service.slug)}
        href={serviceHref(service.slug)}
        linkLabel={service.ctaLabel}
        dark={dark}
        priority={priority}
      />
    </div>
  );
}

/** The quieter four. Still image-led, but half the height and half the weight. */
function ServiceTile({ service, index }: { service: Service; index: number }) {
  const image = getServiceImage(service.slug);

  return (
    <Link
      href={serviceHref(service.slug)}
      data-accent={getServiceAccent(service.slug)}
      {...revealProps(index * 60)}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-[box-shadow,border-color,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
    >
      {image ? (
        <div className="relative h-52 shrink-0 overflow-hidden">
          <BrandImage
            name={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            imgClassName="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
            style={{
              background:
                "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
            }}
          />
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-title text-ink">{service.name}</h3>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          />
        </div>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
          {service.summary}
        </p>
        <span
          aria-hidden="true"
          className="mt-4 block h-0.5 w-10 rounded-full bg-accent transition-[width] duration-[var(--duration-slow)] ease-standard group-hover:w-16"
        />
      </div>
    </Link>
  );
}
