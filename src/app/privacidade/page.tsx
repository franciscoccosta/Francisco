import type { Metadata } from "next";
import { CLUB } from "@/lib/club";

export const metadata: Metadata = { title: "Política de privacidade" };

export default function Privacidade() {
  return (
    <article className="wrap max-w-3xl py-10 md:py-14">
      <h1 className="display text-5xl text-navy md:text-6xl">Política de privacidade</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-ink/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:uppercase">
        <section>
          <h2>Quem trata os dados</h2>
          <p>
            O responsável pelo tratamento dos dados é o {CLUB.fullName} ({CLUB.name}), em {CLUB.city}. Para qualquer questão
            sobre os teus dados, fala diretamente com a direção do clube.
          </p>
        </section>
        <section>
          <h2>Que dados recolhemos</h2>
          <p>
            Quando fazes uma reserva: nome do atleta, escalão, telemóvel, e-mail, observações e os artigos escolhidos (incluindo nome e número para
            personalização). Se o atleta for menor, recolhemos também o nome e contacto do encarregado de educação.
          </p>
        </section>
        <section>
          <h2>Para que usamos os dados</h2>
          <p>
            Apenas para gerir a tua reserva: confirmar a encomenda, combinar o pagamento (presencial) e a entrega. Não usamos os dados
            para publicidade e não os vendemos nem cedemos a terceiros. Os dados de personalização (nome e número) são comunicados ao fornecedor
            apenas para produzir o artigo.
          </p>
        </section>
        <section>
          <h2>Base legal</h2>
          <p>O tratamento baseia-se no teu consentimento, dado no momento da reserva, e na execução do pedido que fazes ao clube.</p>
        </section>
        <section>
          <h2>Durante quanto tempo</h2>
          <p>Guardamos os dados {CLUB.dataRetention}, salvo obrigação legal de os conservar por mais tempo.</p>
        </section>
        <section>
          <h2>Os teus direitos</h2>
          <p>
            Podes pedir a qualquer momento o acesso, a correção ou a eliminação dos teus dados, ou retirar o consentimento, junto da direção do
            clube. Tens também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).
          </p>
        </section>
        <section>
          <h2>Onde ficam os dados</h2>
          <p>
            Os dados são guardados numa base de dados segura, com acesso restrito à administração do clube. O site não usa cookies de publicidade
            nem de rastreamento; o carrinho de reserva é guardado apenas no teu navegador.
          </p>
        </section>
      </div>
    </article>
  );
}
