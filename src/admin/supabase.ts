import { createClient } from "@supabase/supabase-js";
import { IMAGE_BUCKET, IMAGE_WIDTHS, SUPABASE_ANON_KEY, SUPABASE_URL, type ImageRef } from "@/lib/news";

export const supabase = createClient(SUPABASE_URL || "http://localhost", SUPABASE_ANON_KEY || "missing", {
  auth: { persistSession: true, autoRefreshToken: true },
});

const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

async function encode(bitmap: ImageBitmap, type: string, quality: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) throw new Error("Impossible de compresser l'image");
  return blob;
}

/**
 * Redimensionne l'image dans le navigateur (480 / 960 / 1600 px max), la compresse en WebP
 * (JPEG si le navigateur n'encode pas le WebP) puis l'envoie dans Supabase Storage.
 */
export async function uploadImage(file: File, alt = ""): Promise<ImageRef> {
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

export async function deleteImages(images: ImageRef[]) {
  const files = images.flatMap((img) => img.widths.map((w) => `${img.path}/${w}.${img.ext ?? "webp"}`));
  if (files.length) await supabase.storage.from(IMAGE_BUCKET).remove(files);
}
