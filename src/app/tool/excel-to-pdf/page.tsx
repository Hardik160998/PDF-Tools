"use client";

import dynamic from 'next/dynamic';
import { FileSpreadsheet, Upload, Sparkles, Download, FileText, Presentation, Globe, ImageIcon, Lock, Zap, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const OfficeTools = dynamic(() => import('@/components/tools/OfficeTools'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(187 247 208)" /></div>,
});

const FEATURES = [
  'Supports .xls & .xlsx',
  'All sheets converted',
  'Tables & formulas preserved',
  'Fast cloud conversion',
  'Files deleted within 1 hour',
  'Encrypted HTTPS transfer',
];

const STEPS = [
  { icon: Upload, title: 'Upload Excel File', desc: 'Select your .xls or .xlsx spreadsheet. It is securely uploaded over HTTPS for cloud conversion.' },
  { icon: Sparkles, title: 'Convert to PDF', desc: 'All sheets, tables, and cell formatting are preserved in the output PDF document.' },
  { icon: Download, title: 'Download PDF', desc: 'Your PDF is ready instantly. Download it and your Excel file is permanently deleted within 1 hour.' },
];

const RELATED_TOOLS = [
  { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract tables from your PDF into an editable XLSX spreadsheet.', icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Convert' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX files to PDF with all formatting perfectly preserved.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Convert PPTX presentations to PDF keeping all slides and visuals.', icon: Presentation, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Convert' },
  { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert any web page or HTML file into a PDF document.', icon: Globe, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Convert' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your converted PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
];

export default function ExcelToPdfPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf433 0%, #fff0 50%, #dcfce733 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <FileSpreadsheet size={13} /> Free Excel to PDF Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert Excel to PDF{' '}
            <span style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Convert .xls and .xlsx spreadsheets to PDF with all tables, sheets, and formatting intact. Fast, secure, and free — files deleted within 1 hour.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-green-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><OfficeTools id="excel-to-pdf" /></div></section>
      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-green-50 text-green-500 mb-4"><step.icon size={28} /></div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Convert Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED_TOOLS.map((tool) => (
              <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{tool.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-green-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-green-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
