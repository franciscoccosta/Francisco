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
  {
    id: "living-room",
    label: { pt: "Sala de estar", en: "Living room", es: "Salón", fr: "Salon", de: "Wohnzimmer", no: "Stue" },
  },
  {
    id: "dining",
    label: { pt: "Sala de jantar", en: "Dining", es: "Comedor", fr: "Salle à manger", de: "Esszimmer", no: "Spisestue" },
  },
  {
    id: "bedroom",
    label: { pt: "Quarto", en: "Bedroom", es: "Dormitorio", fr: "Chambre", de: "Schlafzimmer", no: "Soverom" },
  },
  {
    id: "office",
    label: { pt: "Escritório", en: "Office", es: "Oficina", fr: "Bureau", de: "Büro", no: "Kontor" },
  },
  {
    id: "outdoor",
    label: { pt: "Exterior", en: "Outdoor", es: "Exterior", fr: "Extérieur", de: "Außenbereich", no: "Utendørs" },
  },
  {
    id: "smaller-objects",
    label: {
      pt: "Objetos pequenos",
      en: "Smaller objects",
      es: "Objetos pequeños",
      fr: "Petits objets",
      de: "Kleinere Objekte",
      no: "Mindre objekter",
    },
  },
];

export const CATEGORY_ITEMS: CategoryItem[] = [
  // Living room
  { id: "coffee-table", roomId: "living-room", label: { pt: "Mesa de centro", en: "Coffee table", es: "Mesa de centro", fr: "Table basse", de: "Couchtisch", no: "Sofabord" } },
  { id: "side-table", roomId: "living-room", label: { pt: "Mesa de apoio", en: "Side table", es: "Mesa auxiliar", fr: "Table d'appoint", de: "Beistelltisch", no: "Sidebord" } },
  { id: "tv-unit", roomId: "living-room", label: { pt: "Móvel de TV", en: "TV unit", es: "Mueble de TV", fr: "Meuble TV", de: "TV-Möbel", no: "TV-benk" } },
  { id: "living-sideboard", roomId: "living-room", label: { pt: "Aparador", en: "Sideboard", es: "Aparador", fr: "Buffet", de: "Sideboard", no: "Skjenk" } },
  { id: "bookshelf", roomId: "living-room", label: { pt: "Estante de livros", en: "Bookshelf", es: "Estantería", fr: "Bibliothèque", de: "Bücherregal", no: "Bokhylle" } },
  { id: "shelving-unit", roomId: "living-room", label: { pt: "Módulo de prateleiras", en: "Shelving unit", es: "Módulo de estanterías", fr: "Étagère modulaire", de: "Regalsystem", no: "Reolsystem" } },
  { id: "console", roomId: "living-room", label: { pt: "Consola", en: "Console", es: "Consola", fr: "Console", de: "Konsole", no: "Konsollbord" } },
  { id: "armchair", roomId: "living-room", label: { pt: "Poltrona", en: "Armchair", es: "Sillón", fr: "Fauteuil", de: "Sessel", no: "Lenestol" } },
  { id: "living-chair", roomId: "living-room", label: { pt: "Cadeira", en: "Chair", es: "Silla", fr: "Chaise", de: "Stuhl", no: "Stol" } },
  { id: "living-stool", roomId: "living-room", label: { pt: "Banco", en: "Stool", es: "Taburete", fr: "Tabouret", de: "Hocker", no: "Krakk" } },
  { id: "living-bench", roomId: "living-room", label: { pt: "Banco corrido", en: "Bench", es: "Banco", fr: "Banc", de: "Bank", no: "Benk" } },
  // Dining
  { id: "dining-table", roomId: "dining", label: { pt: "Mesa de jantar", en: "Dining table", es: "Mesa de comedor", fr: "Table à manger", de: "Esstisch", no: "Spisebord" } },
  { id: "dining-chair", roomId: "dining", label: { pt: "Cadeira de jantar", en: "Dining chair", es: "Silla de comedor", fr: "Chaise de salle à manger", de: "Esszimmerstuhl", no: "Spisestuestol" } },
  { id: "dining-bench", roomId: "dining", label: { pt: "Banco de jantar", en: "Bench", es: "Banco", fr: "Banc", de: "Sitzbank", no: "Spisebenk" } },
  { id: "bar-stool", roomId: "dining", label: { pt: "Banco de bar", en: "Bar stool", es: "Taburete de bar", fr: "Tabouret de bar", de: "Barhocker", no: "Barkrakk" } },
  { id: "dining-sideboard", roomId: "dining", label: { pt: "Aparador de sala de jantar", en: "Sideboard", es: "Aparador", fr: "Buffet", de: "Sideboard", no: "Skjenk" } },
  { id: "serving-table", roomId: "dining", label: { pt: "Mesa de apoio para serviço", en: "Serving table", es: "Mesa auxiliar de servicio", fr: "Table de service", de: "Serviertisch", no: "Serveringsbord" } },
  // Bedroom
  { id: "bedside-table", roomId: "bedroom", label: { pt: "Mesa de cabeceira", en: "Bedside table", es: "Mesita de noche", fr: "Table de chevet", de: "Nachttisch", no: "Nattbord" } },
  { id: "bed-frame", roomId: "bedroom", label: { pt: "Estrutura de cama", en: "Bed frame", es: "Estructura de cama", fr: "Cadre de lit", de: "Bettgestell", no: "Sengeramme" } },
  { id: "bedroom-bench", roomId: "bedroom", label: { pt: "Banco de quarto", en: "Bench", es: "Banco", fr: "Banc", de: "Bank", no: "Sengebenk" } },
  { id: "dressing-table", roomId: "bedroom", label: { pt: "Penteadeira", en: "Dressing table", es: "Tocador", fr: "Coiffeuse", de: "Frisiertisch", no: "Sminkebord" } },
  { id: "storage-unit", roomId: "bedroom", label: { pt: "Módulo de arrumação", en: "Storage unit", es: "Mueble de almacenaje", fr: "Meuble de rangement", de: "Aufbewahrungsmöbel", no: "Oppbevaringsmøbel" } },
  // Office
  { id: "desk", roomId: "office", label: { pt: "Secretária", en: "Desk", es: "Escritorio", fr: "Bureau", de: "Schreibtisch", no: "Skrivebord" } },
  { id: "work-table", roomId: "office", label: { pt: "Mesa de trabalho", en: "Work table", es: "Mesa de trabajo", fr: "Table de travail", de: "Arbeitstisch", no: "Arbeidsbord" } },
  { id: "office-shelf", roomId: "office", label: { pt: "Prateleira de escritório", en: "Office shelf", es: "Estante de oficina", fr: "Étagère de bureau", de: "Büroregal", no: "Kontorhylle" } },
  { id: "bookcase", roomId: "office", label: { pt: "Estante alta", en: "Bookcase", es: "Librería", fr: "Bibliothèque haute", de: "Bücherschrank", no: "Bokskap" } },
  { id: "desk-organiser", roomId: "office", label: { pt: "Organizador de secretária", en: "Desk organiser", es: "Organizador de escritorio", fr: "Organiseur de bureau", de: "Schreibtischorganizer", no: "Skrivebordsorganizer" } },
  { id: "office-chair", roomId: "office", label: { pt: "Cadeira de escritório", en: "Chair", es: "Silla", fr: "Chaise", de: "Bürostuhl", no: "Kontorstol" } },
  { id: "meeting-table", roomId: "office", label: { pt: "Mesa de reunião", en: "Meeting table", es: "Mesa de reuniones", fr: "Table de réunion", de: "Besprechungstisch", no: "Møtebord" } },
  // Outdoor
  { id: "outdoor-table", roomId: "outdoor", label: { pt: "Mesa de exterior", en: "Outdoor table", es: "Mesa de exterior", fr: "Table d'extérieur", de: "Gartentisch", no: "Utebord" } },
  { id: "outdoor-bench", roomId: "outdoor", label: { pt: "Banco de exterior", en: "Outdoor bench", es: "Banco de exterior", fr: "Banc d'extérieur", de: "Gartenbank", no: "Utebenk" } },
  { id: "outdoor-chair", roomId: "outdoor", label: { pt: "Cadeira de exterior", en: "Chair", es: "Silla", fr: "Chaise", de: "Gartenstuhl", no: "Utestol" } },
  { id: "planter", roomId: "outdoor", label: { pt: "Floreira", en: "Planter", es: "Jardinera", fr: "Jardinière", de: "Pflanzkübel", no: "Plantekasse" } },
  { id: "small-outdoor", roomId: "outdoor", label: { pt: "Pequeno mobiliário de exterior", en: "Small outdoor furniture", es: "Mobiliario exterior pequeño", fr: "Petit mobilier d'extérieur", de: "Kleines Gartenmöbel", no: "Lite utemøbel" } },
  // Smaller objects
  { id: "wall-shelf", roomId: "smaller-objects", label: { pt: "Prateleira de parede", en: "Wall shelf", es: "Estante de pared", fr: "Étagère murale", de: "Wandregal", no: "Vegghylle" } },
  { id: "floating-shelf", roomId: "smaller-objects", label: { pt: "Prateleira flutuante", en: "Floating shelf", es: "Estante flotante", fr: "Étagère flottante", de: "Schwebendes Regal", no: "Flytende hylle" } },
  { id: "small-table", roomId: "smaller-objects", label: { pt: "Mesa pequena", en: "Small table", es: "Mesa pequeña", fr: "Petite table", de: "Kleiner Tisch", no: "Lite bord" } },
  { id: "small-stool", roomId: "smaller-objects", label: { pt: "Banco pequeno", en: "Stool", es: "Taburete", fr: "Tabouret", de: "Hocker", no: "Krakk" } },
  { id: "display-stand", roomId: "smaller-objects", label: { pt: "Expositor", en: "Display stand", es: "Expositor", fr: "Présentoir", de: "Ausstellungsständer", no: "Utstillingsstativ" } },
  { id: "decorative-object", roomId: "smaller-objects", label: { pt: "Objeto decorativo", en: "Decorative object", es: "Objeto decorativo", fr: "Objet décoratif", de: "Dekoobjekt", no: "Dekorasjonsobjekt" } },
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
