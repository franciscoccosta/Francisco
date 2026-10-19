import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, dbConfigured } from "./db";

/**
 * Acesso ao back office: UMA única conta. Mais nenhuma combinação entra.
 *
 * O repositório é público, por isso a palavra-passe NÃO está escrita aqui: guarda-se
 * apenas a sua impressão digital (scrypt com sal), que permite confirmar a
 * palavra-passe mas não recuperá-la.
 *
 * Depois de entrar, o navegador recebe um cookie assinado (HttpOnly, Secure,
 * SameSite=Strict) válido por 12 horas. A chave de assinatura é gerada ao acaso uma
 * única vez e guardada na base de dados (nunca no código). A página /admin e todas as
 * ações do back office voltam a verificar o cookie no servidor.
 */

const USERNAME = "franciscocamoes!";
const PASSWORD_HASH = "scrypt$OWRwxJA-1aitFb2d8YZAHg$6QZxZiJvpWgWclYgZ91anw0Atv29X3xbcTaHjrAkAqE";

const COOKIE = "camoes_admin";
const MAX_AGE = 12 * 60 * 60; // 12 horas

export const authConfigured = dbConfigured;

function same(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkCredentials(username: string, password: string) {
  const [, salt, hash] = PASSWORD_HASH.split("$");
  const attempt = scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  // as duas verificações correm sempre, para não revelar qual das duas falhou
  const userOk = same(Buffer.from(username.trim()), Buffer.from(USERNAME));
  const passOk = same(attempt, Buffer.from(hash, "base64url"));
  return userOk && passOk;
}

let secret: string | null = null;
async function sessionSecret() {
  if (secret) return secret;
  const existing = await db.get("auth:session-secret");
  if (existing) return (secret = existing);
  const fresh = randomBytes(32).toString("base64url");
  await db.setIfMissing("auth:session-secret", fresh);
  return (secret = (await db.get("auth:session-secret")) ?? fresh);
}

async function sign(payload: string) {
  return createHmac("sha256", await sessionSecret()).update(payload).digest("base64url");
}

export async function startSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${await sign(payload)}`, {
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
  return same(Buffer.from(await sign(`${who}.${exp}`)), Buffer.from(sig));
}
