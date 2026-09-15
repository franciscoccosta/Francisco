import type { Product } from "@/lib/types";
import {
  STEPS_TABLE,
  STEPS_SHELF,
  STEPS_BENCH,
  STEPS_CHAIR,
  STEPS_BED,
  STEPS_CABINET,
  STEPS_SMALL,
  STEPS_OUTDOOR,
} from "./assembly-steps";

const d = (pt: string, en: string) => ({ pt, en });

export const PRODUCTS: Product[] = [
  {
    id: "prod-024", code: "024", slug: "mesa-jantar-024", categoryId: "dining-table",
    price: 620, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "200 × 95 × 76 cm", weightKg: 48, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Mesa de jantar para 8 pessoas em carvalho recuperado, com o veio original do soalho ainda visível.",
      "An 8-seat dining table in recovered oak, the original floorboard grain still visible across the top."
    ),
    story: d(
      "O tampo desta mesa era, até 2025, o soalho de um apartamento no Príncipe Real, Lisboa, construído nos anos 40. Durante a reabilitação do Edifício Alfazema, as tábuas foram cuidadosamente removidas, tratadas e recombinadas.",
      "This tabletop was, until 2025, the flooring of an apartment in Príncipe Real, Lisbon, built in the 1940s. During the renovation of Edifício Alfazema, the boards were carefully removed, treated and recombined."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 45, needsProAssembly: true, assemblySteps: STEPS_TABLE,
    createdAt: "2025-09-01", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-031", code: "031", slug: "mesa-cabeceira-031", categoryId: "bedside-table",
    price: 210, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "45 × 38 × 55 cm", weightKg: 9, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Mesa de cabeceira compacta com uma gaveta, em carvalho recuperado do mesmo lote do soalho do Príncipe Real.",
      "A compact one-drawer bedside table in recovered oak, from the same Príncipe Real flooring batch."
    ),
    story: d(
      "Feita com os recortes mais pequenos do mesmo soalho de carvalho — nada se perde.",
      "Made from the smaller offcuts of that same oak flooring — nothing goes to waste."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 20, needsProAssembly: false, assemblySteps: STEPS_CABINET,
    createdAt: "2025-09-03", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-018", code: "018", slug: "estante-livros-018", categoryId: "bookshelf",
    price: 480, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "90 × 30 × 180 cm", weightKg: 32, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Estante alta de cinco níveis, em carvalho recuperado com acabamento em óleo natural.",
      "A tall five-tier bookshelf in recovered oak with a natural oil finish."
    ),
    story: d(
      "Construída a partir de tábuas de soalho com maior desgaste, escolhidas propositadamente pela sua textura.",
      "Built from the more worn floorboards, chosen deliberately for their texture."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 35, needsProAssembly: false, assemblySteps: STEPS_SHELF,
    createdAt: "2025-09-04", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-042", code: "042", slug: "consola-042", categoryId: "console",
    price: 310, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "120 × 35 × 80 cm", weightKg: 22, materialTypeId: "construction-beam", condition: "good",
    description: d(
      "Consola de entrada em pinho de viga estrutural, com marcas visíveis da sua vida anterior.",
      "An entryway console made from structural pine beam, with visible marks from its former life."
    ),
    story: d(
      "As vigas que suportavam a antiga cobertura do Residencial Foz Verde, no Porto, tornaram-se esta peça de linhas robustas.",
      "The beams that once supported the old roof of Residencial Foz Verde, in Porto, became this sturdy-lined piece."
    ),
    originCity: "Porto", assemblyTimeMinutes: 30, needsProAssembly: false, assemblySteps: STEPS_TABLE,
    createdAt: "2025-08-20", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-009", code: "009", slug: "mesa-reuniao-009", categoryId: "meeting-table",
    price: 890, status: "reserved", oneOfOne: true, quantityAvailable: 1,
    dimensions: "280 × 110 × 74 cm", weightKg: 76, materialTypeId: "construction-beam", condition: "good",
    description: d(
      "Mesa de reunião para 10 pessoas, tampo maciço em pinho de viga, estrutura em aço escovado.",
      "A 10-seat meeting table, solid pine beam top, brushed steel base."
    ),
    story: d(
      "Peça de grande escala feita com as vigas mais longas recuperadas do Foz Verde — uma só produção possível.",
      "A large-scale piece made from the longest beams recovered at Foz Verde — only one was ever possible."
    ),
    originCity: "Porto", assemblyTimeMinutes: 90, needsProAssembly: true, assemblySteps: STEPS_TABLE,
    createdAt: "2025-08-22", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-055", code: "055", slug: "mesa-apoio-055", categoryId: "side-table",
    price: 260, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "50 × 50 × 45 cm", weightKg: 14, materialTypeId: "ceramic-tile", condition: "excellent",
    description: d(
      "Mesa de apoio com tampo de azulejo hidráulico português e base em madeira maciça.",
      "A side table with a traditional Portuguese hydraulic tile top and solid wood base."
    ),
    story: d(
      "O padrão geométrico deste tampo cobria a fachada de um prédio no Chiado antes da reabilitação de 2025.",
      "This tabletop's geometric pattern once covered a building façade in Chiado before the 2025 renovation."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 15, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-06-10", partnerId: "partner-mota-sil", projectId: "proj-alecrim",
  },
  {
    id: "prod-061", code: "061", slug: "expositor-061", categoryId: "display-stand",
    price: 95, status: "sold", oneOfOne: true, quantityAvailable: 1,
    dimensions: "25 × 25 × 30 cm", weightKg: 4, materialTypeId: "ceramic-tile", condition: "excellent",
    description: d(
      "Pequeno expositor com base de azulejo hidráulico, ideal para objetos decorativos.",
      "A small display stand with a hydraulic-tile base, ideal for decorative objects."
    ),
    story: d(
      "Feito com os fragmentos mais pequenos do mesmo azulejo do Chiado.",
      "Made from the smallest fragments of that same Chiado tile."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 10, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-06-14", partnerId: "partner-mota-sil", projectId: "proj-alecrim",
  },
  {
    id: "prod-072", code: "072", slug: "floreira-072", categoryId: "planter",
    price: 120, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "60 × 30 × 35 cm", weightKg: 26, materialTypeId: "reclaimed-brick", condition: "good",
    description: d(
      "Floreira em tijolo maciço recuperado, com interior impermeabilizado.",
      "A planter in reclaimed solid brick, waterproofed on the inside."
    ),
    story: d(
      "Construída com tijolo de uma fachada demolida em Cascais, mantendo a textura original da argamassa.",
      "Built with brick from a demolished façade in Cascais, keeping the original mortar texture."
    ),
    originCity: "Cascais", assemblyTimeMinutes: 15, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-09-06", partnerId: "partner-cascais-renova", projectId: "proj-vila-cascais-sul",
  },
  {
    id: "prod-015", code: "015", slug: "modulo-prateleiras-015", categoryId: "shelving-unit",
    price: 340, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "100 × 28 × 160 cm", weightKg: 24, materialTypeId: "mixed-timber", condition: "fair",
    description: d(
      "Módulo de prateleiras assimétrico, combinando pinho e contraplacado de obra.",
      "An asymmetric shelving unit combining pine and plywood from the building site."
    ),
    story: d(
      "Montado a partir de cofragem e paletes recuperadas em Sintra Norte — cada prateleira tem uma tonalidade ligeiramente diferente.",
      "Assembled from formwork and pallets recovered at Sintra Norte — each shelf has a slightly different tone."
    ),
    originCity: "Sintra", assemblyTimeMinutes: 40, needsProAssembly: false, assemblySteps: STEPS_SHELF,
    createdAt: "2025-09-10", partnerId: "partner-obrafirme", projectId: "proj-sintra-norte",
  },
  {
    id: "prod-088", code: "088", slug: "prateleira-parede-088", categoryId: "wall-shelf",
    price: 85, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "70 × 20 × 4 cm", weightKg: 3, materialTypeId: "mixed-timber", condition: "fair",
    description: d(
      "Prateleira de parede fina, em madeira mista com suportes ocultos.",
      "A slim wall shelf in mixed timber with hidden brackets."
    ),
    story: d(
      "Uma das peças mais pequenas produzidas a partir da mesma cofragem de Sintra Norte.",
      "One of the smallest pieces produced from that same Sintra Norte formwork."
    ),
    originCity: "Sintra", assemblyTimeMinutes: 10, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-09-11", partnerId: "partner-obrafirme", projectId: "proj-sintra-norte",
  },
  {
    id: "prod-044", code: "044", slug: "consola-metal-044", categoryId: "console",
    price: 280, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "110 × 32 × 78 cm", weightKg: 19, materialTypeId: "metal-offcut", condition: "good",
    description: d(
      "Consola de linhas industriais, estrutura em perfil metálico recuperado e tampo em madeira.",
      "An industrial-lined console, recovered steel profile frame with a wood top."
    ),
    story: d(
      "Os perfis metálicos vêm da antiga estrutura de fachada de um edifício de escritórios no Parque das Nações.",
      "The steel profiles come from the old façade structure of an office building in Parque das Nações."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 35, needsProAssembly: false, assemblySteps: STEPS_TABLE,
    createdAt: "2025-09-15", partnerId: "partner-mota-sil", projectId: "proj-parque-nacoes",
  },
  {
    id: "prod-027", code: "027", slug: "mesa-centro-027", categoryId: "coffee-table",
    price: 540, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "110 × 60 × 38 cm", weightKg: 41, materialTypeId: "natural-stone", condition: "excellent",
    description: d(
      "Mesa de centro com tampo em lioz maciço e base em metal preto fosco.",
      "A coffee table with a solid lioz limestone top and a matte black metal base."
    ),
    story: d(
      "O lioz vem de uma bancada de cozinha removida intacta durante uma remodelação no Porto.",
      "The lioz stone comes from a kitchen countertop removed intact during a renovation in Porto."
    ),
    originCity: "Porto", assemblyTimeMinutes: 25, needsProAssembly: true, assemblySteps: STEPS_TABLE,
    createdAt: "2025-09-02", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-011", code: "011", slug: "estrutura-cama-011", categoryId: "bed-frame",
    price: 480, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "160 × 200 × 90 cm (cabeceira)", weightKg: 58, materialTypeId: "pine-boards", condition: "good",
    description: d(
      "Estrutura de cama de casal, cabeceira alta em pinho nacional de estrutura de telhado.",
      "A double bed frame with a tall headboard in national pine from a roof structure."
    ),
    story: d(
      "As tábuas de telhado do Edifício Alfazema, tratadas e lixadas, tornaram-se esta cabeceira de veio marcado.",
      "Roof boards from Edifício Alfazema, treated and sanded, became this strongly grained headboard."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 60, needsProAssembly: true, assemblySteps: STEPS_BED,
    createdAt: "2025-09-05", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-052", code: "052", slug: "banco-sala-052", categoryId: "living-bench",
    price: 190, status: "reserved", oneOfOne: true, quantityAvailable: 1,
    dimensions: "120 × 35 × 45 cm", weightKg: 15, materialTypeId: "pine-boards", condition: "good",
    description: d(
      "Banco corrido para sala, em pinho de telhado com acabamento cerado.",
      "A living-room bench in roof pine with a waxed finish."
    ),
    story: d(
      "Da mesma estrutura de telhado que originou a cama #011 — irmãos feitos do mesmo material.",
      "From the same roof structure that produced bed #011 — siblings made from the same material."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 20, needsProAssembly: false, assemblySteps: STEPS_BENCH,
    createdAt: "2025-09-06", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-067", code: "067", slug: "banco-exterior-067", categoryId: "outdoor-bench",
    price: 240, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "140 × 40 × 45 cm", weightKg: 27, materialTypeId: "metal-offcut", condition: "good",
    description: d(
      "Banco de exterior com estrutura em tubo metálico recuperado e ripas tratadas para intempérie.",
      "An outdoor bench with a recovered steel tube frame and weather-treated slats."
    ),
    story: d(
      "A estrutura vem de uma guarda metálica substituída num edifício residencial no Porto.",
      "The frame comes from a metal railing replaced on a residential building in Porto."
    ),
    originCity: "Porto", assemblyTimeMinutes: 30, needsProAssembly: false, assemblySteps: STEPS_OUTDOOR,
    createdAt: "2025-09-09", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-013", code: "013", slug: "cadeira-jantar-013", categoryId: "dining-chair",
    price: 165, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "45 × 50 × 88 cm", weightKg: 6, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Cadeira de jantar de linhas simples, em carvalho recuperado, assento em madeira maciça.",
      "A simple-lined dining chair in recovered oak, solid wood seat."
    ),
    story: d(
      "Cada cadeira desta pequena série tem um padrão de veio ligeiramente diferente — nenhuma é igual à outra.",
      "Each chair in this small run has a slightly different grain pattern — no two are alike."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 20, needsProAssembly: false, assemblySteps: STEPS_CHAIR,
    createdAt: "2025-09-07", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-014", code: "014", slug: "cadeira-jantar-014", categoryId: "dining-chair",
    price: 165, status: "sold", oneOfOne: true, quantityAvailable: 1,
    dimensions: "45 × 50 × 88 cm", weightKg: 6, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Segunda cadeira da mesma série, com um nó natural visível no encosto.",
      "The second chair from the same run, with a natural knot visible on the backrest."
    ),
    story: d(
      "A marca escura no encosto é um nó natural da árvore original — mantido propositadamente.",
      "The dark mark on the backrest is a natural knot from the original tree — kept intentionally."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 20, needsProAssembly: false, assemblySteps: STEPS_CHAIR,
    createdAt: "2025-09-07", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-036", code: "036", slug: "movel-tv-036", categoryId: "tv-unit",
    price: 420, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "160 × 38 × 45 cm", weightKg: 34, materialTypeId: "mixed-timber", condition: "fair",
    description: d(
      "Móvel de TV suspenso, com duas portas de correr e acabamento em tons mistos de madeira.",
      "A wall-mounted TV unit with two sliding doors and a mixed-tone wood finish."
    ),
    story: d(
      "As diferentes tonalidades de madeira revelam a origem mista do material — paletes e cofragem de Sintra Norte.",
      "The different wood tones reveal the mixed origin of the material — pallets and formwork from Sintra Norte."
    ),
    originCity: "Sintra", assemblyTimeMinutes: 45, needsProAssembly: false, assemblySteps: STEPS_CABINET,
    createdAt: "2025-09-12", partnerId: "partner-obrafirme", projectId: "proj-sintra-norte",
  },
  {
    id: "prod-021", code: "021", slug: "secretaria-021", categoryId: "desk",
    price: 560, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "140 × 65 × 75 cm", weightKg: 39, materialTypeId: "construction-beam", condition: "good",
    description: d(
      "Secretária de estrutura robusta em pinho de viga, com uma gaveta ampla.",
      "A sturdy desk in beam pine, with one wide drawer."
    ),
    story: d(
      "A densidade do pinho de viga torna esta secretária notavelmente resistente ao uso diário.",
      "The density of the beam pine makes this desk notably resistant to daily use."
    ),
    originCity: "Porto", assemblyTimeMinutes: 40, needsProAssembly: false, assemblySteps: STEPS_TABLE,
    createdAt: "2025-08-24", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-019", code: "019", slug: "estante-alta-019", categoryId: "bookcase",
    price: 510, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "95 × 32 × 195 cm", weightKg: 37, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Estante alta de seis níveis, para escritório ou sala, em carvalho recuperado.",
      "A tall six-tier bookcase for office or living room, in recovered oak."
    ),
    story: d(
      "Uma das últimas peças produzidas com o lote original do soalho do Príncipe Real.",
      "One of the last pieces produced from the original Príncipe Real flooring batch."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 40, needsProAssembly: false, assemblySteps: STEPS_SHELF,
    createdAt: "2025-09-16", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
  {
    id: "prod-058", code: "058", slug: "poltrona-058", categoryId: "armchair",
    price: 390, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "75 × 80 × 82 cm", weightKg: 18, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Poltrona de estrutura em carvalho recuperado, estofo em linho natural.",
      "An armchair with a recovered oak frame and natural linen upholstery."
    ),
    story: d(
      "A estrutura provém de vigamento interior removido durante obras em Cascais.",
      "The frame comes from interior beam work removed during renovation in Cascais."
    ),
    originCity: "Cascais", assemblyTimeMinutes: 25, needsProAssembly: false, assemblySteps: STEPS_CHAIR,
    createdAt: "2025-08-18", partnerId: "partner-cascais-renova", projectId: "proj-vila-cascais-sul",
  },
  {
    id: "prod-033", code: "033", slug: "penteadeira-033", categoryId: "dressing-table",
    price: 350, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "100 × 45 × 140 cm", weightKg: 29, materialTypeId: "oak-timber", condition: "good",
    description: d(
      "Penteadeira com espelho integrado e duas gavetas, em carvalho recuperado.",
      "A dressing table with an integrated mirror and two drawers, in recovered oak."
    ),
    story: d(
      "A moldura do espelho reutiliza um recorte curvo do mesmo lote de madeira de Cascais.",
      "The mirror frame reuses a curved offcut from the same Cascais timber batch."
    ),
    originCity: "Cascais", assemblyTimeMinutes: 35, needsProAssembly: false, assemblySteps: STEPS_CABINET,
    createdAt: "2025-08-19", partnerId: "partner-cascais-renova", projectId: "proj-vila-cascais-sul",
  },
  {
    id: "prod-041", code: "041", slug: "modulo-arrumacao-041", categoryId: "storage-unit",
    price: 300, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "80 × 40 × 90 cm", weightKg: 26, materialTypeId: "mixed-timber", condition: "fair",
    description: d(
      "Módulo de arrumação com duas portas, em madeira mista de obra.",
      "A two-door storage unit in mixed construction timber."
    ),
    story: d(
      "Construído para maximizar o aproveitamento de peças curtas de cofragem.",
      "Built to make the most of short offcuts from formwork panels."
    ),
    originCity: "Sintra", assemblyTimeMinutes: 40, needsProAssembly: false, assemblySteps: STEPS_CABINET,
    createdAt: "2025-09-13", partnerId: "partner-obrafirme", projectId: "proj-sintra-norte",
  },
  {
    id: "prod-047", code: "047", slug: "prateleira-escritorio-047", categoryId: "office-shelf",
    price: 175, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "80 × 22 × 100 cm", weightKg: 11, materialTypeId: "pine-boards", condition: "good",
    description: d(
      "Prateleira de escritório com três níveis, em pinho de telhado tratado.",
      "A three-tier office shelf in treated roof pine."
    ),
    story: d(
      "Peça compacta, ideal para quem procura o início de uma coleção ReMade.",
      "A compact piece, ideal for anyone starting a ReMade collection."
    ),
    originCity: "Porto", assemblyTimeMinutes: 20, needsProAssembly: false, assemblySteps: STEPS_SHELF,
    createdAt: "2025-08-21", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-090", code: "090", slug: "mesa-pequena-090", categoryId: "small-table",
    price: 140, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "40 × 40 × 42 cm", weightKg: 8, materialTypeId: "ceramic-tile", condition: "excellent",
    description: d(
      "Mesa pequena de apoio, tampo em azulejo hidráulico, ideal para varandas ou cantos de leitura.",
      "A small side table with a hydraulic tile top, perfect for balconies or reading corners."
    ),
    story: d(
      "Reaproveita os recortes finais do azulejo do Chiado — sem desperdício.",
      "Reuses the final offcuts of the Chiado tile — nothing wasted."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 10, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-06-16", partnerId: "partner-mota-sil", projectId: "proj-alecrim",
  },
  {
    id: "prod-091", code: "091", slug: "prateleira-flutuante-091", categoryId: "floating-shelf",
    price: 110, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "80 × 22 × 5 cm", weightKg: 9, materialTypeId: "natural-stone", condition: "excellent",
    description: d(
      "Prateleira flutuante em lioz maciço, fixação oculta.",
      "A floating shelf in solid lioz limestone, hidden mounting."
    ),
    story: d(
      "Um corte fino do mesmo lioz da mesa de centro #027 — a mesma pedra, duas vidas diferentes.",
      "A thin cut from the same lioz as coffee table #027 — the same stone, two different lives."
    ),
    originCity: "Porto", assemblyTimeMinutes: 15, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-09-03", partnerId: "partner-norprado", projectId: "proj-foz-verde",
  },
  {
    id: "prod-099", code: "099", slug: "objeto-decorativo-099", categoryId: "decorative-object",
    price: 65, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "18 × 18 × 24 cm", weightKg: 2, materialTypeId: "metal-offcut", condition: "good",
    description: d(
      "Objeto escultural de mesa, feito a partir de recortes de perfil metálico soldados.",
      "A sculptural tabletop object, made from welded steel profile offcuts."
    ),
    story: d(
      "Nasceu dos pedaços demasiado pequenos para qualquer outro uso — a prova de que nada é só resíduo.",
      "Born from pieces too small for any other use — proof that nothing is just waste."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 5, needsProAssembly: false, assemblySteps: STEPS_SMALL,
    createdAt: "2025-09-17", partnerId: "partner-mota-sil", projectId: "proj-parque-nacoes",
  },
  {
    id: "prod-070", code: "070", slug: "mesa-exterior-070", categoryId: "outdoor-table",
    price: 610, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "180 × 90 × 74 cm", weightKg: 52, materialTypeId: "construction-beam", condition: "good",
    description: d(
      "Mesa de exterior para 6 pessoas, pinho de viga com tratamento hidrófugo.",
      "An outdoor table for 6, beam pine with a water-repellent treatment."
    ),
    story: d(
      "Pensada para uma vida ao ar livre em Cascais, mantendo o caráter bruto da viga original.",
      "Designed for outdoor living in Cascais, keeping the raw character of the original beam."
    ),
    originCity: "Cascais", assemblyTimeMinutes: 55, needsProAssembly: true, assemblySteps: STEPS_OUTDOOR,
    createdAt: "2025-08-16", partnerId: "partner-cascais-renova", projectId: "proj-vila-cascais-sul",
  },
  {
    id: "prod-060", code: "060", slug: "banco-bar-060", categoryId: "bar-stool",
    price: 130, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "35 × 35 × 75 cm", weightKg: 7, materialTypeId: "mixed-timber", condition: "fair",
    description: d(
      "Banco de bar alto, estrutura mista de madeira de obra.",
      "A tall bar stool with a mixed construction-timber frame."
    ),
    story: d(
      "Parte da mesma pequena série de Sintra Norte que o móvel de TV #036.",
      "Part of the same small Sintra Norte run as TV unit #036."
    ),
    originCity: "Sintra", assemblyTimeMinutes: 15, needsProAssembly: false, assemblySteps: STEPS_CHAIR,
    createdAt: "2025-09-14", partnerId: "partner-obrafirme", projectId: "proj-sintra-norte",
  },
  {
    id: "prod-016", code: "016", slug: "banco-jantar-016", categoryId: "dining-bench",
    price: 260, status: "available", oneOfOne: true, quantityAvailable: 1,
    dimensions: "150 × 35 × 45 cm", weightKg: 19, materialTypeId: "pine-boards", condition: "good",
    description: d(
      "Banco corrido de jantar para 3 pessoas, em pinho de telhado.",
      "A 3-seat dining bench in roof pine."
    ),
    story: d(
      "Combina com a mesa #024 em escala, ainda que feito de um lote de madeira diferente.",
      "Scaled to pair with table #024, though made from a different timber batch."
    ),
    originCity: "Lisboa", assemblyTimeMinutes: 25, needsProAssembly: false, assemblySteps: STEPS_BENCH,
    createdAt: "2025-09-08", partnerId: "partner-mota-sil", projectId: "proj-alfazema",
  },
];
