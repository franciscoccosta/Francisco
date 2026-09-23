"use client";

/**
 * Anonymous, cookie-free measurement for the validation prototype.
 * A random visitor id lives in localStorage and a session id in
 * sessionStorage; nothing personal is collected here.
 */

function randomId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function stored(storage: () => Storage, key: string) {
  try {
    const s = storage();
    let v = s.getItem(key);
    if (!v) {
      v = randomId();
      s.setItem(key, v);
    }
    return v;
  } catch {
    return null;
  }
}

export function getVisitorId() {
  return stored(() => window.localStorage, "remade_vid");
}

function getSessionId() {
  return stored(() => window.sessionStorage, "remade_sid");
}

export type TrackEvent = "page_view" | "material_view" | "cta_click" | "interest_open" | "filter";

export function track(name: TrackEvent, extra: { materialId?: string; meta?: Record<string, string> } = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    name,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path: window.location.pathname + window.location.search,
    ...extra,
  });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/track", blob)) return;
  } catch {
    /* fall through to fetch */
  }
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(
    () => {},
  );
}

/** POST a form to /api/submit with the visitor id attached. */
export async function submitForm(type: "supplier" | "designer" | "material_request", data: FormData) {
  data.set("type", type);
  data.set("visitorId", getVisitorId() ?? "");
  data.set("source", window.location.pathname);
  const res = await fetch("/api/submit", { method: "POST", body: data });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
}
