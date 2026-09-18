import type { Service } from "./types";

export const designServices: Service[] = [
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    title: "Interfaces that make complicated things feel obvious.",
    group: "design",
    visual: "uiux",
    eyebrow: "UI/UX Design",
    lede: "Good interface design is mostly decisions: what to show first, what to hide, what to name things, and what happens when something goes wrong. We make those decisions explicitly and test them before they are expensive to change.",
    summary:
      "Research, flows, design systems and prototypes — handed over ready for engineering.",
    metaTitle: "UI/UX Design Services | The Digital Alchemy",
    metaDescription:
      "UI and UX design for software products, applications and websites — user research, information architecture, wireframes, design systems, prototypes and developer handoff.",
    whoFor: [
      "Product teams whose users keep asking for help with the same screen",
      "Founders who need a credible interface before raising or selling",
      "Companies with an application that grew feature by feature and now feels incoherent",
      "Engineering teams building without a design system and paying for it in inconsistency",
    ],
    problems: [
      {
        title: "The product does everything and communicates nothing",
        body: "Feature-by-feature growth produces interfaces where every option has equal weight. Establishing hierarchy is usually the single highest-value change available.",
      },
      {
        title: "Users drop out at the same step every time",
        body: "There is almost always one screen doing the damage. Analytics narrows it down; a handful of usability sessions explains why.",
      },
      {
        title: "Every screen looks slightly different",
        body: "Without shared components and tokens, each new feature invents its own spacing, buttons and language. The cost compounds quietly.",
      },
      {
        title: "Designs are not buildable as drawn",
        body: "Handover fails when files show only the happy path. Empty, loading, error and overflow states are part of the design, not edge cases for engineering to invent.",
      },
    ],
    capabilities: [
      {
        title: "User research",
        body: "Interviews, observed sessions and analysis of existing analytics and support tickets. Enough to design from evidence rather than from assumption.",
      },
      {
        title: "Information architecture",
        body: "Navigation, grouping and naming. Most products that feel confusing have a structure problem rather than a visual one.",
      },
      {
        title: "User flows and wireframes",
        body: "The sequence resolved in low fidelity first, so structural disagreements happen while they are still cheap to settle.",
      },
      {
        title: "Interface design",
        body: "High-fidelity screens designed to real content and real data lengths, including the states that only appear when something goes wrong.",
      },
      {
        title: "Design systems",
        body: "Tokens, components, patterns and usage rules, built so engineering can implement them once and reuse them everywhere.",
      },
      {
        title: "Interactive prototypes",
        body: "Clickable flows for testing and for stakeholder review, which surfaces disagreement far earlier than a static presentation.",
      },
      {
        title: "Usability testing",
        body: "Structured sessions with people who match your users, with findings written up as prioritised changes rather than as a list of observations.",
      },
      {
        title: "Accessibility in design",
        body: "Contrast, focus order, target sizes, motion sensitivity and clear form labelling decided during design, where they are nearly free.",
      },
      {
        title: "Developer handoff",
        body: "Specifications, tokens, component documentation and a working session with the engineers, so intent survives implementation.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "Business goals, user goals and constraints, plus whatever the existing data and support history already tells us.",
      },
      {
        step: "02",
        title: "Structure",
        body: "Architecture and flows agreed before visual work starts. This is where most of the value is created.",
      },
      {
        step: "03",
        title: "Explore",
        body: "Visual directions explored on a real screen rather than a mood board, so the choice is grounded in the actual product.",
      },
      {
        step: "04",
        title: "Design",
        body: "Full screen design across breakpoints, with every meaningful state covered.",
      },
      {
        step: "05",
        title: "Validate",
        body: "Prototype testing with real users, and revisions made before engineering commits.",
      },
      {
        step: "06",
        title: "Hand off",
        body: "System documentation, specifications and support through implementation and design QA.",
      },
    ],
    deliverables: [
      "Research findings and prioritised recommendations",
      "Information architecture and user flows",
      "Wireframes for core journeys",
      "High-fidelity screens across breakpoints",
      "Design system with tokens and components",
      "Interactive prototype",
      "Usability test findings",
      "Handoff documentation and design QA",
    ],
    technologies: ["figma", "react", "tailwind", "storybook"],
    engagement: ["project", "dedicated-team"],
    faqs: [
      {
        question: "Can you design without building?",
        answer:
          "Yes. Plenty of clients have their own engineering team and need design and a system they can implement. We hand over documented components and stay available through implementation so the built version matches the intent.",
      },
      {
        question: "How much research is really necessary?",
        answer:
          "Less than agencies often sell and more than teams usually do. For most projects, five to eight good conversations with real users plus a review of existing analytics changes the design meaningfully. Beyond that you hit diminishing returns quickly.",
      },
      {
        question: "Do you redesign existing products?",
        answer:
          "Frequently. We start by finding what is working, because a redesign that discards familiar patterns can easily make things worse for existing users. Incremental redesign is often the better answer, and we will say so when it is.",
      },
      {
        question: "What do you deliver to developers?",
        answer:
          "Design files with documented components and tokens, specifications for spacing, type and behaviour, prototypes showing interaction, and a working session at the start of implementation. We also do design QA on the built product.",
      },
    ],
    related: [
      "product-design",
      "web-development",
      "mobile-app-development",
      "saas-development",
      "branding",
    ],
    ctaLabel: "Start a Design Project",
  },

  {
    slug: "product-design",
    name: "Product Design",
    title: "Deciding what to build before deciding how it looks.",
    group: "design",
    visual: "product-design",
    eyebrow: "Product Design",
    lede: "Product design is the work of choosing which problem to solve, for whom, and what the smallest convincing version looks like. Interface design comes after those answers, not instead of them.",
    summary:
      "Product strategy, scoping and validation — the thinking that happens before a build.",
    metaTitle: "Product Design Services | The Digital Alchemy",
    metaDescription:
      "Product design and strategy — problem framing, opportunity assessment, scoping, prototyping and validation for new digital products and major feature work.",
    whoFor: [
      "Founders with an idea that needs sharpening before anyone writes code",
      "Businesses considering whether to productise something they already do internally",
      "Teams with a long roadmap and no agreed basis for ordering it",
      "Companies whose last release did not move any number that mattered",
    ],
    problems: [
      {
        title: "The idea has not been reduced to a problem",
        body: "Products described purely as features tend to fail. Naming the specific problem, and whose problem it is, changes what gets built and how it is sold.",
      },
      {
        title: "Scope has no defensible boundary",
        body: "Without an agreed definition of the first release, everything feels essential. We set that boundary against a decision the user must be able to make.",
      },
      {
        title: "Nobody has spoken to a prospective user",
        body: "Building for months on an untested assumption is the most expensive mistake available. A few structured conversations early usually changes the plan.",
      },
      {
        title: "Success is undefined",
        body: "If nobody agreed in advance what a good outcome looks like, the launch will be assessed on vibes and the next decision will have nothing to stand on.",
      },
    ],
    capabilities: [
      {
        title: "Problem framing",
        body: "Turning an idea into a clear statement of who has the problem, what it costs them, and how they currently work around it.",
      },
      {
        title: "Opportunity assessment",
        body: "A grounded look at the alternatives that already exist and what would make yours worth switching to.",
      },
      {
        title: "Concept development",
        body: "Several distinct approaches explored rather than one polished forwards, because the first idea is rarely the strongest.",
      },
      {
        title: "Scope definition",
        body: "A first release defined by outcome, with everything else placed explicitly in a later phase rather than left ambiguous.",
      },
      {
        title: "Rapid prototyping",
        body: "Prototypes built to answer a specific question, at whatever fidelity that question requires and no more.",
      },
      {
        title: "Validation",
        body: "Testing concepts with prospective users and, where relevant, with a pricing conversation. Interest is not the same as intent to pay.",
      },
      {
        title: "Success metrics",
        body: "Agreeing what the product must do to be considered working, and making sure it can actually be measured.",
      },
      {
        title: "Roadmap shaping",
        body: "Sequencing what comes after launch, based on which uncertainty is most worth resolving next.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Frame",
        body: "Workshops to articulate the problem, the audience and the constraints you are actually working within.",
      },
      {
        step: "02",
        title: "Research",
        body: "Conversations with prospective users, plus a review of how the problem is being solved today.",
      },
      {
        step: "03",
        title: "Explore",
        body: "Multiple concepts developed far enough to be compared meaningfully.",
      },
      {
        step: "04",
        title: "Test",
        body: "Prototypes put in front of real people, with the results written up honestly, including the uncomfortable findings.",
      },
      {
        step: "05",
        title: "Define",
        body: "A scoped first release with success criteria, ready to be estimated and built.",
      },
    ],
    deliverables: [
      "Problem definition and audience profile",
      "Research findings from user conversations",
      "Concept explorations with trade-offs",
      "Tested prototype",
      "Defined first-release scope",
      "Success metrics and measurement plan",
      "Phased roadmap beyond launch",
    ],
    technologies: ["figma", "react", "nextjs"],
    engagement: ["project", "product-partnership"],
    faqs: [
      {
        question: "How is this different from UI/UX design?",
        answer:
          "Product design decides what to build and why; UI/UX design decides how it works and looks. On smaller engagements they run together. On anything genuinely new, separating them prevents months of well-designed work aimed at the wrong problem.",
      },
      {
        question: "Do we need this if we already know what we want?",
        answer:
          "Not necessarily. If your scope is clear and your users are well understood, go straight to design and build. This is for situations where the idea is still broad or where the last attempt did not land.",
      },
      {
        question: "What if validation says the idea does not work?",
        answer:
          "That is a good outcome, discovered at the cheapest possible point. It usually reframes rather than kills the idea — a different audience, a narrower problem, a different starting wedge.",
      },
    ],
    related: [
      "ui-ux-design",
      "saas-development",
      "mobile-app-development",
      "web-application-development",
      "branding",
    ],
    ctaLabel: "Shape My Product",
  },

  {
    slug: "branding",
    name: "Branding & Creative",
    title: "An identity that still works at every size it has to survive.",
    group: "design",
    visual: "branding",
    eyebrow: "Branding & Creative",
    lede: "A brand is not a logo. It is the accumulated impression left by every touchpoint — the website, the deck, the invoice, the social post. We build identity systems that hold together across all of them.",
    summary:
      "Brand strategy, identity systems and the templates that keep it consistent in daily use.",
    metaTitle: "Branding & Creative Design Services | The Digital Alchemy",
    metaDescription:
      "Brand strategy, visual identity, logo design, typography and colour systems, brand guidelines and marketing templates for businesses building a consistent presence.",
    whoFor: [
      "Businesses that have outgrown an identity put together at the start",
      "Companies whose materials all look like they came from different firms",
      "Founders preparing to go to market and needing to look established",
      "Teams whose brand exists as a logo file and nothing else",
    ],
    problems: [
      {
        title: "The identity does not survive contact with real use",
        body: "A logo designed in isolation often fails at favicon size, on a dark background, or on a delivery vehicle. Systems have to be tested in the contexts they will live in.",
      },
      {
        title: "Everyone interprets the brand differently",
        body: "Without documented rules and ready templates, consistency depends on whoever is making the file that day.",
      },
      {
        title: "It looks like the rest of the category",
        body: "Sector conventions produce sameness. Distinctiveness is a commercial asset, not a stylistic preference.",
      },
      {
        title: "The brand says nothing specific",
        body: "Positioning built on words like quality and innovation is interchangeable with every competitor. Specificity is what makes a brand memorable.",
      },
    ],
    capabilities: [
      {
        title: "Brand strategy",
        body: "Positioning, audience, personality and messaging — the decisions the visual work then expresses.",
      },
      {
        title: "Naming and messaging",
        body: "Value proposition, key messages and tone of voice, written so your team can use them without paraphrasing them into mush.",
      },
      {
        title: "Logo and identity",
        body: "A primary mark plus the variants real life demands: horizontal, stacked, monochrome, reversed, and a symbol that reads at 16 pixels.",
      },
      {
        title: "Typography and colour",
        body: "A type system with a clear hierarchy and a palette checked for accessible contrast in both light and dark contexts.",
      },
      {
        title: "Visual language",
        body: "Photography direction, graphic devices, iconography and layout principles — the parts that make the brand recognisable without the logo.",
      },
      {
        title: "Brand guidelines",
        body: "Practical documentation covering how to use the system and, just as importantly, what not to do with it.",
      },
      {
        title: "Templates and collateral",
        body: "Social templates, presentation decks, documents and campaign layouts, so consistency is the path of least resistance.",
      },
      {
        title: "Digital application",
        body: "Translating the identity into a web design system, so the site and the brand are one thing rather than two.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discover",
        body: "Workshops on positioning and audience, plus a review of the category so we know what we are differentiating from.",
      },
      {
        step: "02",
        title: "Strategise",
        body: "Positioning and messaging agreed in writing before any visual exploration begins.",
      },
      {
        step: "03",
        title: "Explore",
        body: "Distinct visual directions presented in context — on a screen, a document, a post — rather than as a logo on white.",
      },
      {
        step: "04",
        title: "Refine",
        body: "The chosen direction developed into a full system and stress-tested at its practical extremes.",
      },
      {
        step: "05",
        title: "Document",
        body: "Guidelines, asset library and templates delivered in editable, usable formats.",
      },
      {
        step: "06",
        title: "Apply",
        body: "Rollout across the website, product and marketing materials, with support while the team adopts it.",
      },
    ],
    deliverables: [
      "Positioning and messaging framework",
      "Logo suite with all required variants",
      "Typography and accessible colour system",
      "Visual language and art direction",
      "Brand guidelines document",
      "Social, presentation and document templates",
      "Full asset library in production formats",
    ],
    technologies: ["figma"],
    engagement: ["project", "growth-retainer"],
    faqs: [
      {
        question: "Do we need a full rebrand or just a refresh?",
        answer:
          "A refresh is right when the brand is recognised and broadly working but looks dated or inconsistent. A full rebrand makes sense when the positioning itself has changed, or when the current identity is actively working against you. Discarding recognition you have already earned is a real cost, so we do not recommend it lightly.",
      },
      {
        question: "How many logo concepts do we see?",
        answer:
          "Typically two or three genuinely distinct directions, each developed enough to judge properly. Presenting a dozen half-formed options tends to produce design by committee rather than a decision.",
      },
      {
        question: "Do you provide the source files?",
        answer:
          "Yes. All source files, editable templates and production-ready exports are handed over and are yours outright.",
      },
      {
        question: "Can you show examples of brand work?",
        answer:
          "Our public portfolio is being rebuilt alongside this site, and we only publish work with client permission. We can walk through relevant examples directly in a call.",
      },
    ],
    related: [
      "ui-ux-design",
      "web-development",
      "social-media-management",
      "digital-marketing",
      "product-design",
    ],
    ctaLabel: "Start a Brand Project",
  },
];
