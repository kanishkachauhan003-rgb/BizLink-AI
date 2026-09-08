import { notFound } from "next/navigation";
import Link from "next/link";
import { accessories, boxes, materials } from "@/lib/seed-data";

interface MaterialPageProps {
  params: { id: string };
}

export default function MaterialPage({ params }: MaterialPageProps) {
  const material = materials.find((item) => item.id === params.id);
  const boxLookup = boxes.find((entry) => entry.id === params.id);
  const accessoryLookup = accessories.find((entry) => entry.id === params.id);
  const box = boxLookup ?? null;
  const accessory = accessoryLookup ?? null;
  const item = material ?? box ?? accessory;

  if (!item) {
    notFound();
  }

  const isBox = !!box;
  const isAccessory = !!accessory;
  const price = "price" in item ? item.price : 0;
  const supplier = "supplier" in item ? item.supplier : "";
  const minimumOrderQuantity = "minimumOrderQuantity" in item ? item.minimumOrderQuantity : "";
  const category = "category" in item ? item.category : "";
  const purpose = "purpose" in item ? item.purpose : "";
  const description = "description" in item ? item.description : "";
  const bestFor = "bestFor" in item ? item.bestFor : "";
  const availability = "availability" in item ? item.availability : "";
  const advantages = "advantages" in item ? item.advantages : [];
  const disadvantages = "disadvantages" in item ? item.disadvantages : [];
  const tags = "tags" in item ? item.tags : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)] shadow-2xl shadow-black/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">{isBox ? "Recommendation detail" : isAccessory ? "Accessory detail" : "Material detail"}</p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{item.name}</h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{purpose}</p>
          </div>
          <Link
            href="/search"
            className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)]"
          >
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
                <p className="text-sm text-[var(--text-secondary)]">Supplier</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{supplier || "Database-backed"}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Best for</p>
                <p className="mt-2 text-[var(--text-primary)]">{bestFor || "Business packaging use"}</p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Availability</p>
                <p className="mt-2 text-[var(--text-primary)]">{availability || "In stock"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Advantages</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
                  {advantages.length > 0 ? advantages.map((item) => <li key={item}>{item}</li>) : <li>Relevant packaging support.</li>}
                </ul>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">Disadvantages</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
                  {disadvantages.length > 0 ? disadvantages.map((item) => <li key={item}>{item}</li>) : <li>No major concern for this packaging use.</li>}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-card)] p-6 text-[var(--text-primary)] shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Supplier details</p>
              <p className="mt-3 text-[var(--text-primary)]">{supplier || "Database-backed supplier"}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">MOQ</p>
              <p className="mt-2 text-[var(--text-primary)]">{minimumOrderQuantity || "Varies"}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Category</p>
              <p className="mt-2 text-[var(--text-primary)]">{category || "Packaging"}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-large)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.length > 0 ? tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--surface-card)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                    {tag}
                  </span>
                )) : (
                  <span className="rounded-full bg-[var(--surface-card)] px-3 py-1 text-sm text-[var(--text-secondary)]">Packaging</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
