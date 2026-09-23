"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { PRODUCTS, relatedProducts } from "@/lib/data";
import { categoryLabel } from "@/lib/i18n/categories";
import { materialLabel, materialSwatch } from "@/lib/i18n/materials";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { BeforeAfterSlider } from "@/components/visuals/BeforeAfterSlider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useCart } from "@/lib/cart/context";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { t, locale, localize } = useLanguage();
  const { addItem, lines } = useCart();
  const [assemblyRequested, setAssemblyRequested] = useState(false);

  const product = PRODUCTS.find((p) => p.slug === params.slug);
  useDocumentTitle(product ? `${categoryLabel(product.categoryId, locale)} #${product.code}` : t("errors", "notFoundTitle"));

  if (!product) {
    return (
      <div className="container-page py-24">
        <EmptyState
          title={t("errors", "notFoundTitle")}
          description={t("errors", "notFoundDesc")}
          action={<ButtonLink href="/marketplace">{t("nav", "marketplace")}</ButtonLink>}
        />
      </div>
    );
  }

  const name = `${categoryLabel(product.categoryId, locale)} #${product.code}`;
  const inCart = lines.some((l) => l.productId === product.id);
  const swatch = materialSwatch(product.materialTypeId);
  const related = relatedProducts(product);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 text-xs text-ink-soft">
        <Link href="/marketplace" className="hover:text-ember">{t("nav", "marketplace")}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">{name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <BeforeAfterSlider
            className="shadow-sm"
            beforeLabel={t("product", "theMaterialTitle")}
            afterLabel={name}
            before={<MaterialSwatch swatch={swatch} className="h-full w-full" />}
            after={<FurnitureArt categoryId={product.categoryId} materialSwatch={swatch} className="h-full w-full" />}
          />
          <p className="mt-3 text-center text-xs text-ink-soft">{t("product", "beforeAfterHint")}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            {product.oneOfOne && <Badge tone="ember">{t("product", "oneOfOne")}</Badge>}
            <Badge tone={product.status === "available" ? "good" : "charcoal"}>
              {t("product", product.status === "available" ? "available" : product.status === "reserved" ? "reserved" : "sold")}
            </Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl">{name}</h1>
          <p className="mt-3 max-w-md text-ink-soft">{localize(product.description)}</p>
          <p className="mt-5 font-display text-3xl text-ember">€{product.price}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {product.status === "available" ? (
              <Button size="lg" onClick={() => addItem(product.id)} disabled={inCart}>
                {inCart ? `✓ ${t("product", "addedToCart")}` : t("product", "addToCart")}
              </Button>
            ) : (
              <div className="rounded-xl border border-dashed border-charcoal/20 px-4 py-3 text-sm text-ink-soft">
                {t("errors", "productUnavailableTitle")} — {t("errors", "productUnavailableDesc")}
              </div>
            )}
          </div>

          {/* Identity block */}
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-charcoal/10 pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "pieceNumberLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">#{product.code}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "dimensionsLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "materialTypeLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">{materialLabel(product.materialTypeId, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "conditionLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">
                {t("filters", product.condition === "excellent" ? "conditionExcellent" : product.condition === "good" ? "conditionGood" : "conditionFair")}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "originLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">{product.originCity}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">{t("product", "producedLabel")}</dt>
              <dd className="mt-0.5 font-medium text-charcoal">{product.createdAt}</dd>
            </div>
          </dl>

          {/* Why unique */}
          <div className="mt-8 rounded-2xl bg-paper-dim p-5">
            <h3 className="font-display text-lg">{t("product", "whyUniqueTitle")}</h3>
            <p className="mt-2 text-sm text-ink-soft">{t("product", "whyUniqueBody")}</p>
          </div>

          {/* What you receive */}
          <div className="mt-8">
            <h3 className="font-display text-lg">{t("product", "whatYouReceiveTitle")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-charcoal">
              {(["receiveItem1", "receiveItem2", "receiveItem3", "receiveItem4"] as const).map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-ember">
                    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t("product", k)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Material story */}
      <section className="mt-16 grid gap-8 rounded-3xl border border-charcoal/10 bg-white/40 p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">
          <MaterialSwatch swatch={swatch} className="h-full w-full" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("product", "materialStoryTitle")}</p>
          <p className="mt-3 text-lg leading-relaxed text-charcoal">{localize(product.story)}</p>
          <p className="mt-4 text-sm text-ink-soft">{t("product", "theMaterialOrigin")}</p>
        </div>
      </section>

      {/* Assembly */}
      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl">{t("product", "assemblyTitle")}</h2>
          <p className="text-sm text-ink-soft">
            {t("product", "estimatedTime")}: <span className="font-medium text-charcoal">{product.assemblyTimeMinutes} {t("product", "minutes")}</span>
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.assemblySteps.map((step, i) => (
            <li key={i} className="rounded-2xl border border-charcoal/10 bg-white/40 p-5">
              <span className="font-display text-2xl text-ember">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("product", "stepLabel")} {i + 1}</p>
              <p className="mt-1 font-medium text-charcoal">{localize(step.title)}</p>
              <p className="mt-1 text-sm text-ink-soft">{localize(step.detail)}</p>
            </li>
          ))}
        </ol>

        {product.needsProAssembly && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-charcoal px-6 py-5 text-paper">
            <div>
              <p className="font-medium">{t("product", "needProAssembly")}</p>
              <p className="text-sm text-paper/60">{t("common", "requestService")}</p>
            </div>
            {assemblyRequested ? (
              <span className="text-sm font-medium text-ember-light">✓ {t("common", "confirm")}</span>
            ) : (
              <Button variant="dark" onClick={() => setAssemblyRequested(true)}>
                {t("product", "requestAssembly")}
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl">{t("product", "relatedTitle")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
