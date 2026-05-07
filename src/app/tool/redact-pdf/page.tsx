"use client";

import dynamic from "next/dynamic";
import { EyeOff, Upload, Shield, Download, CheckCircle, Combine, Lock, Unlock, Layers, GitCompare } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const RedactPdf = dynamic(() => import("@/components/tools/RedactPdf"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(254 202 202)" />,
});

const FEATURES = [
  "Draw boxes to redact areas",
  "Search & redact text by keyword",
  "Multi-page redaction",
  "Permanent black-box redaction",
  "100% private — runs in browser",
  "No uploads, no accounts",
];

const STEPS = [
  { icon: Upload,  title: "Upload Your PDF",     desc: "Select any PDF. It loads instantly in your browser — nothing is sent to any server." },
  { icon: EyeOff,  title: "Mark Sensitive Areas", desc: "Draw black boxes over any area, or type a keyword to auto-redact all matching text across all pages." },
  { icon: Download,title: "Download Redacted PDF", desc: "Click Apply and download your PDF with all sensitive content permanently hidden." },
];

const RELATED = [
  { id: "protect",      title: "Protect PDF",    description: "Encrypt your PDF with a password to prevent unauthorized access.",          icon: Lock,       gradient: "linear-gradient(135deg,#ef4444,#b91c1c)", shadow: "rgba(239,68,68,0.3)",   tag: "Security" },
  { id: "unlock",       title: "Unlock PDF",     description: "Remove PDF password security and restore full access to your document.",    icon: Unlock,     gradient: "linear-gradient(135deg,#e53e3e,#7f1d1d)", shadow: "rgba(229,62,62,0.3)",   tag: "Security" },
  { id: "compare-pdf",  title: "Compare PDF",    description: "Compare two PDFs side by side and spot every text and visual difference.",  icon: GitCompare, gradient: "linear-gradient(135deg,#6366f1,#4f46e5)", shadow: "rgba(99,102,241,0.3)",  tag: "Analyze"  },
  { id: "extract-pages",title: "Extract Pages",  description: "Pick individual pages or a range and download them as a new PDF.",          icon: Layers,     gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)",  tag: "Organize" },
  { id: "watermark",    title: "Watermark PDF",  description: "Stamp a text or image watermark over every page of your PDF.",             icon: Shield,     gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)", shadow: "rgba(139,92,246,0.3)",  tag: "Edit"     },
  { id: "merge",        title: "Merge PDF",      description: "Combine multiple PDF files into one document in the order you choose.",     icon: Combine,    gradient: "linear-gradient(135deg,#f26522,#c2410c)", shadow: "rgba(242,101,34,0.3)",  tag: "Organize" },
];

export default function RedactPdfPage() {
  const mounted = usePageMounted();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#fff1f233 0%,#fff0 50%,#fef2f233 100%)" }}>
      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <RedactPdf />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(220,38,38,0.12)" /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-800/40">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 mb-4"><step.icon size={28} /></div>
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
