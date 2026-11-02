"use client";

import { useState } from "react";

type Row = { id: string; number: string; name: string; paid: boolean };

/** Escolher encomendas e descarregar um Excel com os artigos de cada uma. */
export function ExportPanel({ orders }: { orders: Row[] }) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  // encomendas eliminadas entretanto (o painel atualiza sozinho) deixam de contar
  const chosen = orders.filter((o) => picked.has(o.id));

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const select = (rows: Row[]) => setPicked(new Set(rows.map((o) => o.id)));

  return (
    <details className="mt-8 rounded-2xl border border-line bg-white p-5 md:p-6">
      <summary className="cursor-pointer font-display text-2xl font-bold text-navy uppercase">Criar Excel das encomendas</summary>
      <p className="mt-2 text-sm text-muted">
        Escolhe as encomendas. O Excel tem uma linha por artigo: nº da encomenda, nome, artigo, cor, tamanho, quantidade e personalização.
      </p>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Ainda não há encomendas.</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <button type="button" onClick={() => select(orders)} className="rounded-full border-[1.5px] border-line px-3 py-1.5 font-semibold text-navy hover:border-navy">
              Selecionar todas
            </button>
            <button type="button" onClick={() => select(orders.filter((o) => !o.paid))} className="rounded-full border-[1.5px] border-line px-3 py-1.5 font-semibold text-navy hover:border-navy">
              Só as por pagar
            </button>
            <button type="button" onClick={() => select(orders.filter((o) => o.paid))} className="rounded-full border-[1.5px] border-line px-3 py-1.5 font-semibold text-navy hover:border-navy">
              Só as pagas
            </button>
            <button type="button" onClick={() => setPicked(new Set())} className="rounded-full px-3 py-1.5 font-semibold text-muted underline">
              Limpar
            </button>
          </div>

          <ul className="mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o) => (
              <li key={o.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm transition-colors ${picked.has(o.id) ? "border-navy bg-paper" : "border-line"}`}
                >
                  <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#13294F]" checked={picked.has(o.id)} onChange={() => toggle(o.id)} />
                  <span className="min-w-0">
                    <span className="font-display text-lg font-bold text-navy">{o.number}</span>
                    <span className="block truncate text-muted">
                      {o.name} · {o.paid ? "Paga" : "Por pagar"}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href={chosen.length ? `/admin/exportar?ids=${chosen.map((o) => o.id).join(",")}` : undefined}
              aria-disabled={!chosen.length}
              className={`btn btn-navy min-h-12 ${chosen.length ? "" : "pointer-events-none opacity-40"}`}
            >
              Criar Excel ({chosen.length})
            </a>
            <span className="text-sm text-muted">
              {chosen.length ? `${chosen.length} encomenda${chosen.length > 1 ? "s" : ""} selecionada${chosen.length > 1 ? "s" : ""}` : "Nenhuma encomenda selecionada"}
            </span>
          </div>
        </>
      )}
    </details>
  );
}
