"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Globe, Upload, Download, CheckCircle, FileText, Zap, Lock, ImageIcon, FileSpreadsheet, Presentation } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const WebpageToPdf = dynamic(() => import("@/components/tools/WebpageToPdf"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(186 230 253)" />,
});

const FEATURES = [
  "Any public webpage URL",
  "Full CSS & layout preserved",
  "Images & fonts included",
  "Fast cloud rendering",
  "No browser extension needed",
  "Encrypted HTTPS transfer",
];

const STEPS = [
  { icon: Globe,    title: "Enter a URL",       desc: "Paste any public webpage URL — news articles, blogs, documentation, or any website." },
  { icon: Upload,   title: "Render to PDF",     desc: "Our cloud engine renders the full page with CSS, images, and fonts — exactly as it looks in a browser." },
  { icon: Download, title: "Download PDF",      desc: "Your PDF is ready in seconds. Download it instantly — clean, formatted, and ready to share." },
];

const RELATED = [
  { id: "html-to-pdf",  title: "HTML to PDF",       description: "Convert a local HTML file to PDF with full styling preserved.",                  icon: Globe,          gradient: "linear-gradient(135deg,#6366f1,#4338ca)", shadow: "rgba(99,102,241,0.3)",  tag: "Convert"  },
  { id: "word-to-pdf",  title: "Word to PDF",        description: "Convert DOCX files to PDF with all formatting perfectly preserved.",             icon: FileText,       gradient: "linear-gradient(135deg,#3182ce,#1e3a8a)", shadow: "rgba(49,130,206,0.3)",  tag: "Convert"  },
  { id: "excel-to-pdf", title: "Excel to PDF",       description: "Convert XLSX spreadsheets to PDF with all tables and data intact.",              icon: FileSpreadsheet,gradient: "linear-gradient(135deg,#22c55e,#15803d)", shadow: "rgba(34,197,94,0.3)",   tag: "Convert"  },
  { id: "ppt-to-pdf",   title: "PowerPoint to PDF",  description: "Convert PPTX presentations to PDF keeping all slides and visuals.",              icon: Presentation,   gradient: "linear-gradient(135deg,#f97316,#c2410c)", shadow: "rgba(249,115,22,0.3)",  tag: "Convert"  },
  { id: "compress",     title: "Compress PDF",        description: "Reduce PDF file size while keeping quality sharp and text crisp.",               icon: Zap,            gradient: "linear-gradient(135deg,#22c55e,#15803d)", shadow: "rgba(34,197,94,0.3)",   tag: "Optimize" },
  { id: "protect",      title: "Protect PDF",         description: "Encrypt your converted PDF with a password to keep it secure.",                  icon: Lock,           gradient: "linear-gradient(135deg,#ef4444,#b91c1c)", shadow: "rgba(239,68,68,0.3)",   tag: "Security" },
];

export default function WebpageToPdfPage() {
  const mounted = usePageMounted();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f9ff33 0%,#fff0 50%,#e0f2fe33 100%)" }}>

      {/* HERO */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-600 border border-sky-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400">
            <Globe size={13} /> Free Webpage to PDF Converter
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Convert Any Webpage{" "}
            <span style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to PDF
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Paste any public URL and get a pixel-perfect PDF in seconds — full CSS, images, and layout preserved exactly as it appears in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                <CheckCircle size={12} className="text-sky-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <WebpageToPdf />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(14,165,233,0.15)" /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-800/40">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 mb-4"><step.icon size={28} /></div>
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
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">More Convert Tools</h2>
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-sky-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
