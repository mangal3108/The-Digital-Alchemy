"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Card, Notice } from "@/components/admin/ui";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/lib/db";
import {
  addLeadNote,
  assignLead,
  deleteLead,
  updateLeadStatus,
  type ActionState,
} from "../actions";

const INITIAL: ActionState = {};

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function LeadControls({
  leadId,
  status,
  assignedToId,
  assignees,
  canDelete,
}: {
  leadId: string;
  status: string;
  assignedToId: string;
  assignees: { id: string; name: string }[];
  canDelete: boolean;
}) {
  const router = useRouter();
  const [statusState, statusAction] = useActionState(updateLeadStatus, INITIAL);
  const [assignState, assignAction] = useActionState(assignLead, INITIAL);
  const [deleteState, deleteAction] = useActionState(deleteLead, INITIAL);
  const [confirming, setConfirming] = React.useState(false);

  React.useEffect(() => {
    if (deleteState.ok) router.push("/admin/leads");
  }, [deleteState.ok, router]);

  return (
    <Card title="Manage">
      <div className="space-y-5 px-5 py-4">
        {statusState.message ? <Notice>{statusState.message}</Notice> : null}
        {statusState.error ? (
          <Notice tone="error">{statusState.error}</Notice>
        ) : null}

        <form action={statusAction} className="space-y-3">
          <input type="hidden" name="id" value={leadId} />
          <Field label="Status">
            {({ id }) => (
              <Select id={id} name="status" defaultValue={status}>
                {LEAD_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Submit label="Update status" pendingLabel="Saving" />
        </form>

        <form action={assignAction} className="space-y-3 border-t border-hairline pt-5">
          <input type="hidden" name="id" value={leadId} />
          <Field label="Assigned to">
            {({ id }) => (
              <Select id={id} name="assignedToId" defaultValue={assignedToId}>
                <option value="">Unassigned</option>
                {assignees.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          {assignState.message ? <Notice>{assignState.message}</Notice> : null}
          {assignState.error ? (
            <Notice tone="error">{assignState.error}</Notice>
          ) : null}
          <Submit label="Save assignment" pendingLabel="Saving" />
        </form>

        {canDelete ? (
          <div className="border-t border-hairline pt-5">
            <p className="text-[0.8125rem] font-medium text-ink">
              Delete this lead
            </p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-subtle">
              Permanent, and it removes the notes with it. Marking as spam is
              usually the better option.
            </p>

            {deleteState.error ? (
              <div className="mt-3">
                <Notice tone="error">{deleteState.error}</Notice>
              </div>
            ) : null}

            {confirming ? (
              <form action={deleteAction} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={leadId} />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-danger text-white hover:bg-danger/90"
                >
                  Yes, delete permanently
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="mt-3"
                onClick={() => setConfirming(true)}
              >
                Delete lead
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(addLeadNote, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <Field label="Add a note">
        {({ id }) => (
          <Textarea
            id={id}
            name="body"
            rows={3}
            placeholder="Called and left a voicemail. Following up Thursday."
            className="min-h-20"
          />
        )}
      </Field>
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Submit label="Add note" pendingLabel="Adding" />
    </form>
  );
}
