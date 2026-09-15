"use client";

import { useState } from "react";
import type { MaterialType } from "@/lib/i18n/materials";

type Swatch = MaterialType["swatch"];

// Integer-only hash (no transcendental math) so server and client render
// identical values — Math.sin can differ in its last bits between Node's
// and the browser's V8 build, which breaks hydration.
function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

const WOOD_PALETTES: Record<string, { base: string; light: string; dark: string; knot?: boolean }> = {
  oak: { base: "#9c7248", light: "#b98a5c", dark: "#6f4f2e", knot: true },
  pine: { base: "#c6a06a", light: "#dab881", dark: "#93713f" },
  "mixed-timber": { base: "#a3805a", light: "#c3a074", dark: "#6b4c2c" },
  beam: { base: "#7a5330", light: "#93683f", dark: "#4f341c" },
};

function WoodSurface({ swatch }: { swatch: string }) {
  const p = WOOD_PALETTES[swatch] ?? WOOD_PALETTES.oak;
  const planks = swatch === "mixed-timber" ? 5 : 4;
  const ph = 140 / planks;
  return (
    <g>
      <rect width="200" height="140" fill={p.base} />
      {swatch === "mixed-timber" &&
        Array.from({ length: planks }).map((_, i) => {
          const tone = hash(i + 1) > 0.5 ? p.light : p.dark;
          return <rect key={i} y={i * ph} width="200" height={ph} fill={tone} opacity={0.35} />;
        })}
      <rect width="200" height="140" fill="#ffffff" filter="url(#mat-fiber-lit)" style={{ mixBlendMode: "multiply" }} opacity={0.8} />
      {Array.from({ length: planks - 1 }).map((_, i) => (
        <g key={i}>
          <line x1="0" y1={(i + 1) * ph} x2="200" y2={(i + 1) * ph} stroke={p.dark} strokeWidth="1.4" opacity="0.55" />
          <line x1="0" y1={(i + 1) * ph + 1.4} x2="200" y2={(i + 1) * ph + 1.4} stroke="#ffffff" strokeWidth="0.6" opacity="0.25" />
        </g>
      ))}
      {p.knot && (
        <g transform={`translate(${138 + hash(3) * 20} ${38 + hash(4) * 60})`} opacity="0.55">
          <ellipse rx="7" ry="5" fill={p.dark} />
          <ellipse rx="4.2" ry="3" fill={p.base} />
          <ellipse rx="1.6" ry="1.1" fill={p.dark} />
        </g>
      )}
      <rect width="200" height="140" fill="url(#mat-sheen)" style={{ mixBlendMode: "soft-light" }} />
      <rect width="200" height="140" fill="url(#mat-vignette)" />
    </g>
  );
}

function TileSurface() {
  const cols = 5;
  const rows = 4;
  const cw = 200 / cols;
  const ch = 140 / rows;
  return (
    <g>
      <rect width="200" height="140" fill="#6f6252" />
      {Array.from({ length: cols * rows }).map((_, i) => {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        const j = hash(i) - 0.5;
        const l = Math.max(0, Math.min(1, 0.5 + j * 0.35));
        const tone = `hsl(32, 32%, ${38 + l * 26}%)`;
        return (
          <g key={i}>
            <rect x={x + 1.2} y={y + 1.2} width={cw - 2.4} height={ch - 2.4} fill={tone} />
            <ellipse cx={x + cw * 0.32} cy={y + ch * 0.3} rx={cw * 0.38} ry={ch * 0.3} fill="#ffffff" opacity="0.14" />
            <circle cx={x + cw / 2} cy={y + ch / 2} r={Math.min(cw, ch) / 3.2} fill="none" stroke="#3e6e63" strokeWidth="1.1" opacity="0.45" />
          </g>
        );
      })}
      <rect width="200" height="140" fill="#ffffff" filter="url(#mat-mottle-fine)" style={{ mixBlendMode: "overlay" }} opacity={0.18} />
      <rect width="200" height="140" fill="url(#mat-sheen)" style={{ mixBlendMode: "soft-light" }} />
      <rect width="200" height="140" fill="url(#mat-vignette)" />
    </g>
  );
}

function BrickSurface() {
  const rows = 6;
  const rh = 140 / rows;
  const bw = 38;
  return (
    <g>
      <rect width="200" height="140" fill="#8c7a68" />
      {Array.from({ length: rows }).map((_, r) => {
        const offset = r % 2 === 0 ? 0 : bw / 2;
        return (
          <g key={r}>
            {Array.from({ length: 7 }).map((_, c) => {
              const idx = r * 7 + c;
              const j = hash(idx * 3.1);
              const tone = `hsl(${14 + j * 10}, ${46 + j * 10}%, ${34 + j * 14}%)`;
              return (
                <rect
                  key={c}
                  x={c * bw - offset}
                  y={r * rh}
                  width={bw - 3}
                  height={rh - 3}
                  rx="1"
                  fill={tone}
                />
              );
            })}
          </g>
        );
      })}
      <rect width="200" height="140" fill="#ffffff" filter="url(#mat-mottle-coarse)" style={{ mixBlendMode: "multiply" }} opacity={0.22} />
      <rect width="200" height="140" fill="url(#mat-sheen)" style={{ mixBlendMode: "soft-light" }} opacity={0.5} />
      <rect width="200" height="140" fill="url(#mat-vignette)" />
    </g>
  );
}

function MetalSurface() {
  return (
    <g>
      <rect width="200" height="140" fill="#787d82" />
      <rect width="200" height="140" fill="#ffffff" filter="url(#mat-brushed-lit)" style={{ mixBlendMode: "multiply" }} opacity={0.85} />
      <rect width="200" height="140" fill="url(#mat-sheen)" style={{ mixBlendMode: "screen" }} opacity={0.55} />
      <circle cx="24" cy="22" r="3.2" fill="#4b4e52" opacity="0.6" />
      <circle cx="24" cy="22" r="1.3" fill="#c4c7cb" opacity="0.8" />
      <circle cx="176" cy="118" r="3.2" fill="#4b4e52" opacity="0.6" />
      <circle cx="176" cy="118" r="1.3" fill="#c4c7cb" opacity="0.8" />
      <rect width="200" height="140" fill="url(#mat-vignette)" />
    </g>
  );
}

function StoneSurface() {
  const cracks = [
    { d: "M18 12 L64 34 L52 70 L88 96 L74 132", w: 0.9 },
    { d: "M132 8 L118 46 L150 78 L128 118 L160 136", w: 0.7 },
  ];
  return (
    <g>
      <rect width="200" height="140" fill="#ddd3ba" />
      <rect width="200" height="140" fill="#ffffff" filter="url(#mat-mottle-coarse)" style={{ mixBlendMode: "multiply" }} opacity={0.3} />
      <rect width="200" height="140" fill="#4a4030" filter="url(#mat-veins)" style={{ mixBlendMode: "multiply" }} opacity={0.38} />
      {cracks.map((c, i) => (
        <path key={i} d={c.d} fill="none" stroke="#6b5f47" strokeWidth={c.w} strokeLinecap="round" opacity={0.32} />
      ))}
      <rect width="200" height="140" fill="url(#mat-sheen)" style={{ mixBlendMode: "soft-light" }} />
      <rect width="200" height="140" fill="url(#mat-vignette)" opacity={0.8} />
    </g>
  );
}

export function MaterialSwatch({
  swatch,
  className = "",
  photoSrc,
}: {
  swatch: Swatch;
  className?: string;
  photoSrc?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (photoSrc && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoSrc}
        alt=""
        className={`object-cover ${className}`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 140"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Original material"
    >
      {swatch === "tile" && <TileSurface />}
      {swatch === "brick" && <BrickSurface />}
      {swatch === "metal" && <MetalSurface />}
      {swatch === "stone" && <StoneSurface />}
      {(swatch === "oak" || swatch === "pine" || swatch === "mixed-timber" || swatch === "beam") && <WoodSurface swatch={swatch} />}
    </svg>
  );
}
