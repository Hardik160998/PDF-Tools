"use client";

import { useState, useEffect, ReactNode } from 'react';

function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

export function HowItWorksShimmer({ accent }: { accent: string }) {
  return (
    <section className="py-16 bg-white/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <Sh className="h-7 w-40 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl skeleton-shimmer" style={{ background: accent }} />
              <Sh className="h-3 w-16" />
              <Sh className="h-5 w-3/4" />
              <Sh className="h-3 w-full" />
              <Sh className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedToolsShimmer() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Sh className="h-7 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Sh className="w-14 h-14 rounded-2xl" />
                <Sh className="h-5 w-16 rounded-full" />
              </div>
              <Sh className="h-5 w-3/4" />
              <Sh className="h-3 w-full" />
              <Sh className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function usePageMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}
