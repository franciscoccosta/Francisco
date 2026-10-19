"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { ADULT_SIZES, formatPrice, imagesFor, KIDS_SIZES, ONE_SIZE, type PersonalizationOption, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { describeCustom, lineUnitPrice, MAX_QUANTITY, type CustomChoice } from "@/lib/order";

/** A cor escolhida é partilhada entre a galeria e o formulário de compra. */
const ColorCtx = createContext<{ color: string; setColor: (c: string) => void }>({ color: "", setColor: () => {} });

export function ProductColor({ p, children }: { p: Product; children: ReactNode }) {
  const [color, setColor] = useState(p.colors[0] ?? "");
  return <ColorCtx.Provider value={{ color, setColor }}>{children}</ColorCtx.Provider>;
}

export function Gallery({ p }: { p: Product }) {
  const { color } = useContext(ColorCtx);
  const images = imagesFor(p, color);
  const [picked, setPicked] = useState<{ color: string; i: number }>({ color, i: 0 });
  // Ao mudar de cor, volta à primeira fotografia dessa cor
  const i = picked.color === color ? Math.min(picked.i, images.length - 1) : 0;
  const img = images[i];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-paper">
        <Image key={img.src} src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="animate-rise object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((im, k) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setPicked({ color, i: k })}
              aria-label={`Ver fotografia ${k + 1}`}
              aria-pressed={k === i}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${k === i ? "border-navy" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SizeGroup({ title, sizes, value, onChange }: { title: string; sizes: string[]; value: string; onChange: (s: string) => void }) {
  if (!sizes.length) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} type="button" className="option" aria-pressed={value === s} onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

type Draft = { on: boolean; name: string; number: string };
const EMPTY: Draft = { on: false, name: "", number: "" };

function numberOk(o: PersonalizationOption, v: string) {
  if (v === "") return true;
  const n = Number(v);
  return Number.isInteger(n) && n >= o.numberMin && n <= o.numberMax;
}

/** Pré-visualização simples da camisola com nome/número. */
function Preview({ p, color, name, number, front }: { p: Product; color: string; name: string; number: string; front: boolean }) {
  const white = p.slug.includes("branco") || color === "Branco";
  const navy = color === "Azul-escuro" || color === "Azul";
  const tone = white ? "bg-white text-navy ring-1 ring-line" : navy ? "bg-navy text-white" : "bg-yellow text-navy";
  return (
    <div aria-hidden className={`mx-auto flex h-24 w-20 flex-col items-center justify-center rounded-b-xl rounded-t-[1.6rem] ${tone}`}>
      {!front && <span className="max-w-full truncate px-1 font-display text-[0.65rem] font-bold tracking-wider">{name.trim().toUpperCase() || "NOME"}</span>}
      <span className={`font-display leading-none font-extrabold ${front ? "text-2xl" : "text-3xl"}`}>{number || "00"}</span>
    </div>
  );
}

export function ProductPurchase({ p }: { p: Product }) {
  const { add } = useCart();
  const { color, setColor } = useContext(ColorCtx);
  const oneSize = p.sizes.length === 1 && p.sizes[0] === ONE_SIZE;
  const [size, setSize] = useState(oneSize ? ONE_SIZE : "");
  const [qty, setQty] = useState(1);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [error, setError] = useState("");
  const [added, setAdded] = useState<CustomChoice[] | null>(null);

  const draft = (id: string) => drafts[id] ?? EMPTY;
  const setDraft = (id: string, patch: Partial<Draft>) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? EMPTY), ...patch } }));
    setError("");
  };

  const custom: CustomChoice[] = p.personalization
    .filter((o) => draft(o.id).on)
    .map((o) => {
      const d = draft(o.id);
      return { optionId: o.id, name: o.nameMaxLength ? d.name.trim().toUpperCase() || null : null, number: d.number === "" || !numberOk(o, d.number) ? null : Number(d.number) };
    });
  const unit = lineUnitPrice(p, custom);

  function submit() {
    if (!size) return setError("Escolhe um tamanho.");
    if (p.colors.length && !color) return setError("Escolhe uma cor.");
    for (const o of p.personalization) {
      const d = draft(o.id);
      if (!d.on) continue;
      if (!numberOk(o, d.number)) return setError(`${o.label}: o número tem de estar entre ${o.numberMin} e ${o.numberMax}.`);
      if (o.nameMaxLength ? !d.name.trim() && d.number === "" : d.number === "")
        return setError(`${o.label}: ${o.nameMaxLength ? "indica o nome e/ou o número" : "indica o número"}, ou desliga esta opção.`);
    }
    setError("");
    add({ productId: p.id, size, color: p.colors.length ? color : null, quantity: qty, custom });
    setAdded(custom);
  }

  if (added) {
    const desc = describeCustom(p, added);
    return (
      <div className="animate-rise mt-8 rounded-2xl border-2 border-navy bg-yellow-soft p-6" role="status">
        <p className="font-display text-2xl font-bold text-navy uppercase">Adicionado à reserva ✓</p>
        <p className="mt-1 text-sm text-navy/80">
          {qty} × {p.name} — {size}
          {color && p.colors.length ? ` · ${color}` : ""}
          {desc ? ` · ${desc}` : ""}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/carrinho" className="btn btn-navy">
            Ver reserva e finalizar
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setAdded(null);
              setQty(1);
              setDrafts({});
              if (!oneSize) setSize("");
            }}
          >
            {oneSize ? "Adicionar outro" : "Adicionar outro tamanho"}
          </button>
        </div>
      </div>
    );
  }

  const kids = p.sizes.filter((s) => KIDS_SIZES.includes(s));
  const adults = p.sizes.filter((s) => ADULT_SIZES.includes(s));

  return (
    <div className="mt-8 space-y-7">
      {p.colors.length > 0 && (
        <fieldset>
          <legend className="label">
            Cor: <span className="font-normal text-muted">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {p.colors.map((c) => (
              <button key={c} type="button" className="option" aria-pressed={color === c} onClick={() => setColor(c)}>
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!oneSize && (
        <fieldset>
          <legend className="label">Tamanho</legend>
          <SizeGroup title="Criança" sizes={kids} value={size} onChange={(s) => (setSize(s), setError(""))} />
          <SizeGroup title="Adulto" sizes={adults} value={size} onChange={(s) => (setSize(s), setError(""))} />
        </fieldset>
      )}

      {p.personalization.map((o) => {
        const d = draft(o.id);
        const valid = numberOk(o, d.number);
        return (
          <div key={o.id} className="rounded-2xl border border-line p-4">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="block font-semibold text-navy">{o.label}</span>
                <span className="text-sm text-muted">+ {formatPrice(o.priceCents)} (indicativo)</span>
              </span>
              <input type="checkbox" className="h-6 w-6 shrink-0 accent-[#13294F]" checked={d.on} onChange={(e) => setDraft(o.id, { on: e.target.checked })} />
            </label>
            {d.on && (
              <>
                <div className={`mt-4 grid gap-4 sm:items-end ${o.nameMaxLength ? "sm:grid-cols-[1fr_7rem_auto]" : "grid-cols-[7rem_auto] items-end"}`}>
                  {o.nameMaxLength && (
                    <div>
                      <label htmlFor={`${o.id}-name`} className="label">Nome</label>
                      <input id={`${o.id}-name`} className="input uppercase" maxLength={o.nameMaxLength} value={d.name} onChange={(e) => setDraft(o.id, { name: e.target.value })} placeholder="EX.: SILVA" autoComplete="off" />
                    </div>
                  )}
                  <div>
                    <label htmlFor={`${o.id}-number`} className="label">Número</label>
                    <input
                      id={`${o.id}-number`}
                      className="input"
                      inputMode="numeric"
                      value={d.number}
                      onChange={(e) => setDraft(o.id, { number: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                      placeholder={`${o.numberMin}–${o.numberMax}`}
                      aria-invalid={!valid}
                    />
                  </div>
                  <Preview p={p} color={color} name={d.name} number={d.number} front={!o.nameMaxLength} />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {o.nameMaxLength ? `Máximo ${o.nameMaxLength} caracteres. ` : ""}Números de {o.numberMin} a {o.numberMax}.
                </p>
              </>
            )}
          </div>
        );
      })}

      <div>
        <span className="label">Quantidade</span>
        <div className="inline-flex items-center rounded-xl border-[1.5px] border-line">
          <button type="button" className="h-12 w-12 text-xl font-bold text-navy disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuir quantidade">
            −
          </button>
          <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="h-12 w-12 text-xl font-bold text-navy disabled:opacity-30" onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))} disabled={qty >= MAX_QUANTITY} aria-label="Aumentar quantidade">
            +
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button type="button" onClick={submit} className="btn btn-yellow min-h-14 w-full text-base">
          Adicionar à reserva · {formatPrice(unit * qty)}
        </button>
      </div>
    </div>
  );
}
