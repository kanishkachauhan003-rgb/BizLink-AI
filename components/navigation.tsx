"use client";

import Link from "next/link";
import { Globe2, MoonStar, Sparkles, SunMedium, UserRound, X } from "lucide-react";
import { startTransition, useMemo, useState, useEffect } from "react";
import { businesses } from "@/lib/seed-data";
import { useLanguage } from "@/components/providers";
import { ProfileReadiness } from "@/components/profile-readiness";

const PROFILE_STORAGE_KEY = "bizlink-selected-business-id";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "pa", label: "Punjabi" },
] as const;

export function Navigation() {
  const { language, setLanguage, theme, setTheme, t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const savedBusinessId = typeof window !== "undefined" ? localStorage.getItem(PROFILE_STORAGE_KEY) : null;
    const initialBusinessId = businesses.some((business) => business.id === savedBusinessId)
      ? savedBusinessId
      : businesses[0]?.id ?? null;

    startTransition(() => {
      setIsMounted(true);
      setSelectedBusinessId(initialBusinessId);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedBusinessId) {
      localStorage.setItem(PROFILE_STORAGE_KEY, selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [selectedBusinessId],
  );

  const openBusinessProfile = (businessId?: string | null) => {
    const nextBusinessId = businessId ?? businesses[0]?.id ?? null;
    if (!nextBusinessId) return;
    setSelectedBusinessId(nextBusinessId);
    setIsProfileOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface-large)]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-3.5 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4 xl:justify-start">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">BizLink AI</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Packaging intelligence</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)] p-1 shadow-sm">
              <Link href="/" className="relative rounded-full px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition hover:text-[var(--accent)]">
                <span className="relative">{t("navHome")}</span>
              </Link>
              <Link href="/search" className="rounded-full px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">{t("navSearch")}</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 self-end xl:self-auto">
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1.5 text-sm text-[var(--text-secondary)] shadow-sm">
              <Globe2 size={15} />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
                className="bg-transparent pr-2 text-sm text-[var(--text-primary)] outline-none"
                aria-label={t("navLanguage")}
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code} className="bg-[var(--surface-card)] text-[var(--text-primary)]">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label={t("navTheme")}
            >
              {isMounted && (theme === "light" ? <MoonStar size={16} /> : <SunMedium size={16} />)}
            </button>

            <button
              type="button"
              onClick={() => openBusinessProfile(selectedBusinessId)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent)] text-white shadow-sm transition hover:bg-[var(--accent-strong)]"
              aria-label={t("navProfile")}
            >
              <UserRound size={16} />
            </button>
          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/25 px-3 py-4 backdrop-blur-sm">
          <div className="h-full w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] shadow-[var(--shadow-soft)]" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)]">{t("profileTitle")}</p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">{selectedBusiness?.name ?? "BizLink Studio"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-primary)]"
                aria-label="Close profile"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {selectedBusiness ? <ProfileReadiness business={selectedBusiness} /> : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-4 text-sm text-[var(--text-secondary)]">
                  No business profile available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
