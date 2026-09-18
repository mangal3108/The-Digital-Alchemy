export interface EngagementModel {
  key: string;
  name: string;
  bestFor: string;
  description: string;
  characteristics: string[];
}

export const engagementModels: EngagementModel[] = [
  {
    key: "project",
    name: "Project-Based",
    bestFor: "A defined outcome with a clear finish line.",
    description:
      "We scope the work, agree a price and a schedule, and deliver against it. Suits websites, first product releases and discrete pieces of software where the requirement can be pinned down before starting.",
    characteristics: [
      "Fixed scope agreed in writing",
      "Milestone-based schedule and payments",
      "Written change process for anything new",
      "Handover and warranty period at the end",
    ],
  },
  {
    key: "dedicated-team",
    name: "Dedicated Team",
    bestFor: "Ongoing design and engineering capacity.",
    description:
      "An agreed allocation of our people working as an extension of yours, planning in cycles against your priorities. Suits work where the direction is clear but the detailed scope will keep evolving.",
    characteristics: [
      "Named people with a known allocation",
      "Planning in two-week cycles",
      "You set the priority order",
      "Monthly rate, cancellable with notice",
    ],
  },
  {
    key: "growth-retainer",
    name: "Growth Retainer",
    bestFor: "Marketing, social and SEO that compounds.",
    description:
      "Continuous work on the channels producing demand, with an agreed monthly scope and reporting. Growth work is cumulative — the results come from consistency rather than from any single campaign.",
    characteristics: [
      "Agreed monthly deliverables",
      "Regular optimisation cycles",
      "Monthly reporting and a quarterly review",
      "Your ad accounts, your data",
    ],
  },
  {
    key: "product-partnership",
    name: "Product Partnership",
    bestFor: "An evolving SaaS or software product.",
    description:
      "A longer arrangement where we act as the product and engineering team for a business that does not have one. Strategy, design, build and operation, planned in quarters rather than tickets.",
    characteristics: [
      "Quarterly roadmap set together",
      "Design, engineering and infrastructure covered",
      "Monitoring and on-call arrangement included",
      "Reviewed and renewed quarterly",
    ],
  },
  {
    key: "maintenance",
    name: "Maintenance & Support",
    bestFor: "Keeping something live and healthy.",
    description:
      "Updates, monitoring, backups, security patching and an allocation of hours for small changes, with response times agreed by severity.",
    characteristics: [
      "Defined response times by severity",
      "Regular security and dependency updates",
      "Monitoring, alerting and tested backups",
      "Monthly allocation for changes",
    ],
  },
];

const byKey = new Map(engagementModels.map((model) => [model.key, model]));

export function getEngagementModel(key: string): EngagementModel | undefined {
  return byKey.get(key);
}

export function getEngagementModels(keys: readonly string[]): EngagementModel[] {
  return keys
    .map((key) => byKey.get(key))
    .filter((model): model is EngagementModel => Boolean(model));
}
