import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { SCHEMAS, validate, type FormType } from "@/lib/forms";
import { getMaterial } from "@/lib/materials";
import { DATA_DIR, saveSubmission, type Attachment } from "@/lib/store";

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const type = String(form.get("formType") ?? "") as FormType;
  if (!(type in SCHEMAS)) return Response.json({ error: "Unknown form" }, { status: 400 });

  // Honeypot: real people never fill this hidden field
  if (String(form.get("website") ?? "")) return Response.json({ ok: true });

  const { values, errors, ok } = validate(type, form);
  if (!ok) return Response.json({ errors }, { status: 422 });

  let materialId: string | null = null;
  if (type === "request") {
    const material = getMaterial(String(form.get("materialId") ?? ""));
    if (!material) return Response.json({ error: "Unknown material" }, { status: 400 });
    materialId = material.slug;
  }

  const id = randomUUID();
  const payload: Record<string, unknown> = { ...values };
  const attachments: Attachment[] = [];

  if (type === "supplier") {
    const photos = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    if (photos.length > MAX_PHOTOS) {
      return Response.json({ errors: { photos: `Up to ${MAX_PHOTOS} photos, please.` } }, { status: 422 });
    }
    const saved: string[] = [];
    for (const photo of photos) {
      const ext = IMAGE_EXT[photo.type];
      if (!ext || photo.size > MAX_PHOTO_BYTES) {
        return Response.json({ errors: { photos: "Photos must be JPG, PNG, WEBP or HEIC, up to 10 MB each." } }, { status: 422 });
      }
      const name = `${attachments.length + 1}.${ext}`;
      const data = Buffer.from(await photo.arrayBuffer());
      attachments.push({ name, type: photo.type, data });
      try {
        const dir = path.join(DATA_DIR, "uploads", id);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, name), data);
        saved.push(`uploads/${id}/${name}`);
      } catch (err) {
        console.error("[remade] photo save failed", err);
      }
    }
    payload.photos = saved;
    payload.photoCount = attachments.length;
  }

  const visitorId = String(form.get("visitorId") ?? "").slice(0, 64) || null;
  try {
    await saveSubmission({ type, materialId, visitorId, payload }, id, attachments);
  } catch {
    return Response.json({ error: "We couldn't save your form. Please try again, or email us." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
