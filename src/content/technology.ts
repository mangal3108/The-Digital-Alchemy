export type TechCategory =
  | "ai"
  | "frontend"
  | "backend"
  | "mobile"
  | "data"
  | "cloud"
  | "design"
  | "cms"
  | "marketing"
  | "analytics";

export interface Technology {
  key: string;
  name: string;
  category: TechCategory;
  /** What we actually use it for — shown on hover rather than a bare logo wall. */
  usedFor: string;
}

export const TECH_CATEGORIES: Record<
  TechCategory,
  { label: string; blurb: string }
> = {
  ai: {
    label: "AI & Automation",
    blurb: "Autonomous agents, LLM pipelines, vector search, and intelligent workflow automations.",
  },
  frontend: {
    label: "Frontend",
    blurb: "What the user touches. Chosen for rendering speed and long-term maintainability.",
  },
  backend: {
    label: "Backend",
    blurb: "Business logic, APIs and the parts that must not lose data.",
  },
  mobile: {
    label: "Mobile",
    blurb: "iOS and Android, usually from a shared codebase.",
  },
  data: {
    label: "Data",
    blurb: "Storage, querying and caching — where most performance problems originate.",
  },
  cloud: {
    label: "Cloud & DevOps",
    blurb: "Environments, deployment and the monitoring that tells you it is still up.",
  },
  design: {
    label: "Design",
    blurb: "Where interfaces are designed, documented and handed over.",
  },
  cms: {
    label: "Content",
    blurb: "So the people who own the content can publish it themselves.",
  },
  marketing: {
    label: "Marketing",
    blurb: "Where campaigns are built, targeted and measured.",
  },
  analytics: {
    label: "Analytics",
    blurb: "Measurement, attribution and reporting that survives scrutiny.",
  },
};

export const technologies: Technology[] = [
  // AI & Automation
  {
    key: "openai",
    name: "OpenAI GPT-4o",
    category: "ai",
    usedFor:
      "Custom GPT models, multi-modal reasoning, structured data extraction, and automated conversational assistants.",
  },
  {
    key: "anthropic",
    name: "Anthropic Claude",
    category: "ai",
    usedFor:
      "High-context document intelligence, complex data analysis pipelines, and deterministic code synthesis.",
  },
  {
    key: "langchain",
    name: "LangChain & Agents",
    category: "ai",
    usedFor:
      "Multi-step autonomous agent architectures, deterministic tool calling, and RAG retrieval pipelines.",
  },
  {
    key: "pinecone",
    name: "Pinecone & Vector DB",
    category: "ai",
    usedFor:
      "High-performance vector embeddings, hybrid semantic search, and knowledge base retrieval.",
  },
  {
    key: "n8n",
    name: "n8n Automation",
    category: "ai",
    usedFor:
      "Enterprise workflow orchestration connecting internal tools, CRM, and cloud services with AI models.",
  },

  // Frontend
  {
    key: "typescript",
    name: "TypeScript",
    category: "frontend",
    usedFor:
      "Our default for anything non-trivial. Types catch a whole class of bug before it reaches a review, and they make handover to another team realistic.",
  },
  {
    key: "react",
    name: "React",
    category: "frontend",
    usedFor:
      "Component architecture for application interfaces — the shared vocabulary between our designers and engineers.",
  },
  {
    key: "nextjs",
    name: "Next.js",
    category: "frontend",
    usedFor:
      "Server rendering, routing and image optimisation. It is what lets a site be visually rich and still load quickly on a mid-range phone.",
  },
  {
    key: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    usedFor:
      "Design tokens expressed directly in markup, which keeps spacing, type and colour consistent as a codebase grows.",
  },
  {
    key: "storybook",
    name: "Storybook",
    category: "frontend",
    usedFor:
      "Documenting components in isolation so a design system is something a team can browse rather than something they have to remember.",
  },

  // Backend
  {
    key: "nodejs",
    name: "Node.js",
    category: "backend",
    usedFor:
      "APIs and services, sharing language and types with the frontend so contracts between them cannot silently drift.",
  },
  {
    key: "python",
    name: "Python",
    category: "backend",
    usedFor:
      "Data processing, integrations and automation work, where its libraries are simply the shortest route.",
  },
  {
    key: "prisma",
    name: "Prisma",
    category: "backend",
    usedFor:
      "Type-safe database access and versioned migrations, so schema changes are reviewable rather than improvised in production.",
  },

  // Mobile
  {
    key: "react-native",
    name: "React Native",
    category: "mobile",
    usedFor:
      "One codebase for iOS and Android when the app is primarily interface and data — which covers most business apps.",
  },
  {
    key: "flutter",
    name: "Flutter",
    category: "mobile",
    usedFor:
      "Cross-platform apps needing highly custom interfaces and consistent rendering on both platforms.",
  },
  {
    key: "firebase",
    name: "Firebase",
    category: "mobile",
    usedFor:
      "Push notifications, crash reporting and authentication for mobile projects that do not warrant a bespoke backend.",
  },

  // Data
  {
    key: "postgresql",
    name: "PostgreSQL",
    category: "data",
    usedFor:
      "Our default database. Relational integrity, mature tooling, and it handles far more scale than most projects will ever need.",
  },
  {
    key: "redis",
    name: "Redis",
    category: "data",
    usedFor:
      "Caching, queues and rate limiting — the layer that keeps an application responsive under load.",
  },

  // Cloud
  {
    key: "aws",
    name: "AWS",
    category: "cloud",
    usedFor:
      "Infrastructure for applications with specific compliance, region or architecture requirements.",
  },
  {
    key: "vercel",
    name: "Vercel",
    category: "cloud",
    usedFor:
      "Deployment for Next.js sites and applications where edge delivery and preview environments matter more than raw infrastructure control.",
  },
  {
    key: "docker",
    name: "Docker",
    category: "cloud",
    usedFor:
      "Making local, staging and production genuinely identical, which removes an entire category of works-on-my-machine bugs.",
  },
  {
    key: "sentry",
    name: "Sentry",
    category: "cloud",
    usedFor:
      "Error tracking with stack traces and context, so problems are found before a customer reports them.",
  },

  // Design
  {
    key: "figma",
    name: "Figma",
    category: "design",
    usedFor:
      "Interface design, design systems, prototypes and developer handoff, with clients able to comment directly on the work.",
  },

  // CMS
  {
    key: "wordpress",
    name: "WordPress",
    category: "cms",
    usedFor:
      "Content-heavy marketing sites where editorial flexibility matters most — including the platform this business runs today.",
  },
  {
    key: "shopify",
    name: "Shopify",
    category: "cms",
    usedFor:
      "Commerce where the operational simplicity of a hosted platform outweighs the constraints it imposes.",
  },
  {
    key: "woocommerce",
    name: "WooCommerce",
    category: "cms",
    usedFor:
      "Commerce built into an existing WordPress site, where content and catalogue need to live together.",
  },

  // Marketing
  {
    key: "google-ads",
    name: "Google Ads",
    category: "marketing",
    usedFor:
      "Search, Shopping, YouTube and Performance Max campaigns — reaching people already looking for a solution.",
  },
  {
    key: "meta-ads",
    name: "Meta Ads",
    category: "marketing",
    usedFor:
      "Facebook and Instagram campaigns, where creative rather than targeting does most of the work.",
  },
  {
    key: "stripe",
    name: "Stripe",
    category: "marketing",
    usedFor:
      "Subscription billing, trials, proration and invoicing for SaaS products, on an account the client owns.",
  },
  {
    key: "razorpay",
    name: "Razorpay",
    category: "marketing",
    usedFor:
      "Payments for Indian businesses, including UPI and the local payment methods customers here expect.",
  },

  // Analytics
  {
    key: "ga4",
    name: "Google Analytics 4",
    category: "analytics",
    usedFor:
      "Behaviour and conversion measurement, configured with events that map to your funnel rather than left on defaults.",
  },
  {
    key: "gtm",
    name: "Google Tag Manager",
    category: "analytics",
    usedFor:
      "Managing tracking without a deployment for every change, and keeping marketing tags out of the application codebase.",
  },
  {
    key: "search-console",
    name: "Search Console",
    category: "analytics",
    usedFor:
      "Indexation, query data and Core Web Vitals — the ground truth for how search actually sees a site.",
  },
  {
    key: "looker-studio",
    name: "Looker Studio",
    category: "analytics",
    usedFor:
      "Client reporting that pulls from source systems, so a monthly report is a live view rather than a rebuilt slide.",
  },
];

const byKey = new Map(technologies.map((tech) => [tech.key, tech]));

export function getTechnology(key: string): Technology | undefined {
  return byKey.get(key);
}

export function getTechnologies(keys: readonly string[]): Technology[] {
  return keys
    .map((key) => byKey.get(key))
    .filter((tech): tech is Technology => Boolean(tech));
}

export function getTechnologiesByCategory(category: TechCategory): Technology[] {
  return technologies.filter((tech) => tech.category === category);
}
