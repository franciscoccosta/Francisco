import { after } from "next/server";
import { getMaterial } from "@/lib/materials";
import { saveEvent, type EventType } from "@/lib/store";

const TYPES: EventType[] = ["page_view", "passport_view", "interest_open", "cta_click"];
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

const clip = (v: unknown, n: number) => (typeof v === "string" && v ? v.slice(0, n) : null);

export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    // sendBeacon posts text/plain, so parse the raw body ourselves
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = body.type as EventType;
  const visitorId = clip(body.visitorId, 64);
  if (!TYPES.includes(type) || !visitorId) return new Response(null, { status: 400 });

  const materialId = clip(body.materialId, 32);
  // Recorded after responding, so a slow webhook never delays the visitor
  after(() =>
    saveEvent({
      type,
      visitorId,
      path: clip(body.path, 300),
      materialId: materialId && getMaterial(materialId) ? materialId : null,
      label: clip(body.label, 120),
      referrer: clip(body.referrer, 300),
    }),
  );
  return new Response(null, { status: 204 });
}
