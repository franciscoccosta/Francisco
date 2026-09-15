"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { MATERIALS, PRODUCTS, getProjectById } from "@/lib/data";
import { materialLabel } from "@/lib/i18n/materials";
import { categoryLabel } from "@/lib/i18n/categories";
import { MaterialStatusBadge } from "@/components/partner/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function PartnerProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, locale } = useLanguage();
  const project = getProjectById(params.id);

  if (!project) {
    return <EmptyState title={t("errors", "notFoundTitle")} description={t("errors", "notFoundDesc")} />;
  }

  const materials = MATERIALS.filter((m) => m.projectId === project.id);
  const products = PRODUCTS.filter((p) => p.projectId === project.id);
  const receivedKg = materials.filter((m) => m.unit === "kg").reduce((s, m) => s + m.quantity, 0);
  const processed = materials.filter((m) => m.status !== "processing" && m.status !== "rejected").length;
  const generated = products.length;
  const sold = products.filter((p) => p.status === "sold").length;

  return (
    <div>
      <Link href="/partner/projects" className="text-sm text-slate-light hover:text-ember-light">← {t("partner", "projectsTitle")}</Link>
      <h1 className="mt-3 font-display text-3xl text-paper">{project.name}</h1>
      <p className="text-slate-light">{project.location}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-graphite-line bg-graphite-soft p-5">
          <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "projectExpected")}</p>
          <p className="mt-1 font-display text-2xl text-paper">{project.expectedMaterialTons} t</p>
        </div>
        <div className="rounded-2xl border border-graphite-line bg-graphite-soft p-5">
          <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "projectAvailable")}</p>
          <p className="mt-1 font-display text-2xl text-paper">{project.availableMaterialKg.toLocaleString(locale)} kg</p>
        </div>
        <Link href={`/partner/ppgrcd?project=${project.id}`} className="rounded-2xl border border-graphite-line bg-graphite-soft p-5 transition-colors hover:border-ember/50">
          <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "navPpgrcd")}</p>
          <p className="mt-1 font-display text-lg text-ember-light">{project.ppgrcdStatus.replace("_", " ")}</p>
        </Link>
      </div>

      {/* What happened to your material */}
      <section className="mt-10 rounded-2xl border border-graphite-line bg-graphite-soft p-6">
        <h2 className="font-display text-xl text-paper">{t("partner", "whatHappenedTitle")}</h2>
        <p className="mt-1 text-sm text-slate-light">{t("partner", "whatHappenedDesc")}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: t("partner", "funnelReceived"), value: `${receivedKg.toLocaleString(locale)} kg` },
            { label: t("partner", "funnelProcessed"), value: String(processed) },
            { label: t("partner", "funnelGenerated"), value: String(generated) },
            { label: t("partner", "funnelSold"), value: String(sold) },
          ].map((step, i, arr) => (
            <div key={step.label} className="relative">
              <div className="rounded-xl border border-graphite-line bg-graphite p-4 text-center">
                <p className="font-display text-2xl text-ember-light">{step.value}</p>
                <p className="mt-1 text-xs text-slate-light">{step.label}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate sm:block">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Materials in project */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl text-paper">{t("partner", "materialsTitle")}</h2>
        <div className="overflow-hidden rounded-2xl border border-graphite-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-soft text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3 font-medium">{t("partner", "materialType")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "materialQuantity")}</th>
                <th className="px-4 py-3 font-medium">{t("partner", "projectStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-t border-graphite-line text-paper/90">
                  <td className="px-4 py-3">{materialLabel(m.materialTypeId, locale)}</td>
                  <td className="px-4 py-3">{m.quantity} {t("common", m.unit)}</td>
                  <td className="px-4 py-3"><MaterialStatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Products from project */}
      {products.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl text-paper">{t("partner", "funnelGenerated")}</h2>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <span key={p.id} className="rounded-full border border-graphite-line px-3 py-1.5 text-xs text-slate-light">
                {categoryLabel(p.categoryId, locale)} #{p.code} · €{p.price}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <ButtonLink href={`/partner/ppgrcd?project=${project.id}`} variant="outline">{t("partner", "navPpgrcd")}</ButtonLink>
      </div>
    </div>
  );
}
