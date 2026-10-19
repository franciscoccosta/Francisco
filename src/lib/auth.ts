import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Acesso ao back office: UM único utilizador e palavra-passe, definidos nas
 * variáveis de ambiente do Vercel (ADMIN_USERNAME e ADMIN_PASSWORD) — nunca no código.
 *
 * Depois de entrar, o navegador recebe um cookie assinado (HttpOnly, não legível
 * por JavaScript) válido por 12 horas. Cada página e cada ação do back office
 * volta a verificar esse cookie no servidor.
 */

const COOKIE = "camoes_admin";
const MAX_AGE = 12 * 60 * 60; // 12 horas

const USERNAME = process.env.ADMIN_USERNAME ?? "";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SECRET = process.env.SESSION_SECRET || `${USERNAME}:${PASSWORD}:camoes-backoffice`;

export const authConfigured = USERNAME.length > 0 && PASSWORD.length > 0;

/** Comparação em tempo constante (não revela quantos caracteres estão certos). */
function same(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(username: string, password: string) {
  if (!authConfigured) return false;
  // as duas comparações correm sempre, para não revelar qual das duas falhou
  const u = same(username.trim(), USERNAME);
  const p = same(password, PASSWORD);
  return u && p;
}

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export async function startSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!authConfigured) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [who, exp, sig] = value.split(".");
  if (who !== "admin" || !exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = sign(`${who}.${exp}`);
  return expected.length === sig.length && timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
