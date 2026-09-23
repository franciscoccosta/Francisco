/** Shared form definitions: option lists used by the UI and the API validator. */

export const WOOD_TYPES = [
  "Beams",
  "Flooring",
  "Doors",
  "Boards / planks",
  "Structural timber",
  "Window frames / joinery",
  "Other / not sure",
];

export const PROFESSIONS = ["Architect", "Interior designer", "Landscape architect", "Contractor / builder", "Developer", "Furniture maker", "Other"];

export const PROJECT_TYPES = ["Residential", "Hospitality", "Retail", "Office / workplace", "Cultural / public", "Furniture / object", "Other"];

export const TIMEFRAMES = ["As soon as possible", "Within 3 months", "3–6 months", "6–12 months", "Just exploring"];

export const PRIORITIES = [
  "Price",
  "Sustainability",
  "Unique appearance",
  "History / provenance",
  "Material quality",
  "Local sourcing",
  "CO₂ savings",
];

export const PREMIUM_OPTIONS = ["Yes", "Maybe", "No"];

type Spec = { required: string[]; optional: string[]; lists?: string[] };

export const FORM_SPECS: Record<"supplier" | "designer" | "material_request", Spec> = {
  supplier: {
    required: ["company", "contact", "email", "projectLocation", "projectName", "woodType", "quantity"],
    optional: ["phone", "removalDate", "notes"],
  },
  designer: {
    required: ["name", "email", "profession", "woodType", "priorities", "premium"],
    optional: ["studio", "projectType", "projectLocation", "quantity", "dimensions", "timeframe"],
    lists: ["priorities"],
  },
  material_request: {
    required: ["name", "email", "materialId"],
    optional: ["company", "project", "quantity", "message"],
  },
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
