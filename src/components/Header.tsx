"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/loja/equipamentos", label: "Equipamentos" },
  { href: "/loja", label: "Loja" },
  { href: "/#como-funciona", label: "Como funciona" },
];

export function Header({ logo }: { logo: ReactNode }) {
  const { count, ready } = useCart();
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-[0_1px_0_rgb(255_255_255/0.08)]">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Camões Andebol — página inicial">
          {logo}
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`transition-colors hover:text-yellow ${pathname === l.href ? "text-yellow" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/carrinho"
            className="relative inline-flex h-11 items-center gap-2 rounded-xl px-3 font-semibold transition-colors hover:bg-white/10"
            aria-label={`Carrinho de reserva${ready && count ? `, ${count} ${count === 1 ? "artigo" : "artigos"}` : ""}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="hidden text-sm sm:inline">Reserva</span>
            {ready && count > 0 && (
              <span key={count} className="animate-pop absolute -top-0.5 left-6 grid h-5 min-w-5 place-items-center rounded-full bg-yellow px-1 text-xs font-bold text-navy">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10 md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 md:hidden" aria-label="Menu">
          <ul className="wrap py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpenOn(null)} className="block py-3 font-display text-2xl font-bold uppercase">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
