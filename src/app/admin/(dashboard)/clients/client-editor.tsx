"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveClient, deleteClient, type ClientState } from "./actions";

const INITIAL: ClientState = {};

interface ClientData {
  id?: string;
  name: string;
  slug: string;
  website: string;
  country: string;
  industry: string;
  logoId: string;
  showLogo: boolean;
  isPublished: boolean;
  order: number;
}

type MediaOption = { id: string; url: string; filename: string };

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : label}
    </Button>
  );
}

function LogoPicker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (id: string) => void;
  options: MediaOption[];
}) {
  if (!options.length) {
    return (
      <p className="text-[0.8125rem] text-ink-muted">
        Upload a logo under Media first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={cn(
          "flex h-14 w-20 items-center justify-center rounded-md border text-[0.6875rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          value === ""
            ? "border-accent bg-accent-soft text-accent-text"
            : "border-hairline text-ink-subtle hover:border-hairline-strong",
        )}
      >
        None
      </button>
      {options.slice(0, 40).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={value === item.id}
          title={item.filename}
          className={cn(
            "relative h-14 w-20 overflow-hidden rounded-md border bg-surface-2 transition-[border-color] duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            value === item.id
              ? "border-accent ring-2 ring-accent-soft"
              : "border-hairline hover:border-hairline-strong",
          )}
        >
          <Image src={item.url} alt="" fill sizes="80px" className="object-contain p-1.5" />
        </button>
      ))}
    </div>
  );
}

function Fields({
  client,
  mediaOptions,
}: {
  client: ClientData;
  mediaOptions: MediaOption[];
}) {
  const [logoId, setLogoId] = React.useState(client.logoId);

  return (
    <>
      <input type="hidden" name="logoId" value={logoId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" required>
          {({ id }) => (
            <Input id={id} name="name" defaultValue={client.name} required className="h-10" />
          )}
        </Field>
        <Field label="Slug" hint="Derived from the name if blank.">
          {({ id }) => (
            <Input id={id} name="slug" defaultValue={client.slug} className="h-10" />
          )}
        </Field>
        <Field label="Industry">
          {({ id }) => (
            <Input id={id} name="industry" defaultValue={client.industry} className="h-10" />
          )}
        </Field>
        <Field label="Country">
          {({ id }) => (
            <Input id={id} name="country" defaultValue={client.country} className="h-10" />
          )}
        </Field>
        <Field label="Website" className="sm:col-span-2">
          {({ id }) => (
            <Input
              id={id}
              name="website"
              type="url"
              defaultValue={client.website}
              className="h-10"
            />
          )}
        </Field>
        <Field label="Display order">
          {({ id }) => (
            <Input
              id={id}
              name="order"
              type="number"
              min={0}
              defaultValue={client.order}
              className="h-10"
            />
          )}
        </Field>
      </div>

      <div>
        <p className="mb-2 text-[0.875rem] font-medium text-ink">Logo</p>
        <LogoPicker value={logoId} onChange={setLogoId} options={mediaOptions} />
      </div>

      <div className="space-y-2 rounded-md border border-hairline bg-canvas p-3">
        <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={client.isPublished}
            className="size-4 accent-[var(--color-accent-strong)]"
          />
          Published — appears on the clients page
        </label>
        <label className="flex items-start gap-2 text-[0.8125rem] text-ink-muted">
          <input
            type="checkbox"
            name="showLogo"
            defaultChecked={client.showLogo}
            className="mt-0.5 size-4 accent-[var(--color-accent-strong)]"
          />
          <span>
            Logo approved for use
            <span className="block text-[0.75rem] text-ink-subtle">
              Only tick this when the client has actually agreed. It is what
              puts their mark on the homepage strip.
            </span>
          </span>
        </label>
      </div>
    </>
  );
}

export function ClientEditor({
  client,
  mediaOptions,
  canDelete,
}: {
  client: ClientData;
  mediaOptions: MediaOption[];
  canDelete: boolean;
}) {
  const [state, action] = useActionState(saveClient, INITIAL);

  return (
    <div className="space-y-4 px-5 py-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={client.id} />
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields client={client} mediaOptions={mediaOptions} />
        <SaveButton label="Save" />
      </form>

      {canDelete ? (
        <form action={deleteClient} className="border-t border-hairline pt-3">
          <input type="hidden" name="id" value={client.id} />
          <button
            type="submit"
            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Delete client
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function NewClient({ mediaOptions }: { mediaOptions: MediaOption[] }) {
  const [state, action] = useActionState(saveClient, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Add a client">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields
          client={{
            name: "",
            slug: "",
            website: "",
            country: "",
            industry: "",
            logoId: "",
            showLogo: false,
            isPublished: false,
            order: 0,
          }}
          mediaOptions={mediaOptions}
        />
        <SaveButton label="Add client" />
      </form>
    </Card>
  );
}
