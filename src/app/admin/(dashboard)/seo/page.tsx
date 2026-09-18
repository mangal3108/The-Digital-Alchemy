import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { serviceSlugs, getService } from "@/content/services";
import { industries } from "@/content/industries";
import { markets } from "@/content/locations";
import { SeoForm } from "./seo-form";
import { deleteSeoOverride } from "./actions";

export const metadata = { title: "SEO" };
export const dynamic = "force-dynamic";

/**
 * Per-page SEO overrides.
 *
 * Pages already ship sensible titles and descriptions written alongside their
 * content. This exists for the cases where marketing wants to change one
 * without a deploy, or to remove a page from the index — the override wins
 * over whatever the page defines, and noindexed paths are also dropped from
 * the sitemap.
 */
export default async function SeoPage() {
  await requirePermission("seo.manage");

  const overrides = await db.seoOverride.findMany({
    orderBy: { path: "asc" },
  });

  const [projects, posts, products] = await Promise.all([
    db.project.findMany({ select: { slug: true, title: true } }),
    db.post.findMany({ select: { slug: true, title: true } }),
    db.product.findMany({ select: { slug: true, name: true } }),
  ]);

  const paths = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/work", label: "Work" },
    { path: "/products", label: "Products" },
    { path: "/industries", label: "Industries" },
    { path: "/locations", label: "Locations" },
    { path: "/about", label: "About" },
    { path: "/insights", label: "Insights" },
    { path: "/clients", label: "Clients" },
    { path: "/contact", label: "Contact" },
    { path: "/start-a-project", label: "Start a Project" },
    { path: "/careers", label: "Careers" },
    ...serviceSlugs.map((slug) => ({
      path: `/services/${slug}`,
      label: `Service — ${getService(slug)?.name ?? slug}`,
    })),
    ...industries.map((industry) => ({
      path: `/industries/${industry.slug}`,
      label: `Industry — ${industry.name}`,
    })),
    ...markets.map((market) => ({
      path: `/locations/${market.slug}`,
      label: `Market — ${market.country}`,
    })),
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      label: `Case study — ${project.title}`,
    })),
    ...products.map((product) => ({
      path: `/products/${product.slug}`,
      label: `Product — ${product.name}`,
    })),
    ...posts.map((post) => ({
      path: `/insights/${post.slug}`,
      label: `Article — ${post.title}`,
    })),
  ];

  return (
    <>
      <PageHeader
        title="SEO"
        description="Override the title, description or indexing of any page. Without an override, each page uses the metadata written with its content."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:items-start">
        <Card
          title="Overrides in place"
          description={`${overrides.length} page${overrides.length === 1 ? "" : "s"} customised.`}
        >
          {overrides.length ? (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Path</Th>
                  <Th>Title</Th>
                  <Th>Indexing</Th>
                  <Th>Updated</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {overrides.map((override) => (
                  <tr key={override.id}>
                    <Td>
                      <code className="font-mono text-[0.8125rem] text-ink">
                        {override.path}
                      </code>
                    </Td>
                    <Td>
                      <span className="line-clamp-1 text-[0.8125rem]">
                        {override.title || "—"}
                      </span>
                    </Td>
                    <Td>
                      <Badge tone={override.noindex ? "danger" : "success"}>
                        {override.noindex ? "noindex" : "Indexed"}
                      </Badge>
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-[0.8125rem]">
                        {formatDate(override.updatedAt)}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <form action={deleteSeoOverride}>
                        <input type="hidden" name="id" value={override.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                          Reset
                        </button>
                      </form>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState
              title="No overrides"
              description="Every page is using the metadata written alongside its content, which is usually what you want."
            />
          )}
        </Card>

        <SeoForm paths={paths} existing={overrides.map((o) => ({
          path: o.path,
          title: o.title ?? "",
          description: o.description ?? "",
          canonical: o.canonical ?? "",
          ogTitle: o.ogTitle ?? "",
          ogDescription: o.ogDescription ?? "",
          noindex: o.noindex,
        }))} />
      </div>
    </>
  );
}
