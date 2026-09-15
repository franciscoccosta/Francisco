"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { MATERIAL_TYPES, materialLabel } from "@/lib/i18n/materials";
import { categoryLabel } from "@/lib/i18n/categories";
import type { Condition, Material, MaterialUnit, Project } from "@/lib/types";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { addMaterial } from "@/lib/materials/store";

const ROUTE_TENDENCY: Record<string, ["high" | "medium" | "low", "high" | "medium" | "low", "high" | "medium" | "low"]> = {
  "oak-timber": ["high", "medium", "low"],
  "pine-boards": ["high", "medium", "low"],
  "mixed-timber": ["medium", "low", "medium"],
  "construction-beam": ["high", "high", "low"],
  "ceramic-tile": ["medium", "high", "low"],
  "reclaimed-brick": ["low", "high", "medium"],
  "metal-offcut": ["medium", "medium", "medium"],
  "natural-stone": ["high", "medium", "low"],
};

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  "oak-timber": ["dining-table", "bedside-table", "bookshelf", "side-table"],
  "pine-boards": ["bed-frame", "living-bench", "office-shelf", "dining-bench"],
  "mixed-timber": ["shelving-unit", "wall-shelf", "storage-unit", "tv-unit"],
  "construction-beam": ["console", "meeting-table", "desk", "outdoor-table"],
  "ceramic-tile": ["side-table", "display-stand", "small-table"],
  "reclaimed-brick": ["planter", "small-outdoor"],
  "metal-offcut": ["console", "outdoor-bench", "decorative-object"],
  "natural-stone": ["coffee-table", "floating-shelf"],
};

const STEP_KEYS = ["analysisIdentifying", "analysisEstimatingQty", "analysisEvaluatingCondition", "analysisFindingUses", "analysisGenerating"] as const;

type Stage = "form" | "analysing" | "results";

interface FormState {
  materialTypeId: string;
  quantity: string;
  unit: MaterialUnit;
  dimensions: string;
  condition: Condition;
  projectId: string;
  location: string;
  availableFrom: string;
  notes: string;
  photoCount: number;
}

export function AddMaterialModal({
  partnerId,
  projects,
  onClose,
  onCreated,
}: {
  partnerId: string;
  projects: Project[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const { t, locale } = useLanguage();
  const [stage, setStage] = useState<Stage>("form");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [form, setForm] = useState<FormState>({
    materialTypeId: MATERIAL_TYPES[0].id,
    quantity: "100",
    unit: "kg",
    dimensions: "",
    condition: "good",
    projectId: projects[0]?.id ?? "",
    location: "",
    availableFrom: "",
    notes: "",
    photoCount: 0,
  });

  const [result, setResult] = useState<{
    confidence: number;
    routes: ["high" | "medium" | "low", "high" | "medium" | "low", "high" | "medium" | "low"];
    possibilities: { categoryId: string; usagePercent: number; estimatedPrice: number }[];
  } | null>(null);

  useEffect(() => {
    if (stage !== "analysing") return;
    setVisibleSteps(0);
    const timers = STEP_KEYS.map((_, i) =>
      window.setTimeout(() => setVisibleSteps(i + 1), 650 * (i + 1))
    );
    const finalTimer = window.setTimeout(() => {
      const routes = ROUTE_TENDENCY[form.materialTypeId] ?? ["medium", "medium", "medium"];
      const confidence = Math.round(80 + Math.random() * 17);
      const suggestions = CATEGORY_SUGGESTIONS[form.materialTypeId] ?? ["side-table", "wall-shelf"];
      const possibilities = suggestions.slice(0, 3).map((categoryId) => ({
        categoryId,
        usagePercent: Math.round(25 + Math.random() * 55),
        estimatedPrice: Math.round(120 + Math.random() * 650),
      }));
      setResult({ confidence, routes, possibilities });
      setStage("results");
    }, 650 * (STEP_KEYS.length + 1));

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [stage, form.materialTypeId]);

  function handleSubmitForm() {
    setStage("analysing");
  }

  function handleConfirm() {
    if (!result) return;
    const material: Material = {
      id: `mat-${crypto.randomUUID().slice(0, 8)}`,
      materialTypeId: form.materialTypeId,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      dimensions: form.dimensions || "—",
      condition: form.condition,
      projectId: form.projectId,
      partnerId,
      location: form.location || "—",
      availableFrom: form.availableFrom || new Date().toISOString().slice(0, 10),
      notes: form.notes,
      status: "processing",
      confidence: result.confidence,
      routeFurniture: result.routes[0],
      routeConstruction: result.routes[1],
      routeRecycling: result.routes[2],
      possibilities: result.possibilities,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addMaterial(material);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-graphite-line bg-graphite-soft p-6 sm:p-8">
        {stage === "form" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-paper">{t("partner", "addMaterialCta")}</h2>
              <button onClick={onClose} className="text-slate-light" aria-label={t("common", "close")}>✕</button>
            </div>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
            >
              <div>
                <Label className="!text-slate-light">{t("partner", "materialType")}</Label>
                <Select
                  className="!bg-graphite !border-graphite-line !text-paper"
                  value={form.materialTypeId}
                  onChange={(e) => setForm({ ...form, materialTypeId: e.target.value })}
                >
                  {MATERIAL_TYPES.map((m) => (
                    <option key={m.id} value={m.id}>{materialLabel(m.id, locale)}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialProject")}</Label>
                <Select
                  className="!bg-graphite !border-graphite-line !text-paper"
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialQuantity")}</Label>
                <Input
                  type="number"
                  min={0}
                  required
                  className="!bg-graphite !border-graphite-line !text-paper"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialUnit")}</Label>
                <Select
                  className="!bg-graphite !border-graphite-line !text-paper"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value as MaterialUnit })}
                >
                  {(["kg", "units", "m", "m2", "m3"] as MaterialUnit[]).map((u) => (
                    <option key={u} value={u}>{t("common", u)}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialDimensions")}</Label>
                <Input className="!bg-graphite !border-graphite-line !text-paper" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialCondition")}</Label>
                <Select
                  className="!bg-graphite !border-graphite-line !text-paper"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value as Condition })}
                >
                  <option value="excellent">{t("filters", "conditionExcellent")}</option>
                  <option value="good">{t("filters", "conditionGood")}</option>
                  <option value="fair">{t("filters", "conditionFair")}</option>
                </Select>
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialLocation")}</Label>
                <Input className="!bg-graphite !border-graphite-line !text-paper" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <Label className="!text-slate-light">{t("partner", "materialAvailableFrom")}</Label>
                <Input type="date" className="!bg-graphite !border-graphite-line !text-paper" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label className="!text-slate-light">{t("partner", "materialPhotos")}</Label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, photoCount: e.target.files?.length ?? 0 })}
                  className="block w-full text-sm text-slate-light file:mr-3 file:rounded-full file:border-0 file:bg-ember file:px-4 file:py-2 file:text-sm file:font-medium file:text-paper"
                />
                {form.photoCount > 0 && <p className="mt-1 text-xs text-slate-light">{form.photoCount} ✓</p>}
              </div>
              <div className="sm:col-span-2">
                <Label className="!text-slate-light">{t("partner", "materialNotes")}</Label>
                <Textarea rows={3} className="!bg-graphite !border-graphite-line !text-paper" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full">{t("partner", "materialSubmit")}</Button>
              </div>
            </form>
          </>
        )}

        {stage === "analysing" && (
          <div className="py-8 text-center">
            <h2 className="font-display text-xl text-paper">{t("partner", "analysingTitle")}</h2>
            <div className="mx-auto mt-8 max-w-sm space-y-4 text-left">
              {STEP_KEYS.map((key, i) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      i < visibleSteps ? "border-ember bg-ember text-paper" : "border-graphite-line text-transparent"
                    }`}
                  >
                    {i < visibleSteps ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : i === visibleSteps ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-ember-light" />
                    ) : null}
                  </div>
                  <span className={`text-sm ${i < visibleSteps ? "text-paper" : "text-slate"}`}>{t("partner", key)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "results" && result && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-paper">{t("partner", "analysisDone")}</h2>
              <button onClick={onClose} className="text-slate-light" aria-label={t("common", "close")}>✕</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-graphite-line bg-graphite p-4">
                <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "analysisConfidence")}</p>
                <p className="mt-1 font-display text-2xl text-ember-light">{result.confidence}%</p>
              </div>
              <div className="rounded-xl border border-graphite-line bg-graphite p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "materialType")}</p>
                <p className="mt-1 font-medium text-paper">{materialLabel(form.materialTypeId, locale)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {([
                ["routeFurniture", result.routes[0]],
                ["routeConstruction", result.routes[1]],
                ["routeRecycling", result.routes[2]],
              ] as const).map(([labelKey, level]) => (
                <div key={labelKey} className="rounded-xl border border-graphite-line bg-graphite p-4">
                  <p className="text-xs uppercase tracking-wide text-slate">{t("partner", labelKey)}</p>
                  <p className={`mt-1 text-sm font-semibold ${level === "high" ? "text-good" : level === "medium" ? "text-warn" : "text-slate-light"}`}>
                    {t("partner", level === "high" ? "routeHigh" : level === "medium" ? "routeMedium" : "routeLow")}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-6 font-display text-lg text-paper">{t("partner", "possibilitiesTitle")}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {result.possibilities.map((p, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-graphite-line bg-graphite">
                  <div className="aspect-[4/3]"><FurnitureArt categoryId={p.categoryId} background="#1B1D21" stroke="#F7F2EA" accent="#B6531F" className="h-full w-full" /></div>
                  <div className="p-3 text-sm">
                    <p className="font-medium text-paper">{categoryLabel(p.categoryId, locale)}</p>
                    <p className="mt-1 text-xs text-slate-light">{t("partner", "possibilityUsage")}: {p.usagePercent}%</p>
                    <p className="text-xs text-slate-light">{t("partner", "possibilityPrice")}: €{p.estimatedPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-6 w-full" onClick={handleConfirm}>{t("common", "confirm")}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
