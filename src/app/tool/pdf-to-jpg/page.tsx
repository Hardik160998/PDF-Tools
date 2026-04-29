"use client";

import dynamic from 'next/dynamic';
import { ImageIcon, Upload, Eye, Download, Type, FileJson, FileText, FileSpreadsheet, Combine, Scissors, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(254 240 138)" /></div>,
});

const FEATURES = [
  'Converts every page to JPG',
  'High-quality 2x resolution',
  'Download individually or as ZIP',
  'Preview before downloading',
  'No file size limits',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload, title: 'Upload Your PDF', desc: 'Select any PDF file. Every page is rendered at 2x resolution for crisp, high-quality images.' },
  { icon: Eye, title: 'Preview All Pages', desc: 'See thumbnail previews of every converted page before downloading. Download individually or all at once.' },
  { icon: Download, title: 'Download JPGs', desc: 'Download each page as a separate JPG, or grab all pages in a single ZIP archive instantly.' },
];

const RELATED_TOOLS = [
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG images back into a PDF document with perfect quality.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'extract-text', title: 'PDF to Text', description: 'Extract all text content from your PDF into a clean plain-text format.', icon: Type, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'pdf-to-xml', title: 'PDF to XML', description: 'Extract structured data from your PDF into machine-readable XML format.', icon: FileJson, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF into an editable DOCX file with high accuracy.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.', icon: Scissors, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
];

export default function PdfToJpgPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fefce833 0%, #fff0 50%, #fef9c333 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <ImageIcon size={13} /> Free PDF to JPG Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert PDF to JPG{' '}
            <span style={{ background: 'linear-gradient(135deg, #eab308, #a16207)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>High Quality</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Turn every page of your PDF into a crisp, high-resolution JPG image. Preview all pages, download individually or as a ZIP — all in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-yellow-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><ImageConverter id="pdf-to-jpg" /></div></section>

      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-yellow-50 text-yellow-500 mb-4"><step.icon size={28} /></div>
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
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-yellow-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-yellow-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
