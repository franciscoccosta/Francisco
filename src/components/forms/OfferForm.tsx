"use client";

import { useState, type FormEvent } from "react";
import { submitForm } from "@/lib/analytics";
import { WOOD_TYPES } from "@/lib/forms";
import { Field, FormError, Honeypot, SelectField, Success, SubmitButton, TextArea, TextField } from "./fields";

export function OfferForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await submitForm("supplier", new FormData(e.currentTarget));
      setDone(true);
      window.scrollTo({ top: (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <Success title="Thank you. We’ll review the material and contact you shortly.">
        <p>Keep the material where it is for now — whenever possible, it stays on site until a buyer is found.</p>
      </Success>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-6 md:grid-cols-2" encType="multipart/form-data">
      <Honeypot />
      <TextField label="Company name" name="company" required autoComplete="organization" />
      <TextField label="Contact person" name="contact" required autoComplete="name" />
      <TextField label="Email" name="email" type="email" required autoComplete="email" />
      <TextField label="Phone" name="phone" type="tel" autoComplete="tel" />
      <TextField label="Project location" name="projectLocation" required placeholder="e.g. Rua da Prata, Baixa" />
      <TextField label="Project / building name" name="projectName" required placeholder="e.g. Rehabilitation of Rua X, 12" />
      <SelectField label="Type of wood / material" name="woodType" required options={WOOD_TYPES} />
      <TextField label="Estimated quantity" name="quantity" required placeholder="e.g. 20 beams, 80 m² flooring" />
      <TextField label="Expected removal / demolition date" name="removalDate" type="date" />

      <Field label="Upload photos" name="photos" hint="Up to 6 photos, 10 MB each. Phone photos are perfect.">
        <label
          htmlFor="photos"
          className="flex cursor-pointer items-center gap-3 border border-dashed border-ink/25 bg-paper px-4 py-3 text-sm text-ink-soft transition-colors hover:border-wood hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-wood" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="1.5" />
            <circle cx="9" cy="10" r="2" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
          <span className="truncate">{files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "Choose photos…"}</span>
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="sr-only"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </Field>

      <TextArea
        label="Additional information"
        name="notes"
        className="md:col-span-2"
        placeholder="Condition, where the wood is in the building, access to the site, anything else useful."
      />

      <div className="md:col-span-2">
        <FormError message={error} />
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ink-mute">Free. No account needed. We only use your details to contact you about this material.</p>
        <SubmitButton pending={pending}>Report my material</SubmitButton>
      </div>
    </form>
  );
}
