import Image from "next/image";

const PHOTOS = [
  { src: "/fotos/jovens-1.jpg", alt: "Jovens atletas do Camões Andebol de braços no ar, sentados numa escadaria" },
  { src: "/fotos/jovens-3.jpg", alt: "Jovens atletas do Camões Andebol com a bandeira do clube num torneio" },
  { src: "/fotos/jovens-2.jpg", alt: "Equipa do Camões Andebol de amarelo no pavilhão" },
  { src: "/fotos/jovens-4.jpg", alt: "Jovens atletas do Camões Andebol de equipamento azul-escuro e boné do clube" },
  { src: "/fotos/jovens-5.jpg", alt: "Jovens atletas do Camões Andebol a festejar à mesa depois de um torneio" },
];

/** Banner da página inicial: as fotografias dos jovens atletas, todas à vista (uma grande + quatro). */
export function HeroGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
      {PHOTOS.map((p, k) => (
        <div
          key={p.src}
          className={`relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 ${k === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]"}`}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority={k < 3}
            sizes={k === 0 ? "(min-width: 768px) 50vw, 92vw" : "(min-width: 768px) 25vw, 46vw"}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
