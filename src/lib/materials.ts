/**
 * ReMade prototype catalogue.
 *
 * Every listing references a real Lisbon-area building or project, but NONE of
 * the material below has been recovered or verified by ReMade. Each one is a
 * "Prototype material — potential recovery source": the site facts in `story`
 * and `siteFacts` are sourced (see `sources`), while quantities, dimensions and
 * CO₂ figures are indicative placeholders for demonstrating the interface.
 * Anything not verified is written as "To be verified".
 */

export type Category = "beams" | "flooring" | "doors" | "boards" | "structural" | "other";
export type Condition = "A" | "B" | "C";
export type Status = "available" | "coming-soon" | "reserved" | "potential";

export type Material = {
  id: string; // e.g. RM-LX-001
  slug: string;
  material: string;
  category: Category;
  origin: string; // building / project
  area: string; // neighbourhood / municipality, used for the location filter
  location: string;
  sourceType: string;
  age: string;
  previousUse: string;
  species: string;
  condition: Condition;
  dimensions: string;
  quantity: string;
  volumeM3: number; // indicative, drives the CO₂ / waste estimates
  status: Status;
  images: string[];
  headline: string;
  story: string[];
  siteFacts: string[];
  sources: { label: string; url: string }[];
};

export const CATEGORY_LABELS: Record<Category, string> = {
  beams: "Beams",
  flooring: "Flooring",
  doors: "Doors",
  boards: "Boards / planks",
  structural: "Structural timber",
  other: "Other",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  A: "Grade A — ready to reuse",
  B: "Grade B — light preparation",
  C: "Grade C — workshop refurbishment",
};

export const STATUS_LABELS: Record<Status, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
  reserved: "Reserved",
  potential: "Potential recovery source",
};

export const PROTOTYPE_LABEL = "Prototype material — potential recovery source";

/**
 * Indicative factors used for every estimate on the site. They are deliberately
 * conservative and simple so they can be replaced by a proper LCA per material.
 *  - CO2_T_PER_M3: production emissions avoided by not buying equivalent new
 *    sawn timber (cradle-to-gate, excluding biogenic carbon).
 *  - DENSITY_KG_PER_M3: average density of seasoned reclaimed timber, used to
 *    express volume as waste diverted from disposal.
 */
export const CO2_T_PER_M3 = 0.25;
export const DENSITY_KG_PER_M3 = 500;

export function impact(m: Pick<Material, "volumeM3">) {
  return {
    volume: m.volumeM3,
    wasteKg: Math.round((m.volumeM3 * DENSITY_KG_PER_M3) / 10) * 10,
    co2Kg: Math.round((m.volumeM3 * CO2_T_PER_M3 * 1000) / 10) * 10,
  };
}

export function formatKg(kg: number) {
  return kg >= 1000 ? `${(kg / 1000).toLocaleString("en-GB", { maximumFractionDigits: 1 })} t` : `${kg} kg`;
}

const img = (name: string) => `/images/materials/${name}.jpg`;

export const MATERIALS: Material[] = [
  {
    id: "RM-LX-001",
    slug: "rm-lx-001",
    material: "Pombaline timber framing",
    category: "structural",
    origin: "Pombaline building rehabilitation",
    area: "Baixa",
    location: "Baixa Pombalina, Lisbon",
    sourceType: "Historic Lisbon building under rehabilitation",
    age: "Post-1755 reconstruction era — exact date to be verified per building",
    previousUse: "Gaiola pombalina framing and floor structure — to be verified",
    species: "To be verified",
    condition: "B",
    dimensions: "Approx. 2.4–4.2 m × 120–180 mm × 120–200 mm (indicative)",
    quantity: "Approx. 30 members (indicative)",
    volumeM3: 6.5,
    status: "available",
    images: [img("pombaline-beams"), img("pombaline-detail"), img("pombaline-end")],
    headline: "Timber from the city that learned to rebuild.",
    story: [
      "After the 1755 earthquake, Lisbon's Baixa was rebuilt on a new plan and with a new way of building. Inside the masonry walls, builders placed the gaiola pombalina: a three-dimensional braced timber cage of vertical, horizontal and diagonal members — Saint Andrew's crosses — designed to give the buildings elasticity when the ground moved. It is an early example of anti-seismic construction.",
      "Rehabilitating these buildings is specialised work, and the first priority is always to preserve the original structure. When engineers confirm that individual members cannot be retained, that timber still carries the history of post-earthquake Lisbon. This listing represents that kind of material: the frame of the rebuilt city, ready to enter a new project.",
    ],
    siteFacts: [
      "The Baixa was rebuilt after the 1755 earthquake under the Marquis of Pombal.",
      "The gaiola is a 3D braced timber frame (Saint Andrew's crosses) embedded in masonry walls.",
      "Rehabilitation work is expected to remain compatible with the original structure — only timber that cannot be retained would be listed.",
    ],
    sources: [
      { label: "Gaiola pombalina — Wikipédia", url: "https://pt.wikipedia.org/wiki/Gaiola_pombalina" },
      { label: "Pombaline style — Wikipedia", url: "https://en.wikipedia.org/wiki/Pombaline_style" },
      { label: "Pombaline Lisbon — UNESCO Tentative List", url: "https://whc.unesco.org/en/tentativelists/6226/" },
    ],
  },
  {
    id: "RM-LX-002",
    slug: "rm-lx-002",
    material: "Traditional floorboards & tabique laths",
    category: "flooring",
    origin: "Traditional building rehabilitation",
    area: "Alfama & Mouraria",
    location: "Alfama & Mouraria, Lisbon",
    sourceType: "Traditional Lisbon building",
    age: "To be verified — parts of these districts pre-date the 1755 earthquake",
    previousUse: "Floorboards and interior tabique wall laths — to be verified",
    species: "To be verified",
    condition: "B",
    dimensions: "Boards approx. 2–3.5 m × 140–220 mm × 22 mm (indicative)",
    quantity: "Approx. 120 m² of boards (indicative)",
    volumeM3: 3.2,
    status: "reserved",
    images: [img("alfama-floor"), img("alfama-laths"), img("alfama-detail")],
    headline: "Wood that was already being reused centuries ago.",
    story: [
      "On the hill beneath the Castelo de São Jorge, Alfama and Mouraria still hold buildings with features from before the 1755 earthquake. Their interiors were built with tabique walls — timber laths nailed to vertical members and filled with rubble and lime mortar — and floors carried on rounded joists, often using reused timber.",
      "In other words, reuse is part of how these neighbourhoods were built. Floorboards and laths released during careful rehabilitation carry the marks of that history: nail holes, lime residue, worn surfaces. They are ideal for wall cladding, flooring and joinery where character matters.",
    ],
    siteFacts: [
      "The Castelo hill districts (Alfama, Mouraria, Castelo) retain pre-earthquake architectural features.",
      "Interior tabique walls: timber laths nailed to vertical joists, filled with rubble and lime mortar.",
      "Floor and roof structures often used rounded joists and reused wood elements.",
    ],
    sources: [
      { label: "Characterization of Lisbon Old Buildings (15WCEE, 2012)", url: "https://www.iitk.ac.in/nicee/wcee/article/WCEE2012_2434.pdf" },
      { label: "Half-timbered walls in pre- and post-earthquake Lisbon — Int. J. of Architectural Heritage", url: "https://www.tandfonline.com/doi/abs/10.1080/15583058.2016.1233297" },
    ],
  },
  {
    id: "RM-LX-003",
    slug: "rm-lx-003",
    material: "Industrial roof & floor beams",
    category: "beams",
    origin: "Hub Criativo do Beato — former Manutenção Militar",
    area: "Beato",
    location: "Beato, Lisbon",
    sourceType: "Former military factory complex under rehabilitation",
    age: "To be verified per building — the complex's flour mill dates from 1897",
    previousUse: "To be verified",
    species: "To be verified",
    condition: "A",
    dimensions: "Approx. 4–6 m × 150 mm × 250 mm (indicative)",
    quantity: "Approx. 24 beams (indicative)",
    volumeM3: 9,
    status: "coming-soon",
    images: [img("beato-beams"), img("beato-detail"), img("beato-end")],
    headline: "From the Army's bakery to Lisbon's creative district.",
    story: [
      "For decades, the Manutenção Militar in Beato supplied the Portuguese Army with food — an industrial complex of around twenty buildings and 35,000 m² between the historic centre and Parque das Nações. Its flour mill, dating from 1897, is considered nationally unique. The Manutenção Militar was extinguished in 2016.",
      "Today the south zone is being transformed into the Hub Criativo do Beato, with building-by-building rehabilitation carried out by the tenants themselves. Projects like this regularly replace roof and floor structures that cannot meet new requirements — timber that can move straight from one Beato building into the next project.",
    ],
    siteFacts: [
      "Approx. 20 buildings and 35,000 m² on 3 hectares of former Army factories.",
      "The flour mill dates from 1897 and is considered nationally unique.",
      "Rehabilitation is carried out by the selected tenants, building by building.",
    ],
    sources: [
      { label: "Hub Criativo do Beato — HUB-IN Atlas", url: "https://atlas.hubin-project.eu/case/hub-criativo-beato/" },
      { label: "Hub Criativo do Beato — iCapital, Lisboa.pt", url: "https://icapital.lisboa.pt/detail/hub-criativo-do-beato" },
      { label: "Hub Criativo Beato — About", url: "https://hubcriativobeato.com/en/about-us/" },
    ],
  },
  {
    id: "RM-LX-004",
    slug: "rm-lx-004",
    material: "Painted panel doors",
    category: "doors",
    origin: "Former Hospital Miguel Bombarda",
    area: "Arroios",
    location: "Arroios, Lisbon",
    sourceType: "Former hospital awaiting redevelopment",
    age: "To be verified",
    previousUse: "Interior doors — to be verified",
    species: "To be verified",
    condition: "C",
    dimensions: "Approx. 0.8–1.2 m × 2.1–2.6 m leaves (indicative)",
    quantity: "Approx. 35 door leaves (indicative)",
    volumeM3: 2.2,
    status: "potential",
    images: [img("bombarda-door"), img("bombarda-door-detail"), img("bombarda-boards")],
    headline: "Doors that have opened and closed on a century of Lisbon life.",
    story: [
      "The former psychiatric hospital Miguel Bombarda occupies a large site in Arroios. The complex was sold to Estamo in 2009, and a redevelopment project foresees housing, a school and cultural facilities. A structural assessment was launched to decide on property transfers and any necessary demolitions, while in 2025 the Lisbon Municipal Assembly called for the hospital's assets to be preserved.",
      "ReMade's role on a site like this is not to strip heritage, but to make sure that whatever cannot stay is not wasted. Old panel doors are a classic example: layers of paint, solid timber and proportions that are rarely made today. Refurbished by a partner workshop, they can return as doors, wall panels or furniture.",
    ],
    siteFacts: [
      "Complex sold by the City Council to Estamo in 2009.",
      "Planned uses include housing, commerce, services, a school and cultural facilities.",
      "A structural study was to inform decisions on property transfers and necessary demolitions.",
    ],
    sources: [
      { label: "Projeto para antigo hospital Miguel Bombarda — Observador (2021)", url: "https://observador.pt/2021/03/24/projeto-para-antigo-hospital-miguel-bombarda-preve-habitacao-escola-e-equipamentos-culturais/" },
      { label: "Hospital Miguel Bombarda: projeto em análise — idealista (2023)", url: "https://www.idealista.pt/news/imobiliario/habitacao/2023/03/22/57143-hospital-miguel-bombarda-projeto-para-imovel-devoluto-em-analise" },
      { label: "Museu de Arte dos Doentes — Observador (2025)", url: "https://observador.pt/2025/05/27/lisboa-luta-pela-reabertura-do-museu-de-arte-dos-doentes-e-das-neurociencias-no-hospital-miguel-bombarda/" },
    ],
  },
  {
    id: "RM-LX-005",
    slug: "rm-lx-005",
    material: "Roof rafters & purlins",
    category: "other",
    origin: "Former Quartel da Graça",
    area: "Graça",
    location: "Graça, Lisbon",
    sourceType: "Former barracks awaiting hotel conversion",
    age: "To be verified",
    previousUse: "Roof structure — to be verified",
    species: "To be verified",
    condition: "C",
    dimensions: "Approx. 3–5 m × 100–160 mm × 140–220 mm (indicative)",
    quantity: "Approx. 40 members (indicative)",
    volumeM3: 5.4,
    status: "potential",
    images: [img("graca-rafters"), img("graca-detail"), img("graca-end")],
    headline: "Waiting on the hill above Lisbon.",
    story: [
      "The former Quartel da Graça sits on one of Lisbon's most prominent hills. In 2019 it was conceded to a hotel group to become a five-star hotel; the final architectural project was only approved in July 2024, and in early 2026 the press reported the building still closed and deteriorating, with water infiltration among the problems described.",
      "Buildings in this situation are exactly where timber is most at risk: when works finally begin, damaged roof structures are often replaced in a hurry. Listing that timber in advance gives architects the chance to claim it before it becomes waste. Condition is expected to require workshop refurbishment.",
    ],
    siteFacts: [
      "Concession for a five-star hotel signed in 2019.",
      "Final architectural project approved in July 2024.",
      "Reported in February 2026 as closed and deteriorating.",
    ],
    sources: [
      { label: "Quartel da Graça ao abandono — Observador (2026)", url: "https://observador.pt/2026/02/16/lisboa-grupo-hoteleiro-incumpre-contrato-e-deixa-quartel-da-graca-que-devia-ser-hotel-de-cinco-estrelas-ao-abandono/" },
      { label: "Quartel da Graça — idealista (2026)", url: "https://www.idealista.pt/news/financas/investimentos/2026/02/18/73975-quartel-da-graca-grupo-hoteleiro-falha-contrato-e-deixa-o-ao-abandono" },
    ],
  },
  {
    id: "RM-LX-006",
    slug: "rm-lx-006",
    material: "Heavy industrial timber",
    category: "structural",
    origin: "Cidade da Água — former Lisnave shipyard, Margueira",
    area: "Almada",
    location: "Margueira, Almada",
    sourceType: "Former shipyard — large urban redevelopment",
    age: "To be verified — the shipyard operated for 33 years until 2000",
    previousUse: "To be verified",
    species: "To be verified",
    condition: "B",
    dimensions: "Approx. 3–6 m × 200–300 mm × 200–300 mm (indicative)",
    quantity: "Approx. 18 members (indicative)",
    volumeM3: 12,
    status: "potential",
    images: [img("margueira-timber"), img("margueira-detail"), img("margueira-end")],
    headline: "Across the river, where 5,200 ships were repaired.",
    story: [
      "Across the Tagus from Lisbon, the Lisnave shipyard at Margueira operated for 33 years, repairing around 5,200 ships in what became the world's largest dry dock. It closed on 31 December 2000.",
      "The site is now planned as Cidade da Água — described as the largest urban requalification in Portugal since Expo '98, covering about 575,000 m², around 70% of it for housing. Redevelopments of industrial land at this scale release heavy timber that is extremely hard to source new: dense, stable sections with the marks of their working life.",
    ],
    siteFacts: [
      "Shipyard in operation for 33 years; around 5,200 ships repaired.",
      "Closed on 31 December 2000.",
      "Cidade da Água: approx. 575,000 m² intervention area, ~70% housing.",
    ],
    sources: [
      { label: "Cidade da Água — Público (2019)", url: "https://www.publico.pt/2019/05/14/local/noticia/cidade-agua-almada-vai-maior-projecto-requalificacao-urbana-expo98-1872579" },
      { label: "Plano de Urbanização Almada Nascente — CM Almada", url: "https://www.cm-almada.pt/planeamento-urbanistico/planos-em-vigor/plano-de-urbanizacao-almada-nascente-cidade-da-agua" },
      { label: "20 anos após o encerramento da Lisnave — Almadense", url: "https://almadense.sapo.pt/cidade/20-anos-apos-o-encerramento-a-memoria-da-lisnave-continua-a-marcar-almada/" },
    ],
  },
  {
    id: "RM-LX-007",
    slug: "rm-lx-007",
    material: "Sawn boards & planks",
    category: "boards",
    origin: "Former CUF industrial complex (Baía do Tejo)",
    area: "Barreiro",
    location: "Barreiro, Lisbon Metropolitan Area",
    sourceType: "Former industrial complex — ongoing reconversion",
    age: "To be verified",
    previousUse: "Warehouse and workshop fit-out — to be verified",
    species: "To be verified",
    condition: "A",
    dimensions: "Approx. 2–4 m × 150–250 mm × 25–40 mm (indicative)",
    quantity: "Approx. 260 boards (indicative)",
    volumeM3: 4.8,
    status: "coming-soon",
    images: [img("barreiro-stack"), img("barreiro-boards"), img("barreiro-detail")],
    headline: "Boards from one of Europe's great industrial complexes.",
    story: [
      "The first large CUF factory was installed in Barreiro in 1907, and the complex became one of the most important chemical-industrial sites in mid-20th-century Europe. It became Quimigal in 1977; Quimiparque was created in 1989 to adapt the site for new companies, and since 2009 it has been managed by Baía do Tejo.",
      "Today the former factory land hosts businesses, artist studios and an industrial museum in a 1935 diesel power plant. As warehouses and workshops are adapted for new tenants, sawn boards and planks from old fit-outs are exactly the kind of material that should find a second life rather than a skip.",
    ],
    siteFacts: [
      "First large CUF factory in Barreiro: 1907.",
      "Quimigal (1977) → Quimiparque (1989) → Baía do Tejo (2009).",
      "Industrial museum housed in a 1935 diesel power plant.",
    ],
    sources: [
      { label: "Museu Industrial da Baía do Tejo — CM Barreiro", url: "https://www.cm-barreiro.pt/locais/museu-industrial-da-baia-do-tejo-quimiparque/" },
      { label: "Museu Industrial da Baía do Tejo — Rede de Património Cultural", url: "https://redepatrimoniofids.amrs.pt/museu-industrial-baia-tejo/" },
      { label: "A Companhia União Fabril — Biblioteca de Arte Gulbenkian", url: "https://gulbenkian.pt/biblioteca-arte/colecoes/galerias-e-exposicoes/patrimonio-industrial/a-companhia-uniao-fabril-cuf/" },
    ],
  },
];

export const FEATURED_SLUGS = ["rm-lx-001", "rm-lx-003", "rm-lx-004"];

export function getMaterial(slug: string) {
  return MATERIALS.find((m) => m.slug === slug.toLowerCase());
}

export const AREAS = Array.from(new Set(MATERIALS.map((m) => m.area)));
