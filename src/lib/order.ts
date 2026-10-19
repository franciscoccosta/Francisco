import { AGE_GROUPS, getProductById, type Product } from "./catalog";

/** Personalização escolhida para uma opção do produto. */
export type CustomChoice = { optionId: string; name: string | null; number: number | null; initials?: string | null };

/** Iniciais: só letras (com acentos), em maiúsculas. */
export const INITIALS = /^[A-ZÀ-ÖØ-Þ]+$/;

/** Uma linha do carrinho, tal como o navegador a guarda. */
export type CartLine = {
  key: string;
  productId: string;
  size: string;
  color: string | null;
  quantity: number;
  custom: CustomChoice[];
};

export const MAX_QUANTITY = 20;

export type OrderForm = {
  athleteName: string;
  ageGroup: string;
  phone: string;
  email: string;
  notes: string;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  consent: boolean;
};

export type ValidatedItem = {
  product: Product;
  size: string;
  color: string | null;
  quantity: number;
  custom: CustomChoice[];
  unitPriceCents: number;
};

export function lineUnitPrice(product: Product, custom: CustomChoice[]) {
  return custom.reduce((total, c) => total + (product.personalization.find((o) => o.id === c.optionId)?.priceCents ?? 0), product.priceCents);
}

/** Texto curto da personalização, ex.: "Costas: SILVA 10 · Calções: 10". */
export function describeCustom(product: Product, custom: CustomChoice[]) {
  return custom
    .map((c) => {
      const o = product.personalization.find((x) => x.id === c.optionId);
      if (!o) return "";
      const value = c.initials ? `iniciais ${c.initials}` : [c.name, c.number].filter((v) => v != null && v !== "").join(" ");
      return `${o.label}: ${value}`;
    })
    .filter(Boolean)
    .join(" · ");
}

const PHONE = /^\+?[0-9 ]{9,15}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Valida a personalização contra as opções do produto; devolve null se inválida. */
export function validateCustom(product: Product, raw: unknown): CustomChoice[] | null {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return null;
  const out: CustomChoice[] = [];
  for (const r of raw.slice(0, 5) as Record<string, unknown>[]) {
    const o = product.personalization.find((x) => x.id === r?.optionId);
    if (!o || out.some((c) => c.optionId === o.id)) return null;
    const name = o.nameMaxLength ? clean(r.name, o.nameMaxLength).toUpperCase() || null : null;
    const number = r.number == null || r.number === "" ? null : Number(r.number);
    if (number != null && !(Number.isInteger(number) && number >= o.numberMin && number <= o.numberMax)) return null;
    let initials: string | null = null;
    if (o.initialsMaxLength && typeof r.initials === "string" && r.initials.trim()) {
      initials = r.initials.trim().toUpperCase().replace(/\./g, "");
      if (initials.length > o.initialsMaxLength || !INITIALS.test(initials)) return null;
      if (number != null) return null; // número OU iniciais, nunca os dois
    }
    if (name == null && number == null && initials == null) return null;
    out.push({ optionId: o.id, name, number, initials });
  }
  return out;
}

/**
 * Validação feita no SERVIDOR. Nunca confia no navegador: os preços e as
 * opções (tamanhos, cores, personalização) são verificados contra o catálogo.
 */
export function validateOrder(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const f = (b.form ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const form: OrderForm = {
    athleteName: clean(f.athleteName, 120),
    ageGroup: clean(f.ageGroup, 40),
    phone: clean(f.phone, 20),
    email: clean(f.email, 160).toLowerCase(),
    notes: clean(f.notes, 1000),
    isMinor: f.isMinor === true,
    guardianName: clean(f.guardianName, 120),
    guardianPhone: clean(f.guardianPhone, 20),
    consent: f.consent === true,
  };

  if (!form.athleteName) errors.athleteName = "Indica o nome do atleta.";
  if (!AGE_GROUPS.some((g) => g.id === form.ageGroup)) errors.ageGroup = "Escolhe o escalão.";
  if (!PHONE.test(form.phone)) errors.phone = "Indica um número de telemóvel válido.";
  if (!EMAIL.test(form.email)) errors.email = "Indica um e-mail válido.";
  if (form.isMinor) {
    if (!form.guardianName) errors.guardianName = "Indica o nome do encarregado de educação.";
    if (!PHONE.test(form.guardianPhone)) errors.guardianPhone = "Indica o contacto do encarregado de educação.";
  } else {
    form.guardianName = "";
    form.guardianPhone = "";
  }
  if (!form.consent) errors.consent = "É necessário aceitar o tratamento de dados para fazer a reserva.";

  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 50) : [];
  const items: ValidatedItem[] = [];
  let invalid = 0;
  for (const raw of rawItems as Record<string, unknown>[]) {
    const product = getProductById(String(raw?.productId ?? ""));
    const size = clean(raw?.size, 20);
    const color = product?.colors.length ? clean(raw.color, 30) : null;
    const quantity = Math.floor(Number(raw?.quantity));
    const custom = product ? validateCustom(product, raw.custom) : null;
    if (
      !product ||
      !product.sizes.includes(size) ||
      (product.colors.length > 0 && !product.colors.includes(color!)) ||
      !(quantity >= 1 && quantity <= MAX_QUANTITY) ||
      custom == null
    ) {
      invalid++;
      continue;
    }
    items.push({ product, size, color, quantity, custom, unitPriceCents: lineUnitPrice(product, custom) });
  }
  if (invalid) errors.items = "Um dos produtos do carrinho já não está disponível com essas opções. Revê o carrinho.";
  else if (items.length === 0) errors.items = "O carrinho está vazio.";

  const totalCents = items.reduce((t, i) => t + i.unitPriceCents * i.quantity, 0);
  return { ok: Object.keys(errors).length === 0, errors, form, items, totalCents };
}
