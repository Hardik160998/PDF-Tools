function S({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer ${className}`} style={style} />;
}

/* ─── shared card layout ─── */
function ToolCardSkeleton({ accent = 'rgb(254 215 170)', fileCards = 1 }: { accent?: string; fileCards?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-xl p-4 sm:p-8 space-y-4 sm:space-y-8 w-full">
      {/* Icon + title + subtitle */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <S className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl" style={{ backgroundColor: accent }} />
        <S className="w-36 sm:w-44 h-5 sm:h-6 rounded-xl" />
        <S className="w-48 sm:w-64 h-3 sm:h-4 rounded-lg" style={{ maxWidth: '80%' }} />
      </div>

      {/* Drop zone */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-3 sm:gap-4">
        <S className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl" />
        <S className="w-28 sm:w-40 h-4 rounded-xl" />
        <S className="w-20 sm:w-28 h-3 rounded-lg" />
      </div>

      {/* File rows — always single column */}
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: fileCards }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/60 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <S className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <S className="w-24 sm:w-32 h-3 rounded-md" />
                <S className="w-16 sm:w-20 h-2 rounded-md" />
              </div>
            </div>
            <S className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 ml-2" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <S className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl" style={{ backgroundColor: accent }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ORGANIZE
══════════════════════════════════════════════════════ */
export function OrganizeSkeletonA() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start w-full">
      {/* Main panel */}
      <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <S className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl shrink-0" style={{ backgroundColor: 'rgb(254 215 170)' }} />
          <S className="w-36 sm:w-52 h-5 rounded-lg" />
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[180px] sm:min-h-[260px] p-6 sm:p-10">
          <S className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl" />
          <S className="w-28 sm:w-40 h-4 rounded-xl" />
          <S className="w-36 sm:w-56 h-3 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="aspect-[3/4] rounded-lg sm:rounded-xl"
              style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-white dark:bg-slate-800 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <S className="w-28 sm:w-32 h-4 rounded-lg" />
          <S className="w-14 sm:w-16 h-3 rounded-lg" style={{ backgroundColor: 'rgb(254 202 202)' }} />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-3 h-3 rounded-full shrink-0" />
          <S className="w-16 sm:w-20 h-3 rounded-md" />
        </div>
        <S className="w-full h-10 sm:h-12 rounded-xl sm:rounded-2xl" style={{ backgroundColor: 'rgb(226 232 240)' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MERGE / SPLIT
══════════════════════════════════════════════════════ */
export function MergeSplitSkeletonA() {
  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-4">
      <ToolCardSkeleton accent="rgb(254 215 170)" fileCards={2} />
    </div>
  );
}

export function MergeSplitSkeletonB() {
  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-4">
      <ToolCardSkeleton accent="rgb(254 215 170)" fileCards={2} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REPAIR
══════════════════════════════════════════════════════ */
export function RepairSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <S className="w-36 sm:w-44 h-4 sm:h-5 rounded-lg" />
          <S className="w-20 sm:w-24 h-8 sm:h-9 rounded-full" style={{ backgroundColor: 'rgb(254 202 202)' }} />
        </div>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[180px] sm:min-h-[220px] p-6 sm:p-10">
          <S className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl" />
          <S className="w-36 sm:w-44 h-4 rounded-lg" />
          <S className="w-28 sm:w-36 h-3 rounded-lg" />
        </div>
      </div>
      <div className="w-full lg:w-[340px] bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 space-y-2">
            <div className="flex gap-2">
              <S className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: 'rgb(191 219 254)' }} />
              <div className="flex-1 space-y-2">
                <S className="w-full h-3 rounded-md" />
                <S className="w-4/5 h-3 rounded-md" />
                <S className="w-3/5 h-3 rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 py-6 sm:py-10">
            <S className="w-10 h-10 rounded-full" />
            <S className="w-40 sm:w-48 h-3 rounded-md" />
            <S className="w-28 sm:w-36 h-3 rounded-md" />
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <S className="w-full h-11 sm:h-12 rounded-2xl" style={{ backgroundColor: 'rgb(226 232 240)' }} />
          <S className="w-32 sm:w-40 h-2 rounded-md mx-auto" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CENTERED CARD  (all other tools)
══════════════════════════════════════════════════════ */
export function CenteredCardSkeleton({ accent = '#e2e8f0' }: { accent?: string }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-12 px-3 sm:px-4">
      <ToolCardSkeleton accent={accent} fileCards={1} />
    </div>
  );
}
