import type { FlowLayer, FlowNode } from "@/components/visuals/flow-diagram";

/**
 * Per-service diagrams.
 *
 * Only defined where a diagram genuinely explains something the prose cannot —
 * an architecture, a pipeline, a hand-off between systems. Services without an
 * entry render no diagram rather than a decorative one.
 *
 * Labels are read by business owners, not engineers: see
 * docs/plain-language-glossary.md.
 */

export interface ServiceDiagram {
  title: string;
  lede?: string;
  caption?: string;
  layers?: FlowLayer[];
  steps?: FlowNode[];
}

export const serviceDiagrams: Record<string, ServiceDiagram> = {
  "saas-development": {
    title: "What goes into online software people pay for",
    lede: "Almost every subscription product ends up with these parts. Deciding them early is what makes the second year cheaper than the first.",
    caption:
      "Accounts, logins and billing all depend on how the data is stored. That is why we plan them together, not one after another.",
    layers: [
      { title: "Who uses it", nodes: [{ label: "Your customers" }, { label: "Their team" }, { label: "Your staff" }] },
      {
        title: "What they see",
        nodes: [
          { label: "The software", detail: "What customers pay for" },
          { label: "Your website", detail: "Where they sign up" },
          { label: "Admin panel", detail: "For your team" },
        ],
      },
      {
        title: "Behind the screens",
        nodes: [
          { label: "Logins", detail: "Accounts and roles" },
          { label: "Business rules", detail: "What the software does", accent: true },
          { label: "Connections", detail: "Links to other apps" },
          { label: "Alerts out", detail: "Tells other apps what happened" },
        ],
      },
      {
        title: "Stored information",
        nodes: [
          { label: "Database", detail: "Each customer sees only their own" },
          { label: "Background work", detail: "Tasks that run on their own" },
          { label: "Files", detail: "Uploads and documents" },
        ],
      },
      {
        title: "Always running",
        nodes: [
          { label: "Billing", detail: "Plans and invoices" },
          { label: "Usage reports", detail: "Who uses what" },
          { label: "Monitoring", detail: "Errors and downtime" },
          { label: "Backups", detail: "Tested restores" },
        ],
      },
    ],
  },

  "custom-software-development": {
    title: "One system for running your business",
    lede: "Custom software usually replaces the spreadsheets and email chains that sit between apps that were never meant to work together.",
    caption:
      "The value is rarely in one part. It is in having one agreed record of each customer, order or job that everything else reads from.",
    layers: [
      {
        title: "People",
        nodes: [{ label: "Operations" }, { label: "Sales" }, { label: "Accounts" }, { label: "Owners" }],
      },
      {
        title: "Parts of the system",
        nodes: [
          { label: "Customers" },
          { label: "Orders & jobs", accent: true },
          { label: "Stock" },
          { label: "Reports" },
        ],
      },
      {
        title: "At its heart",
        nodes: [
          { label: "Steps and approvals", detail: "What happens next" },
          { label: "Permissions", detail: "Who sees what" },
          { label: "History", detail: "Who did what" },
        ],
      },
      {
        title: "Your other apps",
        nodes: [
          { label: "Accounting" },
          { label: "Delivery" },
          { label: "Customer list" },
          { label: "Email & documents" },
        ],
      },
    ],
  },

  "digital-marketing": {
    title: "From first seeing you to becoming a regular customer",
    lede: "Every step below can be measured. When marketing is not working, the weak step can almost always be found.",
    caption:
      "Each channel is judged on what a customer costs at the end, not on how many people saw an ad at the start.",
    steps: [
      { label: "Seen", detail: "Google, social media, ads, referrals" },
      { label: "Click", detail: "The ad and message doing their job" },
      { label: "Landing page", detail: "Keeping the ad's promise" },
      { label: "Enquiry", detail: "Checked before it reaches sales" },
      { label: "Customer", detail: "Traced back to where they came from" },
      { label: "Repeat customer", detail: "Where most of the profit is" },
    ],
  },

  "lead-generation": {
    title: "From stranger to enquiry, step by step",
    lede: "Lead generation usually fails between the steps, not at the start. Each hand-over below is a place enquiries quietly get lost.",
    steps: [
      { label: "Audience", detail: "The people who actually buy" },
      { label: "Campaign", detail: "Ads or Google" },
      { label: "Landing page", detail: "One offer, one action" },
      { label: "Filtering", detail: "Form questions" },
      { label: "Your customer list", detail: "Assigned, with an alert" },
      { label: "Sales call", detail: "While they are still interested" },
    ],
  },

  "automation-integrations": {
    title: "What an automated task looks like",
    lede: "The dull parts, like retrying, removing duplicates and sending alerts, are what make an automation people trust instead of quietly work around.",
    caption:
      "Every step is recorded and watched. If something fails, someone is told, instead of it disappearing without a trace.",
    steps: [
      { label: "Something happens", detail: "A form, an order, a status change" },
      { label: "Check it", detail: "Clean up and remove duplicates" },
      { label: "Decide", detail: "Rules and who handles it" },
      { label: "Update your apps", detail: "Customer list, accounts, operations" },
      { label: "Tell someone", detail: "The right person, on the right app" },
      { label: "Record it", detail: "Logged, watched, retried" },
    ],
  },

  "ecommerce-development": {
    title: "How someone buys from your store",
    lede: "Most stores design these as separate pages. Customers see them as one decision, and the gaps between them are where orders are lost.",
    steps: [
      { label: "Finding", detail: "Search, categories, suggestions" },
      { label: "Product page", detail: "Answering their questions" },
      { label: "Cart", detail: "Total cost shown early" },
      { label: "Checkout", detail: "No account needed, few fields, UPI" },
      { label: "Order", detail: "Confirmation and delivery date" },
      { label: "Coming back", detail: "Where the profit is" },
    ],
  },

  "web-development": {
    title: "Plan, build, launch",
    lede: "A website is judged after launch, so we plan the work around what happens then, not around the big reveal.",
    steps: [
      { label: "Plan", detail: "Pages and what they say" },
      { label: "Design", detail: "With your real content" },
      { label: "Build", detail: "Fast, easy to use, easy to update" },
      { label: "Move", detail: "Old links kept, rankings kept" },
      { label: "Launch", detail: "Tracking checked first" },
      { label: "Improve", detail: "From what real visitors do" },
    ],
  },

  "web-application-development": {
    title: "How a web application is built up",
    lede: "Unlike a website, almost everything in an application depends on who is logged in. That has to be checked behind the screen, not just on it.",
    caption:
      "Access is checked on the server every time someone does something. Hiding a button is not the same as protecting it.",
    layers: [
      { title: "Who logs in", nodes: [{ label: "Customers" }, { label: "Staff" }, { label: "Managers" }] },
      {
        title: "What they see",
        nodes: [
          { label: "Portal", detail: "Only their own account" },
          { label: "Dashboards", detail: "Live numbers" },
          { label: "Admin tools", detail: "Bulk changes, approvals" },
        ],
      },
      {
        title: "Behind the screens",
        nodes: [
          { label: "Access checks", detail: "On every action", accent: true },
          { label: "Business rules", detail: "Tested" },
          { label: "Background tasks", detail: "Work that runs on its own" },
          { label: "History", detail: "Who did what" },
        ],
      },
      {
        title: "Information",
        nodes: [
          { label: "Database" },
          { label: "Quick-access copy" },
          { label: "Your other apps" },
          { label: "Files" },
        ],
      },
    ],
  },

  "marketing-funnels": {
    title: "What happens after the first visit",
    lede: "Most people are not ready on the day they find you. A funnel means deciding in advance what happens next, instead of hoping.",
    steps: [
      { label: "First visit", detail: "From any channel" },
      { label: "A small first step", detail: "Worth saying yes to" },
      { label: "Follow-up", detail: "WhatsApp or email, sent automatically" },
      { label: "Reminder ads", detail: "Matched to how far they got" },
      { label: "Purchase", detail: "When they are ready" },
    ],
  },

  "social-media-management": {
    title: "How your posts get made",
    lede: "Staying consistent is a planning problem, not a creative one. Making posts in batches is what keeps both quality and regularity.",
    steps: [
      { label: "Ideas", detail: "Topics planned, not one-offs" },
      { label: "Design", detail: "Made for each platform" },
      { label: "Approval", detail: "You check the calendar first" },
      { label: "Posting", detail: "On schedule, never rushed" },
      { label: "Replies", detail: "Within an agreed time" },
      { label: "Review", detail: "What to do more and less of" },
    ],
  },

  "performance-marketing": {
    title: "How your ads keep improving",
    lede: "Paid ads only get better over time when the tracking is right. Everything below depends on that first step.",
    steps: [
      { label: "Track", detail: "Every enquiry and sale, with a value" },
      { label: "Set up", detail: "Campaigns built on your numbers" },
      { label: "Create", detail: "New ads, regularly" },
      { label: "Test", detail: "Enough budget to be sure" },
      { label: "Grow", detail: "Only where the cost per sale holds" },
    ],
  },

  "meta-ads": {
    title: "From ad to customer",
    lede: "On Facebook and Instagram, the ad itself finds the right people. The rest of the steps keep the promise it made.",
    steps: [
      { label: "The ad", detail: "Earning attention" },
      { label: "Landing page", detail: "Same message, continued" },
      { label: "Enquiry", detail: "Checked, not just collected" },
      { label: "Your customer list", detail: "With where it came from" },
      { label: "Sale", detail: "Fed back to improve the ads" },
    ],
  },
};

export function getServiceDiagram(slug: string): ServiceDiagram | undefined {
  return serviceDiagrams[slug];
}
