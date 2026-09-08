import Link from "next/link";
import { accessories, boxes, materials } from "@/lib/seed-data";

interface DetailPageProps {
  params: Promise<{ type?: string; id?: string }>;
}

function getRecord(type: string | undefined, id: string | undefined) {
  if (!type || !id) return null;

  const normalizedType = type.toLowerCase();
  if (normalizedType === "material") {
    return materials.find((item) => item.id === id) ?? null;
  }
  if (normalizedType === "recommendation" || normalizedType === "box") {
    return boxes.find((item) => item.id === id) ?? null;
  }
  if (normalizedType === "accessory") {
    return accessories.find((item) => item.id === id) ?? null;
  }

  return null;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { type, id } = await params;
  const item = getRecord(type, id);

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)] shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Item not found</p>
          <h1 className="mt-3 text-3xl font-semibold">This item could not be found.</h1>
          <p className="mt-3 text-[var(--text-secondary)]">The requested packaging item is not available in the current listing.</p>
          <Link href="/search" className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  const name = item.name;
  const category = item.category || "Packaging";
  const description = item.description || item.purpose || "No description available.";
  const price = item.price ?? 0;
  const minimumOrderQuantity = item.minimumOrderQuantity || "Varies";
  const supplier = item.supplier || "Database-backed supplier";
  const hasEco = item.ecoFriendly;
  const hasReusable = item.reusable;
  const hasRecyclable = item.recyclable;
  const bestFor = item.bestFor || "Business packaging and gifting";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)] shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">{type ? type.replace(/-/g, " ") : "Detail"}</p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{name}</h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{item.purpose || item.description}</p>
          </div>
          <Link href="/search" className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)]">
            Back to search
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-card)] p-8 text-[var(--text-primary)] shadow-sm">
          <div className="space-y-4">
            <div className="rounded-3xl bg-[var(--surface-large)] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Overview</p>
              <p className="mt-3 text-lg text-[var(--text-primary)]">{description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Price</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">₹{price}</p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">MOQ</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{minimumOrderQuantity}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Category</p>
                <p className="mt-2 text-[var(--text-primary)]">{category}</p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Best for</p>
                <p className="mt-2 text-[var(--text-primary)]">{bestFor}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">Attributes</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
                <span className="rounded-full bg-[var(--surface-card)] px-3 py-1">Eco: {hasEco ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[var(--surface-card)] px-3 py-1">Reusable: {hasReusable ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[var(--surface-card)] px-3 py-1">Recyclable: {hasRecyclable ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-card)] p-6 text-[var(--text-primary)] shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Supplier</p>
              <p className="mt-3 text-[var(--text-primary)]">{supplier}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Business relevance</p>
              <p className="mt-2 text-[var(--text-primary)]">{bestFor}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Type</p>
              <p className="mt-2 text-[var(--text-primary)]">{category}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
