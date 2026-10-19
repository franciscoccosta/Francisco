import type { Metadata } from "next";
import Link from "next/link";
import { CLUB } from "@/lib/club";

export const metadata: Metadata = { title: "Reserva recebida", robots: { index: false } };

export default async function Confirmada({ searchParams }: PageProps<"/reserva/confirmada">) {
  const sp = await searchParams;
  const n = typeof sp.n === "string" ? sp.n.slice(0, 20) : null;

  return (
    <div className="wrap max-w-2xl py-14 text-center md:py-20">
      <div className="animate-rise mx-auto grid h-20 w-20 place-items-center rounded-full bg-yellow text-4xl text-navy" aria-hidden>
        ✓
      </div>
      <h1 className="display mt-6 text-5xl text-navy md:text-6xl">Reserva recebida</h1>
      {n && (
        <p className="mt-6">
          <span className="block text-sm text-muted">Número da reserva</span>
          <span className="mt-1 inline-block rounded-xl bg-navy px-5 py-2 font-display text-3xl font-bold tracking-wider text-yellow">{n}</span>
        </p>
      )}
      <p className="mx-auto mt-6 max-w-md text-lg text-ink">Obrigado! Vamos contactar-te em breve para confirmar a encomenda e o pagamento.</p>
      <p className="mt-2 text-sm text-muted">O pagamento é feito por {CLUB.paymentMethods}, depois do nosso contacto. Guarda o número da reserva.</p>


      <Link href="/" className="btn btn-navy mt-10">
        Voltar à loja
      </Link>
    </div>
  );
}
