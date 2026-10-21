import Image from "next/image";
import Link from "next/link";
import { activeProducts, CATEGORIES, formatPrice } from "@/lib/catalog";
import { CLUB } from "@/lib/club";
import { ProductCard } from "@/components/ProductCard";

const STEPS = [
  { n: "1", t: "Escolhe", d: "Escolhe os artigos, o tamanho e, nos equipamentos, o nome e número." },
  { n: "2", t: "Reserva", d: "Preenche os teus dados. Não pagas nada no site." },
  { n: "3", t: "Confirmamos", d: "O clube contacta-te para confirmar a encomenda. O pagamento é feito presencialmente." },
  { n: "4", t: "Recebes", d: "Quando o material chegar, combinamos contigo a entrega." },
];

export default function Home() {
  const products = activeProducts();
  const kits = products.filter((p) => p.featured);
  const others = products.filter((p) => !p.featured);
  const [main, alt] = kits;

  return (
    <>
      {/* HERO */}
      <section className="stripes relative overflow-hidden bg-navy text-white">
        <div className="wrap grid items-center gap-8 pt-10 pb-0 md:grid-cols-2 md:pt-16">
          <div className="animate-rise pb-4 md:pb-16">
            <p className="kicker text-yellow">Loja oficial · {CLUB.city}</p>
            <h1 className="display mt-3 text-[3.4rem] sm:text-7xl lg:text-[5.6rem]">
              Veste o <span className="text-yellow">Camões</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/85">
              Reserva o equipamento oficial da equipa sénior e o merchandising do clube. Sem pagamentos online — nós contactamos-te.
            </p>
            <p className="kicker mt-4 text-white/60">{CLUB.motto}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/loja/equipamentos" className="btn btn-yellow min-h-14 text-base">
                Reservar equipamento
              </Link>
              <Link href="/loja" className="btn min-h-14 border-[1.5px] border-white/30 text-base text-white hover:bg-white/10">
                Ver toda a loja
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 items-end gap-3 self-end">
            <div className="relative aspect-[4/5] translate-y-6 overflow-hidden rounded-t-3xl bg-white/5">
              <Image src="/fotos/amarelo-10.jpg" alt="Atleta da equipa sénior com a camisola principal amarela" fill priority sizes="(min-width: 768px) 25vw, 46vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl bg-white/5">
              <Image src="/fotos/branco-23.jpg" alt="Atleta da equipa sénior com a camisola alternativa branca" fill priority sizes="(min-width: 768px) 25vw, 46vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUE: EQUIPAMENTOS */}
      <section className="bg-paper">
        <div className="wrap py-14 md:py-20">
          <p className="kicker text-blue">Equipamento oficial · Equipa sénior</p>
          <h2 className="display mt-2 text-5xl text-navy md:text-6xl">Os equipamentos da época</h2>
          <p className="mt-3 max-w-xl text-muted">Do tamanho de criança ao 3XL. Personaliza com o teu nome e número.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[main, alt].filter(Boolean).map((k, i) => (
              <Link
                key={k.id}
                href={`/produto/${k.slug}`}
                className={`group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-6 md:min-h-[32rem] md:p-8 ${i === 0 ? "bg-yellow text-navy" : "bg-white text-navy"}`}
              >
                <Image src={k.images[0].src} alt={k.images[0].alt} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
                <div className="relative text-white">
                  <p className="kicker text-yellow">{i === 0 ? "Principal" : "Alternativo"}</p>
                  <h3 className="display mt-1 text-4xl md:text-5xl">{i === 0 ? "Amarelo" : "Branco"}</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
                      {formatPrice(k.priceCents)}
                    </span>
                    {k.includes && <span className="rounded-full bg-yellow px-3 py-1 text-sm font-semibold text-navy">{k.includes}</span>}
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">Criança e adulto</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">Nome + número</span>
                  </div>
                  <span className="btn btn-yellow mt-6">Reservar o {i === 0 ? "amarelo" : "branco"} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-16">
        <div className="wrap py-14 md:py-20">
          <p className="kicker text-blue">Como funciona</p>
          <h2 className="display mt-2 text-5xl text-navy md:text-6xl">Reservar é simples</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-line p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-display text-xl font-bold text-yellow">{s.n}</span>
                <p className="mt-4 font-display text-2xl font-bold text-navy uppercase">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MAIS PRODUTOS */}
      {others.length > 0 && (
        <section className="bg-paper">
          <div className="wrap py-14 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="kicker text-blue">Mais do clube</p>
                <h2 className="display mt-2 text-5xl text-navy md:text-6xl">Saída, agasalhos e acessórios</h2>
              </div>
              <Link href="/loja" className="hidden shrink-0 text-sm font-semibold text-blue hover:underline sm:block">
                Ver tudo →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIAS */}
      <section>
        <div className="wrap py-14 md:py-20">
          <h2 className="display text-4xl text-navy md:text-5xl">Explora por categoria</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/loja/${c.id}`} className="rounded-2xl border border-line p-4 font-display text-xl font-bold text-navy uppercase transition-colors hover:border-navy hover:bg-navy hover:text-yellow">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
