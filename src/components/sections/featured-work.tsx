import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { BrandImage } from "@/components/ui/brand-image";
import { revealProps } from "@/lib/reveal";
import { getFeaturedProjects } from "@/lib/content";
import { PRIMARY_CTA } from "@/config/site";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Featured case studies — one of the cinematic dark bands.
 *
 * When nothing is published this renders an honest placeholder rather than
 * fabricated work. The previous site's portfolio page was empty; inventing
 * case studies to fill it would be the single most damaging thing this rebuild
 * could do to the company's credibility.
 */
export async function FeaturedWork() {
  const projects = await getFeaturedProjects(3);

  return (
    <section data-surface="dark" className="relative overflow-hidden bg-canvas text-ink">
      <SectionBackdrop
        name="hero-work"
        from="var(--color-canvas)"
        opacity={0.18}
        side="right"
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div {...revealProps()} className="max-w-2xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              {projects.length
                ? "Projects, and what they were actually for."
                : "Our case studies are being rebuilt."}
            </h2>
            <p className="mt-4 text-lede text-ink-muted">
              {projects.length
                ? "Each one written up properly — the problem, the decisions we took, and what happened afterwards."
                : "We are only publishing work we have permission to show, with results we can stand behind. Until those write-ups are ready, we would rather show you nothing than show you someone else's portfolio."}
            </p>
          </div>

          {projects.length ? (
            <div {...revealProps(80)}>
              <Button href="/work" variant="secondary" withArrow>
                View all work
              </Button>
            </div>
          ) : null}
        </div>

        {projects.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          /*
            No published case studies yet, so this says so and offers the real
            alternative. Centred rather than a bordered card: it is the only
            thing in this section, and a lone card in a wide empty section reads
            as a gap where content failed to load.
          */
          <div {...revealProps(80)} className="mx-auto mt-10 max-w-2xl text-center">
            <h3 className="text-title text-ink">
              Want to see relevant examples?
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              We can walk you through work directly on a call, including
              projects still under NDA that we cannot publish. Tell us what you
              are planning and we will show you the closest thing we have built.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={PRIMARY_CTA.href} variant="accent" withArrow>
                {PRIMARY_CTA.label}
              </Button>
              <Button href="/services" variant="secondary">
                Explore services
              </Button>
            </div>
            <p className="mt-6 text-[0.875rem] leading-relaxed text-ink-subtle">
              Case studies will appear here as clients approve them.
            </p>
          </div>
        )}
      </div>

      {projects.length ? null : (
        /*
          A surface, not a product. Nothing in this section should imply a
          portfolio we cannot show, so the image carries atmosphere only.
        */
        <div className="relative h-[clamp(12rem,24vw,20rem)] w-full">
          <BrandImage
            name="plate-rack-dark"
            alt=""
            fill
            sizes="100vw"
            imgClassName="object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-canvas) 0%, transparent 38%, transparent 62%, var(--color-canvas) 100%)",
            }}
          />
        </div>
      )}
    </section>
  );
}
