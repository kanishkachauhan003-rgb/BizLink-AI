import type { SearchFilters, SearchResults } from "@/types";
import {
  getAccessories,
  getBusinesses,
  getPackagingBoxes,
  getPackagingGuides,
  getPackagingMaterials,
  getSuppliers,
} from "@/lib/seed-data";

const businesses = getBusinesses();
const materials = getPackagingMaterials();
const boxes = getPackagingBoxes();
const accessories = getAccessories();
const suppliers = getSuppliers();
const guides = getPackagingGuides();

const businessTypeAliases: Record<string, string> = {
  crochet: "Crochet",
  bakery: "Bakery",
  candle: "Candles",
  candles: "Candles",
  rakhi: "Rakhi",
  jewelry: "Jewellery",
  jewellery: "Jewellery",
  coffee: "Coffee",
  skincare: "Skincare",
  clothing: "Clothing",
  gift: "Gifts",
  gifts: "Gifts",
  chocolate: "Chocolates",
  chocolates: "Chocolates",
  soap: "Handmade Soap",
  soaps: "Handmade Soap",
  handmade: "Handmade Soap",
  pottery: "Pottery",
  craft: "Handmade Crafts",
  crafts: "Handmade Crafts",
  decor: "Home Decor",
  cosmetic: "Cosmetics",
  cosmetics: "Cosmetics",
  stationery: "Stationery",
  accessory: "Handmade Accessories",
  accessories: "Handmade Accessories",
  book: "Books",
  books: "Books",
  floss: "Floss",
};

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function singularize(value: string) {
  if (value.endsWith("ies") && value.length > 4) {
    return `${value.slice(0, -3)}y`;
  }

  if (value.endsWith("s") && value.length > 3) {
    return value.slice(0, -1);
  }

  return value;
}

function getQueryTokens(query: string) {
  return normalizeText(query).split(" ").filter(Boolean);
}

function matchesQueryText(query: string, haystack: string, businessType: string | null, businessTypes: string[]) {
  const normalizedQuery = normalizeText(query);
  const tokens = getQueryTokens(normalizedQuery).filter((token) => !["for", "the", "a", "an", "and", "with", "of", "to", "in", "on", "packaging", "package", "box", "boxes", "carton", "container", "label", "labels", "sticker", "stickers", "wrap", "wraps", "eco", "friendly", "recyclable", "reusable", "luxury", "premium"].includes(token));
  const searchableText = normalizeText([haystack, ...businessTypes].join(" "));
  const hasTokenMatch = tokens.some((token) => {
    const singular = singularize(token);
    return searchableText.includes(token) || searchableText.includes(singular);
  });
  const hasBusinessTypeMatch = !businessType || businessTypes.some((value) => {
    const normalizedValue = normalizeText(value);
    return normalizedValue.includes(normalizeText(businessType)) || normalizeText(businessType).includes(normalizedValue);
  });
  const isDirectBubbleWrapQuery = normalizedQuery.includes("bubble") || normalizedQuery.includes("wrap");
  const isDirectBoxQuery = getQueryTokens(normalizedQuery).some((token) => ["box", "boxes", "carton", "container"].includes(token));
  const isDirectThankYouCardsQuery = normalizedQuery.includes("thank") && normalizedQuery.includes("card");
  const isDirectBrandStickersQuery = normalizedQuery.includes("brand") && normalizedQuery.includes("sticker");
  const explicitCategoryMatch = (isDirectBubbleWrapQuery && /bubble/.test(searchableText) && /wrap/.test(searchableText)) || (isDirectBoxQuery && /box|boxes|carton|container/.test(searchableText)) || (isDirectThankYouCardsQuery && /thank/.test(searchableText) && /card/.test(searchableText)) || (isDirectBrandStickersQuery && /brand/.test(searchableText) && /sticker/.test(searchableText));

  return hasBusinessTypeMatch || (tokens.length > 0 && hasTokenMatch) || explicitCategoryMatch;
}

export function searchBizLink(query: string, filters: Partial<SearchFilters> = {}): SearchResults {
  const normalized = query.trim().toLowerCase();
  const extractedBusinessType = extractBusinessType(normalized);
  const supportedBusinessTypes = new Set(businesses.map((entry) => entry.businessType));
  const businessType = extractedBusinessType && supportedBusinessTypes.has(extractedBusinessType) ? extractedBusinessType : null;
  const queryTokens = getQueryTokens(normalized);
  const isEcoQuery = queryTokens.some((token) => ["eco", "friendly", "sustainable", "green"].includes(token));
  const isLuxuryQuery = queryTokens.some((token) => ["luxury", "premium", "deluxe", "elevated"].includes(token));
  const isBoxQuery = queryTokens.some((token) => ["box", "boxes", "carton", "container"].includes(token));
  const isBubbleWrapQuery = queryTokens.some((token) => ["bubble", "wrap"].includes(token));
  const isThankYouCardsQuery = queryTokens.includes("thank") && queryTokens.includes("card");
  const isBrandStickersQuery = queryTokens.includes("brand") && queryTokens.includes("sticker");

  const matchedMaterials = materials.filter((entry) => {
    const searchableText = [entry.name, entry.description, entry.purpose, entry.category, ...(entry.tags ?? []), ...(entry.businessTypes ?? [])].join(" ");
    const matchesBusiness = !!businessType && entry.businessTypes.includes(businessType);
    const matchesCategory = !filters.category || entry.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesSupplier = !filters.supplier || entry.supplierId.toLowerCase().includes(filters.supplier.toLowerCase());
    const matchesEco = !filters.ecoFriendly || entry.ecoFriendly;
    const matchesReusable = !filters.reusable || entry.reusable;
    const matchesRecyclable = !filters.recyclable || entry.recyclable;
    const withinPrice = !filters.maxPrice || entry.price <= filters.maxPrice;
    const matchesQuery = matchesQueryText(normalized, searchableText, businessType, entry.businessTypes);
    const matchesIntent = (!isBoxQuery || /box|boxes|carton|container/.test(searchableText.toLowerCase())) && (!isEcoQuery || entry.ecoFriendly || /eco|recycl|reus|sustain/.test(searchableText.toLowerCase())) && (!isLuxuryQuery || /luxury|premium|deluxe|elevated/.test(searchableText.toLowerCase()) || entry.category.toLowerCase().includes("luxury")) && (!isBubbleWrapQuery || (/bubble/.test(searchableText.toLowerCase()) && /wrap/.test(searchableText.toLowerCase()))) && (!isThankYouCardsQuery || (/thank/.test(searchableText.toLowerCase()) && /card/.test(searchableText.toLowerCase()))) && (!isBrandStickersQuery || (/brand/.test(searchableText.toLowerCase()) && /sticker/.test(searchableText.toLowerCase())));
    const queryMatch = businessType ? matchesBusiness || matchesQuery : matchesQuery || matchesIntent;
    return queryMatch && matchesCategory && matchesSupplier && matchesEco && matchesReusable && matchesRecyclable && withinPrice && matchesIntent;
  }).slice(0, 8);

  const matchedBoxes = boxes.filter((entry) => {
    const searchableText = [entry.name, entry.description, entry.purpose, entry.category, ...(entry.tags ?? []), ...(entry.businessTypes ?? [])].join(" ");
    const matchesBusiness = !!businessType && entry.businessTypes.includes(businessType);
    const matchesCategory = !filters.category || entry.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesSupplier = !filters.supplier || entry.supplierId.toLowerCase().includes(filters.supplier.toLowerCase());
    const matchesEco = !filters.ecoFriendly || entry.ecoFriendly;
    const matchesReusable = !filters.reusable || entry.reusable;
    const matchesRecyclable = !filters.recyclable || entry.recyclable;
    const withinPrice = !filters.maxPrice || entry.price <= filters.maxPrice;
    const matchesQuery = matchesQueryText(normalized, searchableText, businessType, entry.businessTypes);
    const matchesIntent = (!isBoxQuery || /box|boxes|carton|container/.test(searchableText.toLowerCase())) && (!isEcoQuery || entry.ecoFriendly || /eco|recycl|reus|sustain/.test(searchableText.toLowerCase())) && (!isLuxuryQuery || /luxury|premium|deluxe|elevated/.test(searchableText.toLowerCase()) || entry.category.toLowerCase().includes("luxury")) && (!isBubbleWrapQuery || (/bubble/.test(searchableText.toLowerCase()) && /wrap/.test(searchableText.toLowerCase()))) && (!isThankYouCardsQuery || (/thank/.test(searchableText.toLowerCase()) && /card/.test(searchableText.toLowerCase()))) && (!isBrandStickersQuery || (/brand/.test(searchableText.toLowerCase()) && /sticker/.test(searchableText.toLowerCase())));
    const queryMatch = businessType ? matchesBusiness || matchesQuery : matchesQuery || matchesIntent;
    return queryMatch && matchesCategory && matchesSupplier && matchesEco && matchesReusable && matchesRecyclable && withinPrice && matchesIntent;
  }).slice(0, 6);

  const matchedAccessories = accessories.filter((entry) => {
    const searchableText = [entry.name, entry.description, entry.purpose, entry.category, ...(entry.tags ?? []), ...(entry.businessTypes ?? [])].join(" ");
    const matchesBusiness = !!businessType && entry.businessTypes.includes(businessType);
    const matchesCategory = !filters.category || entry.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesSupplier = !filters.supplier || entry.supplierId.toLowerCase().includes(filters.supplier.toLowerCase());
    const matchesEco = !filters.ecoFriendly || entry.ecoFriendly;
    const matchesReusable = !filters.reusable || entry.reusable;
    const matchesRecyclable = !filters.recyclable || entry.recyclable;
    const withinPrice = !filters.maxPrice || entry.price <= filters.maxPrice;
    const matchesQuery = matchesQueryText(normalized, searchableText, businessType, entry.businessTypes);
    const matchesIntent = (!isBoxQuery || /box|boxes|carton|container/.test(searchableText.toLowerCase())) && (!isEcoQuery || entry.ecoFriendly || /eco|recycl|reus|sustain/.test(searchableText.toLowerCase())) && (!isLuxuryQuery || /luxury|premium|deluxe|elevated/.test(searchableText.toLowerCase()) || entry.category.toLowerCase().includes("luxury")) && (!isBubbleWrapQuery || (/bubble/.test(searchableText.toLowerCase()) && /wrap/.test(searchableText.toLowerCase()))) && (!isThankYouCardsQuery || (/thank/.test(searchableText.toLowerCase()) && /card/.test(searchableText.toLowerCase()))) && (!isBrandStickersQuery || (/brand/.test(searchableText.toLowerCase()) && /sticker/.test(searchableText.toLowerCase())));
    const queryMatch = businessType ? matchesBusiness || matchesQuery : matchesQuery || matchesIntent;
    return queryMatch && matchesCategory && matchesSupplier && matchesEco && matchesReusable && matchesRecyclable && withinPrice && matchesIntent;
  }).slice(0, 6);

  const matchedSuppliers = suppliers.filter((entry) => {
    const searchableText = [entry.name, entry.description, entry.category, ...(entry.tags ?? []), ...(entry.businessTypes ?? [])].join(" ");
    const matchesBusiness = !!businessType && entry.businessTypes.includes(businessType);
    const matchesCategory = !filters.category || entry.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesSupplier = !filters.supplier || entry.id.toLowerCase().includes(filters.supplier.toLowerCase()) || entry.name.toLowerCase().includes(filters.supplier.toLowerCase());
    const matchesQuery = matchesQueryText(normalized, searchableText, businessType, entry.businessTypes);
    const queryMatch = businessType ? matchesBusiness || matchesQuery : matchesQuery;
    return queryMatch && matchesCategory && matchesSupplier;
  }).slice(0, 6);

  const guide = guides.find((entry) => entry.businessType.toLowerCase() === businessType?.toLowerCase()) ?? null;
  const databaseMatched = matchedMaterials.length > 0 || matchedBoxes.length > 0 || matchedAccessories.length > 0;

  const aiSuggestion = databaseMatched
    ? `For ${businessType || "your business"}, the strongest combination is to pair ${matchedMaterials[0]?.name ?? "premium packaging"} with ${matchedBoxes[0]?.name ?? "a branded box"}, then add ${matchedAccessories[0]?.name ?? "finishing accessories"} for a memorable unboxing experience. Keep costs controlled by reusing durable materials and choosing recyclable elements.`
    : `No exact match found in database. AI Suggestion: ${businessType ? `For ${businessType} businesses, start with a lightweight mailer, a branded box, and eco-friendly inserts.` : "Try a minimalist packaging stack with kraft paper, a mailer box, and thank-you cards."}`;

  return {
    query,
    businessType: businessType ?? "General",
    databaseMatched,
    materials: matchedMaterials,
    boxes: matchedBoxes,
    accessories: matchedAccessories,
    suppliers: matchedSuppliers,
    guide,
    aiSuggestion,
  };
}

function extractBusinessType(query: string): string | null {
  const normalizedQuery = normalizeText(query);
  const found = Object.keys(businessTypeAliases).find((key) => normalizedQuery.includes(key));
  return found ? businessTypeAliases[found] : null;
}
