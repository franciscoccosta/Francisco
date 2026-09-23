import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "ReMade was created around a simple idea: materials should not lose their value when a building changes.",
};

const TEAM = ["Alexej Samy", "Francisco Costa", "Henrique Fonseca", "Joachim Hegge", "Philipp Bodnar", "Sebastian Holt"];

const FOCUS = [
  ["Lisbon", "One city, one network of builders, workshops and studios — close enough to keep material on site and logistics short."],
  ["Wood", "The most common reusable material in Lisbon's buildings, and the one where history and character matter most."],
  ["B2B", "Construction companies on one side, architects and designers on the other — the professionals who decide what gets reused."],
];

export default function AboutPage() {
  return (
    <div className="pt-18">
      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 md:px-10 md:pt-24">
        <p className="eyebrow animate-fade-up text-wood">About ReMade</p>
        <h1 className="display mt-6 max-w-5xl animate-fade-up text-6xl [animation-delay:100ms] md:text-[7.5rem]">
          Giving the past <em className="text-wood">a future.</em>
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-24 md:px-10 md:pb-32 lg:grid-cols-12">
        <Reveal className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
          <Image src="/images/materials/pombaline-detail.jpg" alt="Close-up of reclaimed timber grain" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal className="space-y-6 text-xl leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7 lg:pt-10" delay={120}>
          <p className="display text-4xl leading-tight text-ink md:text-5xl">
            ReMade was created around a simple idea: materials should not lose their value when a building changes.
          </p>
          <p>
            Across Lisbon, renovation and demolition projects produce materials that still have decades of life left. At the same time,
            architects and designers are searching for distinctive materials with lower environmental impact.
          </p>
          <p className="text-ink">ReMade connects the two.</p>
        </Reveal>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-28">
          <Reveal className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow text-wood">Where we start</p>
              <h2 className="display mt-4 text-5xl md:text-6xl">Focused on purpose.</h2>
            </div>
            <p className="text-lg text-ink-soft md:col-span-6 md:col-start-7 md:pt-4">
              We start small on purpose. The objective is to build and validate a focused circular marketplace before expanding to new
              cities or materials.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px bg-line md:grid-cols-3">
            {FOCUS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 100} className="bg-paper p-8">
                <p className="display text-5xl">{k}</p>
                <p className="mt-4 text-ink-soft">{v}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-ink-mute md:col-span-3">The team</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-lg md:col-span-9 md:grid-cols-3">
            {TEAM.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-5 py-20 md:flex-row md:items-center md:justify-between md:px-10">
          <h2 className="display max-w-2xl text-5xl">Help us test the idea — on either side.</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/designers" variant="light" cta="about_looking_for_wood">
              I&rsquo;m looking for wood
            </ButtonLink>
            <ButtonLink href="/offer" variant="ghost-light" cta="about_offer_wood">
              I have wood to offer
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
