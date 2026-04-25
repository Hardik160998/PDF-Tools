function S({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer ${className}`} style={style} />;
}

/* ─── shared card layout (icon → title → drop-zone → file-row → CTA) ─── */
function ToolCardSkeleton({ accent = 'rgb(254 215 170)', fileCards = 1 }: { accent?: string; fileCards?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-8 sm:p-12 space-y-8">
      <div className="flex flex-col items-center gap-3">
        <S className="w-16 h-16 rounded-2xl" style={{ backgroundColor: accent }} />
        <S className="w-44 h-7 rounded-xl" />
        <S className="w-64 h-4 rounded-lg" />
      </div>
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center gap-4">
        <S className="w-14 h-14 rounded-xl" />
        <S className="w-40 h-5 rounded-xl" />
        <S className="w-28 h-4 rounded-lg" />
      </div>
      <div className={`grid gap-4 ${fileCards === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {Array.from({ length: fileCards }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <S className="w-9 h-9 rounded-xl" />
              <div className="space-y-2">
                <S className="w-32 h-3 rounded-md" />
                <S className="w-20 h-2 rounded-md" />
              </div>
            </div>
            <S className="w-7 h-7 rounded-lg" />
          </div>
        ))}
      </div>
      <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: accent }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ORGANIZE — A: panel + drop-zone + thumb grid + sidebar
══════════════════════════════════════════════════════ */
export function OrganizeSkeletonA() {
  return (
    <div className="min-h-[70vh] flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 min-h-[600px] flex flex-col gap-8">
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
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-5 p-10 min-h-[200px]">
          <S className="w-16 h-16 rounded-2xl" />
          <S className="w-48 h-6 rounded-xl" />
          <S className="w-64 h-4 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <S key={i} className="aspect-[3/4] rounded-xl"
              style={{ animationDelay: `${i * 0.07}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>
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
          <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 215 170)' }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ORGANIZE — B: centered card style
══════════════════════════════════════════════════════ */
export function OrganizeSkeletonB() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <ToolCardSkeleton accent="rgb(254 215 170)" fileCards={1} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MERGE / SPLIT — A: centered card + 2 file cards
══════════════════════════════════════════════════════ */
export function MergeSplitSkeletonA() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4">
      <ToolCardSkeleton accent="rgb(254 215 170)" fileCards={2} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MERGE / SPLIT — B: two-column file list + config panel
══════════════════════════════════════════════════════ */
export function MergeSplitSkeletonB() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col items-center gap-3">
          <S className="w-16 h-16 rounded-2xl" style={{ backgroundColor: 'rgb(254 215 170)' }} />
          <S className="w-44 h-7 rounded-xl" />
          <S className="w-64 h-4 rounded-lg" />
        </div>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center gap-4">
          <S className="w-14 h-14 rounded-xl" />
          <S className="w-40 h-5 rounded-xl" />
          <S className="w-28 h-4 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <S className="w-9 h-9 rounded-xl" />
                  <div className="space-y-2">
                    <S className="w-28 h-3 rounded-md" />
                    <S className="w-16 h-2 rounded-md" />
                  </div>
                </div>
                <S className="w-7 h-7 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 space-y-4 border border-slate-100 dark:border-slate-700">
            <S className="w-32 h-4 rounded-lg" />
            <div className="flex gap-2">
              <S className="flex-1 h-10 rounded-xl" />
              <S className="flex-1 h-10 rounded-xl opacity-50" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => <S key={i} className="flex-1 h-12 rounded-xl" />)}
            </div>
          </div>
        </div>
        <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 215 170)' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REPAIR
══════════════════════════════════════════════════════ */
export function RepairSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="aspect-[3/4] rounded-2xl"
              style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>
      <div className="w-full lg:w-[400px] bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          <S className="w-40 h-9 rounded-xl" />
          <div className="p-5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 space-y-2">
            <S className="w-full h-4 rounded-lg" />
            <S className="w-4/5 h-3 rounded-lg" />
            <S className="w-3/5 h-3 rounded-lg" />
          </div>
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
          <S className="w-full h-14 rounded-2xl" style={{ backgroundColor: 'rgb(254 202 202)' }} />
          <S className="w-48 h-3 rounded-md mx-auto" />
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
    <div className="max-w-3xl mx-auto py-12 px-4">
      <ToolCardSkeleton accent={accent} fileCards={1} />
    </div>
  );
}
