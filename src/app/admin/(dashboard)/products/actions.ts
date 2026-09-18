"use server";

import { revalidatePath } from "next/cache";

import { db, PRODUCT_STATUSES } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export interface ProductState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function text(formData: FormData, key: string, max = 6000): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function revalidateProducts(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  revalidatePath("/sitemap.xml");
}

/**
 * Features are entered one per line as "Title | description". Parsing here
 * keeps the editing experience simple while the stored shape stays structured.
 */
function parseFeatures(input: string): { title: string; body?: string }[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      const body = rest.join("|").trim();
      return body
        ? { title: title!.trim().slice(0, 120), body: body.slice(0, 400) }
        : { title: title!.trim().slice(0, 120) };
    })
    .filter((feature) => feature.title.length > 0);
}

export async function saveProduct(
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const user = await requirePermission("products.manage");

  const id = text(formData, "id", 40);
  const name = text(formData, "name", 140);
  if (name.length < 2) return { ok: false, error: "Enter a product name." };

  const slug = slugify(text(formData, "slug", 120) || name);
  if (!slug) return { ok: false, error: "Could not derive a slug." };

  const status = text(formData, "status", 20);
  if (!PRODUCT_STATUSES.includes(status as never)) {
    return { ok: false, error: "Invalid status." };
  }

  const clash = await db.product.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `The slug "${slug}" is already in use.` };

  const websiteUrl = text(formData, "websiteUrl", 400);
  if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
    return { ok: false, error: "The website URL must start with https://" };
  }

  const isPublished = formData.get("isPublished") === "on";

  const data = {
    slug,
    name,
    tagline: text(formData, "tagline", 240),
    description: text(formData, "description", 6000),
    category: text(formData, "category", 80) || null,
    platform: text(formData, "platform", 120) || null,
    status,
    websiteUrl: websiteUrl || null,
    pricingUrl: text(formData, "pricingUrl", 400) || null,
    videoUrl: text(formData, "videoUrl", 400) || null,
    ctaLabel: text(formData, "ctaLabel", 60) || null,
    ctaHref: text(formData, "ctaHref", 400) || null,
    features: JSON.stringify(parseFeatures(text(formData, "features", 4000))),
    logoId: text(formData, "logoId", 40) || null,
    metaTitle: text(formData, "metaTitle", 200) || null,
    metaDescription: text(formData, "metaDescription", 400) || null,
    isPublished,
    order: Number(text(formData, "order", 6)) || 0,
    publishedAt: isPublished ? new Date() : null,
  };

  if (id) {
    const before = await db.product.findUnique({ where: { id } });
    if (!before) return { ok: false, error: "Product not found." };

    await db.product.update({
      where: { id },
      data: {
        ...data,
        publishedAt: isPublished ? (before.publishedAt ?? new Date()) : null,
      },
    });

    await recordAudit({
      userId: user.id,
      action:
        !before.isPublished && isPublished
          ? "product.published"
          : "product.updated",
      entity: "Product",
      entityId: id,
      summary: `${name} (${status})`,
    });

    revalidateProducts(slug);
    if (before.slug !== slug) revalidateProducts(before.slug);
    return { ok: true, message: "Product saved." };
  }

  const created = await db.product.create({ data });

  await recordAudit({
    userId: user.id,
    action: "product.created",
    entity: "Product",
    entityId: created.id,
    summary: `${name} (${status})`,
  });

  revalidateProducts(slug);
  return { ok: true, message: "Product added." };
}

export async function deleteProduct(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return;

  await db.product.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "product.deleted",
    entity: "Product",
    entityId: id,
    summary: `Deleted ${existing.name}`,
  });

  revalidateProducts(existing.slug);
}
