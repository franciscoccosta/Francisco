"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/fotos/jovens-1.jpg", alt: "Jovens atletas do Camões Andebol de braços no ar, sentados numa escadaria", position: "50% 50%" },
  { src: "/fotos/jovens-2.jpg", alt: "Equipa do Camões Andebol de amarelo no pavilhão", position: "50% 45%" },
  { src: "/fotos/jovens-3.jpg", alt: "Jovens atletas do Camões Andebol com a bandeira do clube num torneio", position: "50% 55%" },
  { src: "/fotos/jovens-4.jpg", alt: "Jovens atletas do Camões Andebol de equipamento azul-escuro e boné do clube", position: "50% 55%" },
  { src: "/fotos/jovens-5.jpg", alt: "Jovens atletas do Camões Andebol a festejar à mesa depois de um torneio", position: "50% 50%" },
];

const INTERVAL = 5000;

/** Banner da página inicial: fotografias dos jovens atletas, a passar sozinhas. */
export function HeroSlideshow() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white/5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, k) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          priority={k === 0}
          sizes="(min-width: 768px) 46vw, 92vw"
          style={{ objectPosition: s.position }}
          className={`object-cover transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}
          aria-hidden={k !== i}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-deep/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {SLIDES.map((s, k) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Fotografia ${k + 1} de ${SLIDES.length}`}
            aria-current={k === i}
            className={`h-2.5 rounded-full transition-all ${k === i ? "w-7 bg-yellow" : "w-2.5 bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
