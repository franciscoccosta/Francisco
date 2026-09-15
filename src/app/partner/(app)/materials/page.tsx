"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { materialsForPartner, projectsForPartner, getProjectById } from "@/lib/data";
import { addedMaterialsForPartner } from "@/lib/materials/store";
import { materialLabel, materialSwatch } from "@/lib/i18n/materials";
import { categoryLabel } from "@/lib/i18n/categories";
import { MaterialStatusBadge } from "@/components/partner/StatusBadge";
import { Button } from "@/components/ui/Button";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { AddMaterialModal } from "@/components/partner/AddMaterialModal";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PartnerMaterialsPage() {
  const { t, locale } = useLanguage();
  const { session } = usePartnerAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const materials = useMemo(() => {
    if (!session) return [];
    return [...materialsForPartner(session.partnerId), ...addedMaterialsForPartner(session.partnerId)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, refreshKey]);

  const projects = session ? projectsForPartner(session.partnerId) : [];

  if (!session) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-paper">{t("partner", "materialsTitle")}</h1>
        <Button onClick={() => setModalOpen(true)}>{t("partner", "addMaterialCta")}</Button>
      </div>

      {materials.length === 0 ? (
        <EmptyState title={t("partner", "materialsTitle")} description="" action={<Button onClick={() => setModalOpen(true)}>{t("partner", "addMaterialCta")}</Button>} />
      ) : (
        <div className="space-y-3">
          {materials.map((m) => {
            const project = getProjectById(m.projectId);
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="overflow-hidden rounded-2xl border border-graphite-line bg-graphite-soft">
                <button
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div>
                    <p className="font-medium text-paper">{materialLabel(m.materialTypeId, locale)}</p>
                    <p className="text-xs text-slate-light">{project?.name} · {m.quantity} {t("common", m.unit)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate">{t("partner", "analysisConfidence")}: {m.confidence}%</span>
                    <MaterialStatusBadge status={m.status} />
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`text-slate transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-graphite-line px-5 py-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <p className="text-slate-light">{t("partner", "materialDimensions")}: <span className="text-paper">{m.dimensions}</span></p>
                      <p className="text-slate-light">{t("partner", "materialLocation")}: <span className="text-paper">{m.location}</span></p>
                      <p className="text-slate-light">{t("partner", "materialCondition")}: <span className="text-paper">{t("filters", m.condition === "excellent" ? "conditionExcellent" : m.condition === "good" ? "conditionGood" : "conditionFair")}</span></p>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {(["routeFurniture", "routeConstruction", "routeRecycling"] as const).map((key, i) => {
                        const level = [m.routeFurniture, m.routeConstruction, m.routeRecycling][i];
                        return (
                          <div key={key} className="rounded-lg border border-graphite-line px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-slate">{t("partner", key)}</p>
                            <p className={`text-sm font-semibold ${level === "high" ? "text-good" : level === "medium" ? "text-warn" : "text-slate-light"}`}>
                              {t("partner", level === "high" ? "routeHigh" : level === "medium" ? "routeMedium" : "routeLow")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {m.possibilities.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">{t("partner", "possibilitiesTitle")}</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {m.possibilities.map((p, i) => (
                            <div key={i} className="overflow-hidden rounded-lg border border-graphite-line bg-graphite">
                              <div className="aspect-[4/3]">
                                <FurnitureArt
                                  categoryId={p.categoryId}
                                  materialSwatch={materialSwatch(m.materialTypeId)}
                                  background="#1B1D21"
                                  className="h-full w-full"
                                />
                              </div>
                              <div className="p-2 text-xs">
                                <p className="font-medium text-paper">{categoryLabel(p.categoryId, locale)}</p>
                                <p className="text-slate-light">€{p.estimatedPrice} · {p.usagePercent}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <AddMaterialModal
          partnerId={session.partnerId}
          projects={projects}
          onClose={() => setModalOpen(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
