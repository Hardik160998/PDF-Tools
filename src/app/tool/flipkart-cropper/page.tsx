"use client";
import dynamic from 'next/dynamic';
import { ShoppingBag, Upload, Scissors, Download, Wand2, Crop, Combine, Zap, Lock, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const FlipkartCropper = dynamic(() => import('@/components/tools/FlipkartCropper'), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(254 215 170)" />,
});

const FEATURES = [
  'Auto-detects E-kart Logistics anchor',
  'Crops above "Not for resale"',
  'Keeps AWB, QR code & barcode',
  'Removes invoice & billing section',
  'PNG fallback if OCR fails',
  '100% private — runs in browser',
];

const STEPS = [
  { icon: Upload,   title: 'Upload Flipkart Label PDF',  desc: 'Drop one or multiple Flipkart shipping label PDFs. Everything runs in your browser — no uploads to any server.' },
  { icon: Wand2,    title: 'Smart OCR Detection',        desc: 'The tool scans for "E-kart Logistics" (top) and "Not for resale" (bottom) anchors to precisely locate the label area.' },
  { icon: Download, title: 'Download Clean Labels',      desc: 'Cropped labels with AWB, QR code, address & barcode are merged into one print-ready PDF. PNG export also available.' },
];

const RELATED = [
  { id: 'meesho-cropper', title: 'Meesho Label Cropper',              description: 'Remove invoice section below "Total" from Meesho shipping label PDFs.',                    icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Ecommerce', href: '/tool/meesho-cropper' },
  { id: 'meshocrop',      title: 'Meesho Crop Label (without invoice)', description: 'Crop Meesho labels to keep only shipping address, return address & barcodes.',             icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Ecommerce', href: '/tool/meshocrop'      },
  { id: 'aadhar-crop',    title: 'Aadhar Cropper',                    description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.',                icon: Wand2,       gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Special',   href: '/tool/aadhar-crop'   },
  { id: 'crop-pdf',       title: 'Crop PDF',                          description: 'Trim margins and crop any pages of your PDF with custom margin controls.',                    icon: Crop,        gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Special',   href: '/tool/crop-pdf'      },
  { id: 'merge',          title: 'Merge PDF',                         description: 'Combine multiple PDF files into one document in the order you choose.',                       icon: Combine,     gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize',  href: '/tool/merge'         },
  { id: 'compress',       title: 'Compress PDF',                      description: 'Reduce PDF file size while keeping text sharp and content intact.',                           icon: Zap,         gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize',  href: '/tool/compress'      },
];

export default function FlipkartCropperPage() {
  const mounted = usePageMounted();
  const ACCENT = '#F7941D';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #ffedd533 100%)' }}>

      {/* HERO */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm mb-6"
            style={{ background: '#fff7ed', color: ACCENT, borderColor: '#fed7aa' }}>
            <ShoppingBag size={13} /> Free Flipkart Label Cropper
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Flipkart Label{' '}
            <span style={{ background: `linear-gradient(135deg, ${ACCENT}, #f59e0b)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Smart Cropper
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Automatically detect and crop Flipkart / E-kart shipping labels. Uses OCR anchors to keep only the courier label — AWB, QR code, address &amp; barcode — and removes invoice, billing &amp; footer.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                <CheckCircle size={12} style={{ color: ACCENT }} /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <FlipkartCropper id="flipkart-cropper" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      {!mounted ? <HowItWorksShimmer accent="rgba(247,148,29,0.15)" /> : (
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
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Smart Detection Logic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Top Anchor',    value: '"E-kart Logistics"',  color: '#22c55e', desc: 'Crop starts just above this text' },
                { label: 'Bottom Anchor', value: '"Not for resale"',    color: '#ef4444', desc: 'Crop ends just before this text' },
                { label: 'Left Anchor',   value: '"STD" text',          color: '#3182ce', desc: 'Left border of the label area' },
                { label: 'Right Anchor',  value: '"E" routing cell',    color: '#8b5cf6', desc: 'Right border of the label area' },
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
                ⚡ Fallback: If OCR anchors are not found (scanned/image PDFs), the tool automatically detects the largest bordered rectangle in the upper half of the page.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">More Ecommerce &amp; Crop Tools</h2>
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
