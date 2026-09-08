export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-large)] p-10 text-[var(--text-primary)] shadow-2xl shadow-black/10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-full bg-[#2F3A50]" />
          <div className="h-4 w-full rounded-full bg-[#2F3A50]" />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="h-40 rounded-[24px] bg-[var(--surface-card)]" />
            <div className="h-40 rounded-[24px] bg-[var(--surface-card)]" />
            <div className="h-40 rounded-[24px] bg-[var(--surface-card)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
