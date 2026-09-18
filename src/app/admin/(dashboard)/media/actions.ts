"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { storeUpload, deleteMedia } from "@/lib/media";

export interface MediaState {
  ok?: boolean;
  error?: string;
  message?: string;
}

export async function uploadMedia(
  _prev: MediaState,
  formData: FormData,
): Promise<MediaState> {
  const user = await requirePermission("media.upload");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return { ok: false, error: "Choose a file to upload." };
  if (files.length > 10) {
    return { ok: false, error: "Upload up to 10 files at a time." };
  }

  const alt = String(formData.get("alt") ?? "").trim();
  const errors: string[] = [];
  let uploaded = 0;

  for (const file of files) {
    const result = await storeUpload(file, {
      uploadedById: user.id,
      alt: files.length === 1 ? alt : "",
    });
    if (result.ok) {
      uploaded += 1;
    } else {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  if (uploaded) {
    await recordAudit({
      userId: user.id,
      action: "media.uploaded",
      entity: "Media",
      summary: `Uploaded ${uploaded} file${uploaded === 1 ? "" : "s"}`,
    });
    revalidatePath("/admin/media");
  }

  if (errors.length) {
    return {
      ok: uploaded > 0,
      error: errors.join(" · "),
      message: uploaded ? `${uploaded} uploaded.` : undefined,
    };
  }

  return { ok: true, message: `${uploaded} file${uploaded === 1 ? "" : "s"} uploaded.` };
}

export async function updateMediaMeta(
  _prev: MediaState,
  formData: FormData,
): Promise<MediaState> {
  await requirePermission("media.upload");

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "File not found." };

  await db.media.update({
    where: { id },
    data: {
      alt: String(formData.get("alt") ?? "").trim().slice(0, 300),
      title: String(formData.get("title") ?? "").trim().slice(0, 200) || null,
      caption: String(formData.get("caption") ?? "").trim().slice(0, 500) || null,
    },
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "Saved." };
}

export async function removeMedia(
  _prev: MediaState,
  formData: FormData,
): Promise<MediaState> {
  const user = await requirePermission("media.delete");

  const id = String(formData.get("id") ?? "");
  const media = await db.media.findUnique({
    where: { id },
    select: { filename: true },
  });
  if (!media) return { ok: false, error: "File not found." };

  const result = await deleteMedia(id);
  if (!result.ok) return { ok: false, error: result.error };

  await recordAudit({
    userId: user.id,
    action: "media.deleted",
    entity: "Media",
    entityId: id,
    summary: `Deleted ${media.filename}`,
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "File deleted." };
}
