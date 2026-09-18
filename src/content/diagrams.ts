import type { FlowLayer, FlowNode } from "@/components/visuals/flow-diagram";

/**
 * Per-service diagrams.
 *
 * Only defined where a diagram genuinely explains something the prose cannot —
 * an architecture, a pipeline, a hand-off between systems. Services without an
 * entry render no diagram rather than a decorative one.
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
    title: "How a SaaS product fits together",
    lede: "The shape almost every subscription product ends up with. Deciding these boundaries early is what makes the second year cheaper than the first.",
    caption:
      "Multi-tenancy, authentication and billing all touch the data layer, which is why they are designed together rather than added in sequence.",
    layers: [
      { title: "Who uses it", nodes: [{ label: "Customers" }, { label: "Their team members" }, { label: "Your staff" }] },
      {
        title: "Interface",
        nodes: [
          { label: "Web application", detail: "Product UI" },
          { label: "Marketing site", detail: "Acquisition" },
          { label: "Admin console", detail: "Your operations" },
        ],
      },
      {
        title: "API layer",
        nodes: [
          { label: "Authentication", detail: "Sessions, roles" },
          { label: "Application API", detail: "Business logic", accent: true },
          { label: "Public API", detail: "Integrations" },
          { label: "Webhooks", detail: "Events out" },
        ],
      },
      {
        title: "Data",
        nodes: [
          { label: "Primary database", detail: "Tenant-isolated" },
          { label: "Cache & queues", detail: "Jobs, rate limits" },
          { label: "File storage", detail: "Uploads" },
        ],
      },
      {
        title: "Platform services",
        nodes: [
          { label: "Billing", detail: "Plans, invoices" },
          { label: "Analytics", detail: "Usage, activation" },
          { label: "Monitoring", detail: "Errors, uptime" },
          { label: "Backups", detail: "Tested restores" },
        ],
      },
    ],
  },

  "custom-software-development": {
    title: "A business operating system",
    lede: "Custom software usually replaces the spreadsheets and inboxes sitting between systems that were never designed to talk to each other.",
    caption:
      "The value is rarely in any single module. It is in one agreed record of a customer, an order or a job that everything else reads from.",
    layers: [
      {
        title: "People",
        nodes: [{ label: "Operations" }, { label: "Sales" }, { label: "Finance" }, { label: "Leadership" }],
      },
      {
        title: "Modules",
        nodes: [
          { label: "Customers" },
          { label: "Orders & jobs", accent: true },
          { label: "Inventory" },
          { label: "Reporting" },
        ],
      },
      {
        title: "Core",
        nodes: [
          { label: "Workflow engine", detail: "States, approvals" },
          { label: "Permissions", detail: "Who sees what" },
          { label: "Audit trail", detail: "Who did what" },
        ],
      },
      {
        title: "Connected systems",
        nodes: [
          { label: "Accounting" },
          { label: "Logistics" },
          { label: "CRM" },
          { label: "Email & docs" },
        ],
      },
    ],
  },

  "digital-marketing": {
    title: "From impression to retained customer",
    lede: "Every stage below can be measured. Where a funnel is not working, it is almost always identifiable rather than mysterious.",
    caption:
      "Channels are judged on cost per customer at the end of this chain, not on impressions at the start of it.",
    steps: [
      { label: "Impression", detail: "Search, social, paid, referral" },
      { label: "Click", detail: "Creative and message doing the work" },
      { label: "Landing page", detail: "Matching the promise that was made" },
      { label: "Lead", detail: "Qualified before it reaches sales" },
      { label: "Customer", detail: "Attributed back to source" },
      { label: "Retention", detail: "Where margin actually accumulates" },
    ],
  },

  "lead-generation": {
    title: "The pipeline, end to end",
    lede: "Lead generation fails at the joins more often than at the top. Each hand-off below is a place volume quietly leaks.",
    steps: [
      { label: "Audience", detail: "Defined by who actually buys" },
      { label: "Campaign", detail: "Paid or organic demand" },
      { label: "Landing page", detail: "One offer, one action" },
      { label: "Qualification", detail: "Form logic and scoring" },
      { label: "CRM", detail: "Routed, assigned, notified" },
      { label: "Sales", detail: "Contacted while still warm" },
    ],
  },

  "automation-integrations": {
    title: "What an automated workflow looks like",
    lede: "The unglamorous parts — retries, deduplication, alerting — are what separate an automation people trust from one they quietly work around.",
    caption:
      "Every step is logged and monitored. A failure raises an alert rather than disappearing silently, which is the usual failure mode.",
    steps: [
      { label: "Trigger", detail: "Form, order, status change" },
      { label: "Validate", detail: "Clean and deduplicate" },
      { label: "Route", detail: "Rules and assignment" },
      { label: "Sync", detail: "CRM, finance, operations" },
      { label: "Notify", detail: "The right person, the right channel" },
      { label: "Record", detail: "Logged, monitored, retried" },
    ],
  },

  "ecommerce-development": {
    title: "The purchase sequence",
    lede: "Most stores design these as separate pages. Customers experience them as one continuous decision, and the gaps between them are where orders are lost.",
    steps: [
      { label: "Discovery", detail: "Search, category, recommendation" },
      { label: "Product", detail: "Answering the pre-purchase questions" },
      { label: "Cart", detail: "Total cost visible early" },
      { label: "Checkout", detail: "Guest, few fields, local payments" },
      { label: "Order", detail: "Confirmation and expectations set" },
      { label: "Return visit", detail: "Where the margin is" },
    ],
  },

  "web-development": {
    title: "Design, build, launch",
    lede: "A website is judged after launch, so the work is sequenced around what happens then rather than around the reveal.",
    steps: [
      { label: "Structure", detail: "Sitemap and content model" },
      { label: "Design", detail: "Templates against real content" },
      { label: "Build", detail: "Fast, accessible, content-managed" },
      { label: "Migrate", detail: "Redirects preserving search history" },
      { label: "Launch", detail: "Analytics verified before traffic" },
      { label: "Improve", detail: "Driven by what real visitors do" },
    ],
  },

  "web-application-development": {
    title: "How an application is layered",
    lede: "Applications differ from websites in that almost everything depends on who is asking. That has to be enforced at the layer below the interface.",
    caption:
      "Authorisation is checked on the server for every request. Hiding a button is presentation, not protection.",
    layers: [
      { title: "Roles", nodes: [{ label: "Customers" }, { label: "Staff" }, { label: "Administrators" }] },
      {
        title: "Interface",
        nodes: [
          { label: "Portal", detail: "Scoped to one account" },
          { label: "Dashboards", detail: "Operational views" },
          { label: "Back office", detail: "Bulk actions, approvals" },
        ],
      },
      {
        title: "Server",
        nodes: [
          { label: "Authorisation", detail: "Every request", accent: true },
          { label: "Business logic", detail: "Tested" },
          { label: "Jobs & queues", detail: "Background work" },
          { label: "Audit log", detail: "Accountability" },
        ],
      },
      {
        title: "Data & integrations",
        nodes: [
          { label: "Database" },
          { label: "Cache" },
          { label: "External systems" },
          { label: "File storage" },
        ],
      },
    ],
  },

  "marketing-funnels": {
    title: "What happens after the first visit",
    lede: "Most people are not ready on the day they find you. A funnel is simply deciding in advance what happens next instead of hoping.",
    steps: [
      { label: "First visit", detail: "Arriving from any channel" },
      { label: "Entry offer", detail: "A small step worth taking" },
      { label: "Follow-up", detail: "Useful, sequenced, automated" },
      { label: "Retargeting", detail: "Matched to how far they got" },
      { label: "Conversion", detail: "When they are actually ready" },
    ],
  },

  "social-media-management": {
    title: "How the content actually gets made",
    lede: "Consistency is an operational problem, not a creative one. Batching production is what keeps quality and frequency together.",
    steps: [
      { label: "Ideas", detail: "Pillars, not one-offs" },
      { label: "Design", detail: "Per platform, not resized" },
      { label: "Approval", detail: "Calendar reviewed in advance" },
      { label: "Publish", detail: "Scheduled, never scrambled" },
      { label: "Engage", detail: "Replies within an agreed window" },
      { label: "Review", detail: "What to do more and less of" },
    ],
  },

  "performance-marketing": {
    title: "The account, as a loop",
    lede: "Paid media only compounds when the measurement is trustworthy. Everything below depends on the first step being right.",
    steps: [
      { label: "Track", detail: "Correct conversions and values" },
      { label: "Structure", detail: "Campaigns built around economics" },
      { label: "Create", detail: "New concepts on a cadence" },
      { label: "Test", detail: "Enough volume to conclude" },
      { label: "Scale", detail: "Only where cost per sale holds" },
    ],
  },

  "meta-ads": {
    title: "Ad to customer",
    lede: "On social platforms the creative does the targeting. The rest of the chain exists to keep the promise it made.",
    steps: [
      { label: "Creative", detail: "Earning attention it was not given" },
      { label: "Landing page", detail: "Continuing the same message" },
      { label: "Lead", detail: "Qualified, not just captured" },
      { label: "CRM", detail: "Routed with source attached" },
      { label: "Sale", detail: "Fed back to optimise on" },
    ],
  },
};

export function getServiceDiagram(slug: string): ServiceDiagram | undefined {
  return serviceDiagrams[slug];
}
