import { requireUser } from "@/lib/auth";
import { permissionsFor } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/shell";

/**
 * Authenticated admin chrome.
 *
 * `requireUser()` runs on the server for every page in this segment, so an
 * unauthenticated request is redirected before any data query executes. The
 * sidebar is filtered by permission for clarity only — each page and every
 * server action re-checks its own permission, because hiding a link has never
 * been access control.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const permissions = permissionsFor(user.role);

  return (
    <AdminShell user={user} permissions={[...permissions]}>
      {children}
    </AdminShell>
  );
}
