"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { getPartnerById, materialsForPartner, projectsForPartner, collectionsForPartner } from "@/lib/data";
import { StatCard } from "@/components/partner/StatCard";
import { MaterialStatusBadge } from "@/components/partner/StatusBadge";
import { materialLabel } from "@/lib/i18n/materials";

export default function PartnerDashboardPage() {
  const { t, locale } = useLanguage();
  const { session } = usePartnerAuth();
  if (!session) return null;

  const partner = getPartnerById(session.partnerId);
  const projects = projectsForPartner(session.partnerId);
  const materials = materialsForPartner(session.partnerId);
  const collections = collectionsForPartner(session.partnerId).filter((c) => c.status === "scheduled" || c.status === "confirmed");

  const activeProjects = projects.filter((p) => p.processingStatus === "active").length;
  const availableKg = materials.filter((m) => m.status === "available" && m.unit === "kg").reduce((s, m) => s + m.quantity, 0);
  const reusedKg = materials.filter((m) => ["matched", "sold", "collection"].includes(m.status) && m.unit === "kg").reduce((s, m) => s + m.quantity, 0);
  const processing = materials.filter((m) => m.status === "processing").length;

  const recent = [...materials].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">{t("partner", "dashboardGreeting")}, {partner?.companyName}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label={t("partner", "statActiveProjects")} value={String(activeProjects)} />
        <StatCard label={t("partner", "statMaterialAvailable")} value={`${availableKg} kg`} />
        <StatCard label={t("partner", "statMaterialReused")} value={`${reusedKg} kg`} />
        <StatCard label={t("partner", "statUpcomingCollections")} value={String(collections.length)} />
        <StatCard label={t("partner", "statMaterialsProcessing")} value={String(processing)} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl text-paper">{t("partner", "dashboardRecentActivity")}</h2>
        <Link href="/partner/materials" className="text-sm font-medium text-ember-light hover:underline">{t("partner", "dashboardViewAll")}</Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-graphite-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-graphite-soft text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3 font-medium">{t("partner", "materialType")}</th>
              <th className="px-4 py-3 font-medium">{t("partner", "materialQuantity")}</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">{t("partner", "materialProject")}</th>
              <th className="px-4 py-3 font-medium">{t("partner", "projectStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((m) => {
              const project = projects.find((p) => p.id === m.projectId);
              return (
                <tr key={m.id} className="border-t border-graphite-line text-paper/90">
                  <td className="px-4 py-3">{materialLabel(m.materialTypeId, locale)}</td>
                  <td className="px-4 py-3">{m.quantity} {t("common", m.unit)}</td>
                  <td className="hidden px-4 py-3 text-slate-light sm:table-cell">{project?.name}</td>
                  <td className="px-4 py-3"><MaterialStatusBadge status={m.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
