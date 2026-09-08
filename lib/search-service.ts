import { accessories, boxes, ecoAlternatives, guides, materials, suppliers } from "@/lib/seed-data";
import { parseSearchQuery } from "@/lib/query-parser";
import type { BusinessType, PackagingGuide, PackagingMaterial, SearchFilters, SearchResult, Supplier, Accessory, PackagingBox, EcoAlternative } from "@/types";

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function matchesText(target: string, query: string) {
  return normalize(target).includes(normalize(query));
}

function matchesMaterialQuery(item: PackagingMaterial, materialQuery: string) {
  if (!materialQuery) {
    return true;
  }

  return (
    matchesText(item.name, materialQuery) ||
    matchesText(item.purpose, materialQuery) ||
    item.tags.some((tag) => matchesText(tag, materialQuery))
  );
}

export function searchBizLink(query: string, filters: Partial<SearchFilters> = {}): SearchResult {
  const parsed = parseSearchQuery(query);
  const businessType: BusinessType | "General" = (filters.businessType?.trim()
    ? (filters.businessType as BusinessType)
    : parsed.businessType) as BusinessType | "General";
  const materialQuery = filters.material?.trim() || parsed.materialQuery || "";
  const maxPrice = filters.maxPrice && filters.maxPrice > 0 ? filters.maxPrice : 5000;
  const availability = filters.availability ?? "all";

  const materialResults = materials
    .filter((item) => {
      const matchesBusiness = businessType === "General" || item.businessTypes.includes(businessType as BusinessType);
      const matchesCategory = filters.category ? item.category === filters.category : true;
      const matchesSupplier = filters.supplier ? item.supplier === filters.supplier : true;
      const matchesEco = filters.ecoFriendly ? item.ecoFriendly : true;
      const matchesReusable = filters.reusable ? item.reusable : true;
      const matchesRecyclable = filters.recyclable ? item.recyclable : true;
      const matchesPrice = item.price <= maxPrice;
      const matchesAvailability = availability === "all" || item.availability === availability;
      const matchesMaterial = matchesMaterialQuery(item, materialQuery);
      return (
        matchesBusiness &&
        matchesCategory &&
        matchesSupplier &&
        matchesEco &&
        matchesReusable &&
        matchesRecyclable &&
        matchesPrice &&
        matchesAvailability &&
        matchesMaterial
      );
    })
    .slice(0, 12);

  const boxResults = boxes
    .filter((item) => {
      const matchesBusiness = businessType === "General" || item.businessTypes.includes(businessType as BusinessType);
      const matchesCategory = filters.category ? item.category === filters.category : true;
      const matchesSupplier = filters.supplier ? item.supplier === filters.supplier : true;
      const matchesEco = filters.ecoFriendly ? item.ecoFriendly : true;
      const matchesReusable = filters.reusable ? item.reusable : true;
      const matchesRecyclable = filters.recyclable ? item.recyclable : true;
      const matchesPrice = item.price <= maxPrice;
      const matchesAvailability = availability === "all" || item.availability === availability;
      const matchesMaterial = materialQuery
        ? matchesText(item.name, materialQuery) || matchesText(item.purpose, materialQuery)
        : true;
      return (
        matchesBusiness &&
        matchesCategory &&
        matchesSupplier &&
        matchesEco &&
        matchesReusable &&
        matchesRecyclable &&
        matchesPrice &&
        matchesAvailability &&
        matchesMaterial
      );
    })
    .slice(0, 8);

  const accessoryResults = accessories
    .filter((item) => {
      const matchesBusiness = businessType === "General" || item.businessTypes.includes(businessType as BusinessType);
      const matchesCategory = filters.category ? item.category === filters.category : true;
      const matchesSupplier = filters.supplier ? item.supplier === filters.supplier : true;
      const matchesEco = filters.ecoFriendly ? item.ecoFriendly : true;
      const matchesReusable = filters.reusable ? item.reusable : true;
      const matchesRecyclable = filters.recyclable ? item.recyclable : true;
      const matchesPrice = item.price <= maxPrice;
      const matchesAvailability = availability === "all" || item.availability === availability;
      const matchesMaterial = materialQuery
        ? matchesText(item.name, materialQuery) || matchesText(item.purpose, materialQuery)
        : true;
      return (
        matchesBusiness &&
        matchesCategory &&
        matchesSupplier &&
        matchesEco &&
        matchesReusable &&
        matchesRecyclable &&
        matchesPrice &&
        matchesAvailability &&
        matchesMaterial
      );
    })
    .slice(0, 10);

  const supplierResults = suppliers
    .filter((item) => {
      const matchesBusiness = businessType === "General" || item.businessTypes.includes(businessType as BusinessType);
      const matchesCategory = filters.category ? item.category === filters.category : true;
      const matchesSupplier = filters.supplier ? item.name === filters.supplier : true;
      return matchesBusiness && matchesCategory && matchesSupplier;
    })
    .slice(0, 8);

  const guide = guides.find((item) => item.businessType === businessType) ?? guides[0];
  const alternatives = ecoAlternatives.filter((item) => item.businessType === businessType).slice(0, 3);
  const hasExactMatch = materialResults.length > 0 || boxResults.length > 0 || accessoryResults.length > 0;

  return {
    query,
    businessType,
    hasExactMatch,
    materials: materialResults,
    boxes: boxResults,
    accessories: accessoryResults,
    suppliers: supplierResults,
    guide: guide as PackagingGuide,
    aiSuggestion: {
      title: "AI Suggestion",
      summary: hasExactMatch
        ? `These options are grounded in the BizLink database and are best suited for ${businessType.toLowerCase()} packaging needs.`
        : `No exact match found in database. Here is a Gemini-guided suggestion for ${businessType.toLowerCase()} packaging based on the closest available patterns.`,
      bullets: [
        "Use a layered packaging approach for protection and presentation.",
        "Add a branded thank-you card to improve retention.",
        "Prioritize recyclable and reusable materials where possible.",
        ...(alternatives.length > 0 ? alternatives.map((item) => `Eco alternative: ${item.name} for ${item.replacementFor}`) : []),
      ],
    },
  };
}
