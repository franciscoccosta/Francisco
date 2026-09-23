import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "./Gallery";
import { MaterialCard, PrototypeTag, StatusBadge } from "@/components/MaterialCard";
import { PassportDocument } from "@/components/PassportDocument";
import { Reveal } from "@/components/Reveal";
import { InterestButton } from "@/components/forms/InterestModal";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  CO2_T_PER_M3,
  DENSITY_KG_PER_M3,
  MATERIALS,
  formatKg,
  getMaterial,
  impact,
} from "@/lib/materials";

export function generateStaticParams() {
  return MATERIALS.map((m) => ({ id: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/materials/[id]">): Promise<Metadata> {
  const m = getMaterial((await params).id);
  if (!m) return {};
  return {
    title: `${m.material} · ${m.id}`,
    description: `Material Passport for ${m.material} — ${m.origin}, ${m.location}. ${m.headline}`,
  };
}

export default async function PassportPage({ params }: PageProps<"/materials/[id]">) {
  const m = getMaterial((await params).id);
  if (!m) notFound();

  const { volume, wasteKg, co2Kg } = impact(m);
  const related = MATERIALS.filter((x) => x.id !== m.id).slice(0, 3);

  const passport: [string, string][] = [
    ["Material ID", m.id],
    ["Material", m.material],
    ["Origin", m.origin],
    ["Location", m.location],
    ["Approximate age", m.age],
    ["Previous use", m.previousUse],
    ["Wood species", m.species],
    ["Condition", CONDITION_LABELS[m.condition]],
    ["Dimensions", m.dimensions],
    ["Estimated quantity", m.quantity],
    ["Estimated CO₂ saved", `≈ ${formatKg(co2Kg)} CO₂e (indicative)`],
  ];

  return (
    <div className="pt-18">
      {/* Gallery */}
      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10">
        <nav className="mb-5 flex items-center gap-2 text-sm text-ink-mute" aria-label="Breadcrumb">
          <Link href="/materials" className="hover:text-ink">
            Browse wood
          </Link>
          <span>/</span>
          <span className="font-mono text-xs tracking-widest text-ink">{m.id}</span>
        </nav>
        <Gallery images={m.images} alt={`${m.material} — ${m.origin}`} materialId={m.id} />
      </div>

      {/* Title + CTA */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={m.status} />
            <span className="eyebrow text-ink-mute">{CATEGORY_LABELS[m.category]}</span>
          </div>
          <h1 className="display mt-6 text-6xl md:text-8xl">{m.material}</h1>
          <p className="mt-5 text-xl text-ink-soft">
            {m.origin} <span className="text-ink-mute">· {m.location}</span>
          </p>
          <PrototypeTag className="mt-6 text-wood" />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="bg-paper p-6 ring-1 ring-line md:p-8">
            <dl className="grid grid-cols-3 gap-4 border-b border-line pb-6 text-center">
              <Stat label="Est. CO₂ saved" value={`≈ ${formatKg(co2Kg)}`} />
              <Stat label="Condition" value={`Grade ${m.condition}`} />
              <Stat label="Volume" value={`≈ ${volume} m³`} />
            </dl>
            <div className="pt-6">
              <InterestButton materialId={m.id} materialName={`${m.material} — ${m.origin}`} slug={m.slug} />
              <p className="mt-3 text-center text-xs text-ink-mute">No account, no payment. We&rsquo;ll contact you shortly.</p>
            </div>
          </div>
        </aside>
      </section>

      {/* Passport */}
      <section className="border-y border-line bg-cream-deep">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-wood">Material Passport</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">A record that travels with the wood.</h2>
            <p className="mt-6 text-ink-soft">
              Origin, previous use, characteristics and impact — documented once and handed on to every future owner of the material.
              Anything not yet confirmed is marked &ldquo;To be verified&rdquo;.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={120}>
            <div className="passport-paper ring-1 ring-wood/20">
              <div className="flex items-center justify-between border-b border-dashed border-wood/40 px-6 py-4 md:px-8">
                <p className="eyebrow text-wood-dark">ReMade · Material Passport</p>
                <p className="font-mono text-sm tracking-[0.18em]">{m.id}</p>
              </div>
              <dl className="divide-y divide-wood/15 px-6 md:px-8">
                {passport.map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="eyebrow pt-0.5 text-[0.66rem] text-wood-dark/80">{k}</dt>
                    <dd className={`text-[0.98rem] ${/to be verified/i.test(v) ? "italic text-ink-soft" : ""} ${k === "Material ID" ? "font-mono tracking-widest" : ""}`}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-wood">The story</p>
          <p className="display mt-4 text-4xl italic md:text-5xl">&ldquo;{m.headline}&rdquo;</p>
        </Reveal>
        <Reveal className="lg:col-span-7 lg:col-start-6" delay={120}>
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-ink">
            {m.story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            <div>
              <p className="eyebrow text-ink-mute">About the site</p>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                {m.siteFacts.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-wood" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-ink-mute">Sources</p>
              <ul className="mt-4 space-y-3 text-sm">
                {m.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink-soft underline decoration-line underline-offset-4 hover:text-wood hover:decoration-wood">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ink-mute">
                Building facts are taken from the sources above. ReMade has not recovered material from this site; the material itself is
                a prototype example.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Impact */}
      <section className="bg-moss-dark text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-28">
          <Reveal>
            <p className="eyebrow text-moss-light">Environmental impact</p>
            <h2 className="display mt-4 max-w-3xl text-5xl md:text-6xl">What reusing this material saves.</h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-cream/15 md:grid-cols-3">
            {[
              ["Material reused", `≈ ${volume} m³`, "of timber kept in use instead of replaced."],
              ["Waste diverted", `≈ ${formatKg(wasteKg)}`, "kept out of disposal or downcycling."],
              ["CO₂ avoided", `≈ ${formatKg(co2Kg)} CO₂e`, "compared with purchasing equivalent new sawn timber."],
            ].map(([k, v, d], i) => (
              <Reveal key={k} delay={i * 100} className="bg-moss-dark py-8 md:px-8 md:first:pl-0">
                <p className="eyebrow text-moss-light">{k}</p>
                <p className="display mt-4 text-6xl">{v}</p>
                <p className="mt-3 text-sm text-cream/70">{d}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-cream/55">
            Indicative estimates for this prototype: volume from the estimated quantity; waste at ~{DENSITY_KG_PER_M3} kg/m³; CO₂ at ~
            {CO2_T_PER_M3} t CO₂e avoided per m³ of new sawn timber not produced (cradle-to-gate, excluding biogenic carbon and
            transport). Figures will be replaced by measured values once a material is verified.
          </p>
        </div>
      </section>

      {/* CTA + passport preview */}
      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow text-wood">Giving the past a future</p>
          <h2 className="display mt-4 text-5xl md:text-7xl">Make it part of your next project.</h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Tell us about your project and the quantity you need. We&rsquo;ll confirm availability, verification status and next steps.
          </p>
          <div className="mt-10 max-w-sm">
            <InterestButton materialId={m.id} materialName={`${m.material} — ${m.origin}`} slug={m.slug} />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <PassportDocument m={m} compact />
        </Reveal>
      </section>

      {/* Related */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
          <div className="flex items-end justify-between">
            <h2 className="display text-4xl md:text-5xl">More materials with a past</h2>
            <Link href="/materials" className="hidden text-sm font-semibold underline underline-offset-4 hover:text-wood md:block">
              Browse all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => (
              <MaterialCard key={r.id} m={r} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-[0.58rem] text-ink-mute">{label}</dt>
      <dd className="display mt-2 text-2xl">{value}</dd>
    </div>
  );
}
