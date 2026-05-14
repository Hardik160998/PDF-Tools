"use client";
import { FileText, Upload, Sparkles, Download, FileSpreadsheet, Presentation, Globe, ImageIcon, Lock, CheckCircle } from 'lucide-react';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';
import OfficeTools from "@/components/tools/OfficeTools";

const STEPS = [
  { icon: Upload,   title: 'Upload Word File', desc: 'Select your .doc or .docx file. It is securely uploaded over HTTPS for cloud conversion.' },
  { icon: Sparkles, title: 'Convert to PDF',   desc: 'Our conversion engine preserves all fonts, images, tables, and formatting from your Word document.' },
  { icon: Download, title: 'Download PDF',     desc: 'Your converted PDF is ready instantly. Download it and your file is permanently deleted within 1 hour.' },
];
const RELATED = [
  { id: 'pdf-to-word',  title: 'PDF to Word',        description: 'Convert your PDF back into an editable DOCX file with high accuracy.',          icon: FileText,       gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'excel-to-pdf', title: 'Excel to PDF',       description: 'Convert XLSX spreadsheets to PDF with all tables and data intact.',              icon: FileSpreadsheet,gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Convert' },
  { id: 'ppt-to-pdf',   title: 'PowerPoint to PDF',  description: 'Convert PPTX presentations to PDF keeping all slides and visuals.',              icon: Presentation,   gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Convert' },
  { id: 'html-to-pdf',  title: 'HTML to PDF',        description: 'Convert any web page or HTML file into a PDF document.',                         icon: Globe,          gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Convert' },
  { id: 'jpg-to-pdf',   title: 'JPG to PDF',         description: 'Convert JPG or PNG images into a PDF document instantly.',                       icon: ImageIcon,      gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert' },
  { id: 'protect',      title: 'Protect PDF',        description: 'Encrypt your converted PDF with a password to keep it secure.',                  icon: Lock,           gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security'},
];

export default function WordToPdfPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen">
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><OfficeTools id="word-to-pdf" /></div></section>
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
