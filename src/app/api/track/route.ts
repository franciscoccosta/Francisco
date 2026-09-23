import { insertEvent } from "@/lib/db";

const EVENTS = new Set(["page_view", "material_view", "cta_click", "interest_open", "filter"]);
const BOT_RE = /bot|crawl|spider|preview|headless|lighthouse/i;

const str = (v: unknown, max: number) => (typeof v === "string" && v ? v.slice(0, max) : null);

export async function POST(request: Request) {
  if (BOT_RE.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const name = str(body.name, 40);
  if (!name || !EVENTS.has(name)) return new Response(null, { status: 400 });

  // Keep meta small and flat: a handful of short string values (e.g. which CTA).
  let meta: Record<string, string> | null = null;
  if (body.meta && typeof body.meta === "object") {
    meta = {};
    for (const [k, v] of Object.entries(body.meta).slice(0, 6)) {
      const value = str(v, 100);
      if (value) meta[k.slice(0, 30)] = value;
    }
  }
  try {
    insertEvent({
      name,
      visitorId: str(body.visitorId, 64),
      sessionId: str(body.sessionId, 64),
      path: str(body.path, 300),
      materialId: str(body.materialId, 20),
      meta,
    });
  } catch (err) {
    console.error("[remade] could not store event", err);
  }
  return new Response(null, { status: 204 });
}
