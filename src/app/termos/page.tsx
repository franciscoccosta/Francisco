import type { Metadata } from "next";
import Link from "next/link";
import { CLUB } from "@/lib/club";

export const metadata: Metadata = { title: "Termos e condições" };

export default function Termos() {
  return (
    <article className="wrap max-w-3xl py-10 md:py-14">
      <h1 className="display text-5xl text-navy md:text-6xl">Termos e condições</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-ink/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:uppercase">
        <section>
          <h2>O que é esta loja</h2>
          <p>
            Esta loja do {CLUB.fullName} ({CLUB.name}) serve para registar encomendas de vestuário e acessórios do clube. Ao confirmar, a
            encomenda fica registada e o clube entra em contacto contigo.
          </p>
        </section>
        <section>
          <h2>Pagamento</h2>
          <p>Não há pagamentos no site. O pagamento é feito presencialmente, depois do contacto do clube.</p>
        </section>
        <section>
          <h2>Preços</h2>
          <p>Os preços apresentados são indicativos. O valor final é confirmado pelo clube quando te contactar.</p>
        </section>
        <section>
          <h2>Personalização</h2>
          <p>
            Os artigos personalizados (nome, número ou iniciais) são produzidos com os dados que indicares na encomenda. Confirma-os com atenção
            antes de confirmar.
          </p>
        </section>
        <section>
          <h2>Entrega</h2>
          <p>Quando o material estiver disponível, o clube combina contigo a entrega.</p>
        </section>
        <section>
          <h2>Os teus dados</h2>
          <p>
            Os dados da encomenda são usados apenas para a gerir e para te contactar, como explicado na{" "}
            <Link href="/privacidade" className="font-semibold text-blue underline">
              política de privacidade
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
