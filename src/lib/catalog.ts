/**
 * Catálogo da loja.
 *
 * Fase 1: os produtos vivem neste ficheiro (produtos de exemplo).
 * Fase 2/4: passam para a tabela `products` do Supabase e são geridos no /admin.
 * Os campos já seguem a estrutura dessa tabela, para a mudança ser simples.
 *
 * ATENÇÃO: todos os preços são indicativos e de exemplo — confirmar com o clube.
 */

export type CategoryId = "equipamentos" | "treino" | "agasalhos" | "polos" | "acessorios";

export const CATEGORIES: { id: CategoryId; name: string; description: string }[] = [
  { id: "equipamentos", name: "Equipamentos oficiais", description: "Os equipamentos de jogo do Camões, personalizáveis com nome e número." },
  { id: "treino", name: "Treino", description: "T-shirts de treino, calções e calças de fato de treino." },
  { id: "agasalhos", name: "Agasalhos", description: "Sweatshirts, casacos e blusões do clube." },
  { id: "polos", name: "Polos", description: "Polos oficiais para o dia a dia e deslocações." },
  { id: "acessorios", name: "Acessórios", description: "Cachecóis, mochilas e outros acessórios." },
];

export const KIDS_SIZES = ["4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"];
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
export const ALL_SIZES = [...KIDS_SIZES, ...ADULT_SIZES];
/** Produtos sem tamanhos (ex.: cachecol). */
export const ONE_SIZE = "Tamanho único";

export type Personalization = {
  /** Preço extra indicativo, em cêntimos. */
  priceCents: number;
  nameMaxLength: number;
  numberMin: number;
  numberMax: number;
};

export type ProductImage = { src: string; alt: string };

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
  personalization: Personalization | null;
  featured: boolean;
  active: boolean;
  images: ProductImage[];
};

const KIT_PERSONALIZATION: Personalization = { priceCents: 500, nameMaxLength: 12, numberMin: 1, numberMax: 99 };

export const PRODUCTS: Product[] = [
  {
    id: "p-equipamento-principal",
    slug: "equipamento-principal-amarelo",
    name: "Camisola oficial — Principal (amarela)",
    category: "equipamentos",
    description:
      "A camisola de jogo da equipa sénior do Camões Andebol: amarela com mangas azul-escuras. Personalizável com nome e número nas costas.",
    priceCents: 3500,
    sizes: ALL_SIZES,
    colors: [],
    personalization: KIT_PERSONALIZATION,
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
    name: "Camisola oficial — Alternativa (branca)",
    category: "equipamentos",
    description:
      "A camisola alternativa da equipa sénior: branca com detalhes azul-escuros. Personalizável com nome e número nas costas.",
    priceCents: 3500,
    sizes: ALL_SIZES,
    colors: [],
    personalization: KIT_PERSONALIZATION,
    featured: true,
    active: true,
    images: [
      { src: "/fotos/branco-23.jpg", alt: "Atleta do Camões Andebol com a camisola alternativa branca, número 23" },
      { src: "/fotos/cachecol-riscas.jpg", alt: "Atleta com a camisola alternativa branca e o cachecol do clube" },
    ],
  },
  {
    id: "p-sweat-clube",
    slug: "sweatshirt-clube",
    name: "Sweatshirt do clube",
    category: "agasalhos",
    description: "Sweatshirt com o símbolo do Camões Andebol. Disponível em preto e verde.",
    priceCents: 2500,
    sizes: ALL_SIZES,
    colors: ["Preto", "Verde"],
    personalization: null,
    featured: false,
    active: true,
    images: [
      { src: "/fotos/sweat-preta-1.jpg", alt: "Atleta com a sweatshirt preta do clube e uma bola de andebol" },
      { src: "/fotos/sweat-verde-99.jpg", alt: "Atleta com a sweatshirt verde do clube, número 99" },
    ],
  },
  {
    id: "p-cachecol-riscas",
    slug: "cachecol-riscas",
    name: "Cachecol às riscas",
    category: "acessorios",
    description: "Cachecol azul e amarelo às riscas, com o símbolo do Camões Andebol nas pontas.",
    priceCents: 1000,
    sizes: [ONE_SIZE],
    colors: [],
    personalization: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/cachecol-riscas.jpg", alt: "Atleta com o cachecol azul e amarelo às riscas do Camões Andebol" }],
  },
  {
    id: "p-cachecol-clube",
    slug: "cachecol-clube-desportivo-escolar-camoes",
    name: "Cachecol Clube Desportivo Escolar Camões",
    category: "acessorios",
    description: "Cachecol azul com o lema do clube: Educação · Superação · Formação · Competição.",
    priceCents: 1000,
    sizes: [ONE_SIZE],
    colors: [],
    personalization: null,
    featured: false,
    active: true,
    images: [{ src: "/fotos/cachecol-clube.jpg", alt: "Atleta a segurar o cachecol azul Clube Desportivo Escolar Camões" }],
  },
];

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
