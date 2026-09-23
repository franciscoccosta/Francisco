import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "ReMade is a B2B circular marketplace for reclaimed construction wood, starting in Lisbon.",
};

const FOCUS = [
  { k: "Lisbon", d: "One city, its buildings and its studios — close enough to visit every site and meet every buyer." },
  { k: "Wood", d: "The material with the most character, the clearest story and the simplest path to reuse." },
  { k: "B2B", d: "Builders who have the material, and architects and designers who specify it." },
];

const TEAM = ["Alexej Samy", "Francisco Costa", "Henrique Fonseca", "Joachim Hegge", "Philipp Bodnar", "Sebastian Holt"];

export default function About() {
  return (
    <>
      <section className="container-x pt-36 pb-20 md:pt-48 md:pb-28">
        <p className="eyebrow animate-fade-up">About ReMade</p>
        <h1 className="display animate-fade-up mt-6 max-w-5xl text-6xl [animation-delay:120ms] md:text-[7.5rem]">
          Giving the past <span className="italic">a future.</span>
        </h1>
      </section>

      <section className="container-x grid gap-14 pb-24 md:grid-cols-12 md:pb-32">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-linen md:col-span-5">
          <Image src="/images/editorial-stack.jpg" alt="Stacked reclaimed timber" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7 md:pt-16" delay={120}>
          <p className="display text-3xl leading-[1.2] md:text-[2.6rem]">
            ReMade was created around a simple idea: materials should not lose their value when a building changes.
          </p>
          <p className="mt-10 text-lg leading-relaxed text-ink">
            Across Lisbon, renovation and demolition projects produce materials that still have decades of life left. At
            the same time, architects and designers are searching for distinctive materials with lower environmental
            impact.
          </p>
          <p className="display mt-10 text-4xl">ReMade connects the two.</p>
        </Reveal>
      </section>

      <section className="bg-linen">
        <div className="container-x py-24 md:py-32">
          <Reveal className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow">Where we start</p>
              <h2 className="display mt-6 text-5xl md:text-6xl">Small on purpose.</h2>
            </div>
            <p className="self-end leading-relaxed text-ink md:col-span-5 md:col-start-8">
              We start focused so we can build — and prove — a circular marketplace that works before expanding to more
              materials and more cities.
            </p>
          </Reveal>
          <dl className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {FOCUS.map((f, i) => (
              <Reveal key={f.k} delay={i * 120} className="bg-linen p-8 md:p-10">
                <dt className="display text-6xl md:text-7xl">{f.k}</dt>
                <dd className="mt-6 leading-relaxed text-muted">{f.d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-24">
        <p className="eyebrow md:col-span-3">The team</p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-ink sm:grid-cols-3 md:col-span-8">
          {TEAM.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-16 sm:flex-row">
          <Link href="/for-designers" className="btn btn-dark min-h-14 px-8 text-base" data-cta="about: looking for wood">
            I&rsquo;m looking for wood
          </Link>
          <Link href="/for-builders#offer" className="btn btn-outline min-h-14 px-8 text-base" data-cta="about: have wood">
            I have wood to offer
          </Link>
        </div>
      </section>
    </>
  );
}
