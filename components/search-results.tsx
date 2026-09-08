"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Minus, Plus, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers";
import type { Accessory, PackagingBox, PackagingMaterial, SearchFilters, SearchResult } from "@/types";

type Product = PackagingMaterial | PackagingBox | Accessory;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseMinimumOrder(value: string) {
  const match = value.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function normalizeQueryDisplay(query: string): string {
  if (!query) return "";
  const trimmed = query.trim();
  const lowerQuery = trimmed.toLowerCase();
  if (lowerQuery.startsWith("packaging for ")) {
    return trimmed.substring(14).trim();
  }
  return trimmed;
}

function parseSearchParams(searchParams: URLSearchParams): SearchFilters {
  return {
    businessType: searchParams.get("businessType") || "General",
    category: searchParams.get("category") || "",
    material: searchParams.get("material") || "",
    supplier: searchParams.get("supplier") || "",
    ecoFriendly: searchParams.get("ecoFriendly") === "true",
    reusable: searchParams.get("reusable") === "true",
    recyclable: searchParams.get("recyclable") === "true",
    maxPrice: Number(searchParams.get("maxPrice") ?? "") || 5000,
    availability: searchParams.get("availability") || "all",
  };
}

function isRealProduct(value: unknown): value is {
  id: string;
  name: string;
  price: number;
  minimumOrderQuantity: string;
  purpose?: string;
  description?: string;
  ecoFriendly?: boolean;
  reusable?: boolean;
  recyclable?: boolean;
} {
  return !!value && typeof value === "object" && "id" in value && "name" in value;
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const query = searchParams?.get("q") ?? "";
  const paramString = useMemo(() => searchParams?.toString() ?? "", [searchParams]);
  const filters = useMemo(() => parseSearchParams(new URLSearchParams(paramString)), [paramString]);

  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [moqWarning, setMoqWarning] = useState("");
  const [materialLimit, setMaterialLimit] = useState(4);
  const [recommendationLimit, setRecommendationLimit] = useState(3);
  const [accessoryLimit, setAccessoryLimit] = useState(4);
  const [entryQuery, setEntryQuery] = useState(query || "");
  const [packagingGoal, setPackagingGoal] = useState<"best-value" | "eco-friendly" | "premium">("best-value");
  const [packagingBudget, setPackagingBudget] = useState<number | null>(null);
  const packagingGoalOptions = [
    { value: "best-value", label: "Best Value" },
    { value: "eco-friendly", label: "Eco-Friendly" },
    { value: "premium", label: "Premium" },
  ] as const;

  const quickSearches = [
    "Packaging for Bakery",
    "Packaging for Crochet",
    "Packaging for Jewellery",
    "Packaging for Chocolate",
    "Packaging for Candles",
    "Packaging for Rakhi",
  ];

  useEffect(() => {
    startTransition(() => setEntryQuery(query || ""));
  }, [query]);

  const submitSearch = (nextQuery?: string) => {
    const value = (nextQuery ?? entryQuery).trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    if (!query) {
      startTransition(() => {
        setResult(null);
        setError(null);
        setLoading(false);
      });
      return;
    }

    const params = new URLSearchParams();
    params.set("q", query);
    if (filters.businessType && filters.businessType !== "General") params.set("businessType", filters.businessType);
    if (filters.category) params.set("category", filters.category);
    if (filters.material) params.set("material", filters.material);
    if (filters.supplier) params.set("supplier", filters.supplier);
    if (filters.ecoFriendly) params.set("ecoFriendly", "true");
    if (filters.reusable) params.set("reusable", "true");
    if (filters.recyclable) params.set("recyclable", "true");
    params.set("maxPrice", String(filters.maxPrice || 5000));
    params.set("availability", filters.availability || "all");

    const controller = new AbortController();
    startTransition(() => {
      setLoading(true);
      setError(null);
    });

    fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load search results");
        return response.json();
      })
      .then((data) => setResult(data as SearchResult))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Unable to load search results");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query, filters.businessType, filters.category, filters.material, filters.supplier, filters.ecoFriendly, filters.reusable, filters.recyclable, filters.maxPrice, filters.availability]);

  useEffect(() => {
    startTransition(() => {
      setMaterialLimit(4);
      setRecommendationLimit(3);
      setAccessoryLimit(4);
      setSelectedItems([]);
      setSelectedQuantities({});
      setMoqWarning("");
    });
  }, [query]);

  const updateQuantity = (itemId: string, itemMinimumOrder: string, nextQuantity: number) => {
    const minimumOrder = parseMinimumOrder(itemMinimumOrder);
    const safeQuantity = Number.isFinite(nextQuantity) ? Math.max(0, Math.round(nextQuantity)) : 0;

    if (minimumOrder > 0 && safeQuantity > 0 && safeQuantity < minimumOrder) {
      setSelectedQuantities((prev) => ({ ...prev, [itemId]: minimumOrder }));
      setMoqWarning(`Minimum order quantity is ${minimumOrder} units.`);
      return;
    }

    setMoqWarning("");
    setSelectedQuantities((prev) => ({ ...prev, [itemId]: safeQuantity }));
  };

  const togglePlanItem = (itemId: string, itemMinimumOrder: string) => {
    const hasSelection = selectedItems.includes(itemId);

    if (hasSelection) {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      return;
    }

    const minimumOrder = parseMinimumOrder(itemMinimumOrder);
    const currentQty = selectedQuantities[itemId] ?? 0;
    const nextQty = currentQty > 0 ? currentQty : Math.max(minimumOrder || 1, 1);

    setSelectedQuantities((prev) => ({ ...prev, [itemId]: nextQty }));
    setSelectedItems((prev) => [...prev, itemId]);
  };

  const planItems = useMemo(() => {
    if (!result) return { materials: [], recommendations: [], accessories: [] };

    return {
      materials: result.materials.filter((item) => selectedItems.includes(item.id)).map((item) => ({
        ...item,
        quantity: selectedQuantities[item.id] ?? 0,
        total: (selectedQuantities[item.id] ?? 0) * item.price,
      })),
      recommendations: result.boxes.filter((item) => selectedItems.includes(item.id)).map((item) => ({
        ...item,
        quantity: selectedQuantities[item.id] ?? 0,
        total: (selectedQuantities[item.id] ?? 0) * item.price,
      })),
      accessories: result.accessories.filter((item) => selectedItems.includes(item.id)).map((item) => ({
        ...item,
        quantity: selectedQuantities[item.id] ?? 0,
        total: (selectedQuantities[item.id] ?? 0) * item.price,
      })),
    };
  }, [result, selectedItems, selectedQuantities]);

  const planTotals = useMemo(() => {
    const materials = planItems.materials.reduce((sum, item) => sum + item.total, 0);
    const recommendations = planItems.recommendations.reduce((sum, item) => sum + item.total, 0);
    const accessories = planItems.accessories.reduce((sum, item) => sum + item.total, 0);
    return { materials, recommendations, accessories, total: materials + recommendations + accessories };
  }, [planItems]);

  const budgetStatus = useMemo(() => {
    if (packagingBudget === null) return null;
    const diff = packagingBudget - planTotals.total;
    return {
      budget: packagingBudget,
      spent: planTotals.total,
      remaining: Math.max(0, diff),
      isOver: planTotals.total > packagingBudget,
      overAmount: Math.max(0, planTotals.total - packagingBudget),
      percentUsed: Math.min(100, Math.round((planTotals.total / packagingBudget) * 100)),
    };
  }, [packagingBudget, planTotals.total]);

  const smartBudgetMessage = useMemo(() => {
    if (!budgetStatus || planItems.materials.length === 0 && planItems.recommendations.length === 0 && planItems.accessories.length === 0) {
      return null;
    }

    if (budgetStatus.isOver) {
      return `Current plan exceeds your budget by ${formatCurrency(budgetStatus.overAmount)}.`;
    }

    if (budgetStatus.percentUsed >= 75) {
      return `Only ${formatCurrency(budgetStatus.remaining)} remaining.`;
    }

    if (budgetStatus.remaining > 5000) {
      return `${formatCurrency(budgetStatus.remaining)} remaining for branding or finishing.`;
    }

    return `Your current plan is comfortably within budget.`;
  }, [budgetStatus, planItems]);

  const completeness = useMemo(() => {
    if (!result) return { done: 0, total: 3, items: [] as Array<{ label: string; done: boolean }>, isPrimary: false, isProtection: false, isFinishing: false };

    const primarySelected = planItems.materials.length > 0 || planItems.recommendations.length > 0;
    const protectionSelected = planItems.materials.some((item) => /wrap|insert|foam|bubble|cushion|mailer|protect|paper/i.test(item.name)) || planItems.recommendations.some((item) => /wrap|insert|foam|bubble|cushion|mailer|protect|paper/i.test(item.name));
    const brandingSelected = planItems.accessories.some((item) => /card|label|tag|ribbon|seal|sticker|thank|care/i.test(item.name));

    const items = [
      { label: "Primary packaging", done: primarySelected },
      { label: "Protection", done: protectionSelected },
      { label: "Branding / finishing", done: brandingSelected },
    ];

    return { done: items.filter((item) => item.done).length, total: items.length, items, isPrimary: primarySelected, isProtection: protectionSelected, isFinishing: brandingSelected };
  }, [planItems, result]);

  const nextBestStep = useMemo(() => {
    if (!result || completeness.done === completeness.total) return null;

    // Find what's missing and suggest from database
    if (!completeness.isPrimary) {
      const primaryCandidates = [...result.materials, ...result.boxes];
      let filtered = primaryCandidates;

      // Filter by packaging goal
      if (packagingGoal === "eco-friendly") {
        const ecoFiltered = primaryCandidates.filter((item) => item.ecoFriendly || item.recyclable || item.reusable);
        filtered = ecoFiltered.length > 0 ? ecoFiltered : primaryCandidates;
      } else if (packagingGoal === "premium") {
        const premiumFiltered = primaryCandidates.filter((item) => /premium|rigid|gift|presentation|luxury/i.test(`${item.name} ${item.description ?? ""}`));
        filtered = premiumFiltered.length > 0 ? premiumFiltered : primaryCandidates;
      }

      // Filter by budget
      if (budgetStatus && budgetStatus.remaining > 0) {
        const budgetFiltered = filtered.filter((item) => item.price <= budgetStatus.remaining);
        if (budgetFiltered.length > 0) {
          filtered = budgetFiltered;
        } else if (budgetStatus.remaining < 1000) {
          return { type: "primary", item: null, message: "No primary packaging option fits the remaining budget." };
        }
      }

      if (filtered.length > 0) {
        const suggested = filtered[0];
        return { type: "primary", item: suggested, message: `Add ${suggested.name} for primary packaging.` };
      }
    } else if (!completeness.isProtection) {
      const protectionCandidates = result.materials.filter((item) => /wrap|liner|foam|insert|bubble|cushion|paper|protect/i.test(item.name));

      let filtered = protectionCandidates;
      if (packagingGoal === "eco-friendly") {
        const ecoFiltered = protectionCandidates.filter((item) => item.ecoFriendly || item.recyclable || item.reusable);
        filtered = ecoFiltered.length > 0 ? ecoFiltered : protectionCandidates;
      }

      if (budgetStatus && budgetStatus.remaining > 0) {
        const budgetFiltered = filtered.filter((item) => item.price <= budgetStatus.remaining);
        if (budgetFiltered.length > 0) {
          filtered = budgetFiltered;
        } else if (budgetStatus.remaining < 500) {
          return { type: "protection", item: null, message: "No protection option fits the remaining budget." };
        }
      }

      if (filtered.length > 0) {
        const suggested = filtered[0];
        return { type: "protection", item: suggested, message: `Add ${suggested.name} for protection.` };
      }
    } else if (!completeness.isFinishing) {
      const finishingCandidates = result.accessories.filter((item) => /card|label|tag|ribbon|seal|sticker|thank|care|badge/i.test(item.name));

      let filtered = finishingCandidates;
      if (packagingGoal === "premium") {
        const premiumFiltered = finishingCandidates.filter((item) => /premium|gift|sticker|ribbon|seal/i.test(`${item.name} ${item.description ?? ""}`));
        filtered = premiumFiltered.length > 0 ? premiumFiltered : finishingCandidates;
      }

      if (budgetStatus && budgetStatus.remaining > 0) {
        const budgetFiltered = filtered.filter((item) => item.price <= budgetStatus.remaining);
        if (budgetFiltered.length > 0) {
          filtered = budgetFiltered;
        } else if (budgetStatus.remaining < 200) {
          return { type: "branding", item: null, message: "No finishing option fits the remaining budget." };
        }
      }

      if (filtered.length > 0) {
        const suggested = filtered[0];
        return { type: "branding", item: suggested, message: `Add ${suggested.name} to complete finishing.` };
      }
    }

    return null;
  }, [result, completeness, packagingGoal, budgetStatus]);

  const activeFilterCount =
    Number(Boolean(filters.businessType && filters.businessType !== "General")) +
    Number(Boolean(filters.category)) +
    Number(Boolean(filters.material)) +
    Number(filters.ecoFriendly) +
    Number(filters.reusable) +
    Number(filters.recyclable) +
    Number(filters.maxPrice < 5000);

  const searchContextLabel = result?.businessType && result.businessType !== "General" ? result.businessType : normalizeQueryDisplay(query) || "Business";

  const recommendedBoxes = useMemo(() => {
    if (!result) return [];

    const items = [...result.boxes];

    const toSearchText = (item: (typeof result.boxes)[number]) =>
      `${item.name} ${item.purpose} ${item.description ?? ""} ${item.tags.join(" ")}`.toLowerCase();

    const businessMatch = (item: (typeof result.boxes)[number]) => {
      const value = result.businessType && result.businessType !== "General" ? result.businessType.toLowerCase() : (query || "").toLowerCase();
      return value && toSearchText(item).includes(value) ? 1 : 0;
    };

    const usefulness = (item: (typeof result.boxes)[number]) => {
      const text = toSearchText(item);
      const premiumSignal = /(premium|rigid|gift|presentation|luxury|finish|case|box|pouch|mailer)/i.test(text) ? 1 : 0;
      const ecoSignal = /(recycl|reuse|eco|kraft|paper|biodegrad)/i.test(text) ? 1 : 0;
      const valueSignal = /(mailer|box|pouch|bag|wrap|insert|tray|sleeve|case)/i.test(text) ? 1 : 0;
      return (packagingGoal === "premium" ? premiumSignal : packagingGoal === "eco-friendly" ? ecoSignal : valueSignal);
    };

    const budgetFit = (item: (typeof result.boxes)[number]) => {
      if (!packagingBudget) return 0;
      const remainingBudget = packagingBudget - planTotals.total;
      const itemFits = item.price <= remainingBudget ? 1 : 0;
      return itemFits;
    };

    const ecoPriority = (item: (typeof result.boxes)[number]) => Number(item.ecoFriendly || item.reusable || item.recyclable);
    const premiumPriority = (item: (typeof result.boxes)[number]) =>
      /premium|rigid|gift|presentation|luxury|finishing|case|box|pouch|mailer/i.test(`${item.name} ${item.purpose} ${item.description ?? ""} ${item.tags.join(" ")}`) ? 1 : 0;

    return items.sort((a, b) => {
      if (packagingGoal === "eco-friendly") {
        return Number(b.ecoFriendly || b.reusable || b.recyclable) - Number(a.ecoFriendly || a.reusable || a.recyclable)
          || businessMatch(b) - businessMatch(a)
          || (packagingBudget ? budgetFit(b) - budgetFit(a) : 0)
          || a.price - b.price;
      }

      if (packagingGoal === "premium") {
        return premiumPriority(b) - premiumPriority(a)
          || businessMatch(b) - businessMatch(a)
          || (packagingBudget ? budgetFit(b) - budgetFit(a) : 0)
          || usefulness(b) - usefulness(a)
          || a.price - b.price;
      }

      return businessMatch(b) - businessMatch(a)
        || usefulness(a) - usefulness(b)
        || (packagingBudget ? budgetFit(b) - budgetFit(a) : 0)
        || a.price - b.price
        || parseMinimumOrder(a.minimumOrderQuantity) - parseMinimumOrder(b.minimumOrderQuantity);
    });
  }, [packagingGoal, query, result, packagingBudget, planTotals.total]);

  const ecoRecommendationCount = useMemo(() => result ? result.boxes.filter((item) => item.ecoFriendly || item.recyclable || item.reusable).length : 0, [result]);

  const goalHeadingLabel = packagingGoal === "best-value" ? "Optimized for Best Value" : packagingGoal === "eco-friendly" ? "Optimized for Eco-Friendly" : "Optimized for Premium";

  const aiInsight = useMemo(() => {
    if (!result) {
      return null;
    }

    const selected = [
      ...planItems.materials,
      ...planItems.recommendations,
      ...planItems.accessories,
    ];

    const contextItems = selected.length > 0
      ? selected
      : [
          ...recommendedBoxes.slice(0, 2),
          ...result.materials.slice(0, 2),
          ...result.accessories.slice(0, 2),
        ];

    const primaryItem = contextItems.find((item) => /box|board|mailer|pouch|container|pack|tray|case/i.test(item.name)) ?? contextItems[0];
    const protectionItem = contextItems.find((item) => /wrap|liner|foam|insert|bubble|cushion|paper|protect/i.test(item.name)) ?? contextItems[1] ?? contextItems[0];
    const ecoItem = contextItems.find((item) => item.ecoFriendly || item.recyclable || item.reusable) ?? contextItems[0];

    const businessLabel = result.businessType && result.businessType !== "General"
      ? result.businessType.toLowerCase()
      : (query || "your business").toLowerCase();

    const goalSummary = packagingGoal === "best-value"
      ? `For Best Value, the strongest route is to keep the setup practical and cost-conscious for ${businessLabel} while still protecting the product during packing and delivery.`
      : packagingGoal === "eco-friendly"
        ? `For Eco-Friendly packaging, the goal is to lean on current recyclable, reusable, and eco-marked options already returned in the database.`
        : `For Premium packaging, the goal is to elevate presentation and gifting feel using the more polished, protective, and finishing-focused options already available in the results.`;

    let bestApproach = packagingGoal === "best-value"
      ? primaryItem && protectionItem && primaryItem.id !== protectionItem.id
        ? `Keep ${primaryItem.name} as the primary pack and pair it with ${protectionItem.name} for a practical, cost-aware setup that still protects the product.`
        : `Use ${primaryItem ? primaryItem.name : "the most relevant pack"} as the core option for a balanced, lower-cost packaging choice.`
      : packagingGoal === "eco-friendly"
        ? ecoItem && (ecoItem.ecoFriendly || ecoItem.recyclable || ecoItem.reusable)
          ? `Use ${ecoItem.name} as the eco-leaning anchor, keeping the rest of the packaging aligned with the existing recyclable or reusable options in the database.`
          : `Lean on the existing eco-labelled materials and protective wraps already returned for ${businessLabel} packaging.`
        : primaryItem && protectionItem && primaryItem.id !== protectionItem.id
          ? `Prioritise ${primaryItem.name} for presentation and ${protectionItem.name} for protection so the packaging feels premium without losing function.`
          : `Use ${primaryItem ? primaryItem.name : "the strongest presentation-ready match"} as the premium core option for ${businessLabel}.`;

    if (budgetStatus && budgetStatus.remaining > 0) {
      const affordableAccessories = result.accessories.filter((acc) => acc.price <= budgetStatus.remaining);
      if (affordableAccessories.length > 0 && budgetStatus.percentUsed >= 50) {
        const nextItem = affordableAccessories[0];
        bestApproach += ` With ${formatCurrency(budgetStatus.remaining)} remaining, you could add ${nextItem.name} from the current BizLink results for branding or finishing.`;
      }
    }

    const whyItFits = packagingGoal === "best-value"
      ? `The current results support a lower-cost approach that still keeps the packaging useful for ${businessLabel}, with durable structure and sensible protection rather than over-investing in extra finishings.`
      : packagingGoal === "eco-friendly"
        ? `The current database already contains reusable and recyclable materials that align with eco-focused packaging while staying consistent with the practical needs of ${businessLabel}.`
        : `The stronger premium matches are geared toward presentation, gifting, and protective finishings, which suits ${businessLabel} when presentation and unboxing experience matter.`;

    const smartAlternative = packagingGoal === "best-value"
      ? result.aiSuggestion?.bullets?.[0] ?? `Keep the recommended pack lean and practical, then choose the lowest-cost protective layer that still keeps the product intact.`
      : packagingGoal === "eco-friendly"
        ? ecoItem && (ecoItem.ecoFriendly || ecoItem.recyclable || ecoItem.reusable)
          ? `If you want a greener alternative, consider ${ecoItem.name}, which already matches the current eco-led results.`
          : "Use the recyclable or reusable items already returned in the results to keep the packaging greener without forcing an empty alternative."
        : result.aiSuggestion?.bullets?.[1] ?? "For premium presentation, pair the main box with a more polished finishing accessory already returned in the current result set.";

    return { bestApproach, whyItFits, smartAlternative, goalSummary };
  }, [packagingGoal, planItems, query, recommendedBoxes, result, budgetStatus]);

  const updateFilterValue = (updates: Partial<SearchFilters>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const next = { ...filters, ...updates };

    if (query) params.set("q", query);
    if (next.businessType && next.businessType !== "General") params.set("businessType", next.businessType);
    else params.delete("businessType");
    if (next.category) params.set("category", next.category);
    else params.delete("category");
    if (next.material) params.set("material", next.material);
    else params.delete("material");
    if (next.ecoFriendly) params.set("ecoFriendly", "true");
    else params.delete("ecoFriendly");
    if (next.reusable) params.set("reusable", "true");
    else params.delete("reusable");
    if (next.recyclable) params.set("recyclable", "true");
    else params.delete("recyclable");
    if (next.maxPrice && next.maxPrice !== 5000) params.set("maxPrice", String(next.maxPrice));
    else params.delete("maxPrice");

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const currentQuery = params.get("q");
    params.delete("businessType");
    params.delete("category");
    params.delete("material");
    params.delete("ecoFriendly");
    params.delete("reusable");
    params.delete("recyclable");
    params.delete("maxPrice");

    if (currentQuery) router.push(`/search?q=${encodeURIComponent(currentQuery)}`);
    else router.push("/search");
  };

  const renderProductTile = (item: Product, variant: "material" | "recommendation" | "accessory") => {
    if (!isRealProduct(item)) return null;

    const minOrder = parseMinimumOrder(item.minimumOrderQuantity);
    const quantity = selectedQuantities[item.id] ?? (minOrder > 0 ? minOrder : 0);
    const subtotal = item.price * quantity;
    const isSelected = selectedItems.includes(item.id);

    return (
      <div
        key={item.id}
        className={`w-full min-w-0 rounded-[22px] border p-4 transition duration-200 hover:-translate-y-0.5 ${isSelected ? "border-[var(--accent)] bg-[var(--accent-soft)]/30" : "border-[var(--border)] bg-[var(--surface-card)]"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-[var(--text-primary)]">{item.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.purpose || item.description || "Packaging solution"}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
            ₹{item.price}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[var(--text-secondary)]">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-panel)] px-2.5 py-1">MOQ {item.minimumOrderQuantity}</span>
          {item.ecoFriendly && <span className="rounded-full border border-[var(--border)] bg-[var(--surface-panel)] px-2.5 py-1">Eco</span>}
          {item.reusable && <span className="rounded-full border border-[var(--border)] bg-[var(--surface-panel)] px-2.5 py-1">Reusable</span>}
          {item.recyclable && <span className="rounded-full border border-[var(--border)] bg-[var(--surface-panel)] px-2.5 py-1">Recyclable</span>}
        </div>

        <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-panel)] p-3">
          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <span>Quantity</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.minimumOrderQuantity, minOrder > 0 ? minOrder : 1)}
              className="text-[11px] font-medium text-[var(--accent)]"
            >
              Use MOQ
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <button type="button" onClick={() => updateQuantity(item.id, item.minimumOrderQuantity, Math.max((quantity || 0) - 1, 0))} className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--accent-soft)]">
                <Minus size={14} />
              </button>
              <input
                type="number"
                min={minOrder || 1}
                value={quantity}
                onChange={(event) => updateQuantity(item.id, item.minimumOrderQuantity, Number(event.target.value))}
                className="qty-input h-10 w-16 border-0 bg-transparent px-2 text-center text-sm text-[var(--text-primary)] outline-none"
              />
              <button type="button" onClick={() => updateQuantity(item.id, item.minimumOrderQuantity, (quantity || 0) + 1)} className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--accent-soft)]">
                <Plus size={14} />
              </button>
            </div>

            <span className="ml-auto text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(subtotal)}</span>
          </div>

          {minOrder > 0 && quantity < minOrder && (
            <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Minimum order quantity is {minOrder} units.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => togglePlanItem(item.id, item.minimumOrderQuantity)}
            className={`flex-1 rounded-full px-3.5 py-2 text-sm font-medium transition ${isSelected ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"}`}
          >
            {isSelected ? "Added ✓" : "Add to Plan"}
          </button>
          <Link href={`/details/${variant}/${item.id}`} className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-large)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Details
          </Link>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, subtitle: string, items: Product[], variant: "material" | "recommendation" | "accessory", limit: number) => {
    if (!items.length) return null;

    const visible = items.slice(0, limit);
    const surfaceClass = variant === "material" ? "border-[var(--border)] bg-[var(--bg-surface)]" : variant === "recommendation" ? "border-[var(--border)] bg-[var(--surface-large)]" : "border-[var(--border)] bg-[var(--surface-card)]";

    return (
      <section className={`rounded-[26px] border p-4 shadow-[var(--shadow-soft)] ${surfaceClass}`}>
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[var(--accent)]" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        </div>
        {subtitle && <p className="mb-4 text-sm text-[var(--text-secondary)]">{subtitle}</p>}

        <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {visible.map((item) => renderProductTile(item, variant))}
        </div>

        {items.length > limit && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (variant === "material") setMaterialLimit((current) => Math.min(current + 2, items.length));
                if (variant === "recommendation") setRecommendationLimit((current) => Math.min(current + 2, items.length));
                if (variant === "accessory") setAccessoryLimit((current) => Math.min(current + 2, items.length));
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              View More
            </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-large)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--accent)]">
          <ArrowLeft size={16} />
          {t("backHome")}
        </Link>
      </div>

      {error ? (
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)]">
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
        </section>
      ) : loading ? (
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-40 rounded-full bg-[var(--surface-muted)]" />
            <div className="h-8 w-72 rounded-full bg-[var(--surface-muted)]" />
            <div className="h-24 rounded-[22px] bg-[var(--surface-muted)]" />
          </div>
        </section>
      ) : !query ? (
        <section className="mx-auto max-w-[820px] rounded-[30px] border border-[var(--border)] bg-[var(--surface-large)] p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:p-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            <Sparkles size={12} className="text-[var(--accent)]" />
            Search packaging
          </div>

          <h1 className="mt-5 text-[clamp(2.2rem,4vw,4rem)] font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
            Search packaging
          </h1>

          <p className="mt-3 max-w-[620px] text-base leading-7 text-[var(--text-secondary)]">
            Find packaging materials, recommendations and accessories for your business.
          </p>

          <div className="mt-7 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] p-2.5 shadow-[0_12px_30px_rgba(11,46,38,0.08)]">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={entryQuery}
                  onChange={(event) => setEntryQuery(event.target.value)}
                  placeholder="Search packaging for your business..."
                  className="h-[66px] w-full rounded-[16px] border border-[var(--border)] bg-[var(--bg-input)] pl-11 pr-4 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(127,169,155,0.12)]"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => submitSearch()}
                className="flex h-[54px] items-center justify-center rounded-[15px] bg-[var(--accent)] px-[28px] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,95,77,0.14)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Quick searches</p>
            <div className="flex flex-wrap gap-2.5">
              {quickSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitSearch(item)}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-3.5 py-2 text-sm text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : !result ? null : (
        <>
          <section className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-large)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Packaging for {normalizeQueryDisplay(query)}</p>
                <h1 className="mt-2 text-[clamp(1.7rem,2vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  Database-backed packaging plan
                </h1>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1">{result.materials.length} materials</span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1">{result.boxes.length} recommendations</span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1">{result.accessories.length} accessories</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-medium text-[var(--text-primary)]">
                <Sparkles size={14} className="text-[var(--accent)]" />
                {result.hasExactMatch ? "Live match" : "Closest match"}
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)_300px]">
            <aside className="min-w-0 rounded-[26px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-soft)] xl:sticky xl:top-[96px] xl:self-start">
              <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Filter Results</p>
                  <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">{filters.businessType && filters.businessType !== "General" ? filters.businessType : "Business"}</p>
                </div>
                <button type="button" onClick={clearFilters} className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  Clear filters
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Business Type</label>
                  <select
                    value={filters.businessType || "General"}
                    onChange={(event) => updateFilterValue({ businessType: event.target.value })}
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-3 text-sm text-[var(--text-primary)] outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Crochet">Crochet</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Candles">Candles</option>
                    <option value="Handmade Soap">Handmade Soap</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Chocolates">Chocolates</option>
                    <option value="Rakhi">Rakhi</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Category</label>
                  <select
                    value={filters.category || ""}
                    onChange={(event) => updateFilterValue({ category: event.target.value })}
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-3 text-sm text-[var(--text-primary)] outline-none"
                  >
                    <option value="">All categories</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Craft">Craft</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Candles">Candles</option>
                    <option value="Handmade Soap">Handmade Soap</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Chocolates">Chocolates</option>
                    <option value="Gift Products">Gift Products</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Material</label>
                  <input
                    value={filters.material || ""}
                    onChange={(event) => updateFilterValue({ material: event.target.value })}
                    placeholder="Search material..."
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Price Range</label>
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Up to {formatCurrency(filters.maxPrice || 5000)}</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={5000}
                    step={100}
                    value={filters.maxPrice || 5000}
                    onChange={(event) => updateFilterValue({ maxPrice: Number(event.target.value) })}
                    className="h-2 w-full accent-[var(--accent)]"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm text-[var(--text-primary)]">
                    <span>Eco Friendly</span>
                    <input type="checkbox" checked={filters.ecoFriendly} onChange={(event) => updateFilterValue({ ecoFriendly: event.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
                  </label>
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm text-[var(--text-primary)]">
                    <span>Reusable</span>
                    <input type="checkbox" checked={filters.reusable} onChange={(event) => updateFilterValue({ reusable: event.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
                  </label>
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm text-[var(--text-primary)]">
                    <span>Recyclable</span>
                    <input type="checkbox" checked={filters.recyclable} onChange={(event) => updateFilterValue({ recyclable: event.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
                  </label>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Packaging Goal</p>
                  <div className="mt-3 space-y-1.5">
                    {packagingGoalOptions.map((option) => {
                      const active = packagingGoal === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPackagingGoal(option.value)}
                          className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                            active
                              ? "border-[var(--accent-strong)] bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(22,101,52,0.22)]"
                              : "border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                          }`}
                          style={{ minWidth: 0, width: "100%" }}
                        >
                          <span className="truncate">{option.label}</span>
                          {active ? <span className="ml-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] leading-none text-white">✓</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Packaging Budget</p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">₹</span>
                    <input
                      type="number"
                      value={packagingBudget ?? ""}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        setPackagingBudget(val);
                      }}
                      placeholder="Enter budget"
                      className="h-8 w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="mt-2.5 flex gap-1.5">
                    {[5000, 10000, 25000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPackagingBudget(preset)}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                          packagingBudget === preset
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        ₹{preset / 1000}K
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Search Context</p>
                  <div className="mt-2 text-sm text-[var(--text-primary)]">{searchContextLabel}</div>
                  <div className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
                    <div>{result.materials.length} Materials</div>
                    <div>{result.boxes.length} Recommendation{result.boxes.length === 1 ? "" : "s"}</div>
                    <div>{result.accessories.length} Accessory{result.accessories.length === 1 ? "" : "ies"}</div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0 space-y-5">
              {renderSection("Packaging Materials", "", result.materials, "material", materialLimit)}
              <section className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-large)] p-4 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[var(--accent)]" />
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recommended for your business</h2>
                  <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                    {goalHeadingLabel}
                  </span>
                </div>
                <p className="mb-4 text-sm text-[var(--text-secondary)]">Based on your packaging requirements</p>
                {packagingGoal === "eco-friendly" && ecoRecommendationCount > 0 && ecoRecommendationCount < Math.min(result.boxes.length, 3) && (
                  <p className="mb-3 text-xs text-[var(--text-secondary)]">Limited eco-focused matches available.</p>
                )}
                <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
                  {recommendedBoxes.slice(0, recommendationLimit).map((item) => renderProductTile(item, "recommendation"))}
                </div>
                {result.boxes.length > recommendationLimit && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRecommendationLimit((current) => Math.min(current + 2, result.boxes.length))}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      View More
                    </button>
                  </div>
                )}
              </section>
              {renderSection("Finishing & Accessories", "", result.accessories, "accessory", accessoryLimit)}

              {aiInsight && (
                <section className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-large)] p-4 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between gap-3 pb-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">AI Packaging Insight</p>
                      <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">AI Packaging Insight</h2>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                      <Sparkles size={10} className="text-[var(--accent)]" />
                      Grounded in database results
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-[var(--text-secondary)]">Smart guidance grounded in your BizLink results</p>

                  <div className="divide-y divide-[var(--border)] rounded-[20px] border border-[var(--border)] bg-[var(--surface-card)]">
                    <div className="px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Goal focus</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{aiInsight.goalSummary}</p>
                    </div>

                    <div className="px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Best approach</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{aiInsight.bestApproach}</p>
                    </div>

                    <div className="px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Why it fits</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{aiInsight.whyItFits}</p>
                    </div>

                    <div className="px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Smart alternative</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{aiInsight.smartAlternative}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="min-w-0">
              <div className="sticky top-[96px] rounded-[26px] border border-[var(--border)] bg-[var(--surface-large)] p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">YOUR PACKAGING PLAN</p>
                    <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">Live summary</h3>
                  </div>
                  <Sparkles size={16} className="text-[var(--accent)]" />
                </div>

                <div className="mt-4 space-y-4 text-sm">
                  {planItems.materials.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        <span>Materials</span>
                        <span>{formatCurrency(planTotals.materials)}</span>
                      </div>
                      <div className="space-y-2">
                        {planItems.materials.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-2 text-sm text-[var(--text-primary)]">
                            <span className="min-w-0 truncate">{item.name}</span>
                            <span className="shrink-0 font-medium">{item.quantity} × {formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {planItems.recommendations.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        <span>Recommendations</span>
                        <span>{formatCurrency(planTotals.recommendations)}</span>
                      </div>
                      <div className="space-y-2">
                        {planItems.recommendations.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-2 text-sm text-[var(--text-primary)]">
                            <span className="min-w-0 truncate">{item.name}</span>
                            <span className="shrink-0 font-medium">{item.quantity} × {formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {planItems.accessories.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        <span>Accessories</span>
                        <span>{formatCurrency(planTotals.accessories)}</span>
                      </div>
                      <div className="space-y-2">
                        {planItems.accessories.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-2 text-sm text-[var(--text-primary)]">
                            <span className="min-w-0 truncate">{item.name}</span>
                            <span className="shrink-0 font-medium">{item.quantity} × {formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {planItems.materials.length === 0 && planItems.recommendations.length === 0 && planItems.accessories.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                      No items selected yet.
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <div className="space-y-2 text-sm text-[var(--text-primary)]">
                    <div className="flex items-center justify-between gap-3"><span>Materials</span><span>{formatCurrency(planTotals.materials)}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Recommendations</span><span>{formatCurrency(planTotals.recommendations)}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Accessories</span><span>{formatCurrency(planTotals.accessories)}</span></div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Estimated Total</span>
                      <span className="text-lg font-semibold text-[var(--text-primary)]">{formatCurrency(planTotals.total)}</span>
                    </div>
                  </div>

                  {budgetStatus && (
                    <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Budget</span>
                        <span className="text-xs font-medium text-[var(--text-primary)]">{formatCurrency(budgetStatus.spent)} of {formatCurrency(budgetStatus.budget)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--surface-panel)] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            budgetStatus.isOver
                              ? "bg-[#dc2626]"
                              : budgetStatus.percentUsed >= 75
                                ? "bg-[#f59e0b]"
                                : "bg-[var(--accent)]"
                          }`}
                          style={{ width: `${budgetStatus.percentUsed}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className={budgetStatus.isOver ? "text-[#dc2626] font-medium" : "text-[var(--text-secondary)]"}>
                          {budgetStatus.isOver ? `₹${budgetStatus.overAmount} over` : `₹${budgetStatus.remaining} remaining`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {budgetStatus && smartBudgetMessage && (
                  <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs leading-5 text-[var(--text-secondary)]">
                    {smartBudgetMessage}
                  </div>
                )}

                {budgetStatus && planItems.materials.length === 0 && planItems.recommendations.length === 0 && planItems.accessories.length === 0 && (
                  <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                    Add items to compare with your budget.
                  </div>
                )}

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">PLAN COMPLETENESS</p>
                  <div className="mt-3 space-y-2">
                    {completeness.items.map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${item.done ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--surface-panel)] text-[var(--text-muted)]"}`}>
                          {item.done ? "✓" : "○"}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-sm font-medium text-[var(--text-primary)]">
                    {completeness.done === completeness.total ? "✓ Packaging plan complete" : `${completeness.done} of ${completeness.total} essentials selected`}
                  </div>
                  {completeness.done === completeness.total ? (
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">Your plan covers primary packaging, protection and finishing.</p>
                  ) : nextBestStep ? (
                    <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-card)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Next best step</p>
                      <p className="mt-1 text-xs text-[var(--text-primary)]">{nextBestStep.message}</p>
                    </div>
                  ) : null}
                </div>

                {moqWarning && (
                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                    {moqWarning}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
