"use client";
import { ImageIcon, Upload, SlidersHorizontal, Download, Zap } from 'lucide-react';
import ImageConverter from '@/components/tools/ImageConverter';

const STEPS = [
  { icon: Upload,            title: 'Upload WebP',    desc: 'Select any WebP image from your device.' },
  { icon: SlidersHorizontal, title: 'Auto Convert',   desc: 'Your WebP is converted to lossless PNG format instantly in your browser.' },
  { icon: Download,          title: 'Download PNG',   desc: 'Download the converted PNG — lossless quality, maximum compatibility.' },
];

const RELATED = [
  { id: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to WebP for smaller sizes without quality loss.',           icon: ImageIcon, gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)', shadow: 'rgba(6,182,212,0.3)',   tag: 'Image Convert' },
  { id: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPG images to modern WebP for smaller file sizes.',                    icon: ImageIcon, gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', shadow: 'rgba(124,58,237,0.3)',  tag: 'Image Convert' },
  { id: 'webp-to-jpg', title: 'WebP to JPG', description: 'Convert WebP images to universally compatible JPG format.',                    icon: ImageIcon, gradient: 'linear-gradient(135deg, #ec4899, #be185d)', shadow: 'rgba(236,72,153,0.3)',  tag: 'Image Convert' },
  { id: 'jpg-to-png',  title: 'JPG to PNG',  description: 'Convert JPG images to lossless PNG format instantly.',                         icon: ImageIcon, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Image Convert' },
  { id: 'jpg-to-pdf',  title: 'JPG to PDF',  description: 'Turn one or multiple JPG images into a single PDF document.',                  icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)',   tag: 'Convert' },
  { id: 'compress',    title: 'Compress PDF', description: 'Reduce PDF file size while keeping quality sharp and text crisp.',            icon: Zap,       gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
];

export default function WebpToPngPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <ImageConverter id="webp-to-png" />

        <section className="py-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-800 rounded-3xl p-8">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center">When to Use WebP → PNG</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { icon: '🎨', label: 'Design Tools', sub: 'Figma, Photoshop prefer PNG' },
                  { icon: '🖼️', label: 'Editing', sub: 'Lossless for pixel editing' },
                  { icon: '🔗', label: 'Compatibility', sub: 'Works in all apps' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="space-y-1">
                    <div className="text-3xl">{icon}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-teal-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELATED.map(t => (
            <a key={t.id} href={`/tool/${t.id}`} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-teal-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-teal-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
