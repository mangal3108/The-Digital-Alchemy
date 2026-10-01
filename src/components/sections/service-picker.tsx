"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  BUSINESS_OPTIONS,
  FOLLOW_UPS,
  GOAL_OPTIONS,
  recommend,
  type Answers,
  type Goal,
} from "@/content/service-picker";

export interface PickerService {
  name: string;
  oneLiner: string;
  href: string;
}

interface Step {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

/**
 * "Not sure what you need?" — a few taps, then one or two services.
 *
 * Each answer is a button rather than a radio input. With radios, arrowing
 * through the options would select each one in turn, and with auto-advance
 * that would jump a keyboard user to the next question on their first key
 * press. Buttons only act when pressed.
 *
 * Focus follows the conversation: after each answer it moves to the next
 * question (or the result), and a polite live region announces it. Focus is
 * never moved on page load — only after the visitor has answered something.
 */
export function ServicePicker({
  catalogue,
  industries,
}: {
  catalogue: Record<string, PickerService>;
  industries: Record<string, string>;
}) {
  const [answers, setAnswers] = React.useState<Answers>({});
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const interacted = React.useRef(false);

  const steps: Step[] = [
    { id: "business", question: "What kind of business do you run?", options: BUSINESS_OPTIONS },
    { id: "goal", question: "What do you want most right now?", options: GOAL_OPTIONS },
    ...(answers.goal ? FOLLOW_UPS[answers.goal] : []),
  ];
  const currentIndex = steps.findIndex((step) => answers[step.id] === undefined);
  const done = currentIndex === -1;
  const current = done ? null : steps[currentIndex];
  // Before the goal is chosen, the shortest path (three questions) is the honest total.
  const total = answers.goal ? steps.length : 3;

  React.useEffect(() => {
    if (interacted.current) headingRef.current?.focus();
  }, [currentIndex]);

  function choose(stepId: string, value: string) {
    interacted.current = true;
    setAnswers((previous) => {
      // Changing the goal invalidates the follow-up answers for the old one.
      if (stepId === "goal") return { business: previous.business, goal: value as Goal };
      return { ...previous, [stepId]: value };
    });
  }

  function back() {
    interacted.current = true;
    const answered = steps.filter((step) => answers[step.id] !== undefined);
    const last = answered.at(-1);
    if (!last) return;
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[last.id];
      return next;
    });
  }

  function reset() {
    interacted.current = true;
    setAnswers({});
  }

  const labelFor = (step: Step) =>
    step.options.find((option) => option.value === answers[step.id])?.label;
  const trail = steps.map(labelFor).filter(Boolean) as string[];

  const result = done ? recommend(answers) : null;
  const business = BUSINESS_OPTIONS.find((b) => b.value === answers.business);
  const industryName = business?.industry ? industries[business.industry] : undefined;

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-5 sm:p-8">
      <p aria-live="polite" className="sr-only">
        {done ? "Here is where we would start." : `Question ${currentIndex + 1} of ${total}. ${current?.question}`}
      </p>

      {trail.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline pb-5">
          <p className="text-[0.9375rem] text-ink-muted">
            <span className="sr-only">Your answers: </span>
            {trail.join(" · ")}
          </p>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={back}
              className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-ink-muted transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Start again
            </button>
          </div>
        </div>
      ) : null}

      {current ? (
        <div>
          <p className="eyebrow">
            Question {currentIndex + 1} of {total}
          </p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 text-title text-ink focus:outline-none"
          >
            {current.question}
          </h3>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {current.options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => choose(current.id, option.value)}
                  className="group flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-hairline bg-surface px-4 py-3 text-left text-[1rem] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:border-hairline-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {option.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ink-subtle transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : result ? (
        <div>
          <p className="eyebrow">A good place to start</p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-title text-ink focus:outline-none">
            {result.services.length > 1 ? "These two fit what you told us." : "This fits what you told us."}
          </h3>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-muted">{result.reason}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.services.map((slug) => {
              const service = catalogue[slug];
              if (!service) return null;
              return (
                <li key={slug}>
                  <Link
                    href={service.href}
                    className="group flex h-full flex-col rounded-md border border-hairline bg-surface p-5 transition-colors duration-[var(--duration-fast)] hover:border-hairline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <span className="text-[1.0625rem] font-semibold text-ink">{service.name}</span>
                    <span className="mt-1.5 flex-1 text-[1rem] leading-relaxed text-ink-muted">
                      {service.oneLiner}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text">
                      See how it works
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={`/start-a-project?service=${result.services[0]}`} withArrow>
              Talk to us about this
            </Button>
            {industryName && business?.industry ? (
              <Link
                href={`/industries/${business.industry}`}
                className="text-[1rem] font-medium text-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                {industryName}: what we do in your industry
              </Link>
            ) : null}
          </div>
          <p className="mt-4 text-[0.875rem] text-ink-subtle">
            A starting point, not a final answer. On a call we will look at your business properly.
          </p>
        </div>
      ) : null}
    </div>
  );
}
