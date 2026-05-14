"use client";
import { EyeOff, Upload, Shield, Download, Combine, Lock, Unlock, Layers, GitCompare } from "lucide-react";
import RedactPdf from "@/components/tools/RedactPdf";

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
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <RedactPdf id="redact-pdf" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELATED.map(tool => (
            <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{tool.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">{tool.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
