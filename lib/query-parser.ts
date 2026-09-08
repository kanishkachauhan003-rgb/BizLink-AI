import { BusinessType, MaterialType } from "@/types";

const businessTypeKeywords: Record<string, BusinessType> = {
  // Crochet
  "handmade crochet": "Crochet",
  crochet: "Crochet",
  knitting: "Crochet",
  handmade: "Handmade Crafts",
  "crochet accessories": "Crochet",
  "craft box": "Crochet",
  
  // Bakery & Food
  bakery: "Bakery",
  "packaging for bakery": "Bakery",
  cake: "Bakery",
  cakes: "Bakery",
  cupcakes: "Bakery",
  cookies: "Bakery",
  pastry: "Bakery",
  pastries: "Bakery",
  donut: "Bakery",
  bread: "Bakery",
  buns: "Bakery",
  
  // Chocolates & Sweets
  chocolates: "Chocolates",
  chocolate: "Chocolates",
  candy: "Chocolates",
  sweets: "Chocolates",
  dessert: "Chocolates",
  desserts: "Chocolates",
  confectionery: "Chocolates",
  
  // Jewellery
  jewelry: "Jewellery",
  jewellery: "Jewellery",
  earring: "Jewellery",
  necklace: "Jewellery",
  ring: "Jewellery",
  rings: "Jewellery",
  bracelet: "Jewellery",
  bracelets: "Jewellery",
  
  // Candles
  candle: "Candles",
  candles: "Candles",
  wax: "Candles",
  "scented candles": "Candles",
  
  // Handmade Soap
  "handmade soap": "Handmade Soap",
  soap: "Handmade Soap",
  bath: "Handmade Soap",
  
  // Clothing & Fashion
  clothing: "Clothing",
  apparel: "Clothing",
  fashion: "Clothing",
  dress: "Clothing",
  shirts: "Clothing",
  shirt: "Clothing",
  
  // Rakhi
  rakhi: "Rakhi",
  festival: "Rakhi",
  "festive gifts": "Rakhi",
  
  // Gifts
  gift: "Gift Products",
  gifts: "Gift Products",
  
  // Pottery
  pottery: "Pottery",
  ceramic: "Pottery",
  ceramics: "Pottery",
  
  // Crafts
  craft: "Handmade Crafts",
  crafts: "Handmade Crafts",
  art: "Handmade Crafts",
  
  // Home Decor
  decor: "Home Decor",
  home: "Home Decor",
  decoration: "Home Decor",
  
  // Cosmetics
  cosmetics: "Cosmetics",
  beauty: "Cosmetics",
  makeup: "Cosmetics",
  skincare: "Cosmetics",
  
  // Stationery
  stationery: "Stationery",
  paper: "Stationery",
  
  // Accessories
  accessories: "Handmade Accessories",
  accessory: "Handmade Accessories",
  bag: "Handmade Accessories",
  pouch: "Handmade Accessories",
  boxes: "General",
  box: "General",
};

const materialKeywords: Record<string, MaterialType> = {
  // Kraft & Eco
  "kraft mailer": "Kraft Mailer",
  "kraft paper": "Kraft Paper",
  "food-safe kraft paper": "Food-Safe Kraft Paper",
  "greaseproof paper": "Greaseproof Paper",
  "paperboard": "Paperboard",
  "kraft box": "Kraft Box",
  
  // Boxes
  "corrugated board": "Corrugated Board",
  "corrugated box": "Corrugated Board",
  "mailer box": "Kraft Mailer",
  "rigid box": "Rigid Board",
  "rigid board": "Rigid Board",
  "cake box": "Cake Box",
  "candle box": "Candle Box",
  "jewellery box": "Jewellery Box",
  "window box": "Window Box Material",
  "premium box": "Paperboard",
  
  // Paper & Wrapping
  "tissue paper": "Tissue Paper",
  "wax paper": "Wax Paper",
  "honeycomb paper": "Honeycomb Wrap",
  "honeycomb wrap": "Honeycomb Wrap",
  "eco paper tape": "Eco Paper Tape",
  
  // Protective
  "bubble wrap": "Bubble Wrap",
  "foam insert": "Foam Insert",
  
  // Pouches & Luxury
  "velvet pouch": "Velvet Pouch",
  "silk ribbon": "Silk Ribbon",
  "gift pouch": "Gift Pouch",
  "mica bag": "Gift Pouch",
  "vinyl pouch": "Reusable Pouch",
  "drawstring pouch": "Reusable Pouch",
  
  // Branding & Labels
  "thank you card": "Thank You Card",
  "thank-you card": "Thank You Card",
  "thank you": "Thank You Card",
  "brand sticker": "Brand Sticker",
  "custom label": "Brand Sticker",
  "sticker": "Brand Sticker",
  "label": "Brand Sticker",
  
  // Food Safe
  "food safe": "Food Safe Packaging",
  "food safe box": "Food Safe Packaging",
  "food safe packaging": "Food Safe Packaging",
  
  // Other
  "anti tarnish": "Anti-Tarnish Insert",
  "anti-tarnish": "Anti-Tarnish Insert",
  "soap sleeve": "Soap Sleeve",
};

export function parseSearchQuery(query: string) {
  const normalized = query.toLowerCase().trim();

  if (normalized.includes("handmade soap") || normalized.includes("soap packaging") || normalized.includes("packaging for soap") || normalized.includes("soap box")) {
    return {
      businessType: "Handmade Soap",
      materialQuery: "",
      category: "soap",
    };
  }

  if (normalized.includes("packaging for fashion") || normalized.includes("fashion packaging") || normalized.includes("clothing packaging") || normalized.includes("packaging for clothing") || normalized.includes("apparel packaging") || normalized.includes("packaging for apparel")) {
    return {
      businessType: "Clothing",
      materialQuery: "",
      category: "fashion",
    };
  }

  let businessType: BusinessType | "General" = "General";
  let longestMatch = "";

  for (const key of Object.keys(businessTypeKeywords)) {
    const normalizedKey = key.trim();
    const matchTarget = normalized.includes(normalizedKey)
      || normalized.includes(`packaging for ${normalizedKey}`)
      || normalized.includes(`${normalizedKey} packaging`)
      || normalized.includes(`for ${normalizedKey}`);

    if (matchTarget && normalizedKey.length > longestMatch.length) {
      longestMatch = normalizedKey;
      businessType = businessTypeKeywords[key];
    }
  }

  if (normalized.includes("packaging boxes") || normalized.includes("boxes packaging") || normalized.includes("bubble wrap")) {
    businessType = "General";
  }

  let materialQuery: MaterialType | "" = "";
  let longestMaterialMatch = "";
  for (const key of Object.keys(materialKeywords)) {
    if (normalized.includes(key) && key.length > longestMaterialMatch.length) {
      longestMaterialMatch = key;
      materialQuery = materialKeywords[key];
    }
  }

  const explicitCategory = normalized.match(/(gift|food|craft|fashion|home decor|cosmetics|stationery|pottery|accessories|bakery|jewellery|candles|chocolate|rakhi|crochet)/);
  const category = explicitCategory ? explicitCategory[0] : "";

  return {
    businessType,
    materialQuery,
    category,
  };
}
