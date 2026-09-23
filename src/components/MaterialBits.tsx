import { statusLabel, type Status } from "@/lib/materials";

const STATUS_STYLE: Record<Status, string> = {
  available: "bg-moss-dark text-cream",
  "coming-soon": "bg-oak text-cream",
  reserved: "bg-bark text-cream",
  potential: "bg-cream text-charcoal border border-line",
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] uppercase ${STATUS_STYLE[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {statusLabel(status)}
    </span>
  );
}

/** Shown on every listing: nothing in the prototype catalogue is held by ReMade. */
export function PrototypeLabel({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[0.62rem] leading-relaxed tracking-[0.12em] text-walnut uppercase ${className}`}>
      Prototype material — potential recovery source
    </p>
  );
}
