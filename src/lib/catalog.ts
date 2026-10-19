/**
 * Catálogo da loja.
 *
 * Fase 1: os produtos vivem neste ficheiro (produtos de exemplo).
 * Fase 2/4: passam para a tabela `products` do Supabase e são geridos no /admin.
 * Os campos já seguem a estrutura dessa tabela, para a mudança ser simples.
 *
 * ATENÇÃO: todos os preços são indicativos e de exemplo — confirmar com o clube.
 */

export type CategoryId = "equipamentos" | "kit-saida" | "agasalhos" | "acessorios";

export const CATEGORIES: { id: CategoryId; name: string; description: string }[] = [
  { id: "equipamentos", name: "Equipamentos oficiais", description: "Os equipamentos de jogo do Camões, personalizáveis com nome e número." },
  { id: "kit-saida", name: "Kit saída", description: "Polo, t-shirt e fato de treino do clube para deslocações e o dia a dia." },
  { id: "agasalhos", name: "Agasalhos", description: "Sweatshirts, casacos e blusões do clube." },
  { id: "acessorios", name: "Acessórios", description: "Equipamento de treino, mochila, camisolas e coletes térmicos e cachecol." },
];

export const KIDS_SIZES = ["4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"];
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
export const ALL_SIZES = [...KIDS_SIZES, ...ADULT_SIZES];
/** Produtos sem tamanhos (ex.: cachecol). */
export const ONE_SIZE = "Tamanho único";

/**
 * Uma opção de personalização (ex.: "Nome e número nas costas", "Número nos calções").
 * Cada opção é escolhida à parte e tem o seu preço extra.
 */
export type PersonalizationOption = {
  id: string;
  label: string;
  /** Preço extra indicativo, em cêntimos. */
  priceCents: number;
  /** Pede nome (máx. de caracteres) — null se a opção é só número. */
  nameMaxLength: number | null;
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
  /** Preço indicativo, em cêntimos (evita erros de arredondamento). */
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

const KIT_BACK: PersonalizationOption = { id: "costas", label: "Nome e número nas costas", priceCents: 300, nameMaxLength: 12, numberMin: 1, numberMax: 99 };

export const PRODUCTS: Product[] = [
  {
    id: "p-equipamento-principal",
    slug: "equipamento-principal-amarelo",
    name: "Equipamento oficial — Principal (amarelo)",
    category: "equipamentos",
    description:
      "O equipamento de jogo da equipa sénior do Camões Andebol: camisola amarela com mangas azul-escuras e calções. Os calções estão incluídos no preço. Personalizável com nome e número nas costas da camisola.",
    priceCents: 3000,
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
    priceCents: 3000,
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
      "T-shirt e calções de treino com o símbolo do Camões Andebol. Os calções estão incluídos no preço. Podes personalizar com o número à frente na t-shirt e nos calções.",
    priceCents: 1500,
    sizes: ALL_SIZES,
    colors: ["Amarelo", "Azul-escuro"],
    personalization: [
      { id: "numero", label: "Número na t-shirt (à frente) e nos calções", priceCents: 200, nameMaxLength: null, numberMin: 1, numberMax: 99 },
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
    id: "p-kit-saida",
    slug: "kit-saida",
    name: "Kit saída — Polo + calções",
    category: "kit-saida",
    description:
      "O kit de saída do Camões Andebol: polo e calções da mesma cor, com o símbolo do clube. Os calções estão incluídos no preço. O polo pode ser personalizado com o número à frente.",
    priceCents: 2200,
    sizes: ALL_SIZES,
    colors: ["Azul-escuro", "Branco", "Preto", "Amarelo"],
    personalization: [
      { id: "numero-polo", label: "Número à frente no polo", priceCents: 200, nameMaxLength: null, numberMin: 1, numberMax: 99 },
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
    description: "T-shirt simples de algodão com o símbolo do Camões Andebol. Pode ser personalizada com o número à frente.",
    priceCents: 1200,
    sizes: ALL_SIZES,
    colors: ["Preto", "Azul-escuro", "Amarelo"],
    personalization: [{ id: "numero-tshirt", label: "Número à frente", priceCents: 200, nameMaxLength: null, numberMin: 1, numberMax: 99 }],
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
      "Fato de treino de saída em algodão: casaco com capuz e fecho, e calças, com o símbolo do Camões Andebol. As calças estão incluídas no preço. Pode ser personalizado com o número à frente no casaco e nas calças.",
    priceCents: 4000,
    sizes: ALL_SIZES,
    colors: ["Azul-escuro", "Preto"],
    personalization: [
      { id: "numero-fato", label: "Número à frente no casaco e nas calças", priceCents: 200, nameMaxLength: null, numberMin: 1, numberMax: 99 },
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
    priceCents: 2000,
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
