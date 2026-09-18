/**
 * Which copy the admin is allowed to change.
 *
 * The typed content files stay the source of truth. This registry names the
 * fields on them that an editor may override, which does three things worth
 * having:
 *
 * 1. The admin form is generated from it, so adding a field here is the whole
 *    job — there is no second place to update.
 * 2. A row in `ContentOverride` whose `field` is not listed here is ignored on
 *    read, so a stale or hand-inserted row cannot inject copy the code does not
 *    know about.
 * 3. It is explicit about what is *not* editable. Structural content —
 *    process stages, technology entries, the service `visual` key — stays in
 *    code because changing it is a code change, not a copy change.
 *
 * Long-form body copy is deliberately absent too. A field here replaces one
 * string; rewriting a whole page belongs in the repository where it can be
 * reviewed.
 */

export interface EditableField {
  /** Must match a real property on the content type. */
  name: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  /** Roughly the length the design expects. Not enforced, shown as guidance. */
  guide?: number;
}

export type ContentScope = "service" | "industry" | "location" | "page";

export const SCOPE_LABELS: Record<ContentScope, string> = {
  service: "Service pages",
  industry: "Industry pages",
  location: "Location pages",
  page: "Standalone pages",
};

const HEADLINE_FIELDS: EditableField[] = [
  {
    name: "eyebrow",
    label: "Eyebrow",
    hint: "The small uppercase line above the heading.",
    guide: 40,
  },
  {
    name: "title",
    label: "Page heading",
    hint: "The H1. One idea, stated plainly.",
    multiline: true,
    guide: 70,
  },
  {
    name: "lede",
    label: "Lede",
    hint: "The paragraph under the heading.",
    multiline: true,
    guide: 220,
  },
  {
    name: "summary",
    label: "Card summary",
    hint: "One line, used on listing pages and in the navigation.",
    multiline: true,
    guide: 120,
  },
];

const META_FIELDS: EditableField[] = [
  {
    name: "metaTitle",
    label: "Meta title",
    hint: "Search result title. Around 60 characters.",
    guide: 60,
  },
  {
    name: "metaDescription",
    label: "Meta description",
    hint: "Search result description. Around 155 characters.",
    multiline: true,
    guide: 155,
  },
];

export const EDITABLE_FIELDS: Record<ContentScope, EditableField[]> = {
  service: [
    ...HEADLINE_FIELDS,
    {
      name: "ctaLabel",
      label: "Call to action",
      hint: "The primary button on this page.",
      guide: 30,
    },
    ...META_FIELDS,
  ],
  industry: [...HEADLINE_FIELDS, ...META_FIELDS],
  location: [...HEADLINE_FIELDS, ...META_FIELDS],
  page: [
    {
      name: "eyebrow",
      label: "Eyebrow",
      hint: "The small uppercase line above the heading.",
      guide: 40,
    },
    {
      name: "title",
      label: "Page heading",
      multiline: true,
      guide: 70,
    },
    {
      name: "lede",
      label: "Lede",
      multiline: true,
      guide: 240,
    },
  ],
};

/**
 * Standalone pages whose hero copy is editable.
 *
 * Keyed by path because these have no slug of their own. Anything not listed
 * keeps its copy in the component, which is the right place for pages whose
 * wording is load-bearing — the legal pages and the "why this is empty"
 * explanations in particular.
 */
export const EDITABLE_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services index" },
  { path: "/industries", label: "Industries index" },
  { path: "/locations", label: "Locations index" },
  { path: "/work", label: "Work" },
  { path: "/products", label: "Products" },
  { path: "/insights", label: "Insights" },
  { path: "/careers", label: "Careers" },
  { path: "/contact", label: "Contact" },
  { path: "/start-a-project", label: "Start a project" },
];

/** Field names allowed for a scope, used to reject unknown rows on read. */
export function allowedFields(scope: ContentScope): Set<string> {
  return new Set(EDITABLE_FIELDS[scope].map((field) => field.name));
}
