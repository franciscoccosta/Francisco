/**
 * Catálogo da loja.
 *
 * Fase 1: os produtos vivem neste ficheiro (produtos de exemplo).
 * Fase 2/4: passam para a tabela `products` do Supabase e são geridos no /admin.
 * Os campos já seguem a estrutura dessa tabela, para a mudança ser simples.
 *
 * Preços definidos pela direção do clube.
 */

export type CategoryId = "equipamentos" | "kit-saida" | "agasalhos" | "acessorios";

export const CATEGORIES: { id: CategoryId; name: string; description: string }[] = [
  { id: "equipamentos", name: "Equipamentos oficiais", description: "Os equipamentos de jogo do Camões, personalizáveis com nome e número." },
  { id: "kit-saida", name: "Kit saída", description: "Polo, t-shirt e fato de treino do clube para deslocações e o dia a dia." },
  { id: "agasalhos", name: "Agasalhos", description: "Casacos, blusão de inverno e sweatshirts do clube, com ou sem capuz." },
  { id: "acessorios", name: "Acessórios", description: "Equipamento de treino (completo ou em peças), calças de fato de treino, quarter zip, meias, mochila, camisola e colete térmicos e cachecol." },
];

export const KIDS_SIZES = ["4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"];
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
export const ALL_SIZES = [...KIDS_SIZES, ...ADULT_SIZES];
/** Tamanhos de meias (número de calçado). */
export const SOCK_SIZES = ["27-30", "31-34", "35-38", "39-42", "43-46"];
/** Produtos sem tamanhos (ex.: cachecol). */
export const ONE_SIZE = "Tamanho único";

/**
 * Uma opção de personalização (ex.: "Nome e número nas costas", "Número nos calções").
 * Cada opção é escolhida à parte e tem o seu preço extra.
 */
export type PersonalizationOption = {
  id: string;
  label: string;
  /** Preço extra, em cêntimos. */
  priceCents: number;
  /** Pede nome (máx. de caracteres) — null se a opção é só número. */
  nameMaxLength: number | null;
  /** Se definido, a pessoa escolhe número OU iniciais (até N letras), pelo mesmo preço. */
  initialsMaxLength?: number | null;
  numberMin: number;
  numberMax: number;
};

/** Fotografia; `color` liga-a a uma cor, para a galeria mudar quando se escolhe a cor. */
export type ProductImage = { src: string; alt: string; color?: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Preço, em cêntimos (evita erros de arredondamento). */
  priceCents: number;
  sizes: string[];
  colors: string[];
  personalization: PersonalizationOption[];
  /** O que está incluído no preço (ex.: camisola + calções). */
  includes: string | null;
  featured: boolean;
  active: boolean;
  images: ProductImage[];
};

/** Personalização à frente: número ou iniciais, ao mesmo preço (2 €). */
const front = (id: string, where = "à frente"): PersonalizationOption => ({
  id,
  label: `Número ou iniciais ${where}`,
  priceCents: 200,
  nameMaxLength: null,
  initialsMaxLength: 3,
  numberMin: 1,
  numberMax: 99,
});

const KIT_BACK: PersonalizationOption = { id: "costas", label: "Nome e número nas costas", priceCents: 300, nameMaxLength: 12, numberMin: 1, numberMax: 99 };

export const PRODUCTS: Product[] = [
  {
    id: "p-equipamento-principal",
    slug: "equipamento-principal-amarelo",
    name: "Equipamento oficial — Principal (amarelo)",
    category: "equipamentos",
    description:
      "O equipamento de jogo da equipa sénior do Camões Andebol: camisola amarela com mangas azul-escuras e calções. Os calções estão incluídos no preço. Personalizável com nome e número nas costas da camisola.",
    priceCents: 3500,
    sizes: ALL_SIZES,
    colors: [],
    personalization: [KIT_BACK],
    includes: "Camisola + calções",
    featured: true,
    active: true,
    images: [
      { src: "/fotos/amarelo-10.jpg", alt: "Atleta do Camões Andebol com a camisola principal amarela, número 10" },
      { src: "/fotos/amarelo-22.jpg", alt: "Atleta com a camisola principal amarela, número 22, de braços cruzados" },
      { src: "/fotos/amarelo-78.jpg", alt: "Atleta com a camisola principal amarela, número 78" },
      { src: "/fotos/amarelo-9.jpg", alt: "Atleta com a camisola principal amarela, número 9" },
    ],
  },
  {
    id: "p-equipamento-alternativo",
    slug: "equipamento-alternativo-branco",
    name: "Equipamento oficial — Alternativo (branco)",
    category: "equipamentos",
    description:
      "O equipamento alternativo da equipa sénior: camisola branca com detalhes azul-escuros e calções. Os calções estão incluídos no preço. Personalizável com nome e número nas costas da camisola.",
    priceCents: 3500,
    sizes: ALL_SIZES,
    colors: [],
    personalization: [KIT_BACK],
    includes: "Camisola + calções",
    featured: true,
    active: true,
    images: [
      { src: "/fotos/branco-23.jpg", alt: "Atleta do Camões Andebol com a camisola alternativa branca, número 23" },
      { src: "/fotos/branco-17.jpg", alt: "Atleta com a camisola alternativa branca, número 17, de punho erguido" },
      { src: "/fotos/branco-16.jpg", alt: "Atleta com a camisola alternativa branca, número 16, a segurar uma bola de andebol" },
      { src: "/fotos/branco-31.jpg", alt: "Atleta com a camisola alternativa branca, número 31, a rodar a bola no dedo" },
    ],
  },
  {
    id: "p-equipamento-treino",
    slug: "equipamento-treino",
    name: "Equipamento de treino",
    category: "acessorios",
    description:
      "T-shirt e calções de treino com o símbolo do Camões Andebol. Os calções estão incluídos no preço. Podes personalizar com o número ou as iniciais à frente na t-shirt e nos calções.",
    priceCents: 2200,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro"],
    personalization: [
      front("numero", "na t-shirt (à frente) e nos calções"),
    ],
    includes: "T-shirt + calções",
    featured: false,
    active: true,
    images: [
      { src: "/fotos/treino-amarelo.jpg", alt: "Equipamento de treino amarelo do Camões Andebol: t-shirt e calções", color: "Amarelo" },
      { src: "/fotos/treino-azul-escuro.jpg", alt: "Equipamento de treino azul-escuro do Camões Andebol: t-shirt e calções", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-tshirt-treino",
    slug: "tshirt-treino",
    name: "T-shirt de treino",
    category: "acessorios",
    description: "A t-shirt do equipamento de treino, vendida em separado, com o símbolo do Camões Andebol. Pode ser personalizada com o número ou as iniciais à frente.",
    priceCents: 1300,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro"],
    personalization: [front("numero-tshirt-treino")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/treino-tshirt-amarelo.jpg", alt: "T-shirt de treino amarela com o símbolo do Camões Andebol", color: "Amarelo" },
      { src: "/fotos/treino-tshirt-azul-escuro.jpg", alt: "T-shirt de treino azul-escura com o símbolo do Camões Andebol", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-calcoes-treino",
    slug: "calcoes-treino",
    name: "Calções de treino",
    category: "acessorios",
    description: "Os calções do equipamento de treino, vendidos em separado, com o símbolo do Camões Andebol. Podem ser personalizados com o número ou as iniciais.",
    priceCents: 1200,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro"],
    personalization: [front("numero-calcoes-treino", "nos calções")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/treino-calcoes-amarelo.jpg", alt: "Calções de treino amarelos com o símbolo do Camões Andebol", color: "Amarelo" },
      { src: "/fotos/treino-calcoes-azul-escuro.jpg", alt: "Calções de treino azul-escuros com o símbolo do Camões Andebol", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-calcas-fato-treino",
    slug: "calcas-fato-treino",
    name: "Calças de fato de treino",
    category: "acessorios",
    description: "Calças de fato de treino pretas, com o símbolo do Camões Andebol.",
    priceCents: 2300,
    sizes: ALL_SIZES,
    colors: ["Preto"],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/calcas-fato-treino-preto.jpg", alt: "Calças de fato de treino pretas com o símbolo do Camões Andebol", color: "Preto" }],
  },
  {
    id: "p-pack-meias",
    slug: "pack-meias",
    name: "Pack de meias (3 pares)",
    category: "acessorios",
    description: "Pack com 3 pares de meias com o símbolo do Camões Andebol em amarelo. Disponível em preto ou azul-escuro.",
    priceCents: 800,
    sizes: SOCK_SIZES,
    colors: ["Preto", "Azul-escuro"],
    personalization: [],
    includes: "3 pares",
    featured: false,
    active: true,
    images: [
      { src: "/fotos/meias-preto.jpg", alt: "Pack de 3 pares de meias pretas com o símbolo do Camões Andebol em amarelo", color: "Preto" },
      { src: "/fotos/meias-azul-escuro.jpg", alt: "Pack de 3 pares de meias azul-escuras com o símbolo do Camões Andebol em amarelo", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-quarter-zip",
    slug: "quarter-zip",
    name: "Quarter zip",
    category: "acessorios",
    description: "Camisola de treino com meio fecho (quarter zip) e o símbolo do Camões Andebol. Pode ser personalizada com o número ou as iniciais à frente.",
    priceCents: 2500,
    sizes: ALL_SIZES,
    colors: ["Azul-escuro", "Preto"],
    personalization: [front("numero-frente")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/quarter-zip-azul-escuro.jpg", alt: "Quarter zip azul-escuro com o símbolo do Camões Andebol", color: "Azul-escuro" },
      { src: "/fotos/quarter-zip-preto.jpg", alt: "Quarter zip preto com o símbolo do Camões Andebol", color: "Preto" },
    ],
  },
  {
    id: "p-kit-saida",
    slug: "kit-saida",
    name: "Kit saída — Polo + calções",
    category: "kit-saida",
    description:
      "O kit de saída do Camões Andebol: polo e calções da mesma cor, com o símbolo do clube. Os calções estão incluídos no preço. O polo pode ser personalizado com o número ou as iniciais à frente.",
    priceCents: 2800,
    sizes: ALL_SIZES,
    colors: ["Azul-escuro", "Branco", "Preto", "Amarelo"],
    personalization: [
      front("numero-polo", "à frente no polo"),
    ],
    includes: "Polo + calções",
    featured: false,
    active: true,
    images: [
      { src: "/fotos/kit-saida-azul-escuro.jpg", alt: "Kit saída azul-escuro do Camões Andebol: polo e calções", color: "Azul-escuro" },
      { src: "/fotos/kit-saida-branco.jpg", alt: "Kit saída branco do Camões Andebol: polo e calções", color: "Branco" },
      { src: "/fotos/kit-saida-preto.jpg", alt: "Kit saída preto do Camões Andebol: polo e calções", color: "Preto" },
      { src: "/fotos/kit-saida-amarelo.jpg", alt: "Kit saída amarelo do Camões Andebol: polo e calções", color: "Amarelo" },
    ],
  },
  {
    id: "p-tshirt-algodao",
    slug: "tshirt-algodao",
    name: "T-shirt de algodão",
    category: "kit-saida",
    description: "T-shirt simples de algodão com o símbolo do Camões Andebol. Pode ser personalizada com o número ou as iniciais à frente.",
    priceCents: 1400,
    sizes: ALL_SIZES,
    colors: ["Preto", "Azul-escuro", "Amarelo"],
    personalization: [front("numero-tshirt")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/tshirt-preto.jpg", alt: "T-shirt de algodão preta com o símbolo do Camões Andebol", color: "Preto" },
      { src: "/fotos/tshirt-azul-escuro.jpg", alt: "T-shirt de algodão azul-escura com o símbolo do Camões Andebol", color: "Azul-escuro" },
      { src: "/fotos/tshirt-amarelo.jpg", alt: "T-shirt de algodão amarela com o símbolo do Camões Andebol", color: "Amarelo" },
    ],
  },
  {
    id: "p-fato-treino-saida",
    slug: "fato-treino-saida",
    name: "Kit fato de treino saída",
    category: "kit-saida",
    description:
      "Fato de treino de saída em algodão: casaco com capuz e fecho, e calças, com o símbolo do Camões Andebol. As calças estão incluídas no preço. Pode ser personalizado com o número ou as iniciais à frente no casaco e nas calças.",
    priceCents: 4200,
    sizes: ALL_SIZES,
    colors: ["Azul-escuro", "Preto"],
    personalization: [
      front("numero-fato", "à frente no casaco e nas calças"),
    ],
    includes: "Casaco + calças",
    featured: false,
    active: true,
    images: [
      { src: "/fotos/fato-saida-azul-escuro.jpg", alt: "Fato de treino de saída azul-escuro do Camões Andebol: casaco e calças", color: "Azul-escuro" },
      { src: "/fotos/fato-saida-preto.jpg", alt: "Fato de treino de saída preto do Camões Andebol: casaco e calças", color: "Preto" },
    ],
  },
  {
    id: "p-softshell",
    slug: "casaco-softshell",
    name: "Casaco softshell",
    category: "agasalhos",
    description: "Casaco softshell com capuz e fecho, com o símbolo do Camões Andebol. Pode ser personalizado com o número ou as iniciais à frente.",
    priceCents: 4000,
    sizes: ALL_SIZES,
    colors: ["Preto", "Azul-escuro"],
    personalization: [front("numero-frente")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/softshell-preto.jpg", alt: "Casaco softshell preto com o símbolo do Camões Andebol", color: "Preto" },
      { src: "/fotos/softshell-azul-escuro.jpg", alt: "Casaco softshell azul-escuro com o símbolo do Camões Andebol", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-casaco-hibrido",
    slug: "casaco-hibrido",
    name: "Casaco híbrido",
    category: "agasalhos",
    description: "Casaco com frente e costas ligeiramente acolchoadas, mangas raglan e capuz em tecido técnico com forro em microfibra. Acabamento elástico no capuz e nos punhos. Com o símbolo do Camões Andebol.",
    priceCents: 4500,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Azul-escuro/Azul", "Preto/Cinzento"],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/casaco-combinado-azul-escuro-azul.jpg", alt: "Casaco híbrido azul-escuro com mangas azuis e o símbolo do Camões Andebol", color: "Azul-escuro/Azul" },
      { src: "/fotos/casaco-combinado-preto-cinzento.jpg", alt: "Casaco híbrido preto com mangas cinzentas e o símbolo do Camões Andebol", color: "Preto/Cinzento" },
    ],
  },
  {
    id: "p-blusao-inverno",
    slug: "blusao-inverno",
    name: "Blusão de inverno",
    category: "agasalhos",
    description: "Blusão acolchoado com capuz, repelente à água. Fecho frontal com cursor bidirecional, punhos elásticos, bolsos laterais com fecho e bolso interior. Com o símbolo do Camões Andebol.",
    priceCents: 5500,
    sizes: [...KIDS_SIZES, "16 anos", "S", "M", "L", "XL", "XXL"],
    colors: ["Azul-escuro"],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/blusao-azul-escuro.jpg", alt: "Blusão de inverno azul-escuro com capuz e o símbolo do Camões Andebol", color: "Azul-escuro" },
    ],
  },
  {
    id: "p-sweat-capuz",
    slug: "sweatshirt-com-capuz",
    name: "Sweatshirt com capuz",
    category: "agasalhos",
    description: "Sweatshirt com capuz e bolso à frente, com o símbolo do Camões Andebol. Pode ser personalizada com o número ou as iniciais à frente.",
    priceCents: 2600,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro", "Preto", "Branco"],
    personalization: [front("numero-frente")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/sweat-capuz-amarelo.jpg", alt: "Sweatshirt com capuz amarela com o símbolo do Camões Andebol", color: "Amarelo" },
      { src: "/fotos/sweat-capuz-azul-escuro.jpg", alt: "Sweatshirt com capuz azul-escura com o símbolo do Camões Andebol", color: "Azul-escuro" },
      { src: "/fotos/sweat-capuz-preto.jpg", alt: "Sweatshirt com capuz preta com o símbolo do Camões Andebol", color: "Preto" },
      { src: "/fotos/sweat-capuz-branco.jpg", alt: "Sweatshirt com capuz branca com o símbolo do Camões Andebol", color: "Branco" },
    ],
  },
  {
    id: "p-sweat",
    slug: "sweatshirt-sem-capuz",
    name: "Sweatshirt sem capuz",
    category: "agasalhos",
    description: "Sweatshirt de gola redonda, sem capuz, com o símbolo do Camões Andebol. Pode ser personalizada com o número ou as iniciais à frente.",
    priceCents: 2200,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro", "Preto", "Branco"],
    personalization: [front("numero-frente")],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/sweat-amarelo.jpg", alt: "Sweatshirt sem capuz amarela com o símbolo do Camões Andebol", color: "Amarelo" },
      { src: "/fotos/sweat-azul-escuro.jpg", alt: "Sweatshirt sem capuz azul-escura com o símbolo do Camões Andebol", color: "Azul-escuro" },
      { src: "/fotos/sweat-preto.jpg", alt: "Sweatshirt sem capuz preta com o símbolo do Camões Andebol", color: "Preto" },
      { src: "/fotos/sweat-branco.jpg", alt: "Sweatshirt sem capuz branca com o símbolo do Camões Andebol", color: "Branco" },
    ],
  },
  {
    id: "p-camisola-termica",
    slug: "camisola-termica",
    name: "Camisola térmica",
    category: "acessorios",
    description: "Camisola térmica de manga comprida, para usar por baixo do equipamento, com o símbolo do Camões Andebol. Disponível em amarelo, branco e azul.",
    priceCents: 1000,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Branco", "Azul"],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/termica-amarelo.jpg", alt: "Camisola térmica amarela com o símbolo do Camões Andebol", color: "Amarelo" },
      { src: "/fotos/termica-branco.jpg", alt: "Camisola térmica branca com o símbolo do Camões Andebol", color: "Branco" },
      { src: "/fotos/termica-azul.jpg", alt: "Camisola térmica azul com o símbolo do Camões Andebol", color: "Azul" },
    ],
  },
  {
    id: "p-mochila",
    slug: "mochila",
    name: "Mochila",
    category: "acessorios",
    description: "Mochila azul-escura com o símbolo do Camões Andebol, compartimento principal e compartimento inferior separado.",
    priceCents: 2300,
    sizes: [ONE_SIZE],
    colors: ["Azul-escuro"],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/mochila-azul-escuro.jpg", alt: "Mochila azul-escura com o símbolo do Camões Andebol", color: "Azul-escuro" }],
  },
  {
    id: "p-colete",
    slug: "colete-termico",
    name: "Colete térmico",
    category: "acessorios",
    description: "Colete térmico com o símbolo do Camões Andebol.",
    priceCents: 800,
    sizes: ALL_SIZES,
    colors: [],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/colete.jpg", alt: "Colete térmico com o símbolo do Camões Andebol" }],
  },
  {
    id: "p-cachecol-riscas",
    slug: "cachecol-riscas",
    name: "Cachecol às riscas",
    category: "acessorios",
    description: "Cachecol azul e amarelo às riscas, com o símbolo do Camões Andebol nas pontas.",
    priceCents: 800,
    sizes: [ONE_SIZE],
    colors: [],
    personalization: [],
    includes: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/cachecol-riscas.jpg", alt: "Atleta com o cachecol azul e amarelo às riscas do Camões Andebol" }],
  },
];

/** Fotografias a mostrar para a cor escolhida (a da cor primeiro). */
export function imagesFor(p: Product, color?: string | null) {
  if (!color) return p.images;
  const own = p.images.filter((i) => i.color === color);
  return own.length ? [...own, ...p.images.filter((i) => i.color !== color && !i.color)] : p.images;
}

/**
 * Montra: nos cartões dos artigos aparece sempre a versão amarela ou azul (as outras cores
 * veem-se na página do artigo). Quando um artigo tem as duas, vai alternando — pela ordem da
 * loja — para a montra não ficar toda da mesma cor.
 */
const SHOWCASE = new Map<string, string>();
{
  let lastYellow = false;
  for (const c of CATEGORIES)
    for (const p of PRODUCTS.filter((x) => x.category === c.id && x.active)) {
      const yellow = p.colors.find((x) => x === "Amarelo");
      const blue = p.colors.find((x) => x.startsWith("Azul"));
      const pick: string | undefined = yellow && blue ? (lastYellow ? blue : yellow) : (yellow ?? blue);
      if (!pick) continue;
      SHOWCASE.set(p.id, pick);
      lastYellow = pick === yellow;
    }
}
export const showcaseColor = (p: Product) => SHOWCASE.get(p.id) ?? p.colors[0] ?? "";
export const showcaseImage = (p: Product) => imagesFor(p, showcaseColor(p))[0];

export const activeProducts = () => PRODUCTS.filter((p) => p.active);
export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug && p.active);
export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id && p.active);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

/** Escalões do andebol português (a confirmar com o clube). */
export const AGE_GROUPS = [
  { id: "bambis", name: "Bambis", minor: true },
  { id: "minis", name: "Minis", minor: true },
  { id: "infantis", name: "Infantis", minor: true },
  { id: "iniciados", name: "Iniciados", minor: true },
  { id: "juvenis", name: "Juvenis", minor: true },
  { id: "juniores", name: "Juniores", minor: null },
  { id: "seniores", name: "Seniores", minor: false },
  { id: "veteranos", name: "Veteranos", minor: false },
  { id: "apoiante", name: "Apoiante", minor: null },
] as const;

export type AgeGroupId = (typeof AGE_GROUPS)[number]["id"];
