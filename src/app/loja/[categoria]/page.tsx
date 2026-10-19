import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activeProducts, CATEGORIES, getCategory } from "@/lib/catalog";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categoria: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/loja/[categoria]">): Promise<Metadata> {
  const c = getCategory((await params).categoria);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoriaPage({ params }: PageProps<"/loja/[categoria]">) {
  const { categoria } = await params;
  const c = getCategory(categoria);
  if (!c) notFound();
  const list = activeProducts().filter((p) => p.category === c.id);

  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="display text-5xl text-navy md:text-6xl">{c.name}</h1>
      <p className="mt-2 text-muted">{c.description}</p>
      <div className="mt-6">
        <CategoryNav active={c.id} />
      </div>
      {list.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-3xl font-bold text-navy uppercase">Brevemente</p>
          <p className="mt-2 text-muted">Estamos a preparar os artigos desta categoria.</p>
          <Link href="/loja/equipamentos" className="btn btn-navy mt-6">
            Ver equipamentos oficiais
          </Link>
        </div>
      )}
    </div>
  );
}
