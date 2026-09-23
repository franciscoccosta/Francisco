import Image from "next/image";
import Link from "next/link";
import { categoryLabel, co2Tonnes, type Material } from "@/lib/materials";
import { PrototypeLabel, StatusBadge } from "./MaterialBits";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-line/80 py-2 text-[0.82rem]">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

export function MaterialCard({ m, variant = "catalogue", priority = false }: { m: Material; variant?: "featured" | "catalogue"; priority?: boolean }) {
  const featured = variant === "featured";
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/materials/${m.slug}`}
        className={`relative block overflow-hidden rounded-[2px] bg-linen ${featured ? "aspect-[4/5]" : "aspect-[4/3]"}`}
        aria-label={`${m.material} — ${m.project}`}
      >
        <Image
          src={m.images[0]}
          alt=""
          fill
          priority={priority}
          sizes={featured ? "(min-width: 1024px) 30vw, 90vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"}
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute top-4 left-4">
          <StatusBadge status={m.status} />
        </div>
        <span className="absolute right-4 bottom-4 font-mono text-[0.65rem] tracking-[0.15em] text-cream/90">{m.id}</span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <PrototypeLabel />
        <p className="eyebrow mt-3">{categoryLabel(m.category)}</p>
        <h3 className="display mt-2 text-[1.9rem] leading-[1.02]">{m.material}</h3>
        <p className="mt-2 text-[0.95rem] text-ink">{m.project}</p>
        <p className="text-sm text-muted">{m.location}</p>

        {featured ? (
          <>
            <p className="mt-3 text-sm text-muted">Approx. age: {m.approximateAge}</p>
            <div className="mt-auto pt-6">
              <Link href={`/materials/${m.slug}`} className="btn btn-outline min-h-11" data-cta={`featured: view story ${m.id}`}>
                View its story <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <dl className="mt-5">
              <Row label="Wood" value={m.species} />
              <Row label="Dimensions" value={m.dimensions} />
              <Row label="Condition" value={`Grade ${m.grade}`} />
              <Row label="Quantity" value={m.quantity} />
              <Row label="Est. CO₂ saved" value={`~${co2Tonnes(m)} t CO₂e`} />
            </dl>
            <div className="mt-auto pt-6">
              <Link href={`/materials/${m.slug}`} className="btn btn-dark min-h-11 w-full" data-cta={`catalogue: passport ${m.id}`}>
                View Material Passport
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
