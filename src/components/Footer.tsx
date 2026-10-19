import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { CLUB } from "@/lib/club";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="stripes mt-auto bg-navy-deep text-white">
      <div className="wrap grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">{CLUB.fullName}</p>
          <p className="kicker mt-2 text-yellow">{CLUB.motto}</p>
        </div>
        <div>
          <p className="kicker text-white/50">Loja</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/loja/${c.id}`} className="hover:text-yellow">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker text-white/50">Informação</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/#como-funciona" className="hover:text-yellow">
                Como funcionam as reservas
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-yellow">
                Área reservada
              </Link>
            </li>
            <li>
              <Link href="/termos" className="hover:text-yellow">
                Termos e condições
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-yellow">
                Política de privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-5 text-xs text-white/50">
          © {new Date().getFullYear()} {CLUB.fullName}. Reservas sem pagamento online — o pagamento é combinado diretamente com o clube.
        </p>
      </div>
    </footer>
  );
}
