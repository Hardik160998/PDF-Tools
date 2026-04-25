"use client";

import { useState } from 'react';
import {
  OrganizeSkeletonA,
  MergeSplitSkeletonA, MergeSplitSkeletonB,
  RepairSkeleton, CenteredCardSkeleton,
} from '@/app/tool/[id]/skeletons';

const TABS = [
  { label: 'Organize',      key: 'organize', ab: false },
  { label: 'Merge / Split', key: 'merge',    ab: true  },
  { label: 'Repair',        key: 'repair',   ab: false },
  { label: 'Compress',      key: 'compress', ab: false },
  { label: 'Edit',          key: 'edit',     ab: false },
  { label: 'Extract Text',  key: 'extract',  ab: false },
  { label: 'Image Convert', key: 'image',    ab: false },
  { label: 'Office',        key: 'office',   ab: false },
  { label: 'Security',      key: 'security', ab: false },
  { label: 'Aadhar',        key: 'aadhar',   ab: false },
];

function getSkeletons(id: string) {
  switch (id) {
    case 'organize': return { A: <OrganizeSkeletonA />, B: null };
    case 'merge':    return { A: <MergeSplitSkeletonA />,                      B: <MergeSplitSkeletonB /> };
    case 'repair':   return { A: <RepairSkeleton />,                           B: null };
    case 'compress': return { A: <CenteredCardSkeleton accent="rgb(187 247 208)" />, B: null };
    case 'edit':     return { A: <CenteredCardSkeleton accent="rgb(221 214 254)" />, B: null };
    case 'extract':  return { A: <CenteredCardSkeleton accent="rgb(191 219 254)" />, B: null };
    case 'image':    return { A: <CenteredCardSkeleton accent="rgb(254 240 138)" />, B: null };
    case 'office':   return { A: <CenteredCardSkeleton accent="rgb(191 219 254)" />, B: null };
    case 'security': return { A: <CenteredCardSkeleton accent="rgb(254 202 202)" />, B: null };
    case 'aadhar':   return { A: <CenteredCardSkeleton accent="rgb(254 202 202)" />, B: null };
    default:         return { A: null, B: null };
  }
}

export default function SkeletonPreviewPage() {
  const [active, setActive] = useState('organize');
  const [removed, setRemoved] = useState<Record<string, 'A' | 'B'>>({});

  const activeTab = TABS.find(t => t.key === active)!;
  const skeletons = getSkeletons(active);
  const removedVariant = removed[active];
  const showBoth = activeTab.ab && !removedVariant;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sticky header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse inline-block" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skeleton Preview</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  active === tab.key
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {tab.label}
                {removed[tab.key] && <span className="ml-1 text-green-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {showBoth ? (
          /* Side-by-side A/B */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {(['A', 'B'] as const).map(v => (
              <div key={v} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${v === 'A' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Variant {v}</span>
                  </div>
                  <button
                    onClick={() => setRemoved(r => ({ ...r, [active]: v }))}
                    className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-all border border-red-200 dark:border-red-800"
                  >
                    Remove {v}
                  </button>
                </div>
                <div className={`rounded-2xl overflow-hidden border-2 ${v === 'A' ? 'border-blue-200 dark:border-blue-800' : 'border-purple-200 dark:border-purple-800'}`}>
                  {skeletons[v]}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab.ab && removedVariant ? (
          /* Winner full width */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">
                  Variant {removedVariant === 'A' ? 'B' : 'A'} kept — Variant {removedVariant} removed
                </span>
              </div>
              <button
                onClick={() => setRemoved(r => { const n = { ...r }; delete n[active]; return n; })}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 transition-all"
              >
                Reset
              </button>
            </div>
            {removedVariant === 'A' ? skeletons.B : skeletons.A}
          </div>
        ) : (
          /* Single skeleton */
          skeletons.A
        )}
      </div>
    </div>
  );
}
