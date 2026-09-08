import Link from "next/link";
import { businesses } from "@/lib/seed-data";
import { ProfileReadiness } from "@/components/profile-readiness";
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react";

interface BusinessPageProps {
  params: Promise<{ id?: string }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { id } = await params;
  const business = businesses.find((b) => b.id === id);

  if (!business) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)] shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Business not found</p>
          <h1 className="mt-3 text-3xl font-semibold">This business could not be found.</h1>
          <p className="mt-3 text-[var(--text-secondary)]">The requested business profile is not available.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-8 text-[var(--text-primary)] shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Business Profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">{business.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                {business.businessType}
              </span>
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-[var(--surface-panel)] text-[var(--text-secondary)]">
                {business.category}
              </span>
            </div>
            <p className="mt-4 text-[var(--text-secondary)] max-w-2xl">{business.description}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)]">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Readiness */}
          <ProfileReadiness business={business} />

          {/* Business Details */}
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Business Information</h3>
            <div className="space-y-4">
              <div className="rounded-[16px] bg-[var(--surface-large)] p-4">
                <p className="text-sm text-[var(--text-secondary)]">Business Type</p>
                <p className="mt-2 text-[var(--text-primary)] font-medium">{business.businessType}</p>
              </div>
              <div className="rounded-[16px] bg-[var(--surface-large)] p-4">
                <p className="text-sm text-[var(--text-secondary)]">Category</p>
                <p className="mt-2 text-[var(--text-primary)] font-medium">{business.category}</p>
              </div>
              <div className="rounded-[16px] bg-[var(--surface-large)] p-4">
                <p className="text-sm text-[var(--text-secondary)]">Description</p>
                <p className="mt-2 text-[var(--text-primary)]">{business.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Contact</h3>
            <div className="space-y-3">
              {business.email ? (
                <a href={`mailto:${business.email}`} className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] hover:bg-[var(--accent-soft)] transition">
                  <Mail size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] break-all">{business.email}</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] opacity-50">
                  <Mail size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">Not provided</span>
                </div>
              )}

              {business.phone ? (
                <a href={`tel:${business.phone}`} className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] hover:bg-[var(--accent-soft)] transition">
                  <Phone size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)]">{business.phone}</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] opacity-50">
                  <Phone size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">Not provided</span>
                </div>
              )}

              {business.website ? (
                <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] hover:bg-[var(--accent-soft)] transition">
                  <Globe size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] break-all">{business.website}</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)] opacity-50">
                  <Globe size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">Not provided</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          {business.pricing ? (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pricing</h3>
              <div className="space-y-3">
                <div className="rounded-[16px] bg-[var(--surface-large)] p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Minimum Order</p>
                  <p className="mt-2 text-[var(--text-primary)] font-medium">{business.pricing.minOrder} units</p>
                </div>
                <div className="rounded-[16px] bg-[var(--surface-large)] p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Price Range</p>
                  <p className="mt-2 text-[var(--text-primary)] font-medium">{business.pricing.priceRange}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-large)] p-6 opacity-50">
              <h3 className="text-lg font-semibold text-[var(--text-secondary)]">Pricing</h3>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Pricing information not provided</p>
            </div>
          )}

          {/* Tags */}
          {business.tags && business.tags.length > 0 && (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {business.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--surface-large)] text-[var(--text-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
