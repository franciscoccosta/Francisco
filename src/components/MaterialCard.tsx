import Image from "next/image";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  PROTOTYPE_LABEL,
  STATUS_LABELS,
  formatKg,
  impact,
  type Material,
  type Status,
} from "@/lib/materials";

const STATUS_STYLES: Record<Status, string> = {
  available: "bg-moss text-paper",
  "coming-soon": "bg-wood-light text-ink",
  reserved: "bg-ink/80 text-cream",
  potential: "bg-cream text-ink ring-1 ring-ink/15",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${STATUS_STYLES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PrototypeTag({ className = "" }: { className?: string }) {
  return (
    <span className={`eyebrow inline-flex items-center gap-2 text-[0.62rem] ${className}`}>
      <span className="inline-block h-px w-4 bg-current" />
      {PROTOTYPE_LABEL}
    </span>
  );
}

/** Compact card used on the home page. */
export function FeaturedCard({ m, priority = false }: { m: Material; priority?: boolean }) {
  return (
    <Link href={`/materials/${m.slug}`} className="group block" data-cta={`featured_${m.id}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
        <Image
          src={m.images[0]}
          alt={`${m.material} — ${m.origin}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
        <span className="absolute left-5 top-5 font-mono text-[0.7rem] tracking-widest text-cream/90">{m.id}</span>
        <div className="absolute inset-x-5 bottom-5 text-cream">
          <PrototypeTag className="text-cream/75" />
        </div>
      </div>
      <div className="pt-5">
        <p className="eyebrow text-wood">{CATEGORY_LABELS[m.category]}</p>
        <h3 className="display mt-2 text-[2rem]">{m.material}</h3>
        <dl className="mt-4 grid grid-cols-[6.5rem_1fr] gap-y-1.5 text-sm">
          <dt className="text-ink-mute">Origin</dt>
          <dd>{m.origin}</dd>
          <dt className="text-ink-mute">Location</dt>
          <dd>{m.location}</dd>
          <dt className="text-ink-mute">Approx. age</dt>
          <dd className="text-ink-soft">{m.age}</dd>
        </dl>
        <span className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold transition-colors group-hover:border-wood group-hover:text-wood">
          View its story
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 10h13M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** Full catalogue card. */
export function MaterialCard({ m }: { m: Material }) {
  const { co2Kg } = impact(m);
  return (
    <article className="group flex flex-col bg-paper ring-1 ring-line/70 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(34_28_23/0.45)]">
      <Link href={`/materials/${m.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-cream-deep" tabIndex={-1}>
        <Image
          src={m.images[0]}
          alt={`${m.material} — ${m.origin}`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-4 top-4">
          <StatusBadge status={m.status} />
        </div>
        <span className="absolute right-4 top-4 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[0.68rem] tracking-widest text-cream backdrop-blur-sm">
          {m.id}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <PrototypeTag className="text-wood" />
        <p className="eyebrow mt-4 text-ink-mute">{CATEGORY_LABELS[m.category]}</p>
        <h3 className="display mt-1.5 text-[1.9rem]">
          <Link href={`/materials/${m.slug}`} className="hover:text-wood-dark">
            {m.material}
          </Link>
        </h3>
        <p className="mt-1 text-[0.95rem] font-medium text-ink-soft">{m.origin}</p>
        <p className="text-sm text-ink-mute">{m.location}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-[0.82rem]">
          <Spec label="Wood type" value={m.species} />
          <Spec label="Condition" value={CONDITION_LABELS[m.condition].split(" — ")[0]} />
          <Spec label="Dimensions" value={m.dimensions} wide />
          <Spec label="Est. quantity" value={m.quantity} />
          <Spec label="Est. CO₂ saved" value={`≈ ${formatKg(co2Kg)} CO₂e`} />
        </dl>

        <div className="mt-auto pt-6">
          <Link
            href={`/materials/${m.slug}`}
            data-cta={`card_passport_${m.id}`}
            className="flex w-full items-center justify-between rounded-full border border-ink px-5 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-cream"
          >
            View Material Passport
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 10h13M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-ink-mute">{label}</dt>
      <dd className="mt-0.5 leading-snug text-ink">{value}</dd>
    </div>
  );
}
