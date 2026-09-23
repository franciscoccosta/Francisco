"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { FormError, Honeypot, SubmitButton, TextArea, TextField } from "@/components/forms/Fields";

export function InterestButton({ slug, id, material, className = "", label = "I'm interested in this material" }: { slug: string; id: string; material: string; className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`btn btn-dark min-h-14 px-8 text-base ${className}`}
        data-cta={`passport: interested ${id}`}
        onClick={() => {
          setOpen(true);
          track("interest_open", { materialId: slug });
        }}
      >
        {label}
      </button>
      {open && <InterestModal slug={slug} id={id} material={material} onClose={() => setOpen(false)} />}
    </>
  );
}

function InterestModal({ slug, id, material, onClose }: { slug: string; id: string; material: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { status, errors, message, onSubmit } = useFormSubmit("request", { materialId: slug });

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(640px,calc(100%-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[3px] bg-cream p-0 text-charcoal shadow-2xl backdrop:bg-charcoal/60 backdrop:backdrop-blur-sm open:animate-[dialog-in_.5s_cubic-bezier(.22,1,.36,1)]"
    >
      <div className="relative p-7 sm:p-10">
        <button type="button" onClick={onClose} className="absolute top-5 right-5 p-2 text-muted hover:text-charcoal" aria-label="Close">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="py-10 text-center">
            <p className="eyebrow">Request received · {id}</p>
            <p className="display mt-5 text-5xl">Thank you.</p>
            <p className="mx-auto mt-5 max-w-sm leading-relaxed text-ink">
              We&rsquo;ve noted your interest in this material and will be in touch about availability, condition and next steps.
            </p>
            <button type="button" onClick={onClose} className="btn btn-outline mt-8">
              Back to the passport
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Request · {id}</p>
            <h2 className="display mt-3 pr-8 text-4xl">{material}</h2>
            <p className="mt-3 text-sm text-muted">No payment, no commitment — just tell us about your project.</p>

            <form onSubmit={onSubmit} className="relative mt-8 grid gap-6 sm:grid-cols-2" noValidate>
              <Honeypot />
              <TextField label="Name" name="name" required autoComplete="name" error={errors.name} />
              <TextField label="Company" name="company" required autoComplete="organization" error={errors.company} />
              <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} className="sm:col-span-2" />
              <TextField label="Project" name="project" placeholder="e.g. Restaurant fit-out, Príncipe Real" />
              <TextField label="Estimated quantity required" name="quantity" placeholder="e.g. 40 m², 6 beams" />
              <TextArea label="Message" name="message" className="sm:col-span-2" />
              <div className="flex flex-col gap-3 sm:col-span-2">
                <FormError message={status === "error" ? message : undefined} />
                <SubmitButton sending={status === "sending"} cta={`request submit ${id}`} className="w-full">
                  Request this material
                </SubmitButton>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
