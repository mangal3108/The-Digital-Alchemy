import Image from "next/image";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { ClientEditor, NewClient } from "./client-editor";

export const metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsAdminPage() {
  const user = await requirePermission("clients.manage");

  const [clients, media] = await Promise.all([
    db.client.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { logo: true, _count: { select: { projects: true } } },
    }),
    db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, filename: true },
    }),
  ]);

  const canDelete = can(user.role, "content.delete");

  return (
    <>
      <PageHeader
        title="Clients"
        description="Named clients and their logos. Both require explicit permission — the logo wall only shows clients flagged as approved."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          {clients.length ? (
            clients.map((client) => (
              <Card key={client.id}>
                <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
                  {client.logo ? (
                    <Image
                      src={client.logo.url}
                      alt=""
                      width={72}
                      height={24}
                      className="h-6 w-auto"
                    />
                  ) : null}
                  <span className="text-[0.9375rem] font-medium text-ink">
                    {client.name}
                  </span>
                  <Badge tone={client.isPublished ? "success" : "neutral"}>
                    {client.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {client.showLogo ? (
                    <Badge tone="accent">Logo approved</Badge>
                  ) : null}
                  <span className="ml-auto text-[0.75rem] text-ink-subtle">
                    {client._count.projects} project
                    {client._count.projects === 1 ? "" : "s"}
                  </span>
                </div>

                <ClientEditor
                  client={{
                    id: client.id,
                    name: client.name,
                    slug: client.slug,
                    website: client.website ?? "",
                    country: client.country ?? "",
                    industry: client.industry ?? "",
                    logoId: client.logoId ?? "",
                    showLogo: client.showLogo,
                    isPublished: client.isPublished,
                    order: client.order,
                  }}
                  mediaOptions={media}
                  canDelete={canDelete}
                />
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                title="No clients"
                description="The clients page and the homepage logo strip stay in their honest empty state until you add some."
              />
            </Card>
          )}
        </div>

        <NewClient mediaOptions={media} />
      </div>
    </>
  );
}
