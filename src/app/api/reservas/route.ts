import { dbConfigured } from "@/lib/db";
import { validateOrder } from "@/lib/order";
import { createOrder } from "@/lib/orders";

/**
 * Recebe uma reserva, valida-a no servidor (preços e opções verificados contra o
 * catálogo) e guarda-a na base de dados. O público só consegue CRIAR reservas:
 * ler, marcar como paga e eliminar só no back office, com login.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  // Campo-armadilha preenchido = robô. Responde como se tivesse corrido bem, sem guardar.
  if (typeof body.website === "string" && body.website) return Response.json({ number: "CAM-0000" });

  const result = validateOrder(body);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });

  if (!dbConfigured) {
    return Response.json({ error: "A loja está temporariamente indisponível. Tenta novamente mais tarde." }, { status: 503 });
  }

  try {
    const order = await createOrder(result.form, result.items, result.totalCents);
    return Response.json({ number: order.number });
  } catch (e) {
    console.error("[reservas] erro ao guardar", e);
    return Response.json({ error: "Não foi possível guardar a reserva. Tenta novamente dentro de momentos." }, { status: 500 });
  }
}
