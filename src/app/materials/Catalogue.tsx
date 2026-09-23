"use client";

import { useMemo, useState } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { ButtonLink } from "@/components/Button";
import { track } from "@/lib/analytics";
import {
  AREAS,
  CATEGORY_LABELS,
  CONDITION_LABELS,
  MATERIALS,
  STATUS_LABELS,
  type Category,
  type Condition,
  type Status,
} from "@/lib/materials";

type Filters = { category: Category | "all"; area: string; condition: Condition | "all"; status: Status | "all" };
const EMPTY: Filters = { category: "all", area: "all", condition: "all", status: "all" };

export function Catalogue() {
  const [f, setF] = useState<Filters>(EMPTY);

  const results = useMemo(
    () =>
      MATERIALS.filter(
        (m) =>
          (f.category === "all" || m.category === f.category) &&
          (f.area === "all" || m.area === f.area) &&
          (f.condition === "all" || m.condition === f.condition) &&
          (f.status === "all" || m.status === f.status),
      ),
    [f],
  );

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setF((prev) => ({ ...prev, [key]: value }));
    if (value !== "all") track("filter", { meta: { [key]: String(value) } });
  };

  const active = Object.values(f).some((v) => v !== "all");

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10">
      <div className="sticky top-18 z-30 -mx-5 border-y border-line bg-cream/95 px-5 py-4 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 xl:pb-0" role="group" aria-label="Material type">
            <Chip on={f.category === "all"} onClick={() => set("category", "all")}>
              All
            </Chip>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
              <Chip key={c} on={f.category === c} onClick={() => set("category", c)}>
                {CATEGORY_LABELS[c]}
              </Chip>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
            <Select label="Location" value={f.area} onChange={(v) => set("area", v)} options={AREAS.map((a) => [a, a])} />
            <Select
              label="Condition"
              value={f.condition}
              onChange={(v) => set("condition", v as Condition | "all")}
              options={(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => [c, `Grade ${c}`])}
            />
            <Select
              label="Availability"
              value={f.status}
              onChange={(v) => set("status", v as Status | "all")}
              options={(Object.keys(STATUS_LABELS) as Status[]).map((s) => [s, STATUS_LABELS[s]])}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-6 text-sm text-ink-mute">
        <p>
          {results.length} {results.length === 1 ? "material" : "materials"}
        </p>
        {active && (
          <button type="button" onClick={() => setF(EMPTY)} className="font-semibold text-ink underline underline-offset-4 hover:text-wood">
            Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((m) => (
            <MaterialCard key={m.id} m={m} />
          ))}
        </div>
      ) : (
        <div className="bg-paper px-6 py-20 text-center ring-1 ring-line">
          <p className="display text-4xl">Nothing here — yet.</p>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Tell us what you&rsquo;re looking for and we&rsquo;ll let you know when matching material becomes available.
          </p>
          <ButtonLink href="/designers" className="mt-8" cta="browse_empty_looking">
            I&rsquo;m looking for wood
          </ButtonLink>
        </div>
      )}

      <div className="mt-20 grid gap-8 border-t border-line pt-12 md:grid-cols-2">
        <div>
          <p className="display text-4xl">Can&rsquo;t find what you need?</p>
          <p className="mt-3 text-ink-soft">Describe your project and we&rsquo;ll look for matching wood across Lisbon.</p>
          <ButtonLink href="/designers" className="mt-6" cta="browse_footer_looking">
            I&rsquo;m looking for wood
          </ButtonLink>
        </div>
        <div>
          <p className="display text-4xl">Have wood on a project?</p>
          <p className="mt-3 text-ink-soft">List it for free. Whenever possible it stays on site until a buyer is found.</p>
          <ButtonLink href="/offer" variant="secondary" className="mt-6" cta="browse_footer_offer">
            I have wood to offer
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors ${
        on ? "bg-ink text-cream" : "bg-paper text-ink-soft ring-1 ring-line hover:text-ink hover:ring-ink/40"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-full py-2 pl-4 pr-9 text-[0.85rem] font-medium ring-1 transition-colors focus:outline-none focus:ring-wood sm:w-auto ${
          value === "all" ? "bg-paper text-ink-soft ring-line" : "bg-ink text-cream ring-ink"
        }`}
      >
        <option value="all">{label}: all</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 8l5 5 5-5" />
      </svg>
    </label>
  );
}
