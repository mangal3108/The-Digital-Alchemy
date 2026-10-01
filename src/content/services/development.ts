import type { Service } from "./types";

/*
 * Written for a small-business owner, not a developer. See
 * docs/plain-language-glossary.md for the words we use and the ones we don't.
 */
export const developmentServices: Service[] = [
  {
    slug: "saas-development",
    name: "SaaS Development",
    title: "Online software your customers pay for every month (SaaS).",
    group: "software",
    oneLiner: "We build online software that your customers sign up for and pay monthly to use.",
    needItWhen: "you want to sell software that other businesses pay for every month.",
    example: {
      business: "A salon owner with an idea",
      before: "She built booking spreadsheets for her own salon, and other salon owners keep asking if they can use them.",
      after: "Online booking software that other salons sign up for and pay monthly, each with their own logins, reminders and reports.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "saas",
    featured: true,
    eyebrow: "SaaS Development",
    lede: "For founders and businesses with an idea for software that other people will subscribe to. We plan it, design it and build it, with sign-up, payments and reports working from the start.",
    summary:
      "Online software people sign up for and pay for monthly, with accounts, billing and reports built in.",
    metaTitle: "SaaS Development Company in India | The Digital Alchemy",
    metaDescription:
      "We build SaaS: online software your customers sign up for and pay for monthly. Sign-up, payments and reports built in. Get a free consultation.",
    whoFor: [
      "You have an idea for software and want paying users quickly",
      "You built a tool for your own business and want to sell it to others",
      "Your software works, but has outgrown the way it was first built",
      "Your customers put up with spreadsheets and email because nothing better exists",
    ],
    problems: [
      {
        title: "The first version keeps growing and never launches",
        body: "Most first versions launch months late because more features keep getting added. We agree early what a customer must be able to do before they pay you. Everything else waits for version two.",
      },
      {
        title: "People sign up, then leave",
        body: "Many users who give up do it in their first week. We plan the path from sign-up to the first useful result carefully, so new users see the value quickly.",
      },
      {
        title: "Payments were added as an afterthought",
        body: "Plans, free trials, upgrades and failed payments touch almost every part of the software. Adding them later is expensive, so we build them in from the start.",
      },
      {
        title: "Nobody knows how people use it",
        body: "Without tracking, you cannot tell whether people leave because it is hard to use or because of the price. We set up tracking before launch, not after a bad month.",
      },
    ],
    capabilities: [
      {
        title: "Planning the first version",
        body: "We turn your idea into a clear first version: who it is for, what it does, and the smallest version that is worth paying for.",
      },
      {
        title: "Accounts, teams and privacy",
        body: "Sign-up, team accounts and roles. Many customers share the same software, and each one sees only their own data.",
      },
      {
        title: "Monthly billing",
        body: "Plans, free trials, upgrades, reminders for failed payments, invoices and tax, connected to a payment account in your name.",
      },
      {
        title: "Screens that feel finished",
        body: "Every screen is designed, including the empty, loading and error ones, so the software feels complete rather than half-built.",
      },
      {
        title: "Reports for you and your customers",
        body: "Reports your customers need to justify paying for it, and reports you need to see who stays, who leaves and why.",
      },
      {
        title: "AI features and connections",
        body: "AI features where they save real time, like answering questions from a customer's own documents, and links to the apps your customers already use.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "We talk to you and, if possible, to your future users. Together we agree what the first version must do.",
      },
      {
        step: "02",
        title: "Plan and design",
        body: "You get a written plan and a clickable sample of the main screens. Changing a sample takes hours; changing finished software takes weeks.",
      },
      {
        step: "03",
        title: "Build",
        body: "We build in short rounds. You can log in and try it as it grows, instead of reading about progress.",
      },
      {
        step: "04",
        title: "Launch and improve",
        body: "It goes live with payments, tracking and alerts working. Then real usage and customer feedback tell us what to improve next.",
      },
    ],
    deliverables: [
      "A written plan you can take to any team",
      "A clickable sample of the main screens",
      "The live software, plus a test copy for trying changes",
      "Monthly billing connected to your payment account",
      "Hosting, backups and alerts set up",
      "All the code and accounts, in your name",
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
        question: "How much does it cost to build?",
        answer:
          "It depends on what the software needs to do, so any price before we talk would be a guess. The biggest factors are how many kinds of user it has, whether it needs billing from the start, how many other apps it connects to, and how much custom design it needs. We plan in stages, so you see a costed plan before you commit to building.",
      },
      {
        question: "How long does a first version take?",
        answer:
          "Usually a few months rather than a few weeks. The biggest factor is how quickly decisions are made on your side. We plan it so something usable exists early and grows, instead of everything arriving at the end.",
      },
      {
        question: "Do I need to be technical?",
        answer:
          "No. You bring the knowledge of your customers and your business. We handle the technical side and explain each choice in plain words.",
      },
      {
        question: "Can you improve software we already have?",
        answer:
          "Yes, that is a common starting point. We first review the code and how people use it, then suggest fixes in order of importance. We will tell you honestly if it needs rebuilding, which is rarer than people expect.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. The code, the accounts and the design files are yours, and we hand them over as part of the project.",
      },
      {
        question: "Do you help after launch?",
        answer:
          "Yes, through a monthly support plan. Software that is left alone after launch gets worse quickly, so we agree the ongoing support before it goes live.",
      },
    ],
    related: ["product-design", "web-application-development", "cloud-solutions"],
  },

  {
    slug: "custom-software-development",
    name: "Custom Software",
    title: "Custom software built around how your business works.",
    group: "software",
    oneLiner: "Software made only for your business: billing, stock, staff, customers.",
    needItWhen: "ready-made software does not fit the way your business works.",
    example: {
      business: "A hardware shop with two branches",
      before: "Billing is in one app and stock is in Excel. The branches phone each other to check what is available.",
      after: "One system for billing and stock across both branches. Everyone sees the same stock, and the monthly report is a click away.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "software",
    featured: true,
    eyebrow: "Custom Software Development",
    lede: "When ready-made software does not fit, your team ends up working around it. We build software for your billing, stock, staff or customer records that fits the way you already work.",
    summary:
      "Software made only for your business: billing, stock, staff and customer records.",
    metaTitle: "Custom Software Development in Delhi | The Digital Alchemy",
    metaDescription:
      "Custom software for your billing, stock, staff and customer records, built around the way your business works. Get a free consultation.",
    whoFor: [
      "Important work still runs on spreadsheets and WhatsApp messages",
      "You pay for software that covers only half of what you do",
      "You depend on an old system that nobody dares to change",
      "Your information is spread across apps that do not talk to each other",
    ],
    problems: [
      {
        title: "The process lives in people's heads",
        body: "If work stops when one person is on leave, your growth is stuck. Putting the process into software makes it repeatable and visible to everyone.",
      },
      {
        title: "Monthly reports take days",
        body: "Copying numbers between sheets is slow and full of mistakes. When the software records things properly, the report is ready at the click of a button.",
      },
      {
        title: "The old system works, but nobody can change it",
        body: "Old software usually becomes impossible to change long before it stops working. We replace it piece by piece, so your business keeps running during the work.",
      },
      {
        title: "Every app shows different numbers",
        body: "When customers, orders or stock are kept in four places, people argue about which one is right. One reliable record ends that.",
      },
    ],
    capabilities: [
      {
        title: "Understanding your process",
        body: "We sit with the people doing the work and map what really happens, including the exceptions. The exceptions are often where the value is.",
      },
      {
        title: "Screens for everyday work",
        body: "The screens your team uses all day: lists, approvals, search that works, and quick ways to handle many records at once.",
      },
      {
        title: "Billing, stock and customer records",
        body: "Built from scratch where ready-made products do not fit, or connected to them where they do. We will tell you which one you need.",
      },
      {
        title: "Approvals and a history of changes",
        body: "Step-by-step processes with the right people, alerts, and a full record of who did what, and when.",
      },
      {
        title: "Connecting your existing apps",
        body: "Your accounting, delivery, payment and marketing apps linked together, so information moves on its own instead of being copied by hand.",
      },
      {
        title: "Replacing old systems safely",
        body: "Old systems replaced one part at a time, not all at once in one risky switch-over.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "We talk to your team and watch how the work is done today. We write down what it costs you and where it goes wrong before suggesting anything.",
      },
      {
        step: "02",
        title: "Plan",
        body: "We show you the options, with the pros and cons of each, so you choose between clear choices.",
      },
      {
        step: "03",
        title: "Build in parts",
        body: "We build it in parts that each work on their own, so you get value during the project, not only at the end.",
      },
      {
        step: "04",
        title: "Switch over and support",
        body: "We move your existing data and switch over carefully, with a way back if needed. After that, we keep looking after it.",
      },
    ],
    deliverables: [
      "A map of your process and what the software must do",
      "Working software, delivered in parts",
      "Your existing data moved across and checked",
      "Connections to the apps you already use",
      "Roles, permissions and a history of changes",
      "Training for your team and a support plan",
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
        question: "Is custom software worth it, or should we buy something ready-made?",
        answer:
          "Often ready-made is better, and we will say so. It wins when your process is standard. Custom wins when the way you work is what makes you different, when licence fees grow with every new employee, or when you already pay people to fill the gaps between apps. The honest answer usually becomes clear once we understand your process.",
      },
      {
        question: "Can it work with the apps we already use?",
        answer:
          "Yes. Most projects connect to something you already have, like accounting software, a customer list app or a warehouse system. Replacing everything is the exception.",
      },
      {
        question: "What happens to our current data?",
        answer:
          "Moving it is part of the project: we clean it, match it up and check it. We try the move on a copy first and go through the results with you before anything goes live.",
      },
      {
        question: "What if we need changes during the project?",
        answer:
          "Changes are normal. For each one, we write down what it does to the time and cost, and you decide. We do not quietly absorb changes until the deadline slips.",
      },
      {
        question: "Can our own team look after it later?",
        answer:
          "If you have developers, yes: we use common technology and hand over clear, documented code. If you do not, a support plan with us is the realistic option, and we will say so up front.",
      },
    ],
    related: ["automation-integrations", "web-application-development", "maintenance-support"],
  },

  {
    slug: "web-development",
    name: "Web Development",
    title: "A business website that loads fast and brings you enquiries.",
    group: "website",
    oneLiner: "Business websites that load fast and bring you enquiries.",
    needItWhen: "you need a website that explains what you do and brings enquiries.",
    example: {
      business: "A dental clinic in Dwarka",
      before: "An old website that is slow on phones and does not list the treatments. Patients call just to ask what the clinic offers.",
      after: "A fast site that lists every treatment and doctor, with an appointment form. Patients find answers themselves and book from their phone.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "web",
    featured: true,
    eyebrow: "Website Development",
    lede: "For businesses whose website is old, slow, or does not bring in enquiries. We design and build a fast website that explains what you do, shows up on Google and makes it easy to contact you.",
    summary: "Fast business websites that are easy to find on Google and easy to update.",
    metaTitle: "Website Development Company in Delhi | The Digital Alchemy",
    metaDescription:
      "Fast business websites that explain what you do, show up on Google and bring you enquiries. Easy for you to update. Get a free consultation.",
    whoFor: [
      "Your website no longer matches what your business has become",
      "You spend on ads, but the page they land on brings few enquiries",
      "You cannot change your own website without calling a developer",
      "Your site is slow, and people leave before it loads",
    ],
    problems: [
      {
        title: "The site is slow, and it costs you visitors",
        body: "Slow pages rank lower on Google, and people leave them. Most slow sites are slow for a few clear reasons, like huge images or too many add-ons, and all of them can be fixed.",
      },
      {
        title: "Visitors cannot tell what you do",
        body: "The most common problem is not the colour of a button. It is the first screen not saying clearly who you help and what you offer.",
      },
      {
        title: "Every small change needs a developer",
        body: "If adding a new photo or service means waiting for someone, it will not happen. We set it up so your team can make changes themselves.",
      },
      {
        title: "The site was never built to be found",
        body: "Clear headings, clean page addresses and the right page titles are the basics Google needs. We build them in from the start.",
      },
    ],
    capabilities: [
      {
        title: "A design made for your business",
        body: "A look designed around your business and your real content, not a template filled with placeholder text.",
      },
      {
        title: "Fast on every phone",
        body: "Pages that load quickly, even on a slow mobile connection, with images sized properly.",
      },
      {
        title: "Easy updates",
        body: "A simple editor set up around what you publish, so your team can change text, photos and pages themselves.",
      },
      {
        title: "Pages for ads and offers",
        body: "Single pages made for one ad or one offer, with tracking so you can see which ones bring enquiries.",
      },
      {
        title: "Built to be found on Google",
        body: "Page titles, descriptions, clean addresses and a sitemap set up properly, so Google can understand every page.",
      },
      {
        title: "Easy for everyone to use",
        body: "Readable text, clear forms, and pages that work with a keyboard and with screen readers, checked against the international accessibility standard.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "We look at your current site: who visits, how they find you, how fast it is, and what is worth keeping.",
      },
      {
        step: "02",
        title: "Plan the pages",
        body: "We agree the pages, and what each one should say, before any design starts.",
      },
      {
        step: "03",
        title: "Design and build",
        body: "We design with your real content and check every page on phone and computer. You can see progress on a test link at any time.",
      },
      {
        step: "04",
        title: "Launch and improve",
        body: "We move your content and keep your old links working, so you keep your place on Google. Then visitor data shows what to improve.",
      },
    ],
    deliverables: [
      "A plan of every page and what it says",
      "A design made for your business",
      "A fast website that works on every phone",
      "An editor your team can use, with a short guide",
      "Google set up: page titles, sitemap and enquiry tracking",
      "Old links pointed to the new pages, so you keep your rankings",
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
          "A simple business website usually takes a few weeks. A bigger site, with many pages and old content to move, takes longer. What slows things down most is waiting for content and feedback, so we agree those dates at the start.",
      },
      {
        question: "Can we update it ourselves?",
        answer:
          "Yes. We set up the editor around what you actually change, and give your team a short guide. If a part genuinely cannot be edited, we will tell you rather than pretend.",
      },
      {
        question: "Will we lose our Google rankings when we move?",
        answer:
          "Not if the move is done properly. We point every old link to its new page, keep the content that already ranks, and watch Google Search Console after launch. Rankings can wobble for a short time. Losing them for good is a mistake, not bad luck.",
      },
      {
        question: "Do you work with WordPress?",
        answer:
          "Yes. We suggest WordPress when easy editing matters most, and a more modern setup when speed or custom features matter more. The choice follows what you need.",
      },
      {
        question: "What do you need from us?",
        answer:
          "Your content, or time to help us write it, and one person who can make decisions. Those two things decide the speed more than anything we do.",
      },
    ],
    related: ["search-engine-optimization", "ecommerce-development", "ui-ux-design"],
  },

  {
    slug: "web-application-development",
    name: "Web Applications",
    title: "Web applications your customers and staff log in to.",
    group: "software",
    oneLiner: "Online portals and dashboards your staff or customers log in to.",
    needItWhen: "customers or staff need to log in to see or do something.",
    example: {
      business: "A coaching institute with several batches",
      before: "Parents call the office to ask about fees, attendance and test results. Staff answer the same questions all day.",
      after: "A portal where students and parents log in to see classes, fees and results for themselves, so the office answers fewer calls.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "webapp",
    featured: true,
    eyebrow: "Web Application Development",
    lede: "A website tells people about your business. A web application runs part of it: customer portals, dashboards, booking systems and admin tools that people log in to every day.",
    summary: "Customer portals, dashboards and booking systems that people log in to.",
    metaTitle: "Web Application Development Company | The Digital Alchemy",
    metaDescription:
      "Customer portals, dashboards and booking systems your staff and customers log in to, with the right access for each person. Get a free consultation.",
    whoFor: [
      "Your customers call or email just to ask for an update",
      "Bookings, jobs or stock are managed in shared spreadsheets",
      "You connect two groups, like buyers and sellers, who need different screens",
      "Your admin tools have become the thing that slows everyone down",
    ],
    problems: [
      {
        title: "Customers cannot help themselves",
        body: "Every “what is the status?” call costs time. A portal lets customers check for themselves, even at midnight.",
      },
      {
        title: "Everyone shares one login",
        body: "Shared passwords are a risk. Each person should see only what they are allowed to, and the software should make sure of it.",
      },
      {
        title: "It gets slower as your data grows",
        body: "Software that works with a thousand records can struggle with a hundred thousand. We plan for your growth from the start.",
      },
      {
        title: "Nobody trusts the numbers on the dashboard",
        body: "A dashboard only helps if everyone agrees what each number means. We settle that during design, not after launch.",
      },
    ],
    capabilities: [
      {
        title: "Customer portals",
        body: "Areas where each customer logs in to see their own orders, documents, invoices or reports, and nothing else.",
      },
      {
        title: "Dashboards",
        body: "Live numbers your team actually acts on, with filters and downloads, made for daily use.",
      },
      {
        title: "Admin tools",
        body: "The tools your staff use to run things: search, bulk changes, approvals, and a history of who did what.",
      },
      {
        title: "Booking and scheduling",
        body: "Availability, calendars, reminders, cancellations and payments, including the awkward cases that decide whether people trust it.",
      },
      {
        title: "Marketplaces",
        body: "Separate screens for each side, like buyers and sellers, with messages and payments between them.",
      },
      {
        title: "Security built in",
        body: "Access checked every time someone does something, safe logins, limits against misuse, and a record of important changes.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map the work",
        body: "Who does what, in which order, and what each person may see. Everything else is built on this.",
      },
      {
        step: "02",
        title: "Design and test the main screens",
        body: "The screens people use most are made into clickable samples and tried out by the people who will use them.",
      },
      {
        step: "03",
        title: "Build",
        body: "We build in rounds on a test copy you can log in to, with automatic checks on the parts that matter most.",
      },
      {
        step: "04",
        title: "Test and launch",
        body: "We test it with realistic amounts of data and check its security, then launch with monitoring and backups in place.",
      },
    ],
    deliverables: [
      "A map of the work, and who can see what",
      "Clickable samples of the main screens",
      "The live application, plus a test copy",
      "Roles, permissions and a history of changes",
      "Monitoring, error alerts and backups",
      "Guides for your team and for developers",
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
          "A website is mostly information that everyone sees. A web application is mostly work that people do after logging in, and each person sees different things. That difference means an application needs more planning around data, permissions and testing.",
      },
      {
        question: "Can it connect to our existing systems?",
        answer:
          "Yes. Most portals and dashboards are useful because they show information from somewhere else, like your accounting or customer records. We map those connections first.",
      },
      {
        question: "How do you keep it secure?",
        answer:
          "Access is checked on the server every time someone does something, not just by hiding buttons. We also check what people type into forms, limit repeated login attempts, keep logins secure and record important actions.",
      },
      {
        question: "Will it work on phones?",
        answer:
          "Yes, we design for phones from the start. If the work really happens on the move, like in a warehouse or on site, we will tell you whether a mobile app would suit it better.",
      },
    ],
    related: ["custom-software-development", "saas-development", "mobile-app-development"],
  },

  {
    slug: "mobile-app-development",
    name: "Mobile Apps",
    title: "Mobile apps people actually keep on their phone.",
    group: "software",
    oneLiner: "Android and iPhone apps, from idea to Play Store/App Store.",
    needItWhen: "your customers use you often enough to install an app.",
    example: {
      business: "A restaurant with its own delivery riders",
      before: "Orders come by phone and WhatsApp, addresses are written down by hand, and regular customers repeat everything each time.",
      after: "An ordering app with saved addresses, order history and live order status. Regular customers reorder in a few taps.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "mobile",
    featured: true,
    eyebrow: "Mobile App Development",
    lede: "Android and iPhone apps, from idea to the Play Store and App Store. For businesses whose customers use them often enough to install an app, and for founders whose product belongs on a phone.",
    summary: "Android and iPhone apps, launched on both stores and improved after release.",
    metaTitle: "Mobile App Development Company Delhi | The Digital Alchemy",
    metaDescription:
      "Android and iPhone apps, from idea to the Play Store and App Store, then improved after launch. Get a free consultation.",
    whoFor: [
      "Your customers use your service often enough to install an app",
      "Your product is naturally used on a phone",
      "Your staff need a tool that works on site, even with a weak signal",
      "You have an app that feels old or runs badly",
    ],
    problems: [
      {
        title: "The app has no reason to be an app",
        body: "If a website does the same job just as well, asking people to install an app only gets in the way. We check that honestly before you spend on building.",
      },
      {
        title: "It asks for too much, too soon",
        body: "Forcing sign-up and permissions before showing any value is the fastest way to lose new users. The order of the first screens matters a lot.",
      },
      {
        title: "It does not feel like a proper app",
        body: "Strange gestures, and screens that ignore how Android or iPhone normally work, make an app feel cheap, even when everything works.",
      },
      {
        title: "The store keeps rejecting it",
        body: "Both stores have strict rules about privacy, deleting accounts, permissions and payments. Planning for them early saves weeks of resubmitting.",
      },
    ],
    capabilities: [
      {
        title: "Deciding what goes in version one",
        body: "What belongs in the app, what can stay on the website, and what the first release needs to be worth installing.",
      },
      {
        title: "Designed for thumbs",
        body: "Screens that follow Android and iPhone habits, buttons that are easy to reach, and designs that cope with slow connections.",
      },
      {
        title: "One app for Android and iPhone",
        body: "One shared app for both where that makes sense, with separate parts only where a feature needs them.",
      },
      {
        title: "Logins, payments and notifications",
        body: "Phone, email and social sign-in, fingerprint unlock, in-app payments that follow store rules, and notifications people actually want.",
      },
      {
        title: "Works with a weak signal",
        body: "Information saved on the phone and synced later, so the app keeps working instead of showing an error.",
      },
      {
        title: "Launch on both stores",
        body: "Store listings, screenshots, privacy details and submission, then crash reports and updates after launch.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Plan",
        body: "Who will use it, for what, and what earns a place in the first version.",
      },
      {
        step: "02",
        title: "Sketch and test",
        body: "Simple sketches of each screen first, then a clickable sample tested on a real phone in someone's hand.",
      },
      {
        step: "03",
        title: "Design and build",
        body: "Design and building happen together, and you get test versions on your own phone throughout.",
      },
      {
        step: "04",
        title: "Launch and grow",
        body: "We test on many phones and submit to both stores. After launch, crash reports and usage show what to improve next.",
      },
    ],
    deliverables: [
      "A plan for the first version",
      "Screen sketches and a clickable sample",
      "Android and iPhone apps",
      "The system behind the app, with an admin panel",
      "Published on the Play Store and App Store",
      "Crash reports, usage tracking, and the code in your name",
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
        question: "One shared app for both phones, or two separate apps?",
        answer:
          "For most business apps, one shared app for Android and iPhone is the better choice. It usually costs much less and keeps both versions in step. Separate apps make sense for heavy graphics or deep use of the phone's hardware. We recommend based on what your app does.",
      },
      {
        question: "Does the app need a system behind it?",
        answer:
          "Almost always. Accounts, data and business rules need to live somewhere the app can reach. If you already have that, we use it. If not, we build it as part of the project.",
      },
      {
        question: "Whose name is the app published under?",
        answer:
          "Yours. The store accounts should be in your company's name, and we publish under them. You own the listing, the reviews, and the freedom to move to another team later.",
      },
      {
        question: "How long does store review take?",
        answer:
          "Usually a few days for each submission once everything is in order. It varies, and a rejection adds another round, so we plan for review time instead of assuming instant approval.",
      },
      {
        question: "What does it cost to keep an app running?",
        answer:
          "Some costs cannot be avoided: store account fees, hosting, and updates for new phone software and store rules. An app left alone for a year tends to break, so we plan for its upkeep from the start.",
      },
    ],
    related: ["product-design", "web-application-development", "maintenance-support"],
  },

  {
    slug: "ecommerce-development",
    name: "E-commerce",
    title: "An e-commerce website that turns visitors into orders.",
    group: "website",
    oneLiner: "An online store to sell your products, with payments and delivery.",
    needItWhen: "you want to sell products online and take payments.",
    example: {
      business: "A home-décor brand selling on Instagram",
      before: "Orders arrive as Instagram messages. Payments are chased one by one, and stock is tracked in a notebook.",
      after: "An online store with UPI and card payments, delivery tracking, and stock that updates itself. Orders can come in at any hour.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "ecommerce",
    eyebrow: "E-commerce Development",
    lede: "An online store to sell your products, with payments and delivery. Most stores lose sales between the product page and the finished order. We design that part carefully, then keep improving it.",
    summary:
      "Online stores on Shopify, WooCommerce or custom-built, set up to sell and improved after launch.",
    metaTitle: "E-commerce Website Development Company | The Digital Alchemy",
    metaDescription:
      "An online store with UPI, card payments and delivery, built on Shopify, WooCommerce or custom, to turn visitors into orders. Get a free consultation.",
    whoFor: [
      "People visit your store, but few of them buy",
      "You sell on marketplaces and want a store of your own",
      "Your products have too many options for a basic template",
      "You match stock and orders by hand",
    ],
    problems: [
      {
        title: "People leave at the checkout",
        body: "Usually because of surprise delivery charges, being forced to create an account, too many form fields, or a missing payment option like UPI.",
      },
      {
        title: "Customers cannot find the right product",
        body: "Once you have more than a few products, search and filters are how people shop. If they are weak, fewer people buy.",
      },
      {
        title: "The product page does not answer their question",
        body: "Size, material, delivery time, returns. Every unanswered question is a reason to leave and not come back.",
      },
      {
        title: "Stock and orders are handled by hand",
        body: "Selling items you do not have, or matching orders in a spreadsheet, means your store is not connected to where your stock is tracked.",
      },
    ],
    capabilities: [
      {
        title: "Choosing the right platform",
        body: "Shopify, WooCommerce or a custom build, chosen by how many products you sell, how many orders you get, and who will run the store.",
      },
      {
        title: "Store design",
        body: "Category, product, cart and checkout pages designed as one journey, in your brand's look.",
      },
      {
        title: "Product pages that answer questions",
        body: "Search, filters, sizes and colours, photos, reviews, and the details that answer questions before people have to ask.",
      },
      {
        title: "An easy checkout",
        body: "Buying without an account, fewer fields, the total cost shown early, and the payment methods your customers use.",
      },
      {
        title: "Payments, delivery and tax",
        body: "Payment gateway, UPI and wallets, delivery rules and tax set up for the places you sell to.",
      },
      {
        title: "Connected to your stock and accounts",
        body: "Your stock, accounting and delivery apps connected, so orders flow through without being typed in again.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "We look at your current sales, your product range and how orders are handled today, to find where sales are lost.",
      },
      {
        step: "02",
        title: "Plan",
        body: "Which platform, how products are organised, what connects to what, and how existing products and customers move over.",
      },
      {
        step: "03",
        title: "Design and build",
        body: "The whole buying journey is designed together, then built and tested with real test orders.",
      },
      {
        step: "04",
        title: "Launch and improve",
        body: "We move your products, keep old product links working, and watch the first days of sales closely. Then we keep improving from what the sales show.",
      },
    ],
    deliverables: [
      "A platform recommendation, with reasons",
      "A clear way of organising your products",
      "A designed and built online store",
      "Payments, delivery and tax set up",
      "Stock and accounting connected",
      "Sales tracking, and a guide to running the store",
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
          "Shopify suits you if you want hosting, payments and updates handled for you, and you value simplicity. WooCommerce suits you if you already use WordPress or need unusual rules. A fully custom store only makes sense at high volume, or with very unusual needs.",
      },
      {
        question: "Can you move our existing store?",
        answer:
          "Yes: products, options, customers, orders and content. We keep old product links working, so the Google rankings you have built come across with you.",
      },
      {
        question: "Can you improve our current store instead of rebuilding it?",
        answer:
          "Often, and it is usually better value. We look at where people drop out, then fix the biggest problems first. We would rather tell you the checkout needs three changes than sell you a new store.",
      },
      {
        question: "Do you do product photography?",
        answer:
          "Not ourselves. We will tell you what is needed and work with your photographer, or introduce you to one. Good photos are one of the biggest things that help a store sell.",
      },
    ],
    related: ["web-development", "performance-marketing", "search-engine-optimization"],
  },
];
