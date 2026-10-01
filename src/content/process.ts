/**
 * How we work, in four steps. The same four everywhere they appear: the
 * homepage, /services and the enquiry page. Plain words
 * (docs/plain-language-glossary.md).
 *
 * Four, not six: the brief caps the homepage at four simple steps, and
 * "understand" and "plan" (like "design" and "build") were one conversation
 * to the client, told as two.
 */
export interface ProcessStage {
  step: string;
  title: string;
  summary: string;
  detail: string;
  outputs: string[];
}

export const processStages: ProcessStage[] = [
  {
    step: "01",
    title: "Talk and plan",
    summary: "We get to know your business before suggesting anything.",
    detail:
      "We talk about your business, your customers and what you want to change. Then we write down what we will do, what comes first and what it costs. That includes what we suggest leaving out.",
    outputs: ["What you want to achieve, written down", "A written plan and price", "What comes first"],
  },
  {
    step: "02",
    title: "Design and build",
    summary: "You see and use it as it grows.",
    detail:
      "We design with your real content and build on a test link you can open at any time. You check it on your phone and computer, and ask for changes while they are still cheap.",
    outputs: ["Designs using your content", "A test link you can use", "Changes made as we go"],
  },
  {
    step: "03",
    title: "Launch",
    summary: "We put it live carefully, with tracking already working.",
    detail:
      "We move your content, keep old links working, check the tracking, and watch for problems in the first weeks. A launch is planned, with a way back if needed.",
    outputs: ["Live and working", "Old links kept, content moved", "Tracking checked"],
  },
  {
    step: "04",
    title: "Grow",
    summary: "We improve it using what real use shows.",
    detail:
      "Once real people use it, facts replace guesses. We look at what they do and improve what matters most. This is the step most often skipped.",
    outputs: ["Monthly results", "Improvements, most valuable first", "Ongoing support"],
  },
];

/**
 * The four things that genuinely distinguish the studio. Written as claims that
 * can be checked, not as adjectives.
 */
export interface Differentiator {
  key: string;
  title: string;
  body: string;
}

export const differentiators: Differentiator[] = [
  {
    key: "ai-native",
    title: "AI where it saves you time",
    body: "We add AI where it genuinely helps, like answering common questions or sorting documents, and we tell you when it would not.",
  },
  {
    key: "product-thinking",
    title: "We ask what it is for first",
    body: "We ask what the software is for before what it should contain. If something smaller would get you the same result, we will say so, even when it means a smaller project for us.",
  },
  {
    key: "design-and-engineering",
    title: "Design and building in one team",
    body: "Designers and developers work together from the first week, so designs can actually be built and nothing gets lost in a hand-over.",
  },
  {
    key: "growth-built-in",
    title: "Marketing planned from the start",
    body: "The people who will market it are involved while it is built. Being easy to find on Google, speed, tracking and messaging are decided during the project, not patched on after launch.",
  },
];

/**
 * The homepage "Why us": three points, each something a client can check.
 * /about keeps the fuller list above.
 */
export const homeReasons: Differentiator[] = [
  {
    key: "one-team",
    title: "One team, start to finish",
    body: "The same team plans, designs, builds and markets it. Nothing gets lost between different companies.",
  },
  {
    key: "honest-advice",
    title: "We tell you what you do not need",
    body: "If something smaller or cheaper would do the job, we say so, even when it means less work for us.",
  },
  {
    key: "see-progress",
    title: "You can see progress any time",
    body: "Every decision is written down, and you get a test link you can open whenever you want.",
  },
];
