"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { projectsForPartner } from "@/lib/data";

const PROCESSING_LABEL: Record<string, Record<string, string>> = {
  planning: { pt: "Planeamento", en: "Planning" },
  active: { pt: "Ativo", en: "Active" },
  completed: { pt: "Concluído", en: "Completed" },
};

export default function PartnerProjectsPage() {
  const { t, locale } = useLanguage();
  const { session } = usePartnerAuth();
  if (!session) return null;
  const projects = projectsForPartner(session.partnerId);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-paper">{t("partner", "projectsTitle")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/partner/projects/${p.id}`} className="rounded-2xl border border-graphite-line bg-graphite-soft p-5 transition-colors hover:border-ember/50">
            <p className="font-display text-lg text-paper">{p.name}</p>
            <p className="mt-1 text-sm text-slate-light">{p.location}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="rounded-full bg-graphite px-2.5 py-1 text-slate-light">{PROCESSING_LABEL[p.processingStatus][locale] ?? p.processingStatus}</span>
              <span className="text-slate">{p.availableMaterialKg.toLocaleString(locale)} kg</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
