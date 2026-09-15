import type { Locale } from "./locales";

export type LocalizedLabel = Record<Locale, string>;

export interface CategoryItem {
  id: string;
  roomId: string;
  label: LocalizedLabel;
}

export interface Room {
  id: string;
  label: LocalizedLabel;
}

export const ROOMS: Room[] = [
  { id: "living-room", label: { pt: "Sala de estar", en: "Living room" } },
  { id: "dining", label: { pt: "Sala de jantar", en: "Dining" } },
  { id: "bedroom", label: { pt: "Quarto", en: "Bedroom" } },
  { id: "office", label: { pt: "Escritório", en: "Office" } },
  { id: "outdoor", label: { pt: "Exterior", en: "Outdoor" } },
  { id: "smaller-objects", label: { pt: "Objetos pequenos", en: "Smaller objects" } },
];

export const CATEGORY_ITEMS: CategoryItem[] = [
  // Living room
  { id: "coffee-table", roomId: "living-room", label: { pt: "Mesa de centro", en: "Coffee table" } },
  { id: "side-table", roomId: "living-room", label: { pt: "Mesa de apoio", en: "Side table" } },
  { id: "tv-unit", roomId: "living-room", label: { pt: "Móvel de TV", en: "TV unit" } },
  { id: "living-sideboard", roomId: "living-room", label: { pt: "Aparador", en: "Sideboard" } },
  { id: "bookshelf", roomId: "living-room", label: { pt: "Estante de livros", en: "Bookshelf" } },
  { id: "shelving-unit", roomId: "living-room", label: { pt: "Módulo de prateleiras", en: "Shelving unit" } },
  { id: "console", roomId: "living-room", label: { pt: "Consola", en: "Console" } },
  { id: "armchair", roomId: "living-room", label: { pt: "Poltrona", en: "Armchair" } },
  { id: "living-chair", roomId: "living-room", label: { pt: "Cadeira", en: "Chair" } },
  { id: "living-stool", roomId: "living-room", label: { pt: "Banco", en: "Stool" } },
  { id: "living-bench", roomId: "living-room", label: { pt: "Banco corrido", en: "Bench" } },
  // Dining
  { id: "dining-table", roomId: "dining", label: { pt: "Mesa de jantar", en: "Dining table" } },
  { id: "dining-chair", roomId: "dining", label: { pt: "Cadeira de jantar", en: "Dining chair" } },
  { id: "dining-bench", roomId: "dining", label: { pt: "Banco de jantar", en: "Bench" } },
  { id: "bar-stool", roomId: "dining", label: { pt: "Banco de bar", en: "Bar stool" } },
  { id: "dining-sideboard", roomId: "dining", label: { pt: "Aparador de sala de jantar", en: "Sideboard" } },
  { id: "serving-table", roomId: "dining", label: { pt: "Mesa de apoio para serviço", en: "Serving table" } },
  // Bedroom
  { id: "bedside-table", roomId: "bedroom", label: { pt: "Mesa de cabeceira", en: "Bedside table" } },
  { id: "bed-frame", roomId: "bedroom", label: { pt: "Estrutura de cama", en: "Bed frame" } },
  { id: "bedroom-bench", roomId: "bedroom", label: { pt: "Banco de quarto", en: "Bench" } },
  { id: "dressing-table", roomId: "bedroom", label: { pt: "Penteadeira", en: "Dressing table" } },
  { id: "storage-unit", roomId: "bedroom", label: { pt: "Módulo de arrumação", en: "Storage unit" } },
  // Office
  { id: "desk", roomId: "office", label: { pt: "Secretária", en: "Desk" } },
  { id: "work-table", roomId: "office", label: { pt: "Mesa de trabalho", en: "Work table" } },
  { id: "office-shelf", roomId: "office", label: { pt: "Prateleira de escritório", en: "Office shelf" } },
  { id: "bookcase", roomId: "office", label: { pt: "Estante alta", en: "Bookcase" } },
  { id: "desk-organiser", roomId: "office", label: { pt: "Organizador de secretária", en: "Desk organiser" } },
  { id: "office-chair", roomId: "office", label: { pt: "Cadeira de escritório", en: "Chair" } },
  { id: "meeting-table", roomId: "office", label: { pt: "Mesa de reunião", en: "Meeting table" } },
  // Outdoor
  { id: "outdoor-table", roomId: "outdoor", label: { pt: "Mesa de exterior", en: "Outdoor table" } },
  { id: "outdoor-bench", roomId: "outdoor", label: { pt: "Banco de exterior", en: "Outdoor bench" } },
  { id: "outdoor-chair", roomId: "outdoor", label: { pt: "Cadeira de exterior", en: "Chair" } },
  { id: "planter", roomId: "outdoor", label: { pt: "Floreira", en: "Planter" } },
  { id: "small-outdoor", roomId: "outdoor", label: { pt: "Pequeno mobiliário de exterior", en: "Small outdoor furniture" } },
  // Smaller objects
  { id: "wall-shelf", roomId: "smaller-objects", label: { pt: "Prateleira de parede", en: "Wall shelf" } },
  { id: "floating-shelf", roomId: "smaller-objects", label: { pt: "Prateleira flutuante", en: "Floating shelf" } },
  { id: "small-table", roomId: "smaller-objects", label: { pt: "Mesa pequena", en: "Small table" } },
  { id: "small-stool", roomId: "smaller-objects", label: { pt: "Banco pequeno", en: "Stool" } },
  { id: "display-stand", roomId: "smaller-objects", label: { pt: "Expositor", en: "Display stand" } },
  { id: "decorative-object", roomId: "smaller-objects", label: { pt: "Objeto decorativo", en: "Decorative object" } },
];

export function categoryLabel(id: string, locale: Locale): string {
  const item = CATEGORY_ITEMS.find((c) => c.id === id);
  return item ? item.label[locale] : id;
}

export function roomLabel(id: string, locale: Locale): string {
  const room = ROOMS.find((r) => r.id === id);
  return room ? room.label[locale] : id;
}

export function roomForCategory(categoryId: string): string {
  const item = CATEGORY_ITEMS.find((c) => c.id === categoryId);
  return item ? item.roomId : "living-room";
}
