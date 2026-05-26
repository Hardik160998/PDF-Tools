"use client";

import dynamic from "next/dynamic";

const ComparePdfLoader = () => (
  <div className="max-w-6xl mx-auto py-4 sm:py-10 px-3 sm:px-4 animate-pulse">
    <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-750 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
        </div>
        <div className="h-8 w-56 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-700 rounded-full" />
      </div>

      {/* Upload Zones Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center gap-3 min-h-[180px]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700" />
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-4 w-36 bg-slate-100 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700" />
        </div>
        <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center gap-3 min-h-[180px]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700" />
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-4 w-36 bg-slate-100 dark:bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
    </div>
  </div>
);

const ComparePdf = dynamic(() => import("./ComparePdf"), {
  ssr: false,
  loading: () => <ComparePdfLoader />,
});

export default function ComparePdfWrapper({ id }: { id: string }) {
  return <ComparePdf id={id} />;
}
