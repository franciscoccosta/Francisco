import type { MaterialType } from "@/lib/i18n/materials";

type Swatch = MaterialType["swatch"];

const PALETTES: Record<Swatch, { base: string; grain: string; accent: string }> = {
  oak: { base: "#B98A5C", grain: "#8C5C34", accent: "#E6C79C" },
  pine: { base: "#D9B989", grain: "#A9814F", accent: "#F0DBB4" },
  "mixed-timber": { base: "#C7A374", grain: "#7C5A38", accent: "#E3C6A0" },
  beam: { base: "#9C7245", grain: "#5E3F22", accent: "#C79A66" },
  tile: { base: "#C9AE8C", grain: "#7A5A3A", accent: "#3E6E63" },
  brick: { base: "#A85B41", grain: "#6F3623", accent: "#D68F6D" },
  metal: { base: "#8A8D91", grain: "#4B4E52", accent: "#C4C7CB" },
  stone: { base: "#D6CFC2", grain: "#A79C89", accent: "#EFE9DD" },
};

function WoodGrain({ base, grain }: { base: string; grain: string }) {
  const planks = 6;
  return (
    <g>
      <rect width="200" height="140" fill={base} />
      {Array.from({ length: planks }).map((_, i) => (
        <g key={i}>
          <line x1="0" y1={(140 / planks) * (i + 1)} x2="200" y2={(140 / planks) * (i + 1)} stroke={grain} strokeWidth="1" opacity="0.35" />
          <path
            d={`M0 ${8 + i * (140 / planks)} Q 50 ${2 + i * (140 / planks)} 100 ${9 + i * (140 / planks)} T 200 ${6 + i * (140 / planks)}`}
            stroke={grain}
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
        </g>
      ))}
    </g>
  );
}

function TileGrain({ base, grain, accent }: { base: string; grain: string; accent: string }) {
  const cols = 5;
  const rows = 4;
  const cw = 200 / cols;
  const ch = 140 / rows;
  return (
    <g>
      <rect width="200" height="140" fill={base} />
      {Array.from({ length: cols * rows }).map((_, i) => {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        return (
          <g key={i}>
            <rect x={x} y={y} width={cw} height={ch} fill="none" stroke={grain} strokeWidth="1" opacity="0.5" />
            <circle cx={x + cw / 2} cy={y + ch / 2} r={cw / 3.4} fill="none" stroke={accent} strokeWidth="1.4" opacity="0.6" />
          </g>
        );
      })}
    </g>
  );
}

function BrickGrain({ base, grain }: { base: string; grain: string }) {
  const rows = 6;
  const rh = 140 / rows;
  return (
    <g>
      <rect width="200" height="140" fill={base} />
      {Array.from({ length: rows }).map((_, r) => {
        const offset = r % 2 === 0 ? 0 : 20;
        const bw = 40;
        return (
          <g key={r}>
            {Array.from({ length: 7 }).map((_, c) => (
              <rect
                key={c}
                x={c * bw - offset}
                y={r * rh}
                width={bw - 3}
                height={rh - 3}
                fill="none"
                stroke={grain}
                strokeWidth="1"
                opacity="0.45"
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

function MetalGrain({ base, grain, accent }: { base: string; grain: string; accent: string }) {
  return (
    <g>
      <rect width="200" height="140" fill={base} />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="140" stroke={grain} strokeWidth="0.6" opacity="0.3" />
      ))}
      <rect x="20" y="30" width="160" height="10" fill={accent} opacity="0.5" />
      <rect x="20" y="95" width="100" height="10" fill={accent} opacity="0.4" />
    </g>
  );
}

function StoneGrain({ base, grain, accent }: { base: string; grain: string; accent: string }) {
  return (
    <g>
      <rect width="200" height="140" fill={base} />
      <path d="M0 40 Q 40 20 80 45 T 160 35 T 200 50" stroke={grain} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M0 90 Q 60 70 110 95 T 200 85" stroke={grain} strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M30 0 Q 40 60 20 140" stroke={accent} strokeWidth="1" fill="none" opacity="0.5" />
    </g>
  );
}

export function MaterialSwatch({ swatch, className = "" }: { swatch: Swatch; className?: string }) {
  const p = PALETTES[swatch];
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Original material">
      {swatch === "tile" && <TileGrain {...p} />}
      {swatch === "brick" && <BrickGrain {...p} />}
      {swatch === "metal" && <MetalGrain {...p} />}
      {swatch === "stone" && <StoneGrain {...p} />}
      {(swatch === "oak" || swatch === "pine" || swatch === "mixed-timber" || swatch === "beam") && <WoodGrain {...p} />}
      <rect width="200" height="140" fill="black" opacity="0.03" />
    </svg>
  );
}
