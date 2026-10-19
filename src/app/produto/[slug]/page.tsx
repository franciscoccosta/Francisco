import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activeProducts, formatPrice, getCategory, getProduct } from "@/lib/catalog";
import { CLUB } from "@/lib/club";
import { ProductCard } from "@/components/ProductCard";
import { Gallery, ProductPurchase } from "./ProductPurchase";

export function generateStaticParams() {
  return activeProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.description, openGraph: { images: [p.images[0].src] } } : {};
}

export default async function ProdutoPage({ params }: PageProps<"/produto/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const related = activeProducts().filter((x) => x.id !== p.id && (x.category === p.category || x.featured)).slice(0, 3);

  return (
    <>
      <div className="wrap pt-6 md:pt-10">
        <nav className="text-sm text-muted" aria-label="Caminho">
          <Link href="/loja" className="hover:text-navy">Loja</Link>
          <span className="mx-2">/</span>
          <Link href={`/loja/${p.category}`} className="hover:text-navy">{cat?.name}</Link>
        </nav>
        <div className="mt-4 grid gap-8 pb-14 lg:grid-cols-2 lg:gap-14">
          <Gallery p={p} />
          <div>
            <p className="kicker text-blue">{cat?.name}</p>
            <h1 className="display mt-2 text-4xl text-navy md:text-5xl">{p.name}</h1>
            <p className="mt-4">
              <span className="text-3xl font-bold text-navy">{formatPrice(p.priceCents)}</span>
              <span className="ml-2 text-sm text-muted">preço indicativo</span>
            </p>
            <p className="mt-5 leading-relaxed text-ink/80">{p.description}</p>
            <ProductPurchase p={p} />
            <p className="mt-6 rounded-xl bg-paper p-4 text-sm text-muted">
              Isto é uma <strong className="text-navy">reserva</strong>: não pagas nada agora. O clube contacta-te para confirmar e combinar o pagamento por {CLUB.paymentMethods}.
            </p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="bg-paper">
          <div className="wrap py-12">
            <h2 className="font-display text-3xl font-bold text-navy uppercase">Também te pode interessar</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
