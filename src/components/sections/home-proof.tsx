import { Quote } from "lucide-react";

import { Section } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { ClientMark } from "@/components/sections/proof-strip";
import { revealProps } from "@/lib/reveal";
import {
  getFeaturedProjects,
  getLogoWallClients,
  getTestimonials,
} from "@/lib/content";

/**
 * Homepage proof: only what is real, and sized to how much of it there is.
 *
 * Three sources, all from the admin: clients approved for logo use, published
 * testimonials, and featured case studies. Each part renders only when it has
 * something in it, and the whole section disappears when all three are empty.
 * With one client and one quote, it is one quiet band, not a wall built to
 * look fuller than it is. The "case studies are being rebuilt" message stays
 * on /work, not here.
 */
export async function HomeProof() {
  const [clients, testimonials, projects] = await Promise.all([
    getLogoWallClients(),
    getTestimonials(3),
    getFeaturedProjects(3),
  ]);

  if (!clients.length && !testimonials.length && !projects.length) return null;

  return (
    <Section size="sm" className="border-y border-hairline bg-surface">
      <div {...revealProps()} className="max-w-2xl">
        <p className="eyebrow">Our clients</p>
        <h2 className="mt-3 text-title text-ink">
          {testimonials.length ? "In our clients' own words." : "Businesses we work with."}
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          We only name clients who have agreed to it, and only show feedback
          they wrote themselves.
        </p>
      </div>

      {testimonials.length || clients.length ? (
        <div className="mt-9 grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {testimonials.length ? (
            <ul className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <li key={testimonial.id} {...revealProps(index * 60)}>
                  <figure>
                    <Quote aria-hidden="true" className="size-5 text-accent" />
                    <blockquote className="mt-3 text-lede text-ink">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-3 text-[0.875rem] text-ink-subtle">
                      {[
                        testimonial.authorName,
                        testimonial.position,
                        testimonial.company ?? testimonial.client?.name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}

          {clients.length ? (
            <div {...revealProps(80)}>
              <p className="text-[0.875rem] text-ink-muted">
                {clients.length === 1 ? "A client we work with" : "Businesses we work with"}
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-5">
                {clients.map((client) => (
                  <li key={client.id}>
                    <ClientMark client={client} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {projects.length ? (
        <>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/work" variant="secondary" withArrow>
              See our work
            </Button>
          </div>
        </>
      ) : null}
    </Section>
  );
}
