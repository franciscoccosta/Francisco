"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { getPartnerById } from "@/lib/data";
import { Button } from "@/components/ui/Button";

export default function PartnerAccountPage() {
  const { t } = useLanguage();
  const { session, logout } = usePartnerAuth();
  const router = useRouter();
  if (!session) return null;
  const partner = getPartnerById(session.partnerId);

  return (
    <div className="max-w-md">
      <h1 className="font-display text-3xl text-paper">{t("partner", "navAccount")}</h1>
      <div className="mt-6 space-y-4 rounded-2xl border border-graphite-line bg-graphite-soft p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">{t("common", "name")}</p>
          <p className="font-medium text-paper">{partner?.companyName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">{t("partner", "emailLabel")}</p>
          <p className="font-medium text-paper">{session.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">{t("common", "city")}</p>
          <p className="font-medium text-paper">{partner?.city}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-6 !border-graphite-line !text-paper"
        onClick={() => {
          logout();
          router.push("/partner/login");
        }}
      >
        {t("partner", "logout")}
      </Button>
    </div>
  );
}
