export { PRODUCTS } from "./products";
export { MATERIALS } from "./materials";
export { PROJECTS } from "./projects";
export { PARTNERS } from "./partners";
export { COLLECTIONS } from "./collections";

import { PRODUCTS } from "./products";
import { PROJECTS } from "./projects";
import { PARTNERS } from "./partners";
import { MATERIALS } from "./materials";
import { COLLECTIONS } from "./collections";
import type { Product } from "@/lib/types";

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProjectById(id: string) {
  return PROJECTS.find((p) => p.id === id);
}

export function getPartnerById(id: string) {
  return PARTNERS.find((p) => p.id === id);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id && p.status === "available")
    .sort((a, b) => {
      const aScore = a.categoryId === product.categoryId ? 0 : 1;
      const bScore = b.categoryId === product.categoryId ? 0 : 1;
      return aScore - bScore;
    })
    .slice(0, limit);
}

export function materialsForPartner(partnerId: string) {
  return MATERIALS.filter((m) => m.partnerId === partnerId);
}

export function projectsForPartner(partnerId: string) {
  return PROJECTS.filter((p) => p.partnerId === partnerId);
}

export function collectionsForPartner(partnerId: string) {
  const projectIds = new Set(projectsForPartner(partnerId).map((p) => p.id));
  return COLLECTIONS.filter((c) => projectIds.has(c.projectId));
}

export function productsForPartner(partnerId: string) {
  return PRODUCTS.filter((p) => p.partnerId === partnerId);
}
