"use client";

import { useLanguage } from "@/lib/i18n/context";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <Logo className="mb-10" />
      <p className="font-display text-6xl text-ember/40">404</p>
      <h1 className="mt-4 font-display text-3xl text-charcoal">{t("errors", "notFoundTitle")}</h1>
      <p className="mt-3 max-w-sm text-ink-soft">{t("errors", "notFoundDesc")}</p>
      <div className="mt-8">
        <ButtonLink href="/discover">{t("nav", "marketplace")}</ButtonLink>
      </div>
    </div>
  );
}
