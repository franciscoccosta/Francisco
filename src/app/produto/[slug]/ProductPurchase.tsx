"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ADULT_SIZES, formatPrice, KIDS_SIZES, ONE_SIZE, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { lineUnitPrice, MAX_QUANTITY } from "@/lib/order";

export function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const img = p.images[i];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-paper">
        <Image key={img.src} src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="animate-rise object-cover" />
      </div>
      {p.images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {p.images.map((im, k) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setI(k)}
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

export function ProductPurchase({ p }: { p: Product }) {
  const { add } = useCart();
  const oneSize = p.sizes.length === 1 && p.sizes[0] === ONE_SIZE;
  const [size, setSize] = useState(oneSize ? ONE_SIZE : "");
  const [color, setColor] = useState(p.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const pers = p.personalization;
  const numberValue = number === "" ? null : Number(number);
  const numberValid = numberValue == null || (pers != null && Number.isInteger(numberValue) && numberValue >= pers.numberMin && numberValue <= pers.numberMax);
  const customName = personalize ? name.trim().toUpperCase() || null : null;
  const customNumber = personalize && numberValid ? numberValue : null;
  const unit = lineUnitPrice(p, { customName, customNumber });

  function submit() {
    if (!size) return setError("Escolhe um tamanho.");
    if (p.colors.length && !color) return setError("Escolhe uma cor.");
    if (personalize) {
      if (!name.trim() && number === "") return setError("Indica o nome e/ou o número, ou desliga a personalização.");
      if (!numberValid) return setError(`O número tem de estar entre ${pers!.numberMin} e ${pers!.numberMax}.`);
    }
    setError("");
    add({ productId: p.id, size, color: p.colors.length ? color : null, quantity: qty, customName, customNumber });
    setAdded(true);
  }

  if (added) {
    return (
      <div className="animate-rise mt-8 rounded-2xl border-2 border-navy bg-yellow-soft p-6" role="status">
        <p className="font-display text-2xl font-bold text-navy uppercase">Adicionado à reserva ✓</p>
        <p className="mt-1 text-sm text-navy/80">
          {qty} × {p.name} — {size}
          {color && p.colors.length ? ` · ${color}` : ""}
          {customName || customNumber != null ? ` · ${[customName, customNumber].filter((x) => x != null).join(" ")}` : ""}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/carrinho" className="btn btn-navy">
            Ver reserva e finalizar
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setAdded(false);
              setQty(1);
              setPersonalize(false);
              setName("");
              setNumber("");
              if (!oneSize) setSize("");
            }}
          >
            Adicionar outro tamanho
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
          <legend className="label">Cor: <span className="font-normal text-muted">{color}</span></legend>
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

      {pers && (
        <div className="rounded-2xl border border-line p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block font-semibold text-navy">Personalizar com nome e número</span>
              <span className="text-sm text-muted">+ {formatPrice(pers.priceCents)} (indicativo)</span>
            </span>
            <input type="checkbox" className="h-6 w-6 accent-[#13294F]" checked={personalize} onChange={(e) => setPersonalize(e.target.checked)} />
          </label>
          {personalize && (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
              <div>
                <label htmlFor="custom-name" className="label">Nome nas costas</label>
                <input id="custom-name" className="input uppercase" maxLength={pers.nameMaxLength} value={name} onChange={(e) => setName(e.target.value)} placeholder="EX.: SILVA" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="custom-number" className="label">Número</label>
                <input
                  id="custom-number"
                  className="input"
                  inputMode="numeric"
                  value={number}
                  onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder={`${pers.numberMin}–${pers.numberMax}`}
                  aria-invalid={!numberValid}
                />
              </div>
              {/* Pré-visualização das costas */}
              <div
                aria-hidden
                className={`mx-auto flex h-28 w-24 flex-col items-center justify-center rounded-b-xl rounded-t-[2rem] ${p.slug.includes("branco") ? "bg-white text-navy ring-1 ring-line" : "bg-yellow text-navy"}`}
              >
                <span className="max-w-full truncate px-1 font-display text-[0.7rem] font-bold tracking-wider">{name.trim().toUpperCase() || "NOME"}</span>
                <span className="font-display text-4xl leading-none font-extrabold">{number || "00"}</span>
              </div>
            </div>
          )}
          {personalize && <p className="mt-2 text-xs text-muted">Máximo {pers.nameMaxLength} caracteres. Números de {pers.numberMin} a {pers.numberMax}.</p>}
        </div>
      )}

      <div>
        <span className="label">Quantidade</span>
        <div className="inline-flex items-center rounded-xl border-[1.5px] border-line">
          <button type="button" className="h-12 w-12 text-xl font-bold text-navy disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuir quantidade">
            −
          </button>
          <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" className="h-12 w-12 text-xl font-bold text-navy disabled:opacity-30" onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))} disabled={qty >= MAX_QUANTITY} aria-label="Aumentar quantidade">
            +
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button type="button" onClick={submit} className="btn btn-yellow min-h-14 w-full text-base">
          Adicionar à reserva · {formatPrice(unit * qty)}
        </button>
      </div>
    </div>
  );
}
