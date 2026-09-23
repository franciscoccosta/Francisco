"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, GRADES, STATUSES, type Category, type Grade, type Material, type Status } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";

type Filters = { category: Category | "all"; location: string; grade: Grade | ""; status: Status | "" };
const EMPTY: Filters = { category: "all", location: "", grade: "", status: "" };

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="min-w-0 flex-1 sm:max-w-56">
      <span className="eyebrow">{label}</span>
      <select className="field mt-1 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MaterialsBrowser({ materials }: { materials: Material[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const locations = useMemo(() => Array.from(new Set(materials.map((m) => m.neighbourhood))).sort(), [materials]);

  const shown = materials.filter(
    (m) =>
      (f.category === "all" || m.category === f.category) &&
      (!f.location || m.neighbourhood === f.location) &&
      (!f.grade || m.grade === f.grade) &&
      (!f.status || m.status === f.status),
  );
  const dirty = JSON.stringify(f) !== JSON.stringify(EMPTY);

  return (
    <>
      <div className="sticky top-18 z-30 -mx-5 border-y border-line bg-cream/95 px-5 py-5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Material type">
          {[{ id: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip shrink-0"
              data-active={f.category === c.id}
              aria-pressed={f.category === c.id}
              onClick={() => set("category", c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <Select label="Location" value={f.location} onChange={(v) => set("location", v)} options={locations.map((l) => ({ value: l, label: l }))} />
          <Select
            label="Condition"
            value={f.grade}
            onChange={(v) => set("grade", v as Grade | "")}
            options={GRADES.map((g) => ({ value: g.id, label: `${g.label} — ${g.description.split(" — ")[0]}` }))}
          />
          <Select label="Availability" value={f.status} onChange={(v) => set("status", v as Status | "")} options={STATUSES.map((s) => ({ value: s.id, label: s.label }))} />
          <div className="ml-auto flex items-center gap-5 pb-2 text-sm">
            <span className="text-muted" aria-live="polite">
              {shown.length} {shown.length === 1 ? "material" : "materials"}
            </span>
            {dirty && (
              <button type="button" className="link-underline" onClick={() => setF(EMPTY)}>
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {shown.length ? (
        <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m, i) => (
            <MaterialCard key={m.id} m={m} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing matches — yet.</p>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Tell us what you&rsquo;re looking for and we&rsquo;ll let you know when matching wood becomes available.
          </p>
          <Link href="/for-designers#join" className="btn btn-dark mt-8" data-cta="catalogue empty: looking for wood">
            I&rsquo;m looking for wood
          </Link>
        </div>
      )}
    </>
  );
}
