"use client";

import dynamic from "next/dynamic";
import { Pen } from "lucide-react";

function EditSkeleton() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(160deg,#f0f7ff 0%,#faf5ff 50%,#fff7f0 100%)" }}>
      {/* Real hero text */}
      <section className="mx-auto px-4 py-24 text-center relative z-10 max-w-7xl">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border" style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", borderColor: "rgba(59,130,246,0.2)" }}>
            <Pen size={12} /> Work Directly on Your Files
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-5">
            Open, Annotate &amp; Edit<br />
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Your PDF Instantly
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
            Highlight, draw, and add text directly on any PDF — processed entirely in your browser. No uploads, no accounts.
          </p>
        </div>
      </section>

      {/* Shimmer drop zone */}
      <section className="mx-auto px-4 pb-16 max-w-7xl relative z-10">
        <div className="skeleton-shimmer rounded-3xl" style={{ height: "220px" }} />
      </section>

      {/* Shimmer feature cards */}
      <section className="mx-auto px-4 pb-20 max-w-7xl relative z-10">
        <div className="skeleton-shimmer h-4 w-32 rounded-xl mx-auto mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl p-5 bg-white shadow-sm border border-slate-100">
              <div className="skeleton-shimmer w-11 h-11 rounded-xl mx-auto mb-3" />
              <div className="skeleton-shimmer h-4 w-16 rounded-lg mx-auto mb-2" />
              <div className="skeleton-shimmer h-3 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const PdfEditor = dynamic(() => import("./PdfEditor"), {
  ssr: false,
  loading: () => <EditSkeleton />,
});

export default function PdfEditorClient() {
  return <PdfEditor />;
}
