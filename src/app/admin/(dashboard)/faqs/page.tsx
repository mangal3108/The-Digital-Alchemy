import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { markets } from "@/content/locations";
import { FaqEditor, NewFaq } from "./faq-editor";

export const metadata = { title: "FAQs" };
export const dynamic = "force-dynamic";

/**
 * Extra FAQs.
 *
 * Service, industry and market pages already ship a written FAQ set. Anything
 * added here is appended to that page's list and included in its FAQPage
 * structured data — so it must be genuinely visible content, not markup-only.
 */
export default async function FaqsPage() {
  await requirePermission("faqs.manage");

  const faqs = await db.faq.findMany({
    orderBy: [{ scopeType: "asc" }, { scopeKey: "asc" }, { order: "asc" }],
  });

  const scopeOptions = {
    service: services.map((s) => ({ value: s.slug, label: s.name })),
    industry: industries.map((i) => ({ value: i.slug, label: i.name })),
    location: markets.map((m) => ({ value: m.slug, label: m.country })),
  };

  const labelFor = (scopeType: string, scopeKey: string | null) => {
    if (scopeType === "general") return "General / contact page";
    const list = scopeOptions[scopeType as keyof typeof scopeOptions] ?? [];
    const match = list.find((option) => option.value === scopeKey);
    return `${scopeType} — ${match?.label ?? scopeKey}`;
  };

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Added to the built-in questions on the page you attach them to, and included in that page's structured data."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4">
          {faqs.length ? (
            faqs.map((faq) => (
              <Card key={faq.id}>
                <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-5 py-3">
                  <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-ink">
                    {faq.question}
                  </span>
                  <Badge>{labelFor(faq.scopeType, faq.scopeKey)}</Badge>
                  <Badge tone={faq.isPublished ? "success" : "neutral"}>
                    {faq.isPublished ? "Live" : "Hidden"}
                  </Badge>
                </div>
                <FaqEditor
                  faq={{
                    id: faq.id,
                    question: faq.question,
                    answer: faq.answer,
                    scopeType: faq.scopeType,
                    scopeKey: faq.scopeKey ?? "",
                    isPublished: faq.isPublished,
                    order: faq.order,
                  }}
                  scopeOptions={scopeOptions}
                />
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                title="No extra FAQs"
                description="Service, industry and market pages already carry a written FAQ set. Add here only when a real question keeps coming up."
              />
            </Card>
          )}
        </div>

        <NewFaq scopeOptions={scopeOptions} />
      </div>
    </>
  );
}
