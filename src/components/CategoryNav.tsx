import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export function CategoryNav({ active }: { active?: string }) {
  const items = [{ id: "", name: "Tudo" }, ...CATEGORIES];
  return (
    <nav aria-label="Categorias" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
      {items.map((c) => {
        const isActive = (active ?? "") === c.id;
        return (
          <Link
            key={c.id || "tudo"}
            href={c.id ? `/loja/${c.id}` : "/loja"}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy"
            }`}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
