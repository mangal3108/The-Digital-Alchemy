"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveSettings, type SettingsState } from "./actions";

const INITIAL: SettingsState = {};

interface FieldDefinition {
  key: string;
  label: string;
  type: string;
  hint?: string;
  value: string;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? "Saving" : "Save changes"}
    </Button>
  );
}

export function SettingsGroupForm({
  group,
  title,
  description,
  fields,
}: {
  group: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
}) {
  const [state, action] = useActionState(saveSettings, INITIAL);

  return (
    <Card title={title} description={description}>
      <form action={action} className="px-5 py-4">
        <input type="hidden" name="__group" value={group} />

        {state.message ? <Notice>{state.message}</Notice> : null}
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              hint={field.hint}
              className={field.type === "textarea" ? "sm:col-span-2" : undefined}
            >
              {({ id }) =>
                field.type === "textarea" ? (
                  <Textarea
                    id={id}
                    name={field.key}
                    defaultValue={field.value}
                    rows={3}
                    className="min-h-24"
                  />
                ) : (
                  <Input
                    id={id}
                    name={field.key}
                    type={
                      field.type === "email"
                        ? "email"
                        : field.type === "tel"
                          ? "tel"
                          : field.type === "url"
                            ? "url"
                            : "text"
                    }
                    defaultValue={field.value}
                  />
                )
              }
            </Field>
          ))}
        </div>

        <div className="mt-5 border-t border-hairline pt-4">
          <SaveButton />
        </div>
      </form>
    </Card>
  );
}
