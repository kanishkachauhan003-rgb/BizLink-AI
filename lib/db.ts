import { getDatabase } from "@/lib/mongodb";
import { categories, ecoAlternatives, guides, materials, boxes, accessories, suppliers, businesses } from "@/lib/seed-data";
import type { Accessory, Business, PackagingBox, PackagingGuide, PackagingMaterial, SearchFilters, Supplier } from "@/types";

async function getMongo<T>(collection: string, query: object) {
  try {
    const db = await getDatabase();
    const data = await db.collection(collection).find(query).limit(100).toArray();
    return data as T[];
  } catch (error) {
    return null;
  }
}

export async function getMaterials(filters: SearchFilters & { query: string }) {
  const mongoResults = await getMongo<PackagingMaterial>("materials", {});
  if (mongoResults) {
    return mongoResults;
  }
  return materials;
}

export async function getMaterialById(id: string) {
  const mongoResults = await getMongo<PackagingMaterial>("materials", { id });
  if (mongoResults?.length) {
    return mongoResults[0];
  }
  return materials.find((item) => item.id === id) ?? null;
}

export async function getSupplierById(id: string) {
  const mongoResults = await getMongo<Supplier>("suppliers", { id });
  if (mongoResults?.length) {
    return mongoResults[0];
  }
  return suppliers.find((item) => item.id === id) ?? null;
}

export async function getGuideForBusinessType(businessType: string) {
  const mongoResults = await getMongo<PackagingGuide>("guides", { businessType });
  if (mongoResults?.length) {
    return mongoResults[0];
  }
  return guides.find((item) => item.businessType === businessType) ?? guides[0];
}

export function findBusinessByType(businessType: string) {
  return businesses.filter((business) => business.businessType === businessType);
}
