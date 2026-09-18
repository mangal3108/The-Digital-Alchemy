import Link from "next/link";
import Image from "next/image";

import { Section, SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { getPublishedPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/** Latest writing. Hidden until at least one article is published. */
export async function InsightsPreview() {
  const posts = await getPublishedPosts(3);
  if (!posts.length) return null;

  return (
    <Section className="relative overflow-hidden">
      <SectionBackdrop name="hero-insights" from="var(--color-canvas)" opacity={0.16} side="right" />
      <div className="relative">
        <SectionHeading
          eyebrow="Insights"
          title="Notes on building and growing digital products."
          action={
            <Button href="/insights" variant="secondary" withArrow>
              All insights
            </Button>
          }
        />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/insights/${post.slug}`}
            {...revealProps(index * 70)}
            className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-[box-shadow,border-color,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
          >
            {post.hero ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                <Image
                  src={post.hero.url}
                  alt={post.hero.alt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
            ) : null}

            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {post.category ? (
                  <span className="eyebrow">{post.category.name}</span>
                ) : null}
                <span aria-hidden="true" className="text-hairline-strong">
                  ·
                </span>
                <span className="eyebrow">
                  {post.readingMinutes} min read
                </span>
              </div>

              <h3 className="mt-3 text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {post.title}
              </h3>

              {post.excerpt ? (
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {post.excerpt}
                </p>
              ) : null}

              {post.publishedAt ? (
                <time
                  dateTime={post.publishedAt.toISOString()}
                  className="mt-5 text-[0.8125rem] text-ink-subtle"
                >
                  {formatDate(post.publishedAt)}
                </time>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
      </div>
    </Section>
  );
}
