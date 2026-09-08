export type Language = "en" | "hi" | "pa";

export type BusinessType =
  | "Crochet"
  | "Bakery"
  | "Jewellery"
  | "Candles"
  | "Handmade Soap"
  | "Clothing"
  | "Chocolates"
  | "Rakhi"
  | "Gift Products"
  | "Pottery"
  | "Handmade Crafts"
  | "Home Decor"
  | "Cosmetics"
  | "Stationery"
  | "Handmade Accessories"
  | "General";

export type MaterialType =
  | "Kraft Paper"
  | "Corrugated Board"
  | "Bubble Wrap"
  | "Kraft Mailer"
  | "Rigid Board"
  | "Kraft Box"
  | "Honeycomb Wrap"
  | "Honeycomb Paper"
  | "Tissue Paper"
  | "Thank You Card"
  | "Brand Sticker"
  | "Cake Box"
  | "Candle Box"
  | "Jewellery Box"
  | "Velvet Pouch"
  | "Wax Paper"
  | "Foam Insert"
  | "Food-Safe Kraft Paper"
  | "Greaseproof Paper"
  | "Paperboard"
  | "Premium Paper Sleeve"
  | "Eco Paper Tape"
  | "Silk Ribbon"
  | "Reusable Pouch"
  | "Gift Pouch"
  | "Food-Grade Cardboard"
  | "Window Box Material"
  | "Jewellery Box Board"
  | "Protective Insert"
  | "Chocolate Box Material"
  | "Food-Grade Liner"
  | "Bubble Mailer"
  | "Custom Label"
  | "Soap Sleeve"
  | "Food Safe Packaging"
  | "Food Safe Box"
  | "Anti-Tarnish Insert";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type BusinessSection = "Package Builder" | "Collaboration" | "Supplier Matches";

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  section?: BusinessSection;
  email?: string;
  phone?: string;
  website?: string;
  pricing?: {
    minOrder: number;
    currency: string;
    priceRange: string;
  };
}

export interface PackagingMaterial {
  id: string;
  name: string;
  imageUrl: string;
  purpose: string;
  description: string;
  businessTypes: BusinessType[];
  category: string;
  price: number;
  currency: string;
  minimumOrderQuantity: string;
  supplier: string;
  supplierId: string;
  tags: string[];
  ecoFriendly: boolean;
  reusable: boolean;
  recyclable: boolean;
  fragileSupport: boolean;
  waterproof: boolean;
  bestFor: string;
  advantages: string[];
  disadvantages: string[];
  availability: string;
}

export interface PackagingBox {
  id: string;
  name: string;
  imageUrl: string;
  purpose: string;
  description: string;
  businessTypes: BusinessType[];
  category: string;
  price: number;
  currency: string;
  minimumOrderQuantity: string;
  supplier: string;
  supplierId: string;
  tags: string[];
  ecoFriendly: boolean;
  reusable: boolean;
  recyclable: boolean;
  fragileSupport: boolean;
  waterproof: boolean;
  bestFor: string;
  advantages: string[];
  disadvantages: string[];
  availability: string;
}

export interface Accessory {
  id: string;
  name: string;
  imageUrl: string;
  purpose: string;
  description: string;
  businessTypes: BusinessType[];
  category: string;
  price: number;
  currency: string;
  minimumOrderQuantity: string;
  supplier: string;
  supplierId: string;
  tags: string[];
  ecoFriendly: boolean;
  reusable: boolean;
  recyclable: boolean;
  fragileSupport: boolean;
  waterproof: boolean;
  bestFor: string;
  advantages: string[];
  disadvantages: string[];
  availability: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  location: string;
  leadTime: string;
  specialties: string[];
  businessTypes: BusinessType[];
}

export interface PackagingGuide {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  businessType: string;
}

export interface EcoAlternative {
  id: string;
  name: string;
  description: string;
  replacementFor: string;
  businessType: string;
}

export interface SearchFilters {
  businessType: string;
  category: string;
  material: string;
  supplier: string;
  ecoFriendly: boolean;
  reusable: boolean;
  recyclable: boolean;
  maxPrice: number;
  availability: string;
}

export interface SearchResult {
  query: string;
  businessType: string;
  hasExactMatch: boolean;
  materials: PackagingMaterial[];
  boxes: PackagingBox[];
  accessories: Accessory[];
  suppliers: Supplier[];
  guide: PackagingGuide;
  aiSuggestion: {
    title: string;
    summary: string;
    bullets: string[];
  };
}
