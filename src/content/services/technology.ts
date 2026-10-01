import type { Service } from "./types";

/*
 * Written for a small-business owner, not an engineer. See
 * docs/plain-language-glossary.md for the words we use and the ones we don't.
 */
export const technologyServices: Service[] = [
  {
    slug: "automation-integrations",
    name: "AI Automation & Integrations",
    title: "AI automation that does your repetitive work for you.",
    group: "automation",
    oneLiner: "Let software do your repetitive work automatically, and connect your apps.",
    needItWhen: "your team spends hours on repetitive work or copying between apps.",
    example: {
      business: "A travel agency",
      before: "Every website enquiry is copied into a spreadsheet by hand, and someone replies on WhatsApp when they get time.",
      after: "Each enquiry is added to the customer list and answered on WhatsApp automatically, and a person is alerted to follow up.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "automation",
    featured: true,
    eyebrow: "AI Automation & Integrations",
    lede: "For businesses where people spend hours copying information between apps, replying to the same questions, or chasing the next step. We set up tools, including AI assistants, that do this work automatically, like replying to enquiries, sending invoices and updating your records.",
    summary: "Tools that do repetitive work automatically, and apps connected so they share information.",
    metaTitle: "AI Automation Agency in India | The Digital Alchemy",
    metaDescription:
      "AI tools that do your repetitive work: replying to enquiries, sending invoices, updating records and connecting your apps. Get a free consultation.",
    whoFor: [
      "Your team types the same information into more than one app",
      "Each of your apps holds a different version of the same customer",
      "Work stops because someone has to remember to do the next step",
      "You use tools like Zapier, but they have become slow, costly or unreliable",
    ],
    problems: [
      {
        title: "Copy and paste is part of the job",
        body: "Moving information between apps by hand is slow, and the mistakes it causes usually show up somewhere expensive, much later.",
      },
      {
        title: "The next step depends on someone remembering",
        body: "Work that relies on a person noticing something happened breaks down in busy weeks and during holidays.",
      },
      {
        title: "You have automations, but nobody trusts them",
        body: "Automations with no alerts fail without anyone knowing. The first sign is usually an unhappy customer.",
      },
      {
        title: "Your no-code tools have been outgrown",
        body: "Drag-and-drop tools are excellent up to a point. Past it, the cost and the breakages make a proper connection cheaper.",
      },
    ],
    capabilities: [
      {
        title: "Automatic step-by-step processes",
        body: "Tasks with several steps, approvals and alerts that run on their own, instead of people reminding each other.",
      },
      {
        title: "AI assistants",
        body: "AI that reads, sorts and replies: answering common enquiries, pulling details out of documents, or drafting replies for your team to check.",
      },
      {
        title: "Connecting your apps",
        body: "Your apps linked so they share information automatically, including the tricky parts, like expired logins and retrying safely without doing a task twice.",
      },
      {
        title: "Enquiries into your customer list",
        body: "Every enquiry added to the app where you keep your customers, with where it came from, given to the right person, and never duplicated.",
      },
      {
        title: "Alerts to the right person",
        body: "The right person told at the right moment, on the app they actually check, like WhatsApp or email.",
      },
      {
        title: "Nothing fails silently",
        body: "If a step fails, nothing is lost: it is kept and retried, and someone is told at once. A simple dashboard shows everything is running.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map",
        body: "We write down how the work is done today, which apps are involved, and where the time really goes.",
      },
      {
        step: "02",
        title: "Choose what to automate first",
        body: "Tasks ranked by hours saved and mistakes avoided. We start with the one worth the most.",
      },
      {
        step: "03",
        title: "Build and test",
        body: "What happens when something goes wrong is agreed before building. Then we build it and test it with real, messy cases, not just the easy ones.",
      },
      {
        step: "04",
        title: "Watch it run",
        body: "Records, alerts and a simple dashboard show the automation is working, every day.",
      },
    ],
    deliverables: [
      "A map of your work, and a list of what to automate",
      "A plan of which app holds which information",
      "Built and tested automations",
      "Alerts, and safe retries when a step fails",
      "A dashboard showing everything is running",
      "Guides and handover",
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
        question: "Can we use tools like Zapier or Make instead?",
        answer:
          "Often yes, and we will suggest it when it fits: it is faster to set up and cheaper to run. Building a custom connection becomes worth it when there is a lot of work to handle, the rules are complicated, or failures would really hurt.",
      },
      {
        question: "What if one of our apps cannot connect to anything?",
        answer:
          "There are usually options, like exchanging files on a schedule. If there are none, we will tell you the honest cost of working around it, rather than promise something that breaks.",
      },
      {
        question: "What happens when something fails?",
        answer:
          "Every automation retries safely when a step fails, keeps anything it cannot finish instead of losing it, and alerts someone on a channel you check. Failing without anyone knowing is exactly what we build against.",
      },
      {
        question: "Will AI make mistakes with our customers?",
        answer:
          "It can, so we decide carefully where it acts alone and where a person checks first. For anything that matters, AI drafts and your team approves.",
      },
      {
        question: "Do I need to be technical?",
        answer:
          "No. You tell us where your team loses time. We handle the technical side and show you, in plain words, what each automation does.",
      },
    ],
    related: ["custom-software-development", "lead-generation", "maintenance-support"],
  },

  {
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    title: "Cloud hosting that keeps your website or app fast, safe and online.",
    group: "running",
    oneLiner: "Hosting and servers that keep your website/app fast, safe and online.",
    needItWhen: "your site is slow, goes down, or costs too much to host.",
    example: {
      business: "An online clothing store",
      before: "The site slows down or crashes during festive sales, and the hosting bill keeps going up.",
      after: "Hosting sized for sale days, tested backups and alerts, and the servers nobody was using switched off.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "cloud",
    eyebrow: "Cloud Solutions",
    lede: "For businesses whose website or app is slow, goes down, or costs more to host every month without anyone knowing why. We set up where it lives online so updates are safe, backups actually work, and problems are spotted before your customers notice.",
    summary: "Hosting set up properly: safe updates, tested backups, alerts, and a sensible monthly bill.",
    metaTitle: "Cloud Hosting Services Company | The Digital Alchemy",
    metaDescription:
      "Hosting that keeps your website or app fast, safe and online, with safe updates, tested backups and a sensible bill. Get a free consultation.",
    whoFor: [
      "Every update to your site or app is done by hand, and everyone dreads it",
      "You have no backup that you know for sure can be restored",
      "Your hosting bill keeps growing, and nobody can explain why",
      "Your site slows down or crashes when more people visit",
    ],
    problems: [
      {
        title: "Updates are done by hand",
        body: "When putting changes live depends on one person following steps from memory, it is slow, risky, and stops when that person is away.",
      },
      {
        title: "It works on the test copy but breaks when live",
        body: "That usually means the test copy is not the same as the real one. Setting both up the same way ends this.",
      },
      {
        title: "Backups have never been tested",
        body: "A backup that has never been restored is only a hope. Practising a restore is the only way to know it works.",
      },
      {
        title: "The bill grows, and nobody can explain it",
        body: "Unused servers, ones bigger than needed, and forgotten test copies add up quietly. A careful review usually saves a good share.",
      },
    ],
    capabilities: [
      {
        title: "Hosting planned for you",
        body: "Set up for the visitors and budget you actually have, not for a size you have not reached yet.",
      },
      {
        title: "Safe, automatic updates",
        body: "Changes checked and put live automatically, with a test copy first and an easy way back if something goes wrong.",
      },
      {
        title: "Test and live copies that match",
        body: "Everything set up the same way in every copy, and written down, so it can be rebuilt exactly if needed.",
      },
      {
        title: "Alerts before customers notice",
        body: "Checks that your site is up, error alerts, speed tracking and records of what happened, with alerts that mean something.",
      },
      {
        title: "Backups and security",
        body: "Automatic backups with a restore plan that has been tested, plus locked-down access, security updates and safely stored passwords.",
      },
      {
        title: "Lower bills and safe moves",
        body: "Servers sized properly and unused ones removed, and moving from your current hosting with a plan and a way back.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "Your current hosting, how updates are done, what it costs and what could go wrong, written down.",
      },
      {
        step: "02",
        title: "Plan",
        body: "A proposed setup, with the trade-offs between cost, simplicity and reliability made clear.",
      },
      {
        step: "03",
        title: "Set up and move",
        body: "Built step by step without interrupting your live site. If a move is needed, it happens in stages, checked at each one, with a way back.",
      },
      {
        step: "04",
        title: "Run and hand over",
        body: "Step-by-step guides and alerts, then either handover to your team or ongoing support from us.",
      },
    ],
    deliverables: [
      "A review of your hosting, its risks and costs",
      "A written plan for the new setup",
      "Safe, automatic updates",
      "Test and live copies that match",
      "Alerts, error tracking and records",
      "Tested backups and step-by-step guides",
    ],
    technologies: ["aws", "vercel", "docker", "postgresql", "redis", "sentry"],
    engagement: ["project", "maintenance", "dedicated-team"],
    faqs: [
      {
        question: "Which hosting provider should we use?",
        answer:
          "For most sites and apps, it matters less than people think. We look at what your team already knows, what your software needs, and the cost at your actual size. For smaller teams, simpler managed hosting often beats the big cloud platforms, because there is far less to look after.",
      },
      {
        question: "Can you lower our hosting bill?",
        answer:
          "Usually, yes. The common savings are servers bigger than needed, copies nobody uses any more, and storage left behind. We review before suggesting anything, and we will tell you if your setup is already reasonable.",
      },
      {
        question: "Do we need a complicated setup like Kubernetes?",
        answer:
          "Most businesses do not. It solves problems of very large size that arrive much later than people expect, and it adds a lot of work to run. We only suggest it when you genuinely need it.",
      },
      {
        question: "Can you take over hosting someone else set up?",
        answer:
          "Yes. We start by checking and writing down how it is set up, because hosting nobody understands is the real risk. Then we make it stable first, and improve it second.",
      },
    ],
    related: ["maintenance-support", "saas-development", "web-application-development"],
  },

  {
    slug: "maintenance-support",
    name: "Maintenance & Support",
    title: "Website maintenance that keeps your site or app updated, safe and working.",
    group: "running",
    oneLiner: "We keep your website or app updated, secure and fixed when something breaks.",
    needItWhen: "your site or app needs someone to keep it updated and fixed.",
    example: {
      business: "A school website built three years ago",
      before: "Nobody has updated it since launch. The contact form stopped working months ago, and nobody noticed.",
      after: "Regular updates, a monthly check, and an alert the moment something like the contact form breaks.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "support",
    eyebrow: "Maintenance & Support",
    lede: "Software gets worse if you leave it alone: add-ons go out of date, platforms change their rules, and security certificates expire. We keep your website or app updated, watch it for problems, and fix things when they break.",
    summary: "Updates, security fixes, backups, and someone to call when something breaks.",
    metaTitle: "Website Maintenance Services | The Digital Alchemy",
    metaDescription:
      "We keep your website or app updated, secure and backed up, and fix it when something breaks, with agreed response times. Get a free consultation.",
    whoFor: [
      "Nobody has touched your site or app since it launched",
      "The developer who built it is no longer around",
      "Nobody is responsible when something breaks",
      "Small changes pile up and never get made",
    ],
    problems: [
      {
        title: "Nobody is responsible when it breaks",
        body: "Without a named person and an agreed response time, problems get fixed by whoever happens to notice, if anyone does.",
      },
      {
        title: "Everything is years out of date",
        body: "Skipped updates pile up. What would have been routine becomes a big, risky job, and often a security gap in the meantime.",
      },
      {
        title: "Small changes never happen",
        body: "Without an easy way to ask for small updates, half-hour jobs pile up until the site no longer matches your business.",
      },
      {
        title: "Customers find the problems first",
        body: "Without monitoring, the first sign your site is down is usually a complaint. Alerts change that completely.",
      },
    ],
    capabilities: [
      {
        title: "Security updates",
        body: "Regular updates to your site, its add-ons and its platform, with urgent security fixes done straight away.",
      },
      {
        title: "Monitoring and alerts",
        body: "Checks that your site is up, error tracking and speed checks, with alerts sent to someone who will act on them.",
      },
      {
        title: "Backups that work",
        body: "Automatic backups, with restores tested now and then, because a backup that has never been restored is not really a backup.",
      },
      {
        title: "Bug fixes",
        body: "Problems sorted by how serious they are, and fixed within agreed response times.",
      },
      {
        title: "Small changes every month",
        body: "A set number of hours each month for the small updates that otherwise never happen.",
      },
      {
        title: "Staying fast and up to date",
        body: "Regular speed checks, and keeping up with new browser and phone updates before they break something, plus a monthly summary of what was done.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Get to know your setup",
        body: "We check where things stand, take over access, and write down how everything is actually set up.",
      },
      {
        step: "02",
        title: "Fix urgent problems",
        body: "Urgent security and reliability problems fixed first, before anything else.",
      },
      {
        step: "03",
        title: "Set up the basics",
        body: "Monitoring, backups and a regular update schedule put in place, with response times agreed in writing.",
      },
      {
        step: "04",
        title: "Look after it every month",
        body: "Regular updates, monitoring, your monthly hours for changes, and a monthly report with what is worth improving next.",
      },
    ],
    deliverables: [
      "A check of your site, and notes on how it is set up",
      "Monitoring, alerts and backups set up",
      "Regular security and software updates",
      "Agreed response times, by how serious the problem is",
      "Monthly hours for small changes",
      "A monthly report",
    ],
    technologies: ["sentry", "aws", "vercel", "wordpress", "docker"],
    engagement: ["maintenance", "growth-retainer"],
    faqs: [
      {
        question: "Can you look after something you did not build?",
        answer:
          "Yes, and it is a big part of this work. We start by checking and writing down how it is set up, because the first risk with inherited software is that nobody knows how it fits together.",
      },
      {
        question: "How fast do you respond?",
        answer:
          "It is agreed with each client, and depends on how serious the problem is: a site that is down is not the same as a small display issue on one page. We write the response times into our agreement, so both sides know what to expect.",
      },
      {
        question: "What is included, and what costs extra?",
        answer:
          "Updates, monitoring, backups, security fixes and a set number of hours for changes are included. Bigger new features are priced separately, and we tell you which side of the line a request falls on before we start.",
      },
      {
        question: "Is maintenance really necessary?",
        answer:
          "For anything that holds customer data or takes payments, yes. For a small, simple website, less is needed, but not nothing: platforms change and security certificates still expire. We will suggest only what you need.",
      },
    ],
    related: ["cloud-solutions", "web-development", "custom-software-development"],
  },
];
