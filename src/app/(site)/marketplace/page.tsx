"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { PRODUCTS } from "@/lib/data";
import { categoryLabel, roomForCategory } from "@/lib/i18n/categories";
import { FilterPanel, DEFAULT_FILTERS, type Filters } from "@/components/marketplace/FilterPanel";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

function MarketplaceInner() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("nav", "marketplace"));
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get("room");
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, roomId: initialRoom });
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.status === "available");

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((p) => {
        const name = `${categoryLabel(p.categoryId, locale)} ${p.code}`.toLowerCase();
        const localized = p.description[locale]?.toLowerCase() ?? "";
        return name.includes(q) || localized.includes(q) || p.description.en.toLowerCase().includes(q);
      });
    }
    if (filters.categoryId) list = list.filter((p) => p.categoryId === filters.categoryId);
    else if (filters.roomId) list = list.filter((p) => roomForCategory(p.categoryId) === filters.roomId);
    if (filters.condition) list = list.filter((p) => p.condition === filters.condition);
    if (filters.oneOfOneOnly) list = list.filter((p) => p.oneOfOne);

    if (filters.sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return list;
  }, [filters, locale]);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{t("nav", "marketplace")}</h1>
          <Link href="/become" className="mt-1 inline-block text-sm font-medium text-ember hover:underline">
            {t("become", "title")} →
          </Link>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-4 py-2 text-sm font-medium lg:hidden"
        >
          {t("common", "filters")}
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} onChange={setFilters} resultsCount={results.length} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileOpen(false)} />
            <div className="relative ml-auto h-full w-[85vw] max-w-sm overflow-y-auto bg-paper p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl">{t("filters", "title")}</h2>
                <button onClick={() => setMobileOpen(false)} aria-label={t("common", "close")}>✕</button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} resultsCount={results.length} />
              <Button className="mt-6 w-full" onClick={() => setMobileOpen(false)}>
                {t("common", "applyFilters")}
              </Button>
            </div>
          </div>
        )}

        <div>
          {results.length === 0 ? (
            <EmptyState
              title={t("filters", "noResultsTitle")}
              description={t("filters", "noResultsDesc")}
              action={
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  {t("common", "clearFilters")}
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-ink-soft">…</div>}>
      <MarketplaceInner />
    </Suspense>
  );
}
