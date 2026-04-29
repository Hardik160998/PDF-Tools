"use client";

import dynamic from 'next/dynamic';
import { FileJson, Upload, FileSearch, Download, Type, ImageIcon, FileText, FileSpreadsheet, Presentation, Globe, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const ExtractText = dynamic(() => import('@/components/tools/ExtractText'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(191 219 254)" /></div>,
});

const FEATURES = [
  'Structured XML output',
  'Page-by-page line elements',
  'Copy XML to clipboard',
  'Download as .xml file',
  'Machine-readable format',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload, title: 'Upload Your PDF', desc: 'Select any PDF file. All processing happens in your browser — your file never leaves your device.' },
  { icon: FileSearch, title: 'Auto-Convert to XML', desc: 'Text is extracted and wrapped in structured XML tags with page numbers and line elements.' },
  { icon: Download, title: 'Copy or Download', desc: 'Copy the XML to clipboard or download as a .xml file ready for data processing or integration.' },
];

const RELATED_TOOLS = [
  { id: 'extract-text', title: 'PDF to Text', description: 'Extract all text content from your PDF into a clean plain-text format.', icon: Type, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert every PDF page into a high-quality JPG image instantly.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF into an editable DOCX file with high accuracy.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract tables from your PDF into an editable XLSX spreadsheet.', icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Convert' },
  { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert any web page or HTML file into a PDF document.', icon: Globe, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Convert' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX files to PDF instantly with perfect formatting.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
];

export default function PdfToXmlPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #eff6ff33 0%, #fff0 50%, #dbeafe33 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <FileJson size={13} /> Free PDF to XML Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert PDF to XML{' '}
            <span style={{ background: 'linear-gradient(135deg, #3182ce, #1e3a8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Structured Data</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Extract structured, machine-readable XML from any PDF. Perfect for data processing, integrations, and archiving — all processed locally in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-blue-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <ExtractText id="pdf-to-xml" />
        </div>
      </section>

      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-500 mb-4"><step.icon size={28} /></div>
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
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
