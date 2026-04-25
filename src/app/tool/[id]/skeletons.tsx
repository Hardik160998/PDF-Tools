function S({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

/* ─── 1. ORGANIZE ─────────────────────────────────────────────── */
export function OrganizeSkeleton() {
  return (
    <div className="min-h-[70vh] flex flex-col lg:flex-row gap-8 items-start">
      {/* Main panel */}
      <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 min-h-[600px] flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <S className="w-11 h-11 rounded-2xl" />
            <S className="w-44 h-7 rounded-xl" />
          </div>
          <div className="hidden sm:flex gap-3">
            <S className="w-24 h-8 rounded-lg" />
            <S className="w-24 h-8 rounded-lg" />
          </div>
        </div>

        {/* Drop zone */}
        <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-5 p-10 min-h-[260px]">
          <S className="w-20 h-20 rounded-2xl" />
          <S className="w-52 h-6 rounded-xl" />
          <S className="w-72 h-4 rounded-lg" />
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <S key={i} className="aspect-[3/4] rounded-xl" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-7 sticky top-8">
        <div className="flex items-center justify-between">
          <S className="w-36 h-6 rounded-xl" />
          <S className="w-16 h-4 rounded-lg" />
        </div>
        <div className="space-y-3">
          <S className="w-20 h-3 rounded-md" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <S className="w-7 h-7 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <S className="w-full h-3 rounded-md" />
                <S className="w-2/3 h-2 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
          <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 215 170)' } as React.CSSProperties} />
        </div>
      </div>
    </div>
  );
}

/* ─── 2. MERGE / SPLIT ────────────────────────────────────────── */
export function MergeSplitSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-4">
          <S className="w-20 h-20 rounded-3xl" style={{ backgroundColor: 'rgb(254 215 170)' } as React.CSSProperties} />
          <S className="w-48 h-8 rounded-xl" />
          <S className="w-72 h-4 rounded-lg" />
        </div>

        {/* Drop zone */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-14 sm:p-16 flex flex-col items-center gap-5">
          <S className="w-20 h-20 rounded-2xl" />
          <S className="w-44 h-6 rounded-xl" />
          <S className="w-36 h-4 rounded-lg" />
        </div>

        {/* File list placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-4">
                <S className="w-10 h-10 rounded-lg" />
                <S className="w-28 h-4 rounded-lg" />
              </div>
              <S className="w-7 h-7 rounded-lg" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 215 170)' } as React.CSSProperties} />
      </div>
    </div>
  );
}

/* ─── 3. REPAIR ───────────────────────────────────────────────── */
export function RepairSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      {/* Workspace */}
      <div className="flex-1 p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <S className="w-52 h-8 rounded-xl" />
          <S className="w-28 h-10 rounded-full" />
        </div>
        <div className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-16 sm:p-24 flex flex-col items-center gap-6">
          <S className="w-20 h-20 rounded-3xl" />
          <S className="w-56 h-6 rounded-xl" />
          <S className="w-44 h-4 rounded-lg" />
        </div>
        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="aspect-[3/4] rounded-2xl" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[400px] bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          <S className="w-40 h-9 rounded-xl" />
          {/* Info box */}
          <div className="p-5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 space-y-2">
            <S className="w-full h-4 rounded-lg" />
            <S className="w-4/5 h-3 rounded-lg" />
            <S className="w-3/5 h-3 rounded-lg" />
          </div>
          {/* File list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <S className="w-28 h-3 rounded-md" />
              <S className="w-8 h-5 rounded-full" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <S className="w-4 h-4 rounded-full" />
                  <S className="w-36 h-3 rounded-md" />
                </div>
                <S className="w-4 h-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 202 202)' } as React.CSSProperties} />
          <S className="w-48 h-3 rounded-md mx-auto" />
        </div>
      </div>
    </div>
  );
}

/* ─── 4. CENTERED CARD (Compress / Edit / Extract / Image / Office / Security / Aadhar) */
export function CenteredCardSkeleton({ accent = '#e2e8f0' }: { accent?: string }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        {/* Icon + title + subtitle */}
        <div className="flex flex-col items-center gap-4">
          <S className="w-20 h-20 rounded-3xl" style={{ backgroundColor: accent } as React.CSSProperties} />
          <S className="w-52 h-8 rounded-xl" />
          <S className="w-80 h-4 rounded-lg" />
        </div>

        {/* Drop zone */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 sm:p-20 flex flex-col items-center gap-5">
          <S className="w-20 h-20 rounded-2xl" />
          <S className="w-44 h-6 rounded-xl" />
          <S className="w-36 h-4 rounded-lg" />
        </div>

        {/* File row */}
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <S className="w-11 h-11 rounded-xl" />
            <div className="space-y-2">
              <S className="w-40 h-4 rounded-lg" />
              <S className="w-24 h-3 rounded-md" />
            </div>
          </div>
          <S className="w-8 h-8 rounded-lg" />
        </div>

        {/* CTA button */}
        <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: accent } as React.CSSProperties} />
      </div>
    </div>
  );
}
