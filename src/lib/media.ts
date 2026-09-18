import "server-only";

import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

import { db } from "./db";
import { slugify } from "./utils";

/**
 * Media handling.
 *
 * Files are written to `public/uploads/YYYY/MM/`. That is right for a single
 * server or a container with a persistent volume; on an ephemeral serverless
 * filesystem it is not, and the storage functions here are the seam to swap
 * for object storage (see README → Media storage). Nothing else in the app
 * touches the filesystem.
 *
 * Security decisions, in order of importance:
 *  - The declared Content-Type is ignored. sharp re-decodes the bytes, so a
 *    payload that merely claims to be an image is rejected.
 *  - SVG is refused outright. It is a script-capable document, and serving one
 *    from our own origin would be a stored-XSS vector.
 *  - Filenames are regenerated from a slug plus random bytes, so a crafted
 *    name cannot traverse directories or overwrite an existing file.
 *  - Everything is re-encoded, which strips EXIF — including GPS coordinates
 *    a client may not realise are in their photographs.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_DIMENSION = 2800;

const ALLOWED = new Set(["jpeg", "jpg", "png", "webp", "avif", "gif"]);

export interface UploadResult {
  ok: boolean;
  error?: string;
  mediaId?: string;
}

export async function storeUpload(
  file: File,
  options: { uploadedById?: string; alt?: string } = {},
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "No file received." };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${MAX_BYTES / 1024 / 1024}MB.`,
    };
  }

  if (/\.svgz?$/i.test(file.name) || file.type === "image/svg+xml") {
    return {
      ok: false,
      error:
        "SVG uploads are not accepted — they can carry scripts. Please upload a PNG or WebP.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let image: sharp.Sharp;
  let metadata: sharp.Metadata;
  try {
    // `animated` keeps multi-frame GIFs intact rather than flattening them.
    image = sharp(buffer, { animated: true });
    metadata = await image.metadata();
  } catch {
    return { ok: false, error: "That file could not be read as an image." };
  }

  if (!metadata.format || !ALLOWED.has(metadata.format)) {
    return {
      ok: false,
      error: `Unsupported image format${metadata.format ? ` (${metadata.format})` : ""}.`,
    };
  }

  const isAnimated = (metadata.pages ?? 1) > 1;
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  // Re-encode to WebP unless it is animated, where re-encoding risks the
  // animation and the saving is not worth it.
  const outputFormat = isAnimated ? metadata.format : "webp";
  const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;

  let pipeline = image.rotate(); // applies EXIF orientation, then drops it

  if (!isAnimated && (width > MAX_DIMENSION || height > MAX_DIMENSION)) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (outputFormat === "webp") {
    pipeline = pipeline.webp({ quality: 82 });
  }

  let output: Buffer;
  let finalWidth = width;
  let finalHeight = height;

  try {
    const result = await pipeline.toBuffer({ resolveWithObject: true });
    output = result.data;
    finalWidth = result.info.width;
    finalHeight = result.info.height;
  } catch {
    return { ok: false, error: "That image could not be processed." };
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const base =
    slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "upload";
  const filename = `${base}-${randomBytes(4).toString("hex")}.${extension}`;

  const directory = path.join(UPLOAD_ROOT, year, month);
  const absolutePath = path.join(directory, filename);
  const publicUrl = `/uploads/${year}/${month}/${filename}`;

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(absolutePath, output);
  } catch (error) {
    console.error("[media] write failed", error);
    return { ok: false, error: "Could not save the file to disk." };
  }

  const media = await db.media.create({
    data: {
      url: publicUrl,
      storagePath: path.relative(process.cwd(), absolutePath),
      filename,
      mimeType: `image/${outputFormat}`,
      size: output.byteLength,
      width: finalWidth,
      height: finalHeight,
      alt: options.alt?.slice(0, 300) ?? "",
      uploadedById: options.uploadedById ?? null,
    },
  });

  return { ok: true, mediaId: media.id };
}

/**
 * Where a media item is currently used. Deletion is refused while anything
 * still references it — a broken image on a live case study is a worse outcome
 * than an unused file sitting on disk.
 */
export async function mediaUsage(id: string): Promise<string[]> {
  const [
    clients,
    projectHeroes,
    projectMedia,
    productLogos,
    productMedia,
    testimonials,
    team,
    posts,
    seo,
  ] = await Promise.all([
    db.client.count({ where: { logoId: id } }),
    db.project.count({ where: { heroId: id } }),
    db.projectMedia.count({ where: { mediaId: id } }),
    db.product.count({ where: { logoId: id } }),
    db.productMedia.count({ where: { mediaId: id } }),
    db.testimonial.count({ where: { photoId: id } }),
    db.teamMember.count({ where: { photoId: id } }),
    db.post.count({ where: { heroId: id } }),
    db.seoOverride.count({ where: { ogImageId: id } }),
  ]);

  const usage: string[] = [];
  if (clients) usage.push(`${clients} client logo${clients > 1 ? "s" : ""}`);
  if (projectHeroes)
    usage.push(`${projectHeroes} project hero${projectHeroes > 1 ? "es" : ""}`);
  if (projectMedia) usage.push(`${projectMedia} project gallery item(s)`);
  if (productLogos) usage.push(`${productLogos} product logo(s)`);
  if (productMedia) usage.push(`${productMedia} product screenshot(s)`);
  if (testimonials) usage.push(`${testimonials} testimonial photo(s)`);
  if (team) usage.push(`${team} team photo(s)`);
  if (posts) usage.push(`${posts} article hero image(s)`);
  if (seo) usage.push(`${seo} social share image(s)`);

  return usage;
}

export async function deleteMedia(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return { ok: false, error: "File not found." };

  const usage = await mediaUsage(id);
  if (usage.length) {
    return {
      ok: false,
      error: `Still in use by ${usage.join(", ")}. Remove those references first.`,
    };
  }

  // Remove the row first: an orphaned file on disk is harmless, whereas a row
  // pointing at a deleted file renders as a broken image.
  await db.media.delete({ where: { id } });

  try {
    await unlink(path.join(process.cwd(), media.storagePath));
  } catch (error) {
    console.warn("[media] file already removed or unreadable", error);
  }

  return { ok: true };
}
