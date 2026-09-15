"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { useCart } from "@/lib/cart/context";
import { PRODUCTS } from "@/lib/data";
import { categoryLabel } from "@/lib/i18n/categories";
import { materialLabel } from "@/lib/i18n/materials";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { ButtonLink, Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("cart", "title"));
  const { lines, removeItem } = useCart();

  const items = lines
    .map((line) => ({ line, product: PRODUCTS.find((p) => p.id === line.productId) }))
    .filter((i): i is { line: typeof lines[number]; product: NonNullable<(typeof PRODUCTS)[number]> } => Boolean(i.product));

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.line.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <EmptyState
          title={t("cart", "empty")}
          description={t("cart", "emptyDesc")}
          action={<ButtonLink href="/marketplace">{t("cart", "browseCta")}</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 font-display text-3xl sm:text-4xl">{t("cart", "title")}</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map(({ line, product }) => (
            <div key={line.productId} className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white/40 p-4">
              <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone">
                <FurnitureArt categoryId={product.categoryId} className="h-full w-full" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-display text-lg hover:text-ember">
                      {categoryLabel(product.categoryId, locale)} #{product.code}
                    </Link>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-soft">
                      {materialLabel(product.materialTypeId, locale)}
                    </p>
                  </div>
                  <span className="font-display text-lg text-ember">€{product.price}</span>
                </div>
                <button onClick={() => removeItem(product.id)} className="mt-2 self-start text-xs font-medium text-ink-soft hover:text-bad">
                  {t("cart", "remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-charcoal/10 bg-paper-dim p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">{t("cart", "subtotal")}</span>
            <span className="font-display text-xl text-charcoal">€{subtotal}</span>
          </div>
          <p className="mt-2 text-xs text-ink-soft">{t("cart", "shippingNote")}</p>
          <ButtonLink href="/checkout" className="mt-6 w-full">{t("cart", "proceedToCheckout")}</ButtonLink>
          <div className="mt-3 text-center">
            <Link href="/marketplace" className="text-sm text-ink-soft hover:text-ember">
              {t("cart", "continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

