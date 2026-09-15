"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { projectsForPartner } from "@/lib/data";
import { MATERIAL_TYPES, materialLabel } from "@/lib/i18n/materials";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { getPpgrcdRecord, savePpgrcdRecord, type PpgrcdDraftItem } from "@/lib/ppgrcd/store";
import type { PpgrcdStatus } from "@/lib/types";

const STAGE_KEYS = ["ppgrcdUpload", "ppgrcdAnalyse", "ppgrcdEstimate", "ppgrcdIdentify", "ppgrcdDraft"] as const;

const STATUS_LABEL: Record<PpgrcdStatus, Record<string, string>> = {
  not_started: { pt: "Não iniciado", en: "Not started", es: "No iniciado", fr: "Non commencé", de: "Nicht begonnen", no: "Ikke startet" },
  draft: { pt: "Rascunho", en: "Draft", es: "Borrador", fr: "Brouillon", de: "Entwurf", no: "Utkast" },
  in_review: { pt: "Em revisão", en: "In review", es: "En revisión", fr: "En révision", de: "In Prüfung", no: "Under gjennomgang" },
  approved: { pt: "Aprovado", en: "Approved", es: "Aprobado", fr: "Approuvé", de: "Genehmigt", no: "Godkjent" },
};

function PpgrcdInner() {
  const { t, locale } = useLanguage();
  const { session } = usePartnerAuth();
  const searchParams = useSearchParams();
  const projects = session ? projectsForPartner(session.partnerId) : [];
  const [projectId, setProjectId] = useState(searchParams.get("project") ?? projects[0]?.id ?? "");
  const [stageIndex, setStageIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [draft, setDraft] = useState<PpgrcdDraftItem[] | null>(null);
  const [status, setStatus] = useState<PpgrcdStatus>("not_started");

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  useEffect(() => {
    if (!projectId) return;
    const rec = getPpgrcdRecord(projectId);
    if (rec) {
      setDraft(rec.draft);
      setStatus(rec.status);
    } else {
      setDraft(null);
      setStatus(project?.ppgrcdStatus ?? "not_started");
    }
  }, [projectId, project]);

  function startPlan() {
    setRunning(true);
    setStageIndex(0);
    STAGE_KEYS.forEach((_, i) => {
      window.setTimeout(() => setStageIndex(i), 600 * (i + 1));
    });
    window.setTimeout(() => {
      const shuffled = [...MATERIAL_TYPES].sort(() => Math.random() - 0.5).slice(0, 4);
      const total = project?.expectedMaterialTons ?? 10;
      const generated: PpgrcdDraftItem[] = shuffled.map((m, i) => ({
        materialTypeId: m.id,
        estimatedTons: Math.round((total / shuffled.length) * (0.7 + Math.random() * 0.6) * 10) / 10,
        reusable: i < 3,
      }));
      setDraft(generated);
      setStatus("draft");
      setRunning(false);
    }, 600 * (STAGE_KEYS.length + 1));
  }

  function updateDraftValue(index: number, value: number) {
    if (!draft) return;
    const next = [...draft];
    next[index] = { ...next[index], estimatedTons: value };
    setDraft(next);
  }

  function approve() {
    if (!draft || !projectId) return;
    savePpgrcdRecord(projectId, { status: "approved", draft });
    setStatus("approved");
  }

  if (!session) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">{t("partner", "ppgrcdTitle")}</h1>
          <p className="mt-1 text-sm text-slate-light">{t("partner", "ppgrcdSubtitle")}</p>
        </div>
        <Select
          className="!w-auto !bg-graphite-soft !border-graphite-line !text-paper"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-graphite-line px-4 py-1.5 text-sm text-slate-light">
        {t("partner", "projectStatus")}: <span className="font-semibold text-ember-light">{STATUS_LABEL[status][locale] ?? status}</span>
      </div>

      {!draft && !running && (
        <div className="rounded-2xl border border-dashed border-graphite-line p-10 text-center">
          <Button onClick={startPlan}>{t("partner", "ppgrcdStart")}</Button>
        </div>
      )}

      {running && (
        <div className="mx-auto max-w-sm space-y-4 py-10">
          {STAGE_KEYS.map((key, i) => (
            <div key={key} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${i <= stageIndex ? "border-ember bg-ember text-paper" : "border-graphite-line"}`}>
                {i <= stageIndex && (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </div>
              <span className={`text-sm ${i <= stageIndex ? "text-paper" : "text-slate"}`}>{t("partner", key)}</span>
            </div>
          ))}
        </div>
      )}

      {draft && !running && (
        <div>
          <h2 className="mb-4 font-display text-xl text-paper">{t("partner", "ppgrcdReviewTitle")}</h2>
          <div className="overflow-hidden rounded-2xl border border-graphite-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-graphite-soft text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("partner", "materialType")}</th>
                  <th className="px-4 py-3 font-medium">{t("partner", "ppgrcdEstimate")} (t)</th>
                  <th className="px-4 py-3 font-medium">{t("partner", "ppgrcdIdentify")}</th>
                </tr>
              </thead>
              <tbody>
                {draft.map((d, i) => (
                  <tr key={d.materialTypeId} className="border-t border-graphite-line text-paper/90">
                    <td className="px-4 py-3">{materialLabel(d.materialTypeId, locale)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step={0.1}
                        value={d.estimatedTons}
                        onChange={(e) => updateDraftValue(i, Number(e.target.value))}
                        disabled={status === "approved"}
                        className="w-24 rounded-md border border-graphite-line bg-graphite px-2 py-1 text-paper outline-none focus:border-ember disabled:opacity-60"
                      />
                    </td>
                    <td className="px-4 py-3">{d.reusable ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {status !== "approved" ? (
            <Button className="mt-6" onClick={approve}>{t("partner", "ppgrcdApprove")}</Button>
          ) : (
            <p className="mt-6 text-sm font-medium text-good">✓ {STATUS_LABEL.approved[locale]}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PartnerPpgrcdPage() {
  return (
    <Suspense fallback={null}>
      <PpgrcdInner />
    </Suspense>
  );
}
