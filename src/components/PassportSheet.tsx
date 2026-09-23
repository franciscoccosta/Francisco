import Image from "next/image";
import { co2Tonnes, type Material } from "@/lib/materials";

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`border-t border-line py-3 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-[0.95rem] leading-snug text-charcoal">{value}</dd>
    </div>
  );
}

/** Circular "issued" stamp with the slogan set on a path. */
export function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text fontFamily="var(--font-plex-mono)" fontSize="8.4" letterSpacing="2.6" fill="currentColor">
        <textPath href="#stamp-circle">GIVING THE PAST A FUTURE · REMADE · LISBOA ·</textPath>
      </text>
      <text x="60" y="57" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="15" fill="currentColor">
        Re<tspan fontStyle="italic">Made</tspan>
      </text>
      <text x="60" y="71" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="6" letterSpacing="1.5" fill="currentColor">
        PASSPORT
      </text>
    </svg>
  );
}

/**
 * The Material Passport as a document. Used on the homepage (as the example)
 * and at the heart of every passport page.
 */
export function PassportSheet({ m, showStory = true, className = "" }: { m: Material; showStory?: boolean; className?: string }) {
  return (
    <div
      className={`paper-grain relative overflow-hidden rounded-[3px] bg-[#f8f4ec] text-charcoal shadow-[0_1px_0_rgba(0,0,0,.04),0_30px_60px_-30px_rgba(58,42,31,.45)] ${className}`}
    >
      <div className="relative flex items-center justify-between border-b border-line bg-linen/70 px-6 py-4 sm:px-8">
        <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">Material Passport</p>
        <p className="font-mono text-[0.65rem] tracking-[0.2em] text-walnut">Nº {m.id}</p>
      </div>

      <div className="relative grid gap-8 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-linen">
            <Image src={m.images[0]} alt="" fill sizes="180px" className="object-cover" />
          </div>
          <Stamp className="mt-6 hidden h-24 w-24 -rotate-12 text-walnut/70 sm:block" />
        </div>

        <div>
          <p className="display text-3xl leading-tight sm:text-4xl">{m.material}</p>
          <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
            <Field label="Origin" value={m.project} />
            <Field label="Building" value={m.building} />
            <Field label="Location" value={m.location} />
            <Field label="Approximate age" value={m.approximateAge} />
            <Field label="Previous use" value={m.previousUse} />
            <Field label="Wood species" value={m.species} />
            <Field label="Condition" value={`Grade ${m.grade}`} />
            <Field label="Dimensions" value={m.dimensions} />
            <Field label="Estimated quantity" value={m.quantity} />
            <div className="border-t border-line py-3">
              <dt className="font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase">Estimated CO₂ saved</dt>
              <dd className="mt-1 flex items-baseline gap-1.5 text-moss-dark">
                <span className="display text-3xl">~{co2Tonnes(m)}</span>
                <span className="text-sm">t CO₂e (indicative)</span>
              </dd>
            </div>
          </dl>
          {showStory && (
            <div className="border-t border-line pt-4">
              <p className="font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase">Short story</p>
              <p className="mt-2 font-display text-lg leading-snug italic">{m.shortStory}</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-4 border-t border-dashed border-line px-6 py-3 sm:px-8">
        <p className="font-mono text-[0.58rem] tracking-[0.18em] text-muted uppercase">Prototype · potential recovery source</p>
        {/* Decorative code strip */}
        <div className="flex h-5 items-stretch gap-[2px] opacity-60" aria-hidden>
          {m.id
            .replace(/\D/g, "")
            .padEnd(12, "7")
            .split("")
            .concat("3141592653".split(""))
            .map((d, i) => (
              <span key={i} className="bg-charcoal" style={{ width: `${(Number(d) % 3) + 1}px` }} />
            ))}
        </div>
      </div>
    </div>
  );
}
