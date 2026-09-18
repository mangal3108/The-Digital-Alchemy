/**
 * The studio process. Deliberately six stages that map to the brand idea —
 * idea → strategy → design → technology → launch → growth — without spelling
 * the metaphor out in the copy. Each stage names what actually happens and
 * what the client receives, rather than describing a feeling.
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
    title: "Discover",
    summary: "Understand the business before proposing anything.",
    detail:
      "We spend time with the people who own the problem, look at whatever data already exists, and establish what success would actually look like. Most bad projects are traceable to this stage being skipped.",
    outputs: ["Problem definition", "Audience and constraints", "Success criteria"],
  },
  {
    step: "02",
    title: "Strategise",
    summary: "Decide what to do, and what not to do.",
    detail:
      "Scope, priorities, architecture and channel mix, written down and agreed. Including the things we recommend leaving out, which is usually the more valuable half of the document.",
    outputs: ["Written scope", "Technical approach", "Budget and sequencing"],
  },
  {
    step: "03",
    title: "Design",
    summary: "Resolve the experience while it is still cheap to change.",
    detail:
      "Structure first, then interface. Prototyped and reviewed with real content, across mobile and desktop together, so the decisions are tested before engineering commits to them.",
    outputs: ["Flows and wireframes", "Interface design", "Design system"],
  },
  {
    step: "04",
    title: "Build",
    summary: "Ship in increments you can see and use.",
    detail:
      "Short iterations against a staging environment you have access to throughout. Progress is something you can click on, not a percentage in a status report.",
    outputs: ["Staging environment", "Working increments", "Test coverage"],
  },
  {
    step: "05",
    title: "Launch",
    summary: "Release carefully, with the measurement already on.",
    detail:
      "Migration, redirects, analytics verification, monitoring and a support window. A launch is a controlled event with a rollback plan, not a moment of hope.",
    outputs: ["Production release", "Redirects and migration", "Analytics verified"],
  },
  {
    step: "06",
    title: "Scale",
    summary: "Improve against what real usage shows.",
    detail:
      "Once actual people are using it, the data replaces the assumptions. This is where most of the value gets created, and it is the stage most often skipped.",
    outputs: ["Performance reporting", "Prioritised improvements", "Ongoing support"],
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
    title: "AI-native architecture & autonomous workflows",
    body: "We engineer systems with AI automation built into the foundation—structured agent routing, retrieval-augmented intelligence, and automated operational pipelines rather than shallow retrofits.",
  },
  {
    key: "product-thinking",
    title: "Product thinking, not order taking",
    body: "We ask what the software is for before we ask what it should contain. If a smaller build would get you the same outcome, we will say so — including when it means a smaller project for us.",
  },
  {
    key: "design-and-engineering",
    title: "Design and engineering in one team",
    body: "The two disciplines work together from the first week, so designs are buildable and engineers understand the intent. There is no handover gap for quality to fall through.",
  },
  {
    key: "growth-built-in",
    title: "Growth considered from the start",
    body: "The people who will have to market the product are in the room while it is being built. SEO structure, speed, measurement and messaging are decided during the project, not retrofitted after launch.",
  },
];
