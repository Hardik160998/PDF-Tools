"use client";
import { ShoppingBag, Upload, Download, Wand2, Crop, Combine, Zap } from 'lucide-react';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';
import SnapdealCropper from '@/components/tools/SnapdealCropper';

const STEPS = [
  { icon: Upload,   title: 'Upload Snapdeal Label',      desc: 'Drop one or multiple Snapdeal shipping label PDFs. Processing happens instantly in your browser.' },
  { icon: Wand2,    title: 'Smart Border Detection',     desc: 'Automatically detects the outer borders of the label, protecting barcodes, addresses, and quantity sections.' },
  { icon: Download, title: 'Download Perfect Crop',      desc: 'Get perfectly sized PDF labels ready for thermal or A4 printing without any cut-off text.' },
];

const RELATED = [
  { id: 'flipkart-cropper', title: 'Flipkart Label Cropper', description: 'Smart OCR crop for Flipkart shipping labels. Keeps AWB & barcodes.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Ecommerce', href: '/tool/flipkart-cropper' },
  { id: 'meesho-cropper',   title: 'Meesho Label Cropper',   description: 'Remove invoice section below "Total" from Meesho shipping label PDFs.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Ecommerce', href: '/tool/meesho-cropper' },
  { id: 'amazon-cropper',   title: 'Amazon Label Cropper',   description: 'Extract Amazon shipping labels and automatically remove invoice pages.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #FF9900, #f59e0b)', shadow: 'rgba(255,153,0,0.3)',  tag: 'Ecommerce', href: '/tool/amazon-cropper' },
  { id: 'crop-pdf',         title: 'Crop PDF',               description: 'Trim margins and crop any pages of your PDF with custom margin controls.', icon: Crop, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Special',   href: '/tool/crop-pdf'      },
  { id: 'merge',            title: 'Merge PDF',              description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize',  href: '/tool/merge'         },
  { id: 'compress',         title: 'Compress PDF',           description: 'Reduce PDF file size while keeping text sharp and content intact.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize',  href: '/tool/compress'      },
];

export default function SnapdealCropperPage() {
  const mounted = usePageMounted();
  const ACCENT = '#E40046';

  return (
    <div className="min-h-screen">
      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <SnapdealCropper id="snapdeal-cropper" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(228,0,70,0.15)" /> : (
        <section className="py-16 bg-white/60 dark:bg-slate-900/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl mb-4 text-white" style={{ background: `${ACCENT}22`, color: ACCENT }}>
                    <s.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DETECTION LOGIC */}
      {mounted && (
        <section className="py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Snapdeal Detection Logic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Top Anchor',    value: 'Snapdeal Logo / Header',  color: '#e40046', desc: 'Crop includes logo with safe white margin' },
                { label: 'Bottom Anchor', value: 'Reference Barcode',       color: '#10b981', desc: 'Crop extends safely below the bottom reference barcode' },
                { label: 'Left Anchor',   value: 'Shipped From',            color: '#3b82f6', desc: 'Crop starts safely to the left of the address border' },
                { label: 'Right Anchor',  value: 'Total Items',             color: '#f59e0b', desc: 'Crop includes the quantity number & right border' },
              ].map(a => (
                <div key={a.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md text-xs font-black" style={{ background: a.color }}>
                    {a.label.split(' ')[0][0]}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white text-sm mb-0.5">{a.label}</div>
                    <code className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${a.color}18`, color: a.color }}>{a.value}</code>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                ⚡ Safe Padding: The engine adds 10-25px of safe white margin around all detected borders to ensure zero text cut-off during printing.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">More Ecommerce Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED.map(t => (
                <a key={t.id} href={t.href} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                      <t.icon size={26} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-600">{t.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:transition-colors" style={{ '--hover-color': ACCENT } as any}>{t.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ACCENT }}>Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
