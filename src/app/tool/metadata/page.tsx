"use client";

import dynamic from 'next/dynamic';
import { Settings, Upload, PenLine, Download, Stamp, Hash, Lock, Unlock, Combine, Zap, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const EditTools = dynamic(() => import('@/components/tools/EditTools'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(203 213 225)" /></div>,
});

const FEATURES = [
  'Edit Title, Author & Subject',
  'Update Keywords & Creator',
  'Modify creation & modified dates',
  'View existing metadata first',
  'Instant download',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload, title: 'Upload Your PDF', desc: 'Select any PDF file. Existing metadata is automatically read and pre-filled in the form for you to review.' },
  { icon: PenLine, title: 'Edit Metadata Fields', desc: 'Update Title, Author, Subject, Keywords, Creator, Producer, and date fields as needed.' },
  { icon: Download, title: 'Download Updated PDF', desc: 'Click "Apply Metadata" and download your PDF with the updated document information instantly.' },
];

const RELATED_TOOLS = [
  { id: 'watermark', title: 'Watermark PDF', description: 'Stamp a text or image watermark over every page of your PDF.', icon: Stamp, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Edit' },
  { id: 'page-numbers', title: 'Page Numbers', description: 'Add professional page numbers to your PDF automatically.', icon: Hash, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Edit' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove password protection from a PDF and restore full access.', icon: Unlock, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Security' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize' },
];

export default function MetadataPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc33 0%, #fff0 50%, #f1f5f933 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Settings size={13} /> Free PDF Metadata Editor
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Edit PDF Metadata{' '}
            <span style={{ background: 'linear-gradient(135deg, #64748b, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            View and edit hidden PDF metadata — Title, Author, Subject, Keywords, Creator, and dates. Existing values are pre-filled so you can update only what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-slate-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><EditTools id="metadata" /></div></section>

      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-slate-100 text-slate-500 mb-4"><step.icon size={28} /></div>
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Edit &amp; Security Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED_TOOLS.map((tool) => (
              <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{tool.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-slate-600 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-slate-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
