import type { Service } from "./types";

export const technologyServices: Service[] = [
  {
    slug: "automation-integrations",
    name: "AI Automation & Integrations",
    title: "Autonomous workflows and AI pipelines that run your business.",
    group: "technology",
    visual: "automation",
    featured: true,
    eyebrow: "AI Automation & Workflows",
    lede: "We architect intelligent AI automations, agentic workflows, and robust API integrations that eliminate repetitive toil, connect your software ecosystem, and let your team operate at 10x leverage.",
    summary:
      "Autonomous agent workflows, custom AI integrations, API pipelines, and reliable data sync across your tools.",
    metaTitle: "AI Automation & Autonomous Workflow Integration Services | The Digital Alchemy",
    metaDescription:
      "Enterprise AI automation, agentic workflows, and system integration — connecting modern LLMs, CRMs, and APIs to automate operations and eliminate manual friction.",
    whoFor: [
      "Teams re-entering the same information into more than one system",
      "Businesses whose tools each hold a different version of a customer",
      "Companies where a process stalls because someone has to remember to act",
      "Operations that have hit the limits of no-code automation",
    ],
    problems: [
      {
        title: "Copy and paste is part of the process",
        body: "Manual transfer between systems is slow and unreliable, and the errors it produces usually surface somewhere expensive and far away.",
      },
      {
        title: "Handoffs depend on someone remembering",
        body: "Processes that rely on a person noticing something has happened fail predictably during busy periods and holidays.",
      },
      {
        title: "Automations exist but nobody trusts them",
        body: "Automation without error handling, retries and alerting fails silently. The first sign is usually a customer complaint.",
      },
      {
        title: "The no-code setup has outgrown itself",
        body: "Visual tools are excellent up to a point. Past it, cost, brittleness and lack of version control make a proper integration cheaper.",
      },
    ],
    capabilities: [
      {
        title: "Process automation",
        body: "Multi-step workflows with conditional logic, approvals and notifications, replacing sequences that currently rely on people prompting each other.",
      },
      {
        title: "API integrations",
        body: "Reliable connections between systems, including the parts that are usually skipped: authentication refresh, rate limits, retries and idempotency.",
      },
      {
        title: "CRM integration",
        body: "Leads, activity and customer data flowing into your CRM with source and campaign attached, correctly assigned and deduplicated.",
      },
      {
        title: "Marketing automation",
        body: "Triggered campaigns and lifecycle messaging driven by real behaviour rather than by manual list management.",
      },
      {
        title: "Data synchronisation",
        body: "Keeping records consistent across systems, with an explicit decision about which system owns each field.",
      },
      {
        title: "Notifications and alerting",
        body: "The right person told at the right moment, through the channel they actually watch.",
      },
      {
        title: "Custom middleware",
        body: "Where systems genuinely cannot talk to each other, a small dedicated service that translates between them and is monitored like production software.",
      },
      {
        title: "Monitoring and error handling",
        body: "Retries, dead-letter handling and alerts, so a failed integration is something you are told about rather than something you discover.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map",
        body: "Documenting the current process, the systems involved and where the time actually goes.",
      },
      {
        step: "02",
        title: "Prioritise",
        body: "Ranking automations by hours saved and error risk removed, then starting with the highest-value one.",
      },
      {
        step: "03",
        title: "Design",
        body: "Data flow, ownership of each field, failure modes and escalation paths agreed before building.",
      },
      {
        step: "04",
        title: "Build",
        body: "Integrations implemented with proper error handling, tested against real edge cases rather than the happy path.",
      },
      {
        step: "05",
        title: "Monitor",
        body: "Logging, alerting and a dashboard showing that the automation is running and healthy.",
      },
    ],
    deliverables: [
      "Process map and automation opportunity list",
      "Integration architecture and field ownership",
      "Built and tested integrations",
      "Error handling, retries and alerting",
      "Monitoring dashboard",
      "Documentation and handover",
    ],
    technologies: [
      "openai",
      "anthropic",
      "langchain",
      "n8n",
      "typescript",
      "nodejs",
      "python",
      "postgresql",
      "redis",
      "aws",
      "docker",
    ],
    engagement: ["project", "dedicated-team", "maintenance"],
    faqs: [
      {
        question: "Can you use tools like Zapier or Make instead of building?",
        answer:
          "Often yes, and we will recommend it when it fits — it is faster and cheaper to run. Custom integration becomes worthwhile at higher volumes, where the logic is complex, or where reliability and error handling genuinely matter.",
      },
      {
        question: "What if a system has no API?",
        answer:
          "There are usually options: scheduled file exchange, database access, or a vendor integration partner. If none exist, we will tell you the honest cost of the workarounds rather than promise something fragile.",
      },
      {
        question: "How do you handle failures?",
        answer:
          "Every integration is built with retries, a dead-letter queue for anything that cannot be processed, and alerting to a channel you monitor. Silent failure is the specific outcome we design against.",
      },
    ],
    related: [
      "custom-software-development",
      "cloud-solutions",
      "lead-generation",
      "web-application-development",
      "maintenance-support",
    ],
    ctaLabel: "Map My Automations",
  },

  {
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    title: "Infrastructure you can reason about at two in the morning.",
    group: "technology",
    visual: "cloud",
    eyebrow: "Cloud Solutions",
    lede: "Good infrastructure is unremarkable: deploys are boring, environments match, backups are tested, and when something breaks the logs say what happened. That is the standard we build to.",
    summary:
      "Cloud architecture, deployment pipelines, monitoring and cost control.",
    metaTitle: "Cloud Solutions & DevOps Services | The Digital Alchemy",
    metaDescription:
      "Cloud architecture and deployment — environment setup, CI/CD pipelines, containerisation, monitoring, backups, security hardening and infrastructure cost optimisation.",
    whoFor: [
      "Teams deploying manually and dreading every release",
      "Businesses with no tested backup or recovery plan",
      "Companies whose cloud bill has grown without anyone knowing why",
      "Products whose traffic has outgrown their original hosting",
    ],
    problems: [
      {
        title: "Deployment is a manual ritual",
        body: "Releases that depend on one person following steps from memory are slow, risky and a single point of failure.",
      },
      {
        title: "Environments do not match",
        body: "Bugs that appear only in production usually mean staging is not a faithful copy. Containerisation and infrastructure as code close that gap.",
      },
      {
        title: "Backups exist but have never been restored",
        body: "An untested backup is a hypothesis. Restore drills are the only way to know recovery actually works.",
      },
      {
        title: "The bill grows and nobody can explain it",
        body: "Idle resources, oversized instances and forgotten environments accumulate quietly. Tagging and review usually recover a meaningful share.",
      },
    ],
    capabilities: [
      {
        title: "Cloud architecture",
        body: "Infrastructure designed for your actual traffic and budget, not for a scale you do not have yet.",
      },
      {
        title: "Deployment pipelines",
        body: "Automated build, test and deploy on merge, with staging environments and a straightforward rollback path.",
      },
      {
        title: "Containerisation",
        body: "Consistent environments from a developer laptop through to production, removing an entire class of environment-specific bugs.",
      },
      {
        title: "Infrastructure as code",
        body: "Environments defined in version-controlled configuration so they are reproducible and reviewable.",
      },
      {
        title: "Monitoring and observability",
        body: "Uptime checks, error tracking, performance monitoring and log aggregation, with alerts that mean something.",
      },
      {
        title: "Backup and recovery",
        body: "Automated backups with a documented recovery procedure that has been tested rather than assumed.",
      },
      {
        title: "Security hardening",
        body: "Network configuration, least-privilege access, secret management, patching and dependency monitoring.",
      },
      {
        title: "Cost optimisation",
        body: "Right-sizing, scheduling non-production environments and removing what nothing uses.",
      },
      {
        title: "Migration",
        body: "Moving from existing hosting with a planned cutover and a rollback plan.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "Current infrastructure, deployment process, costs and risks assessed and documented.",
      },
      {
        step: "02",
        title: "Design",
        body: "Target architecture with the trade-offs between cost, complexity and resilience made explicit.",
      },
      {
        step: "03",
        title: "Implement",
        body: "Environments, pipelines and monitoring built incrementally, without interrupting the running service.",
      },
      {
        step: "04",
        title: "Migrate",
        body: "Where a move is needed, a staged cutover with verification at each step and a documented rollback.",
      },
      {
        step: "05",
        title: "Operate",
        body: "Runbooks, alerting and either handover to your team or an ongoing support arrangement.",
      },
    ],
    deliverables: [
      "Infrastructure review with risks and costs",
      "Target architecture documentation",
      "Automated deployment pipeline",
      "Staging and production environments",
      "Monitoring, alerting and log aggregation",
      "Tested backup and recovery procedure",
      "Operational runbooks",
    ],
    technologies: ["aws", "vercel", "docker", "postgresql", "redis", "sentry"],
    engagement: ["project", "maintenance", "dedicated-team"],
    faqs: [
      {
        question: "Which cloud provider should we use?",
        answer:
          "For most applications it matters less than people expect. We weigh what your team already knows, what your architecture needs, and cost at your actual scale. Managed platforms often beat raw cloud infrastructure for smaller teams because there is far less to operate.",
      },
      {
        question: "Can you reduce our hosting costs?",
        answer:
          "Usually, yes. The common wins are oversized instances, environments nobody uses any more, unattached storage and untiered backups. We review before proposing anything, and we will tell you if your setup is already reasonable.",
      },
      {
        question: "Do we need Kubernetes?",
        answer:
          "Most businesses do not. It solves problems of scale and team structure that arrive later than people assume, and it adds significant operational overhead. We recommend it only when the requirement genuinely calls for it.",
      },
      {
        question: "Can you take over infrastructure someone else built?",
        answer:
          "Yes. We start with an audit and documentation, because undocumented infrastructure is the actual risk. From there we stabilise first and improve second.",
      },
    ],
    related: [
      "saas-development",
      "custom-software-development",
      "maintenance-support",
      "web-application-development",
      "automation-integrations",
    ],
    ctaLabel: "Review My Infrastructure",
  },

  {
    slug: "maintenance-support",
    name: "Maintenance & Support",
    title: "Software gets worse if you leave it alone.",
    group: "technology",
    visual: "support",
    eyebrow: "Maintenance & Support",
    lede: "Dependencies age, platforms change their rules, certificates expire and traffic patterns shift. Ongoing maintenance is not an upsell — it is the difference between software that lasts and software that quietly rots.",
    summary:
      "Updates, monitoring, security patching, backups and a defined route for changes.",
    metaTitle: "Website & Application Maintenance and Support | The Digital Alchemy",
    metaDescription:
      "Ongoing maintenance and support for websites and applications — security updates, dependency management, monitoring, backups, performance work and a clear route for changes.",
    whoFor: [
      "Businesses whose site or application has had no attention since launch",
      "Companies whose original developer is no longer available",
      "Teams without anyone responsible when something breaks",
      "Products with a growing backlog of small changes nobody owns",
    ],
    problems: [
      {
        title: "Nobody is responsible when it breaks",
        body: "Without a named owner and an agreed response time, outages are resolved by whoever happens to notice, if anyone does.",
      },
      {
        title: "Dependencies are years out of date",
        body: "Deferred updates compound. What would have been routine becomes a large, risky project — and often a security exposure in the meantime.",
      },
      {
        title: "Small changes never get made",
        body: "Without a lightweight route for minor work, a backlog of half-hour tasks accumulates until the site visibly falls behind the business.",
      },
      {
        title: "Problems are found by customers",
        body: "Absent monitoring, the first report of an outage is usually a complaint. Uptime and error alerting change that entirely.",
      },
    ],
    capabilities: [
      {
        title: "Security updates",
        body: "Dependency and platform patching on a regular cycle, with urgent vulnerabilities handled out of cycle.",
      },
      {
        title: "Monitoring and alerting",
        body: "Uptime checks, error tracking and performance monitoring, with alerts routed to someone who will act on them.",
      },
      {
        title: "Backups and recovery",
        body: "Automated backups with periodic restore tests, because a backup that has never been restored is not yet a backup.",
      },
      {
        title: "Bug fixes",
        body: "Defects triaged by severity and resolved within agreed response times.",
      },
      {
        title: "Content and minor changes",
        body: "An allocation of hours each month for the small updates that otherwise never happen.",
      },
      {
        title: "Performance maintenance",
        body: "Periodic review of speed and Core Web Vitals, since performance degrades gradually as content and scripts accumulate.",
      },
      {
        title: "Platform compatibility",
        body: "Keeping pace with browser, OS and platform changes before they break something.",
      },
      {
        title: "Reporting",
        body: "A monthly summary of what was done, what was found and what is worth planning for next.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Onboard",
        body: "Audit of the current state, access handover and documentation of how everything is actually set up.",
      },
      {
        step: "02",
        title: "Stabilise",
        body: "Urgent security and reliability issues resolved first, before anything else is scheduled.",
      },
      {
        step: "03",
        title: "Establish",
        body: "Monitoring, backups and an update cycle put in place, with response times agreed in writing.",
      },
      {
        step: "04",
        title: "Maintain",
        body: "Regular patching, monitoring and the agreed monthly allocation for changes.",
      },
      {
        step: "05",
        title: "Review",
        body: "Monthly reporting and a periodic conversation about what should be improved next.",
      },
    ],
    deliverables: [
      "Onboarding audit and documentation",
      "Monitoring, alerting and backup configuration",
      "Regular security and dependency updates",
      "Agreed response times by severity",
      "Monthly allocation for changes",
      "Monthly maintenance report",
    ],
    technologies: ["sentry", "aws", "vercel", "wordpress", "docker"],
    engagement: ["maintenance", "growth-retainer"],
    faqs: [
      {
        question: "Can you maintain something you did not build?",
        answer:
          "Yes, and it is a large part of this work. We begin with an audit and documentation phase, because the first risk in inherited software is that nobody knows how it is put together.",
      },
      {
        question: "What response times do you offer?",
        answer:
          "They are agreed per client and set by severity — a site that is down is not the same as a display issue on one page. We write those definitions and target times into the arrangement so expectations are explicit on both sides.",
      },
      {
        question: "What is included versus billed separately?",
        answer:
          "Updates, monitoring, backups, security patching and a defined allocation of change hours are included. Larger new features are quoted separately, and we will tell you which side of the line a request falls on before starting it.",
      },
      {
        question: "Is maintenance really necessary?",
        answer:
          "For anything holding customer data or taking payments, yes. For a small static site the requirement is lighter, but not zero — platforms change and certificates still expire. We will scope honestly rather than sell a retainer you do not need.",
      },
    ],
    related: [
      "cloud-solutions",
      "web-development",
      "custom-software-development",
      "saas-development",
      "automation-integrations",
    ],
    ctaLabel: "Discuss Ongoing Support",
  },
];
