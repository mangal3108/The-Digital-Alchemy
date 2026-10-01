import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Globe,
  Palette,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import {
  SERVICE_GROUPS,
  SERVICE_GROUP_ORDER,
  getServicesByGroup,
  type ServiceGroup,
} from "@/content/services";
import type { Accent } from "@/content/accents";

/**
 * "What we do" on the homepage: the six service groups, not twenty services.
 *
 * Visitors arrive knowing what they want ("more customers", "a website"), not
 * which of our services delivers it. Each card is one group in their words,
 * with one plain line, linking to that group on /services. The twenty
 * individual services are one click further, and all of them are in the menu.
 */

const GROUP_STYLE: Record<ServiceGroup, { icon: LucideIcon; accent: Accent }> = {
  website: { icon: Globe, accent: "blue" },
  software: { icon: Smartphone, accent: "violet" },
  customers: { icon: Users, accent: "mint" },
  automation: { icon: Bot, accent: "gold" },
  design: { icon: Palette, accent: "pink" },
  running: { icon: ShieldCheck, accent: "indigo" },
};

export function ServicesShowcase() {
  return (
    <section id="services" className="relative">
      <div className="container-page section-y">
        <SectionHeading
          eyebrow="What we do"
          title="Websites, apps, AI tools and more customers."
          lede="Everything a growing business needs online, from one team."
          action={
            <Button href="/services" variant="secondary" withArrow>
              See all services
            </Button>
          }
        />

        <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_GROUP_ORDER.map((group, index) => {
            const { icon: Icon, accent } = GROUP_STYLE[group];
            const meta = SERVICE_GROUPS[group];
            const count = getServicesByGroup(group).length;
            return (
              <li key={group} data-accent={accent} {...revealProps(index * 50)}>
                <Link
                  href={`/services#${group}`}
                  className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-text"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-title text-ink">{meta.label}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {meta.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text">
                    {count === 1 ? "See the service" : `See ${count} services`}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
