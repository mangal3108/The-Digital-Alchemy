/**
 * Role-based access control.
 *
 * Permissions are checked on the server for every sensitive request. Hiding a
 * link in the sidebar is presentation, never protection — `requirePermission`
 * in `auth.ts` is what actually enforces this table.
 */

export const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  MARKETING: "Marketing",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full access, including user management and site settings.",
  ADMIN: "Everything except user management and destructive settings changes.",
  EDITOR: "Content: projects, products, insights, testimonials, team and media.",
  MARKETING: "Leads, SEO, metrics and insights.",
};

export const PERMISSIONS = [
  "content.view",
  "content.edit",
  "content.publish",
  "content.delete",
  "projects.manage",
  "products.manage",
  "posts.manage",
  "testimonials.manage",
  "team.manage",
  "clients.manage",
  "faqs.manage",
  "careers.manage",
  "media.upload",
  "media.delete",
  "leads.view",
  "leads.manage",
  "leads.export",
  "seo.manage",
  "redirects.manage",
  "metrics.manage",
  "navigation.manage",
  "settings.manage",
  "users.manage",
  "audit.view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const EDITOR_PERMISSIONS: Permission[] = [
  "content.view",
  "content.edit",
  "content.publish",
  "projects.manage",
  "products.manage",
  "posts.manage",
  "testimonials.manage",
  "team.manage",
  "clients.manage",
  "faqs.manage",
  "careers.manage",
  "media.upload",
];

const MARKETING_PERMISSIONS: Permission[] = [
  "content.view",
  "content.edit",
  "content.publish",
  "posts.manage",
  "faqs.manage",
  "careers.manage",
  "media.upload",
  "leads.view",
  "leads.manage",
  "leads.export",
  "seo.manage",
  "redirects.manage",
  "metrics.manage",
];

const ADMIN_PERMISSIONS: Permission[] = PERMISSIONS.filter(
  (permission) => permission !== "users.manage",
);

const MATRIX: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  EDITOR: EDITOR_PERMISSIONS,
  MARKETING: MARKETING_PERMISSIONS,
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function can(role: string, permission: Permission): boolean {
  if (!isRole(role)) return false;
  return MATRIX[role].includes(permission);
}

export function permissionsFor(role: string): readonly Permission[] {
  return isRole(role) ? MATRIX[role] : [];
}
