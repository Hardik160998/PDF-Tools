"use client";
import dynamic from "next/dynamic";
import { ScanText, Upload, Download, FileText, Type, EyeOff, CheckCircle } from "lucide-react";
import { CenteredCardSkeleton } from "../[id]/skeletons";
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from "../_shimmer";

const OcrPdf = dynamic(() => import("@/components/tools/OcrPdf"), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(191 219 254)" />,
});

const FEATURES = [
  "Works on scanned & image PDFs",
  "Adds invisible selectable text layer",
  "Copy, search & highlight after OCR",
  "Per-page OCR preview",
  "100% in-browser — no uploads",
  "Download as standard PDF",
];

const STEPS = [
  { icon: Upload, title: "Upload Your PDF", desc: "Drop any scanned or image-based PDF. Nothing leaves your device — all processing happens locally in your browser." },
  { icon: ScanText, title: "Run OCR", desc: "Each page is rendered to an image and passed through Tesseract OCR to detect and extract text with bounding boxes." },
  { icon: Download, title: "Download Result", desc: "Get your PDF with an invisible text layer added. Text is now selectable, copyable, and searchable in any PDF viewer." },
];

const RELATED = [
  { id: "extract-text", title: "Extract Text", description: "Pull all text out of a PDF as plain text.", icon: Type, gradient: "linear-gradient(135deg, #3b82f6, #1e3a8a)", shadow: "rgba(59,130,246,0.3)", tag: "Extract" },
  { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert every PDF page into a high-quality JPG image.", icon: FileText, gradient: "linear-gradient(135deg, #eab308, #a16207)", shadow: "rgba(234,179,8,0.3)", tag: "Convert" },
  { id: "redact-pdf", title: "Redact PDF", description: "Permanently black out sensitive text and images.", icon: EyeOff, gradient: "linear-gradient(135deg, #ef4444, #991b1b)", shadow: "rgba(239,68,68,0.3)", tag: "Edit" },
  { id: "pdf-to-word", title: "PDF to Word", description: "Convert your PDF into an editable DOCX file.", icon: FileText, gradient: "linear-gradient(135deg, #3b82f6, #1e3a8a)", shadow: "rgba(59,130,246,0.3)", tag: "Convert" },
];

export default function OcrPdfPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #eff6ff33 0%, #fff0 50%, #dbeafe33 100%)" }}>

      {/* Tool */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <OcrPdf />
        </div>
      </section>

      {/* How it works */}
      {!mounted ? <HowItWorksShimmer accent="rgba(59,130,246,0.15)" /> : (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-500 mb-4"><s.icon size={28} /></div>
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
                    <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">{t.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
