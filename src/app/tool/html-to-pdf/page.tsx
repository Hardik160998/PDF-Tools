"use client";

import dynamic from 'next/dynamic';
import { Globe, Upload, Sparkles, Download, FileText, FileSpreadsheet, Presentation, ImageIcon, Lock, Zap, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const OfficeTools = dynamic(() => import('@/components/tools/OfficeTools'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(221 214 254)" /></div>,
});

const FEATURES = [
  'Supports .html & .htm files',
  'Preserves styles & layout',
  'Images & links included',
  'Fast cloud conversion',
  'Files deleted within 1 hour',
  'Encrypted HTTPS transfer',
];

const STEPS = [
  { icon: Upload, title: 'Upload HTML File', desc: 'Select your .html or .htm file. It is securely uploaded over HTTPS for cloud conversion.' },
  { icon: Sparkles, title: 'Render to PDF', desc: 'Our engine renders the HTML with full CSS styling, images, and layout — just like a browser would.' },
  { icon: Download, title: 'Download PDF', desc: 'Your PDF is ready instantly. Download it and your HTML file is permanently deleted within 1 hour.' },
];

const RELATED_TOOLS = [
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX files to PDF with all formatting perfectly preserved.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert XLSX spreadsheets to PDF with all tables and data intact.', icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Convert' },
  { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Convert PPTX presentations to PDF keeping all slides and visuals.', icon: Presentation, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Convert' },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG or PNG images into a PDF document instantly.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your converted PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
];

export default function HtmlToPdfPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f3ff33 0%, #fff0 50%, #ede9fe33 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Globe size={13} /> Free HTML to PDF Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert HTML to PDF{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pixel Perfect</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Convert any HTML file or web page into a PDF document with full CSS styling, images, and layout preserved — exactly as it appears in a browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-indigo-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><OfficeTools id="html-to-pdf" /></div></section>
      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-500 mb-4"><step.icon size={28} /></div>
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
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-indigo-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-indigo-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
