"use client";

import dynamic from "next/dynamic";

const OrganizeToolLoader = () => (
  <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left animate-pulse">
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-[320px] bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 h-[380px] shrink-0 p-6 space-y-6">
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="space-y-3">
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Workspace Skeleton */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-200/50 dark:border-slate-800/50 min-h-[600px] flex flex-col w-full items-center justify-center relative overflow-hidden">
        <div className="relative text-center space-y-4 mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-orange-500 animate-spin" />
          </div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 sm:p-20 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-4" />
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
          <div className="h-4 w-52 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const OrganizeTool = dynamic(() => import("./OrganizeTool"), {
  ssr: false,
  loading: () => <OrganizeToolLoader />,
});

export default function OrganizeToolWrapper({ id }: { id: string }) {
  return <OrganizeTool id={id} />;
}
