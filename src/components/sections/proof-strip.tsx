import Image from "next/image";
import { getLogoWallClients } from "@/lib/content";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Client proof.
 *
 * Logos appear only for clients an administrator has both published and
 * explicitly flagged as approved for logo use. Until then the strip states
 * what is actually true rather than filling the space with invented marks —
 * which is the single most common way agency sites lose credibility.
 *
 * WHY A FEW CLIENTS DO NOT SCROLL
 * A marquee with three logos in it reads as an attempt to make three look like
 * thirty: the same marks come round every few seconds and the repetition is
 * the first thing a visitor notices. Below the threshold the strip renders a
 * still, centred row, which is the more confident presentation of a short
 * list. Scrolling only earns its place once there are genuinely too many to
 * show at once.
 */

/** Above this many approved logos, the strip scrolls instead of sitting still. */
const MARQUEE_THRESHOLD = 6;
export async function ProofStrip() {
  const clients = await getLogoWallClients();

  if (!clients.length) {
    return (
      <section className="relative overflow-hidden border-y border-hairline bg-surface/80 backdrop-blur-md">
        <SectionBackdrop name="plate-esd-mat" from="var(--color-surface)" opacity={0.15} side="both" />
        <div className="container-page relative py-8">
          <p className="text-center text-[0.9375rem] font-medium text-ink">
            Empowering founders, scale-ups, and enterprises across the US, UK, India, and UAE with{" "}
            <span className="text-gradient-apple font-semibold">AI automation pipelines</span> and{" "}
            <span className="text-gradient-siri font-semibold">AI-ready software systems</span>.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.8125rem] font-medium text-blue-600 shadow-xs">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Autonomous Agent Orchestration
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[0.8125rem] font-medium text-purple-600 shadow-xs">
              <span className="size-1.5 rounded-full bg-purple-500" />
              Enterprise LLM &amp; RAG Systems
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[0.8125rem] font-medium text-emerald-600 shadow-xs">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Intelligent Workflow Automations
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[0.8125rem] font-medium text-amber-600 shadow-xs">
              <span className="size-1.5 rounded-full bg-amber-500" />
              AI-Ready Production SaaS
            </span>
          </div>
        </div>
      </section>
    );
  }

  const heading =
    clients.length === 1
      ? "A client we work with"
      : `Trusted by ${clients.length} ambitious businesses in India and worldwide`;

  // ---- Few enough to show at once: a still row ----
  if (clients.length < MARQUEE_THRESHOLD) {
    return (
      <section
        aria-label="Selected clients"
        className="relative overflow-hidden border-y border-hairline bg-surface/60"
      >
        <SectionBackdrop name="plate-esd-mat" from="var(--color-surface)" opacity={0.15} side="both" />
        <div className="container-page relative py-8">
          <p className="text-center text-sm text-ink-muted">{heading}</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {clients.map((client) => (
              <li key={client.id}>
                <ClientMark client={client} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Duplicated once so the marquee can loop seamlessly at -50%.
  const track = [...clients, ...clients];

  return (
    <section
      aria-label="Selected clients"
      className="relative overflow-hidden border-y border-hairline bg-surface/60"
    >
      <SectionBackdrop name="plate-esd-mat" from="var(--color-surface)" opacity={0.15} side="both" />
      <div className="container-page relative py-8">
        <p className="text-center text-sm text-ink-muted">{heading}</p>
      </div>

      <div
        className="marquee-root relative overflow-hidden pb-9"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <ul
          className="marquee-track flex w-max items-center gap-14"
          style={
            { "--marquee-duration": `${Math.max(28, clients.length * 6)}s` } as React.CSSProperties
          }
        >
          {track.map((client, index) => (
            <li
              key={`${client.id}-${index}`}
              aria-hidden={index >= clients.length}
            >
              <ClientMark client={client} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * One client, as a logo where there is one and as their name where there is
 * not. A name-only entry is a legitimate state: a client can permit being
 * named without supplying a mark.
 */
function ClientMark({
  client,
}: {
  client: { name: string; logo?: { url: string; alt?: string | null; width?: number | null; height?: number | null } | null };
}) {
  if (!client.logo) {
    return (
      <span className="text-[0.9375rem] font-medium text-ink-subtle">
        {client.name}
      </span>
    );
  }

  return (
    <Image
      src={client.logo.url}
      alt={client.logo.alt || client.name}
      width={client.logo.width ?? 160}
      height={client.logo.height ?? 48}
      className="h-7 w-auto opacity-55 grayscale transition-[opacity,filter] duration-[var(--duration-standard)] hover:opacity-100 hover:grayscale-0"
    />
  );
}
