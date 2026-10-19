import { db, dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Verificação rápida: a loja está ligada à base de dados? (não mostra dados nenhuns) */
export async function GET() {
  if (!dbConfigured) return Response.json({ baseDeDados: "não ligada" });
  try {
    await db.get("estado:ping");
    return Response.json({ baseDeDados: "ligada e a funcionar" });
  } catch {
    return Response.json({ baseDeDados: "ligada, mas com erro de ligação" });
  }
}
