export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-graphite-line bg-graphite-soft p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-2 font-display text-3xl text-paper">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-light">{hint}</p>}
    </div>
  );
}
