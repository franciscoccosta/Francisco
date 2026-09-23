"use client";

import { PREMIUM, PRIORITIES, PROFESSIONS, PROJECT_TYPES, TIMEFRAMES, WOOD_TYPES } from "@/lib/forms";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { ChoiceGroup, FormError, Honeypot, SelectField, SubmitButton, TextField } from "@/components/forms/Fields";

export function BuyerForm() {
  const { status, errors, message, onSubmit } = useFormSubmit("buyer");

  if (status === "done") {
    return (
      <div className="py-16" role="status">
        <p className="eyebrow">You&rsquo;re in</p>
        <p className="display mt-6 text-5xl md:text-6xl">Welcome to ReMade.</p>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink">
          We&rsquo;ll let you know when materials matching your project become available.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-8 sm:grid-cols-2" noValidate>
      <Honeypot />
      <TextField label="Name" name="name" required autoComplete="name" error={errors.name} />
      <TextField label="Company / Studio" name="studio" required autoComplete="organization" error={errors.studio} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <SelectField label="Profession" name="profession" required options={PROFESSIONS} error={errors.profession} />
      <SelectField label="Project type" name="projectType" options={PROJECT_TYPES} />
      <TextField label="Project location" name="projectLocation" placeholder="e.g. Chiado, Lisbon" />
      <ChoiceGroup label="What type of wood are you looking for?" name="woodType" options={WOOD_TYPES} hint="Choose all that apply." className="sm:col-span-2" />
      <TextField label="Approximate quantity" name="quantity" placeholder="e.g. 60 m², 10 beams" />
      <TextField label="Desired dimensions" name="dimensions" placeholder="e.g. beams ≥ 4 m, boards ≥ 18 cm wide" />
      <SelectField label="When do you need it?" name="timeframe" options={TIMEFRAMES} className="sm:col-span-2 sm:max-w-sm" />

      <div className="border-t border-line pt-8 sm:col-span-2">
        <ChoiceGroup
          label="What matters most to you?"
          name="priorities"
          options={PRIORITIES}
          hint="Choose as many as you like — this helps us understand what Lisbon's designers value."
        />
      </div>

      <div className="border border-line bg-cream p-6 sm:col-span-2">
        <ChoiceGroup
          label="Would you consider paying a premium for reclaimed material with verified provenance and a unique story?"
          name="premium"
          options={PREMIUM}
          multiple={false}
          required
          error={errors.premium}
        />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <SubmitButton sending={status === "sending"} cta="designer form submit">
          Join ReMade
        </SubmitButton>
        <p className="text-xs text-muted">Free. No account, no spam — only materials that match.</p>
      </div>
      <div className="sm:col-span-2">
        <FormError message={status === "error" ? message : undefined} />
      </div>
    </form>
  );
}
