import type {
  Accessory,
  Business,
  CategoryEntry,
  EcoAlternative,
  PackagingBox,
  PackagingGuide,
  PackagingMaterial,
  Supplier,
} from "@/types";

const businessTypes = [
  "Crochet",
  "Bakery",
  "Jewellery",
  "Candles",
  "Handmade Soap",
  "Clothing",
  "Chocolates",
  "Rakhi",
  "Floss",
  "Gifts",
  "Pottery",
  "Handmade Crafts",
  "Home Decor",
  "Cosmetics",
  "Stationery",
  "Handmade Accessories",
];

const categoryNames = [
  "Protective Packaging",
  "Luxury Packaging",
  "Eco Packaging",
  "Retail Packaging",
  "Gift Packaging",
  "Food Packaging",
  "Seasonal Packaging",
];

const supplierNames = [
  "Northstar Packaging",
  "GreenFold Supply",
  "Pioneer Wrap Co",
  "EcoCraft Labs",
  "PackPrime India",
  "LuxeBox Materials",
  "BlueLeaf Goods",
  "Shiplite Packaging",
  "Origin Print Hub",
  "Urban Wrap Co",
];

function createImage(photoId: string) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`;
}

const materialTemplates: Record<string, Array<{ name: string; description: string; purpose: string; price: number; MOQ: string; category: string; tags: string[]; ecoFriendly: boolean; reusable: boolean; recyclable: boolean }>> = {
  Crochet: [
    { name: "Bubble Wrap Roll", description: "Light cushioning for fragile crochet kits and delicate yarn bundles.", purpose: "Protection", price: 88, MOQ: "300 units", category: "Protective Packaging", tags: ["bubble", "wrap", "cushion"], ecoFriendly: false, reusable: false, recyclable: true },
    { name: "Kraft Mailer Box", description: "Sturdy and lightweight packaging for crochet kits and yarn bundles.", purpose: "Shipping", price: 95, MOQ: "250 units", category: "Protective Packaging", tags: ["shipping", "lightweight", "craft"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Honeycomb Paper Wrap", description: "Soft cushioning that protects handmade items during transit.", purpose: "Protection", price: 82, MOQ: "300 units", category: "Protective Packaging", tags: ["protective", "cushion"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Craft Paper Sleeve", description: "Premium paper sleeve that adds a refined finish to crochet sets.", purpose: "Presentation", price: 72, MOQ: "200 units", category: "Luxury Packaging", tags: ["premium", "presentation"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Bakery: [
    { name: "Butter Paper Wrap", description: "Food-safe wrap that keeps pastries and cakes fresh and presentable.", purpose: "Food Safety", price: 55, MOQ: "500 units", category: "Food Packaging", tags: ["food-safe", "bakery"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Cake Board", description: "Sturdy base board for layered cakes and celebration boxes.", purpose: "Support", price: 68, MOQ: "400 units", category: "Food Packaging", tags: ["cake", "support"], ecoFriendly: false, reusable: true, recyclable: true },
    { name: "Tissue Paper Sheet", description: "Soft protective lining for pastry boxes and gift hampers.", purpose: "Presentation", price: 48, MOQ: "600 units", category: "Gift Packaging", tags: ["gift", "soft"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Jewellery: [
    { name: "Rigid Jewellery Box", description: "Premium rigid box designed to protect and display jewellery pieces.", purpose: "Protection", price: 140, MOQ: "150 units", category: "Luxury Packaging", tags: ["premium", "display"], ecoFriendly: false, reusable: true, recyclable: true },
    { name: "Velvet Pouch", description: "Soft velvet pouch for delicate jewellery and gift sets.", purpose: "Presentation", price: 88, MOQ: "300 units", category: "Luxury Packaging", tags: ["luxury", "soft"], ecoFriendly: false, reusable: true, recyclable: false },
    { name: "Anti-Tarnish Insert", description: "Protective insert that helps preserve metal finishes and polish.", purpose: "Protection", price: 74, MOQ: "250 units", category: "Protective Packaging", tags: ["protective", "metal"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Candles: [
    { name: "Candle Shipping Box", description: "Rigid box with safe cushioning for glass and wax candle products.", purpose: "Shipping", price: 118, MOQ: "200 units", category: "Protective Packaging", tags: ["shipping", "candle"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Warning Label Sheet", description: "Clear packaging labels for handling and safe storage.", purpose: "Labelling", price: 42, MOQ: "1000 units", category: "Retail Packaging", tags: ["labels", "safety"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Protective Insert Tray", description: "Custom tray that reduces movement during transit.", purpose: "Protection", price: 64, MOQ: "300 units", category: "Protective Packaging", tags: ["insert", "fragile"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  "Handmade Soap": [
    { name: "Soap Sleeve Wrap", description: "Breathable sleeve that protects handmade soaps while keeping them attractive.", purpose: "Presentation", price: 58, MOQ: "500 units", category: "Eco Packaging", tags: ["soap", "natural"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Kraft Cardboard Carton", description: "Durable carton for soap bundles and seasonal gift packs.", purpose: "Shipping", price: 90, MOQ: "250 units", category: "Protective Packaging", tags: ["shipping", "bundle"], ecoFriendly: true, reusable: true, recyclable: true },
    { name: "Organic Tissue Paper", description: "Gentle paper wrap suitable for premium botanical soap packaging.", purpose: "Presentation", price: 46, MOQ: "600 units", category: "Gift Packaging", tags: ["botanical", "gift"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Clothing: [
    { name: "Poly Mailer", description: "Lightweight mailer used for apparel orders and online shipping.", purpose: "Shipping", price: 66, MOQ: "500 units", category: "Retail Packaging", tags: ["apparel", "shipping"], ecoFriendly: false, reusable: true, recyclable: true },
    { name: "Brand Hang Tag", description: "Premium hang tag for clothing retail presentation.", purpose: "Branding", price: 48, MOQ: "400 units", category: "Luxury Packaging", tags: ["branding", "retail"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Paper Tissue Insert", description: "Soft insert for folded garments and premium apparel sets.", purpose: "Protection", price: 52, MOQ: "400 units", category: "Protective Packaging", tags: ["garment", "insert"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Chocolates: [
    { name: "Chocolate Box Tray", description: "Box tray designed for chocolates and artisan confectionery.", purpose: "Presentation", price: 124, MOQ: "200 units", category: "Gift Packaging", tags: ["confectionery", "gift"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Foil Lining Sheet", description: "Protective lining that preserves chocolate freshness and finish.", purpose: "Protection", price: 72, MOQ: "300 units", category: "Food Packaging", tags: ["freshness", "food-safe"], ecoFriendly: false, reusable: false, recyclable: false },
    { name: "Window Display Box", description: "Attractive box with a clear window for premium chocolate assortments.", purpose: "Display", price: 132, MOQ: "180 units", category: "Luxury Packaging", tags: ["display", "premium"], ecoFriendly: false, reusable: true, recyclable: true },
  ],
  Rakhi: [
    { name: "Rakhi Sleeve", description: "Decorative sleeve for festive rakhi gifting and small accessories.", purpose: "Presentation", price: 44, MOQ: "600 units", category: "Seasonal Packaging", tags: ["festival", "gift"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Festive Tissue Wrap", description: "Bright tissue wrap that adds celebratory presentation to rakhi packs.", purpose: "Branding", price: 39, MOQ: "700 units", category: "Gift Packaging", tags: ["festival", "soft"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Mini Gift Box", description: "Compact box for rakhi sets and festive add-ons.", purpose: "Packaging", price: 76, MOQ: "250 units", category: "Gift Packaging", tags: ["compact", "gift"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Floss: [
    { name: "Floss Sleeve Pack", description: "Compact sleeve for floss bundles and travel-friendly oral-care sets.", purpose: "Presentation", price: 92, MOQ: "300 units", category: "Retail Packaging", tags: ["floss", "travel", "oral-care"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Protective Paper Wrap", description: "Soft paper wrap that supports floss sample packs and compact gift sets.", purpose: "Protection", price: 64, MOQ: "500 units", category: "Protective Packaging", tags: ["protective", "floss"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Gifts: [
    { name: "Gift Wrap Paper", description: "Premium paper for gifting and hamper-ready packaging.", purpose: "Presentation", price: 62, MOQ: "400 units", category: "Gift Packaging", tags: ["gift", "premium"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Ribbon Set", description: "Decorative ribbon set that elevates gift packaging and unboxing.", purpose: "Branding", price: 54, MOQ: "500 units", category: "Luxury Packaging", tags: ["luxury", "ribbon"], ecoFriendly: false, reusable: true, recyclable: true },
    { name: "Thank You Card", description: "Small finishing card for gift boxes and promotional packaging.", purpose: "Branding", price: 34, MOQ: "800 units", category: "Gift Packaging", tags: ["card", "branding"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Pottery: [
    { name: "Pulp Divider Tray", description: "Protective tray for fragile pottery and ceramic items.", purpose: "Protection", price: 86, MOQ: "300 units", category: "Protective Packaging", tags: ["ceramic", "fragile"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Kraft Wrap Sheet", description: "Reinforced paper wrap that cushions handmade pottery pieces.", purpose: "Protection", price: 58, MOQ: "400 units", category: "Eco Packaging", tags: ["kraft", "cushion"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Box Insert Pad", description: "Cushion pad that keeps ceramic products stable in transit.", purpose: "Support", price: 64, MOQ: "250 units", category: "Protective Packaging", tags: ["support", "ceramic"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  "Handmade Crafts": [
    { name: "Corrugated Mailer", description: "Corrugated mailer suited for delicate handmade craft pieces.", purpose: "Shipping", price: 76, MOQ: "350 units", category: "Protective Packaging", tags: ["craft", "corrugated"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Punched Insert Board", description: "Neatly cut insert board that stabilizes artisan items.", purpose: "Support", price: 70, MOQ: "300 units", category: "Protective Packaging", tags: ["insert", "artisan"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Paper Branding Sticker", description: "Small sticker for artisan signatures and brand identity.", purpose: "Branding", price: 35, MOQ: "1000 units", category: "Retail Packaging", tags: ["brand", "sticker"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  "Home Decor": [
    { name: "Home Decor Box", description: "Elegant packaging suited for decor accessories and premium home pieces.", purpose: "Presentation", price: 110, MOQ: "200 units", category: "Luxury Packaging", tags: ["home", "premium"], ecoFriendly: true, reusable: true, recyclable: true },
    { name: "Paper Divider Set", description: "Divider set that protects decor items in transit.", purpose: "Protection", price: 78, MOQ: "300 units", category: "Protective Packaging", tags: ["divider", "protection"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Protective Tissue Wrap", description: "Soft wrap that helps avoid scratches for decor pieces.", purpose: "Presentation", price: 52, MOQ: "500 units", category: "Gift Packaging", tags: ["soft", "decor"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Cosmetics: [
    { name: "Cosmetic Sleeve", description: "Clean, premium sleeve for skincare and beauty items.", purpose: "Presentation", price: 88, MOQ: "300 units", category: "Luxury Packaging", tags: ["beauty", "premium"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Shipper Box", description: "Structured box for beauty sets and promotional bundles.", purpose: "Shipping", price: 126, MOQ: "200 units", category: "Retail Packaging", tags: ["beauty", "shipping"], ecoFriendly: true, reusable: true, recyclable: true },
    { name: "Soft Foam Insert", description: "Protective insert for delicate cosmetic containers.", purpose: "Protection", price: 74, MOQ: "250 units", category: "Protective Packaging", tags: ["fragile", "insert"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  Stationery: [
    { name: "Stationery Mailer", description: "Slim mailer for notebooks, cards and paper-based products.", purpose: "Shipping", price: 58, MOQ: "400 units", category: "Retail Packaging", tags: ["paper", "shipping"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Paper Wrap Sheet", description: "Clean paper wrap for bundled stationery items.", purpose: "Presentation", price: 44, MOQ: "600 units", category: "Gift Packaging", tags: ["paper", "bundles"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Brand Sleeve", description: "Simple sleeve that improves retail presentation for stationery sets.", purpose: "Branding", price: 40, MOQ: "700 units", category: "Luxury Packaging", tags: ["branding", "retail"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
  "Handmade Accessories": [
    { name: "Accessory Pouch", description: "Soft pouch that keeps handmade accessories elegant and secure.", purpose: "Presentation", price: 66, MOQ: "400 units", category: "Gift Packaging", tags: ["accessory", "pouch"], ecoFriendly: true, reusable: true, recyclable: true },
    { name: "Mini Brand Sticker", description: "Compact sticker for small accessory bundles and thank-you cards.", purpose: "Branding", price: 28, MOQ: "1000 units", category: "Retail Packaging", tags: ["brand", "accessory"], ecoFriendly: true, reusable: false, recyclable: true },
    { name: "Gift Box Insert", description: "Insert pad that keeps accessory sets neat and protected.", purpose: "Protection", price: 58, MOQ: "350 units", category: "Protective Packaging", tags: ["insert", "protective"], ecoFriendly: true, reusable: false, recyclable: true },
  ],
};

const boxTemplates: Record<string, Array<{ name: string; description: string; purpose: string; price: number; MOQ: string; category: string; tags: string[]; ecoFriendly: boolean; reusable: boolean; recyclable: boolean }>> = {
  Crochet: [{ name: "Mailer Box", description: "Compact box for yarn kits and crochet tools.", purpose: "Shipping", price: 180, MOQ: "200 units", category: "Protective Packaging", tags: ["mail", "toolkit"], ecoFriendly: true, reusable: false, recyclable: true }],
  Bakery: [{ name: "Cake Box", description: "Food-safe bakery box for celebration cakes and pastries.", purpose: "Presentation", price: 220, MOQ: "180 units", category: "Food Packaging", tags: ["cake", "food-safe"], ecoFriendly: true, reusable: false, recyclable: true }],
  Jewellery: [{ name: "Rigid Gift Box", description: "Fine jewellery box with a premium finish.", purpose: "Presentation", price: 320, MOQ: "130 units", category: "Luxury Packaging", tags: ["premium", "jewellery"], ecoFriendly: false, reusable: true, recyclable: true }],
  Candles: [{ name: "Candle Box", description: "Box with protective inserts for candle sets.", purpose: "Protection", price: 260, MOQ: "160 units", category: "Protective Packaging", tags: ["candle", "protective"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Handmade Soap": [{ name: "Soap Carton", description: "Box for handmade soap bundles and seasonal gifting.", purpose: "Packaging", price: 210, MOQ: "220 units", category: "Eco Packaging", tags: ["soap", "bundle"], ecoFriendly: true, reusable: true, recyclable: true }],
  Clothing: [{ name: "Apparel Box", description: "Structured box for premium apparel deliveries.", purpose: "Shipping", price: 250, MOQ: "180 units", category: "Retail Packaging", tags: ["apparel", "shipping"], ecoFriendly: false, reusable: true, recyclable: true }],
  Chocolates: [{ name: "Chocolate Gift Box", description: "Premium box for artisan chocolates and gift sets.", purpose: "Presentation", price: 300, MOQ: "150 units", category: "Gift Packaging", tags: ["gift", "chocolate"], ecoFriendly: true, reusable: false, recyclable: true }],
  Rakhi: [{ name: "Festive Gift Box", description: "Compact gift-ready box for festive rakhi sets.", purpose: "Presentation", price: 210, MOQ: "200 units", category: "Seasonal Packaging", tags: ["festival", "gift"], ecoFriendly: true, reusable: false, recyclable: true }],
  Floss: [{ name: "Oral Care Box", description: "Compact box for floss bundles and sample-ready packs.", purpose: "Packaging", price: 220, MOQ: "180 units", category: "Retail Packaging", tags: ["floss", "bundle"], ecoFriendly: true, reusable: false, recyclable: true }],
  Gifts: [{ name: "Gift Box", description: "Elegant box for retail-ready gift products.", purpose: "Presentation", price: 240, MOQ: "170 units", category: "Gift Packaging", tags: ["gift", "premium"], ecoFriendly: true, reusable: false, recyclable: true }],
  Pottery: [{ name: "Ceramic Box", description: "Sturdy box for pottery and ceramic products.", purpose: "Protection", price: 280, MOQ: "140 units", category: "Protective Packaging", tags: ["ceramic", "protective"], ecoFriendly: true, reusable: true, recyclable: true }],
  "Handmade Crafts": [{ name: "Craft Box", description: "Box tailored for handmade crafts and artisan sets.", purpose: "Packaging", price: 230, MOQ: "180 units", category: "Protective Packaging", tags: ["craft", "artisan"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Home Decor": [{ name: "Decor Box", description: "Premium box for decor and decor accessories.", purpose: "Presentation", price: 270, MOQ: "160 units", category: "Luxury Packaging", tags: ["decor", "premium"], ecoFriendly: true, reusable: true, recyclable: true }],
  Cosmetics: [{ name: "Beauty Box", description: "Structured box for cosmetics and skincare gift sets.", purpose: "Presentation", price: 290, MOQ: "150 units", category: "Luxury Packaging", tags: ["beauty", "gift"], ecoFriendly: true, reusable: false, recyclable: true }],
  Stationery: [{ name: "Stationery Box", description: "Box for notebooks, cards and stationery bundles.", purpose: "Packaging", price: 200, MOQ: "220 units", category: "Retail Packaging", tags: ["stationery", "bundles"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Handmade Accessories": [{ name: "Accessory Gift Box", description: "Compact box for accessory gift sets and bundles.", purpose: "Presentation", price: 230, MOQ: "180 units", category: "Gift Packaging", tags: ["accessory", "gift"], ecoFriendly: true, reusable: false, recyclable: true }],
};

const accessoryTemplates: Record<string, Array<{ name: string; description: string; purpose: string; price: number; MOQ: string; category: string; tags: string[]; ecoFriendly: boolean; reusable: boolean; recyclable: boolean }>> = {
  Crochet: [{ name: "Thank You Card", description: "Reusable card that adds a branded finishing touch to crochet kits.", purpose: "Branding", price: 28, MOQ: "800 units", category: "Gift Packaging", tags: ["card", "branding"], ecoFriendly: true, reusable: false, recyclable: true }],
  Bakery: [{ name: "Bakery Label", description: "Food-safe label for cupcake and cake packaging.", purpose: "Labelling", price: 30, MOQ: "1000 units", category: "Food Packaging", tags: ["label", "food-safe"], ecoFriendly: true, reusable: false, recyclable: true }],
  Jewellery: [{ name: "Jewellery Care Card", description: "Card that explains safe storage and care for jewellery pieces.", purpose: "Branding", price: 34, MOQ: "600 units", category: "Luxury Packaging", tags: ["care", "luxury"], ecoFriendly: true, reusable: false, recyclable: true }],
  Candles: [{ name: "Candle Sticker", description: "Brand sticker for candle boxes and seasonal collections.", purpose: "Branding", price: 24, MOQ: "1200 units", category: "Retail Packaging", tags: ["sticker", "branding"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Handmade Soap": [{ name: "Soap Tag", description: "Paper tag with ingredients and care instructions.", purpose: "Branding", price: 26, MOQ: "900 units", category: "Gift Packaging", tags: ["tag", "natural"], ecoFriendly: true, reusable: false, recyclable: true }],
  Clothing: [{ name: "Care Card", description: "Care guide card for apparel packaging and returns.", purpose: "Branding", price: 32, MOQ: "800 units", category: "Retail Packaging", tags: ["care", "apparel"], ecoFriendly: true, reusable: false, recyclable: true }],
  Chocolates: [{ name: "Chocolate Sticker", description: "Premium sticker that highlights the flavour and artisan story.", purpose: "Branding", price: 27, MOQ: "1000 units", category: "Gift Packaging", tags: ["sticker", "premium"], ecoFriendly: true, reusable: false, recyclable: true }],
  Rakhi: [{ name: "Rakhi Tag", description: "Decorative tag that completes festive rakhi packaging.", purpose: "Branding", price: 22, MOQ: "900 units", category: "Seasonal Packaging", tags: ["festival", "tag"], ecoFriendly: true, reusable: false, recyclable: true }],
  Floss: [{ name: "Floss Care Tag", description: "Simple tag that shares product details and brand storytelling.", purpose: "Branding", price: 24, MOQ: "900 units", category: "Retail Packaging", tags: ["branding", "floss"], ecoFriendly: true, reusable: false, recyclable: true }],
  Gifts: [{ name: "Thank You Card", description: "Compact message card for gift boxes and premium packaging.", purpose: "Branding", price: 24, MOQ: "1000 units", category: "Gift Packaging", tags: ["gift", "card"], ecoFriendly: true, reusable: false, recyclable: true }],
  Pottery: [{ name: "Care Instruction Card", description: "Card with handling steps for ceramic and pottery orders.", purpose: "Branding", price: 26, MOQ: "800 units", category: "Protective Packaging", tags: ["care", "ceramic"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Handmade Crafts": [{ name: "Craft Tag", description: "Small tag that carries the maker story and care details.", purpose: "Branding", price: 24, MOQ: "1000 units", category: "Retail Packaging", tags: ["artisan", "tag"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Home Decor": [{ name: "Decor Sticker", description: "Label used to mark premium decor bundles and gift sets.", purpose: "Branding", price: 26, MOQ: "900 units", category: "Luxury Packaging", tags: ["decor", "sticker"], ecoFriendly: true, reusable: false, recyclable: true }],
  Cosmetics: [{ name: "Beauty Care Card", description: "Card with usage notes and storage guidance for beauty sets.", purpose: "Branding", price: 30, MOQ: "700 units", category: "Luxury Packaging", tags: ["beauty", "care"], ecoFriendly: true, reusable: false, recyclable: true }],
  Stationery: [{ name: "Stationery Label", description: "Label used to identify stationery sets and gift bundles.", purpose: "Branding", price: 22, MOQ: "1000 units", category: "Retail Packaging", tags: ["stationery", "label"], ecoFriendly: true, reusable: false, recyclable: true }],
  "Handmade Accessories": [{ name: "Accessory Tag", description: "Elegant tag for accessory gift sets and premium packaging.", purpose: "Branding", price: 24, MOQ: "900 units", category: "Gift Packaging", tags: ["accessory", "brand"], ecoFriendly: true, reusable: false, recyclable: true }],
};

const supplierTemplates: Record<string, Array<{ name: string; location: string; rating: number; deliveryTime: string; tags: string[]; description: string }>> = {
  Crochet: [{ name: "CraftLoop Supply", location: "Mumbai", rating: 4.8, deliveryTime: "4 days", tags: ["fast", "verified"], description: "Specialises in durable wrapping and yarn-safe mailers." }],
  Bakery: [{ name: "BakeNest Packaging", location: "Delhi", rating: 4.7, deliveryTime: "3 days", tags: ["food-safe", "verified"], description: "Trusted for food-safe bakery wraps and trays." }],
  Jewellery: [{ name: "LuxeVault Supply", location: "Bengaluru", rating: 4.9, deliveryTime: "5 days", tags: ["luxury", "verified"], description: "Premium supplier for jewellery boxes and protective inserts." }],
  Candles: [{ name: "GlowBox Materials", location: "Ahmedabad", rating: 4.6, deliveryTime: "4 days", tags: ["candle", "verified"], description: "Reliable for protective candle packaging and labels." }],
  "Handmade Soap": [{ name: "Botanica Pack", location: "Jaipur", rating: 4.7, deliveryTime: "3 days", tags: ["natural", "verified"], description: "Eco-friendly packaging supplier for skin-safe soap bundles." }],
  Clothing: [{ name: "ThreadLine Packaging", location: "Chennai", rating: 4.5, deliveryTime: "4 days", tags: ["fashion", "verified"], description: "Supports apparel-ready mailers and retail ship-ready boxes." }],
  Chocolates: [{ name: "ChocoWrap Co", location: "Mumbai", rating: 4.8, deliveryTime: "5 days", tags: ["confectionery", "verified"], description: "Known for premium chocolate box and freshness protection solutions." }],
  Rakhi: [{ name: "Festive Pack Studio", location: "Delhi", rating: 4.6, deliveryTime: "3 days", tags: ["festival", "verified"], description: "Specialist in seasonal rakhi gift boxes and festive sleeves." }],
  Floss: [{ name: "FreshMint Pack", location: "Mumbai", rating: 4.6, deliveryTime: "4 days", tags: ["oral-care", "verified"], description: "Specialises in compact oral-care packaging and sample-ready boxes." }],
  Gifts: [{ name: "GiftWrap Hub", location: "Bengaluru", rating: 4.7, deliveryTime: "4 days", tags: ["gift", "verified"], description: "Delivers premium gift wrap and branded cards at scale." }],
  Pottery: [{ name: "ClaySafe Supply", location: "Jaipur", rating: 4.8, deliveryTime: "4 days", tags: ["fragile", "verified"], description: "Frangible pottery packaging with moulded support inserts." }],
  "Handmade Crafts": [{ name: "Artisan Wrap Co", location: "Kolkata", rating: 4.6, deliveryTime: "4 days", tags: ["artisan", "verified"], description: "Supports artisan packs with corrugated mailers and inserts." }],
  "Home Decor": [{ name: "DecorLine Supply", location: "Pune", rating: 4.7, deliveryTime: "5 days", tags: ["decor", "verified"], description: "Premium decor packaging with soft wrap and rigid box options." }],
  Cosmetics: [{ name: "GlowPack Studio", location: "Mumbai", rating: 4.8, deliveryTime: "4 days", tags: ["beauty", "verified"], description: "Specialises in beauty boxes and protective mailers." }],
  Stationery: [{ name: "PaperNest Supply", location: "Delhi", rating: 4.5, deliveryTime: "3 days", tags: ["stationery", "verified"], description: "Reliable paper-based packaging for stationery and notebooks." }],
  "Handmade Accessories": [{ name: "AccentPack Labs", location: "Bengaluru", rating: 4.7, deliveryTime: "4 days", tags: ["accessory", "verified"], description: "Elegant packaging solutions for small accessory bundles." }],
};

function buildBusinessRecords<T>(type: string, templates: Record<string, T[]>, builder: (template: T, index: number) => T) {
  const source = templates[type] ?? [];
  return source.flatMap((template, index) => [builder(template, index)]);
}

export function getBusinesses(): Business[] {
  return businessTypes.flatMap((businessType, index) => [
    {
      id: `business-${index + 1}`,
      name: `${businessType}`,
      businessType,
      description: `A growing ${businessType.toLowerCase()} business that needs premium, purpose-built packaging.`,
      imageUrl: createImage("photo-1523474253046-8cd2748b5fd2"),
      category: categoryNames[index % categoryNames.length],
      contact: index === 0 ? "hello@northstarpackaging.in" : undefined,
      pricing: index === 0 ? "From ₹95 per unit" : undefined,
      tags: [businessType.toLowerCase(), "growth", "retail"],
    },
  ]);
}

export function getPackagingMaterials(): PackagingMaterial[] {
  return businessTypes.flatMap((businessType, businessIndex) =>
    (materialTemplates[businessType] ?? []).map((template, index) => ({
      id: `material-${businessIndex + 1}-${index + 1}`,
      name: template.name,
      description: template.description,
      purpose: template.purpose,
      price: template.price + businessIndex * 6,
      MOQ: template.MOQ,
      supplierId: `supplier-${(businessIndex % supplierNames.length) + 1}`,
      category: template.category,
      businessTypes: [businessType],
      imageUrl: createImage("photo-1512436991641-6745cdb1723f"),
      tags: template.tags,
      ecoFriendly: template.ecoFriendly,
      reusable: template.reusable,
      recyclable: template.recyclable,
    })),
  );
}

export function getPackagingBoxes(): PackagingBox[] {
  return businessTypes.flatMap((businessType, businessIndex) =>
    (boxTemplates[businessType] ?? []).map((template, index) => ({
      id: `box-${businessIndex + 1}-${index + 1}`,
      name: template.name,
      description: template.description,
      purpose: template.purpose,
      price: template.price + businessIndex * 8,
      MOQ: template.MOQ,
      supplierId: `supplier-${(businessIndex % supplierNames.length) + 1}`,
      category: template.category,
      businessTypes: [businessType],
      imageUrl: createImage("photo-1517048676732-d65bc937f952"),
      tags: template.tags,
      ecoFriendly: template.ecoFriendly,
      reusable: template.reusable,
      recyclable: template.recyclable,
    })),
  );
}

export function getAccessories(): Accessory[] {
  return businessTypes.flatMap((businessType, businessIndex) =>
    (accessoryTemplates[businessType] ?? []).map((template, index) => ({
      id: `accessory-${businessIndex + 1}-${index + 1}`,
      name: template.name,
      description: template.description,
      purpose: template.purpose,
      price: template.price + businessIndex * 4,
      MOQ: template.MOQ,
      supplierId: `supplier-${(businessIndex % supplierNames.length) + 1}`,
      category: template.category,
      businessTypes: [businessType],
      imageUrl: createImage("photo-1497366754035-f200968a6e72"),
      tags: template.tags,
      ecoFriendly: template.ecoFriendly,
      reusable: template.reusable,
      recyclable: template.recyclable,
    })),
  );
}

export function getSuppliers(): Supplier[] {
  return businessTypes.flatMap((businessType, businessIndex) =>
    (supplierTemplates[businessType] ?? []).map((template, index) => ({
      id: `supplier-${businessIndex + 1}-${index + 1}`,
      name: template.name,
      description: template.description,
      imageUrl: createImage("photo-1524758631624-e2822e304c36"),
      category: categoryNames[(businessIndex + index) % categoryNames.length],
      location: template.location,
      rating: template.rating,
      deliveryTime: template.deliveryTime,
      tags: template.tags,
      businessTypes: [businessType],
    })),
  );
}

export function getCategories(): CategoryEntry[] {
  return [
    { id: "category-1", name: "Protective Packaging", description: "Shock protection for fragile products.", imageUrl: createImage("photo-1512436991641-6745cdb1723f"), tags: ["protective", "shipping"] },
    { id: "category-2", name: "Luxury Packaging", description: "Elevated packaging for premium goods.", imageUrl: createImage("photo-1517048676732-d65bc937f952"), tags: ["premium", "gift"] },
    { id: "category-3", name: "Eco Packaging", description: "Reusable and recyclable packaging systems.", imageUrl: createImage("photo-1497366754035-f200968a6e72"), tags: ["eco", "sustainable"] },
  ];
}

export function getPackagingGuides(): PackagingGuide[] {
  return [
    {
      id: "guide-1",
      title: "Crochet kit packaging guide",
      summary: "Create a protective and branded unboxing experience for crochet supplies.",
      steps: ["Use molded pulp trays for fragile tools.", "Add a kraft mailer for shipping resilience.", "Finish with a thank-you card and a brand sticker."],
      category: "Protective Packaging",
      businessType: "Crochet",
    },
    {
      id: "guide-2",
      title: "Bakery gift packaging guide",
      summary: "Balance food safety and premium presentation for bakery products.",
      steps: ["Use food-safe paper wraps.", "Add eco-friendly tissue and labels.", "Choose boxes with clear ventilation."],
      category: "Food Packaging",
      businessType: "Bakery",
    },
    {
      id: "guide-3",
      title: "Jewellery packaging guide",
      summary: "Protect delicate items while preserving premium presentation.",
      steps: ["Use rigid boxes and anti-tarnish inserts.", "Add velvet pouches and care cards.", "Choose premium finishing labels."],
      category: "Luxury Packaging",
      businessType: "Jewellery",
    },
    {
      id: "guide-4",
      title: "Candle packaging guide",
      summary: "Secure fragrance and wax products for safe shipping and premium presentation.",
      steps: ["Use protective inserts and candle shipping boxes.", "Add warning labels and branded stickers.", "Choose clearly labelled cartons."],
      category: "Protective Packaging",
      businessType: "Candles",
    },
    {
      id: "guide-5",
      title: "Floss packaging guide",
      summary: "Keep floss packs compact, hygienic and presentation-ready.",
      steps: ["Use sealed sleeves for hygiene.", "Pair with branded boxes for retail display.", "Add care tags for product details."],
      category: "Retail Packaging",
      businessType: "Floss",
    },
  ];
}

export function getEcoAlternatives(): EcoAlternative[] {
  return [
    { id: "eco-1", name: "Recycled kraft mailer", description: "A lighter alternative to bubble mailers.", imageUrl: createImage("photo-1524758631624-e2822e304c36"), category: "Eco Packaging", businessType: "Crochet" },
    { id: "eco-2", name: "Pulp insert tray", description: "Reusable cushioning for fragile items.", imageUrl: createImage("photo-1517048676732-d65bc937f952"), category: "Protective Packaging", businessType: "Bakery" },
    { id: "eco-3", name: "Biodegradable tissue wrap", description: "A soft protective wrap that works well for gift boxes.", imageUrl: createImage("photo-1497366754035-f200968a6e72"), category: "Eco Packaging", businessType: "Gifts" },
  ];
}
