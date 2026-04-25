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
    <div className="min-h-[70vh] flex flex-col lg:flex-row gap-6 items-start">
      {/* Main panel — matches screenshot exactly */}
      <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
        {/* Header: orange icon + VISUAL ORGANIZER title */}
        <div className="flex items-center gap-3">
          <S className="w-11 h-11 rounded-xl" style={{ backgroundColor: 'rgb(254 215 170)' }} />
          <S className="w-52 h-6 rounded-lg" />
        </div>

        {/* Large drop zone */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-5 min-h-[320px] p-10">
          <S className="w-14 h-14 rounded-2xl" />
          <S className="w-40 h-5 rounded-xl" />
          <S className="w-64 h-4 rounded-lg" />
        </div>
      </div>

      {/* Sidebar — matches screenshot: title + reset, files(0) label, CTA button */}
      <div className="w-full lg:w-72 bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-6 sticky top-8">
        {/* Organize PDF + Reset All */}
        <div className="flex items-center justify-between">
          <S className="w-32 h-5 rounded-lg" />
          <S className="w-16 h-4 rounded-lg" style={{ backgroundColor: 'rgb(254 202 202)' }} />
        </div>

        {/* Files (0) label */}
        <div className="flex items-center gap-2">
          <S className="w-4 h-4 rounded-full" />
          <S className="w-20 h-3 rounded-md" />
        </div>

        {/* Organize PDF CTA button */}
        <S className="w-full h-12 rounded-2xl" style={{ backgroundColor: 'rgb(226 232 240)' }} />
      </div>
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
      {/* Left workspace */}
      <div className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Header: REPAIR PDF FILES + Add Files button */}
        <div className="flex items-center justify-between">
          <S className="w-44 h-5 rounded-lg" />
          <S className="w-24 h-9 rounded-full" style={{ backgroundColor: 'rgb(254 202 202)' }} />
        </div>

        {/* Dashed drop zone */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[220px] p-10">
          <S className="w-12 h-12 rounded-2xl" />
          <S className="w-44 h-4 rounded-lg" />
          <S className="w-36 h-3 rounded-lg" />
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-full lg:w-[340px] bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Info box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 space-y-2">
            <div className="flex gap-2">
              <S className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: 'rgb(191 219 254)' }} />
              <div className="flex-1 space-y-2">
                <S className="w-full h-3 rounded-md" />
                <S className="w-4/5 h-3 rounded-md" />
                <S className="w-3/5 h-3 rounded-md" />
              </div>
            </div>
          </div>

          {/* Empty state: icon + text */}
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <S className="w-10 h-10 rounded-full" />
            <S className="w-48 h-3 rounded-md" />
            <S className="w-36 h-3 rounded-md" />
          </div>
        </div>

        {/* Bottom: Repair PDF button + powered by text */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <S className="w-full h-12 rounded-2xl" style={{ backgroundColor: 'rgb(226 232 240)' }} />
          <S className="w-40 h-2 rounded-md mx-auto" />
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
