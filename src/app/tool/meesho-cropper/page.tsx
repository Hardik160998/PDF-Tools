"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ShoppingBag, Upload, Scissors, Download, CheckCircle, Zap, FileText, Wand2, Crop, Combine, Lock } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const MeeshoCropper = dynamic(() => import('@/components/tools/MeeshoCropper'), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(254 215 170)" />,
});

const FEATURES = [
  'Auto-detects "Total" line',
  'Removes invoice section',
  'Batch PDF support',
  '100% private — runs in browser',
  'No file size limits',
  'One-click download',
];

const STEPS = [
  { icon: Upload,   title: 'Upload Label PDFs',   desc: 'Drop one or multiple Meesho shipping label PDFs. Everything runs in your browser — no uploads to any server.' },
  { icon: Scissors, title: 'Auto Crop Invoice',   desc: 'The tool scans each page, finds the "Total" line and removes everything below it automatically.' },
  { icon: Download, title: 'Download Clean PDF',  desc: 'All cropped labels are merged into one clean PDF, ready to print and stick on your packages.' },
];

const RELATED_TOOLS = [
  { id: 'aadhar-crop',  title: 'Aadhar Cropper',  description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.',          icon: Wand2,    gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Special'  },
  { id: 'crop-pdf',     title: 'Crop PDF',         description: 'Trim margins and crop any pages of your PDF with custom margin controls.',               icon: Crop,     gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Special'  },
  { id: 'merge',        title: 'Merge PDF',        description: 'Combine multiple PDF files into one document in the order you choose.',                  icon: Combine,  gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'split',        title: 'Split PDF',        description: 'Divide a PDF into separate parts or extract every page individually.',                   icon: Scissors, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'compress',     title: 'Compress PDF',     description: 'Reduce PDF file size while keeping text sharp and content intact.',                      icon: Zap,      gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
  { id: 'protect',      title: 'Protect PDF',      description: 'Encrypt your PDF with a password to keep shipping data secure.',                         icon: Lock,     gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
];

function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

function HowItWorksShimmer() {
  return (
    <section className="py-16 bg-white/60 dark:bg-slate-900/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <Sh className="h-7 w-40 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-3">
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
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
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

export default function MeeshoCropperPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #ffedd533 100%)' }}>

      {/* ── HERO ── */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <ShoppingBag size={13} /> Free Meesho Label Cropper
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Meesho Label{' '}
            <span style={{ background: 'linear-gradient(135deg, #f26522, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Invoice Cropper
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Automatically remove the invoice section from Meesho shipping label PDFs. Upload, crop and download clean print-ready labels in seconds — 100% free and private.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                <CheckCircle size={12} className="text-orange-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <MeeshoCropper id="meesho-cropper" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      {!mounted ? <HowItWorksShimmer /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-900/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mb-4">
                    <step.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY USE THIS TOOL ── */}
      {mounted && (
        <section className="py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Why Use This Tool</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap,      color: '#f26522', title: 'Instant Processing',  desc: 'All processing happens in your browser using JavaScript — no server, no waiting, instant results.' },
                { icon: FileText, color: '#22c55e', title: '100% Private',        desc: 'Your PDF files never leave your device. Zero data collection, fully secure and offline-capable.' },
                { icon: FileText, color: '#3182ce', title: 'Batch PDF Support',   desc: 'Upload multiple Meesho label PDFs at once and process them all in a single click.' },
                { icon: Scissors, color: '#8b5cf6', title: 'Smart Auto-Crop',     desc: 'Automatically detects the "Total" row on each page — no manual selection or configuration needed.' },
              ].map(f => (
                <div key={f.title} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md" style={{ background: f.color }}>
                    <f.icon size={20} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white text-sm mb-1">{f.title}</div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED TOOLS ── */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">More PDF Tools You May Need</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED_TOOLS.map(tool => (
                <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}>
                      <tool.icon size={26} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-600">{tool.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p>
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
