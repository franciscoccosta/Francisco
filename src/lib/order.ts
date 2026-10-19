import { AGE_GROUPS, getProductById, ONE_SIZE, type Product } from "./catalog";

/** Uma linha do carrinho, tal como o navegador a guarda. */
export type CartLine = {
  key: string;
  productId: string;
  size: string;
  color: string | null;
  quantity: number;
  customName: string | null;
  customNumber: number | null;
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
  customName: string | null;
  customNumber: number | null;
  unitPriceCents: number;
};

export function lineUnitPrice(product: Product, line: Pick<CartLine, "customName" | "customNumber">) {
  const personalized = !!(product.personalization && (line.customName || line.customNumber != null));
  return product.priceCents + (personalized ? product.personalization!.priceCents : 0);
}

const PHONE = /^\+?[0-9 ]{9,15}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

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
    const product = getProductById(String(raw.productId ?? ""));
    if (!product) { invalid++; continue; }
    const size = clean(raw.size, 20);
    if (!product.sizes.includes(size)) { invalid++; continue; }
    const color = product.colors.length ? clean(raw.color, 30) : null;
    if (product.colors.length && !product.colors.includes(color!)) { invalid++; continue; }
    const quantity = Math.floor(Number(raw.quantity));
    if (!(quantity >= 1 && quantity <= MAX_QUANTITY)) { invalid++; continue; }

    let customName: string | null = null;
    let customNumber: number | null = null;
    if (product.personalization) {
      const p = product.personalization;
      customName = clean(raw.customName, p.nameMaxLength).toUpperCase() || null;
      const n = raw.customNumber == null || raw.customNumber === "" ? null : Math.floor(Number(raw.customNumber));
      customNumber = n != null && n >= p.numberMin && n <= p.numberMax ? n : null;
    }
    items.push({ product, size: size || ONE_SIZE, color, quantity, customName, customNumber, unitPriceCents: lineUnitPrice(product, { customName, customNumber }) });
  }
  if (invalid) errors.items = "Um dos produtos do carrinho já não está disponível com essas opções. Revê o carrinho.";
  else if (items.length === 0) errors.items = "O carrinho está vazio.";

  const totalCents = items.reduce((t, i) => t + i.unitPriceCents * i.quantity, 0);
  return { ok: Object.keys(errors).length === 0, errors, form, items, totalCents };
}
