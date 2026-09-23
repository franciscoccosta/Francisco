"use client";

import { useState, type FormEvent } from "react";
import { submitForm } from "@/lib/analytics";
import { PREMIUM_OPTIONS, PRIORITIES, PROFESSIONS, PROJECT_TYPES, TIMEFRAMES, WOOD_TYPES } from "@/lib/forms";
import { ChoiceGroup, FormError, Honeypot, SelectField, Success, SubmitButton, TextField } from "./fields";

export function DesignerForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.getAll("priorities").length) {
      setError("Please choose at least one thing that matters most to you.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await submitForm("designer", data);
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
      <Success title="Welcome to ReMade.">
        <p>We&rsquo;ll let you know when materials matching your project become available.</p>
      </Success>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-6 md:grid-cols-2">
      <Honeypot />
      <TextField label="Name" name="name" required autoComplete="name" />
      <TextField label="Company / Studio" name="studio" autoComplete="organization" />
      <TextField label="Email" name="email" type="email" required autoComplete="email" />
      <SelectField label="Profession" name="profession" required options={PROFESSIONS} />
      <SelectField label="Project type" name="projectType" options={PROJECT_TYPES} />
      <TextField label="Project location" name="projectLocation" placeholder="e.g. Lisbon, Cascais…" />
      <SelectField label="What type of wood are you looking for?" name="woodType" required options={WOOD_TYPES} className="md:col-span-2" />
      <TextField label="Approximate quantity" name="quantity" placeholder="e.g. 60 m² / 10 beams" />
      <TextField label="Desired dimensions" name="dimensions" placeholder="e.g. beams ≥ 4 m, boards ≥ 180 mm wide" />
      <SelectField label="When do you need it?" name="timeframe" options={TIMEFRAMES} className="md:col-span-2" />

      <fieldset className="md:col-span-2">
        <legend className="mb-1 text-[0.85rem] font-semibold">
          What matters most to you?<span className="ml-0.5 text-wood">*</span>
        </legend>
        <p className="mb-3 text-xs text-ink-mute">Choose as many as you like.</p>
        <ChoiceGroup name="priorities" options={PRIORITIES} />
      </fieldset>

      <fieldset className="border-l-2 border-wood bg-cream p-5 md:col-span-2">
        <legend className="sr-only">Premium for provenance</legend>
        <p className="text-[0.95rem] font-semibold leading-snug">
          Would you consider paying a premium for reclaimed material with verified provenance and a unique story?
          <span className="ml-0.5 text-wood">*</span>
        </p>
        <div className="mt-4">
          <ChoiceGroup name="premium" type="radio" options={PREMIUM_OPTIONS} required />
        </div>
      </fieldset>

      <div className="md:col-span-2">
        <FormError message={error} />
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ink-mute">No account, no commitment. We&rsquo;ll only contact you about matching materials.</p>
        <SubmitButton pending={pending}>Join ReMade</SubmitButton>
      </div>
    </form>
  );
}
