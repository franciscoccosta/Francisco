"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, checkCode, startSession } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW = 15 * 60; // 15 minutos

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!authConfigured) return { error: "A base de dados ainda não está ligada no Vercel (Storage → Upstash Redis)." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  const lockKey = `login-fails:${ip}`;

  if (dbConfigured && Number((await db.get(lockKey)) ?? 0) >= MAX_ATTEMPTS) {
    return { error: "Demasiadas tentativas falhadas. Tenta novamente daqui a 15 minutos." };
  }

  const code = String(form.get("code") ?? "").slice(0, 50);

  if (!checkCode(code)) {
    if (dbConfigured) await db.incr(lockKey, WINDOW);
    await new Promise((r) => setTimeout(r, 600)); // abranda tentativas automáticas
    return { error: "Código incorreto." };
  }

  if (dbConfigured) await db.del(lockKey);
  await startSession();
  redirect("/admin");
}
