import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { OfferForm } from "@/components/forms/OfferForm";

export const metadata: Metadata = {
  title: "Offer material — for builders",
  description: "Have reusable wood from a renovation or demolition project in Lisbon? Tell ReMade about it — it's free.",
};

const BENEFITS = [
  ["Free to submit", "Listing your material costs nothing."],
  ["Potentially lower disposal costs", "Wood that is reused doesn't need to be removed as waste."],
  ["Support circular construction", "Show clients and partners that your projects keep good material in use."],
  ["We find the buyers", "ReMade connects your material with architects and designers."],
  ["It can stay on site", "Whenever possible, the material remains on site until a buyer is found."],
];

export default function OfferPage() {
  return (
    <div className="pt-18">
      <section className="relative overflow-hidden bg-ink text-cream">
        <Image src="/images/materials/margueira-timber.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
          <p className="eyebrow animate-fade-up text-cream/70">For construction, renovation &amp; demolition companies</p>
          <h1 className="display mt-6 max-w-4xl animate-fade-up text-6xl [animation-delay:100ms] md:text-8xl">Don&rsquo;t throw value away.</h1>
          <p className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/85 [animation-delay:200ms]">
            If your project has reusable wood, tell us about it. ReMade helps give it a second life.
          </p>
          <a
            href="#report"
            data-cta="offer_hero_jump"
            className="mt-10 inline-flex animate-fade-up items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink [animation-delay:300ms] hover:bg-paper"
          >
            Report material — 2 minutes
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 3v13M5 11l5 5 5-5" />
            </svg>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 80} className="bg-cream p-6 lg:p-7">
              <span className="font-mono text-xs text-wood">0{i + 1}</span>
              <p className="mt-6 font-semibold leading-snug">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="report" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-wood">Report material</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">Tell us what you have.</h2>
            <p className="mt-6 text-ink-soft">
              A rough description is enough. We&rsquo;ll review it, ask any follow-up questions and — where it makes sense — visit the
              site to document the material for its Material Passport.
            </p>
            <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm text-ink-soft">
              <p className="flex gap-3">
                <span className="font-mono text-wood">→</span> Wood needing refurbishment can be sent to partner workshops.
              </p>
              <p className="flex gap-3">
                <span className="font-mono text-wood">→</span> Materials with a unique provenance can command a premium.
              </p>
              <p className="flex gap-3">
                <span className="font-mono text-wood">→</span> Currently Lisbon and surrounding areas, wood only.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <OfferForm />
          </div>
        </div>
      </section>
    </div>
  );
}
