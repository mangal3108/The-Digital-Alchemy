import Image from "next/image";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { parseJson } from "@/lib/utils";
import { ProductEditor, NewProduct } from "./product-editor";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

interface Feature {
  title: string;
  body?: string;
}

export default async function ProductsAdminPage() {
  const user = await requirePermission("products.manage");

  const [products, media] = await Promise.all([
    db.product.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { logo: true },
    }),
    db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, filename: true },
    }),
  ]);

  const canDelete = can(user.role, "content.delete");

  return (
    <>
      <PageHeader
        title="Products"
        description="Software the studio builds and runs itself. The public products page is hidden until at least one is published."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          {products.length ? (
            products.map((product) => (
              <Card key={product.id}>
                <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
                  {product.logo ? (
                    <Image
                      src={product.logo.url}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded object-contain"
                    />
                  ) : null}
                  <span className="text-[0.9375rem] font-medium text-ink">
                    {product.name}
                  </span>
                  <Badge
                    tone={
                      product.status === "LIVE"
                        ? "success"
                        : product.status === "BETA"
                          ? "accent"
                          : "neutral"
                    }
                  >
                    {product.status}
                  </Badge>
                  <Badge tone={product.isPublished ? "success" : "neutral"}>
                    {product.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <ProductEditor
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    tagline: product.tagline,
                    description: product.description,
                    category: product.category ?? "",
                    platform: product.platform ?? "",
                    status: product.status,
                    websiteUrl: product.websiteUrl ?? "",
                    pricingUrl: product.pricingUrl ?? "",
                    videoUrl: product.videoUrl ?? "",
                    ctaLabel: product.ctaLabel ?? "",
                    ctaHref: product.ctaHref ?? "",
                    features: parseJson<Feature[]>(product.features, [])
                      .map((f) => (f.body ? `${f.title} | ${f.body}` : f.title))
                      .join("\n"),
                    logoId: product.logoId ?? "",
                    metaTitle: product.metaTitle ?? "",
                    metaDescription: product.metaDescription ?? "",
                    isPublished: product.isPublished,
                    order: product.order,
                  }}
                  mediaOptions={media}
                  canDelete={canDelete}
                />
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                title="No products"
                description="Add one when you have something real to show. The public page currently explains that products are in development, which is accurate."
              />
            </Card>
          )}
        </div>

        <NewProduct mediaOptions={media} />
      </div>
    </>
  );
}
