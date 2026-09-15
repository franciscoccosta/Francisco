"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function PartnerLoginPage() {
  const { t } = useLanguage();
  const { login } = usePartnerAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-screen flex-col bg-graphite text-paper">
      <div className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-2 font-display text-xl">
          <LogoMark className="h-7 w-7 text-ember-light" />
          ReMade
        </Link>
        <LanguageSelector tone="light" />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-graphite-line bg-graphite-soft p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-ember-light">{t("nav", "partnerLogin")}</p>
          <h1 className="mt-2 font-display text-2xl">{t("partner", "loginTitle")}</h1>
          <p className="mt-1 text-sm text-slate-light">{t("partner", "loginSubtitle")}</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login(email);
              router.push("/partner/dashboard");
            }}
          >
            <div>
              <Label htmlFor="email" className="!text-slate-light">{t("partner", "emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!bg-graphite !border-graphite-line !text-paper"
                placeholder="obras@suaempresa.pt"
              />
            </div>
            <div>
              <Label htmlFor="password" className="!text-slate-light">{t("partner", "passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-graphite !border-graphite-line !text-paper"
              />
            </div>
            <Button type="submit" className="w-full">{t("partner", "loginCta")}</Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-light">{t("partner", "demoHint")}</p>
        </div>
      </div>
    </main>
  );
}
