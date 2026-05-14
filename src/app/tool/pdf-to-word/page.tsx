"use client";
import { FileText, Upload, Sparkles, Download, FileSpreadsheet, Presentation, Type, ImageIcon, Lock, CheckCircle } from 'lucide-react';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';
import OfficeTools from "@/components/tools/OfficeTools";

const STEPS = [
  { icon: Upload,   title: 'Upload Your PDF',  desc: 'Select your PDF file. It is securely uploaded over HTTPS to our cloud conversion engine.' },
  { icon: Sparkles, title: 'Convert to Word',  desc: 'Our engine analyses the PDF structure and recreates it as an editable DOCX with high fidelity.' },
  { icon: Download, title: 'Download DOCX',    desc: 'Your Word file is ready to download and edit. The uploaded PDF is permanently deleted within 1 hour.' },
];
const RELATED = [
  { id: 'word-to-pdf',  title: 'Word to PDF',       description: 'Convert DOCX files back to PDF with all formatting perfectly preserved.',      icon: FileText,       gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'pdf-to-excel', title: 'PDF to Excel',      description: 'Extract tables from your PDF into an editable XLSX spreadsheet.',              icon: FileSpreadsheet,gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Convert' },
  { id: 'pdf-to-ppt',   title: 'PDF to PowerPoint', description: 'Convert your PDF into an editable PPTX presentation file.',                   icon: Presentation,   gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Convert' },
  { id: 'extract-text', title: 'PDF to Text',       description: 'Extract all text content from your PDF into a clean plain-text format.',       icon: Type,           gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'pdf-to-jpg',   title: 'PDF to JPG',        description: 'Convert every PDF page into a high-quality JPG image instantly.',              icon: ImageIcon,      gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert' },
  { id: 'protect',      title: 'Protect PDF',       description: 'Encrypt your PDF with a password to keep it secure.',                         icon: Lock,           gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security'},
];

export default function PdfToWordPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen">
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><OfficeTools id="pdf-to-word" /></div></section>
      {!mounted ? <HowItWorksShimmer accent="rgba(59,130,246,0.15)" /> : (
        <section className="py-16 bg-white/60"><div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-500 mb-4"><s.icon size={28} /></div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
              <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}</div>
        </div></section>
      )}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16"><div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Convert Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{RELATED.map(t => (
            <a key={t.id} href={`/tool/${t.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}</div>
        </div></section>
      )}
    </div>
  );
}
