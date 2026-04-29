"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Combine, Upload, GripVertical, Download, Scissors, LayoutGrid, Zap, FileSymlink, Lock, CheckCircle } from 'lucide-react';
import { MergeSplitSkeletonA } from '../[id]/skeletons';

const MergeSplit = dynamic(() => import('@/components/tools/MergeSplit'), {
  ssr: false,
  loading: () => <MergeSplitSkeletonA />,
});

const FEATURES = [
  'Merge unlimited PDF files',
  'Drag to reorder before merging',
  'Preserves original quality',
  'No file size limits',
  'Instant download',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload,      title: 'Upload PDF Files',     desc: 'Select two or more PDF files from your device. Add as many as you need — no limits.' },
  { icon: GripVertical, title: 'Reorder Files',        desc: 'Drag and drop files into the exact order you want them to appear in the final PDF.' },
  { icon: Download,    title: 'Download Merged PDF',   desc: 'Click "Merge PDF" and download your combined document instantly — one clean file.' },
];

const RELATED_TOOLS = [
  { id: 'split',        title: 'Split PDF',      description: 'Divide a PDF into separate parts or extract every page individually.',        icon: Scissors,    gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize'  },
  { id: 'organize',     title: 'Organize PDF',   description: 'Reorder, rotate, and delete pages visually with drag-and-drop ease.',         icon: LayoutGrid,  gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize'  },
  { id: 'compress',     title: 'Compress PDF',   description: 'Reduce PDF file size while keeping quality sharp and text crisp.',            icon: Zap,         gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize'  },
  { id: 'protect',      title: 'Protect PDF',    description: 'Encrypt your merged PDF with a password to keep it secure.',                  icon: Lock,        gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security'  },
  { id: 'watermark',    title: 'Watermark PDF',  description: 'Stamp a text or image watermark over every page of your PDF.',               icon: FileSymlink, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)',  tag: 'Edit'      },
  { id: 'pdf-to-jpg',   title: 'PDF to JPG',     description: 'Convert every PDF page into a high-quality JPG image instantly.',             icon: FileSymlink, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert'   },
];

function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

function HowItWorksShimmer() {
  return (
    <section className="py-16 bg-white/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <Sh className="h-7 w-40 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center gap-3">
              <Sh className="w-16 h-16 rounded-2xl" />
              <Sh className="h-3 w-16" />
              <Sh className="h-5 w-3/4" />
              <Sh className="h-3 w-full" />
              <Sh className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedToolsShimmer() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Sh className="h-7 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Sh className="w-14 h-14 rounded-2xl" />
                <Sh className="h-5 w-16 rounded-full" />
              </div>
              <Sh className="h-5 w-3/4" />
              <Sh className="h-3 w-full" />
              <Sh className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MergePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #fef3c733 100%)' }}>

      {/* HERO — no shimmer */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Combine size={13} /> Free PDF Merge Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Merge PDF Files{' '}
            <span style={{ background: 'linear-gradient(135deg, #f26522, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Into One</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Combine multiple PDF files into a single document in seconds. Drag to reorder, then merge — all processed locally in your browser with zero uploads.
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
          <MergeSplit id="merge" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer /> : (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 text-orange-500 mb-4"><step.icon size={28} /></div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More PDF Tools You May Need</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED_TOOLS.map((tool) => (
                <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}>
                      <tool.icon size={26} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{tool.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
