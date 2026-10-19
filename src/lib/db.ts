import fs from "node:fs";
import path from "node:path";

/**
 * Base de dados das reservas: Upstash Redis (criada dentro do Vercel → Storage).
 *
 * O Vercel injeta automaticamente KV_REST_API_URL e KV_REST_API_TOKEN (ou
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Só o servidor fala com a
 * base de dados — o navegador nunca recebe estas chaves.
 *
 * Para testes no computador, LOCAL_DB=1 guarda tudo num ficheiro (.data/db.json).
 */

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const LOCAL = !URL_ && process.env.LOCAL_DB === "1";

export const dbConfigured = Boolean((URL_ && TOKEN) || LOCAL);

type Cmd = (string | number)[];

async function redis<T = unknown>(cmds: Cmd[]): Promise<T[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Base de dados indisponível (${res.status})`);
  const out = (await res.json()) as { result?: T; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result as T;
  });
}

/* ---------- versão local (só para testes) ---------- */
type LocalData = { kv: Record<string, string>; z: Record<string, Record<string, number>>; exp: Record<string, number> };
const FILE = path.join(process.cwd(), ".data", "db.json");
function readLocal(): LocalData {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { kv: {}, z: {}, exp: {} };
  }
}
function writeLocal(d: LocalData) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(d));
}
function alive(d: LocalData, key: string) {
  if (d.exp[key] && d.exp[key] < Date.now()) {
    delete d.kv[key];
    delete d.exp[key];
  }
}

/* ---------- operações usadas pela loja ---------- */
export const db = {
  /** Incrementa um contador; com ttlSeconds, o contador expira (usado para travar tentativas de login). */
  async incr(key: string, ttlSeconds?: number): Promise<number> {
    if (LOCAL) {
      const d = readLocal();
      alive(d, key);
      const v = Number(d.kv[key] ?? 0) + 1;
      d.kv[key] = String(v);
      if (ttlSeconds && !d.exp[key]) d.exp[key] = Date.now() + ttlSeconds * 1000;
      writeLocal(d);
      return v;
    }
    const cmds: Cmd[] = [["INCR", key]];
    if (ttlSeconds) cmds.push(["EXPIRE", key, ttlSeconds, "NX"]);
    const [v] = await redis<number>(cmds);
    return Number(v);
  },
  async get(key: string): Promise<string | null> {
    if (LOCAL) {
      const d = readLocal();
      alive(d, key);
      return d.kv[key] ?? null;
    }
    const [v] = await redis<string | null>([["GET", key]]);
    return v;
  },
  async del(key: string) {
    if (LOCAL) {
      const d = readLocal();
      delete d.kv[key];
      writeLocal(d);
      return;
    }
    await redis([["DEL", key]]);
  },
  /** Guarda um registo e indexa-o por data (score). */
  async putIndexed(index: string, key: string, value: string, score: number) {
    if (LOCAL) {
      const d = readLocal();
      d.kv[key] = value;
      (d.z[index] ??= {})[key] = score;
      writeLocal(d);
      return;
    }
    await redis([
      ["SET", key, value],
      ["ZADD", index, score, key],
    ]);
  },
  /** Grava só se a chave ainda não existir. Devolve true se gravou (é a primeira vez). */
  async setIfMissing(key: string, value: string): Promise<boolean> {
    if (LOCAL) {
      const d = readLocal();
      if (key in d.kv) return false;
      d.kv[key] = value;
      writeLocal(d);
      return true;
    }
    const [r] = await redis<string | null>([["SET", key, value, "NX"]]);
    return r === "OK";
  },
  /** Apaga todos os registos de um índice e o próprio índice. */
  async clearIndexed(index: string) {
    if (LOCAL) {
      const d = readLocal();
      for (const k of Object.keys(d.z[index] ?? {})) delete d.kv[k];
      delete d.z[index];
      writeLocal(d);
      return;
    }
    const [keys] = await redis<string[]>([["ZRANGE", index, 0, -1]]);
    await redis([...(keys?.length ? [["DEL", ...keys] as Cmd] : []), ["DEL", index]]);
  },
  async set(key: string, value: string) {
    if (LOCAL) {
      const d = readLocal();
      d.kv[key] = value;
      writeLocal(d);
      return;
    }
    await redis([["SET", key, value]]);
  },
  async removeIndexed(index: string, key: string) {
    if (LOCAL) {
      const d = readLocal();
      delete d.kv[key];
      if (d.z[index]) delete d.z[index][key];
      writeLocal(d);
      return;
    }
    await redis([
      ["DEL", key],
      ["ZREM", index, key],
    ]);
  },
  /** Todos os registos de um índice, do mais recente para o mais antigo. */
  async listIndexed(index: string): Promise<string[]> {
    if (LOCAL) {
      const d = readLocal();
      return Object.entries(d.z[index] ?? {})
        .sort((a, b) => b[1] - a[1])
        .map(([k]) => d.kv[k])
        .filter(Boolean);
    }
    const [keys] = await redis<string[]>([["ZREVRANGE", index, 0, -1]]);
    if (!keys?.length) return [];
    const [values] = await redis<(string | null)[]>([["MGET", ...keys]]);
    return (values ?? []).filter((v): v is string => typeof v === "string");
  },
};
