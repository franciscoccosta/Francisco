import type { Order } from "@/lib/types";

const KEY = "remade.orders";

function readAll(): Order[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function generateOrderNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RM-${new Date().getFullYear()}-${rand}`;
}

export function createOrder(order: Order) {
  const all = readAll();
  all.unshift(order);
  writeAll(all);
}

export function ordersForEmail(email: string): Order[] {
  return readAll().filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
}
