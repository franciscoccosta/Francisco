import { isAdmin } from "@/lib/auth";
import { ONE_SIZE } from "@/lib/catalog";
import { listOrders } from "@/lib/orders";
import { buildXlsx } from "@/lib/xlsx";

export const dynamic = "force-dynamic";

/** Excel com os artigos das encomendas escolhidas no back office (?ids=id1,id2,…). */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Sem acesso.", { status: 401 });

  const ids = new Set((new URL(req.url).searchParams.get("ids") ?? "").split(",").filter(Boolean));
  if (!ids.size) return new Response("Escolhe pelo menos uma encomenda.", { status: 400 });

  const orders = (await listOrders()).filter((o) => ids.has(o.id)).sort((a, b) => a.number.localeCompare(b.number));
  const rows = orders.flatMap((o) =>
    o.items.map((i) => [
      o.number,
      o.form.athleteName,
      i.name,
      i.color ?? "—",
      i.size === ONE_SIZE ? "—" : i.size,
      i.quantity,
      i.customText ? `Sim: ${i.customText}` : "Não",
    ]),
  );

  const file = buildXlsx(
    "Encomendas",
    ["Nº encomenda", "Nome", "Artigo", "Cor", "Tamanho", "Quantidade", "Personalização"],
    rows,
    [14, 26, 38, 18, 11, 12, 40],
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(file), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="encomendas-camoes-${date}.xlsx"`,
      "cache-control": "no-store",
    },
  });
}
