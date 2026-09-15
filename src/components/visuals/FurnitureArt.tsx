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

function Table({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="30" y="42" width="140" height="10" rx="2" fill={accent} stroke="none" />
      <line x1="42" y1="52" x2="42" y2="110" />
      <line x1="158" y1="52" x2="158" y2="110" />
      <line x1="55" y1="52" x2="55" y2="104" opacity="0.5" />
      <line x1="145" y1="52" x2="145" y2="104" opacity="0.5" />
    </g>
  );
}

function Chair({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="65" y="60" width="70" height="8" rx="2" fill={accent} stroke="none" />
      <line x1="72" y1="68" x2="72" y2="112" />
      <line x1="128" y1="68" x2="128" y2="112" />
      <line x1="72" y1="20" x2="72" y2="60" />
      <line x1="128" y1="20" x2="128" y2="60" />
      <line x1="72" y1="30" x2="128" y2="30" opacity="0.5" />
      <line x1="72" y1="45" x2="128" y2="45" opacity="0.5" />
    </g>
  );
}

function Bench({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="25" y="55" width="150" height="9" rx="2" fill={accent} stroke="none" />
      <line x1="38" y1="64" x2="38" y2="100" />
      <line x1="162" y1="64" x2="162" y2="100" />
      <line x1="80" y1="64" x2="80" y2="96" opacity="0.5" />
      <line x1="120" y1="64" x2="120" y2="96" opacity="0.5" />
    </g>
  );
}

function Shelf({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="40" y="15" width="8" height="110" fill={accent} stroke="none" />
      <rect x="152" y="15" width="8" height="110" fill={accent} stroke="none" />
      {[30, 55, 80, 105].map((y) => (
        <line key={y} x1="40" y1={y} x2="160" y2={y} />
      ))}
    </g>
  );
}

function Cabinet({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5">
      <rect x="35" y="30" width="130" height="80" rx="3" fill={accent} fillOpacity="0.25" />
      <line x1="100" y1="30" x2="100" y2="110" />
      <circle cx="92" cy="70" r="2.2" fill={stroke} stroke="none" />
      <circle cx="108" cy="70" r="2.2" fill={stroke} stroke="none" />
    </g>
  );
}

function Stool({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <ellipse cx="100" cy="50" rx="38" ry="9" fill={accent} stroke="none" />
      <line x1="70" y1="55" x2="62" y2="112" />
      <line x1="130" y1="55" x2="138" y2="112" />
      <line x1="80" y1="90" x2="120" y2="90" opacity="0.5" />
    </g>
  );
}

function Console({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="20" y="48" width="160" height="8" rx="2" fill={accent} stroke="none" />
      <line x1="30" y1="56" x2="30" y2="100" />
      <line x1="170" y1="56" x2="170" y2="100" />
      <line x1="30" y1="78" x2="170" y2="78" opacity="0.5" />
    </g>
  );
}

function Armchair({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M45 60 v-20 a12 12 0 0 1 12 -12 h86 a12 12 0 0 1 12 12 v20" fill={accent} fillOpacity="0.3" />
      <rect x="40" y="58" width="120" height="34" rx="8" fill={accent} fillOpacity="0.25" />
      <line x1="46" y1="92" x2="46" y2="112" />
      <line x1="154" y1="92" x2="154" y2="112" />
    </g>
  );
}

function Planter({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5">
      <path d="M55 40 h90 l-10 65 h-70 z" fill={accent} fillOpacity="0.3" />
      <path d="M60 40 q40 -15 80 0" opacity="0.6" />
    </g>
  );
}

function Small({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5">
      <circle cx="100" cy="70" r="30" fill={accent} fillOpacity="0.3" />
      <path d="M85 70 l10 12 20 -24" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Bed({ stroke, accent }: { stroke: string; accent: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <rect x="30" y="25" width="14" height="65" rx="3" fill={accent} stroke="none" />
      <rect x="30" y="55" width="140" height="14" rx="3" />
      <line x1="30" y1="90" x2="30" y2="105" />
      <line x1="170" y1="69" x2="170" y2="105" />
    </g>
  );
}

const RENDERERS: Record<Family, (p: { stroke: string; accent: string }) => React.ReactElement> = {
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
  className = "",
  stroke = "#211C17",
  accent = "#B6531F",
  background = "#F7F2EA",
}: {
  categoryId: string;
  className?: string;
  stroke?: string;
  accent?: string;
  background?: string;
}) {
  const family = FAMILY_BY_CATEGORY[categoryId] ?? "table";
  const Renderer = RENDERERS[family];
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid meet" className={className} role="img" aria-label="Finished furniture piece">
      <rect width="200" height="140" fill={background} />
      <Renderer stroke={stroke} accent={accent} />
    </svg>
  );
}
