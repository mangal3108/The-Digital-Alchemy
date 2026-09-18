import Image from "next/image";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { parseJson } from "@/lib/utils";
import { TeamEditor, NewTeamMember } from "./team-editor";

export const metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await requirePermission("team.manage");

  const [members, media] = await Promise.all([
    db.teamMember.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { photo: true },
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
        title="Team"
        description="Shown on the About page. The section is hidden entirely until someone is published."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          {members.length ? (
            members.map((member) => (
              <Card key={member.id}>
                <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
                  {member.photo ? (
                    <Image
                      src={member.photo.url}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : null}
                  <span className="text-[0.9375rem] font-medium text-ink">
                    {member.name}
                  </span>
                  <span className="text-[0.8125rem] text-ink-subtle">
                    {member.role}
                  </span>
                  <Badge tone={member.isPublished ? "success" : "neutral"}>
                    {member.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <TeamEditor
                  member={{
                    id: member.id,
                    name: member.name,
                    slug: member.slug,
                    role: member.role,
                    bio: member.bio ?? "",
                    photoId: member.photoId ?? "",
                    linkedin: member.linkedin ?? "",
                    expertise: parseJson<string[]>(member.expertise, []).join(", "),
                    isPublished: member.isPublished,
                    order: member.order,
                  }}
                  mediaOptions={media}
                  canDelete={canDelete}
                />
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                title="No team members"
                description="Add real people with real photographs. Stock portraits are worse than no team section at all."
              />
            </Card>
          )}
        </div>

        <NewTeamMember mediaOptions={media} />
      </div>
    </>
  );
}
