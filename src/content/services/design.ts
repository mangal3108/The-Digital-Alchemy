import type { Service } from "./types";

/*
 * Written for a small-business owner, not a designer. See
 * docs/plain-language-glossary.md for the words we use and the ones we don't.
 */
export const designServices: Service[] = [
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    title: "UI/UX design: making your app or website easy to use.",
    group: "design",
    oneLiner: "We make your app or website easy and pleasant to use.",
    needItWhen: "your app or website confuses the people using it.",
    example: {
      business: "A pharmacy's ordering app",
      before: "Customers add medicines to the cart, then give up at the step where they upload a prescription.",
      after: "A redesigned upload step, tested with real customers before it is built, so fewer people give up halfway.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "uiux",
    eyebrow: "UI/UX Design",
    lede: "For businesses that already have an app or website that people find confusing. UI is how it looks; UX is how easy it is to use. We find where people get stuck and redesign those parts, testing the changes before anything is rebuilt.",
    summary: "We find where people get stuck in your app or website, and redesign it so it is easy to use.",
    metaTitle: "UI/UX Design Agency in India | The Digital Alchemy",
    metaDescription:
      "We find where people get stuck in your app or website, and redesign it so it is easy and pleasant to use. Tested with real users. Get a free consultation.",
    whoFor: [
      "Your customers keep asking for help with the same screen",
      "Your app grew one feature at a time and now feels messy",
      "You need an app that looks trustworthy before you sell or raise money",
      "Every new screen your developers build looks slightly different",
    ],
    problems: [
      {
        title: "Everything looks equally important",
        body: "When features are added one by one, every button gets the same weight. Making the important things stand out is usually the most valuable change of all.",
      },
      {
        title: "People give up at the same step every time",
        body: "There is almost always one screen doing the damage. Visitor data shows which one; watching a few people use it shows why.",
      },
      {
        title: "Every screen looks slightly different",
        body: "Without shared buttons, spacing and wording, each new feature invents its own. The mess grows quietly, and so does the cost of fixing it.",
      },
      {
        title: "The designs cannot be built as drawn",
        body: "Designs often show only the perfect case. What the screen shows when it is empty, loading or showing an error is part of the design too.",
      },
    ],
    capabilities: [
      {
        title: "Finding out what goes wrong",
        body: "Talking to your users, watching them use the product, and reading your visitor data and support messages, so the design is based on evidence.",
      },
      {
        title: "Clear menus and names",
        body: "How things are grouped, labelled and found. Most products that feel confusing have a structure problem, not a colour problem.",
      },
      {
        title: "Screen sketches, then full designs",
        body: "Simple sketches first, while changes are cheap, then finished screens designed with your real content, including the empty and error states.",
      },
      {
        title: "A shared design kit",
        body: "Ready-made buttons, forms and rules your developers can build once and use everywhere, so every screen stays consistent.",
      },
      {
        title: "Clickable samples and testing",
        body: "A clickable sample tried out by people like your users, with the results written up as a list of changes in order of importance.",
      },
      {
        title: "Easy for everyone",
        body: "Readable text, clear forms and buttons large enough to tap, decided during design, where they cost almost nothing.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "Your goals, your users' goals, and whatever your visitor data and support messages already tell us.",
      },
      {
        step: "02",
        title: "Fix the structure",
        body: "We agree how screens are organised and how people move through them before any visual design. Most of the value is created here.",
      },
      {
        step: "03",
        title: "Design and test",
        body: "Finished screens for phone and computer, then a clickable sample tested with real people, and changes made before building starts.",
      },
      {
        step: "04",
        title: "Hand over",
        body: "Clear guides for your developers, and we check the built version matches the design.",
      },
    ],
    deliverables: [
      "What we found, and what to change first",
      "How the screens are organised and linked",
      "Finished designs for phone and computer",
      "A shared design kit for your developers",
      "A clickable sample, and what testing showed",
      "Guides for developers, and a check of the built version",
    ],
    technologies: ["figma", "react", "tailwind", "storybook"],
    engagement: ["project", "dedicated-team"],
    faqs: [
      {
        question: "Can you design it without building it?",
        answer:
          "Yes. Many clients have their own developers and only need the design. We hand over a documented design kit and stay available while it is built, so the result matches the design.",
      },
      {
        question: "How much user research do we really need?",
        answer:
          "Less than some agencies sell, and more than most teams do. For most projects, five to eight good conversations with real users, plus a look at your visitor data, changes the design a lot. More than that adds little.",
      },
      {
        question: "Will a redesign confuse our existing users?",
        answer:
          "It can, which is why we start by finding what already works. Throwing away familiar screens can make things worse. Changing things step by step is often the better answer, and we will say when it is.",
      },
      {
        question: "What do our developers get?",
        answer:
          "Design files with a documented design kit, notes on spacing, text and behaviour, clickable samples showing how things move, and a working session at the start of building.",
      },
    ],
    related: ["product-design", "web-development", "mobile-app-development"],
  },

  {
    slug: "product-design",
    name: "Product Design",
    title: "Product design: planning a new app before anything is built.",
    group: "design",
    oneLiner: "We plan and design a new app from idea to screens before building.",
    needItWhen: "you have an idea for a new app and want to plan it first.",
    example: {
      business: "A doctor who wants a patient follow-up app",
      before: "The idea is clear to her but not written down, and developers quote very different prices for it.",
      after: "A clear first version and a tested, clickable sample of every screen, so every developer quotes for the same thing.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "product-design",
    eyebrow: "Product Design",
    lede: "For founders and businesses with an idea for a new app. Before any building, we work out who it is for, what problem it solves, and the smallest first version worth making. Then we design every screen and test it with real people.",
    summary: "Turning an idea for a new app into a tested plan and screens, before any building starts.",
    metaTitle: "Product Design Agency for New Apps | The Digital Alchemy",
    metaDescription:
      "Have an idea for a new app? We plan it, design every screen and test it with real people before any building starts. Get a free consultation.",
    whoFor: [
      "You have an idea for an app and want to get it right before paying for building",
      "You want to turn something you do in-house into a product you can sell",
      "You have a long wish-list of features and no agreed order",
      "Your last launch did not change anything that mattered",
    ],
    problems: [
      {
        title: "The idea is a list of features, not a problem",
        body: "Products described only as features tend to fail. Naming the exact problem, and whose problem it is, changes what gets built and how it is sold.",
      },
      {
        title: "Everything feels essential",
        body: "Without an agreed first version, every feature seems a must-have. We draw the line at what a user must be able to do.",
      },
      {
        title: "Nobody has asked a future user",
        body: "Building for months on an untested guess is the most expensive mistake there is. A few careful conversations early usually change the plan.",
      },
      {
        title: "Nobody agreed what success looks like",
        body: "If you do not decide in advance what a good result is, you cannot judge the launch. Then the next decision has nothing to stand on.",
      },
    ],
    capabilities: [
      {
        title: "Naming the problem",
        body: "A clear statement of who has the problem, what it costs them, and how they get around it today.",
      },
      {
        title: "Checking the competition",
        body: "An honest look at what already exists, and what would make yours worth switching to.",
      },
      {
        title: "Exploring different approaches",
        body: "Several different ways of solving the problem, explored side by side, because the first idea is rarely the strongest.",
      },
      {
        title: "Defining the first version",
        body: "The first release, defined by what it must achieve, with everything else clearly moved to a later stage.",
      },
      {
        title: "Clickable samples and testing",
        body: "Samples made to answer a specific question, tested with future users. Where it matters, we also test whether they would actually pay.",
      },
      {
        title: "Measuring success and planning next steps",
        body: "What the product must do to count as working, how to measure it, and what to build after launch.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Frame the problem",
        body: "Working sessions to agree the problem, who it affects and the limits you are working within.",
      },
      {
        step: "02",
        title: "Talk to future users",
        body: "Conversations with the people you want to serve, and a look at how they solve the problem today.",
      },
      {
        step: "03",
        title: "Explore and test",
        body: "Several ideas turned into clickable samples, tested with real people, with the results written up honestly, even the uncomfortable ones.",
      },
      {
        step: "04",
        title: "Define the first version",
        body: "A clear first version with a way to measure success, ready to be priced and built.",
      },
    ],
    deliverables: [
      "A clear statement of the problem, and who has it",
      "What future users told us",
      "The different approaches, with pros and cons",
      "A tested clickable sample",
      "A defined first version",
      "How to measure success, and what comes next",
    ],
    technologies: ["figma", "react", "nextjs"],
    engagement: ["project", "product-partnership"],
    faqs: [
      {
        question: "How is this different from UI/UX design?",
        answer:
          "Product design decides what to build, and why. UI/UX design decides how it works and looks. For something genuinely new, doing product design first stops months of good design work being aimed at the wrong problem.",
      },
      {
        question: "Do we need this if we already know what we want?",
        answer:
          "Not always. If you know exactly what to build and who it is for, go straight to design and building. This is for when the idea is still broad, or when a previous attempt did not work.",
      },
      {
        question: "What if testing shows the idea does not work?",
        answer:
          "That is a good result, found at the cheapest possible moment. It usually changes the idea rather than ending it: a different audience, a narrower problem, or a different place to start.",
      },
      {
        question: "Do I need to be technical?",
        answer:
          "No. You bring the knowledge of your customers and your market. We handle the planning and design, and explain each decision in plain words.",
      },
    ],
    related: ["ui-ux-design", "saas-development", "mobile-app-development"],
  },

  {
    slug: "branding",
    name: "Branding & Creative",
    title: "Branding: a logo, colours and look people remember.",
    group: "design",
    oneLiner: "Logo, colours and the overall look of your brand.",
    needItWhen: "your logo and look need to be clear and consistent.",
    example: {
      business: "A family sweet shop opening a second branch",
      before: "The logo was made years ago. It looks different on the signboard, the boxes and Instagram, and is hard to read when small.",
      after: "A refreshed logo, colours and templates that look the same on the signboard, the boxes and every post.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "branding",
    eyebrow: "Branding & Creative",
    lede: "For businesses that have outgrown their first logo, or whose website, posts and documents all look different. A brand is more than a logo: it is the impression left by everything people see. We design a look that holds together everywhere.",
    summary: "A logo, colours and look for your business, plus templates that keep it consistent.",
    metaTitle: "Branding & Logo Design Agency in Delhi | The Digital Alchemy",
    metaDescription:
      "A logo, colours and look that make your business easy to recognise, with templates so your posts and documents stay consistent. Get a free consultation.",
    whoFor: [
      "Your business has outgrown the logo you made at the start",
      "Your website, posts and documents all look like they came from different companies",
      "You are about to launch and need to look established",
      "Your brand is a logo file and nothing else",
    ],
    problems: [
      {
        title: "The logo breaks in real use",
        body: "A logo designed on a white page often fails when it is tiny, on a dark background, or painted on a signboard or delivery bag. We test it in the places it will actually appear.",
      },
      {
        title: "Everyone uses the brand differently",
        body: "Without clear rules and ready templates, how your brand looks depends on whoever made the file that day.",
      },
      {
        title: "You look like everyone else in your field",
        body: "Copying what others in your industry do makes everyone look the same. Standing out is good for business, not just a matter of taste.",
      },
      {
        title: "The brand says nothing specific",
        body: "Words like “quality” and “innovation” could belong to any competitor. Being specific is what makes a brand memorable.",
      },
    ],
    capabilities: [
      {
        title: "What your brand stands for",
        body: "Who you serve, what makes you different, and how you talk, decided first, so the look has something to express.",
      },
      {
        title: "Your key messages",
        body: "What you offer and why people should choose you, written so your team can use the same words everywhere.",
      },
      {
        title: "Logo and its versions",
        body: "A main logo plus the versions real life needs: wide, stacked, one-colour, on dark backgrounds, and a small symbol that still reads when tiny.",
      },
      {
        title: "Fonts and colours",
        body: "A set of fonts and colours that work together and stay readable, on light and dark backgrounds.",
      },
      {
        title: "Brand guide",
        body: "A simple guide to using your brand, and just as important, what not to do with it.",
      },
      {
        title: "Ready-to-use templates",
        body: "Templates for social posts, presentations and documents, so staying consistent is the easy option. We can also carry the look through to your website.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Understand",
        body: "Working sessions on who you serve and what makes you different, plus a look at your competitors so we know what to stand apart from.",
      },
      {
        step: "02",
        title: "Agree the message",
        body: "What your brand stands for and says, agreed in writing before any design begins.",
      },
      {
        step: "03",
        title: "Design and refine",
        body: "Different directions shown as they would really appear, on a website, a post, a signboard, not just a logo on white. Then the chosen one is developed and tested.",
      },
      {
        step: "04",
        title: "Hand over",
        body: "The brand guide, all files and templates, delivered in formats you can edit and use.",
      },
    ],
    deliverables: [
      "What your brand stands for, and its key messages",
      "Your logo, in every version you need",
      "Fonts and colours that are easy to read",
      "A simple brand guide",
      "Templates for posts, presentations and documents",
      "All files, ready to use and yours to keep",
    ],
    technologies: ["figma"],
    engagement: ["project", "growth-retainer"],
    faqs: [
      {
        question: "Do we need a full rebrand or just a refresh?",
        answer:
          "A refresh is right when people already recognise your brand, but it looks dated or inconsistent. A full rebrand makes sense when what you do has changed, or when the current look is working against you. Throwing away recognition you have earned has a real cost, so we do not suggest it lightly.",
      },
      {
        question: "How many logo designs will we see?",
        answer:
          "Usually two or three genuinely different directions, each developed enough to judge properly. A dozen half-finished options tends to end in design by committee rather than a decision.",
      },
      {
        question: "Do we get the original files?",
        answer:
          "Yes. All original files, editable templates and ready-to-use versions are handed over, and they are yours.",
      },
      {
        question: "Can we see examples of your brand work?",
        answer:
          "Our public portfolio is being rebuilt, and we only publish work with the client's permission. We can walk you through relevant examples on a call.",
      },
    ],
    related: ["ui-ux-design", "web-development", "social-media-management"],
  },
];
