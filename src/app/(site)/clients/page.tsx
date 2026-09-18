import type { Metadata } from "next";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getPublishedClients } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Clients | The Digital Alchemy",
    description:
      "The businesses we work with, the sectors they operate in, and what they say about working with us.",
    path: "/clients",
  });
}

export default async function ClientsPage() {
  const clients = await getPublishedClients();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Clients", href: "/clients" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Clients"
        title={
          clients.length
            ? "The businesses we work with."
            : "Our client list is published with permission."
        }
        lede={
          clients.length
            ? "Every business listed here has agreed to be named. Some of our work is under agreements that do not allow it, so this is not the full picture."
            : "We name clients and show logos only where the client has explicitly agreed. Until those permissions are in place this page stays empty rather than filled with marks we have no right to use."
        }
        crumbs={crumbs}
        primaryCta={
          clients.length
            ? undefined
            : { label: "Start a Project", href: "/start-a-project" }
        }
              bleedImage={getOptionalBrandImage("hero-clients")}
        bleedImageAlt=""
      />

      {clients.length ? (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="plate-bench-aluminium" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div className="relative">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client, index) => (
                <li
                  key={client.id}
                  {...revealProps(index * 50)}
                  className="flex flex-col rounded-lg border border-hairline bg-surface p-6"
                >
                  <div className="flex h-12 items-center">
                    {client.logo ? (
                      <Image
                        src={client.logo.url}
                        alt={client.logo.alt || client.name}
                        width={client.logo.width ?? 140}
                        height={client.logo.height ?? 40}
                        className="h-8 w-auto"
                      />
                    ) : (
                      <span className="text-title text-ink">{client.name}</span>
                    )}
                  </div>

                  <p className="mt-4 text-[0.8125rem] text-ink-subtle">
                    {[client.industry, client.country].filter(Boolean).join(" · ")}
                  </p>

                  {client.projects.length ? (
                    <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
                      {client.projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/work/${project.slug}`}
                            className="text-[0.875rem] text-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="plate-bench-aluminium" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div
            {...revealProps()}
            className="relative mx-auto max-w-3xl rounded-lg border border-hairline bg-surface p-7 sm:p-10"
          >
            <SectionHeading
              title="Why this page is empty"
              lede="It is a deliberate choice, not an oversight."
            />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              Logo walls are the easiest thing on an agency site to fake, and
              the hardest thing for a prospective client to verify. We would
              rather have an empty page than borrow credibility we have not been
              given permission to use.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              If you would like references, we can arrange for you to speak to
              clients directly — which is more useful than a logo anyway.
            </p>
            <div className="mt-7">
              <Button href="/start-a-project" withArrow>
                Ask for references
              </Button>
            </div>
            <p className="mt-7 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
              Note for the site administrator: clients added under
              Admin → Clients appear here once published. Logos additionally
              require the &ldquo;approved for logo use&rdquo; flag.
            </p>
          </div>
        </Section>
      )}

      <Testimonials limit={6} />

      <CtaSection
        title="Could we be working with you?"
        body="Tell us what you are trying to build or grow, and we will tell you honestly whether we are the right team."
        secondary={{ label: "See our work", href: "/work" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
