"use client";

import { useState } from 'react';
import {
  OrganizeSkeletonA, OrganizeSkeletonB,
  MergeSplitSkeletonA, MergeSplitSkeletonB,
  RepairSkeleton, CenteredCardSkeleton,
} from '@/app/tool/[id]/skeletons';

const TABS = [
  { label: 'Organize', key: 'organize' },
  { label: 'Merge / Split', key: 'merge' },
  { label: 'Repair', key: 'repair' },
  { label: 'Compress', key: 'compress' },
  { label: 'Edit / Watermark', key: 'edit' },
  { label: 'Extract Text', key: 'extract' },
  { label: 'Image Convert', key: 'image' },
  { label: 'Office Convert', key: 'office' },
  { label: 'Security', key: 'security' },
  { label: 'Aadhar', key: 'aadhar' },
];

function SkeletonForKey({ id }: { id: string }) {
  switch (id) {
    case 'organize': return <OrganizeSkeleton />;
    case 'merge':    return <MergeSplitSkeleton />;
    case 'repair':   return <RepairSkeleton />;
    case 'compress': return <CenteredCardSkeleton accent="rgb(187 247 208)" />;
    case 'edit':     return <CenteredCardSkeleton accent="rgb(221 214 254)" />;
    case 'extract':  return <CenteredCardSkeleton accent="rgb(191 219 254)" />;
    case 'image':    return <CenteredCardSkeleton accent="rgb(254 240 138)" />;
    case 'office':   return <CenteredCardSkeleton accent="rgb(191 219 254)" />;
    case 'security': return <CenteredCardSkeleton accent="rgb(254 202 202)" />;
    case 'aadhar':   return <CenteredCardSkeleton accent="rgb(254 202 202)" />;
    default:         return null;
  }
}

export default function SkeletonPreviewPage() {
  const [active, setActive] = useState('organize');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Skeleton Preview</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  active === tab.key
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton render */}
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <SkeletonForKey id={active} />
      </div>
    </div>
  );
}
