"use client";
import dynamic from 'next/dynamic';
import { ImageIcon, Upload, SlidersHorizontal, Download, Zap, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), { ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(165 243 252)" /> });

const FEATURES = ['PNG to WebP', 'Transparency preserved', 'Up to 25% smaller than PNG', 'Original resolution kept', 'Instant download', '100% private — runs in browser'];
const STEPS = [
  { icon: Upload,            title: 'Upload PNG',     desc: 'Select any PNG image from your device.' },
  { icon: SlidersHorizontal, title: 'Auto Convert',   desc: 'Your PNG is converted to WebP format instantly in your browser.' },
  { icon: Download,          title: 'Download WebP',  desc: 'Download the converted WebP file — smaller and web-optimized.' },
];
const RELATED = [
  { id: 'webp-to-png', title: 'WebP to PNG', description: 'Convert WebP images back to lossless PNG format.',                             icon: ImageIcon, gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)', shadow: 'rgba(20,184,166,0.3)',  tag: 'Image Convert' },
  { id: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPG images to modern WebP for smaller file sizes.',                    icon: ImageIcon, gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', shadow: 'rgba(124,58,237,0.3)',  tag: 'Image Convert' },
  { id: 'webp-to-jpg', title: 'WebP to JPG', description: 'Convert WebP images to universally compatible JPG format.',                    icon: ImageIcon, gradient: 'linear-gradient(135deg, #ec4899, #be185d)', shadow: 'rgba(236,72,153,0.3)',  tag: 'Image Convert' },
  { id: 'png-to-jpg',  title: 'PNG to JPG',  description: 'Convert PNG images to JPG for smaller file sizes.',                            icon: ImageIcon, gradient: 'linear-gradient(135deg, #f59e0b, #b45309)', shadow: 'rgba(245,158,11,0.3)',  tag: 'Image Convert' },
  { id: 'jpg-to-pdf',  title: 'JPG to PDF',  description: 'Turn one or multiple JPG images into a single PDF document.',                  icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert' },
  { id: 'compress',    title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.',            icon: Zap,       gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
];

export default function PngToWebpPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ecfeff33 0%, #fff0 50%, #cffafe33 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6"><ImageIcon size={13} /> Free PNG to WebP Converter</div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert PNG to WebP{' '}
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Convert your PNG images to modern WebP format in one click. Preserve transparency while reducing file size by up to 25% — ideal for web performance and faster page loads.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-cyan-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><ImageConverter id="png-to-webp" /></div></section>

      {/* Benefits banner */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-100 rounded-3xl p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4 text-center">PNG vs WebP</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { stat: '~25%', label: 'Smaller file size', sub: 'vs lossless PNG' },
                { stat: '✓', label: 'Transparency kept', sub: 'Alpha channel preserved' },
                { stat: '⚡', label: 'Faster loading', sub: 'Better web performance' },
              ].map(({ stat, label, sub }) => (
                <div key={label} className="space-y-1">
                  <div className="text-3xl font-black text-cyan-600">{stat}</div>
                  <div className="text-sm font-black text-slate-900">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!mounted ? <HowItWorksShimmer accent="rgba(6,182,212,0.15)" /> : (
        <section className="py-16 bg-white/60"><div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-50 text-cyan-500 mb-4"><s.icon size={28} /></div>
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
              <div><h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-cyan-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-cyan-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}</div>
        </div></section>
      )}
    </div>
  );
}
