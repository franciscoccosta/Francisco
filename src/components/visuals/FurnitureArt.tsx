"use client";

import { useState } from "react";
import { MATERIAL_VISUALS, type MaterialVisual, type Swatch } from "./materialVisuals";

type Family = "table" | "chair" | "bench" | "shelf" | "cabinet" | "stool" | "console" | "armchair" | "planter" | "small" | "bed";

const FAMILY_BY_CATEGORY: Record<string, Family> = {
  "coffee-table": "table",
  "side-table": "table",
  "tv-unit": "cabinet",
  "living-sideboard": "cabinet",
  bookshelf: "shelf",
  "shelving-unit": "shelf",
  console: "console",
  armchair: "armchair",
  "living-chair": "chair",
  "living-stool": "stool",
  "living-bench": "bench",
  "dining-table": "table",
  "dining-chair": "chair",
  "dining-bench": "bench",
  "bar-stool": "stool",
  "dining-sideboard": "cabinet",
  "serving-table": "table",
  "bedside-table": "table",
  "bed-frame": "bed",
  "bedroom-bench": "bench",
  "dressing-table": "cabinet",
  "storage-unit": "cabinet",
  desk: "table",
  "work-table": "table",
  "office-shelf": "shelf",
  bookcase: "shelf",
  "desk-organiser": "small",
  "office-chair": "chair",
  "meeting-table": "table",
  "outdoor-table": "table",
  "outdoor-bench": "bench",
  "outdoor-chair": "chair",
  planter: "planter",
  "small-outdoor": "bench",
  "wall-shelf": "shelf",
  "floating-shelf": "shelf",
  "small-table": "table",
  "small-stool": "stool",
  "display-stand": "small",
  "decorative-object": "small",
};

/** Fill a shape with the material's base tone, then overlay the same shape
 *  with the procedurally-lit/mottled grain, clipped to it via the filter's
 *  own feComposite-in-SourceGraphic step — so any path reads as "made of"
 *  the source material, not just a flat colour. */
function Surface({ d, visual, opacity = 1 }: { d: string; visual: MaterialVisual; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <path d={d} fill={visual.base} />
      <path d={d} fill="#ffffff" filter={visual.filter} style={{ mixBlendMode: visual.blend }} opacity={visual.opacity} />
    </g>
  );
}

function SurfaceRect({ x, y, w, h, rx = 0, visual, opacity = 1 }: { x: number; y: number; w: number; h: number; rx?: number; visual: MaterialVisual; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={visual.base} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="#ffffff" filter={visual.filter} style={{ mixBlendMode: visual.blend }} opacity={visual.opacity} />
    </g>
  );
}

function Leg({ x, y, w, h, visual, rx = 0.6 }: { x: number; y: number; w: number; h: number; visual: MaterialVisual; rx?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={visual.dark} />
      <rect x={x} y={y} width={Math.max(0.9, w * 0.32)} height={h} rx={rx} fill={visual.light} opacity={0.3} />
    </g>
  );
}

function Ground({ cx, y, rx }: { cx: number; y: number; rx: number }) {
  return <ellipse cx={cx} cy={y} rx={rx} ry={Math.max(2.5, rx * 0.13)} fill="#000000" opacity="0.15" filter="url(#mat-shadow-blur)" />;
}

function TopSliver({ x1, x2, y, lift, visual }: { x1: number; x2: number; y: number; lift: number; visual: MaterialVisual }) {
  const d = `M${x1} ${y} L${x2} ${y} L${x2 - lift} ${y - lift} L${x1 + lift} ${y - lift} Z`;
  return <path d={d} fill={visual.light} opacity="0.4" />;
}

function Table({ visual, top = 46, legTop = 56, legBottom = 116, span = [42, 158] }: { visual: MaterialVisual; top?: number; legTop?: number; legBottom?: number; span?: [number, number] }) {
  const [x1, x2] = span;
  const inset = 8;
  return (
    <g>
      <Ground cx={100} y={124} rx={64} />
      <Leg x={x1 + inset} y={legTop - 4} w={5.5} h={legBottom - legTop + 4} visual={visual} />
      <Leg x={x2 - inset - 5.5} y={legTop - 4} w={5.5} h={legBottom - legTop + 4} visual={visual} />
      <Surface d={`M${x1} ${top} L${x2} ${top} L${x2} ${top + 10} L${x1} ${top + 10} Z`} visual={visual} />
      <TopSliver x1={x1 + 2} x2={x2 - 2} y={top} lift={7} visual={visual} />
    </g>
  );
}

function Chair({ visual, seatY = 66, seatH = 62 }: { visual: MaterialVisual; seatY?: number; seatH?: number }) {
  return (
    <g>
      <Ground cx={100} y={124} rx={38} />
      <Leg x={70} y={seatY + 8} w={5} h={seatY + seatH - (seatY + 8)} visual={visual} />
      <Leg x={125} y={seatY + 8} w={5} h={seatY + seatH - (seatY + 8)} visual={visual} />
      <Leg x={70} y={24} w={5} h={seatY - 24 + 8} visual={visual} />
      <Leg x={125} y={24} w={5} h={seatY - 24 + 8} visual={visual} />
      {[32, 44].map((y) => (
        <rect key={y} x={72} y={y} width={56} height={5} rx={1.5} fill={visual.dark} opacity={0.85} />
      ))}
      <Surface d={`M66 ${seatY} L134 ${seatY} L134 ${seatY + 8} L66 ${seatY + 8} Z`} visual={visual} />
      <TopSliver x1={68} x2={132} y={seatY} lift={5} visual={visual} />
    </g>
  );
}

function Bench({ visual, len = [26, 174] }: { visual: MaterialVisual; len?: [number, number] }) {
  const [x1, x2] = len;
  return (
    <g>
      <Ground cx={100} y={122} rx={70} />
      <Leg x={x1 + 10} y={62} w={5.5} h={42} visual={visual} />
      <Leg x={x2 - 10 - 5.5} y={62} w={5.5} h={42} visual={visual} />
      <Surface d={`M${x1} 54 L${x2} 54 L${x2} 64 L${x1} 64 Z`} visual={visual} />
      <TopSliver x1={x1 + 2} x2={x2 - 2} y={54} lift={5} visual={visual} />
    </g>
  );
}

function Shelf({ visual }: { visual: MaterialVisual }) {
  const shelves = [26, 54, 82, 110];
  return (
    <g>
      <rect x={38} y={22} width={7} height={100} fill={visual.dark} />
      <rect x={155} y={22} width={7} height={100} fill={visual.dark} />
      {shelves.map((y) => (
        <Surface key={y} d={`M38 ${y} L162 ${y} L162 ${y + 6.5} L38 ${y + 6.5} Z`} visual={visual} />
      ))}
      <Ground cx={100} y={126} rx={58} />
    </g>
  );
}

function Cabinet({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={122} rx={58} />
      <Surface d="M36 30 L164 30 L164 112 L36 112 Z" visual={visual} />
      <TopSliver x1={38} x2={162} y={30} lift={6} visual={visual} />
      <rect x={99.3} y={30} width={1.4} height={82} fill={visual.dark} opacity={0.7} />
      <circle cx={92} cy={70} r={2} fill={visual.dark} />
      <circle cx={108} cy={70} r={2} fill={visual.dark} />
      <rect x={36} y={108} width={128} height={6} fill={visual.dark} opacity={0.85} />
    </g>
  );
}

function Stool({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={122} rx={40} />
      <Leg x={68} y={62} w={5} h={54} visual={visual} />
      <Leg x={127} y={62} w={5} h={54} visual={visual} />
      <rect x={70} y={92} width={60} height={4} fill={visual.dark} opacity={0.7} />
      <Surface d="M62 52 Q100 40 138 52 L138 64 Q100 74 62 64 Z" visual={visual} />
    </g>
  );
}

function Console({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={116} rx={62} />
      <Leg x={34} y={56} w={5} h={44} visual={visual} />
      <Leg x={161} y={56} w={5} h={44} visual={visual} />
      <Surface d="M24 46 L176 46 L176 56 L24 56 Z" visual={visual} />
      <TopSliver x1={26} x2={174} y={46} lift={5} visual={visual} />
      <rect x={40} y={78} width={120} height={2} fill={visual.dark} opacity={0.55} />
    </g>
  );
}

function Armchair({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={124} rx={52} />
      <SurfaceRect x={64} y={18} w={72} h={48} rx={10} visual={visual} />
      <SurfaceRect x={36} y={44} w={24} h={50} rx={8} visual={visual} opacity={0.96} />
      <SurfaceRect x={140} y={44} w={24} h={50} rx={8} visual={visual} opacity={0.96} />
      <SurfaceRect x={46} y={80} w={108} h={18} rx={3} visual={visual} />
      <Leg x={48} y={98} w={6} h={18} visual={visual} />
      <Leg x={146} y={98} w={6} h={18} visual={visual} />
    </g>
  );
}

function Planter({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={116} rx={44} />
      <Surface d="M52 36 L148 36 L136 108 L64 108 Z" visual={visual} />
      <path d="M58 36 Q100 24 142 36" fill="none" stroke={visual.light} strokeWidth="1.4" opacity="0.6" />
      <path d="M62 44 L138 44" stroke={visual.dark} strokeWidth="1.2" opacity="0.4" />
    </g>
  );
}

function Small({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={110} rx={34} />
      <Surface d="M74 78 L126 78 L120 104 L80 104 Z" visual={visual} />
      <circle cx={100} cy={54} r={26} fill={visual.base} />
      <circle cx={100} cy={54} r={26} fill="#ffffff" filter={visual.filter} style={{ mixBlendMode: visual.blend }} opacity={visual.opacity} />
      <path d="M89 54 l8 9 16 -20" fill="none" stroke={visual.dark} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </g>
  );
}

function Bed({ visual }: { visual: MaterialVisual }) {
  return (
    <g>
      <Ground cx={100} y={126} rx={70} />
      <SurfaceRect x={30} y={26} w={22} h={72} rx={4} visual={visual} />
      <TopSliver x1={32} x2={50} y={26} lift={5} visual={visual} />
      <SurfaceRect x={30} y={64} w={142} h={24} rx={3} visual={visual} opacity={0.95} />
      <TopSliver x1={32} x2={170} y={64} lift={6} visual={visual} />
      <Leg x={32} y={98} w={6} h={16} visual={visual} />
      <Leg x={164} y={88} w={6} h={26} visual={visual} />
    </g>
  );
}

const RENDERERS: Record<Family, (p: { visual: MaterialVisual }) => React.ReactElement> = {
  table: Table,
  chair: Chair,
  bench: Bench,
  shelf: Shelf,
  cabinet: Cabinet,
  stool: Stool,
  console: Console,
  armchair: Armchair,
  planter: Planter,
  small: Small,
  bed: Bed,
};

export function FurnitureArt({
  categoryId,
  materialSwatch = "oak",
  className = "",
  background = "#EAE2D2",
  photoSrc,
}: {
  categoryId: string;
  materialSwatch?: Swatch;
  className?: string;
  background?: string;
  photoSrc?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const family = FAMILY_BY_CATEGORY[categoryId] ?? "table";
  const Renderer = RENDERERS[family];
  const visual = MATERIAL_VISUALS[materialSwatch];

  if (photoSrc && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoSrc} alt="" className={`object-cover ${className}`} onError={() => setImgFailed(true)} />
    );
  }

  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid meet" className={className} role="img" aria-label="Finished furniture piece">
      <rect width="200" height="140" fill={background} />
      <Renderer visual={visual} />
    </svg>
  );
}
