"use client";
import { EyeOff, Upload, Download, FileText, ScanText, Lock } from "lucide-react";
import RemoveOcr from "@/components/tools/RemoveOcr";

const STEPS = [
  { icon: Upload, title: "Upload Your PDF", desc: "Drop any selectable PDF. Everything runs locally in your browser — your file never leaves your device." },
  { icon: EyeOff, title: "Flatten Pages", desc: "Each page is rendered at 3× resolution to a JPEG image. The text layer is permanently removed — no selection, no copy, no search." },
  { icon: Download, title: "Download Result", desc: "Get your image-only PDF instantly. Text is no longer selectable or searchable in any PDF viewer." },
];

const RELATED = [
  { id: "ocr-pdf",      title: "OCR PDF",       description: "Add a selectable text layer to scanned PDFs.",          icon: ScanText,  gradient: "linear-gradient(135deg, #3b82f6, #1e3a8a)", shadow: "rgba(59,130,246,0.3)",  tag: "OCR"      },
  { id: "redact-pdf",   title: "Redact PDF",    description: "Permanently black out sensitive text and images.",       icon: EyeOff,    gradient: "linear-gradient(135deg, #ef4444, #991b1b)", shadow: "rgba(239,68,68,0.3)",   tag: "Edit"     },
  { id: "protect",      title: "Protect PDF",   description: "Encrypt your PDF with a password.",                     icon: Lock,      gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)", shadow: "rgba(229,62,62,0.3)",   tag: "Security" },
  { id: "flatten-pdf",  title: "Flatten PDF",   description: "Merge all annotations and form fields into a flat PDF.", icon: FileText,  gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", shadow: "rgba(139,92,246,0.3)",  tag: "Edit"     },
];

export default function RemoveOcrPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <RemoveOcr id="remove-ocr" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-violet-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RELATED.map(t => (
            <a key={t.id} href={`/tool/${t.id}`} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={22} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
              </div>
              <div><h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 group-hover:text-violet-500 transition-colors">{t.title}</h3><p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-violet-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
