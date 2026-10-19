"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="code" className="label">Código de acesso</label>
        <input id="code" name="code" type="password" inputMode="numeric" className="input tracking-widest" autoComplete="off" required />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-navy min-h-14 w-full text-base">
        {pending ? "A verificar…" : "Entrar"}
      </button>
    </form>
  );
}
