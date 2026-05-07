"use client";
import dynamic from 'next/dynamic';
import { Stamp, Upload, Type, Download, Hash, Settings, Lock, Unlock, PenLine, Combine, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const EditTools = dynamic(() => import('@/components/tools/EditTools'), { ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(221 214 254)" /> });

const FEATURES = ['Text or image watermark','Centered on every page','Adjustable transparency','Supports PNG & JPG logos','Instant download','100% private — runs in browser'];
const STEPS = [
  { icon: Upload,   title: 'Upload Your PDF',          desc: 'Select any PDF file. All processing happens entirely in your browser — your file never leaves your device.' },
  { icon: Type,     title: 'Set Your Watermark',       desc: 'Type a text watermark like "CONFIDENTIAL" or upload a logo image. Choose text or image mode.' },
  { icon: Download, title: 'Download Watermarked PDF', desc: 'Click "Apply Watermark" and download your stamped PDF instantly — ready to share or distribute.' },
];
const RELATED = [
  { id: 'page-numbers', title: 'Page Numbers',  description: 'Add professional page numbers to your PDF at any position.',                    icon: Hash,    gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Edit',     href: '/tool/page-numbers' },
  { id: 'metadata',     title: 'Edit Metadata', description: 'Add or update Author, Title, Subject and other document metadata fields.',       icon: Settings,gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)',tag: 'Edit',     href: '/tool/metadata'     },
  { id: 'protect',      title: 'Protect PDF',   description: 'Encrypt your watermarked PDF with a password to keep it secure.',                icon: Lock,    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security', href: '/tool/protect'      },
  { id: 'unlock',       title: 'Unlock PDF',    description: 'Remove password protection from a PDF and restore full access.',                 icon: Unlock,  gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Security', href: '/tool/unlock'       },
  { id: 'merge',        title: 'Merge PDF',     description: 'Combine multiple PDF files into one document in the order you choose.',          icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize', href: '/tool/merge'        },
  { id: 'esign',        title: 'E-Sign PDF',    description: 'Draw or type your signature and place it anywhere on a PDF instantly.',          icon: PenLine, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'rgba(139,92,246,0.3)',  tag: 'Sign',     href: '/esign'             },
];

export default function WatermarkPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen">
      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><EditTools id="watermark" /></div></section>
      {!mounted ? <HowItWorksShimmer accent="rgba(139,92,246,0.15)" /> : (
        <section className="py-16 bg-white/60"><div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-purple-50 text-purple-500 mb-4"><s.icon size={28} /></div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
              <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}</div>
        </div></section>
      )}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16"><div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Edit &amp; Security Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{RELATED.map(t => (
            <a key={t.id} href={t.href} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-purple-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-purple-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}</div>
        </div></section>
      )}
    </div>
  );
}
