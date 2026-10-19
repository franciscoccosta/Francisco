import { randomUUID } from "node:crypto";
import { AGE_GROUPS } from "./catalog";
import { db } from "./db";
import { describeCustom, type CustomChoice, type OrderForm, type ValidatedItem } from "./order";

/** Uma reserva tal como fica guardada. Guarda nomes e preços do momento da reserva. */
export type StoredOrder = {
  id: string;
  number: string;
  createdAt: string;
  paid: boolean;
  form: OrderForm;
  ageGroupName: string;
  items: {
    productId: string;
    name: string;
    size: string;
    color: string | null;
    quantity: number;
    custom: CustomChoice[];
    customText: string;
    unitPriceCents: number;
  }[];
  totalCents: number;
};

const INDEX = "orders";
const key = (id: string) => `order:${id}`;

export async function createOrder(form: OrderForm, items: ValidatedItem[], totalCents: number) {
  const seq = await db.incr("orders:seq");
  const order: StoredOrder = {
    id: randomUUID(),
    number: `CAM-${String(seq).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
    paid: false,
    form,
    ageGroupName: AGE_GROUPS.find((g) => g.id === form.ageGroup)?.name ?? form.ageGroup,
    items: items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      custom: i.custom,
      customText: describeCustom(i.product, i.custom),
      unitPriceCents: i.unitPriceCents,
    })),
    totalCents,
  };
  await db.putIndexed(INDEX, key(order.id), JSON.stringify(order), Date.parse(order.createdAt));
  return order;
}

export async function listOrders(): Promise<StoredOrder[]> {
  const raw = await db.listIndexed(INDEX);
  return raw.map((r) => JSON.parse(r) as StoredOrder);
}

export async function setPaid(id: string, paid: boolean) {
  const raw = await db.get(key(id));
  if (!raw) return;
  const order = JSON.parse(raw) as StoredOrder;
  order.paid = paid;
  await db.set(key(id), JSON.stringify(order));
}

export async function deleteOrder(id: string) {
  await db.removeIndexed(INDEX, key(id));
}
