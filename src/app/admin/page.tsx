import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import { PREMIUM, PRIORITIES, WOOD_TYPES } from "@/lib/forms";
import { MATERIALS } from "@/lib/materials";
import { getMetrics, listSubmissions, type Submission } from "@/lib/store";

export const metadata: Metadata = { title: "Validation metrics", robots: { index: false, follow: false } };

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function tally(rows: Submission[], field: string, options: string[]) {
  const counts = Object.fromEntries(options.map((o) => [o, 0]));
  for (const r of rows) {
    const v = r.payload[field];
    for (const x of Array.isArray(v) ? v : [v]) if (typeof x === "string" && x in counts) counts[x]++;
  }
  return options.map((o) => ({ label: o, n: counts[o] })).sort((a, b) => b.n - a.n);
}

function Bars({ title, data, total }: { title: string; data: { label: string; n: number }[]; total: number }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[9rem_1fr_2.5rem] items-center gap-3">
            <span className="truncate">{d.label}</span>
            <span className="h-2 bg-linen">
              <span className="block h-full bg-walnut" style={{ width: total ? `${(d.n / total) * 100}%` : 0 }} />
            </span>
            <span className="text-right tabular-nums text-muted">{d.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function summary(s: Submission) {
  const p = s.payload as Record<string, string | string[]>;
  const join = (v: unknown) => (Array.isArray(v) ? v.join(", ") : (v as string) || "");
  if (s.type === "supplier") return `${p.company} · ${p.project}, ${p.location} · ${join(p.woodType)} · ${p.quantity}`;
  if (s.type === "buyer") return `${p.name}, ${p.studio} (${p.profession}) · wants ${join(p.woodType) || "—"} · premium: ${p.premium}`;
  return `${p.name}, ${p.company} → ${s.materialId?.toUpperCase()} · ${p.quantity || "qty —"}`;
}

export default async function Admin({ searchParams }: PageProps<"/admin">) {
  const key = (await searchParams).key;
  const k = typeof key === "string" ? key : null;
  if (!isAdmin(k)) {
    return (
      <section className="container-x min-h-[60vh] pt-40">
        <h1 className="display text-5xl">Not available.</h1>
        <p className="mt-4 text-muted">Open this page with ?key=… (the ADMIN_KEY environment variable).</p>
      </section>
    );
  }

  const m = getMetrics();
  const subs = listSubmissions();
  const buyers = subs.filter((s) => s.type === "buyer");
  const suppliers = subs.filter((s) => s.type === "supplier");
  const exportHref = `/api/export${k ? `?key=${encodeURIComponent(k)}` : ""}`;

  const kpis = [
    { label: "Visitors", value: m.visitors, sub: `${m.pageViews} page views` },
    { label: "Builder submissions", value: m.suppliers },
    { label: "Designer signups", value: m.buyers },
    { label: "Material requests", value: m.requests },
    { label: "Visitor → signup", value: pct(m.visitorToSignup), sub: "builders + designers" },
    { label: "Passport view → request", value: pct(m.viewToRequest), sub: "per visitor & material" },
  ];

  return (
    <div className="container-x pt-32 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Internal · not linked from the site</p>
          <h1 className="display mt-4 text-5xl md:text-6xl">Validation metrics</h1>
        </div>
        <a href={exportHref} className="btn btn-outline">
          Download submissions (CSV)
        </a>
      </div>

      <dl className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((x) => (
          <div key={x.label} className="bg-cream p-6">
            <dt className="eyebrow">{x.label}</dt>
            <dd className="display mt-4 text-5xl tabular-nums">{x.value}</dd>
            {x.sub && <dd className="mt-1 text-xs text-muted">{x.sub}</dd>}
          </div>
        ))}
      </dl>

      <section className="mt-16 grid gap-12 lg:grid-cols-3">
        <Bars title="Designers: what matters most" data={tally(buyers, "priorities", PRIORITIES)} total={buyers.length} />
        <Bars title="Designers: would pay a premium?" data={tally(buyers, "premium", PREMIUM)} total={buyers.length} />
        <div className="space-y-12">
          <Bars title="Wood designers are looking for" data={tally(buyers, "woodType", WOOD_TYPES)} total={buyers.length} />
          <Bars title="Wood builders are offering" data={tally(suppliers, "woodType", WOOD_TYPES)} total={suppliers.length} />
        </div>
      </section>

      <section className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Materials: passport viewers → requests</p>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {MATERIALS.map((mat) => {
                const row = m.perMaterial.find((r) => r.id === mat.slug);
                const requests = subs.filter((s) => s.type === "request" && s.materialId === mat.slug).length;
                return (
                  <tr key={mat.id} className="border-t border-line">
                    <td className="py-2 font-mono text-xs">{mat.id}</td>
                    <td className="py-2">{mat.project}</td>
                    <td className="py-2 text-right tabular-nums">{row?.viewers ?? 0} viewers</td>
                    <td className="py-2 text-right tabular-nums">{requests} requests</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <p className="eyebrow">CTA clicks</p>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {m.ctas.length === 0 && (
                <tr>
                  <td className="py-2 text-muted">No clicks yet.</td>
                </tr>
              )}
              {m.ctas.map((c) => (
                <tr key={c.label} className="border-t border-line">
                  <td className="py-2">{c.label}</td>
                  <td className="py-2 text-right tabular-nums">{c.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <p className="eyebrow">Latest submissions</p>
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {subs.length === 0 && <li className="py-3 text-muted">Nothing yet.</li>}
          {subs.slice(0, 50).map((s) => (
            <li key={s.id} className="grid gap-2 py-3 md:grid-cols-[10rem_7rem_1fr]">
              <span className="font-mono text-xs text-muted">{s.createdAt.slice(0, 16).replace("T", " ")}</span>
              <span className="font-mono text-xs uppercase">{s.type}</span>
              <span>
                {summary(s)} · <a className="underline" href={`mailto:${s.payload.email}`}>{String(s.payload.email)}</a>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
