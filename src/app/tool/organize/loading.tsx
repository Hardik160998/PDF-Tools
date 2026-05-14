import { LayoutGrid, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-[320px] h-[400px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl animate-pulse" />
        
        {/* Workspace Skeleton */}
        <div className="flex-1 w-full h-[600px] bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center">
          <div className="relative">
            <Loader2 size={64} className="animate-spin text-orange-500/20" />
            <LayoutGrid className="absolute inset-0 m-auto text-orange-500/10" size={32} />
          </div>
          <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Initializing Organizer...</p>
        </div>
      </div>
    </div>
  );
}
