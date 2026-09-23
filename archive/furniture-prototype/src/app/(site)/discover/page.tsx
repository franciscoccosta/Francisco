"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { GuessGame } from "@/components/marketplace/GuessGame";
import { FurnitureArt } from "@/components/visuals/FurnitureArt";
import { MaterialSwatch } from "@/components/visuals/MaterialSwatch";
import { BeforeAfterSlider } from "@/components/visuals/BeforeAfterSlider";
import { PRODUCTS } from "@/lib/data";
import { ROOMS, roomLabel } from "@/lib/i18n/categories";
import { materialSwatch } from "@/lib/i18n/materials";

const ROOM_ART: Record<string, string> = {
  "living-room": "coffee-table",
  dining: "dining-table",
  bedroom: "bed-frame",
  office: "desk",
  outdoor: "outdoor-table",
  "smaller-objects": "wall-shelf",
};

export default function DiscoverPage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("hero", "title"));
  const featured = PRODUCTS.filter((p) => p.status === "available").slice(0, 8);
  const heroProduct = PRODUCTS.find((p) => p.id === "prod-024")!;
  const guessProduct = PRODUCTS.find((p) => p.id === "prod-027")!;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-paper">
        <div className="container-page relative grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-light">{t("hero", "kicker")}</p>
            </div>
            <h1 className="text-balance font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {t("hero", "title")}
              <br />
              <span className="text-ember-light">{t("hero", "titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-md text-paper/70">{t("hero", "subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/marketplace" variant="primary" size="lg">{t("hero", "ctaPrimary")}</ButtonLink>
              <ButtonLink href="/how-it-works" variant="outline" size="lg" className="!border-paper/30 !text-paper hover:!border-paper">
                {t("hero", "ctaSecondary")}
              </ButtonLink>
            </div>
            <div className="mt-8 hidden sm:block">
              <LanguageSelector tone="light" />
            </div>
          </div>
          <div className="relative">
            <BeforeAfterSlider
              className="shadow-2xl"
              before={<MaterialSwatch swatch={materialSwatch(heroProduct.materialTypeId)} className="h-full w-full" />}
              after={<FurnitureArt categoryId={heroProduct.categoryId} materialSwatch={materialSwatch(heroProduct.materialTypeId)} className="h-full w-full" />}
            />
            <p className="mt-3 text-center text-xs text-paper/50">{t("product", "beforeAfterHint")}</p>
          </div>
        </div>
      </section>

      {/* Principle quote */}
      <section className="container-page py-16 text-center sm:py-20">
        <p className="mx-auto max-w-2xl text-balance font-display text-2xl leading-snug text-charcoal sm:text-3xl">
          “{t("home", "principleQuote")}”
        </p>
      </section>

      {/* Categories */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">{t("home", "categoriesTitle")}</h2>
          <Link href="/become" className="hidden text-sm font-medium text-ember hover:underline sm:inline">
            {t("become", "title")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              href={`/marketplace?room=${room.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-charcoal/8 bg-white/40 p-5 text-center transition-shadow hover:shadow-md"
            >
              <div className="aspect-square w-full max-w-[88px] overflow-hidden rounded-xl bg-stone">
                <FurnitureArt categoryId={ROOM_ART[room.id]} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="text-sm font-medium text-charcoal">{roomLabel(room.id, locale)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">{t("home", "featuredTitle")}</h2>
          <Link href="/marketplace" className="hidden text-sm font-medium text-ember hover:underline sm:inline">
            {t("home", "featuredCta")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <ButtonLink href="/marketplace" variant="outline">{t("home", "featuredCta")}</ButtonLink>
        </div>
      </section>

      {/* Guess game */}
      <section className="bg-paper-dim py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-ember">{t("home", "guessKicker")}</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">{t("home", "guessTitle")}</h2>
            <p className="mt-2 text-ink-soft">{t("home", "guessSubtitle")}</p>
          </div>
          <div className="mx-auto max-w-2xl">
            <GuessGame product={guessProduct} />
          </div>
        </div>
      </section>

      {/* More to discover */}
      <section className="container-page py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl bg-charcoal px-6 py-14 text-center text-paper sm:px-16">
          <p className="text-xs font-semibold uppercase tracking-wide text-ember-light">{t("home", "moreKicker")}</p>
          <h2 className="mx-auto mt-3 max-w-xl text-balance font-display text-2xl sm:text-3xl">{t("home", "moreTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-paper/60">{t("home", "moreDesc")}</p>
          <div className="mt-7">
            <ButtonLink href="/marketplace" variant="primary">{t("home", "moreCta")}</ButtonLink>
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="container-page pb-20 text-center">
        <ButtonLink href="/how-it-works" variant="ghost">{t("home", "howCta")} →</ButtonLink>
      </section>
    </div>
  );
}
