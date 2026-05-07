"use client";
import dynamic from 'next/dynamic';
import { ImageIcon, Upload, SlidersHorizontal, Download, Type, FileText, Combine, Zap, Lock, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), { ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(254 240 138)" /> });

const FEATURES = ['Supports JPG, PNG & more','Multiple images into one PDF','Each image becomes a page','Preserves original resolution','Instant download','100% private — runs in browser'];
const STEPS = [
  { icon: Upload,            title: 'Upload Images',   desc: 'Select one or more JPG or PNG images. Add as many as you need — each becomes a page in the PDF.' },
  { icon: SlidersHorizontal, title: 'Auto Layout',     desc: 'Each image is placed on its own page at its original dimensions for the best quality output.' },
  { icon: Download,          title: 'Download PDF',    desc: 'Click "Convert to PDF" and download your combined image PDF instantly — ready to share or print.' },
];
const RELATED = [
  { id: 'pdf-to-jpg',   title: 'PDF to JPG',   description: 'Convert every PDF page into a high-quality JPG image instantly.',          icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert'  },
  { id: 'extract-text', title: 'PDF to Text',  description: 'Extract all text content from your PDF into a clean plain-text format.',   icon: Type,      gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert'  },
  { id: 'word-to-pdf',  title: 'Word to PDF',  description: 'Convert DOCX files to PDF instantly with perfect formatting.',             icon: FileText,  gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert'  },
  { id: 'merge',        title: 'Merge PDF',    description: 'Combine multiple PDF files into one document in the order you choose.',    icon: Combine,   gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'compress',     title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.',        icon: Zap,       gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
  { id: 'protect',      title: 'Protect PDF',  description: 'Encrypt your PDF with a password to keep it secure.',                    icon: Lock,      gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
];

export default function JpgToPdfPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen">
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><ImageConverter id="jpg-to-pdf" /></div></section>
      {!mounted ? <HowItWorksShimmer accent="rgba(234,179,8,0.15)" /> : (
        <section className="py-16 bg-white/60"><div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-50 text-yellow-500 mb-4"><s.icon size={28} /></div>
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
              <div><h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-yellow-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-yellow-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}</div>
        </div></section>
      )}
    </div>
  );
}
