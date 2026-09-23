import Image from "next/image";
import { CONDITION_LABELS, PROTOTYPE_LABEL, formatKg, impact, type Material } from "@/lib/materials";

/**
 * The Material Passport as a physical-feeling document: the visual signature of
 * ReMade. Used as the showcase on the home page and at the top of each passport.
 */
export function PassportDocument({ m, compact = false }: { m: Material; compact?: boolean }) {
  const { co2Kg } = impact(m);
  const fields: [string, string][] = [
    ["Origin", m.origin],
    ["Building", m.sourceType],
    ["Location", m.location],
    ["Approximate age", m.age],
    ["Previous use", m.previousUse],
    ["Wood species", m.species],
    ["Condition", CONDITION_LABELS[m.condition]],
    ["Dimensions", m.dimensions],
    ["Estimated quantity", m.quantity],
  ];

  return (
    <div className="passport-paper relative overflow-hidden rounded-[3px] text-ink shadow-[0_40px_80px_-40px_rgb(34_28_23/0.55),0_2px_6px_rgb(34_28_23/0.08)] ring-1 ring-wood/20">
      {/* Header band */}
      <div className="flex items-center justify-between border-b border-dashed border-wood/40 px-6 py-4 md:px-8">
        <div>
          <p className="eyebrow text-[0.62rem] text-wood-dark">ReMade · Lisboa</p>
          <p className="display mt-1 text-2xl md:text-[1.7rem]">Material Passport</p>
        </div>
        <div className="text-right">
          <p className="eyebrow text-[0.6rem] text-ink-mute">Material ID</p>
          <p className="mt-1 font-mono text-base font-medium tracking-[0.18em]">{m.id}</p>
        </div>
      </div>

      <div className={`grid gap-6 px-6 py-6 md:px-8 md:py-7 ${compact ? "md:grid-cols-[150px_1fr]" : "md:grid-cols-[190px_1fr]"}`}>
        <div className="space-y-4">
          <div className="relative w-36 md:w-auto">
            <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-ink/10">
              <Image src={m.images[0]} alt="" fill sizes="200px" className="object-cover sepia-[0.15]" />
            </div>
            <Stamp id={`stamp-${m.id}`} co2={formatKg(co2Kg)} />
          </div>
          <p className="eyebrow text-[0.58rem] leading-relaxed text-ink-mute">Material · {m.material}</p>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k} className="border-b border-wood/15 pb-2.5">
              <dt className="eyebrow text-[0.58rem] text-wood-dark/80">{k}</dt>
              <dd className={`mt-1 text-[0.86rem] leading-snug ${/to be verified/i.test(v) ? "text-ink-soft italic" : ""}`}>{v}</dd>
            </div>
          ))}
          <div className="border-b border-wood/15 pb-2.5">
            <dt className="eyebrow text-[0.58rem] text-wood-dark/80">Estimated CO₂ saved</dt>
            <dd className="mt-1 text-[0.86rem] font-semibold text-moss-dark">≈ {formatKg(co2Kg)} CO₂e</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-dashed border-wood/40 px-6 py-5 md:px-8">
        <p className="eyebrow text-[0.58rem] text-wood-dark/80">Short story</p>
        <p className="display mt-2 text-xl italic leading-snug md:text-2xl">&ldquo;{m.headline}&rdquo;</p>
      </div>

      <div className="flex items-center justify-between bg-ink/[0.04] px-6 py-3 md:px-8">
        <p className="eyebrow text-[0.55rem] text-ink-mute">{PROTOTYPE_LABEL}</p>
        <p className="font-mono text-[0.6rem] tracking-widest text-ink-mute">{`${m.id.replace(/-/g, "<")}<<REMADE<LISBOA<<`}</p>
      </div>

    </div>
  );
}

function Stamp({ id, co2 }: { id: string; co2: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="pointer-events-none absolute -bottom-8 -right-3 h-24 w-24 rotate-[-14deg] text-moss-dark opacity-80"
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="8.5" fontFamily="monospace" letterSpacing="2.2" fill="currentColor">
        <textPath href={`#${id}`}>GIVING THE PAST A FUTURE · REMADE ·</textPath>
      </text>
      <text x="60" y="56" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" letterSpacing="1">
        CO₂ SAVED
      </text>
      <text x="60" y="71" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="600" fill="currentColor">
        ≈{co2}
      </text>
    </svg>
  );
}
