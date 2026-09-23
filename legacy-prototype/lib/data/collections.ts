import type { Collection } from "@/lib/types";

export const COLLECTIONS: Collection[] = [
  { id: "col-1", projectId: "proj-alfazema", materialTypeId: "pine-boards", quantity: 640, unit: "kg", date: "2025-09-24", status: "confirmed" },
  { id: "col-2", projectId: "proj-foz-verde", materialTypeId: "construction-beam", quantity: 12, unit: "units", date: "2025-09-19", status: "scheduled" },
  { id: "col-3", projectId: "proj-vila-cascais-sul", materialTypeId: "reclaimed-brick", quantity: 1800, unit: "units", date: "2025-10-08", status: "scheduled" },
  { id: "col-4", projectId: "proj-sintra-norte", materialTypeId: "mixed-timber", quantity: 260, unit: "kg", date: "2025-09-29", status: "delayed" },
  { id: "col-5", projectId: "proj-parque-nacoes", materialTypeId: "metal-offcut", quantity: 95, unit: "kg", date: "2025-11-04", status: "scheduled" },
  { id: "col-6", projectId: "proj-alecrim", materialTypeId: "ceramic-tile", quantity: 340, unit: "units", date: "2025-06-05", status: "completed" },
];
