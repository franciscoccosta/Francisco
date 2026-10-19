import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Logótipo do clube. Quando existir `public/logo.png` (logótipo oficial), é usado
 * automaticamente; até lá, o símbolo do Camões Andebol é desenhado em vetor
 * (redesenhado a partir do símbolo das camisolas) com o nome ao lado.
 */
const HAS_LOGO = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

export function Symbol({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="250 0 830 620" className={className} aria-hidden fill={color}>
      <ellipse cx="548" cy="78" rx="92" ry="76" />
      <ellipse cx="808" cy="298" rx="117" ry="107" />
      <path d="M484 156 L528 184 L466 316 L1068 566 L1064 612 L262 360 Z" />
    </svg>
  );
}

export function Logo({ light = false, size = 44 }: { light?: boolean; size?: number }) {
  if (HAS_LOGO) {
    return <Image src="/logo.png" alt="Camões Andebol" width={size * 2} height={size} className="h-auto w-auto object-contain" style={{ maxHeight: size }} priority />;
  }
  return (
    <span className="inline-flex items-center gap-2.5">
      <span style={{ width: size * 0.95 }} className="inline-block shrink-0"><Symbol className="h-auto w-full" color={light ? "#F7C600" : "#13294F"} /></span>
      <span className={`flex flex-col font-display leading-none font-extrabold uppercase ${light ? "text-white" : "text-navy"}`}>
        <span className="text-[1.15rem] tracking-wide">Camões</span>
        <span className={`text-[0.72rem] tracking-[0.28em] ${light ? "text-yellow" : "text-blue"}`}>Andebol</span>
      </span>
    </span>
  );
}
