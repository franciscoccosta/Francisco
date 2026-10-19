import Image from "next/image";
import Link from "next/link";
import { formatPrice, getCategory, type Product } from "@/lib/catalog";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  return (
    <Link href={`/produto/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_12px_30px_-12px_rgb(19_41_79/0.35)]">
      <div className="relative aspect-square overflow-hidden bg-paper">
        <Image
          src={p.images[0].src}
          alt={p.images[0].alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {p.personalization.length > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-yellow px-2.5 py-1 text-[0.7rem] font-bold text-navy">Personalizável</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="kicker text-blue">{getCategory(p.category)?.name}</p>
        <h3 className="mt-1 font-display text-xl leading-tight font-bold text-navy uppercase">{p.name}</h3>
        {p.includes && <p className="mt-1 text-sm font-semibold text-blue">Inclui {p.includes.toLowerCase()}</p>}
        {p.colors.length > 1 && <p className="mt-1 text-sm text-muted">{p.colors.length} cores: {p.colors.join(", ").toLowerCase()}</p>}
        <div className="mt-auto flex items-end justify-between pt-3">
          <p>
            <span className="text-lg font-bold text-navy">{formatPrice(p.priceCents)}</span>
            <span className="ml-1 text-xs text-muted">indicativo</span>
          </p>
          <span className="text-sm font-semibold text-blue group-hover:underline">Reservar →</span>
        </div>
      </div>
    </Link>
  );
}
