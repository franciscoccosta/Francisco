"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { categoryLabel } from "@/lib/i18n/categories";
import { materialLabel, materialSwatch } from "@/lib/i18n/materials";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const name = `${categoryLabel(product.categoryId, locale)} #${product.code}`;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-charcoal/8 bg-white/40 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <FurnitureArt
            categoryId={product.categoryId}
            materialSwatch={materialSwatch(product.materialTypeId)}
            background="#EAE2D2"
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <MaterialSwatch swatch={materialSwatch(product.materialTypeId)} className="h-full w-full" />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.oneOfOne && <Badge tone="ember">{t("product", "oneOfOne")}</Badge>}
          {product.status !== "available" && (
            <Badge tone="charcoal">{t("product", product.status === "reserved" ? "reserved" : "sold")}</Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-snug text-charcoal">{name}</h3>
          <span className="whitespace-nowrap font-display text-lg text-ember">€{product.price}</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
          {materialLabel(product.materialTypeId, locale)}
        </p>
      </div>
    </Link>
  );
}
