import type { LocalizedLabel } from "./categories";
import type { Locale } from "./locales";

export interface MaterialType {
  id: string;
  label: LocalizedLabel;
  swatch: "oak" | "pine" | "mixed-timber" | "beam" | "tile" | "brick" | "metal" | "stone";
}

export const MATERIAL_TYPES: MaterialType[] = [
  { id: "oak-timber", swatch: "oak", label: { pt: "Madeira de carvalho recuperada", en: "Recovered oak timber", es: "Madera de roble recuperada", fr: "Bois de chêne récupéré", de: "Gerettetes Eichenholz", no: "Gjenvunnet eiketre" } },
  { id: "pine-boards", swatch: "pine", label: { pt: "Tábuas de pinho de obra", en: "Construction pine boards", es: "Tablas de pino de obra", fr: "Planches de pin de chantier", de: "Kiefernbretter von der Baustelle", no: "Furubord fra byggeplass" } },
  { id: "mixed-timber", swatch: "mixed-timber", label: { pt: "Madeira mista de excedente", en: "Mixed surplus timber", es: "Madera mixta sobrante", fr: "Bois mixte excédentaire", de: "Gemischtes Restholz", no: "Blandet overskuddstre" } },
  { id: "construction-beam", swatch: "beam", label: { pt: "Viga de construção", en: "Construction beam", es: "Viga de construcción", fr: "Poutre de construction", de: "Baubalken", no: "Byggebjelke" } },
  { id: "ceramic-tile", swatch: "tile", label: { pt: "Azulejo cerâmico excedente", en: "Surplus ceramic tile", es: "Baldosa cerámica sobrante", fr: "Carrelage céramique excédentaire", de: "Überschüssige Keramikfliese", no: "Overskudds keramisk flis" } },
  { id: "reclaimed-brick", swatch: "brick", label: { pt: "Tijolo recuperado", en: "Reclaimed brick", es: "Ladrillo recuperado", fr: "Brique récupérée", de: "Gerettete Ziegel", no: "Gjenvunnet murstein" } },
  { id: "metal-offcut", swatch: "metal", label: { pt: "Retalho metálico", en: "Metal offcut", es: "Recorte metálico", fr: "Chute métallique", de: "Metallabschnitt", no: "Metallrest" } },
  { id: "natural-stone", swatch: "stone", label: { pt: "Pedra natural excedente", en: "Surplus natural stone", es: "Piedra natural sobrante", fr: "Pierre naturelle excédentaire", de: "Überschüssiger Naturstein", no: "Overskudds naturstein" } },
];

export function materialLabel(id: string, locale: Locale): string {
  const m = MATERIAL_TYPES.find((mm) => mm.id === id);
  return m ? m.label[locale] : id;
}

export function materialSwatch(id: string) {
  const m = MATERIAL_TYPES.find((mm) => mm.id === id);
  return m ? m.swatch : "mixed-timber";
}
