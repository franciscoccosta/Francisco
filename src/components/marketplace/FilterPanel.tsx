"use client";

import { useLanguage } from "@/lib/i18n/context";
import { ROOMS, CATEGORY_ITEMS, roomLabel, categoryLabel } from "@/lib/i18n/categories";
import type { Condition } from "@/lib/types";

export interface Filters {
  search: string;
  roomId: string | null;
  categoryId: string | null;
  condition: Condition | null;
  oneOfOneOnly: boolean;
  sortBy: "newest" | "price-asc" | "price-desc";
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  roomId: null,
  categoryId: null,
  condition: null,
  oneOfOneOnly: false,
  sortBy: "newest",
};

export function FilterPanel({
  filters,
  onChange,
  resultsCount,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultsCount: number;
}) {
  const { t, locale } = useLanguage();
  const categoriesForRoom = filters.roomId
    ? CATEGORY_ITEMS.filter((c) => c.roomId === filters.roomId)
    : CATEGORY_ITEMS;

  return (
    <div className="space-y-7">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("common", "search")}</label>
        <div className="relative">
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder={t("filters", "searchPlaceholder")}
            className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 pl-9 text-sm outline-none focus:border-ember"
          />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("filters", "room")}</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChange({ ...filters, roomId: null, categoryId: null })}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              !filters.roomId ? "border-ember bg-ember text-paper" : "border-charcoal/15 text-charcoal"
            }`}
          >
            {t("common", "all")}
          </button>
          {ROOMS.map((r) => (
            <button
              key={r.id}
              onClick={() => onChange({ ...filters, roomId: r.id, categoryId: null })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                filters.roomId === r.id ? "border-ember bg-ember text-paper" : "border-charcoal/15 text-charcoal"
              }`}
            >
              {roomLabel(r.id, locale)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("filters", "category")}</p>
        <select
          value={filters.categoryId ?? ""}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value || null })}
          className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ember"
        >
          <option value="">{t("filters", "allFurniture")}</option>
          {categoriesForRoom.map((c) => (
            <option key={c.id} value={c.id}>
              {categoryLabel(c.id, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("filters", "condition")}</p>
        <div className="flex flex-wrap gap-1.5">
          {(["excellent", "good", "fair"] as Condition[]).map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...filters, condition: filters.condition === c ? null : c })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                filters.condition === c ? "border-ember bg-ember text-paper" : "border-charcoal/15 text-charcoal"
              }`}
            >
              {t("filters", c === "excellent" ? "conditionExcellent" : c === "good" ? "conditionGood" : "conditionFair")}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={filters.oneOfOneOnly}
          onChange={(e) => onChange({ ...filters, oneOfOneOnly: e.target.checked })}
          className="h-4 w-4 accent-ember"
        />
        {t("filters", "oneOfOneOnly")}
      </label>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("filters", "sortBy")}</p>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })}
          className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ember"
        >
          <option value="newest">{t("filters", "sortNewest")}</option>
          <option value="price-asc">{t("filters", "sortPriceAsc")}</option>
          <option value="price-desc">{t("filters", "sortPriceDesc")}</option>
        </select>
      </div>

      <div className="flex items-center justify-between border-t border-charcoal/10 pt-4">
        <p className="text-xs text-ink-soft">
          {resultsCount} {t("filters", "resultsCount")}
        </p>
        <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-xs font-medium text-ember hover:underline">
          {t("common", "clearFilters")}
        </button>
      </div>
    </div>
  );
}
