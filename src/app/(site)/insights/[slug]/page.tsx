import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
import { formatDate, slugify, stripHtml } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.metaTitle || `${post.title} | The Digital Alchemy`,
    description:
      post.metaDescription || post.excerpt || stripHtml(post.content).slice(0, 155),
    path: `/insights/${slug}`,
    image: post.hero?.url,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: post.author ? [post.author.name] : undefined,
  });
}

/** Build a table of contents from the markdown's level-two headings. */
function extractHeadings(markdown: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match?.[1]) {
      const text = match[1].replace(/[*_`]/g, "");
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const related = (await getPublishedPosts(4)).filter(
    (item) => item.slug !== slug,
  );

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
    { name: post.title, href: `/insights/${slug}` },
  ];

  return (
    <>
      <article>
        <header className="border-b border-hairline">
          <div className="container-page pb-10 pt-8">
            <Breadcrumb crumbs={crumbs} className="mb-8" />

            <div {...revealProps()} className="max-w-3xl">
              {post.category ? (
                <Link
                  href="/insights"
                  className="eyebrow transition-colors duration-[var(--duration-fast)] hover:text-accent-text"
                >
                  {post.category.name}
                </Link>
              ) : null}

              <h1 className="mt-4 text-display-2 text-ink">{post.title}</h1>

              {post.excerpt ? (
                <p className="mt-5 text-lede text-ink-muted">{post.excerpt}</p>
              ) : null}

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-ink-subtle">
                {post.author ? <span>{post.author.name}</span> : null}
                {post.publishedAt ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt.toISOString()}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </>
                ) : null}
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
                {post.updatedAt &&
                post.publishedAt &&
                post.updatedAt.getTime() - post.publishedAt.getTime() >
                  86_400_000 ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {post.hero ? (
            <div className="container-page pb-10">
              <div
                {...revealProps(60, 20)}
                className="relative aspect-[16/9] overflow-hidden rounded-lg border border-hairline bg-surface-2"
              >
                <Image
                  src={post.hero.url}
                  alt={post.hero.alt || post.title}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </header>

        <Section>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:gap-16">
            {/* Table of contents */}
            {headings.length > 2 ? (
              <nav
                aria-label="On this page"
                className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start"
              >
                <p className="eyebrow">On this page</p>
                <ul className="mt-4 space-y-2 border-l border-hairline pl-4">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="block text-[0.875rem] leading-snug text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* Body. react-markdown does not render raw HTML by default, so
                CMS content cannot inject markup into the page. */}
            <div className="prose prose-alchemy min-w-0 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 id={slugify(String(children))}>{children}</h2>
                  ),
                  a: ({ href, children }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                      <a
                        href={href}
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </Section>
      </article>

      {related.length ? (
        <Section className="border-t border-hairline bg-surface">
          <h2 className="text-display-3 text-ink">Related reading</h2>
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((item, index) => (
              <li key={item.id} {...revealProps(index * 60)}>
                <Link
                  href={`/insights/${item.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-hairline bg-canvas p-5 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                >
                  {item.category ? (
                    <span className="eyebrow">{item.category.name}</span>
                  ) : null}
                  <span className="mt-2.5 text-[1rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
                    {item.title}
                  </span>
                  <span className="mt-3 flex-1 text-[0.8125rem] text-ink-subtle">
                    {item.readingMinutes} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection
        title="Working on something this applies to?"
        body="Tell us the specifics. General advice only goes so far — the useful conversation is about your actual situation."
        secondary={{ label: "More insights", href: "/insights" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="article-schema"
        data={articleSchema({
          title: post.title,
          description: post.excerpt || stripHtml(post.content).slice(0, 155),
          path: `/insights/${slug}`,
          image: post.hero?.url,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.author?.name,
        })}
      />
    </>
  );
}
