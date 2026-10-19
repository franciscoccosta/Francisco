import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Logótipo do clube. Quando o ficheiro `public/logo.png` existir, é usado
 * automaticamente; até lá aparece uma marca provisória em texto.
 */
const HAS_LOGO = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

export function Logo({ light = false, size = 44 }: { light?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {HAS_LOGO ? (
        <Image src="/logo.png" alt="" width={size} height={size} className="h-auto w-auto object-contain" style={{ maxHeight: size }} priority />
      ) : (
        <span
          aria-hidden
          className="grid shrink-0 place-items-center rounded-full bg-yellow font-display text-lg font-extrabold text-navy"
          style={{ width: size * 0.82, height: size * 0.82 }}
        >
          C
        </span>
      )}
      <span className={`flex flex-col font-display leading-none font-extrabold uppercase ${light ? "text-white" : "text-navy"}`}>
        <span className="text-[1.15rem] tracking-wide">Camões</span>
        <span className={`text-[0.72rem] tracking-[0.28em] ${light ? "text-yellow" : "text-blue"}`}>Andebol</span>
      </span>
    </span>
  );
}
