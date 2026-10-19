"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, checkCredentials, startSession } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW = 15 * 60; // 15 minutos

export type LoginState = { error?: string; username?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!authConfigured) return { error: "O acesso ao back office ainda não foi configurado." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  const lockKey = `login-fails:${ip}`;

  if (dbConfigured && Number((await db.get(lockKey)) ?? 0) >= MAX_ATTEMPTS) {
    return { error: "Demasiadas tentativas falhadas. Tenta novamente daqui a 15 minutos.", username: String(form.get("username") ?? "").slice(0, 100) };
  }

  const username = String(form.get("username") ?? "").slice(0, 100);
  const password = String(form.get("password") ?? "").slice(0, 200);

  if (!checkCredentials(username, password)) {
    if (dbConfigured) await db.incr(lockKey, WINDOW);
    await new Promise((r) => setTimeout(r, 600)); // abranda tentativas automáticas
    return { error: "Credenciais incorretas.", username };
  }

  if (dbConfigured) await db.del(lockKey);
  await startSession();
  redirect("/admin");
}
