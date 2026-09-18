"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveTeamMember, deleteTeamMember, type TeamState } from "./actions";

const INITIAL: TeamState = {};

interface Member {
  id?: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  photoId: string;
  linkedin: string;
  expertise: string;
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

function Fields({
  member,
  mediaOptions,
}: {
  member: Member;
  mediaOptions: MediaOption[];
}) {
  const [photoId, setPhotoId] = React.useState(member.photoId);

  return (
    <>
      <input type="hidden" name="photoId" value={photoId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" required>
          {({ id }) => (
            <Input id={id} name="name" defaultValue={member.name} required className="h-10" />
          )}
        </Field>
        <Field label="Role" required>
          {({ id }) => (
            <Input id={id} name="role" defaultValue={member.role} required className="h-10" />
          )}
        </Field>
        <Field label="Slug" hint="Derived from the name if blank.">
          {({ id }) => (
            <Input id={id} name="slug" defaultValue={member.slug} className="h-10" />
          )}
        </Field>
        <Field label="Display order">
          {({ id }) => (
            <Input
              id={id}
              name="order"
              type="number"
              min={0}
              defaultValue={member.order}
              className="h-10"
            />
          )}
        </Field>
        <Field label="LinkedIn" className="sm:col-span-2">
          {({ id }) => (
            <Input
              id={id}
              name="linkedin"
              type="url"
              defaultValue={member.linkedin}
              className="h-10"
            />
          )}
        </Field>
        <Field
          label="Expertise"
          hint="Comma separated."
          className="sm:col-span-2"
        >
          {({ id }) => (
            <Input
              id={id}
              name="expertise"
              defaultValue={member.expertise}
              placeholder="Product design, Front-end, Design systems"
              className="h-10"
            />
          )}
        </Field>
        <Field label="Short bio" className="sm:col-span-2">
          {({ id }) => (
            <Textarea
              id={id}
              name="bio"
              rows={3}
              defaultValue={member.bio}
              className="min-h-20"
            />
          )}
        </Field>
      </div>

      <div>
        <p className="mb-2 text-[0.875rem] font-medium text-ink">Photo</p>
        {mediaOptions.length ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhotoId("")}
              className={cn(
                "flex size-16 items-center justify-center rounded-full border text-[0.6875rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                photoId === ""
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
                onClick={() => setPhotoId(item.id)}
                aria-pressed={photoId === item.id}
                title={item.filename}
                className={cn(
                  "relative size-16 overflow-hidden rounded-full border transition-[border-color] duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  photoId === item.id
                    ? "border-accent ring-2 ring-accent-soft"
                    : "border-hairline hover:border-hairline-strong",
                )}
              >
                <Image src={item.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[0.8125rem] text-ink-muted">
            Upload photographs under Media first.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={member.isPublished}
          className="size-4 accent-[var(--color-accent-strong)]"
        />
        Published
      </label>
    </>
  );
}

export function TeamEditor({
  member,
  mediaOptions,
  canDelete,
}: {
  member: Member;
  mediaOptions: MediaOption[];
  canDelete: boolean;
}) {
  const [state, action] = useActionState(saveTeamMember, INITIAL);

  return (
    <div className="space-y-4 px-5 py-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={member.id} />
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields member={member} mediaOptions={mediaOptions} />
        <SaveButton label="Save" />
      </form>

      {canDelete ? (
        <form action={deleteTeamMember} className="border-t border-hairline pt-3">
          <input type="hidden" name="id" value={member.id} />
          <button
            type="submit"
            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Remove
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function NewTeamMember({ mediaOptions }: { mediaOptions: MediaOption[] }) {
  const [state, action] = useActionState(saveTeamMember, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Add a team member">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <Fields
          member={{
            name: "",
            slug: "",
            role: "",
            bio: "",
            photoId: "",
            linkedin: "",
            expertise: "",
            isPublished: false,
            order: 0,
          }}
          mediaOptions={mediaOptions}
        />
        <SaveButton label="Add member" />
      </form>
    </Card>
  );
}
