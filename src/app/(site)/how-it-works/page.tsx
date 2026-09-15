"use client";

import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { ButtonLink } from "@/components/ui/Button";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";

const STEPS = [
  { n: "01", titleKey: "step1Title" as const, descKey: "step1Desc" as const, visual: "material" as const },
  { n: "02", titleKey: "step2Title" as const, descKey: "step2Desc" as const, visual: "intelligence" as const },
  { n: "03", titleKey: "step3Title" as const, descKey: "step3Desc" as const, visual: "routing" as const },
  { n: "04", titleKey: "step4Title" as const, descKey: "step4Desc" as const, visual: "transformation" as const },
  { n: "05", titleKey: "step5Title" as const, descKey: "step5Desc" as const, visual: "life" as const },
];

export default function HowItWorksPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("howItWorks", "title"));

  return (
    <div>
      <section className="container-page py-16 text-center sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("howItWorks", "kicker")}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl sm:text-5xl">{t("howItWorks", "title")}</h1>
      </section>

      <section className="container-page pb-20">
        <div className="space-y-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`grid items-center gap-8 rounded-3xl border border-charcoal/10 bg-white/40 p-6 sm:p-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <span className="font-display text-5xl text-ember/40">{s.n}</span>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl">{t("howItWorks", s.titleKey)}</h2>
                <p className="mt-3 max-w-md text-ink-soft">{t("howItWorks", s.descKey)}</p>
              </div>
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-stone">
                {s.visual === "material" && <MaterialSwatch swatch="oak" className="h-full w-full" />}
                {s.visual === "transformation" && <FurnitureArt categoryId="dining-table" className="h-full w-full" />}
                {s.visual === "life" && <FurnitureArt categoryId="bookshelf" className="h-full w-full" />}
                {(s.visual === "intelligence" || s.visual === "routing") && (
                  <div className="flex h-full w-full items-center justify-center bg-charcoal text-paper">
                    <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
                      {s.visual === "intelligence" ? (
                        <>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </>
                      ) : (
                        <path d="M4 6h16M4 6l5 6-5 6M20 6l-5 6 5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-24 text-center">
        <ButtonLink href="/marketplace" size="lg">{t("howItWorks", "cta")}</ButtonLink>
      </section>
    </div>
  );
}
