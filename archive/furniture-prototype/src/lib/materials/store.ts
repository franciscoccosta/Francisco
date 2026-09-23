import type { Material } from "@/lib/types";

const KEY = "remade.partner-materials";

function readAll(): Material[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(materials: Material[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(materials));
  } catch {
    // ignore
  }
}

export function addMaterial(material: Material) {
  const all = readAll();
  all.unshift(material);
  writeAll(all);
}

export function addedMaterialsForPartner(partnerId: string): Material[] {
  return readAll().filter((m) => m.partnerId === partnerId);
}
