"use client";

import dynamic from "next/dynamic";
import { Bookmark, Upload, Download, CheckCircle, Layers, GitCompare, EyeOff, Lock, Combine, Settings } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const BookmarkPdf = dynamic(() => import("@/components/tools/BookmarkPdf"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(253 230 138)" />,
});

const FEATURES = [
  "Add unlimited bookmarks",
  "Set title & destination page",
  "Reorder bookmarks freely",
  "Edit or delete any bookmark",
  "Opens bookmark panel in PDF viewers",
  "100% private — runs in browser",
];

const STEPS = [
  { icon: Upload,   title: "Upload Your PDF",      desc: "Select any PDF file. It loads instantly in your browser with page thumbnails for easy navigation." },
  { icon: Bookmark, title: "Add Your Bookmarks",   desc: "Type a title, pick a destination page from thumbnails or by number, and add as many bookmarks as you need." },
  { icon: Download, title: "Download Bookmarked PDF", desc: "Click Apply and download your PDF — bookmarks will appear in the outline panel of any PDF viewer." },
];

const RELATED = [
  { id: "organize",     title: "Organize PDF",   description: "Reorder, rotate, and delete PDF pages with a live visual preview.",          icon: Layers,     gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)",  tag: "Organize" },
  { id: "metadata",     title: "Edit Metadata",  description: "Add or change PDF metadata like title, author, and subject.",                icon: Settings,   gradient: "linear-gradient(135deg,#E8465D,#843286)",  shadow: "rgba(232,70,93,0.3)",   tag: "Edit"     },
  { id: "compare-pdf",  title: "Compare PDF",    description: "Compare two PDFs side by side and spot every text and visual difference.",   icon: GitCompare, gradient: "linear-gradient(135deg,#6366f1,#4f46e5)", shadow: "rgba(99,102,241,0.3)",  tag: "Analyze"  },
  { id: "redact-pdf",   title: "Redact PDF",     description: "Permanently hide sensitive text and areas with black boxes.",                icon: EyeOff,     gradient: "linear-gradient(135deg,#dc2626,#7f1d1d)", shadow: "rgba(220,38,38,0.3)",   tag: "Security" },
  { id: "protect",      title: "Protect PDF",    description: "Encrypt your PDF with a password to prevent unauthorized access.",          icon: Lock,       gradient: "linear-gradient(135deg,#ef4444,#b91c1c)", shadow: "rgba(239,68,68,0.3)",   tag: "Security" },
  { id: "merge",        title: "Merge PDF",      description: "Combine multiple PDF files into one document in the order you choose.",     icon: Combine,    gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)",  tag: "Organize" },
];

export default function BookmarkPdfPage() {
  const mounted = usePageMounted();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#fffbeb33 0%,#fff0 50%,#fef3c733 100%)" }}>
      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <BookmarkPdf id="bookmark-pdf" />
        </div>
      </section>

      {/* AD BANNER */}
      <section className="py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-amber-100 dark:border-amber-500/20 shadow-lg" style={{ background: "linear-gradient(135deg,#fffbeb 0%,#fef3c7 50%,#fde68a33 100%)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%,rgba(245,158,11,0.12) 0%,transparent 70%)" }} />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">Unlock SmartPDFs Plus — Go Premium</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Batch bookmarking · Nested outlines · Priority processing · No ads</p>
                </div>
              </div>
              <a href="#" className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
                Upgrade Now &#8594;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(245,158,11,0.15)" /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-800/40">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 mb-4"><step.icon size={28} /></div>
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-amber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
