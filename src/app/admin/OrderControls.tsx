"use client";

import { useState, useTransition } from "react";
import { markPaid, removeOrder } from "./actions";

export function PaidToggle({ id, paid }: { id: string; paid: boolean }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useState(paid);
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 font-semibold transition-colors ${value ? "border-green-700 bg-green-50 text-green-800" : "border-line text-navy"}`}>
      <input
        type="checkbox"
        className="h-6 w-6 accent-green-700"
        checked={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.checked;
          setValue(next);
          start(() => markPaid(id, next));
        }}
      />
      {value ? "Paga ✓" : "Marcar como paga"}
    </label>
  );
}

export function DeleteButton({ id, number }: { id: string; number: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Eliminar a encomenda ${number}?\n\nFaz isto só depois de entregares o material. Não é possível desfazer.`)) {
          start(() => removeOrder(id));
        }
      }}
      className="btn min-h-12 border-2 border-red-200 bg-white text-danger hover:bg-red-50"
    >
      {pending ? "A eliminar…" : "Eliminar encomenda"}
    </button>
  );
}
