"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, ChoiceCard } from "@/components/ui/field";
import {
  BUDGET_OPTIONS,
  ENQUIRY_SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/validation";
import { track } from "@/components/site/analytics-events";

/**
 * Progressive project enquiry form.
 *
 * Deliberate choices:
 *  - Four short steps rather than one long form. The first question is easy
 *    and requires no typing, which is what gets people started.
 *  - Every step validates before advancing, and the server validates all of it
 *    again — the client checks are for feedback, not for trust.
 *  - Attribution (UTMs, referrer, landing page) is captured silently on mount
 *    so a lead arrives with its source attached.
 *  - Spam handling is a honeypot plus a submission-timing check, not a CAPTCHA.
 *    A CAPTCHA on a B2B enquiry form costs more conversions than it prevents
 *    spam.
 */

const STEPS = ["Service", "Budget", "Timeline", "Details"] as const;

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
}: {
  compact?: boolean;
  defaultService?: string;
}) {
  const pathname = usePathname();

  const [step, setStep] = React.useState(0);
  const [services, setServices] = React.useState<string[]>(
    defaultService ? [defaultService] : [],
  );
  const [budget, setBudget] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [details, setDetails] = React.useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
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

  const headingRef = React.useRef<HTMLParagraphElement>(null);

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

  // Move focus to the new step so keyboard and screen-reader users follow it.
  React.useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  function toggleService(value: string) {
    setServices((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setErrors((current) => ({ ...current, services: "" }));
  }

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};

    if (index === 0 && services.length === 0) {
      next.services = "Pick at least one so we know who should read this.";
    }
    if (index === 3) {
      if (details.name.trim().length < 2) next.name = "Please enter your name.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email.trim())) {
        next.email = "Please enter a valid email address.";
      }
      if (details.message.trim().length < 10) {
        next.message = "A sentence or two about the project is enough.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  }

  function goBack() {
    setFormError(null);
    setStep((current) => Math.max(0, current - 1));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          services,
          budget,
          timeline,
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
        if (data.fields) setErrors(data.fields);
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      track("contact_submit", {
        services: services.join(","),
        budget,
        timeline,
      });
      setSubmitted(true);
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection, or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <ThankYou />;
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
      {/* ---- Progress ---- */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1 rounded-full transition-colors duration-[var(--duration-standard)]",
                index <= step ? "bg-accent" : "bg-surface-3",
              )}
            />
            <span
              className={cn(
                "hidden text-[0.6875rem] font-medium uppercase tracking-[0.1em] sm:block",
                index <= step ? "text-ink-muted" : "text-ink-subtle",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <p
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-6 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-ink-subtle outline-none"
      >
        Step {step + 1} of {STEPS.length}
      </p>

      {/* ---- Step 1: services ---- */}
      {step === 0 ? (
        <fieldset className="mt-3">
          <legend className="text-title text-ink">
            What do you need help with?
          </legend>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Choose as many as apply. This only decides who reads it first.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {ENQUIRY_SERVICE_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                label={option.label}
                selected={services.includes(option.value)}
                onSelect={() => toggleService(option.value)}
              />
            ))}
          </div>

          {errors.services ? (
            <p role="alert" className="mt-3 text-[0.8125rem] font-medium text-danger">
              {errors.services}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* ---- Step 2: budget ---- */}
      {step === 1 ? (
        <fieldset className="mt-3">
          <legend className="text-title text-ink">
            Roughly what budget are you working with?
          </legend>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            A range is fine, and &ldquo;not sure&rdquo; is a legitimate answer —
            it just changes how we scope the first conversation.
          </p>

          <div className="mt-5 grid gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                type="radio"
                name="budget"
                label={option.label}
                selected={budget === option.value}
                onSelect={() => setBudget(option.value)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* ---- Step 3: timeline ---- */}
      {step === 2 ? (
        <fieldset className="mt-3">
          <legend className="text-title text-ink">
            When would you want to start?
          </legend>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Researching for later is genuinely fine. We would rather know than
            guess.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {TIMELINE_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                type="radio"
                name="timeline"
                label={option.label}
                selected={timeline === option.value}
                onSelect={() => setTimeline(option.value)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* ---- Step 4: details ---- */}
      {step === 3 ? (
        <div className="mt-3">
          <h3 className="text-title text-ink">How do we reach you?</h3>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            A real person reads every one of these.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Name" required error={errors.name}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="name"
                  autoComplete="name"
                  value={details.name}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  onChange={(event) =>
                    setDetails({ ...details, name: event.target.value })
                  }
                />
              )}
            </Field>

            <Field label="Company" error={errors.company}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="organization"
                  autoComplete="organization"
                  value={details.company}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  onChange={(event) =>
                    setDetails({ ...details, company: event.target.value })
                  }
                />
              )}
            </Field>

            <Field label="Email" required error={errors.email}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={details.email}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  onChange={(event) =>
                    setDetails({ ...details, email: event.target.value })
                  }
                />
              )}
            </Field>

            <Field label="Phone" error={errors.phone}>
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
                  onChange={(event) =>
                    setDetails({ ...details, phone: event.target.value })
                  }
                />
              )}
            </Field>

            <Field
              label="Country"
              className="sm:col-span-2"
              error={errors.country}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="country"
                  autoComplete="country-name"
                  value={details.country}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  onChange={(event) =>
                    setDetails({ ...details, country: event.target.value })
                  }
                />
              )}
            </Field>

            <Field
              label="About the project"
              required
              className="sm:col-span-2"
              hint="What are you trying to build or fix, and what does success look like?"
              error={errors.message}
            >
              {({ id, describedBy, invalid }) => (
                <Textarea
                  id={id}
                  name="message"
                  value={details.message}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  onChange={(event) =>
                    setDetails({ ...details, message: event.target.value })
                  }
                />
              )}
            </Field>
          </div>

          {/* Honeypot — positioned off-screen rather than display:none, which
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

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
            We use these details only to respond to your enquiry. No lists, no
            sharing.
          </p>
        </div>
      ) : null}

      {formError ? (
        <p
          role="alert"
          className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-3.5 py-3 text-[0.875rem] font-medium text-danger"
        >
          {formError}
        </p>
      ) : null}

      {/* ---- Navigation ---- */}
      <div className="mt-7 flex items-center justify-between gap-3 border-t border-hairline pt-5">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={goBack} size="sm">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext} withArrow>
            Continue
          </Button>
        ) : (
          <Button type="submit" loading={submitting} withArrow>
            {submitting ? "Sending" : "Send enquiry"}
          </Button>
        )}
      </div>
    </form>
  );
}

function ThankYou() {
  const steps = [
    "We read your enquiry and look at your existing site or product.",
    "We come back with either questions or a suggested next step.",
    "If it looks like a fit, a call to talk through scope properly.",
    "A written proposal with scope, timeline and cost.",
  ];

  return (
    <div
      role="status"
      className="rounded-lg border border-hairline bg-surface p-6 sm:p-8"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft">
        <Check aria-hidden="true" className="size-5 text-accent-text" />
      </span>

      <h3 className="mt-5 text-title text-ink">
        Thanks — your project is now on our radar.
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
        We have sent a confirmation to your email. Here is what happens next.
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

      <p className="mt-6 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
        If anything changes in the meantime, just reply to the confirmation
        email.
      </p>
    </div>
  );
}
