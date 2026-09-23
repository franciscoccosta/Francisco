"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { CATEGORY_ITEMS, categoryLabel } from "@/lib/i18n/categories";
import { materialLabel, materialSwatch } from "@/lib/i18n/materials";
import { MATERIALS } from "@/lib/data";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const POPULAR_CATEGORY_IDS = [
  "dining-table", "living-chair", "desk", "bedside-table", "bookshelf", "coffee-table",
  "outdoor-bench", "console", "shelving-unit", "armchair", "side-table", "storage-unit",
];

export default function BecomePage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("become", "title"));
  const [selected, setSelected] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!selected) return [];
    return MATERIALS.filter((m) => m.status === "available" || m.status === "processing").flatMap((m) =>
      m.possibilities
        .filter((p) => p.categoryId === selected)
        .map((p) => ({ material: m, possibility: p }))
    );
  }, [selected]);

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl sm:text-4xl">{t("become", "title")}</h1>
        <p className="mt-3 text-ink-soft">{t("become", "subtitle")}</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {t("become", "chooseTypeTitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected === id ? "border-ember bg-ember text-paper" : "border-charcoal/15 text-charcoal hover:border-charcoal/40"
              }`}
            >
              {categoryLabel(id, locale)}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="mx-auto mt-12 max-w-4xl">
          <h2 className="mb-6 text-center font-display text-2xl">
            {t("become", "resultTitle")} {categoryLabel(selected, locale).toLowerCase()}
          </h2>

          {matches.length === 0 ? (
            <EmptyState
              title={t("become", "noMaterialTitle")}
              description={t("become", "noMaterialDesc")}
              action={<ButtonLink href="/marketplace" variant="outline">{t("nav", "marketplace")}</ButtonLink>}
            />
          ) : (
            <div className="space-y-5">
              {matches.map(({ material, possibility }, i) => (
                <div key={i} className="grid gap-5 rounded-2xl border border-charcoal/10 bg-white/50 p-5 sm:grid-cols-[160px_1fr] sm:items-center">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square overflow-hidden rounded-xl">
                      <MaterialSwatch swatch={materialSwatch(material.materialTypeId)} className="h-full w-full" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-xl">
                      <FurnitureArt categoryId={selected!} materialSwatch={materialSwatch(material.materialTypeId)} className="h-full w-full" />
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{t("become", "availableMaterialLabel")}</p>
                      <p className="font-medium text-charcoal">{materialLabel(material.materialTypeId, locale)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{t("become", "potentialDesignLabel")}</p>
                      <p className="font-medium text-charcoal">{categoryLabel(selected, locale)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{t("become", "estimatedPriceLabel")}</p>
                      <p className="font-display text-lg text-ember">€{possibility.estimatedPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{t("become", "estimatedAssemblyLabel")}</p>
                      <p className="font-medium text-charcoal">~30–60 {t("product", "minutes")}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{t("become", "materialStoryLabel")}</p>
                      <p className="text-ink-soft">{material.notes}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-charcoal/20 p-6 text-center">
                <p className="font-medium text-charcoal">{t("become", "notifyTitle")}</p>
                <p className="mt-1 text-sm text-ink-soft">{t("become", "notifyDesc")}</p>
                <Button variant="outline" size="sm" className="mt-4">{t("become", "notifyCta")}</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {!selected && (
        <div className="mt-10 text-center">
          <Link href="/marketplace" className="text-sm font-medium text-ember hover:underline">
            {t("nav", "marketplace")} →
          </Link>
        </div>
      )}
    </div>
  );
}
