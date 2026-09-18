"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ROLES, ROLE_LABELS } from "@/lib/rbac";
import {
  createUser,
  updateUser,
  resetUserPassword,
  changeOwnPassword,
  type UserState,
} from "./actions";

const INITIAL: UserState = {};

function Pending({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

/** Shown once after creation or reset. Never recoverable afterwards. */
function PasswordReveal({ password }: { password: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="rounded-md border border-warning/30 bg-copper-50 p-3">
      <p className="text-[0.75rem] font-medium text-warning">
        Copy this now — it is not shown again.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded bg-surface px-2 py-1.5 font-mono text-[0.8125rem] text-ink">
          {password}
        </code>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(password);
            setCopied(true);
          }}
          className="shrink-0 rounded-md border border-hairline-strong bg-surface px-2.5 py-1.5 text-[0.75rem] font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-muted">
        Send it through a channel you trust, and ask them to change it after
        signing in.
      </p>
    </div>
  );
}

export function NewUserForm() {
  const [state, action] = useActionState(createUser, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card
      title="Add a user"
      description="Leave the password blank and a strong one is generated for you."
    >
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        {state.generatedPassword ? (
          <PasswordReveal password={state.generatedPassword} />
        ) : null}

        <Field label="Name" required>
          {({ id }) => <Input id={id} name="name" required className="h-10" />}
        </Field>

        <Field label="Email" required>
          {({ id }) => (
            <Input id={id} name="email" type="email" required className="h-10" />
          )}
        </Field>

        <Field label="Role" required>
          {({ id }) => (
            <Select id={id} name="role" defaultValue="EDITOR" className="h-10">
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Password" hint="At least 12 characters, or leave blank.">
          {({ id }) => (
            <Input
              id={id}
              name="password"
              type="password"
              autoComplete="new-password"
              className="h-10"
            />
          )}
        </Field>

        <Pending label="Create account" pendingLabel="Creating" />
      </form>
    </Card>
  );
}

export function UserRow({
  user,
}: {
  user: { id: string; role: string; isActive: boolean; email: string };
}) {
  const [open, setOpen] = React.useState(false);
  const [updateState, updateFormAction] = useActionState(updateUser, INITIAL);
  const [resetState, resetAction] = useActionState(resetUserPassword, INITIAL);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {open ? "Close" : "Manage"}
      </button>

      {open ? (
        <div className="mt-3 space-y-3 rounded-md border border-hairline bg-canvas p-3 text-left">
          {updateState.message ? <Notice>{updateState.message}</Notice> : null}
          {updateState.error ? (
            <Notice tone="error">{updateState.error}</Notice>
          ) : null}

          <form action={updateFormAction} className="space-y-3">
            <input type="hidden" name="id" value={user.id} />
            <Field label="Role">
              {({ id }) => (
                <Select
                  id={id}
                  name="role"
                  defaultValue={user.role}
                  className="h-9 text-[0.8125rem]"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={user.isActive}
                className="size-4 accent-[var(--color-accent-strong)]"
              />
              Active
            </label>
            <Pending label="Save" pendingLabel="Saving" />
          </form>

          <form action={resetAction} className="border-t border-hairline pt-3">
            <input type="hidden" name="id" value={user.id} />
            {resetState.error ? (
              <Notice tone="error">{resetState.error}</Notice>
            ) : null}
            {resetState.generatedPassword ? (
              <div className="mb-3">
                <PasswordReveal password={resetState.generatedPassword} />
              </div>
            ) : null}
            <button
              type="submit"
              className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Reset password
            </button>
            <p className="mt-1.5 text-[0.6875rem] text-ink-subtle">
              Signs them out of every device.
            </p>
          </form>
        </div>
      ) : null}
    </>
  );
}

export function OwnPasswordForm() {
  const [state, action] = useActionState(changeOwnPassword, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card title="Your password">
      <form ref={formRef} action={action} className="space-y-4 px-5 py-4">
        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <Field label="New password" required hint="At least 12 characters.">
          {({ id }) => (
            <Input
              id={id}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="h-10"
            />
          )}
        </Field>
        <Field label="Confirm" required>
          {({ id }) => (
            <Input
              id={id}
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              className="h-10"
            />
          )}
        </Field>

        <Pending label="Change password" pendingLabel="Saving" />
      </form>
    </Card>
  );
}
