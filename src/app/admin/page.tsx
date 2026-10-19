import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/catalog";
import { dbConfigured } from "@/lib/db";
import { listOrders, type StoredOrder } from "@/lib/orders";
import { logout } from "./actions";
import { DeleteButton, PaidToggle } from "./OrderControls";

// Verificado no servidor em cada visita (nunca gerado de antemão)
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Back office", robots: { index: false, follow: false } };

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "por-pagar", label: "Por pagar" },
  { id: "pagas", label: "Pagas" },
];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Lisbon" }).format(new Date(iso));
}

function OrderCard({ o }: { o: StoredOrder }) {
  const f = o.form;
  return (
    <article className={`rounded-2xl border-2 bg-white p-5 md:p-6 ${o.paid ? "border-green-200" : "border-line"}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold text-navy">{o.number}</p>
          <p className="text-sm text-muted">{fmtDate(o.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${o.paid ? "bg-green-100 text-green-800" : "bg-yellow-soft text-navy"}`}>
          {o.paid ? "Paga" : "Por pagar"}
        </span>
      </header>

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted">Nome</dt>
            <dd className="text-base font-semibold text-navy">{f.athleteName}</dd>
          </div>
          <div>
            <dt className="text-muted">Escalão</dt>
            <dd>{o.ageGroupName}</dd>
          </div>
          <div>
            <dt className="text-muted">Telefone</dt>
            <dd>
              <a href={`tel:${f.phone.replace(/\s/g, "")}`} className="font-semibold text-blue underline">{f.phone}</a>
            </dd>
          </div>
          <div>
            <dt className="text-muted">E-mail</dt>
            <dd className="break-all">
              <a href={`mailto:${f.email}?subject=${encodeURIComponent(`Reserva ${o.number} — Camões Andebol`)}`} className="font-semibold text-blue underline">{f.email}</a>
            </dd>
          </div>
          {f.isMinor && (
            <div className="rounded-xl bg-yellow-soft p-3">
              <dt className="text-xs font-semibold text-navy uppercase">Encarregado de educação</dt>
              <dd className="mt-1">
                {f.guardianName} ·{" "}
                <a href={`tel:${f.guardianPhone.replace(/\s/g, "")}`} className="font-semibold text-blue underline">{f.guardianPhone}</a>
              </dd>
            </div>
          )}
          {f.notes && (
            <div>
              <dt className="text-muted">Observações</dt>
              <dd className="whitespace-pre-line">{f.notes}</dd>
            </div>
          )}
        </dl>

        <div>
          <p className="text-sm text-muted">Encomenda</p>
          <ul className="mt-1 divide-y divide-line rounded-xl border border-line">
            {o.items.map((i, k) => (
              <li key={k} className="p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-navy">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="tabular-nums">{formatPrice(i.unitPriceCents * i.quantity)}</span>
                </div>
                <p className="text-muted">
                  Tamanho: {i.size}
                  {i.color && ` · Cor: ${i.color}`}
                </p>
                <p className={i.customText ? "mt-1 font-medium text-navy" : "mt-1 text-muted"}>
                  {i.customText ? `Personalização: ${i.customText}` : "Sem personalização"}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between font-semibold text-navy">
            <span>Total estimado</span>
            <span className="tabular-nums">{formatPrice(o.totalCents)}</span>
          </p>
        </div>
      </div>

      <footer className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <PaidToggle id={o.id} paid={o.paid} />
        <DeleteButton id={o.id} number={o.number} />
      </footer>
    </article>
  );
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  // Proteção no servidor: sem sessão válida, ninguém vê esta página
  if (!(await isAdmin())) redirect("/login");

  const sp = await searchParams;
  const filter = typeof sp.estado === "string" ? sp.estado : "todas";
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";

  let orders: StoredOrder[] = [];
  let loadError = "";
  if (dbConfigured) {
    try {
      orders = await listOrders();
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Erro ao carregar as encomendas.";
    }
  }

  const unpaid = orders.filter((o) => !o.paid);
  const shown = orders
    .filter((o) => (filter === "pagas" ? o.paid : filter === "por-pagar" ? !o.paid : true))
    .filter((o) => !q || o.form.athleteName.toLowerCase().includes(q) || o.number.toLowerCase().includes(q) || o.form.phone.includes(q));

  return (
    <div className="wrap py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker text-blue">Back office</p>
          <h1 className="display mt-2 text-5xl text-navy">Encomendas</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost">Sair</button>
        </form>
      </div>

      {!dbConfigured && (
        <p className="mt-6 rounded-xl border border-dashed border-danger/50 bg-red-50 p-4 text-sm text-danger">
          A base de dados ainda não está ligada, por isso as reservas não estão a ser guardadas. Liga o Upstash Redis no Vercel (ver instruções).
        </p>
      )}
      {loadError && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-danger">{loadError}</p>}

      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Encomendas", String(orders.length)],
          ["Por pagar", String(unpaid.length)],
          ["Pagas", String(orders.length - unpaid.length)],
          ["Valor por receber", formatPrice(unpaid.reduce((t, o) => t + o.totalCents, 0))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-paper p-4">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 font-display text-3xl font-bold text-navy tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav className="flex gap-2" aria-label="Filtrar">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={`/admin?estado=${f.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold ${filter === f.id ? "border-navy bg-navy text-white" : "border-line text-navy"}`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" action="/admin">
          <input type="hidden" name="estado" value={filter} />
          <input name="q" defaultValue={q} placeholder="Procurar nome, telefone ou nº" className="input min-h-11 md:w-72" />
          <button className="btn btn-navy min-h-11">Procurar</button>
        </form>
      </div>

      <div className="mt-6 space-y-5">
        {shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            {orders.length === 0 ? "Ainda não há encomendas." : "Nenhuma encomenda corresponde a este filtro."}
          </p>
        ) : (
          shown.map((o) => <OrderCard key={o.id} o={o} />)
        )}
      </div>
    </div>
  );
}
