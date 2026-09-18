import Link from "next/link";

import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Insights" };
export const dynamic = "force-dynamic";

export default async function PostsPage() {
  await requirePermission("posts.manage");

  const posts = await db.post.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="Insights"
        description="Articles supporting the service pages. Written in Markdown; raw HTML is not rendered."
        action={
          <Button href="/admin/posts/new" size="sm" withArrow>
            New article
          </Button>
        }
      />

      <Card>
        {posts.length ? (
          <TableWrap>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Author</Th>
                <Th>Published</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <Td>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {post.title}
                    </Link>
                    <span className="block text-[0.75rem] text-ink-subtle">
                      /insights/{post.slug} · {post.readingMinutes} min
                    </span>
                  </Td>
                  <Td>{post.category?.name ?? "—"}</Td>
                  <Td>
                    <Badge
                      tone={
                        post.status === "PUBLISHED"
                          ? "success"
                          : post.status === "SCHEDULED"
                            ? "warning"
                            : post.status === "ARCHIVED"
                              ? "danger"
                              : "neutral"
                      }
                    >
                      {post.status}
                    </Badge>
                  </Td>
                  <Td>{post.author?.name ?? "—"}</Td>
                  <Td>
                    <span className="whitespace-nowrap text-[0.8125rem]">
                      {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState
            title="No articles yet"
            description="The insights page shows its planned-topics state until the first article is published."
            action={
              <Button href="/admin/posts/new" size="sm" withArrow>
                Write the first article
              </Button>
            }
          />
        )}
      </Card>
    </>
  );
}
