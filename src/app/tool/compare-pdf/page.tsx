"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GitCompare, Upload, Search, Download, CheckCircle, Combine, Scissors, Zap, FileSymlink, Lock } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const ComparePdf = dynamic(() => import("@/components/tools/ComparePdf"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(199 210 254)" />,
});

const FEATURES = [
  "Side-by-side page viewer",
  "Highlights different pages",
  "Shows % difference per page",
  "Works with any PDF size",
  "100% private — runs in browser",
  "No uploads, no accounts",
];

const STEPS = [
  { icon: Upload,     title: "Upload Two PDFs",    desc: "Select or drag & drop the two PDF files you want to compare. Both load instantly in your browser." },
  { icon: Search,     title: "Auto-Compare Pages", desc: "Every page is rendered and compared pixel-by-pixel. Identical pages are marked green, different ones red." },
  { icon: GitCompare, title: "Review Differences",  desc: "Browse pages side by side. See exactly which pages changed and by how much." },
];

const RELATED = [
  { id: "organize",     title: "Organize PDF",    description: "Reorder, rotate, and delete PDF pages with a live visual preview.",         icon: FileSymlink, gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)", tag: "Organize" },
  { id: "merge",        title: "Merge PDF",        description: "Combine multiple PDF files into one document in the order you choose.",     icon: Combine,    gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)", tag: "Organize" },
  { id: "split",        title: "Split PDF",        description: "Divide a PDF into separate parts or extract every page individually.",      icon: Scissors,   gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)", tag: "Organize" },
  { id: "compress",     title: "Compress PDF",     description: "Reduce PDF file size while keeping quality sharp and text crisp.",          icon: Zap,        gradient: "linear-gradient(135deg,#22c55e,#15803d)", shadow: "rgba(34,197,94,0.3)",  tag: "Optimize" },
  { id: "extract-pages",title: "Extract Pages",    description: "Pick individual pages or a range and download them as a new PDF.",          icon: FileSymlink, gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)", tag: "Organize" },
  { id: "protect",      title: "Protect PDF",      description: "Encrypt your PDF with a password to keep it secure.",                      icon: Lock,       gradient: "linear-gradient(135deg,#ef4444,#b91c1c)", shadow: "rgba(239,68,68,0.3)",  tag: "Security" },
];

function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

export default function ComparePdfPage() {
  const mounted = usePageMounted();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#eef2ff33 0%,#fff0 50%,#ede9fe33 100%)" }}>

      {/* HERO */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <GitCompare size={13} /> Free PDF Comparison Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Compare PDF Files{" "}
            <span style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Side by Side
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Upload two PDF files and instantly see which pages are identical and which have changed — with a pixel-perfect side-by-side comparison. 100% private, runs in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                <CheckCircle size={12} className="text-indigo-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <ComparePdf />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(99,102,241,0.15)" /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-800/40">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 mb-4"><step.icon size={28} /></div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">More PDF Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED.map(tool => (
                <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}>
                      <tool.icon size={26} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-600">{tool.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-indigo-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
