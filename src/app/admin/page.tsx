import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { getMetrics, listSubmissions, type SubmissionRow, type SubmissionType } from "@/lib/db";
import { PREMIUM_OPTIONS, PRIORITIES } from "@/lib/forms";
import { MATERIALS } from "@/lib/materials";

export const metadata: Metadata = { title: "Validation metrics", robots: { index: false, follow: false } };

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

type Payload = Record<string, string | string[] | undefined>;
const parse = (r: SubmissionRow) => JSON.parse(r.payload) as Payload;

function tally(rows: Payload[], key: string, known: string[] = []) {
  const counts = new Map<string, number>(known.map((k) => [k, 0]));
  for (const p of rows) {
    const v = p[key];
    for (const item of Array.isArray(v) ? v : v ? [v] : []) counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { key } = await searchParams;
  const k = typeof key === "string" ? key : undefined;

  if (!isAdmin(k)) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32">
        <h1 className="display text-5xl">Restricted</h1>
        <p className="mt-4 text-ink-soft">
          Open this page as <code className="font-mono text-sm">/admin?key=…</code> using the <code className="font-mono text-sm">ADMIN_KEY</code>{" "}
          configured on the server.
        </p>
      </div>
    );
  }

  const m = getMetrics();
  const designers = listSubmissions("designer");
  const suppliers = listSubmissions("supplier");
  const requests = listSubmissions("material_request");
  const dp = designers.map(parse);
  const keyParam = k ? `&key=${encodeURIComponent(k)}` : "";

  const kpis: [string, string, string][] = [
    ["Visitors", String(m.visitors), `${m.pageViews} page views`],
    ["Builder submissions", String(m.suppliers), "“I have wood to offer”"],
    ["Designer sign-ups", String(m.designers), "“I’m looking for wood”"],
    ["Material requests", String(m.requests), "“I’m interested in this material”"],
    ["Visitor → sign-up", pct(m.visitorToSignup), `${m.signupVisitors} of ${m.visitors} visitors`],
    ["Passport view → request", pct(m.viewToRequest), `${m.requesters} of ${m.passportViewers} passport viewers`],
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-5 py-12 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link href="/" className="eyebrow text-wood">ReMade</Link>
          <h1 className="display mt-2 text-5xl">Validation metrics</h1>
        </div>
        <p className="text-sm text-ink-mute">Anonymous visitor ids · bots excluded · live from the database</p>
      </div>

      <section className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map(([label, value, sub]) => (
          <div key={label} className="bg-paper p-6">
            <p className="eyebrow text-ink-mute">{label}</p>
            <p className="display mt-3 text-5xl">{value}</p>
            <p className="mt-1 text-sm text-ink-soft">{sub}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-3">
        <Tally title="Would pay a premium for provenance?" rows={tally(dp, "premium", PREMIUM_OPTIONS)} total={dp.length} />
        <Tally title="What matters most (designers)" rows={tally(dp, "priorities", PRIORITIES)} total={dp.length} />
        <Tally title="Wood types wanted (designers)" rows={tally(dp, "woodType")} total={dp.length} />
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="display text-3xl">Per material</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-mute">
                <th className="py-2 font-medium">Material</th>
                <th className="py-2 text-right font-medium">Viewers</th>
                <th className="py-2 text-right font-medium">Requests</th>
              </tr>
            </thead>
            <tbody>
              {MATERIALS.map((mat) => {
                const row = m.perMaterial.find((r) => r.id === mat.id);
                const req = requests.filter((r) => r.material_id === mat.id).length;
                return (
                  <tr key={mat.id} className="border-b border-line/60">
                    <td className="py-2">
                      <span className="font-mono text-xs">{mat.id}</span> {mat.material}
                    </td>
                    <td className="py-2 text-right tabular-nums">{row?.viewers ?? 0}</td>
                    <td className="py-2 text-right tabular-nums">{req}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="display text-3xl">CTA clicks</h2>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {m.ctas.length ? (
                m.ctas.map((c) => (
                  <tr key={c.cta} className="border-b border-line/60">
                    <td className="py-2 font-mono text-xs">{c.cta}</td>
                    <td className="py-2 text-right tabular-nums">{c.n}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 text-ink-mute">No clicks yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Submissions title="Builder submissions" type="supplier" rows={suppliers} keyParam={keyParam} />
      <Submissions title="Designer sign-ups" type="designer" rows={designers} keyParam={keyParam} />
      <Submissions title="Material requests" type="material_request" rows={requests} keyParam={keyParam} />
    </div>
  );
}

function Tally({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <div className="bg-paper p-6 ring-1 ring-line">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-ink-mute">{total} responses</p>
      <table className="mt-4 w-full text-sm">
        <tbody>
          {rows.length ? (
            rows.map(([label, n]) => (
              <tr key={label} className="border-b border-line/60">
                <td className="py-1.5">{label}</td>
                <td className="py-1.5 text-right tabular-nums">{n}</td>
                <td className="w-16 py-1.5 text-right tabular-nums text-ink-mute">{total ? pct(n / total) : "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-1.5 text-ink-mute">No responses yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Submissions({ title, type, rows, keyParam }: { title: string; type: SubmissionType; rows: SubmissionRow[]; keyParam: string }) {
  const parsed = rows.map((r) => ({ r, p: parse(r) }));
  const columns = Array.from(new Set(parsed.flatMap(({ p }) => Object.keys(p)))).filter((c) => c !== "source");

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between border-b border-line pb-3">
        <h2 className="display text-3xl">
          {title} <span className="text-ink-mute">({rows.length})</span>
        </h2>
        <a href={`/api/admin/export?type=${type}${keyParam}`} className="text-sm font-semibold underline underline-offset-4">
          Download CSV
        </a>
      </div>
      {rows.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-line text-ink-mute">
                <th className="py-2 pr-4 font-medium">Date</th>
                {columns.map((c) => (
                  <th key={c} className="py-2 pr-4 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsed.map(({ r, p }) => (
                <tr key={r.id} className="border-b border-line/60 align-top">
                  <td className="whitespace-nowrap py-2 pr-4 tabular-nums">{r.created_at.slice(0, 16).replace("T", " ")}</td>
                  {columns.map((c) => (
                    <td key={c} className="max-w-[240px] py-2 pr-4">
                      {Array.isArray(p[c]) ? (p[c] as string[]).join(", ") : (p[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink-mute">None yet.</p>
      )}
    </section>
  );
}
