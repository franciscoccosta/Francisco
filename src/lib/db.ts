import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * Minimal persistence for the validation prototype: one SQLite file with two
 * tables — `submissions` (the three forms) and `events` (anonymous page/CTA
 * analytics). Location is configurable with REMADE_DATA_DIR.
 *
 * On serverless hosts with an ephemeral filesystem, set FORMS_WEBHOOK_URL as
 * well (see `forwardSubmission`) so no submission is lost.
 */

export const DATA_DIR = process.env.REMADE_DATA_DIR || path.join(process.cwd(), "data");

export type SubmissionType = "supplier" | "designer" | "material_request";

let db: DatabaseSync | null = null;

function getDb() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(path.join(DATA_DIR, "remade.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      type TEXT NOT NULL,
      visitor_id TEXT,
      material_id TEXT,
      email TEXT,
      payload TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      name TEXT NOT NULL,
      visitor_id TEXT,
      session_id TEXT,
      path TEXT,
      material_id TEXT,
      meta TEXT
    );
    CREATE INDEX IF NOT EXISTS events_name ON events(name);
    CREATE INDEX IF NOT EXISTS submissions_type ON submissions(type);
  `);
  return db;
}

export function insertSubmission(s: {
  type: SubmissionType;
  visitorId: string | null;
  materialId: string | null;
  email: string | null;
  payload: Record<string, unknown>;
}) {
  const res = getDb()
    .prepare("INSERT INTO submissions (type, visitor_id, material_id, email, payload) VALUES (?, ?, ?, ?, ?)")
    .run(s.type, s.visitorId, s.materialId, s.email, JSON.stringify(s.payload));
  return Number(res.lastInsertRowid);
}

export function updateSubmissionPayload(id: number, payload: Record<string, unknown>) {
  getDb().prepare("UPDATE submissions SET payload = ? WHERE id = ?").run(JSON.stringify(payload), id);
}

export function insertEvent(e: {
  name: string;
  visitorId: string | null;
  sessionId: string | null;
  path: string | null;
  materialId: string | null;
  meta: Record<string, unknown> | null;
}) {
  getDb()
    .prepare("INSERT INTO events (name, visitor_id, session_id, path, material_id, meta) VALUES (?, ?, ?, ?, ?, ?)")
    .run(e.name, e.visitorId, e.sessionId, e.path, e.materialId, e.meta ? JSON.stringify(e.meta) : null);
}

export type SubmissionRow = {
  id: number;
  created_at: string;
  type: SubmissionType;
  visitor_id: string | null;
  material_id: string | null;
  email: string | null;
  payload: string;
};

export function listSubmissions(type?: SubmissionType): SubmissionRow[] {
  const d = getDb();
  return (
    type
      ? d.prepare("SELECT * FROM submissions WHERE type = ? ORDER BY id DESC").all(type)
      : d.prepare("SELECT * FROM submissions ORDER BY id DESC").all()
  ) as SubmissionRow[];
}

function scalar(sql: string, ...params: (string | number)[]) {
  const row = getDb().prepare(sql).get(...params) as { n: number } | undefined;
  return row?.n ?? 0;
}

/** The six numbers the prototype exists to measure. */
export function getMetrics() {
  const visitors = scalar("SELECT COUNT(DISTINCT visitor_id) AS n FROM events WHERE name = 'page_view'");
  const pageViews = scalar("SELECT COUNT(*) AS n FROM events WHERE name = 'page_view'");
  const suppliers = scalar("SELECT COUNT(*) AS n FROM submissions WHERE type = 'supplier'");
  const designers = scalar("SELECT COUNT(*) AS n FROM submissions WHERE type = 'designer'");
  const requests = scalar("SELECT COUNT(*) AS n FROM submissions WHERE type = 'material_request'");
  // Numerators only count visitors we also saw in the denominator, so the
  // rates stay within 0–100% even if tracking was blocked for some visitors.
  const signupVisitors = scalar(
    `SELECT COUNT(DISTINCT visitor_id) AS n FROM submissions WHERE type IN ('supplier','designer')
       AND visitor_id IN (SELECT visitor_id FROM events WHERE name = 'page_view')`,
  );
  const passportViewers = scalar("SELECT COUNT(DISTINCT visitor_id) AS n FROM events WHERE name = 'material_view'");
  const requesters = scalar(
    `SELECT COUNT(DISTINCT visitor_id) AS n FROM submissions WHERE type = 'material_request'
       AND visitor_id IN (SELECT visitor_id FROM events WHERE name = 'material_view')`,
  );

  const perMaterial = getDb()
    .prepare(
      `SELECT m.material_id AS id,
              COUNT(DISTINCT m.visitor_id) AS viewers,
              (SELECT COUNT(*) FROM submissions s WHERE s.type = 'material_request' AND s.material_id = m.material_id) AS requests
         FROM events m WHERE m.name = 'material_view' AND m.material_id IS NOT NULL
        GROUP BY m.material_id ORDER BY viewers DESC`,
    )
    .all() as { id: string; viewers: number; requests: number }[];

  const ctas = getDb()
    .prepare(
      `SELECT json_extract(meta, '$.cta') AS cta, COUNT(*) AS n FROM events
        WHERE name = 'cta_click' GROUP BY cta ORDER BY n DESC`,
    )
    .all() as { cta: string; n: number }[];

  return {
    visitors,
    pageViews,
    suppliers,
    designers,
    requests,
    signupVisitors,
    passportViewers,
    requesters,
    visitorToSignup: visitors ? signupVisitors / visitors : 0,
    viewToRequest: passportViewers ? requesters / passportViewers : 0,
    perMaterial,
    ctas,
  };
}

/**
 * Optional: forward every submission to an external endpoint (Google Apps
 * Script, Zapier, Make, Slack…) so data survives on hosts without a
 * persistent disk. Failure never blocks the user.
 */
export async function forwardSubmission(body: Record<string, unknown>) {
  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error("[remade] webhook forward failed", err);
  }
}
