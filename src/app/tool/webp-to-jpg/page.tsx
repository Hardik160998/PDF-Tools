"use client";
import dynamic from 'next/dynamic';
import { ImageIcon, Upload, SlidersHorizontal, Download, Zap, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), { ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(251 207 232)" /> });

const FEATURES = ['WebP to JPG / JPEG', 'Universal compatibility', 'White background fill for transparency', 'Original resolution kept', 'Instant download', '100% private — runs in browser'];
const STEPS = [
  { icon: Upload,            title: 'Upload WebP',    desc: 'Select any WebP image from your device.' },
  { icon: SlidersHorizontal, title: 'Auto Convert',   desc: 'Your WebP is converted to JPG with white background fill instantly.' },
  { icon: Download,          title: 'Download JPG',   desc: 'Download the converted JPG — universally compatible with all apps.' },
];
const RELATED = [
  { id: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPG images to modern WebP for smaller file sizes.',                   icon: ImageIcon, gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', shadow: 'rgba(124,58,237,0.3)',  tag: 'Image Convert' },
  { id: 'webp-to-png', title: 'WebP to PNG', description: 'Convert WebP images to lossless PNG for maximum compatibility.',               icon: ImageIcon, gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)', shadow: 'rgba(20,184,166,0.3)',  tag: 'Image Convert' },
  { id: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to WebP for smaller sizes without quality loss.',           icon: ImageIcon, gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)', shadow: 'rgba(6,182,212,0.3)',   tag: 'Image Convert' },
  { id: 'jpg-to-png',  title: 'JPG to PNG',  description: 'Convert JPG images to lossless PNG format instantly.',                         icon: ImageIcon, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Image Convert' },
  { id: 'jpg-to-pdf',  title: 'JPG to PDF',  description: 'Turn one or multiple JPG images into a single PDF document.',                  icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert' },
  { id: 'compress',    title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.',            icon: Zap,       gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
];

export default function WebpToJpgPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf2f833 0%, #fff0 50%, #fce7f333 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-600 border border-pink-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6"><ImageIcon size={13} /> Free WebP to JPG Converter</div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert WebP to JPG{' '}
            <span style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Convert WebP images to universally compatible JPG format in one click. Perfect for sharing on platforms that don&apos;t support WebP, email attachments, and legacy apps.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-pink-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><ImageConverter id="webp-to-jpg" /></div></section>

      {/* Use case banner */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4 text-center">When to Use WebP → JPG</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: '📧', label: 'Email Attachments', sub: 'JPG works everywhere' },
                { icon: '🖨️', label: 'Printing', sub: 'Print shops prefer JPG' },
                { icon: '📱', label: 'Legacy Apps', sub: 'Older apps need JPG' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="space-y-1">
                  <div className="text-3xl">{icon}</div>
                  <div className="text-sm font-black text-slate-900">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!mounted ? <HowItWorksShimmer accent="rgba(236,72,153,0.15)" /> : (
        <section className="py-16 bg-white/60"><div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-pink-50 text-pink-500 mb-4"><s.icon size={28} /></div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
              <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}</div>
        </div></section>
      )}

      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16"><div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Image Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{RELATED.map(t => (
            <a key={t.id} href={`/tool/${t.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-pink-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-pink-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}</div>
        </div></section>
      )}
    </div>
  );
}
