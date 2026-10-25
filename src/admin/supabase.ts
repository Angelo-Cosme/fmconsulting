import { createClient } from "@supabase/supabase-js";
import { IMAGE_BUCKET, IMAGE_WIDTHS, SUPABASE_ANON_KEY, SUPABASE_URL, isStoredImage, type ImageRef, type StoredImage } from "@/lib/news";
import type { VideoRef } from "@/content/media";

export const supabase = createClient(SUPABASE_URL || "http://localhost", SUPABASE_ANON_KEY || "missing", {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const VIDEO_BUCKET = "media";
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

async function encode(bitmap: ImageBitmap | HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  let canvas: HTMLCanvasElement;
  if (bitmap instanceof HTMLCanvasElement) canvas = bitmap;
  else {
    canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  }
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) throw new Error("Impossible de compresser l'image");
  return blob;
}

/**
 * Redimensionne l'image dans le navigateur (480 / 960 / 1600 px max), la compresse en WebP
 * (JPEG si le navigateur n'encode pas le WebP) puis l'envoie dans Supabase Storage.
 */
export async function uploadImage(file: File | Blob, alt = ""): Promise<StoredImage> {
  if (!file.type.startsWith("image/")) throw new Error("Ce fichier n'est pas une image");
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Image trop lourde (25 Mo maximum)");

  const source = await createImageBitmap(file, { imageOrientation: "from-image" });
  const widths = [...new Set(IMAGE_WIDTHS.map((w) => Math.min(w, source.width)))];
  const height = Math.round((source.height * widths[widths.length - 1]) / source.width);

  // Détection du support WebP sur une image minuscule.
  const probe = await encode(await createImageBitmap(source, { resizeWidth: 1, resizeHeight: 1 }), "image/webp", 0.8);
  const ext: "webp" | "jpg" = probe.type === "image/webp" ? "webp" : "jpg";
  const mime = ext === "webp" ? "image/webp" : "image/jpeg";

  const path = crypto.randomUUID();
  await Promise.all(
    widths.map(async (w) => {
      const resized = await createImageBitmap(source, {
        resizeWidth: w,
        resizeHeight: Math.round((source.height * w) / source.width),
        resizeQuality: "high",
      });
      const blob = await encode(resized, mime, ext === "webp" ? 0.78 : 0.82);
      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(`${path}/${w}.${ext}`, blob, { contentType: mime, cacheControl: "31536000", upsert: false });
      if (error) throw new Error(`Envoi de l'image impossible : ${error.message}`);
    }),
  );

  return { path, width: widths[widths.length - 1], height, alt, widths, ext };
}

/** Supprime du stockage les images envoyées depuis le dashboard (les images fournies avec le site sont ignorées). */
export async function deleteImages(images: ImageRef[]) {
  const files = images.filter(isStoredImage).flatMap((img) => img.widths.map((w) => `${img.path}/${w}.${img.ext ?? "webp"}`));
  if (files.length) await supabase.storage.from(IMAGE_BUCKET).remove(files);
}

/** Capture une image de la vidéo (vers 1 s) pour servir d'aperçu. */
async function capturePoster(file: File): Promise<Blob | null> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Vidéo illisible"));
    });
    const seeked = new Promise<void>((resolve) => (video.onseeked = () => resolve()));
    video.currentTime = Math.min(1, (video.duration || 2) / 2);
    await seeked;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    return await encode(canvas, "image/jpeg", 0.85);
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Envoie une vidéo (MP4/WebM, 50 Mo max) et génère automatiquement son image d'aperçu. */
export async function uploadVideo(file: File, alt = ""): Promise<VideoRef> {
  if (!file.type.startsWith("video/")) throw new Error("Ce fichier n'est pas une vidéo");
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(`Vidéo trop lourde (${Math.round(file.size / 1024 / 1024)} Mo, 50 Mo maximum) : compressez-la ou publiez-la sur YouTube.`);
  }
  const ext = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Envoi de la vidéo impossible : ${error.message}`);
  const src = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path).data.publicUrl;

  const posterBlob = await capturePoster(file);
  const poster = posterBlob ? await uploadImage(posterBlob, alt).catch(() => null) : null;
  return { src, path, poster, width: poster?.width, height: poster?.height };
}

export async function deleteVideos(paths: string[]) {
  if (paths.length) await supabase.storage.from(VIDEO_BUCKET).remove(paths);
}

/** Fichiers envoyés dans le stockage et référencés dans un contenu (page, article…). */
export function collectStorage(value: unknown, out = { images: [] as StoredImage[], videos: [] as string[] }) {
  if (Array.isArray(value)) value.forEach((v) => collectStorage(v, out));
  else if (value && typeof value === "object") {
    if (isStoredImage(value)) out.images.push(value);
    else {
      const v = value as Record<string, unknown>;
      if (typeof v.path === "string" && typeof v.src === "string" && v.src.includes(`/${VIDEO_BUCKET}/`)) out.videos.push(v.path);
      Object.values(v).forEach((child) => collectStorage(child, out));
    }
  }
  return out;
}

/** Supprime les fichiers présents dans `before` mais plus dans `after`. */
export async function cleanupStorage(before: unknown, after: unknown) {
  const old = collectStorage(before);
  const kept = collectStorage(after);
  const keptImages = new Set(kept.images.map((i) => i.path));
  const keptVideos = new Set(kept.videos);
  await Promise.all([
    deleteImages(old.images.filter((i) => !keptImages.has(i.path))),
    deleteVideos(old.videos.filter((p) => !keptVideos.has(p))),
  ]);
}
