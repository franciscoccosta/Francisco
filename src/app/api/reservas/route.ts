import { randomInt } from "node:crypto";
import { validateOrder } from "@/lib/order";

/**
 * Recebe uma reserva, valida-a no servidor e devolve o número da reserva.
 *
 * FASE 1: ainda NÃO grava em lado nenhum (modo de demonstração).
 * FASE 2: passa a gravar no Supabase, com número sequencial (CAM-0001, …).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  // Campo-armadilha preenchido = robô. Responde como se tivesse corrido bem.
  if (typeof body.website === "string" && body.website) return Response.json({ number: "CAM-0000", demo: true });

  const result = validateOrder(body);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from({ length: 5 }, () => alphabet[randomInt(alphabet.length)]).join("");
  return Response.json({ number: `CAM-${code}`, demo: true });
}
