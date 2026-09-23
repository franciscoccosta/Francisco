/**
 * The ReMade prototype catalogue.
 *
 * Every listing is tied to a real Lisbon-area building or project that has
 * recently undergone (or is undergoing) rehabilitation. ReMade does NOT hold
 * material from any of them: each one is a *potential recovery source*.
 *
 * Content rules:
 * - `facts` and `story` only contain information published by the cited sources.
 * - Anything not verified is written as TO_BE_VERIFIED, never guessed.
 * - Dimensions, quantities, volumes and CO₂ figures are indicative placeholders
 *   used to demonstrate the interface, and are labelled as such in the UI.
 */

export const TO_BE_VERIFIED = "To be verified";

export type Category = "beams" | "flooring" | "doors" | "boards" | "structural" | "other";
export type Status = "available" | "coming-soon" | "reserved" | "potential";
export type Grade = "A" | "B" | "C";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "beams", label: "Beams" },
  { id: "flooring", label: "Flooring" },
  { id: "doors", label: "Doors" },
  { id: "boards", label: "Boards / planks" },
  { id: "structural", label: "Structural timber" },
  { id: "other", label: "Other" },
];

export const STATUSES: { id: Status; label: string }[] = [
  { id: "available", label: "Available" },
  { id: "coming-soon", label: "Coming soon" },
  { id: "reserved", label: "Reserved" },
  { id: "potential", label: "Potential recovery source" },
];

export const GRADES: { id: Grade; label: string; description: string }[] = [
  { id: "A", label: "Grade A", description: "Ready to reuse — sound, minimal preparation" },
  { id: "B", label: "Grade B", description: "Good — cleaning, de-nailing or light planing" },
  { id: "C", label: "Grade C", description: "Character — needs workshop refurbishment" },
];

export type Source = { label: string; url: string };

export type Material = {
  id: string; // RM-LX-001
  slug: string;
  category: Category;
  material: string;
  project: string;
  building: string;
  neighbourhood: string;
  location: string;
  approximateAge: string;
  previousUse: string;
  species: string;
  grade: Grade;
  dimensions: string;
  quantity: string;
  /** Indicative timber volume in m³, used for the CO₂ and waste estimates. */
  volumeM3: number;
  status: Status;
  images: string[];
  /** Short, factual line for cards. */
  teaser: string;
  /** Verified facts about the building/project, each backed by `sources`. */
  facts: string[];
  /** One or two lines for the passport document. */
  shortStory: string;
  story: string[];
  /** What would have to be true for material to be recovered here. */
  recoveryNote: string;
  sources: Source[];
};

/**
 * Indicative factors (placeholders pending a proper LCA per material):
 * - CO₂: avoided production of equivalent new sawn timber plus carbon kept
 *   stored in the wood instead of released by incineration.
 * - Density: typical air-dried softwood/hardwood average.
 */
export const CO2_T_PER_M3 = 0.75;
export const DENSITY_KG_PER_M3 = 550;

const oneDecimal = (n: number) => (Math.round(n * 10 + 1e-9) / 10).toFixed(1);

export function co2Tonnes(m: Material) {
  return oneDecimal(m.volumeM3 * CO2_T_PER_M3);
}

export function wasteTonnes(m: Material) {
  return oneDecimal((m.volumeM3 * DENSITY_KG_PER_M3) / 1000);
}

export const MATERIALS: Material[] = [
  {
    id: "RM-LX-001",
    slug: "rm-lx-001",
    category: "beams",
    material: "Reclaimed timber beams",
    project: "Fábrica de Moagem — former Manutenção Militar",
    building: "Milling factory of the former Manutenção Militar",
    neighbourhood: "Beato",
    location: "Beato, Lisbon",
    approximateAge: `Building: late 19th century · Timber: ${TO_BE_VERIFIED.toLowerCase()}`,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "B",
    dimensions: "approx. 20 × 25 cm section, 4–6 m lengths (indicative)",
    quantity: "approx. 12 beams (indicative)",
    volumeM3: 3.2,
    status: "potential",
    images: ["/images/rm-lx-001-a.jpg", "/images/rm-lx-001-b.jpg", "/images/rm-lx-001-c.jpg"],
    teaser: "The first factory of the army's food complex in Beato, now becoming a museum.",
    facts: [
      "The Manutenção Militar was founded in 1897 by decree of King D. Carlos to produce food for the army.",
      "The milling factory was the complex's first factory, built at the end of the 19th century.",
      "EGEAC is carrying out conservation and adaptation works to open a new centre of the Museu de Lisboa dedicated to the city's industrial heritage.",
    ],
    shortStory:
      "The first factory of the army's food complex in Beato, built at the end of the 19th century — now becoming a museum of Lisbon's industrial past.",
    story: [
      "In 1897, by decree of King D. Carlos, the Portuguese army set up the Manutenção Militar in Beato, on the site of a former Carmelite convent, to feed its troops. The milling factory was the first building of what became a complex of some twenty buildings across 35,000 m² — at its height producing as much as 18 tonnes of pasta a day.",
      "The factory is now being conserved and adapted by EGEAC into a new centre of the Museu de Lisboa about Lisbon's industrial past. That is exactly the kind of project where history should stay in place first — and where any sound timber that cannot stay deserves a second life rather than a skip.",
    ],
    recoveryNote:
      "Heritage conservation keeps original fabric wherever it can. ReMade would only ever take timber that the conservation team decides not to retain.",
    sources: [
      { label: "e-cultura — A Fábrica de Moagem da antiga Manutenção Militar", url: "https://www.e-cultura.pt/evento/33276" },
      { label: "Hub Criativo do Beato — Futuro espaço museológico", url: "https://hubcriativobeato.com/noticia/futuro-espaco-museologico-no-hub-criativo-do-beato/" },
      { label: "Trienal de Arquitectura — Antigas Oficinas de Manutenção Militar", url: "https://www.trienaldelisboa.com/ohl/espaco/hub-criativo-do-beato-2/" },
    ],
  },
  {
    id: "RM-LX-002",
    slug: "rm-lx-002",
    category: "flooring",
    material: "Pombaline floorboards",
    project: "Pedras Negras House",
    building: "Pombaline building, Rua das Pedras Negras",
    neighbourhood: "Sé / Baixa",
    location: "Rua das Pedras Negras, Lisbon",
    approximateAge: `Pombaline building · Timber: ${TO_BE_VERIFIED.toLowerCase()}`,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "B",
    dimensions: "approx. 14–22 cm wide, 2.2 cm thick, 2–4 m long (indicative)",
    quantity: "approx. 60 m² (indicative)",
    volumeM3: 1.4,
    status: "coming-soon",
    images: ["/images/rm-lx-002-a.jpg", "/images/rm-lx-002-b.jpg", "/images/rm-lx-002-c.jpg"],
    teaser: "A Pombaline building between the Sé and the Baixa, being rehabilitated into 20 apartments.",
    facts: [
      "A Pombaline building on Rua das Pedras Negras, between the Sé and the Baixa, is being rehabilitated into 20 apartments.",
      "The project, by OptylonKrea (Ando Living Group), preserves original elements such as wooden floors, stone walls, tiles and ornate ceilings.",
      "Completion is expected in the second half of 2027.",
    ],
    shortStory:
      "Lisbon rebuilt itself in timber after 1755. This Pombaline building keeps its floors; the boards it cannot reinstate can start again elsewhere.",
    story: [
      "After the 1755 earthquake, Lisbon rebuilt its centre around an idea: a three-dimensional timber cage — the gaiola — built into the walls so buildings could flex instead of fall. Pombaline buildings are the result, and wood is written into their structure.",
      "On Rua das Pedras Negras, one of these buildings is being brought back to life with its original wooden floors, stone walls, tiles and ceilings kept in place. Any boards that cannot be reinstated are the ones ReMade exists for: timber that has already lived through Lisbon's history, ready for one more chapter.",
    ],
    recoveryNote:
      "The project preserves original wooden floors. Only boards that are not reinstated in the building would be offered.",
    sources: [
      { label: "Construir — Pedras Negras House entra em comercialização", url: "https://www.construir.pt/2025/12/16/pedras-negras-house-o-novo-projecto-da-ando-living-entra-em-comercializacao" },
      { label: "Ando Living — Pedras Negras House", url: "https://andoliving.com/project/project-pedras-negras-house/" },
    ],
  },
  {
    id: "RM-LX-003",
    slug: "rm-lx-003",
    category: "boards",
    material: "Warehouse boards",
    project: "Formoso Marvila",
    building: "Former wine warehouse, Rua Vale Formoso",
    neighbourhood: "Marvila",
    location: "Rua Vale Formoso, Marvila, Lisbon",
    approximateAge: TO_BE_VERIFIED,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "C",
    dimensions: "approx. 18–25 cm wide, 2.5 cm thick, 2–3.5 m long (indicative)",
    quantity: "approx. 40 m² (indicative)",
    volumeM3: 1.0,
    status: "available",
    images: ["/images/rm-lx-003-a.jpg", "/images/rm-lx-003-b.jpg", "/images/rm-lx-003-c.jpg"],
    teaser: "Two industrial pavilions of an old wine warehouse near Braço de Prata, becoming 49 homes.",
    facts: [
      "Formoso converts two industrial pavilions of a former wine warehouse on Rua Vale Formoso, near Braço de Prata station, into 49 apartments.",
      "The project is designed by Bak Gordon Arquitectos and developed by Krest Investments, with an investment of around €30 million.",
      "Completion is expected at the end of 2027.",
    ],
    shortStory:
      "Two pavilions of an old Marvila wine warehouse, being reimagined as 49 homes by Bak Gordon Arquitectos.",
    story: [
      "Marvila's riverside was long a place of wine warehouses. On Rua Vale Formoso, two pavilions of one of those warehouses are being reimagined by Bak Gordon Arquitectos as 49 homes that keep the site's industrial identity.",
      "The building's structure speaks of concrete and steel, so whether reusable timber survives here is still an open question. That is why this listing exists: to find out, with the builders on site, before anything is thrown away.",
    ],
    recoveryNote: "Whether this site holds reusable timber at all is to be verified with the contractor.",
    sources: [
      { label: "Krest Investments — Formoso", url: "https://krestinvestments.com/portfolio/formoso/" },
      { label: "Echo Boomer — Antigo armazém de vinhos dá lugar ao Formoso Marvila", url: "https://echoboomer.pt/formoso-marvila-novo-empreendimento-30-milhoes-euros/" },
      { label: "Diário Imobiliário — Formoso Marvila", url: "https://diarioimobiliario.pt/Formoso-Marvila-novo-condominio-fechado-num-dos-bairros-mais-dinamicos-de-Lisboa" },
    ],
  },
  {
    id: "RM-LX-004",
    slug: "rm-lx-004",
    category: "structural",
    material: "Structural timber",
    project: "Former factory, Rua Maria Luísa Holstein",
    building: "Former factory next to LX Factory",
    neighbourhood: "Alcântara",
    location: "Rua Maria Luísa Holstein, Alcântara, Lisbon",
    approximateAge: TO_BE_VERIFIED,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "C",
    dimensions: "approx. 8 × 20 cm joists, 3–5 m lengths (indicative)",
    quantity: "approx. 30 pieces (indicative)",
    volumeM3: 1.8,
    status: "coming-soon",
    images: ["/images/rm-lx-004-a.jpg", "/images/rm-lx-004-b.jpg", "/images/rm-lx-004-c.jpg"],
    teaser: "A ruined factory beside LX Factory, set to become 57 apartments.",
    facts: [
      "A former factory in ruins on Rua Maria Luísa Holstein, next to LX Factory, is being converted by limehome into 57 apartments with a food-service area.",
      "It is limehome's largest property in Lisbon, with opening planned for 2028–2029.",
    ],
    shortStory:
      "A factory in ruins beside LX Factory, in one of Lisbon's great industrial districts, about to begin a second life.",
    story: [
      "Alcântara was one of Lisbon's great industrial districts. Next door, LX Factory now fills the 19th-century buildings of a former textile company with studios, shops and restaurants.",
      "A few steps away, a factory that had fallen into ruin is about to start its own second life as 57 apartments. Ruins rarely give much back — but where roof and floor timber is still sound, it can carry Alcântara's industrial character into new interiors.",
    ],
    recoveryNote: "The building is described as a ruin; the condition and quantity of any surviving timber is to be verified.",
    sources: [
      { label: "Publituris — limehome converte antiga fábrica em Alcântara", url: "https://www.publituris.pt/2025/03/06/limehome-converte-antiga-fabrica-em-alcantara-na-sua-maior-propriedade-em-lisboa" },
      { label: "Construir — Antiga fábrica em Alcântara reconvertida", url: "https://construir.pt/2025/03/06/antiga-fabrica-em-alcantara-reconvertida-para-apartamentos-turisticos" },
    ],
  },
  {
    id: "RM-LX-005",
    slug: "rm-lx-005",
    category: "doors",
    material: "Timber doors & joinery",
    project: "The Wake — Doca de Alcântara",
    building: "Five port warehouses, Doca de Alcântara",
    neighbourhood: "Alcântara",
    location: "Doca de Alcântara, Lisbon",
    approximateAge: TO_BE_VERIFIED,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "B",
    dimensions: "approx. 90 × 210 cm leaves (indicative)",
    quantity: "approx. 6 doors (indicative)",
    volumeM3: 0.5,
    status: "reserved",
    images: ["/images/rm-lx-005-a.jpg", "/images/rm-lx-005-b.jpg", "/images/rm-lx-005-c.jpg"],
    teaser: "Five riverside port warehouses in view of the 25 de Abril bridge, turned into offices.",
    facts: [
      "The Wake regenerates five former port warehouses on the Doca de Alcântara, previously occupied by restaurants and nightlife, into an office building of 2,758 m².",
      "It is developed by Placer with Francisco Matos Gil and designed by the AAVV architecture studio.",
      "Completion was expected in the last quarter of 2025.",
    ],
    shortStory:
      "Port warehouses on the Doca de Alcântara that became restaurants and venues, and now offices — doors that have opened onto every one of those lives.",
    story: [
      "The Doca de Alcântara warehouses were built for the port, then spent years as restaurants and late-night venues on the river, in view of the 25 de Abril bridge.",
      "Their conversion into offices is a reminder that buildings in Lisbon rarely have just one life. Doors and joinery that open and close through those lives collect layers of paint, hardware and wear — exactly the character designers look for.",
    ],
    recoveryNote: "Works were due to complete in late 2025; what was removed, and whether any of it was kept, is to be verified.",
    sources: [
      { label: "Construir — Armazéns na Doca de Alcântara transformados em escritórios", url: "https://construir.pt/2025/06/25/armazens-na-doca-de-alcantara-transformados-em-escritorios" },
      { label: "Diário Imobiliário — Antigos armazéns na Doca de Alcântara", url: "https://diarioimobiliario.pt/Antigos-armazens-na-Doca-de-Alcantara-vao-dar-lugar-a-edificio-de-escritorios-inovador-com-vista-para-o-Tejo" },
    ],
  },
  {
    id: "RM-LX-006",
    slug: "rm-lx-006",
    category: "other",
    material: "Industrial shelving & joinery boards",
    project: "Fábrica de Pão — Hub Criativo do Beato",
    building: "Bread factory of the former Manutenção Militar",
    neighbourhood: "Beato",
    location: "Beato, Lisbon",
    approximateAge: TO_BE_VERIFIED,
    previousUse: TO_BE_VERIFIED,
    species: TO_BE_VERIFIED,
    grade: "A",
    dimensions: "approx. 25–30 cm wide, 3 cm thick, 1.5–3 m long (indicative)",
    quantity: "approx. 25 m² (indicative)",
    volumeM3: 0.75,
    status: "potential",
    images: ["/images/rm-lx-006-a.jpg", "/images/rm-lx-006-b.jpg", "/images/rm-lx-006-c.jpg"],
    teaser: "The army's last working factory in Beato — its oven switched off in 2011.",
    facts: [
      "The bread factory was the last factory of the Manutenção Militar to close, when its continuous oven was switched off in November 2011.",
      "In 2016 the south wing of the complex was ceded to Lisbon City Council for 50 years to create the Hub Criativo do Beato.",
      "Startup Lisboa occupies the former bread factory, a building of more than 7,000 m².",
    ],
    shortStory:
      "The Manutenção Militar's bread factory, the last of its factories to close in 2011, now home to Startup Lisboa.",
    story: [
      "For more than a century, the Manutenção Militar produced bread, flour and pasta for the Portuguese army from Beato. In November 2011 its continuous oven was switched off, and the bread factory — the last of its factories still working — fell silent.",
      "Today the same building is home to Startup Lisboa and the Hub Criativo do Beato, where the next generation of Lisbon companies is being built. Rehabilitating a building like this means deciding what stays, what goes — and making sure what goes still has somewhere to go.",
    ],
    recoveryNote: "Whether the works release any reusable timber is to be verified with the hub and its contractors.",
    sources: [
      { label: "Mensagem de Lisboa — O que há no Hub Criativo do Beato", url: "https://amensagem.pt/2022/10/28/hub-criativo-fabrica-unicornios-beato/" },
      { label: "Diário Imobiliário — Hub Criativo do Beato nasce na Manutenção Militar", url: "https://www.diarioimobiliario.pt/Actualidade/Hub-Criativo-do-Beato-nasce-na-Manutencao-Militar" },
      { label: "RTP — “Fábrica de pão” vai para obras", url: "https://www.rtp.pt/noticias/pais/fabrica-de-pao-edificio-emblematico-do-hub-criativo-do-beato-vai-para-obras_a1196093" },
    ],
  },
];

export function getMaterial(slug: string) {
  return MATERIALS.find((m) => m.slug === slug.toLowerCase());
}

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)!.label;
export const statusLabel = (s: Status) => STATUSES.find((x) => x.id === s)!.label;

export const FEATURED = ["rm-lx-002", "rm-lx-001", "rm-lx-005"];
