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
    name: "Fixed project",
    bestFor: "A clear result, with a clear finish line.",
    description:
      "We agree what is included, a price and a schedule, then deliver it. Suits websites, first versions of software, and other work that can be pinned down before we start.",
    characteristics: [
      "What is included, agreed in writing",
      "Payments tied to finished stages",
      "A written process for anything new",
      "Handover, and a period of fixes after it",
    ],
  },
  {
    key: "dedicated-team",
    name: "A team for you",
    bestFor: "Ongoing design and development help.",
    description:
      "An agreed amount of our people's time, working like part of your team and planning around your priorities. Suits work where the direction is clear but the details keep changing.",
    characteristics: [
      "Named people, with agreed time",
      "Planning every two weeks",
      "You decide what comes first",
      "A monthly fee, which you can end with notice",
    ],
  },
  {
    key: "growth-retainer",
    name: "Monthly marketing",
    bestFor: "Marketing, social media and SEO that build up month after month.",
    description:
      "Steady work on the channels that bring you customers, with an agreed monthly plan and report. Results come from doing it consistently, not from any single campaign.",
    characteristics: [
      "An agreed list of work each month",
      "Regular improvements",
      "A monthly report, and a review every three months",
      "Your ad accounts, and your data",
    ],
  },
  {
    key: "product-partnership",
    name: "Long-term product partner",
    bestFor: "Software that keeps growing.",
    description:
      "A longer arrangement where we act as the product and development team for a business that does not have one. We plan, design, build and run it, three months at a time.",
    characteristics: [
      "A plan for every three months, made together",
      "Design, building and hosting covered",
      "Monitoring, and someone on call",
      "Reviewed and renewed every three months",
    ],
  },
  {
    key: "maintenance",
    name: "Maintenance & Support",
    bestFor: "Keeping your site or app running and healthy.",
    description:
      "Updates, monitoring, backups, security fixes and a set number of hours for small changes, with response times agreed by how serious a problem is.",
    characteristics: [
      "Agreed response times, by how serious the problem is",
      "Regular security and software updates",
      "Monitoring, alerts and tested backups",
      "Monthly hours for small changes",
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
