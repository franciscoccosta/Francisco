import type { MaterialType } from "@/lib/i18n/materials";

export type Swatch = MaterialType["swatch"];

export interface MaterialVisual {
  base: string;
  light: string;
  dark: string;
  filter: string;
  blend: "multiply" | "overlay" | "soft-light";
  opacity: number;
}

export const MATERIAL_VISUALS: Record<Swatch, MaterialVisual> = {
  oak: { base: "#9c7248", light: "#b98a5c", dark: "#5f4127", filter: "url(#mat-fiber-lit)", blend: "multiply", opacity: 0.8 },
  pine: { base: "#c6a06a", light: "#dab881", dark: "#87652f", filter: "url(#mat-fiber-lit)", blend: "multiply", opacity: 0.72 },
  "mixed-timber": { base: "#a3805a", light: "#c3a074", dark: "#5f4426", filter: "url(#mat-fiber-lit)", blend: "multiply", opacity: 0.75 },
  beam: { base: "#7a5330", light: "#93683f", dark: "#43301b", filter: "url(#mat-fiber-lit)", blend: "multiply", opacity: 0.82 },
  tile: { base: "#c2ab8c", light: "#d9c6a8", dark: "#6f6252", filter: "url(#mat-mottle-fine)", blend: "overlay", opacity: 0.3 },
  brick: { base: "#a85b41", light: "#c47a5c", dark: "#6c3c29", filter: "url(#mat-mottle-coarse)", blend: "multiply", opacity: 0.4 },
  metal: { base: "#84888c", light: "#c4c7cb", dark: "#3f4245", filter: "url(#mat-brushed-lit)", blend: "multiply", opacity: 0.85 },
  stone: { base: "#e6dfcd", light: "#f2ecdc", dark: "#8f8570", filter: "url(#mat-veins)", blend: "multiply", opacity: 0.26 },
};
