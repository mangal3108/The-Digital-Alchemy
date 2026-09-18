"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PRODUCT_STATUSES } from "@/lib/db";
import { cn } from "@/lib/utils";
import { saveProduct, deleteProduct, type ProductState } from "./actions";

const INITIAL: ProductState = {};

interface ProductData {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  platform: string;
  status: string;
  websiteUrl: string;
  pricingUrl: string;
  videoUrl: string;
  ctaLabel: string;
  ctaHref: string;
  features: string;
  logoId: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  order: number;
}

type MediaOption = { id: string; url: string; filename: string };

const STATUS_LABELS: Record<string, string> = {
  LIVE: "Live",
  BETA: "Beta",
  COMING_SOON: "Coming soon",
};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : label}
    </Button>
  );
}

function Fields({
  product,
  mediaOptions,
}: {
  product: ProductData;
  mediaOptions: MediaOption[];
}) {
  const [logoId, setLogoId] = React.useState(product.logoId);

  return (
    <>
      <input type="hidden" name="logoId" value={logoId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" required>
          {({ id }) => (
            <Input id={id} name="name" defaultValue={product.name} required className="h-10" />
          )}
        </Field>
        <Field label="Slug" hint="/products/<slug>">
          {({ id }) => (
            <Input id={id} name="slug" defaultValue={product.slug} className="h-10" />
          )}
        </Field>
        <Field label="Tagline" className="sm:col-span-2">
          {({ id }) => (
            <Input id={id} name="tagline" defaultValue={product.tagline} className="h-10" />
          )}
        </Field>
        <Field label="Description" className="sm:col-span-2">
          {({ id }) => (
            <Textarea
              id={id}
              name="description"
              rows={4}
              defaultValue={product.description}
              className="min-h-24"
            />
          )}
        </Field>
        <Field
          label="Features"
          className="sm:col-span-2"
          hint="One per line. Use “Title | description” for a subtitle."
        >
          {({ id }) => (
            <Textarea
              id={id}
              name="features"
              rows={5}
              defaultValue={product.features}
              placeholder={"Real-time sync | Changes appear on every device instantly\nRole-based access"}
              className="min-h-28 font-mono text-[0.8125rem]"
            />
          )}
        </Field>
        <Field label="Category">
          {({ id }) => (
            <Input id={id} name="category" defaultValue={product.category} className="h-10" />
          )}
        </Field>
        <Field label="Platform" hint="e.g. Web, iOS, Android">
          {({ id }) => (
            <Input id={id} name="platform" defaultValue={product.platform} className="h-10" />
          )}
        </Field>
        <Field label="Website URL">
          {({ id }) => (
            <Input
              id={id}
              name="websiteUrl"
              type="url"
              defaultValue={product.websiteUrl}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Pricing URL">
          {({ id }) => (
            <Input
              id={id}
              name="pricingUrl"
              type="url"
              defaultValue={product.pricingUrl}
              className="h-10"
            />
          )}
        </Field>
        <Field label="CTA label">
          {({ id }) => (
            <Input id={id} name="ctaLabel" defaultValue={product.ctaLabel} className="h-10" />
          )}
        </Field>
        <Field label="CTA link">
          {({ id }) => (
            <Input id={id} name="ctaHref" defaultValue={product.ctaHref} className="h-10" />
          )}
        </Field>
        <Field label="Status" required>
          {({ id }) => (
            <Select id={id} name="status" defaultValue={product.status} className="h-10">
              {PRODUCT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Display order">
          {({ id }) => (
            <Input
              id={id}
              name="order"
              type="number"
              min={0}
              defaultValue={product.order}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Meta title" className="sm:col-span-2">
          {({ id }) => (
            <Input id={id} name="metaTitle" defaultValue={product.metaTitle} className="h-10" />
          )}
        </Field>
        <Field label="Meta description" className="sm:col-span-2">
          {({ id }) => (
            <Textarea
              id={id}
              name="metaDescription"
              rows={2}
              defaultValue={product.metaDescription}
              className="min-h-16"
            />
          )}
        </Field>
      </div>

      <div>
        <p className="mb-2 text-[0.875rem] font-medium text-ink">Logo</p>
        {mediaOptions.length ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLogoId("")}
              className={cn(
                "flex size-16 items-center justify-center rounded-md border text-[0.6875rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                logoId === ""
                  ? "border-accent bg-accent-soft text-accent-text"
                  : "border-hairline text-ink-subtle hover:border-hairline-strong",
              )}
            >
              None
            </button>
            {mediaOptions.slice(0, 40).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLogoId(item.id)}
                aria-pressed={logoId === item.id}
                title={item.filename}
                className={cn(
                  "relative size-16 overflow-hidden rounded-md border bg-surface-2 transition-[border-color] duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  logoId === item.id
                    ? "border-accent ring-2 ring-accent-soft"
                    : "border-hairline hover:border-hairline-strong",
                )}
              >
                <Image src={item.url} alt="" fill sizes="64px" className="object-contain p-1.5" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[0.8125rem] text-ink-muted">
            Upload a logo under Media first.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={product.isPublished}
          className="size-4 accent-[var(--color-accent-strong)]"
        />
        Published
      </label>
    </>
  );
}

export function ProductEditor({
  product,
  mediaOptions,
  canDelete,
}: {
  product: ProductData;
  mediaOptions: MediaOption[];
  canDelete: boolean;
}) {
  const [state, action] = useActionState(saveProduct, INITIAL);

  return (
    <div className="space-y-4 px-5 py-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={product.id} />
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields product={product} mediaOptions={mediaOptions} />
        <SaveButton label="Save" />
      </form>

      {canDelete ? (
        <form action={deleteProduct} className="border-t border-hairline pt-3">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Delete product
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function NewProduct({ mediaOptions }: { mediaOptions: MediaOption[] }) {
  const [state, action] = useActionState(saveProduct, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Add a product">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields
          product={{
            slug: "",
            name: "",
            tagline: "",
            description: "",
            category: "",
            platform: "",
            status: "COMING_SOON",
            websiteUrl: "",
            pricingUrl: "",
            videoUrl: "",
            ctaLabel: "",
            ctaHref: "",
            features: "",
            logoId: "",
            metaTitle: "",
            metaDescription: "",
            isPublished: false,
            order: 0,
          }}
          mediaOptions={mediaOptions}
        />
        <SaveButton label="Add product" />
      </form>
    </Card>
  );
}
