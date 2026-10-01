"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ENQUIRY_NEED_OPTIONS, enquiryNeedFor } from "@/lib/validation";
import { track } from "@/components/site/analytics-events";

/**
 * The enquiry form: as short as it can be (Phase 6).
 *
 * Four fields: name, a phone or WhatsApp number, what they need (the six
 * service groups, as a dropdown), and an optional message. Most visitors are
 * on a phone and would rather be called than type, so there is no email,
 * budget or timeline step. We ask those on the call.
 *
 * Kept from the earlier form:
 *  - The server validates everything again; the browser checks are feedback.
 *  - Attribution (UTMs, referrer, landing page) is captured silently, so a
 *    lead arrives with its source attached.
 *  - Spam handling is a honeypot plus a timing check, not a CAPTCHA.
 */

interface Attribution {
  sourcePage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}

const EMPTY_ATTRIBUTION: Attribution = {
  sourcePage: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
};

export function ProjectForm({
  compact = false,
  defaultService,
  replyTime = "",
}: {
  compact?: boolean;
  /** A service slug or group key, e.g. from /start-a-project?service=google-ads. */
  defaultService?: string;
  /** From Admin → Settings. Empty means we promise no reply time. */
  replyTime?: string;
}) {
  const pathname = usePathname();

  const [details, setDetails] = React.useState({
    name: "",
    phone: "",
    need: enquiryNeedFor(defaultService),
    message: "",
  });

  const [honeypot, setHoneypot] = React.useState("");
  const [attribution, setAttribution] =
    React.useState<Attribution>(EMPTY_ATTRIBUTION);
  const mountedAt = React.useRef<number>(0);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Capture attribution once, on mount.
  React.useEffect(() => {
    mountedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      sourcePage: window.location.pathname + window.location.search,
      referrer: document.referrer.slice(0, 300),
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
    });
  }, [pathname]);

  function update(field: keyof typeof details, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (details.name.trim().length < 2) next.name = "Please enter your name.";
    if (details.phone.replace(/\D/g, "").length < 7) {
      next.phone = "Please enter a phone or WhatsApp number we can reach you on.";
    }
    if (!details.need) next.need = "Please choose one. “Not sure yet” is fine.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          phone: details.phone,
          services: [details.need],
          message: details.message,
          ...attribution,
          website: honeypot,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.fields) {
          // The server knows the need as "services"; show it on the dropdown.
          const { services, ...rest } = data.fields;
          setErrors(services ? { ...rest, need: services } : rest);
        }
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      track("contact_submit", { services: details.need });
      setSubmitted(true);
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection, or call or WhatsApp us instead.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <ThankYou replyTime={replyTime} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "rounded-lg border border-hairline bg-surface",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8",
      )}
    >
      <h2 className="text-title text-ink">Tell us what you need</h2>
      <p className="mt-2 text-[0.9375rem] text-ink-muted">
        Four questions. We will call or WhatsApp you back.
      </p>

      <div className="mt-6 grid gap-5">
        <Field label="Your name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="name"
              autoComplete="name"
              value={details.name}
              aria-describedby={describedBy}
              invalid={invalid}
              onChange={(event) => update("name", event.target.value)}
            />
          )}
        </Field>

        <Field
          label="Phone or WhatsApp number"
          required
          hint="With country code if you are outside India."
          error={errors.phone}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={details.phone}
              aria-describedby={describedBy}
              invalid={invalid}
              onChange={(event) => update("phone", event.target.value)}
            />
          )}
        </Field>

        <Field label="What do you need?" required error={errors.need}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              name="need"
              value={details.need}
              aria-describedby={describedBy}
              invalid={invalid}
              onChange={(event) => update("need", event.target.value)}
            >
              <option value="" disabled>
                Choose one
              </option>
              {ENQUIRY_NEED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field
          label="Anything else we should know?"
          hint="A sentence or two is plenty. You can skip this."
          error={errors.message}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              name="message"
              rows={3}
              className="min-h-24"
              value={details.message}
              aria-describedby={describedBy}
              invalid={invalid}
              onChange={(event) => update("message", event.target.value)}
            />
          )}
        </Field>
      </div>

      {/* Honeypot, positioned off-screen rather than display:none, which
          some bots detect. Hidden from assistive technology too. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto">
        <label htmlFor="website-url">Website (leave blank)</label>
        <input
          id="website-url"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-3.5 py-3 text-[0.875rem] font-medium text-danger"
        >
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        withArrow
        className="mt-6 w-full justify-center"
      >
        {submitting ? "Sending" : "Send"}
      </Button>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-subtle">
        {replyTime ? `We reply within ${replyTime}. ` : ""}
        We use your details only to reply to you. We never share or sell them.
      </p>
    </form>
  );
}

function ThankYou({ replyTime }: { replyTime: string }) {
  const steps = [
    replyTime
      ? `We call or WhatsApp you within ${replyTime}.`
      : "We call or WhatsApp you on the number you gave.",
    "We ask a few questions about your business and what you need.",
    "We suggest a next step, or tell you honestly if we are not the right fit.",
    "If you want to go ahead, you get a written plan and price.",
  ];

  return (
    <div
      role="status"
      className="rounded-lg border border-hairline bg-surface p-6 sm:p-8"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft">
        <Check aria-hidden="true" className="size-5 text-accent-text" />
      </span>

      <h2 className="mt-5 text-title text-ink">
        Thank you. We have your message.
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
        A real person reads every one. Here is what happens next.
      </p>

      <ol className="mt-6 space-y-3">
        {steps.map((item, index) => (
          <li key={item} className="flex gap-3">
            <span className="numeric font-mono text-[0.6875rem] leading-6 tracking-[0.14em] text-accent-text">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.9375rem] leading-relaxed text-ink-muted">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
