import fs from "node:fs/promises";
import path from "node:path";
import { DATA_DIR, forwardSubmission, insertSubmission, updateSubmissionPayload, type SubmissionType } from "@/lib/db";
import { EMAIL_RE, FORM_SPECS } from "@/lib/forms";
import { getMaterial } from "@/lib/materials";

const MAX_FIELD = 2000;
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

function bad(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Invalid form data.");
  }

  const type = String(form.get("type") ?? "") as SubmissionType;
  const spec = FORM_SPECS[type];
  if (!spec) return bad("Unknown form.");

  // Honeypot: real people never fill this hidden field.
  if (String(form.get("website") ?? "").trim()) return Response.json({ ok: true });

  const payload: Record<string, string | string[]> = {};
  for (const key of [...spec.required, ...spec.optional]) {
    if (spec.lists?.includes(key)) {
      const values = form.getAll(key).map((v) => String(v).slice(0, 100)).filter(Boolean);
      if (values.length) payload[key] = values;
    } else {
      const value = String(form.get(key) ?? "").trim().slice(0, MAX_FIELD);
      if (value) payload[key] = value;
    }
  }

  const missing = spec.required.filter((k) => !payload[k]);
  if (missing.length) return bad(`Please complete: ${missing.join(", ")}.`);

  const email = String(payload.email);
  if (!EMAIL_RE.test(email)) return bad("Please enter a valid email address.");

  let materialId: string | null = null;
  if (type === "material_request") {
    const material = getMaterial(String(payload.materialId));
    if (!material) return bad("Unknown material.");
    materialId = material.id;
  }

  const visitorId = String(form.get("visitorId") ?? "").slice(0, 64) || null;
  const source = String(form.get("source") ?? "").slice(0, 200);
  if (source) payload.source = source;

  // Photos (supplier form only). Stored next to the database; skipped, not
  // fatal, if the host has no writable disk.
  const photos = type === "supplier" ? form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0) : [];
  if (photos.length > MAX_PHOTOS) return bad(`Please upload at most ${MAX_PHOTOS} photos.`);
  for (const p of photos) {
    if (!PHOTO_TYPES[p.type]) return bad("Photos must be JPG, PNG, WEBP or HEIC.");
    if (p.size > MAX_PHOTO_BYTES) return bad("Each photo must be under 10 MB.");
  }

  let id: number;
  try {
    id = insertSubmission({ type, visitorId, materialId, email, payload });
  } catch (err) {
    console.error("[remade] could not store submission", err);
    await forwardSubmission({ type, materialId, ...payload, stored: false });
    if (process.env.FORMS_WEBHOOK_URL) return Response.json({ ok: true });
    return bad("We couldn't save your message. Please email us instead.", 500);
  }

  if (photos.length) {
    const saved: string[] = [];
    try {
      const dir = path.join(DATA_DIR, "uploads");
      await fs.mkdir(dir, { recursive: true });
      for (const [i, p] of photos.entries()) {
        const name = `${type}-${id}-${i + 1}.${PHOTO_TYPES[p.type]}`;
        await fs.writeFile(path.join(dir, name), Buffer.from(await p.arrayBuffer()));
        saved.push(name);
      }
    } catch (err) {
      console.error("[remade] could not store photos", err);
    }
    payload.photos = saved.length ? saved : photos.map((p) => `not stored: ${p.name}`);
    updateSubmissionPayload(id, payload);
  }

  await forwardSubmission({ id, type, materialId, ...payload });
  return Response.json({ ok: true, id });
}
