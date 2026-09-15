"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { useAuth } from "@/lib/auth/context";
import { ordersForEmail } from "@/lib/orders/store";
import { PRODUCTS } from "@/lib/data";
import { categoryLabel } from "@/lib/i18n/categories";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import type { OrderStatus } from "@/lib/types";

type Tab = "pieces" | "impact" | "orders" | "assembly" | "support" | "settings";

const STATUS_TONE: Record<OrderStatus, "good" | "warn" | "info" | "charcoal"> = {
  processing: "warn",
  preparing: "info",
  shipped: "info",
  delivered: "good",
};

function LoginGate() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-3xl border border-charcoal/10 bg-white/50 p-8">
        <h1 className="font-display text-2xl">{mode === "login" ? t("auth", "loginTitle") : t("auth", "signupTitle")}</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(email, name || undefined);
          }}
        >
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">{t("auth", "nameLabel")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label htmlFor="email">{t("auth", "emailLabel")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">{t("auth", "passwordLabel")}</Label>
            <Input id="password" type="password" required minLength={1} />
          </div>
          <Button type="submit" className="w-full">
            {mode === "login" ? t("auth", "loginCta") : t("auth", "signupCta")}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-ink-soft">{t("auth", "demoHint")}</p>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-sm font-medium text-ember hover:underline"
        >
          {mode === "login" ? t("auth", "switchToSignup") : t("auth", "switchToLogin")}
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("nav", "account"));
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("pieces");

  if (!user) return <LoginGate />;

  const orders = ordersForEmail(user.email);
  const purchasedProductIds = new Set(orders.flatMap((o) => o.items.map((i) => i.productId)));
  const pieces = PRODUCTS.filter((p) => purchasedProductIds.has(p.id));
  const materialReusedKg = pieces.reduce((sum, p) => sum + p.weightKg, 0);

  const TABS: { key: Tab; label: string }[] = [
    { key: "pieces", label: t("account", "navPieces") },
    { key: "impact", label: t("account", "navImpact") },
    { key: "orders", label: t("account", "navOrders") },
    { key: "assembly", label: t("account", "navAssembly") },
    { key: "support", label: t("account", "navSupport") },
    { key: "settings", label: t("account", "navSettings") },
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl sm:text-4xl">{t("account", "greeting")}, {user.name}</h1>
        <button onClick={logout} className="text-sm font-medium text-ink-soft hover:text-bad">{t("common", "logout")}</button>
      </div>

      <div className="mb-10 flex gap-1.5 overflow-x-auto no-scrollbar">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === tb.key ? "bg-charcoal text-paper" : "bg-stone/60 text-ink-soft hover:bg-stone"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "pieces" && (
        pieces.length === 0 ? (
          <EmptyState title={t("account", "piecesEmpty")} description={t("account", "piecesEmptyDesc")} action={<ButtonLink href="/marketplace">{t("cart", "browseCta")}</ButtonLink>} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pieces.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white/40">
                <div className="aspect-[4/3] bg-stone"><FurnitureArt categoryId={p.categoryId} className="h-full w-full" /></div>
                <div className="p-3">
                  <p className="font-display text-base">{categoryLabel(p.categoryId, locale)} #{p.code}</p>
                  <Badge tone="ember" className="mt-1">{t("product", "oneOfOne")}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {tab === "impact" && (
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-charcoal/10 bg-white/40 p-6">
              <p className="font-display text-3xl text-ember">{materialReusedKg} kg</p>
              <p className="mt-1 text-sm text-ink-soft">{t("account", "impactMaterialReused")}</p>
            </div>
            <div className="rounded-2xl border border-charcoal/10 bg-white/40 p-6">
              <p className="font-display text-3xl text-ember">{Math.round(materialReusedKg * 0.6)} kg</p>
              <p className="mt-1 text-sm text-ink-soft">{t("account", "impactMaterialDiverted")}</p>
            </div>
            <div className="rounded-2xl border border-charcoal/10 bg-white/40 p-6">
              <p className="font-display text-3xl text-ember">{pieces.length}</p>
              <p className="mt-1 text-sm text-ink-soft">{t("account", "impactPiecesOwned")}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-soft">{t("account", "impactDemoNotice")}</p>
        </div>
      )}

      {tab === "orders" && (
        orders.length === 0 ? (
          <EmptyState title={t("account", "ordersEmpty")} description={t("cart", "emptyDesc")} action={<ButtonLink href="/marketplace">{t("cart", "browseCta")}</ButtonLink>} />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-charcoal/10 bg-white/40 p-4">
                <div>
                  <p className="font-medium text-charcoal">{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-ink-soft">{new Date(o.createdAt).toLocaleDateString(locale)} · {o.items.length} {t("common", "units")}</p>
                </div>
                <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                <span className="font-display text-lg text-charcoal">€{o.total}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "assembly" && (
        pieces.length === 0 ? (
          <EmptyState title={t("account", "assemblyEmpty")} description="" />
        ) : (
          <div className="space-y-4">
            {pieces.map((p) => (
              <div key={p.id} className="rounded-2xl border border-charcoal/10 bg-white/40 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg">{categoryLabel(p.categoryId, locale)} #{p.code}</p>
                  <span className="text-sm text-ink-soft">{p.assemblyTimeMinutes} {t("product", "minutes")}</span>
                </div>
                <ol className="mt-3 space-y-1.5 text-sm text-ink-soft">
                  {p.assemblySteps.map((s, i) => (
                    <li key={i}>{i + 1}. {s.title[locale as "pt"] ?? s.title.en}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "support" && (
        <div className="max-w-md">
          <p className="text-ink-soft">{t("support", "subtitle")}</p>
          <p className="mt-2 text-sm text-ink-soft">{t("support", "offlineNotice")}</p>
        </div>
      )}

      {tab === "settings" && (
        <div className="max-w-sm space-y-3 rounded-2xl border border-charcoal/10 bg-white/40 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">{t("common", "name")}</p>
            <p className="font-medium text-charcoal">{user.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">{t("auth", "emailLabel")}</p>
            <p className="font-medium text-charcoal">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
