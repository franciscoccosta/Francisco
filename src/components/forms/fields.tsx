"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  name,
  required = false,
  hint,
  children,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 flex items-baseline justify-between gap-3 text-[0.85rem] font-semibold text-ink">
        <span>
          {label}
          {required && <span className="ml-0.5 text-wood">*</span>}
        </span>
        {!required && <span className="text-xs font-normal text-ink-mute">Optional</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}

type InputProps = { label: string; name: string; required?: boolean; hint?: string; className?: string };

export function TextField({ type = "text", placeholder, autoComplete, ...p }: InputProps & { type?: string; placeholder?: string; autoComplete?: string }) {
  return (
    <Field {...p}>
      <input id={p.name} name={p.name} type={type} required={p.required} placeholder={placeholder} autoComplete={autoComplete} className="field-input" maxLength={300} />
    </Field>
  );
}

export function TextArea({ placeholder, rows = 4, ...p }: InputProps & { placeholder?: string; rows?: number }) {
  return (
    <Field {...p}>
      <textarea id={p.name} name={p.name} required={p.required} placeholder={placeholder} rows={rows} className="field-input resize-y" maxLength={2000} />
    </Field>
  );
}

export function SelectField({ options, placeholder = "Select…", ...p }: InputProps & { options: string[]; placeholder?: string }) {
  return (
    <Field {...p}>
      <div className="relative">
        <select id={p.name} name={p.name} required={p.required} defaultValue="" className="field-input appearance-none pr-10">
          <option value="" disabled={p.required}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </div>
    </Field>
  );
}

/** Pill-style checkbox or radio group. */
export function ChoiceGroup({
  name,
  options,
  type = "checkbox",
  required = false,
}: {
  name: string;
  options: string[];
  type?: "checkbox" | "radio";
  required?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o, i) => (
        <label key={o} className="cursor-pointer">
          <input
            type={type}
            name={name}
            value={o}
            required={type === "radio" && required && i === 0}
            className="peer sr-only"
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm text-ink-soft ring-1 ring-line transition-colors peer-checked:bg-ink peer-checked:text-cream peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-wood hover:ring-ink/40">
            {o}
          </span>
        </label>
      ))}
    </div>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-wood-dark disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : children}
      {!pending && (
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 10h13M11 5l5 5-5 5" />
        </svg>
      )}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="border-l-2 border-[#9c3f2c] bg-[#9c3f2c]/5 px-4 py-3 text-sm text-[#7d3223]">
      {message}
    </p>
  );
}

export function Success({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="status" className="animate-fade-up py-10 text-center">
      <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16 text-moss" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <circle cx="32" cy="32" r="8" />
        <circle cx="32" cy="32" r="17" />
        <circle cx="32" cy="32" r="28" />
        <path d="M27 32l4 4 7-8" strokeWidth="2" />
      </svg>
      <p className="display mx-auto mt-8 max-w-xl text-4xl md:text-5xl">{title}</p>
      {children && <div className="mx-auto mt-5 max-w-md text-ink-soft">{children}</div>}
    </div>
  );
}
