"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/context";

function CompassIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14.6 9.4 L13 13 L9.4 14.6 L11 11 Z" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M4.5 9.2 L12 4.5 L19.5 9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.2" y="9.2" width="13.6" height="10.3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="10.3" y="14" width="3.4" height="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="7" y="11.6" width="2" height="2" fill="currentColor" opacity="0.85" />
      <rect x="15" y="11.6" width="2" height="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="5.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="15" cy="15" r="5.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const PATHS = [
  { key: "explore" as const, href: "/discover", Icon: CompassIcon },
  { key: "partner" as const, href: "/partner/login", Icon: BuildingIcon },
  { key: "work" as const, href: "/work-with-us", Icon: LinkIcon },
];

export default function EntryPage() {
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-screen flex-col bg-charcoal text-paper">
      <div className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="inline-flex items-center gap-2 font-display text-xl">
          <LogoMark className="h-7 w-7 text-ember-light" />
          ReMade
        </div>
        <LanguageSelector tone="light" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-ember-light">
          {t("entry", "eyebrow")}
        </p>
        <h1 className="animate-fade-up mt-4 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl md:text-6xl" style={{ animationDelay: "80ms" }}>
          {t("entry", "title")}
        </h1>
        <p className="animate-fade-up mt-4 max-w-lg text-balance text-paper/70" style={{ animationDelay: "140ms" }}>
          {t("entry", "subtitle")}
        </p>

        <div className="animate-fade-up mt-12 grid w-full max-w-5xl gap-5 sm:grid-cols-3" style={{ animationDelay: "200ms" }}>
          {PATHS.map(({ key, href, Icon }) => (
            <Link
              key={key}
              href={href}
              className="group relative flex flex-col items-start overflow-hidden border border-paper/12 bg-paper/[0.03] p-7 text-left transition-all hover:border-ember-light/40 hover:bg-paper/[0.06]"
            >
              <div className="mb-6 text-ember-light">
                <Icon />
              </div>
              <h2 className="font-display text-xl text-paper">{t("entry", `${key}Title` as const)}</h2>
              <p className="mt-2 text-sm text-paper/60">{t("entry", `${key}Desc` as const)}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-light">
                {t("entry", `${key}Cta` as const)}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <p className="pb-8 text-center text-xs text-paper/40">{t("entry", "footer")}</p>
    </main>
  );
}
