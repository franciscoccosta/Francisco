"use client";

import { useState } from "react";
import { WOOD_TYPES } from "@/lib/forms";
import { compressImage } from "@/lib/compress-image";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { ChoiceGroup, FormError, Honeypot, SubmitButton, TextArea, TextField } from "@/components/forms/Fields";

export function SupplierForm() {
  const { status, errors, message, onSubmit } = useFormSubmit("supplier", {}, async (data) => {
    const photos = data.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    data.delete("photos");
    for (const photo of await Promise.all(photos.map(compressImage))) data.append("photos", photo);
  });
  const [files, setFiles] = useState<string[]>([]);

  if (status === "done") {
    return (
      <div className="py-16" role="status">
        <p className="eyebrow">Material reported</p>
        <p className="display mt-6 text-5xl md:text-6xl">Thank you.</p>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink">We&rsquo;ll review the material and contact you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-8 sm:grid-cols-2" noValidate encType="multipart/form-data">
      <Honeypot />
      <TextField label="Company name" name="company" required autoComplete="organization" error={errors.company} />
      <TextField label="Contact person" name="contact" required autoComplete="name" error={errors.contact} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <TextField label="Phone" name="phone" type="tel" autoComplete="tel" />
      <TextField label="Project location" name="location" required placeholder="e.g. Marvila, Lisbon" error={errors.location} />
      <TextField label="Project / building name" name="project" required error={errors.project} />
      <ChoiceGroup label="Type of wood / material" name="woodType" options={WOOD_TYPES} required error={errors.woodType} hint="Choose all that apply." className="sm:col-span-2" />
      <TextField label="Estimated quantity" name="quantity" required placeholder="e.g. 20 beams, 80 m² of flooring" error={errors.quantity} />
      <TextField label="Expected removal / demolition date" name="removalDate" type="month" />

      <div className="sm:col-span-2">
        <span className="field-label">
          Upload photos <span className="ml-1.5 font-normal text-muted">(optional)</span>
        </span>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-linen/40 px-6 py-8 text-center transition-colors hover:border-walnut">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-walnut" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
            <path d="M4 16v3h16v-3M12 4v11M7.5 8.5 12 4l4.5 4.5" />
          </svg>
          <span className="text-sm">{files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "Add photos of the material"}</span>
          <span className="text-xs text-muted">{files.length ? files.join(", ") : "Up to 6 photos · JPG, PNG, HEIC · 10 MB each"}</span>
          <input
            type="file"
            name="photos"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
        </label>
        {errors.photos && <p className="mt-1.5 text-xs text-[#9c3f2c]">{errors.photos}</p>}
      </div>

      <TextArea label="Additional information" name="notes" className="sm:col-span-2" placeholder="Condition, access to the site, anything we should know" />

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <SubmitButton sending={status === "sending"} cta="builder form submit">
          Report my material
        </SubmitButton>
        <p className="text-xs text-muted">Free. No account needed.</p>
      </div>
      <div className="sm:col-span-2">
        <FormError message={status === "error" ? message : undefined} />
      </div>
    </form>
  );
}
