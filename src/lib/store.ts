import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

/**
 * Tiny persistence layer for the validation prototype.
 *
 * Two tables in a local SQLite file (Node's built-in `node:sqlite`, no extra
 * dependency):
 *   submissions — every form sent (builder offer, designer signup, material request)
 *   events      — anonymous page views, passport views and CTA clicks
 *
 * The file lives in ./data by default (REMADE_DATA_DIR to override). Serverless
 * hosts such as Vercel have a read-only, throwaway filesystem, so there the file
 * goes to /tmp and only lives as long as one server instance. Set
 * SUBMISSIONS_WEBHOOK_URL (see docs/google-sheets.md) and every submission,
 * photo and event is also sent there — that copy is the one to rely on.
 */

export type SubmissionType = "supplier" | "buyer" | "request";
export type EventType = "page_view" | "passport_view" | "interest_open" | "cta_click";

export const DATA_DIR =
  process.env.REMADE_DATA_DIR || (process.env.VERCEL ? "/tmp/remade" : path.join(process.cwd(), "data"));

export const EPHEMERAL_STORAGE = !process.env.REMADE_DATA_DIR && !!process.env.VERCEL;

const WEBHOOK = process.env.SUBMISSIONS_WEBHOOK_URL;

async function forward(body: unknown) {
  if (!WEBHOOK) return false;
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error("[remade] webhook forward failed", err);
    return false;
  }
}

let db: DatabaseSync | null = null;

function getDb() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(path.join(DATA_DIR, "remade.sqlite"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      material_id TEXT,
      visitor_id TEXT,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      path TEXT,
      material_id TEXT,
      label TEXT,
      referrer TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS events_type ON events(type);
  `);
  return db;
}

export type Submission = {
  id: string;
  type: SubmissionType;
  materialId: string | null;
  visitorId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type Attachment = { name: string; type: string; data: Buffer };

/**
 * Saves locally and forwards to the webhook. Succeeds if at least one of the
 * two worked, so a read-only disk never loses a lead when a webhook is set.
 */
export async function saveSubmission(
  input: Omit<Submission, "id" | "createdAt">,
  id = randomUUID(),
  attachments: Attachment[] = [],
) {
  const row: Submission = { ...input, id, createdAt: new Date().toISOString() };
  let stored = false;
  try {
    getDb()
      .prepare("INSERT INTO submissions (id, type, material_id, visitor_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(row.id, row.type, row.materialId, row.visitorId, JSON.stringify(row.payload), row.createdAt);
    stored = true;
  } catch (err) {
    console.error("[remade] local save failed", err);
  }

  const forwarded = await forward({
    kind: "submission",
    ...row,
    files: attachments.map((a) => ({ name: a.name, type: a.type, base64: a.data.toString("base64") })),
  });
  if (!stored && !forwarded) throw new Error("Submission could not be stored");
  return row;
}

type EventInput = {
  type: EventType;
  visitorId: string;
  path?: string | null;
  materialId?: string | null;
  label?: string | null;
  referrer?: string | null;
};

export async function saveEvent(e: EventInput) {
  const createdAt = new Date().toISOString();
  try {
    getDb()
      .prepare("INSERT INTO events (type, visitor_id, path, material_id, label, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(e.type, e.visitorId, e.path ?? null, e.materialId ?? null, e.label ?? null, e.referrer ?? null, createdAt);
  } catch (err) {
    console.error("[remade] event save failed", err);
  }
  await forward({ kind: "event", createdAt, ...e });
}

type Row = Record<string, string | number | null>;

export function listSubmissions(): Submission[] {
  const rows = getDb().prepare("SELECT * FROM submissions ORDER BY created_at DESC").all() as Row[];
  return rows.map((r) => ({
    id: String(r.id),
    type: r.type as SubmissionType,
    materialId: (r.material_id as string) ?? null,
    visitorId: (r.visitor_id as string) ?? null,
    payload: JSON.parse(String(r.payload)),
    createdAt: String(r.created_at),
  }));
}

function scalar(sql: string, ...params: (string | number)[]) {
  const row = getDb().prepare(sql).get(...params) as Row | undefined;
  return Number(row ? Object.values(row)[0] : 0) || 0;
}

export function getMetrics() {
  const visitors = scalar("SELECT COUNT(DISTINCT visitor_id) FROM events WHERE type = 'page_view'");
  const pageViews = scalar("SELECT COUNT(*) FROM events WHERE type = 'page_view'");
  const suppliers = scalar("SELECT COUNT(*) FROM submissions WHERE type = 'supplier'");
  const buyers = scalar("SELECT COUNT(*) FROM submissions WHERE type = 'buyer'");
  const requests = scalar("SELECT COUNT(*) FROM submissions WHERE type = 'request'");
  const convertedVisitors = scalar(
    `SELECT COUNT(DISTINCT visitor_id) FROM submissions WHERE type IN ('supplier','buyer')
       AND visitor_id IN (SELECT visitor_id FROM events WHERE type = 'page_view')`,
  );
  // Material funnel counted per (visitor, material) pair so repeat views don't dilute it.
  // Only conversions with a matching tracked view count, so rates stay within 0–100%.
  const passportViewers = scalar(
    "SELECT COUNT(*) FROM (SELECT DISTINCT visitor_id, material_id FROM events WHERE type = 'passport_view')",
  );
  const passportRequesters = scalar(
    `SELECT COUNT(*) FROM (SELECT DISTINCT s.visitor_id, s.material_id FROM submissions s
       JOIN events e ON e.type = 'passport_view' AND e.visitor_id = s.visitor_id AND e.material_id = s.material_id
       WHERE s.type = 'request')`,
  );

  const perMaterial = getDb()
    .prepare(
      `SELECT m.material_id AS id,
              COUNT(DISTINCT m.visitor_id) AS viewers,
              (SELECT COUNT(*) FROM submissions s WHERE s.type = 'request' AND s.material_id = m.material_id) AS requests
       FROM events m WHERE m.type = 'passport_view' AND m.material_id IS NOT NULL
       GROUP BY m.material_id ORDER BY viewers DESC`,
    )
    .all() as { id: string; viewers: number; requests: number }[];

  const ctas = getDb()
    .prepare("SELECT label, COUNT(*) AS clicks FROM events WHERE type = 'cta_click' GROUP BY label ORDER BY clicks DESC")
    .all() as { label: string; clicks: number }[];

  return {
    visitors,
    pageViews,
    suppliers,
    buyers,
    requests,
    visitorToSignup: visitors ? convertedVisitors / visitors : 0,
    viewToRequest: passportViewers ? passportRequesters / passportViewers : 0,
    perMaterial,
    ctas,
  };
}
