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
 * The file lives in ./data by default (REMADE_DATA_DIR to override). On hosts
 * with an ephemeral filesystem, also set SUBMISSIONS_WEBHOOK_URL so every
 * submission is forwarded (e.g. to Zapier/Make → Google Sheets or Airtable).
 */

export type SubmissionType = "supplier" | "buyer" | "request";
export type EventType = "page_view" | "passport_view" | "interest_open" | "cta_click";

export const DATA_DIR = process.env.REMADE_DATA_DIR || path.join(process.cwd(), "data");

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

export async function saveSubmission(input: Omit<Submission, "id" | "createdAt">, id = randomUUID()) {
  const row: Submission = { ...input, id, createdAt: new Date().toISOString() };
  getDb()
    .prepare("INSERT INTO submissions (id, type, material_id, visitor_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(row.id, row.type, row.materialId, row.visitorId, JSON.stringify(row.payload), row.createdAt);

  const hook = process.env.SUBMISSIONS_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[remade] webhook forward failed", err);
    }
  }
  return row;
}

export function saveEvent(e: {
  type: EventType;
  visitorId: string;
  path?: string | null;
  materialId?: string | null;
  label?: string | null;
  referrer?: string | null;
}) {
  getDb()
    .prepare("INSERT INTO events (type, visitor_id, path, material_id, label, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(e.type, e.visitorId, e.path ?? null, e.materialId ?? null, e.label ?? null, e.referrer ?? null, new Date().toISOString());
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
