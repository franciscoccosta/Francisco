import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { FeaturedCard } from "@/components/MaterialCard";
import { PassportDocument } from "@/components/PassportDocument";
import { Reveal } from "@/components/Reveal";
import { FEATURED_SLUGS, MATERIALS, getMaterial } from "@/lib/materials";

const STEPS = [
  {
    n: "01",
    title: "Recover",
    text: "Construction and renovation companies tell ReMade about reusable wood.",
    icon: (
      <path d="M8 34h32M12 34V20l12-8 12 8v14M20 34v-8h8v8" />
    ),
  },
  {
    n: "02",
    title: "Match",
    text: "ReMade makes the material visible to architects and designers before unnecessary disposal or storage.",
    icon: (
      <>
        <circle cx="18" cy="24" r="9" />
        <circle cx="30" cy="24" r="9" />
      </>
    ),
  },
  {
    n: "03",
    title: "Reuse",
    text: "The material enters a new project with its history preserved through its ReMade Material Passport.",
    icon: (
      <>
        <rect x="12" y="9" width="24" height="30" rx="1.5" />
        <path d="M17 17h14M17 23h14M17 29h8" />
      </>
    ),
  },
];

export default function Home() {
  const featured = FEATURED_SLUGS.map((s) => getMaterial(s)!);
  const showcase = MATERIALS[0];

  return (
    <>
      {/* ───────────────────────── Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-cream">
        <Image
          src="/images/materials/hero-endgrain.jpg"
          alt="Stacked ends of reclaimed timber beams, showing their growth rings"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-40 md:px-10 md:pb-24">
          <p className="eyebrow animate-fade-up text-cream/75">Reclaimed wood · Lisbon · For professionals</p>
          <h1 className="display mt-6 max-w-5xl animate-fade-up text-[3.6rem] [animation-delay:120ms] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            Giving the past <em className="text-wood-light">a future.</em>
          </h1>
          <p className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/85 [animation-delay:240ms] md:text-xl">
            ReMade connects wood from Lisbon&rsquo;s buildings with the architects and designers creating what comes next.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <ButtonLink href="/designers" variant="light" cta="hero_looking_for_wood">
              I&rsquo;m looking for wood
            </ButtonLink>
            <ButtonLink href="/offer" variant="ghost-light" cta="hero_offer_wood">
              I have wood to offer
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Problem */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <p className="eyebrow text-wood">The problem</p>
            <h2 className="display mt-5 text-5xl md:text-7xl">Good material shouldn&rsquo;t become waste.</h2>
          </Reveal>
          <Reveal className="md:col-span-5 md:col-start-8 md:pt-14" delay={120}>
            <p className="text-lg leading-relaxed text-ink-soft">
              Renovation and demolition projects regularly dispose of wood that still has decades of life in it — beams, floorboards,
              doors, planks.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              At the same time, architects and designers are searching for distinctive, sustainable materials with character and
              provenance. The two rarely meet. ReMade exists to connect them.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-6">
          <Reveal className="relative col-span-12 aspect-[16/10] overflow-hidden md:col-span-7">
            <Image src="/images/materials/alfama-laths.jpg" alt="Timber laths with lime mortar residue" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal className="relative col-span-6 aspect-square overflow-hidden md:col-span-3 md:mt-24" delay={120}>
            <Image src="/images/materials/pombaline-end.jpg" alt="End grain of old beams" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
          </Reveal>
          <Reveal className="relative col-span-6 aspect-[3/4] overflow-hidden md:col-span-2 md:-mt-10" delay={220}>
            <Image src="/images/materials/bombarda-door-detail.jpg" alt="Old painted door panel" fill sizes="(min-width:768px) 17vw, 50vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── How it works */}
      <section id="how-it-works" className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-wood">How it works</p>
              <h2 className="display mt-5 text-5xl md:text-7xl">Three simple steps.</h2>
            </div>
            <p className="max-w-sm text-ink-soft">
              Free for construction companies. Whenever possible the wood stays on site until a buyer is found — less storage, less
              transport.
            </p>
          </Reveal>

          <ol className="mt-16 grid gap-px bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 120} className="bg-paper p-8 md:p-10">
                <div className="flex items-start justify-between">
                  <svg viewBox="0 0 48 48" className="h-12 w-12 text-wood" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                    {s.icon}
                  </svg>
                  <span className="font-mono text-sm text-ink-mute">{s.n}</span>
                </div>
                <h3 className="eyebrow mt-12 text-base tracking-[0.22em] text-ink">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="mt-6 grid gap-4 text-sm text-ink-soft md:grid-cols-3">
            <p className="flex gap-3"><Dot /> Wood needing refurbishment can go to partner workshops.</p>
            <p className="flex gap-3"><Dot /> Architects and designers purchase the reclaimed wood.</p>
            <p className="flex gap-3"><Dot /> Every sold material receives a Material Passport.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Two audiences */}
      <section className="grid md:grid-cols-2">
        <AudiencePanel
          href="/offer"
          cta="split_offer_wood"
          image="/images/materials/beato-beams.jpg"
          eyebrow="For construction & renovation companies"
          title="I have wood to offer"
          text="Tell us about reusable wood on your site. It's free, takes two minutes and could save on disposal."
        />
        <AudiencePanel
          href="/designers"
          cta="split_looking_for_wood"
          image="/images/materials/alfama-floor.jpg"
          eyebrow="For architects & interior designers"
          title="I'm looking for wood"
          text="Tell us what your next project needs. We'll find reclaimed wood with character, provenance and measurable impact."
        />
      </section>

      {/* ───────────────────────── Featured materials */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-wood">Featured</p>
            <h2 className="display mt-5 text-5xl md:text-7xl">Materials with a past.</h2>
          </div>
          <Link href="/materials" className="group inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-sm font-semibold hover:border-wood hover:text-wood md:self-auto">
            Browse all materials
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 10h13M11 5l5 5-5 5" />
            </svg>
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {featured.map((m, i) => (
            <Reveal key={m.id} delay={i * 120}>
              <FeaturedCard m={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Material passport */}
      <section className="overflow-hidden bg-cream-deep">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-wood">The Material Passport</p>
            <h2 className="display mt-5 text-5xl md:text-7xl">More than a piece of wood.</h2>
            <p className="mt-6 text-xl text-ink-soft">Every ReMade material carries its history forward.</p>
            <ul className="mt-10 space-y-6">
              {[
                ["Past", "Where it comes from: the building, the neighbourhood, its previous life."],
                ["Future", "What it is now: species, condition, dimensions — ready to specify."],
                ["Impact", "What reusing it saves: waste diverted and CO₂ avoided."],
              ].map(([k, v]) => (
                <li key={k} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-ink/15 pt-5">
                  <span className="eyebrow pt-1 text-wood-dark">{k}</span>
                  <span className="text-ink-soft">{v}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href={`/materials/${showcase.slug}`} variant="secondary" className="mt-10" cta="home_passport_example">
              Open an example passport
            </ButtonLink>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:pl-6" delay={150}>
            <div className="rotate-[1.2deg] transition-transform duration-700 hover:rotate-0">
              <PassportDocument m={showcase} compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── Final CTA */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <Image src="/images/materials/graca-rafters.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-28 text-center md:px-10 md:py-40">
          <Reveal>
            <p className="eyebrow text-cream/60">Giving the past a future</p>
            <h2 className="display mx-auto mt-6 max-w-4xl text-5xl md:text-8xl">Be part of a more circular Lisbon.</h2>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/materials" variant="light" cta="footer_cta_find_wood">
                Find reclaimed wood
              </ButtonLink>
              <ButtonLink href="/offer" variant="ghost-light" cta="footer_cta_offer_material">
                Offer material
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Dot() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />;
}

function AudiencePanel(props: { href: string; cta: string; image: string; eyebrow: string; title: string; text: string }) {
  return (
    <Link href={props.href} data-cta={props.cta} className="group relative flex min-h-[520px] items-end overflow-hidden bg-ink p-8 text-cream md:min-h-[640px] md:p-12">
      <Image src={props.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-70 transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
      <div className="relative max-w-md">
        <p className="eyebrow text-cream/70">{props.eyebrow}</p>
        <h3 className="display mt-4 text-5xl md:text-6xl">{props.title}</h3>
        <p className="mt-4 text-cream/80">{props.text}</p>
        <span className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition-colors group-hover:bg-wood-light">
          Get started
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 10h13M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
