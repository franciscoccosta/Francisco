export type LocalizedText = { pt: string; en: string };

export type ProductStatus = "available" | "reserved" | "sold";
export type Condition = "excellent" | "good" | "fair";

export interface AssemblyStep {
  title: LocalizedText;
  detail: LocalizedText;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  categoryId: string;
  price: number;
  status: ProductStatus;
  oneOfOne: boolean;
  quantityAvailable: number;
  dimensions: string;
  weightKg: number;
  materialTypeId: string;
  condition: Condition;
  description: LocalizedText;
  story: LocalizedText;
  originCity: string;
  assemblyTimeMinutes: number;
  needsProAssembly: boolean;
  assemblySteps: AssemblyStep[];
  createdAt: string;
  partnerId: string;
  projectId: string;
}

export type MaterialStatus =
  | "processing"
  | "available"
  | "matched"
  | "collection"
  | "sold"
  | "recycled"
  | "rejected";

export type MaterialUnit = "kg" | "units" | "m" | "m2" | "m3";

export interface FurniturePossibility {
  categoryId: string;
  usagePercent: number;
  estimatedPrice: number;
}

export interface Material {
  id: string;
  materialTypeId: string;
  quantity: number;
  unit: MaterialUnit;
  dimensions: string;
  condition: Condition;
  projectId: string;
  partnerId: string;
  location: string;
  availableFrom: string;
  notes: string;
  status: MaterialStatus;
  confidence: number;
  routeFurniture: "high" | "medium" | "low";
  routeConstruction: "high" | "medium" | "low";
  routeRecycling: "high" | "medium" | "low";
  possibilities: FurniturePossibility[];
  createdAt: string;
}

export type CollectionStatus = "scheduled" | "confirmed" | "delayed" | "completed";

export interface Project {
  id: string;
  name: string;
  partnerId: string;
  location: string;
  expectedMaterialTons: number;
  availableMaterialKg: number;
  processingStatus: "planning" | "active" | "completed";
  collectionStatus: CollectionStatus;
  startDate: string;
}

export interface Collection {
  id: string;
  projectId: string;
  materialTypeId: string;
  quantity: number;
  unit: MaterialUnit;
  date: string;
  status: CollectionStatus;
}

export interface Partner {
  id: string;
  companyName: string;
  email: string;
  city: string;
  activeSince: string;
}

export interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "processing" | "preparing" | "shipped" | "delivered";

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingCity: string;
}
