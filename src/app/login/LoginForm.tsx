"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="username" className="label">Username</label>
        <input id="username" name="username" defaultValue={state.username} className="input" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
      </div>
      <div>
        <label htmlFor="password" className="label">Palavra-passe</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
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
