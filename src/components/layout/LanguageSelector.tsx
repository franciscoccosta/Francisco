"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "@/lib/i18n/locales";

export function LanguageSelector({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("hero", "languageLabel")}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
          tone === "dark"
            ? "border-charcoal/20 text-charcoal hover:border-charcoal/50"
            : "border-paper/30 text-paper hover:border-paper/70"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9s1.3-6.4 3.8-9Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {LOCALE_FLAGS[locale]}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-charcoal/10 bg-paper py-1 shadow-xl animate-fade-in">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-stone/60 ${
                l === locale ? "font-semibold text-ember" : "text-charcoal"
              }`}
            >
              {LOCALE_LABELS[l]}
              <span className="text-[10px] text-ink-soft">{LOCALE_FLAGS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
