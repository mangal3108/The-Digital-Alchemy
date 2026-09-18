import Image from "next/image";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { mediaUsage } from "@/lib/media";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatBytes, formatDate } from "@/lib/utils";
import { MediaUploader, MediaItem } from "./media-client";

export const metadata = { title: "Media" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const user = await requirePermission("media.upload");

  const files = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 120,
    include: { uploadedBy: { select: { name: true } } },
  });

  // Usage is resolved server-side so the delete button can explain itself
  // rather than failing after the click.
  const usage = await Promise.all(
    files.map(async (file) => ({
      id: file.id,
      usage: await mediaUsage(file.id),
    })),
  );
  const usageById = new Map(usage.map((entry) => [entry.id, entry.usage]));

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <>
      <PageHeader
        title="Media"
        description="Images are re-encoded to WebP on upload, resized to fit within 2800px, and stripped of EXIF data."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <Card
          title="Library"
          description={
            files.length
              ? `${files.length} file${files.length === 1 ? "" : "s"} · ${formatBytes(totalBytes)}`
              : undefined
          }
        >
          {files.length ? (
            <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((file) => (
                <MediaItem
                  key={file.id}
                  file={{
                    id: file.id,
                    url: file.url,
                    filename: file.filename,
                    alt: file.alt,
                    title: file.title ?? "",
                    caption: file.caption ?? "",
                    width: file.width,
                    height: file.height,
                    sizeLabel: formatBytes(file.size),
                    uploadedBy: file.uploadedBy?.name ?? null,
                    createdAt: formatDate(file.createdAt),
                    usage: usageById.get(file.id) ?? [],
                  }}
                  canDelete={can(user.role, "media.delete")}
                >
                  <Image
                    src={file.url}
                    alt={file.alt || file.filename}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover"
                  />
                </MediaItem>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No media yet"
              description="Upload project imagery, client logos, team photos and article heroes here. They become selectable throughout the admin."
            />
          )}
        </Card>

        <MediaUploader />
      </div>
    </>
  );
}
