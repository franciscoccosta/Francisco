import type { Metadata } from "next";
import { Catalogue } from "./Catalogue";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Browse reclaimed wood",
  description: "A small, curated catalogue of reclaimed wood from real Lisbon-area buildings and projects.",
};

export default function MaterialsPage() {
  return (
    <div className="pt-18">
      <header className="mx-auto max-w-[1400px] px-5 pb-12 pt-16 md:px-10 md:pt-24">
        <p className="eyebrow text-wood">Browse wood</p>
        <div className="mt-5 grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="display text-6xl md:col-span-7 md:text-8xl">Wood from Lisbon&rsquo;s buildings.</h1>
          <p className="text-lg leading-relaxed text-ink-soft md:col-span-5">
            A deliberately small, curated catalogue. Each material is linked to a real building or project in Lisbon and its
            surroundings — and carries its own Material Passport.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-l-2 border-wood bg-paper p-5 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl">
            <strong className="font-semibold text-ink">Prototype catalogue.</strong> These listings are based on real Lisbon-area
            rehabilitation and redevelopment projects, but ReMade has not yet recovered material from them. Each is a potential
            recovery source; building facts are sourced, while quantities, dimensions and CO₂ figures are indicative. Anything
            unknown is marked &ldquo;To be verified&rdquo;.
          </p>
          <ButtonLink href="/designers" variant="primary" cta="browse_banner_looking" className="shrink-0">
            Tell us what you need
          </ButtonLink>
        </div>
      </header>

      <Catalogue />
    </div>
  );
}
