import type { ReactNode } from "react";

type Tone = "ember" | "charcoal" | "moss" | "good" | "warn" | "bad" | "info" | "outline";

const tones: Record<Tone, string> = {
  ember: "bg-ember text-paper",
  charcoal: "bg-charcoal text-paper",
  moss: "bg-moss text-paper",
  good: "bg-good/15 text-good",
  warn: "bg-warn/15 text-warn",
  bad: "bg-bad/15 text-bad",
  info: "bg-info/15 text-info",
  outline: "border border-charcoal/20 text-ink-soft",
};

export function Badge({ children, tone = "outline", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[2px] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
