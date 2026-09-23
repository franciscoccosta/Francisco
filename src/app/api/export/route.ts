import { isAdmin } from "@/lib/admin";
import { listSubmissions } from "@/lib/store";

const cell = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  // Neutralise spreadsheet formulas in user-supplied text
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV download of every submission: /api/export?key=ADMIN_KEY */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (!isAdmin(key)) return new Response("Not found", { status: 404 });

  const rows = listSubmissions();
  const fields = Array.from(new Set(rows.flatMap((r) => Object.keys(r.payload))));
  const header = ["created_at", "type", "material_id", ...fields];
  const lines = [
    header.join(","),
    ...rows.map((r) => [r.createdAt, r.type, r.materialId, ...fields.map((f) => r.payload[f])].map(cell).join(",")),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="remade-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
