"use client";
import dynamic from "next/dynamic";
import { EyeOff, Upload, Download, FileText, ScanText, Lock, CheckCircle } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const RemoveOcr = dynamic(() => import("@/components/tools/RemoveOcr"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(221 214 254)" />,
});

const FEATURES = [
  "Accepts selectable PDFs only",
  "Rasterizes every page to image",
  "Removes all text layers permanently",
  "Per-page progress grid",
  "100% in-browser — no uploads",
  "Download as image-only PDF",
];

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
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f3ff33 0%, #fff0 50%, #ede9fe33 100%)" }}>
      {/* Tool */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <RemoveOcr />
        </div>
      </section>

      {/* How it works */}
      {!mounted ? <HowItWorksShimmer accent="rgba(139,92,246,0.15)" /> : (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-violet-50 text-violet-500 mb-4"><s.icon size={28} /></div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related tools */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More PDF Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {RELATED.map(t => (
                <a key={t.id} href={`/tool/${t.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                      <t.icon size={22} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-violet-500 transition-colors">{t.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-violet-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
