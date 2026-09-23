import type { LocalizedLabel } from "./categories";
import type { Locale } from "./locales";

export interface MaterialType {
  id: string;
  label: LocalizedLabel;
  swatch: "oak" | "pine" | "mixed-timber" | "beam" | "tile" | "brick" | "metal" | "stone";
}

export const MATERIAL_TYPES: MaterialType[] = [
  { id: "oak-timber", swatch: "oak", label: { pt: "Madeira de carvalho recuperada", en: "Recovered oak timber" } },
  { id: "pine-boards", swatch: "pine", label: { pt: "Tábuas de pinho de obra", en: "Construction pine boards" } },
  { id: "mixed-timber", swatch: "mixed-timber", label: { pt: "Madeira mista de excedente", en: "Mixed surplus timber" } },
  { id: "construction-beam", swatch: "beam", label: { pt: "Viga de construção", en: "Construction beam" } },
  { id: "ceramic-tile", swatch: "tile", label: { pt: "Azulejo cerâmico excedente", en: "Surplus ceramic tile" } },
  { id: "reclaimed-brick", swatch: "brick", label: { pt: "Tijolo recuperado", en: "Reclaimed brick" } },
  { id: "metal-offcut", swatch: "metal", label: { pt: "Retalho metálico", en: "Metal offcut" } },
  { id: "natural-stone", swatch: "stone", label: { pt: "Pedra natural excedente", en: "Surplus natural stone" } },
];

export function materialLabel(id: string, locale: Locale): string {
  const m = MATERIAL_TYPES.find((mm) => mm.id === id);
  return m ? m.label[locale] : id;
}

export function materialSwatch(id: string) {
  const m = MATERIAL_TYPES.find((mm) => mm.id === id);
  return m ? m.swatch : "mixed-timber";
}
