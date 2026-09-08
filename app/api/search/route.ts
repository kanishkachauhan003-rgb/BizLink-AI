import { NextResponse } from "next/server";
import { searchBizLink } from "@/lib/search-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const businessType = url.searchParams.get("businessType") ?? "";
  const category = url.searchParams.get("category") ?? "";
  const supplier = url.searchParams.get("supplier") ?? "";
  const ecoFriendly = url.searchParams.get("ecoFriendly") === "true";
  const reusable = url.searchParams.get("reusable") === "true";
  const recyclable = url.searchParams.get("recyclable") === "true";
  const maxPrice = Number(url.searchParams.get("maxPrice") ?? "0") || 5000;
  const availability = url.searchParams.get("availability") ?? "all";
  const material = url.searchParams.get("material") ?? "";

  try {
    const result = searchBizLink(q, {
      businessType,
      category,
      material,
      supplier,
      ecoFriendly,
      reusable,
      recyclable,
      maxPrice,
      availability,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search. Please try again." }, { status: 500 });
  }
}
