"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Zap, Upload, Settings, Download, Combine, Scissors, LayoutGrid, FileSymlink, Lock, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const Compressor = dynamic(() => import('@/components/tools/Compressor'), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(187 247 208)" />,
});

const FEATURES = [
  'Reduces file size instantly',
  'Preserves text sharpness',
  'Strips hidden metadata',
  'No file size limits',
  'One-click download',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload,    title: 'Upload Your PDF',         desc: 'Select any PDF file from your device. Large files are handled entirely in your browser — nothing is uploaded.' },
  { icon: Settings,  title: 'Auto Compress',           desc: 'Our tool strips metadata, optimises object streams, and removes redundant data to shrink the file size.' },
  { icon: Download,  title: 'Download Compressed PDF', desc: 'See the before/after size comparison, then download your smaller PDF with one click.' },
];

const RELATED_TOOLS = [
  { id: 'merge',        title: 'Merge PDF',      description: 'Combine multiple PDF files into one document in the order you choose.',      icon: Combine,     gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'split',        title: 'Split PDF',      description: 'Divide a PDF into separate parts or extract every page individually.',        icon: Scissors,    gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'organize',     title: 'Organize PDF',   description: 'Reorder, rotate, and delete pages visually with drag-and-drop ease.',         icon: LayoutGrid,  gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'repair-pdf',   title: 'Repair PDF',     description: 'Recover data from damaged, corrupted or illegible PDF files.',                icon: Zap,         gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
  { id: 'protect',      title: 'Protect PDF',    description: 'Encrypt your compressed PDF with a password to keep it secure.',              icon: Lock,        gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
  { id: 'extract-text', title: 'PDF to Text',    description: 'Extract all text content from your PDF into a clean, editable format.',       icon: FileSymlink, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert'  },
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

export default function CompressPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen">
      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Compressor id="compress" />
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
                  <div className="inline-flex p-4 rounded-2xl bg-green-50 text-green-500 mb-4"><step.icon size={28} /></div>
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
                    <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-green-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-green-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
