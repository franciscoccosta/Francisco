"use client";

const KEY = "remade_vid";
let memoryId: string | null = null;

/** Anonymous, random per-browser id. No personal data, no cookies. */
export function visitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    memoryId ??= crypto.randomUUID();
    return memoryId;
  }
}

type TrackEvent = "page_view" | "passport_view" | "interest_open" | "cta_click";

export function track(type: TrackEvent, extra: { materialId?: string; label?: string } = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    type,
    visitorId: visitorId(),
    path: location.pathname,
    referrer: document.referrer || null,
    ...extra,
  });
  if (navigator.sendBeacon?.("/api/track", body)) return;
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}
