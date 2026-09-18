import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { TestimonialEditor, NewTestimonial } from "./testimonial-editor";

export const metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const user = await requirePermission("testimonials.manage");

  const testimonials = await db.testimonial.findMany({
    orderBy: [{ isMigrated: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const needsReview = testimonials.filter((item) => item.isMigrated).length;
  const canDelete = can(user.role, "content.delete");

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Shown on the homepage, the clients page and individual case studies. Only published entries appear publicly."
      />

      {needsReview ? (
        <div className="mb-5 rounded-md border border-warning/30 bg-copper-50 px-4 py-3">
          <p className="text-[0.875rem] font-medium text-warning">
            {needsReview} testimonial{needsReview === 1 ? "" : "s"} carried over
            from the previous website needs verifying.
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted">
            The old site published this without a full name, company or a
            source for the figure it quotes. Confirm the wording and the claim
            with the client, then save it — that clears this notice. If it
            cannot be verified, unpublish it.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          {testimonials.length ? (
            testimonials.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-5 py-3">
                  <span className="text-[0.9375rem] font-medium text-ink">
                    {item.authorName}
                  </span>
                  {item.company ? (
                    <span className="text-[0.8125rem] text-ink-subtle">
                      {item.company}
                    </span>
                  ) : null}
                  <Badge tone={item.isPublished ? "success" : "neutral"}>
                    {item.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {item.isFeatured ? <Badge tone="accent">Featured</Badge> : null}
                  {item.isMigrated ? (
                    <Badge tone="warning">Needs verifying</Badge>
                  ) : null}
                  <span className="ml-auto text-[0.75rem] text-ink-subtle">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <TestimonialEditor
                  testimonial={{
                    id: item.id,
                    quote: item.quote,
                    authorName: item.authorName,
                    position: item.position ?? "",
                    company: item.company ?? "",
                    country: item.country ?? "",
                    rating: item.rating ?? undefined,
                    videoUrl: item.videoUrl ?? "",
                    isPublished: item.isPublished,
                    isFeatured: item.isFeatured,
                    order: item.order,
                  }}
                  canDelete={canDelete}
                />
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                title="No testimonials"
                description="Add real client quotes here. The public sections stay hidden until at least one is published."
              />
            </Card>
          )}
        </div>

        <NewTestimonial />
      </div>
    </>
  );
}
