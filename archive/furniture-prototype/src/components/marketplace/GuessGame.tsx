"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { categoryLabel, CATEGORY_ITEMS } from "@/lib/i18n/categories";
import { materialSwatch } from "@/lib/i18n/materials";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { BeforeAfterSlider } from "@/components/visuals/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";

function pickDistractors(correctId: string, seed: string, count = 3): string[] {
  const others = CATEGORY_ITEMS.map((c) => c.id).filter((id) => id !== correctId);
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const shuffled = [...others].sort((a, b) => {
    const ha = (h + a.length * 7) % 97;
    const hb = (h + b.length * 7) % 97;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

export function GuessGame({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { t, locale } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const options = useMemo(() => {
    const distractors = pickDistractors(product.categoryId, product.id);
    const all = [product.categoryId, ...distractors];
    return all.sort((a, b) => (a + product.id).localeCompare(b + product.id));
  }, [product.categoryId, product.id]);

  const correct = selected === product.categoryId;

  return (
    <div className={`rounded-3xl border border-charcoal/10 bg-white/50 p-6 ${compact ? "" : "sm:p-8"}`}>
      {!revealed ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("product", "guessKicker")}</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:items-center">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <MaterialSwatch swatch={materialSwatch(product.materialTypeId)} className="h-full w-full" />
            </div>
            <div>
              <p className="font-display text-xl text-charcoal">{t("product", "guessQuestion")}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {options.map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      selected === id
                        ? "border-ember bg-ember/10 text-ember font-semibold"
                        : "border-charcoal/15 text-charcoal hover:border-charcoal/40"
                    }`}
                  >
                    {categoryLabel(id, locale)}
                  </button>
                ))}
              </div>
              {selected && (
                <div className="mt-4 flex items-center gap-3">
                  <p className={`text-sm font-medium ${correct ? "text-good" : "text-bad"}`}>
                    {correct ? t("product", "guessCorrect") : t("product", "guessIncorrect")}
                  </p>
                  <Button size="sm" variant="secondary" onClick={() => setRevealed(true)}>
                    {t("product", "guessReveal")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <BeforeAfterSlider
            beforeLabel="Before"
            afterLabel="After"
            before={<MaterialSwatch swatch={materialSwatch(product.materialTypeId)} className="h-full w-full" />}
            after={
              <FurnitureArt
                categoryId={product.categoryId}
                materialSwatch={materialSwatch(product.materialTypeId)}
                className="h-full w-full"
              />
            }
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="font-display text-lg text-charcoal">
              {categoryLabel(product.categoryId, locale)} #{product.code}
            </p>
            <button
              onClick={() => {
                setRevealed(false);
                setSelected(null);
              }}
              className="text-sm font-medium text-ember hover:underline"
            >
              {t("product", "guessPlayAgain")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
