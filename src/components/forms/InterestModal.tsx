"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitForm, track } from "@/lib/analytics";
import { FormError, Honeypot, Success, SubmitButton, TextArea, TextField } from "./fields";

/** "I'm interested in this material" button + short request form in a dialog. */
export function InterestButton({ materialId, materialName, slug }: { materialId: string; materialName: string; slug: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const open = () => {
    dialog.current?.showModal();
    track("interest_open", { materialId });
  };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const d = dialog.current;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d?.close(); // click on backdrop
    };
    d?.addEventListener("click", onClick);
    return () => d?.removeEventListener("click", onClick);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const data = new FormData(e.currentTarget);
      data.set("materialId", slug);
      await submitForm("material_request", data);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        data-cta={`passport_interested_${materialId}`}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-wood-dark"
      >
        I&rsquo;m interested in this material
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 10h13M11 5l5 5-5 5" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="interest-title"
        className="m-auto max-h-[92svh] w-[min(640px,calc(100%-2rem))] overflow-y-auto rounded-[3px] bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-fade-up"
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5 md:px-8">
          <div>
            <p className="eyebrow text-wood">{materialId}</p>
            <h2 id="interest-title" className="display mt-1 text-3xl">
              {done ? "Request received" : "Request this material"}
            </h2>
            {!done && <p className="mt-1 text-sm text-ink-soft">{materialName}</p>}
          </div>
          <button type="button" onClick={close} aria-label="Close" className="-mr-2 p-2 text-ink-mute hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          {done ? (
            <Success title="Thank you — we'll be in touch.">
              <p>We&rsquo;ll contact you shortly with availability, verification status and next steps for this material.</p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <button type="button" onClick={close} className="text-sm font-semibold underline underline-offset-4">
                  Back to the passport
                </button>
                <Link href="/materials" className="text-sm text-ink-mute hover:text-ink">
                  Browse more materials
                </Link>
              </div>
            </Success>
          ) : (
            <form onSubmit={onSubmit} className="relative grid gap-5 md:grid-cols-2">
              <Honeypot />
              <TextField label="Name" name="name" required autoComplete="name" />
              <TextField label="Company" name="company" autoComplete="organization" />
              <TextField label="Email" name="email" type="email" required autoComplete="email" className="md:col-span-2" />
              <TextField label="Project" name="project" placeholder="e.g. Restaurant fit-out, Príncipe Real" />
              <TextField label="Estimated quantity required" name="quantity" placeholder="e.g. 12 beams / 40 m²" />
              <TextArea label="Message" name="message" rows={3} className="md:col-span-2" placeholder="Anything we should know?" />
              <div className="md:col-span-2">
                <FormError message={error} />
              </div>
              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-ink-mute">No payment or commitment. This is a request, not an order.</p>
                <SubmitButton pending={pending}>Request this material</SubmitButton>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
