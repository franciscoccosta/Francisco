"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/context";
import { usePartnerAuth } from "@/lib/auth/partner-context";
import { getPartnerById } from "@/lib/data";

const NAV = [
  { href: "/partner/dashboard", key: "navDashboard" as const, icon: "grid" },
  { href: "/partner/projects", key: "navProjects" as const, icon: "folder" },
  { href: "/partner/materials", key: "navMaterials" as const, icon: "box" },
  { href: "/partner/collections", key: "navCollections" as const, icon: "truck" },
  { href: "/partner/support", key: "navSupport" as const, icon: "chat" },
  { href: "/partner/account", key: "navAccount" as const, icon: "user" },
];

function NavIcon({ name }: { name: string }) {
  const common = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: 1.6 };
  switch (name) {
    case "grid":
      return <svg {...common}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>;
    case "folder":
      return <svg {...common}><path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" /></svg>;
    case "box":
      return <svg {...common}><path d="M3 8l9-5 9 5-9 5-9-5Z" /><path d="M3 8v9l9 5 9-5V8" /><path d="M12 13v9" /></svg>;
    case "truck":
      return <svg {...common}><rect x="2" y="7" width="13" height="9" rx="1" /><path d="M15 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="18" cy="18" r="1.6" /></svg>;
    case "doc":
      return <svg {...common}><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M9 12h6M9 16h6" /></svg>;
    case "chat":
      return <svg {...common}><path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12Z" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.6-3.6 4.8-5.5 8-5.5s6.4 1.9 8 5.5" /></svg>;
  }
}

export function PartnerShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { session, ready, logout } = usePartnerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !session) router.replace("/partner/login");
  }, [ready, session, router]);

  if (!ready || !session) {
    return <div className="flex min-h-screen items-center justify-center bg-graphite text-slate-light">{t("common", "loading")}</div>;
  }

  const partner = getPartnerById(session.partnerId);

  return (
    <div className="flex min-h-screen bg-graphite text-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-graphite-line bg-graphite-soft lg:flex">
        <div className="flex items-center gap-2 px-5 py-5 font-display text-lg">
          <LogoMark className="h-6 w-6 text-ember-light" />
          ReMade
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-ember/15 text-ember-light" : "text-slate-light hover:bg-white/5 hover:text-paper"
                }`}
              >
                <NavIcon name={item.icon} />
                {t("partner", item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-graphite-line p-4">
          <p className="truncate text-xs font-medium text-paper">{partner?.companyName}</p>
          <p className="truncate text-xs text-slate">{session.email}</p>
          <button onClick={() => { logout(); router.push("/partner/login"); }} className="mt-2 text-xs font-medium text-ember-light hover:underline">
            {t("partner", "logout")}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-64 flex-col bg-graphite-soft">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2 font-display text-lg"><LogoMark className="h-6 w-6 text-ember-light" />ReMade</div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-light">✕</button>
            </div>
            <nav className="flex-1 space-y-0.5 px-3">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-light hover:bg-white/5">
                  <NavIcon name={item.icon} />
                  {t("partner", item.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-graphite-line px-5 py-4 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="text-slate-light lg:hidden" aria-label={t("common", "menu")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
          <span className="hidden text-sm text-slate-light lg:inline">{partner?.city}</span>
          <LanguageSelector tone="light" />
        </header>
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
