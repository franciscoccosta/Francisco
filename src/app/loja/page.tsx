import type { Metadata } from "next";
import { activeProducts, CATEGORIES } from "@/lib/catalog";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Loja", description: "Todos os artigos do Camões Andebol disponíveis para reserva." };

export default function Loja() {
  const products = activeProducts();
  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="display text-5xl text-navy md:text-6xl">Loja</h1>
      <p className="mt-2 text-muted">Escolhe, reserva e nós contactamos-te para confirmar. Preços indicativos.</p>
      <div className="mt-6">
        <CategoryNav />
      </div>
      {CATEGORIES.map((c) => {
        const list = products.filter((p) => p.category === c.id);
        if (!list.length) return null;
        return (
          <section key={c.id} className="mt-12">
            <h2 className="font-display text-3xl font-bold text-navy uppercase">{c.name}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 2 && c.id === "equipamentos"} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
