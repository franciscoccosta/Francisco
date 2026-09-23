import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Common = { label: string; name: string; error?: string; hint?: string; className?: string };

function Wrap({ label, name, error, hint, className = "", required, children }: Common & { required?: boolean; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
        {!required && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-[#9c3f2c]">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, name, error, hint, className, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className} required={rest.required}>
      <input id={name} name={name} className="field" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} {...rest} />
    </Wrap>
  );
}

export function TextArea({ label, name, error, hint, className, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className} required={rest.required}>
      <textarea id={name} name={name} rows={3} className="field resize-y" aria-invalid={!!error} {...rest} />
    </Wrap>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  className,
  options,
  placeholder = "Select…",
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className} required={rest.required}>
      <select id={name} name={name} className="field" defaultValue="" aria-invalid={!!error} {...rest}>
        <option value="" disabled={rest.required}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Wrap>
  );
}

/** Pill-style checkboxes (multi) or radios (single). */
export function ChoiceGroup({
  label,
  name,
  options,
  multiple = true,
  required,
  error,
  hint,
  className = "",
}: Common & { options: string[]; multiple?: boolean; required?: boolean }) {
  return (
    <fieldset className={className} aria-invalid={!!error}>
      <legend className="field-label">
        {label}
        {!required && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </legend>
      {hint && <p className="-mt-1 mb-3 text-xs text-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o} className="chip">
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o}
              className="sr-only"
              required={!multiple && required && i === 0}
            />
            {o}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-[#9c3f2c]">{error}</p>}
    </fieldset>
  );
}

/** Invisible to people; bots fill it and get silently dropped. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ sending, children, cta, className = "" }: { sending: boolean; children: ReactNode; cta: string; className?: string }) {
  return (
    <button type="submit" disabled={sending} data-cta={cta} className={`btn btn-dark min-h-14 px-8 text-base disabled:opacity-60 ${className}`}>
      {sending ? "Sending…" : children}
    </button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-[#9c3f2c]">
      {message}
    </p>
  );
}
