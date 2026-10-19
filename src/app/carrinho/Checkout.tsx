"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AGE_GROUPS, formatPrice, getProductById, ONE_SIZE } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { lineUnitPrice, MAX_QUANTITY } from "@/lib/order";

type Errors = Record<string, string>;

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkout() {
  const { lines, ready, totalCents, setQuantity, remove, clear } = useCart();
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState("");
  const [minorChoice, setMinorChoice] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const group = AGE_GROUPS.find((g) => g.id === ageGroup);
  // Escalões de formação são sempre menores; seniores/veteranos nunca; nos restantes pergunta-se
  const isMinor = group?.minor === true ? true : group?.minor === false ? false : minorChoice;

  if (!ready) return <div className="h-64" aria-busy />;

  if (!lines.length) {
    return (
      <div className="rounded-3xl border border-dashed border-line p-10 text-center">
        <p className="font-display text-3xl font-bold text-navy uppercase">A tua reserva está vazia</p>
        <p className="mt-2 text-muted">Começa pelos equipamentos oficiais da época.</p>
        <Link href="/loja/equipamentos" className="btn btn-yellow mt-6">
          Ver equipamentos
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = {
      athleteName: fd.get("athleteName"),
      ageGroup,
      phone: fd.get("phone"),
      email: fd.get("email"),
      notes: fd.get("notes"),
      isMinor,
      guardianName: fd.get("guardianName") ?? "",
      guardianPhone: fd.get("guardianPhone") ?? "",
      consent: fd.get("consent") === "on",
    };
    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ form, items: lines, website: fd.get("website") }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.number) {
        clear();
        router.push(`/reserva/confirmada?n=${encodeURIComponent(json.number)}${json.demo ? "&demo=1" : ""}`);
        return;
      }
      const errs: Errors = json.errors ?? { form: json.error ?? "Não foi possível enviar a reserva. Tenta novamente." };
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(first)?.focus();
    } catch {
      setErrors({ form: "Sem ligação. Verifica a internet e tenta novamente." });
    }
    setSending(false);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
      {/* RESUMO DO CARRINHO */}
      <section aria-labelledby="titulo-artigos">
        <h2 id="titulo-artigos" className="font-display text-2xl font-bold text-navy uppercase">
          Artigos
        </h2>
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
          {lines.map((l) => {
            const p = getProductById(l.productId);
            if (!p) return null;
            const unit = lineUnitPrice(p, l);
            return (
              <li key={l.key} className="flex gap-4 p-4">
                <Link href={`/produto/${p.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                  <Image src={p.images[0].src} alt="" fill sizes="80px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-navy">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {p.includes && <>{p.includes} · </>}
                    {l.size !== ONE_SIZE && <>Tamanho {l.size}</>}
                    {l.color && <> · {l.color}</>}
                  </p>
                  {(l.customName || l.customNumber != null) && (
                    <p className="mt-1 inline-block rounded-md bg-yellow-soft px-2 py-0.5 text-xs font-semibold text-navy">
                      Personalização: {[l.customName, l.customNumber].filter((x) => x != null).join(" · ")}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-lg border border-line">
                      <button type="button" className="h-9 w-9 font-bold text-navy disabled:opacity-30" onClick={() => setQuantity(l.key, l.quantity - 1)} disabled={l.quantity <= 1} aria-label="Diminuir">
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                      <button type="button" className="h-9 w-9 font-bold text-navy disabled:opacity-30" onClick={() => setQuantity(l.key, l.quantity + 1)} disabled={l.quantity >= MAX_QUANTITY} aria-label="Aumentar">
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-navy tabular-nums">{formatPrice(unit * l.quantity)}</span>
                  </div>
                  <button type="button" onClick={() => remove(l.key)} className="mt-2 text-xs font-semibold text-muted underline hover:text-danger">
                    Remover
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy p-5 text-white">
          <span>
            <span className="block font-semibold">Total estimado</span>
            <span className="text-xs text-white/70">Valor indicativo — confirmado pelo clube</span>
          </span>
          <span className="font-display text-3xl font-bold text-yellow tabular-nums">{formatPrice(totalCents)}</span>
        </div>
        <Link href="/loja" className="mt-4 inline-block text-sm font-semibold text-blue hover:underline">
          ← Continuar a escolher
        </Link>
      </section>

      {/* FORMULÁRIO */}
      <section aria-labelledby="titulo-dados" className="rounded-3xl border border-line p-5 md:p-7 lg:sticky lg:top-24">
        <h2 id="titulo-dados" className="font-display text-2xl font-bold text-navy uppercase">
          Os teus dados
        </h2>
        <p className="mt-1 text-sm text-muted">Não pagas nada agora. Vamos contactar-te para confirmar.</p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-6 space-y-5"
          onChange={(e) => {
            // Ao corrigir um campo, o aviso desse campo desaparece
            const id = (e.target as HTMLElement).id;
            if (errors[id] || errors.form)
              setErrors((prev) => {
                const next = { ...prev };
                delete next[id];
                delete next.form;
                return next;
              });
          }}
        >
          {/* Campo-armadilha para robôs: invisível para pessoas */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Field id="athleteName" label="Nome do atleta" error={errors.athleteName}>
            <input id="athleteName" name="athleteName" className="input" autoComplete="name" aria-invalid={!!errors.athleteName} />
          </Field>

          <Field id="ageGroup" label="Escalão" error={errors.ageGroup}>
            <select id="ageGroup" className="input" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} aria-invalid={!!errors.ageGroup}>
              <option value="" disabled>
                Escolhe…
              </option>
              {AGE_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </Field>

          {group && group.minor === null && (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#13294F]" checked={minorChoice} onChange={(e) => setMinorChoice(e.target.checked)} />
              <span>O atleta tem menos de 18 anos</span>
            </label>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <Field id="phone" label="Telemóvel" error={errors.phone}>
              <input id="phone" name="phone" type="tel" inputMode="tel" className="input" autoComplete="tel" placeholder="9XX XXX XXX" aria-invalid={!!errors.phone} />
            </Field>
            <Field id="email" label="E-mail" error={errors.email}>
              <input id="email" name="email" type="email" className="input" autoComplete="email" aria-invalid={!!errors.email} />
            </Field>
          </div>

          {isMinor && (
            <div className="animate-rise space-y-5 rounded-2xl bg-yellow-soft p-4">
              <p className="text-sm font-semibold text-navy">Atleta menor de idade — dados do encarregado de educação (obrigatórios)</p>
              <Field id="guardianName" label="Nome do encarregado de educação" error={errors.guardianName}>
                <input id="guardianName" name="guardianName" className="input" aria-invalid={!!errors.guardianName} />
              </Field>
              <Field id="guardianPhone" label="Contacto do encarregado de educação" error={errors.guardianPhone}>
                <input id="guardianPhone" name="guardianPhone" type="tel" inputMode="tel" className="input" placeholder="9XX XXX XXX" aria-invalid={!!errors.guardianPhone} />
              </Field>
            </div>
          )}

          <Field id="notes" label="Observações" optional>
            <textarea id="notes" name="notes" rows={3} className="input" placeholder="Ex.: preferência de contacto, dúvidas sobre tamanhos…" />
          </Field>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input id="consent" name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#13294F]" aria-invalid={!!errors.consent} />
              <span>
                Autorizo o tratamento dos dados acima pelo clube para gerir esta reserva e me contactarem, nos termos da{" "}
                <Link href="/privacidade" target="_blank" className="font-semibold text-blue underline">
                  política de privacidade
                </Link>
                .
              </span>
            </label>
            {errors.consent && <p className="mt-1 text-sm text-danger">{errors.consent}</p>}
          </div>

          {(errors.items || errors.form) && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-danger">
              {errors.items || errors.form}
            </p>
          )}

          <button type="submit" disabled={sending} className="btn btn-yellow min-h-14 w-full text-base">
            {sending ? "A enviar…" : "Confirmar reserva"}
          </button>
        </form>
      </section>
    </div>
  );
}
