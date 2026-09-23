"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export function Gallery({ images, alt, materialId }: { images: string[]; alt: string; materialId: string }) {
  const [i, setI] = useState(0);

  // Counts one passport view per page load (the denominator for view → request).
  useEffect(() => {
    track("material_view", { materialId });
  }, [materialId]);

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_220px]">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink md:aspect-auto md:h-[min(72svh,720px)]">
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — view ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="(min-width: 768px) 75vw, 100vw"
            className={`object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <p className="absolute bottom-3 left-4 rounded-sm bg-ink/55 px-2 py-1 text-[0.65rem] text-cream/85 backdrop-blur-sm">
          Illustrative render — photography of verified material will replace it
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Show view ${idx + 1}`}
            aria-current={idx === i}
            className={`relative aspect-[4/3] overflow-hidden transition-opacity md:aspect-auto ${idx === i ? "ring-2 ring-wood ring-offset-2 ring-offset-cream" : "opacity-60 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="220px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
