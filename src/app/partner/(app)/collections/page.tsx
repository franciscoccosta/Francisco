"use client";

import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { collectionsForPartner, getProjectById } from "@/lib/data";
import { materialLabel } from "@/lib/i18n/materials";
import { CollectionStatusBadge } from "@/components/partner/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PartnerCollectionsPage() {
  const { t, locale } = useLanguage();
  const { session } = usePartnerAuth();
  if (!session) return null;
  const collections = collectionsForPartner(session.partnerId);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-paper">{t("partner", "collectionsTitle")}</h1>
      {collections.length === 0 ? (
        <EmptyState title={t("partner", "collectionsTitle")} description="" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-graphite-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-soft text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3 font-medium">{t("partner", "collectionProject")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "collectionMaterial")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "collectionQty")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "collectionDate")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "collectionStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => {
                const project = getProjectById(c.projectId);
                return (
                  <tr key={c.id} className="border-t border-graphite-line text-paper/90">
                    <td className="px-4 py-3">{project?.name}</td>
                    <td className="px-4 py-3">{materialLabel(c.materialTypeId, locale)}</td>
                    <td className="px-4 py-3">{c.quantity} {t("common", c.unit)}</td>
                    <td className="px-4 py-3">{new Date(c.date).toLocaleDateString(locale)}</td>
                    <td className="px-4 py-3"><CollectionStatusBadge status={c.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
