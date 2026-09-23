"use client";

import { useState, type FormEvent } from "react";
import type { FormType } from "@/lib/forms";
import { visitorId } from "@/lib/track";

type State = { status: "idle" | "sending" | "done" | "error"; errors: Record<string, string>; message?: string };

export function useFormSubmit(
  type: FormType,
  extra: Record<string, string> = {},
  prepare?: (data: FormData) => Promise<void>,
) {
  const [state, setState] = useState<State>({ status: "idle", errors: {} });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("formType", type);
    data.set("visitorId", visitorId());
    for (const [k, v] of Object.entries(extra)) data.set(k, v);

    setState({ status: "sending", errors: {} });
    try {
      await prepare?.(data);
      const res = await fetch("/api/submit", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ status: "done", errors: {} });
        return;
      }
      const errors = (json.errors ?? {}) as Record<string, string>;
      setState({ status: "error", errors, message: json.error ?? "Please check the highlighted fields." });
      const first = Object.keys(errors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } catch {
      setState({ status: "error", errors: {}, message: "Something went wrong sending the form. Please try again." });
    }
  }

  return { ...state, onSubmit };
}
