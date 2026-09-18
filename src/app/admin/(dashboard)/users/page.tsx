import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from "@/lib/rbac";
import { formatDateTime } from "@/lib/utils";
import { NewUserForm, UserRow, OwnPasswordForm } from "./user-forms";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const actor = await requirePermission("users.manage");

  const users = await db.user.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
    include: { _count: { select: { sessions: true } } },
  });

  return (
    <>
      <PageHeader
        title="Users"
        description="Who can sign in, and what each of them is allowed to do. Permissions are enforced on the server for every request."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          <Card title="Accounts">
            <TableWrap>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last sign-in</Th>
                  <Th className="text-right">Manage</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <Td>
                      <span className="block font-medium text-ink">
                        {user.name}
                        {user.id === actor.id ? (
                          <span className="ml-1.5 text-[0.75rem] font-normal text-ink-subtle">
                            (you)
                          </span>
                        ) : null}
                      </span>
                      <span className="block text-[0.75rem] text-ink-subtle">
                        {user.email}
                      </span>
                    </Td>
                    <Td>
                      <Badge
                        tone={user.role === "SUPER_ADMIN" ? "accent" : "neutral"}
                      >
                        {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ??
                          user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge tone={user.isActive ? "success" : "danger"}>
                        {user.isActive ? "Active" : "Disabled"}
                      </Badge>
                      {user._count.sessions ? (
                        <span className="mt-1 block text-[0.6875rem] text-ink-subtle">
                          {user._count.sessions} active session
                          {user._count.sessions === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-[0.8125rem]">
                        {user.lastLoginAt
                          ? formatDateTime(user.lastLoginAt)
                          : "Never"}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <UserRow
                        user={{
                          id: user.id,
                          role: user.role,
                          isActive: user.isActive,
                          email: user.email,
                        }}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>

          <Card
            title="What each role can do"
            description="Applied server-side. The sidebar hides what a role cannot reach, but that is presentation only."
          >
            <dl className="divide-y divide-hairline">
              {ROLES.map((role) => (
                <div key={role} className="px-5 py-3">
                  <dt className="text-[0.875rem] font-medium text-ink">
                    {ROLE_LABELS[role]}
                  </dt>
                  <dd className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {ROLE_DESCRIPTIONS[role]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="grid gap-4">
          <NewUserForm />
          <OwnPasswordForm />
        </div>
      </div>
    </>
  );
}
