"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-paper-dim">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{t("footer", "tagline")}</p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("footer", "columnShop")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="text-charcoal/80 hover:text-ember">{t("nav", "marketplace")}</Link></li>
              <li><Link href="/become" className="text-charcoal/80 hover:text-ember">{t("home", "categoriesTitle")}</Link></li>
              <li><Link href="/how-it-works" className="text-charcoal/80 hover:text-ember">{t("nav", "howItWorks")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("footer", "columnCompany")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/us" className="text-charcoal/80 hover:text-ember">{t("nav", "us")}</Link></li>
              <li><Link href="/account/support" className="text-charcoal/80 hover:text-ember">{t("support", "title")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("footer", "columnPartners")}</h4>
            <ul className="space-y-2 text-sm mb-5">
              <li><Link href="/work-with-us" className="text-charcoal/80 hover:text-ember">{t("nav", "workWithUs")}</Link></li>
              <li><Link href="/partner/login" className="text-charcoal/80 hover:text-ember">{t("nav", "partnerLogin")}</Link></li>
            </ul>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{t("footer", "newsletterTitle")}</h4>
            <p className="mb-3 text-sm text-ink-soft">{t("footer", "newsletterDesc")}</p>
            {subscribed ? (
              <p className="text-sm font-medium text-ember">✓ {t("common", "subscribe")}</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("common", "emailPlaceholder")}
                  className="!py-2"
                />
                <Button type="submit" size="sm">{t("footer", "newsletterCta")}</Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-charcoal/10 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>ReMade © {new Date().getFullYear()}. {t("footer", "rights")}</p>
          <p>{t("footer", "madeIn")}</p>
        </div>
      </div>
    </footer>
  );
}
