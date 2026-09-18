"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "./actions";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const INITIAL: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {pending ? "Signing in" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Email" required>
        {({ id, invalid }) => (
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            invalid={invalid}
          />
        )}
      </Field>

      <Field label="Password" required>
        {({ id, invalid }) => (
          <Input
            id={id}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            invalid={invalid}
          />
        )}
      </Field>

      {state.error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[0.8125rem] font-medium text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
