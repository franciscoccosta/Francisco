import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-20 text-center">
      <p className="kicker text-blue">Erro 404</p>
      <h1 className="display mt-2 text-6xl text-navy">Fora de campo</h1>
      <p className="mt-3 text-muted">Esta página não existe.</p>
      <Link href="/loja" className="btn btn-yellow mt-8">
        Ir para a loja
      </Link>
    </div>
  );
}
