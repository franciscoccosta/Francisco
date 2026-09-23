"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";

const CATEGORIES = [
  { key: "construction" as const },
  { key: "architects" as const },
  { key: "designers" as const },
  { key: "makers" as const },
  { key: "others" as const },
];

const CATEGORY_ART: Record<string, string> = {
  construction: "outdoor-table",
  architects: "console",
  designers: "coffee-table",
  makers: "living-bench",
  others: "decorative-object",
};

export default function WorkWithUsPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("workWithUs", "title"));
  const [category, setCategory] = useState("construction");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <section className="container-page py-16 text-center sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("workWithUs", "kicker")}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl sm:text-5xl">{t("workWithUs", "title")}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t("workWithUs", "subtitle")}</p>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors ${
                category === c.key ? "border-ember bg-ember/5" : "border-charcoal/10 bg-white/40 hover:border-charcoal/30"
              }`}
            >
              <div className="aspect-square w-14 overflow-hidden rounded-full bg-stone">
                <FurnitureArt categoryId={CATEGORY_ART[c.key]} className="h-full w-full" />
              </div>
              <div>
                <p className="font-display text-base">{t("workWithUs", `${c.key}Title` as const)}</p>
                <p className="mt-1 text-xs text-ink-soft">{t("workWithUs", `${c.key}Desc` as const)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="mx-auto max-w-lg rounded-3xl border border-charcoal/10 bg-white/50 p-8">
          <h2 className="font-display text-xl">{t("workWithUs", "formTitle")}</h2>
          {submitted ? (
            <div className="mt-6 text-center">
              <p className="font-display text-lg text-ember">{t("workWithUs", "thanksTitle")}</p>
              <p className="mt-1 text-sm text-ink-soft">{t("workWithUs", "thanksDesc")}</p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <Label>{t("workWithUs", "formName")}</Label>
                <Input required />
              </div>
              <div>
                <Label>{t("workWithUs", "formCompany")}</Label>
                <Input />
              </div>
              <div>
                <Label>{t("workWithUs", "formEmail")}</Label>
                <Input type="email" required />
              </div>
              <div>
                <Label>{t("workWithUs", "formCategory")}</Label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{t("workWithUs", `${c.key}Title` as const)}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>{t("workWithUs", "formMessage")}</Label>
                <Textarea rows={4} required />
              </div>
              <Button type="submit" className="w-full">{t("workWithUs", "formSubmit")}</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
