import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";
import { listSubmissions, type SubmissionType } from "@/lib/db";

const TYPES: SubmissionType[] = ["supplier", "designer", "material_request"];

function csvCell(v: unknown) {
  const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (!isAdmin(params.get("key"))) return new Response("Forbidden", { status: 403 });

  const type = params.get("type") as SubmissionType;
  if (!TYPES.includes(type)) return new Response("Unknown type", { status: 400 });

  const rows = listSubmissions(type).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    material_id: r.material_id,
    visitor_id: r.visitor_id,
    ...(JSON.parse(r.payload) as Record<string, unknown>),
  }));
  const columns = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const csv = [columns.join(","), ...rows.map((r) => columns.map((c) => csvCell((r as Record<string, unknown>)[c])).join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="remade-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
