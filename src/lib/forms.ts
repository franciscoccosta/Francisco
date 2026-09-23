/**
 * Form schemas shared by the client forms and the /api/submit handler, so
 * required fields and allowed options are defined once.
 */

export const PROFESSIONS = ["Architect", "Interior designer", "Landscape architect", "Developer", "Contractor", "Other"];

export const PROJECT_TYPES = ["Residential", "Hospitality", "Retail", "Office / workplace", "Cultural / public", "Furniture / product", "Other"];

export const WOOD_TYPES = ["Beams", "Flooring", "Doors", "Boards / planks", "Structural timber", "Other"];

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

export const PREMIUM = ["Yes", "Maybe", "No"];

type FieldSpec = { required?: boolean; options?: string[]; multi?: boolean; email?: boolean };

export const SCHEMAS = {
  supplier: {
    company: { required: true },
    contact: { required: true },
    email: { required: true, email: true },
    phone: {},
    location: { required: true },
    project: { required: true },
    woodType: { required: true, options: WOOD_TYPES, multi: true },
    quantity: { required: true },
    removalDate: {},
    notes: {},
  },
  buyer: {
    name: { required: true },
    studio: { required: true },
    email: { required: true, email: true },
    profession: { required: true, options: PROFESSIONS },
    projectType: { options: PROJECT_TYPES },
    projectLocation: {},
    woodType: { options: WOOD_TYPES, multi: true },
    quantity: {},
    dimensions: {},
    timeframe: { options: TIMEFRAMES },
    priorities: { options: PRIORITIES, multi: true },
    premium: { required: true, options: PREMIUM },
  },
  request: {
    name: { required: true },
    company: { required: true },
    email: { required: true, email: true },
    project: {},
    quantity: {},
    message: {},
  },
} satisfies Record<string, Record<string, FieldSpec>>;

export type FormType = keyof typeof SCHEMAS;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns cleaned values, or a map of field → error message. */
export function validate(type: FormType, form: FormData) {
  const schema = SCHEMAS[type] as Record<string, FieldSpec>;
  const values: Record<string, string | string[]> = {};
  const errors: Record<string, string> = {};

  for (const [key, spec] of Object.entries(schema)) {
    if (spec.multi) {
      const list = form
        .getAll(key)
        .map((v) => String(v).trim())
        .filter(Boolean)
        .slice(0, 20);
      const bad = spec.options && list.some((v) => !spec.options!.includes(v));
      if (bad) errors[key] = "Please choose from the list.";
      else if (spec.required && list.length === 0) errors[key] = "Please choose at least one.";
      values[key] = list;
      continue;
    }
    const value = String(form.get(key) ?? "").trim().slice(0, 2000);
    if (spec.required && !value) errors[key] = "Required";
    else if (value && spec.email && !EMAIL.test(value)) errors[key] = "Please enter a valid email.";
    else if (value && spec.options && !spec.options.includes(value)) errors[key] = "Please choose from the list.";
    values[key] = value;
  }
  return { values, errors, ok: Object.keys(errors).length === 0 };
}
