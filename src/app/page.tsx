import Image from "next/image";
import Link from "next/link";
import { FEATURED, getMaterial, type Material } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";
import { PassportSheet } from "@/components/PassportSheet";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Recover",
    text: "Construction and renovation companies tell ReMade about reusable wood.",
    icon: (
      <path d="M6 30h36M6 22h36M10 22v8M38 22v8M24 8v10M19 13l5 5 5-5" />
    ),
  },
  {
    n: "02",
    title: "Match",
    text: "ReMade makes the material visible to architects and designers before unnecessary disposal or storage.",
    icon: (
      <>
        <circle cx="18" cy="24" r="10" />
        <circle cx="30" cy="24" r="10" />
      </>
    ),
  },
  {
    n: "03",
    title: "Reuse",
    text: "The material enters a new project with its history preserved through its ReMade Material Passport.",
    icon: (
      <>
        <circle cx="24" cy="24" r="16" />
        <path d="M24 12a12 12 0 1 1-12 12" />
        <path d="M24 17a7 7 0 1 1-7 7" />
      </>
    ),
  },
];

export default function Home() {
  const featured = FEATURED.map(getMaterial).filter(Boolean) as Material[];
  const example = getMaterial("rm-lx-002")!;

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-cream">
        <Image
          src="/images/hero-beam.jpg"
          alt="Close-up of an aged timber beam with bolt holes and seasoning cracks"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/30" />

        <div className="relative container-x pt-32 pb-12 md:pb-16">
          <p className="eyebrow animate-fade-up !text-cream/70">Reclaimed wood · Lisbon</p>
          <h1 className="display animate-fade-up mt-6 max-w-5xl text-[3.6rem] [animation-delay:120ms] sm:text-8xl lg:text-[8.5rem]">
            Giving the past <span className="italic">a future.</span>
          </h1>
          <p className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-cream/85 [animation-delay:240ms] md:text-xl">
            ReMade connects wood from Lisbon&rsquo;s buildings with the architects and designers creating what comes next.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <Link href="/for-designers" className="btn btn-light min-h-14 px-8 text-base" data-cta="hero: looking for wood">
              I&rsquo;m looking for wood
            </Link>
            <Link href="/for-builders#offer" className="btn btn-outline-light min-h-14 px-8 text-base" data-cta="hero: have wood">
              I have wood to offer
            </Link>
          </div>

          <dl className="animate-fade-up mt-16 grid grid-cols-3 gap-6 border-t border-cream/20 pt-6 [animation-delay:520ms] md:mt-24">
            {[
              ["Past", "Every piece has a history."],
              ["Future", "It belongs in your next project."],
              ["Impact", "Less waste, less new material."],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-cream/60 uppercase">{k}</dt>
                <dd className="mt-2 hidden text-sm text-cream/85 sm:block">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container-x grid gap-12 py-24 md:grid-cols-12 md:py-36">
        <Reveal className="md:col-span-6">
          <p className="eyebrow">The problem</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">Good material shouldn&rsquo;t become waste.</h2>
        </Reveal>
        <Reveal className="flex flex-col justify-end md:col-span-5 md:col-start-8" delay={120}>
          <p className="text-lg leading-relaxed text-ink">
            Renovation and demolition projects across Lisbon regularly dispose of beams, floorboards and doors that
            still have decades of life in them.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            At the same time, architects and designers are searching for distinctive, sustainable materials. The two
            rarely meet in time.
          </p>
        </Reveal>
        <Reveal className="relative aspect-[16/9] overflow-hidden md:col-span-12 md:mt-6 md:aspect-[21/8]" delay={80}>
          <Image src="/images/editorial-boards.jpg" alt="Weathered reclaimed boards" fill sizes="100vw" className="object-cover" />
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-linen">
        <div className="container-x py-24 md:py-32">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display mt-6 text-5xl md:text-7xl">From one building to the next.</h2>
            </div>
            <p className="max-w-sm text-muted">
              Whenever possible, the material stays on site until a buyer is found — less storage, less transport.
            </p>
          </Reveal>
          <ol className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 120} className="flex flex-col bg-linen p-8 md:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted">{s.n}</span>
                  <svg viewBox="0 0 48 48" className="h-11 w-11 text-walnut" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                    {s.icon}
                  </svg>
                </div>
                <h3 className="display mt-14 text-4xl uppercase tracking-wide md:text-5xl">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ink">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x py-24 md:py-36">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">From the catalogue</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">Materials with a past.</h2>
          </div>
          <Link href="/materials" className="link-underline self-start text-sm md:self-auto" data-cta="featured: browse all">
            Browse all wood →
          </Link>
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {featured.map((m, i) => (
            <Reveal key={m.id} delay={i * 120} className={i === 1 ? "md:mt-16" : ""}>
              <MaterialCard m={m} variant="featured" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* PASSPORT */}
      <section className="bg-bark text-cream">
        <div className="container-x grid items-center gap-16 py-24 md:py-32 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow !text-cream/60">The Material Passport</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">More than a piece of wood.</h2>
            <p className="mt-8 text-lg leading-relaxed text-cream/80">Every ReMade material carries its history forward.</p>
            <p className="mt-4 leading-relaxed text-cream/60">
              Origin, previous life, species, condition and measurable impact — documented once, and handed on with the
              material into its next project.
            </p>
            <Link href={`/materials/${example.slug}`} className="btn btn-light mt-10" data-cta="home: open example passport">
              Open this passport
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={150}>
            <div className="lg:rotate-[1.2deg]">
              <PassportSheet m={example} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-charcoal text-cream">
        <Image src="/images/editorial-stack.jpg" alt="" fill sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 to-charcoal/30" />
        <div className="relative container-x py-28 md:py-40">
          <Reveal>
            <p className="eyebrow !text-cream/60">Giving the past a future</p>
            <h2 className="display mt-6 max-w-4xl text-5xl md:text-8xl">Be part of a more circular Lisbon.</h2>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link href="/materials" className="btn btn-light min-h-14 px-8 text-base" data-cta="footer cta: find wood">
                Find reclaimed wood
              </Link>
              <Link href="/for-builders#offer" className="btn btn-outline-light min-h-14 px-8 text-base" data-cta="footer cta: offer material">
                Offer material
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
