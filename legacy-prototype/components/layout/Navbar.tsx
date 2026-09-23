"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/context";
import { useCart } from "@/lib/cart/context";

const LINKS = [
  { href: "/discover", key: "discover" as const },
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/us", key: "us" as const },
  { href: "/work-with-us", key: "workWithUs" as const },
];

export function Navbar() {
  const { t } = useLanguage();
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-paper/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-ember" : "text-ink-soft hover:text-charcoal"
                }`}
              >
                {t("nav", link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector />
          <Link
            href="/account"
            aria-label={t("nav", "account")}
            className="hidden rounded-full p-2 text-ink-soft transition-colors hover:bg-stone/60 hover:text-charcoal sm:inline-flex"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c1.6-3.6 4.8-5.5 8-5.5s6.4 1.9 8 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/cart" aria-label={t("nav", "cart")} className="relative rounded-full p-2 text-ink-soft transition-colors hover:bg-stone/60 hover:text-charcoal">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M6 8h12l-1.2 10.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-paper">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={t("common", "menu")}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-stone/60 hover:text-charcoal lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-charcoal/10 bg-paper px-5 py-4 lg:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === link.href ? "bg-stone/60 text-ember" : "text-ink-soft"
                }`}
              >
                {t("nav", link.key)}
              </Link>
            ))}
            <Link href="/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft">
              {t("nav", "account")}
            </Link>
          </nav>
          <div className="mt-3 border-t border-charcoal/10 pt-3">
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
}
