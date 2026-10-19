"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById } from "./catalog";
import { lineUnitPrice, MAX_QUANTITY, type CartLine } from "./order";

const STORAGE_KEY = "camoes-carrinho-v1";

type CartContext = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  totalCents: number;
  add: (line: Omit<CartLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartContext | null>(null);

/** Linhas iguais (mesmo produto, tamanho, cor e personalização) juntam-se. */
const keyOf = (l: Omit<CartLine, "key">) =>
  [l.productId, l.size, l.color ?? "", l.customName ?? "", l.customNumber ?? ""].join("|");

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // O carrinho fica guardado neste navegador (sobrevive a recarregar a página)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do armazenamento local
      setLines(saved.filter((l) => getProductById(l.productId)));
    } catch {
      /* armazenamento indisponível: carrinho começa vazio */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignorar */
    }
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = keyOf(line);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + line.quantity) } : l));
      }
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) } : l)));
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    let count = 0;
    let totalCents = 0;
    for (const l of lines) {
      const p = getProductById(l.productId);
      if (!p) continue;
      count += l.quantity;
      totalCents += lineUnitPrice(p, l) * l.quantity;
    }
    return { lines, ready, count, totalCents, add, setQuantity, remove, clear };
  }, [lines, ready, add, setQuantity, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart tem de estar dentro de CartProvider");
  return ctx;
}
