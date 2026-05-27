"use client";

import dynamic from "next/dynamic";

const SecurityToolsLoader = () => (
  <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden animate-pulse">
    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
    <div className="relative text-center space-y-4 mb-8 flex flex-col items-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700">
        <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-red-500 animate-spin" />
      </div>
      <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="h-4 w-60 bg-slate-100 dark:bg-slate-800 rounded-full" />
    </div>
    <div className="w-full max-w-md border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col items-center">
      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-md mb-4" />
      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
      <div className="h-3.5 w-44 bg-slate-100 dark:bg-slate-800 rounded-full" />
    </div>
  </div>
);

const SecurityToolsClient = dynamic(() => import("./SecurityTools"), {
  ssr: false,
  loading: () => <SecurityToolsLoader />,
});

export default function SecurityToolsWrapper({ id }: { id: string }) {
  return <SecurityToolsClient id={id} />;
}
