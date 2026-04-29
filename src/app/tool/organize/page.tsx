"use client";

import dynamic from 'next/dynamic';
import { LayoutGrid, Upload, Download, Combine, Scissors, Zap, RotateCw, FileSymlink, CheckCircle } from 'lucide-react';
import { OrganizeSkeletonA } from '../[id]/skeletons';

const OrganizeTool = dynamic(() => import('@/components/tools/OrganizeTool'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><OrganizeSkeletonA /></div>,
});

const FEATURES = [
  'Drag & drop to reorder pages',
  'Rotate individual or all pages',
  'Delete unwanted pages',
  'Combine multiple PDFs',
  'Live visual thumbnails',
  '100% private — runs in browser',
];

const STEPS = [
  {
    icon: Upload,
    title: 'Upload Your PDF',
    desc: 'Select one or more PDF files. All pages load instantly as visual thumbnails — no waiting.',
  },
  {
    icon: LayoutGrid,
    title: 'Arrange Pages',
    desc: 'Drag and drop pages into any order. Rotate or delete pages you don\'t need with one click.',
  },
  {
    icon: Download,
    title: 'Download Result',
    desc: 'Click "Organize PDF" and download your perfectly arranged document in seconds.',
  },
];

const RELATED_TOOLS = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document in the order you choose.',
    icon: Combine,
    gradient: 'linear-gradient(135deg, #f26522, #c2410c)',
    shadow: 'rgba(242,101,34,0.3)',
    tag: 'Organize',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Divide a PDF into separate parts or extract every page individually.',
    icon: Scissors,
    gradient: 'linear-gradient(135deg, #f26522, #c2410c)',
    shadow: 'rgba(242,101,34,0.3)',
    tag: 'Organize',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while keeping quality sharp and text crisp.',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #22c55e, #15803d)',
    shadow: 'rgba(34,197,94,0.3)',
    tag: 'Optimize',
  },
  {
    id: 'extract-text',
    title: 'PDF to Text',
    description: 'Extract all text content from your PDF into a clean, editable format.',
    icon: FileSymlink,
    gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)',
    shadow: 'rgba(49,130,206,0.3)',
    tag: 'Convert',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert every PDF page into a high-quality JPG image instantly.',
    icon: RotateCw,
    gradient: 'linear-gradient(135deg, #eab308, #a16207)',
    shadow: 'rgba(234,179,8,0.3)',
    tag: 'Convert',
  },
  {
    id: 'watermark',
    title: 'Watermark PDF',
    description: 'Stamp a text or image watermark over every page of your PDF.',
    icon: FileSymlink,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    shadow: 'rgba(139,92,246,0.3)',
    tag: 'Edit',
  },
];

export default function OrganizePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #fef3c733 100%)' }}>

      {/* HERO */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <LayoutGrid size={13} /> Free PDF Organizer Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Organize PDF Pages{' '}
            <span style={{ background: 'linear-gradient(135deg, #f26522, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Visually
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Drag and drop PDF pages into any order, rotate or delete pages, and combine multiple PDFs — all with a live visual preview. No uploads, 100% private.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-orange-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <OrganizeTool id="organize" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-orange-50 text-orange-500 mb-4">
                  <step.icon size={28} />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Organize &amp; Convert Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED_TOOLS.map((tool) => (
              <a key={tool.id} href={`/tool/${tool.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}>
                    <tool.icon size={26} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool &#8594;
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
