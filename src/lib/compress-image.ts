"use client";

const MAX_SIDE = 1800;
const QUALITY = 0.82;

/**
 * Downscales a photo to at most 1800px and re-encodes it as JPEG, so a phone
 * picture of several MB becomes a few hundred KB. Hosts like Vercel reject
 * request bodies over 4.5 MB. Files the browser can't decode (e.g. HEIC outside
 * Safari) are returned unchanged.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", QUALITY));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
