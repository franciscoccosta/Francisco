import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CO2_T_PER_M3, DENSITY_KG_PER_M3, MATERIALS, categoryLabel, co2Tonnes, getMaterial, wasteTonnes } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";
import { PrototypeLabel, StatusBadge } from "@/components/MaterialBits";
import { PassportSheet } from "@/components/PassportSheet";
import { Reveal } from "@/components/Reveal";
import { TrackPassportView } from "@/components/Tracker";
import { InterestButton } from "./InterestModal";

export function generateStaticParams() {
  return MATERIALS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/materials/[slug]">): Promise<Metadata> {
  const m = getMaterial((await params).slug);
  if (!m) return {};
  return {
    title: `${m.material} — ${m.project}`,
    description: m.teaser,
    openGraph: { images: [m.images[0]] },
  };
}

export default async function PassportPage({ params }: PageProps<"/materials/[slug]">) {
  const m = getMaterial((await params).slug);
  if (!m) notFound();

  const others = MATERIALS.filter((x) => x.slug !== m.slug).slice(0, 3);
  const [main, ...rest] = m.images;

  return (
    <>
      <TrackPassportView materialId={m.slug} />

      {/* GALLERY */}
      <section className="container-x pt-24 md:pt-28">
        <nav className="flex items-center justify-between py-4 text-sm">
          <Link href="/materials" className="link-underline text-muted">
            ← All materials
          </Link>
          <span className="font-mono text-xs tracking-[0.18em] text-muted">{m.id}</span>
        </nav>
        <div className="grid gap-3 md:grid-cols-3 md:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-linen md:col-span-2 md:row-span-2 md:aspect-auto">
            <Image src={main} alt={`${m.material} — illustrative image`} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="animate-slow-zoom object-cover" />
          </div>
          {rest.map((src, i) => (
            <div key={src} className="relative hidden aspect-[4/3] overflow-hidden bg-linen md:block">
              <Image src={src} alt={`${m.material} — detail ${i + 1}, illustrative`} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Illustrative images of reclaimed timber — not photographs of this site.</p>
      </section>

      {/* HEADER */}
      <section className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={m.status} />
            <span className="eyebrow">{categoryLabel(m.category)}</span>
          </div>
          <h1 className="display mt-6 text-6xl md:text-8xl">{m.material}</h1>
          <p className="mt-6 text-xl text-ink">{m.project}</p>
          <p className="text-muted">{m.location}</p>
        </div>
        <div className="flex flex-col justify-end gap-4 md:col-span-4">
          <PrototypeLabel />
          <p className="text-sm leading-relaxed text-muted">{m.recoveryNote}</p>
          <InterestButton slug={m.slug} id={m.id} material={m.material} className="w-full" />
        </div>
      </section>

      {/* PASSPORT */}
      <section className="bg-linen">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow">Material Passport</p>
            <p className="display mt-6 text-4xl md:text-5xl">{m.id}</p>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              The record that travels with this material into its next project. Unknowns are marked &ldquo;To be
              verified&rdquo; until confirmed on site; dimensions, quantities and CO₂ are indicative.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-9" delay={120}>
            <PassportSheet m={m} />
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <p className="eyebrow">The story</p>
        </Reveal>
        <div className="lg:col-span-8">
          {m.story.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className={i === 0 ? "display text-3xl leading-[1.2] md:text-[2.6rem]" : "mt-8 text-lg leading-relaxed text-ink"}>{p}</p>
            </Reveal>
          ))}

          <Reveal className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
            <div>
              <p className="eyebrow">What we know</p>
              <ul className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-ink">
                {m.facts.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-walnut" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Sources</p>
              <ul className="mt-5 space-y-3 text-sm">
                {m.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted underline decoration-line underline-offset-4 hover:text-charcoal">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-moss-dark text-cream">
        <div className="container-x py-24 md:py-32">
          <Reveal className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow !text-cream/60">Environmental impact</p>
              <h2 className="display mt-6 text-5xl md:text-6xl">What reuse would save.</h2>
            </div>
            <p className="self-end leading-relaxed text-cream/75 md:col-span-5 md:col-start-8">
              Reusing this wood avoids producing equivalent new timber and keeps the carbon it stores locked away,
              instead of sending it to landfill or incineration.
            </p>
          </Reveal>
          <dl className="mt-16 grid gap-px overflow-hidden bg-cream/15 sm:grid-cols-3">
            {[
              { k: "Material reused", v: `~${m.volumeM3}`, u: "m³ of timber" },
              { k: "Waste diverted", v: `~${wasteTonnes(m)}`, u: "tonnes kept out of the skip" },
              { k: "CO₂ avoided", v: `~${co2Tonnes(m)}`, u: "t CO₂e vs. buying new" },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 120} className="bg-moss-dark p-8 md:p-10">
                <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-cream/60 uppercase">{s.k}</dt>
                <dd className="mt-6">
                  <span className="display text-7xl md:text-8xl">{s.v}</span>
                  <span className="mt-2 block text-sm text-cream/70">{s.u}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-cream/55">
            Indicative estimate for this prototype, based on the indicative volume above, an average density of{" "}
            {DENSITY_KG_PER_M3} kg/m³ and a placeholder factor of {CO2_T_PER_M3} t CO₂e per m³ (avoided new-timber production
            plus stored carbon). To be replaced with a verified life-cycle assessment per material.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24 text-center md:py-32">
        <Reveal>
          <p className="eyebrow">Giving the past a future</p>
          <h2 className="display mx-auto mt-6 max-w-3xl text-5xl md:text-7xl">Could this be part of your next project?</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <InterestButton slug={m.slug} id={m.id} material={m.material} />
            <Link href="/for-designers#join" className="btn btn-outline min-h-14 px-8 text-base" data-cta={`passport: looking for other wood ${m.id}`}>
              Looking for something else?
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="container-x py-20">
          <p className="eyebrow">More materials with a past</p>
          <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
            {others.map((o) => (
              <MaterialCard key={o.id} m={o} variant="featured" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
