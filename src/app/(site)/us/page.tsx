"use client";

import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { TEAM } from "@/lib/data/team";
import { ButtonLink } from "@/components/ui/Button";

export default function UsPage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("us", "title"));

  return (
    <div>
      <section className="container-page py-16 text-center sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("us", "kicker")}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl sm:text-5xl">{t("us", "title")}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t("us", "subtitle")}</p>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-charcoal p-8 text-paper sm:p-12">
          <h2 className="font-display text-2xl">{t("us", "purposeTitle")}</h2>
          <ul className="mt-6 space-y-4 text-lg leading-relaxed text-paper/80">
            <li className="flex gap-3">
              <span className="text-ember-light">—</span>
              {t("us", "purposeBelief1")}
            </li>
            <li className="flex gap-3">
              <span className="text-ember-light">—</span>
              {t("us", "purposeBelief2")}
            </li>
            <li className="flex gap-3">
              <span className="text-ember-light">—</span>
              {t("us", "purposeBelief3")}
            </li>
          </ul>
        </div>
      </section>

      <section className="container-page pb-20 sm:pb-28">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl">{t("us", "teamTitle")}</h2>
          <p className="mt-2 text-ink-soft">{t("us", "teamSubtitle")}</p>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {TEAM.map((member, i) => (
            <div key={member.id} className="rounded-2xl border border-charcoal/10 bg-white/40 p-5 text-center">
              <div
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full font-display text-lg text-paper"
                style={{ background: i % 2 === 0 ? "#B6531F" : "#211C17" }}
              >
                {member.initials}
              </div>
              <p className="font-display text-lg">{member.placeholderName}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">{member.nationality[locale]}</p>
              <p className="mt-2 text-xs text-ink-soft">{t("us", "roleLabel")}: {t("us", "teamSubtitle")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-24 text-center">
        <div className="overflow-hidden rounded-3xl bg-charcoal px-6 py-14 text-paper sm:px-16">
          <h2 className="mx-auto max-w-xl text-balance font-display text-2xl sm:text-3xl">{t("finalCta", "title")}</h2>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/marketplace">{t("finalCta", "exploreCta")}</ButtonLink>
          </div>
          <p className="mt-8 text-sm text-paper/60">{t("finalCta", "workTitle")}</p>
          <div className="mt-3 flex justify-center">
            <ButtonLink href="/work-with-us" variant="outline" className="!border-paper/30 !text-paper hover:!border-paper">
              {t("finalCta", "workCta")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
