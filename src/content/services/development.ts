import type { Service } from "./types";

export const developmentServices: Service[] = [
  {
    slug: "saas-development",
    name: "AI-Ready SaaS Development",
    title: "From AI-ready SaaS idea to a product customers pay for.",
    group: "development",
    visual: "saas",
    featured: true,
    eyebrow: "AI-Ready SaaS Development",
    lede: "We architect modern, AI-ready SaaS platforms from a first sketch to a scalable, billable product — with autonomous workflows, multi-tenant security, custom LLM integrations, and compound growth analytics built in from the start.",
    summary:
      "AI-native multi-tenant platforms with autonomous workflows, subscription billing, and enterprise analytics from day one.",
    metaTitle: "AI-Ready SaaS Product Development Services | The Digital Alchemy",
    metaDescription:
      "Modern AI-ready SaaS development — multi-tenant architecture, AI agent integrations, subscription billing, authentication, and cloud deployment.",
    whoFor: [
      "Founders validating a first version and needing it in front of paying users quickly",
      "Operating businesses turning an internal tool into a product they can sell",
      "Teams with a live SaaS that has outgrown its original architecture",
      "Companies replacing a spreadsheet-and-email workflow their customers currently tolerate",
    ],
    problems: [
      {
        title: "The MVP keeps growing before it ships",
        body: "Scope creep is the usual reason a first release slips by six months. We fix the release boundary early — what a customer must be able to do to pay you — and everything else becomes version two.",
      },
      {
        title: "Onboarding loses people before they see value",
        body: "Most SaaS churn happens in week one. We design the path from signup to first useful outcome as a deliberate sequence, not as whatever screens happen to exist.",
      },
      {
        title: "Billing was bolted on afterwards",
        body: "Plans, trials, upgrades, proration and failed payments touch almost every part of a product. Retrofitting them is expensive, so we model subscription state as part of the core data design.",
      },
      {
        title: "Nobody can answer basic questions about usage",
        body: "Without event tracking wired in from the start, you cannot tell an activation problem from a pricing problem. We instrument the product before launch, not after the first bad month.",
      },
    ],
    capabilities: [
      {
        title: "Product strategy and scope",
        body: "We turn a broad idea into a defined first release: the jobs the product does, the users it does them for, and the smallest coherent version that is genuinely worth paying for.",
      },
      {
        title: "Multi-tenant architecture",
        body: "Tenant isolation, roles and permissions decided at the schema level. Getting this right on day one is what makes enterprise customers possible later without a rewrite.",
      },
      {
        title: "Authentication and access control",
        body: "Email and social sign-in, invitations, team accounts, role-based permissions, session security and audit trails — with authorisation enforced on the server, never in the interface alone.",
      },
      {
        title: "Subscription billing",
        body: "Plans, trials, metered usage, upgrades and downgrades, dunning for failed payments, invoices and tax handling, integrated with a payment provider you control the account for.",
      },
      {
        title: "Application interface and design system",
        body: "A component library, empty states, loading states and error states designed as first-class screens, so the product feels finished rather than assembled.",
      },
      {
        title: "Reporting and dashboards",
        body: "The views your customers need to justify the subscription internally, plus the internal analytics you need to understand activation, retention and expansion.",
      },
      {
        title: "APIs and integrations",
        body: "A documented public API, webhooks, and connections into the tools your customers already run, so your product fits their stack instead of asking them to abandon it.",
      },
      {
        title: "Cloud deployment and observability",
        body: "Environments, automated deploys, backups, logging, error tracking and uptime monitoring, handed over with the runbook needed to operate it.",
      },
      {
        title: "Security and data handling",
        body: "Input validation, rate limiting, encrypted secrets, least-privilege access, dependency monitoring and a considered position on where customer data lives.",
      },
      {
        title: "Scaling and maintenance",
        body: "Performance work driven by measurement rather than guesswork, plus a maintenance arrangement so the product keeps getting attention after launch.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery",
        body: "Sessions with you and, where possible, your prospective users. We map the workflow the product replaces and agree what the first release must do.",
      },
      {
        step: "02",
        title: "Definition",
        body: "Scope, data model, architecture and a build plan with sequencing. You get a written specification you can take to any team, not just ours.",
      },
      {
        step: "03",
        title: "Design",
        body: "Key flows prototyped and reviewed before engineering starts. Changing a prototype costs hours; changing a shipped feature costs weeks.",
      },
      {
        step: "04",
        title: "Build",
        body: "Short iterations against a staging environment you can log into throughout. Progress is something you use, not something you read about.",
      },
      {
        step: "05",
        title: "Launch",
        body: "Production environment, billing live, monitoring on, analytics verified, and a support path for the first weeks of real usage.",
      },
      {
        step: "06",
        title: "Iterate",
        body: "Usage data and customer conversations drive the next cycle. This is where most of a product's value actually gets created.",
      },
    ],
    deliverables: [
      "Written product specification and data model",
      "Interactive prototype of core flows",
      "Production application with staging environment",
      "Subscription billing configured against your payment account",
      "Admin tooling for your own team",
      "API documentation and webhooks where in scope",
      "Deployment pipeline, backups and monitoring",
      "Handover documentation and code ownership",
    ],
    technologies: [
      "openai",
      "pinecone",
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "postgresql",
      "prisma",
      "tailwind",
      "stripe",
      "aws",
      "vercel",
      "docker",
      "sentry",
    ],
    engagement: ["project", "product-partnership", "dedicated-team"],
    faqs: [
      {
        question: "How much does SaaS development cost?",
        answer:
          "It depends almost entirely on scope, and any figure quoted before a scoping conversation is a guess. What we can tell you is how the cost is driven: the number of distinct user roles, whether you need billing and multi-tenancy from day one, how many external systems you integrate with, and how much design work is bespoke. We scope in stages so you can see a costed plan before committing to a full build.",
      },
      {
        question: "How long does an MVP take?",
        answer:
          "A focused first release is typically measured in months rather than weeks, and the biggest variable is decision speed on your side rather than engineering time. We sequence the work so that something is usable early and grows, rather than everything arriving at once at the end.",
      },
      {
        question: "Can you improve an existing SaaS product?",
        answer:
          "Yes. That is a common starting point. We begin with a review of the codebase, architecture and analytics, then propose work in priority order — usually a mix of specific fixes and a longer structural track. We will tell you honestly if a rewrite is genuinely warranted, which is rarer than people expect.",
      },
      {
        question: "Do you handle the UI and UX as well as engineering?",
        answer:
          "Yes, and we prefer to. Design and engineering working in the same team is what stops the two drifting apart, and it removes the handover overhead that slows most product builds.",
      },
      {
        question: "Can you build subscription billing?",
        answer:
          "Yes — plans, trials, upgrades, proration, failed-payment handling and invoicing. The payment provider account stays in your name, so you own the customer and payout relationship outright.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. Code, repositories, infrastructure accounts and design files are yours, and we hand over access as part of delivery rather than holding it as leverage.",
      },
      {
        question: "Do you provide support after launch?",
        answer:
          "Yes, through a maintenance or product-partnership arrangement. Software that ships and is then left alone degrades quickly, so we would rather agree what ongoing attention looks like before launch than improvise it afterwards.",
      },
      {
        question: "Can you work with companies outside India?",
        answer:
          "Yes. We are based in New Delhi and work remotely with clients in other markets. We agree a communication rhythm and an overlap window at the start of the engagement so that reviews and decisions do not stall.",
      },
    ],
    related: [
      "product-design",
      "web-application-development",
      "ui-ux-design",
      "cloud-solutions",
      "custom-software-development",
    ],
    ctaLabel: "Scope My SaaS Product",
  },

  {
    slug: "custom-software-development",
    name: "Custom Software",
    title: "Software built around how your business actually works.",
    group: "development",
    visual: "software",
    eyebrow: "Custom Software Development",
    lede: "When off-the-shelf software forces your team to work around it, the workarounds become the process. We build systems that fit the operation instead — and that your team will actually use.",
    summary:
      "Internal platforms, ERP and CRM systems, operations tooling and business automation.",
    metaTitle: "Custom Software Development Services | The Digital Alchemy",
    metaDescription:
      "Custom software for operations, internal tools, ERP, CRM and workflow systems — discovery, architecture, engineering and long-term support.",
    whoFor: [
      "Operations teams running critical processes in spreadsheets and shared inboxes",
      "Businesses paying for software that only covers half of what they do",
      "Companies with a legacy system nobody wants to touch but everyone depends on",
      "Teams whose data lives in four tools that do not talk to each other",
    ],
    problems: [
      {
        title: "The process lives in people's heads",
        body: "When the operation depends on who is in the office, growth is capped and holidays are risky. Encoding the process into software makes it repeatable and visible.",
      },
      {
        title: "Reporting takes a person two days a month",
        body: "Manual consolidation is both expensive and unreliable. If the underlying data is captured properly, the report is a query rather than a project.",
      },
      {
        title: "The system works but nobody can change it",
        body: "Legacy software usually fails on maintainability long before it fails on function. We modernise incrementally where we can, so the business keeps running during the work.",
      },
      {
        title: "Every tool holds a different version of the truth",
        body: "Integration is not glamorous, but a single reliable record of customers, orders or stock removes an entire category of daily argument.",
      },
    ],
    capabilities: [
      {
        title: "Discovery and process mapping",
        body: "We sit with the people doing the work and map what actually happens, including the exceptions. The exceptions are usually where the value is.",
      },
      {
        title: "Solution architecture",
        body: "Data model, system boundaries, integration points and a build sequence, documented well enough that another team could pick it up.",
      },
      {
        title: "Internal tools and operations platforms",
        body: "The screens your team lives in all day: queues, approvals, bulk actions, search that works, and keyboard-first interactions for high-volume tasks.",
      },
      {
        title: "ERP and CRM systems",
        body: "Custom-built where the standard products genuinely do not fit, or extended and integrated where they do. We will say which situation you are in.",
      },
      {
        title: "Workflow and approval systems",
        body: "Multi-step processes with roles, states, notifications and a complete audit trail of who did what and when.",
      },
      {
        title: "Dashboards and data platforms",
        body: "Operational reporting built on the live data, with the definitions of each metric agreed and written down so numbers stop being disputed.",
      },
      {
        title: "API and integration layers",
        body: "Connecting the systems you already run — accounting, logistics, payments, marketing — so records move automatically rather than by copy and paste.",
      },
      {
        title: "Legacy modernisation",
        body: "Incremental replacement, usually strangling the old system module by module rather than attempting a single high-risk cutover.",
      },
      {
        title: "Testing and quality assurance",
        body: "Automated tests around the logic that would hurt most if it broke, plus structured user acceptance testing with your team before rollout.",
      },
      {
        title: "Rollout and training",
        body: "Phased release, documentation written for the people using it, and a support window while the new way of working beds in.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "Interviews and observation with the teams involved. We document the current process, its cost and its failure points before proposing anything.",
      },
      {
        step: "02",
        title: "Architect",
        body: "A solution design with options and trade-offs made explicit, so you are choosing between approaches rather than approving a black box.",
      },
      {
        step: "03",
        title: "Design",
        body: "Interface design for the highest-volume screens first. Software people use for six hours a day deserves more care than software they see once a quarter.",
      },
      {
        step: "04",
        title: "Build",
        body: "Delivered in modules, each usable on its own, so value arrives during the project rather than only at the end.",
      },
      {
        step: "05",
        title: "Deploy",
        body: "Migration of existing data, parallel running where the risk warrants it, then a controlled cutover with a rollback plan.",
      },
      {
        step: "06",
        title: "Support",
        body: "Ongoing maintenance, a route for change requests, and a roadmap for the next set of improvements.",
      },
    ],
    deliverables: [
      "Process map and requirements documentation",
      "Solution architecture and data model",
      "Working software delivered in modules",
      "Data migration from existing systems",
      "Integrations with your current tools",
      "Role-based access and audit logging",
      "User documentation and training sessions",
      "Support arrangement and change process",
    ],
    technologies: [
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "python",
      "postgresql",
      "prisma",
      "docker",
      "aws",
      "redis",
    ],
    engagement: ["project", "dedicated-team", "product-partnership"],
    faqs: [
      {
        question: "Is custom software worth it compared with off-the-shelf?",
        answer:
          "Often it is not, and we will say so. Off-the-shelf wins when your process is genuinely standard. Custom wins when the process is the thing that differentiates you, when licence costs scale badly with headcount, or when you are already paying people to bridge the gaps between tools. The honest answer usually emerges during discovery.",
      },
      {
        question: "Can you work with our existing systems?",
        answer:
          "Yes. Most projects we take on involve integrating with something already in place — accounting software, a CRM, a warehouse system. Full replacement is the exception rather than the default.",
      },
      {
        question: "What happens to our current data?",
        answer:
          "Migration is planned as part of the project, including cleaning, mapping and validation. We run migrations against a copy first and reconcile the results with you before anything touches production.",
      },
      {
        question: "How do you handle changes mid-project?",
        answer:
          "Change is expected on this kind of work. We run a written change process: the request, its impact on time and cost, and your decision. What we avoid is absorbing changes silently until the schedule quietly fails.",
      },
      {
        question: "Will our team be able to maintain it?",
        answer:
          "That depends on whether you have engineers. Where you do, we work in mainstream technologies and hand over documented code. Where you do not, a maintenance arrangement with us is the realistic answer, and we will be direct about that up front.",
      },
    ],
    related: [
      "automation-integrations",
      "web-application-development",
      "cloud-solutions",
      "saas-development",
      "maintenance-support",
    ],
    ctaLabel: "Discuss a Software Project",
    featured: true,
  },

  {
    slug: "web-development",
    name: "Web Development",
    title: "Websites designed to perform, not just to launch.",
    group: "development",
    visual: "web",
    eyebrow: "Web Development",
    lede: "A website earns its cost through what it does after launch: how fast it loads, how easily it is found, how clearly it explains the business, and how many enquiries it produces. We build for those outcomes.",
    summary:
      "Fast, accessible, content-managed websites built for search visibility and conversion.",
    metaTitle: "Website Development Services | The Digital Alchemy",
    metaDescription:
      "Website design and development focused on speed, accessibility, search visibility and conversion — corporate sites, marketing sites, landing pages and headless CMS builds.",
    whoFor: [
      "Businesses whose current site does not reflect what they have become",
      "Companies whose marketing spend lands on a page that does not convert",
      "Teams who cannot update their own website without a developer",
      "Organisations failing Core Web Vitals and losing search visibility for it",
    ],
    problems: [
      {
        title: "The site is slow and it is costing traffic",
        body: "Page speed affects both ranking and behaviour. Most slow sites are slow for a handful of identifiable reasons — oversized images, blocking scripts, bloated page builders — and all of them are fixable.",
      },
      {
        title: "Visitors cannot tell what you do",
        body: "The most common conversion problem is not the button colour, it is the first screen failing to state clearly who this is for and what it does.",
      },
      {
        title: "Editing anything requires a developer",
        body: "If publishing a case study means raising a ticket, it will not happen. We hand over a content model your team can actually operate.",
      },
      {
        title: "The site was never built to be found",
        body: "Correct headings, clean URLs, unique metadata, structured data and an internal linking structure are not optional extras; they are the foundation search visibility is built on.",
      },
    ],
    capabilities: [
      {
        title: "Design and art direction",
        body: "An original visual system for your business, designed against your real content rather than placeholder text.",
      },
      {
        title: "Front-end engineering",
        body: "Server-rendered pages, optimised images and fonts, and a JavaScript budget that is treated as a budget rather than an afterthought.",
      },
      {
        title: "Content management",
        body: "A CMS shaped around your content types, so editors work with meaningful fields instead of wrestling a page builder.",
      },
      {
        title: "Landing pages and campaign pages",
        body: "Focused pages built to match a specific audience and campaign, with tracking configured to attribute the result correctly.",
      },
      {
        title: "Technical SEO foundations",
        body: "Semantic markup, canonical URLs, metadata per page, structured data, XML sitemaps and redirect handling — built in, not retrofitted.",
      },
      {
        title: "Accessibility",
        body: "Keyboard navigation, visible focus, sensible heading order, form labelling and colour contrast checked against WCAG 2.2 AA.",
      },
      {
        title: "Performance engineering",
        body: "Core Web Vitals treated as an acceptance criterion, measured on real page weights rather than on an empty template.",
      },
      {
        title: "Analytics and measurement",
        body: "Event tracking for the actions that matter — enquiries, calls, downloads — so marketing decisions have something real underneath them.",
      },
      {
        title: "Migration and redirects",
        body: "Existing URLs mapped and redirected so the search history you have already earned is preserved through the move.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "We review the current site's traffic, rankings, speed and conversion paths, and identify what is worth keeping.",
      },
      {
        step: "02",
        title: "Structure",
        body: "Sitemap, content model and page-level messaging agreed before any visual design begins.",
      },
      {
        step: "03",
        title: "Design",
        body: "Key templates designed to real content, reviewed at mobile and desktop together rather than desktop first.",
      },
      {
        step: "04",
        title: "Build",
        body: "Development against a staging URL you can review at any point, with performance and accessibility checked as we go.",
      },
      {
        step: "05",
        title: "Launch",
        body: "Content migration, redirect map, analytics verification, search console setup and a post-launch monitoring window.",
      },
      {
        step: "06",
        title: "Improve",
        body: "Once real traffic arrives, the data tells you what to fix. This is where conversion work properly begins.",
      },
    ],
    deliverables: [
      "Sitemap, content model and page messaging",
      "Original design system and page templates",
      "Responsive, accessible production website",
      "CMS with editor documentation",
      "Technical SEO configuration and structured data",
      "301 redirect map from the previous site",
      "Analytics and conversion tracking",
      "Performance report at launch",
    ],
    technologies: [
      "typescript",
      "react",
      "nextjs",
      "tailwind",
      "wordpress",
      "vercel",
      "ga4",
      "search-console",
    ],
    engagement: ["project", "growth-retainer"],
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "A focused marketing site is usually a matter of weeks; a larger site with many templates and a content migration takes longer. In practice the schedule is set by content readiness and review turnaround more often than by build time, so we agree those checkpoints at the start.",
      },
      {
        question: "Will we be able to edit it ourselves?",
        answer:
          "Yes. We build the content model around what you actually publish and hand over documentation for your team. If a section is genuinely fixed, we will tell you rather than pretending everything is editable.",
      },
      {
        question: "Will we lose our search rankings when we move?",
        answer:
          "Not if the migration is done properly. We map every existing URL, put 301 redirects in place, keep the content that is already ranking, and monitor Search Console after launch. Rankings can fluctuate briefly during reindexing; losing them permanently is a migration failure, not an inevitability.",
      },
      {
        question: "Do you work with WordPress?",
        answer:
          "Yes, including the existing WordPress site this business runs today. We will recommend WordPress where editorial flexibility matters most, and a modern framework where performance and custom functionality matter more. The recommendation follows the requirement.",
      },
      {
        question: "What do you need from us?",
        answer:
          "Content, or the time to help us produce it, plus a single person who can make decisions. Those two things determine project speed more than anything on our side.",
      },
    ],
    related: [
      "ui-ux-design",
      "search-engine-optimization",
      "ecommerce-development",
      "web-application-development",
      "maintenance-support",
    ],
    ctaLabel: "Plan My Website",
    featured: true,
  },

  {
    slug: "web-application-development",
    name: "Web Applications",
    title: "Applications your team and customers log into every day.",
    group: "development",
    visual: "webapp",
    eyebrow: "Web Application Development",
    lede: "A website explains the business. A web application runs part of it. Portals, dashboards, marketplaces and admin systems carry real workflow, real permissions and real consequences when they get it wrong.",
    summary:
      "Dashboards, portals, marketplaces and B2B platforms with real permissions and real data.",
    metaTitle: "Web Application Development Services | The Digital Alchemy",
    metaDescription:
      "Web application development — customer portals, dashboards, marketplaces, booking platforms and B2B systems with role-based access, real-time data and secure architecture.",
    whoFor: [
      "Businesses whose customers currently email to ask for updates",
      "Teams managing bookings, jobs or inventory through shared documents",
      "Marketplaces connecting two sides that need different interfaces",
      "Companies whose internal admin tools have become the bottleneck",
    ],
    problems: [
      {
        title: "Customers have no self-service route",
        body: "Every status question that arrives by phone or email is a cost. A portal converts that support load into something customers can answer themselves at midnight.",
      },
      {
        title: "Permissions are handled by trust rather than by software",
        body: "Shared logins and honour-system access are a liability. Roles and record-level permissions need to be enforced on the server for every request.",
      },
      {
        title: "The interface slows down as the data grows",
        body: "Applications that were fine with a thousand records often collapse at a hundred thousand. Pagination, indexing and query design are decisions to take early.",
      },
      {
        title: "Nobody trusts the numbers on the dashboard",
        body: "A dashboard is only useful if the definitions behind each figure are agreed and consistent. We settle that during design, not after launch.",
      },
    ],
    capabilities: [
      {
        title: "Customer and partner portals",
        body: "Authenticated areas where clients see their own projects, orders, documents, invoices or reports — scoped so each account sees only its own data.",
      },
      {
        title: "Operational dashboards",
        body: "Live views of the metrics a team actually acts on, with filtering, saved views and export, designed for daily use rather than for a screenshot.",
      },
      {
        title: "Admin and back-office systems",
        body: "The tools your staff use to run the operation: search, bulk actions, approvals, audit history and permissions that match your org chart.",
      },
      {
        title: "Marketplaces and multi-sided platforms",
        body: "Separate experiences for each side, matching and messaging between them, and the transaction handling that sits in the middle.",
      },
      {
        title: "Booking and scheduling platforms",
        body: "Availability, capacity, calendars, reminders, cancellations and payment, including the awkward edge cases that decide whether the system is trusted.",
      },
      {
        title: "Data tables that scale",
        body: "Server-side pagination, sorting, filtering and export built to stay fast as records accumulate.",
      },
      {
        title: "Real-time updates",
        body: "Live notifications and activity feeds where they genuinely help, without turning the interface into something that will not sit still.",
      },
      {
        title: "Security and auditability",
        body: "Server-enforced authorisation on every request, session security, rate limiting, and an audit log of consequential actions.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map the workflow",
        body: "Who does what, in what order, and what each role is allowed to see. This is the foundation everything else is built on.",
      },
      {
        step: "02",
        title: "Model the data",
        body: "Entities, relationships and permissions designed before interface work starts, because the data model is the hardest thing to change later.",
      },
      {
        step: "03",
        title: "Prototype",
        body: "The highest-traffic screens built as clickable prototypes and tested with the people who will use them daily.",
      },
      {
        step: "04",
        title: "Build",
        body: "Iterative delivery against a staging environment, with automated tests around the logic that matters most.",
      },
      {
        step: "05",
        title: "Harden",
        body: "Load testing on realistic data volumes, a security review, and accessibility checks before release.",
      },
      {
        step: "06",
        title: "Operate",
        body: "Monitoring, error tracking, backups and a support arrangement, because an application is a service rather than a delivery.",
      },
    ],
    deliverables: [
      "Workflow map and permission matrix",
      "Data model and API design",
      "Interactive prototype of core screens",
      "Production application and staging environment",
      "Role-based access control with audit logging",
      "Automated test coverage on critical logic",
      "Monitoring, error tracking and backups",
      "Technical and user documentation",
    ],
    technologies: [
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "postgresql",
      "prisma",
      "redis",
      "docker",
      "aws",
      "sentry",
    ],
    engagement: ["project", "dedicated-team", "product-partnership"],
    faqs: [
      {
        question: "What is the difference between a website and a web application?",
        answer:
          "A website is mostly published content that everyone sees. An application is mostly authenticated workflow: users log in, act on data, and see different things depending on who they are. The distinction matters because the second needs a data model, a permission model and a testing approach that the first does not.",
      },
      {
        question: "Can you integrate with our existing systems?",
        answer:
          "Yes. Most portals and dashboards are only useful because they surface data from somewhere else — an ERP, a CRM, an accounting system. We map those integration points during discovery.",
      },
      {
        question: "How do you handle security?",
        answer:
          "Authorisation is checked on the server for every request rather than by hiding interface elements. Beyond that: input validation, parameterised queries, rate limiting, secure session cookies, encrypted secrets, dependency monitoring and an audit log for consequential actions.",
      },
      {
        question: "Can it work on mobile?",
        answer:
          "Yes — we design responsively from the start. Where a workflow is genuinely mobile-first, such as field or warehouse use, we will say whether a native app would serve it better than a browser.",
      },
    ],
    related: [
      "custom-software-development",
      "saas-development",
      "ui-ux-design",
      "cloud-solutions",
      "automation-integrations",
    ],
    ctaLabel: "Scope My Application",
    featured: true,
  },

  {
    slug: "mobile-app-development",
    name: "Mobile Apps",
    title: "Apps people actually keep on their phone.",
    group: "development",
    visual: "mobile",
    eyebrow: "Mobile App Development",
    lede: "Most apps are deleted within a week. The ones that survive earn their place on the home screen by doing one thing noticeably better than a website could — and by feeling native while they do it.",
    summary:
      "iOS and Android apps, from first release through store launch and ongoing iteration.",
    metaTitle: "Mobile App Development Services | The Digital Alchemy",
    metaDescription:
      "Mobile app development for iOS and Android — product design, cross-platform engineering, API development, payments, push notifications, store launch and post-release iteration.",
    whoFor: [
      "Businesses whose customers interact often enough to justify an install",
      "Founders launching a product where the phone is the natural place to use it",
      "Companies needing field, delivery or on-site tools that work offline",
      "Teams with an existing app that feels dated or performs badly",
    ],
    problems: [
      {
        title: "The app has no reason to be an app",
        body: "If the same job is done as well in a browser, an install is friction with no return. We will test that assumption honestly before you commit to a build.",
      },
      {
        title: "Onboarding asks for too much too early",
        body: "Registration walls and permission prompts before any value is shown are the fastest way to lose a new user. Sequence matters enormously here.",
      },
      {
        title: "It does not feel native",
        body: "Wrong transitions, non-standard gestures and ignored platform conventions read as cheap even when the functionality is fine.",
      },
      {
        title: "Store review keeps rejecting it",
        body: "Both stores have specific requirements around privacy disclosure, account deletion, permissions and payments. Planning for them beforehand avoids weeks of resubmission.",
      },
    ],
    capabilities: [
      {
        title: "Product definition",
        body: "Deciding what belongs in the app versus the web, and what the first release must contain to be worth installing.",
      },
      {
        title: "Interface design for mobile",
        body: "Platform-appropriate patterns, thumb-reachable layouts, real touch targets, and states designed for slow connections and interruptions.",
      },
      {
        title: "Cross-platform engineering",
        body: "One codebase serving iOS and Android where that is the right trade-off, with native modules where a feature genuinely needs them.",
      },
      {
        title: "Backend and API development",
        body: "The services the app talks to — accounts, data, sync, business logic — designed for mobile's intermittent connectivity.",
      },
      {
        title: "Authentication and accounts",
        body: "Email, phone and social sign-in, biometric unlock, session handling and account deletion, which both stores now require.",
      },
      {
        title: "Payments and subscriptions",
        body: "In-app purchases and subscriptions where the store rules require them, or external payment where they permit it. Getting this wrong is a common rejection cause.",
      },
      {
        title: "Push notifications",
        body: "Segmented, permissioned and useful. Notifications are the fastest way to be uninstalled if they are treated as a broadcast channel.",
      },
      {
        title: "Offline behaviour",
        body: "Local storage and sync so the app degrades gracefully on a weak connection instead of showing an error screen.",
      },
      {
        title: "Store launch",
        body: "Listings, screenshots, privacy declarations, review submission and release management for both stores.",
      },
      {
        title: "Post-launch iteration",
        body: "Crash reporting, analytics and staged rollouts, so the second release is informed by how the first one actually behaved.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery",
        body: "Users, jobs and constraints. We decide together what earns a place in version one and what waits.",
      },
      {
        step: "02",
        title: "Wireframes",
        body: "Flow and structure resolved in low fidelity, where changes are cheap and disagreements are productive.",
      },
      {
        step: "03",
        title: "Prototype",
        body: "An interactive prototype on a real device. Testing on a phone in someone's hand reveals things a desktop review never will.",
      },
      {
        step: "04",
        title: "Design and build",
        body: "Interface design and engineering running together, with builds distributed to you throughout for review.",
      },
      {
        step: "05",
        title: "Test and submit",
        body: "Device testing across screen sizes and OS versions, then store submission with the declarations both stores require.",
      },
      {
        step: "06",
        title: "Grow",
        body: "Store listing improvements, crash triage, analytics review and a release cadence for subsequent versions.",
      },
    ],
    deliverables: [
      "Product definition and release scope",
      "Wireframes and interactive prototype",
      "iOS and Android applications",
      "Backend API and admin tooling",
      "Push notification setup",
      "Store listings and successful submission",
      "Crash reporting and analytics",
      "Source code and store account handover",
    ],
    technologies: [
      "react-native",
      "flutter",
      "typescript",
      "nodejs",
      "postgresql",
      "firebase",
      "aws",
      "sentry",
    ],
    engagement: ["project", "product-partnership", "dedicated-team"],
    faqs: [
      {
        question: "Native or cross-platform?",
        answer:
          "Cross-platform suits most business applications and gets both platforms from one codebase, which usually halves cost and keeps releases in step. Native is the right call for graphics-heavy products, deep hardware use or demanding performance requirements. We will recommend based on what the app actually does, not on preference.",
      },
      {
        question: "Do we need a separate backend?",
        answer:
          "Almost always yes — accounts, data and business logic have to live somewhere the app can reach. If you already have APIs we will use them; if not, that work is part of the project.",
      },
      {
        question: "Who publishes to the stores?",
        answer:
          "The developer accounts should be in your company's name, and we publish under them. That way you own the listings, the reviews and the ability to move to another team later.",
      },
      {
        question: "How long does app store review take?",
        answer:
          "Usually a few days per submission once the declarations are correct, though it varies and rejections add cycles. We build submission time into the schedule rather than treating approval as instant.",
      },
      {
        question: "What does it cost to keep an app running?",
        answer:
          "There is an unavoidable baseline: developer account fees, backend hosting, and periodic updates for new OS versions and store policy changes. An app left untouched for a year tends to break, so we plan maintenance as part of the ongoing cost rather than as a surprise.",
      },
    ],
    related: [
      "ui-ux-design",
      "product-design",
      "web-application-development",
      "custom-software-development",
      "maintenance-support",
    ],
    ctaLabel: "Build My App",
    featured: true,
  },

  {
    slug: "ecommerce-development",
    name: "E-commerce",
    title: "Stores built around the moment someone decides to buy.",
    group: "development",
    visual: "ecommerce",
    eyebrow: "E-commerce Development",
    lede: "Most online stores lose the majority of their revenue in the gap between the product page and the confirmed order. We design and build that stretch deliberately, then keep improving it against real data.",
    summary:
      "Shopify, WooCommerce and custom commerce builds, tuned for conversion after launch.",
    metaTitle: "E-commerce Development Services | The Digital Alchemy",
    metaDescription:
      "E-commerce development on Shopify, WooCommerce and custom platforms — product experience, checkout optimisation, payments, integrations and conversion improvement.",
    whoFor: [
      "Brands whose store gets traffic but converts poorly",
      "Retailers moving from a marketplace to their own storefront",
      "Businesses with a catalogue too complex for a stock theme",
      "Stores whose stock and orders are reconciled by hand",
    ],
    problems: [
      {
        title: "Carts are abandoned at checkout",
        body: "Usually caused by surprise shipping costs, forced account creation, too many fields or a payment method the customer expected and did not find.",
      },
      {
        title: "Customers cannot find the right product",
        body: "For a catalogue of any size, search and filtering are the product experience. Weak navigation shows up directly in the conversion rate.",
      },
      {
        title: "The product page does not answer the question",
        body: "Sizing, materials, delivery timing, returns. Every unanswered question is a reason to close the tab and not come back.",
      },
      {
        title: "Stock and orders are managed manually",
        body: "Overselling and manual reconciliation are symptoms of a missing integration between the store and whatever system holds the truth about inventory.",
      },
    ],
    capabilities: [
      {
        title: "Platform selection",
        body: "Shopify, WooCommerce or a custom build, chosen on catalogue complexity, order volume, integration needs and who will run the store day to day.",
      },
      {
        title: "Storefront design",
        body: "Category, product, cart and checkout designed as one sequence, with the brand carried through rather than applied as a theme.",
      },
      {
        title: "Product experience",
        body: "Search, filtering, variants, imagery, reviews and the specification detail that answers pre-purchase questions before they become support tickets.",
      },
      {
        title: "Checkout optimisation",
        body: "Guest checkout, fewer fields, address autocomplete, visible total cost early, and the payment methods your customers actually use.",
      },
      {
        title: "Payments and shipping",
        body: "Gateway setup, wallets, local payment methods, shipping rules and tax configuration for the markets you sell into.",
      },
      {
        title: "Integrations",
        body: "Inventory, ERP, accounting, fulfilment and email platforms connected so orders flow without manual re-entry.",
      },
      {
        title: "Commerce analytics",
        body: "Product and checkout event tracking configured properly, so you can see exactly where revenue is being lost.",
      },
      {
        title: "Conversion improvement",
        body: "Ongoing work after launch driven by funnel data and testing rather than by opinion.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Current funnel data, catalogue structure and operational workflow reviewed to find where revenue is actually leaking.",
      },
      {
        step: "02",
        title: "Plan",
        body: "Platform decision, catalogue and taxonomy design, integration map and a migration plan for products and customers.",
      },
      {
        step: "03",
        title: "Design",
        body: "The full purchase sequence designed together — most stores design pages in isolation and inherit the gaps between them.",
      },
      {
        step: "04",
        title: "Build",
        body: "Storefront, integrations and payment configuration, tested against real orders in a staging environment.",
      },
      {
        step: "05",
        title: "Launch",
        body: "Migration, redirects from old product URLs, analytics verification and close monitoring through the first trading days.",
      },
      {
        step: "06",
        title: "Optimise",
        body: "Continuous improvement against funnel data — product page, checkout and merchandising.",
      },
    ],
    deliverables: [
      "Platform recommendation with reasoning",
      "Catalogue structure and taxonomy",
      "Designed and built storefront",
      "Payment, shipping and tax configuration",
      "Inventory and back-office integrations",
      "Product URL redirect map",
      "E-commerce analytics and funnel tracking",
      "Store operations documentation",
    ],
    technologies: [
      "shopify",
      "woocommerce",
      "nextjs",
      "typescript",
      "stripe",
      "razorpay",
      "ga4",
      "meta-ads",
    ],
    engagement: ["project", "growth-retainer"],
    faqs: [
      {
        question: "Shopify or WooCommerce?",
        answer:
          "Shopify suits teams who want the platform to handle hosting, payments and updates, and who value operational simplicity. WooCommerce suits businesses already on WordPress who need unusual rules or tight content integration. A custom build only makes sense at high volume or with genuinely non-standard commerce logic.",
      },
      {
        question: "Can you migrate our existing store?",
        answer:
          "Yes — products, variants, customers, orders and content, with redirects from old product URLs so the search visibility you have built up carries across.",
      },
      {
        question: "Can you improve conversion on our current store?",
        answer:
          "Often, and it is usually better value than a rebuild. We start with the funnel data to find where people drop out, then work through the highest-impact fixes in order. We would rather tell you the checkout needs three changes than sell you a new store.",
      },
      {
        question: "Do you handle product photography?",
        answer:
          "Not in-house. We will specify what is needed and work with your photographer, or introduce you to one. Product imagery is one of the highest-leverage parts of a store, so it is worth doing properly.",
      },
    ],
    related: [
      "web-development",
      "performance-marketing",
      "search-engine-optimization",
      "ui-ux-design",
      "digital-marketing",
    ],
    ctaLabel: "Plan My Store",
  },
];
