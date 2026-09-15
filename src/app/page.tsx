"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/context";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";

const PATHS = [
  { key: "explore" as const, href: "/discover", art: "dining-table" },
  { key: "partner" as const, href: "/partner/login", art: "console" },
  { key: "work" as const, href: "/work-with-us", art: "shelving-unit" },
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
          {PATHS.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-paper/10 bg-paper/5 p-6 text-left transition-all hover:border-ember/50 hover:bg-paper/10"
            >
              <div className="mb-5 aspect-[5/3] overflow-hidden rounded-xl bg-paper/5">
                <FurnitureArt
                  categoryId={p.art}
                  background="transparent"
                  stroke="#F7F2EA"
                  accent="#B6531F"
                  className="h-full w-full opacity-80 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h2 className="font-display text-xl text-paper">{t("entry", `${p.key}Title` as const)}</h2>
              <p className="mt-2 text-sm text-paper/60">{t("entry", `${p.key}Desc` as const)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-light">
                {t("entry", `${p.key}Cta` as const)}
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
