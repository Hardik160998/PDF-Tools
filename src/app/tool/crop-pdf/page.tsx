"use client";
import dynamic from 'next/dynamic';
import { Scissors, Upload, Crop, Download, Lock, Unlock, FileText, Combine, ImageIcon, CheckCircle, Merge, SplitSquareHorizontal } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const CropPdf = dynamic(() => import('@/components/tools/CropPdf'), {
  ssr: false,
  loading: () => <CenteredCardSkeleton accent="rgb(254 215 170)" />,
});

const FEATURES = [
  'Visual drag-to-crop interface',
  'Apply to all pages or per page',
  'Precise pixel-level control',
  'Preserves original PDF quality',
  'Works with multi-page PDFs',
  '100% private — runs in browser',
];

const STEPS = [
  {
    icon: Upload,
    title: 'Upload Your PDF',
    desc: 'Select or drop your PDF file. All processing happens entirely in your browser — your file never leaves your device.',
  },
  {
    icon: Crop,
    title: 'Set the Crop Area',
    desc: 'Drag the orange handles to define exactly which area to keep. Apply the same crop to all pages or set a different crop per page.',
  },
  {
    icon: Download,
    title: 'Download Cropped PDF',
    desc: 'Click "Crop PDF" and instantly download your cropped PDF with all pages trimmed to your selected area.',
  },
];

const RELATED = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document in seconds.',
    icon: Merge,
    gradient: 'linear-gradient(135deg, #f97316, #c2410c)',
    shadow: 'rgba(249,115,22,0.3)',
    tag: 'Organize',
    href: '/tool/merge',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Split a PDF into individual pages or custom page ranges.',
    icon: SplitSquareHorizontal,
    gradient: 'linear-gradient(135deg, #f97316, #c2410c)',
    shadow: 'rgba(249,115,22,0.3)',
    tag: 'Organize',
    href: '/tool/split',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce PDF file size without losing visible quality.',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #22c55e, #15803d)',
    shadow: 'rgba(34,197,94,0.3)',
    tag: 'Optimize',
    href: '/tool/compress',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert every PDF page into a high-quality JPG image.',
    icon: ImageIcon,
    gradient: 'linear-gradient(135deg, #eab308, #a16207)',
    shadow: 'rgba(234,179,8,0.3)',
    tag: 'Convert',
    href: '/tool/pdf-to-jpg',
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    description: 'Encrypt your PDF with a password to keep it secure.',
    icon: Lock,
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    shadow: 'rgba(239,68,68,0.3)',
    tag: 'Security',
    href: '/tool/protect',
  },
  {
    id: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove password protection from a PDF instantly.',
    icon: Unlock,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    shadow: 'rgba(139,92,246,0.3)',
    tag: 'Security',
    href: '/tool/unlock',
  },
];

export default function CropPdfPage() {
  const mounted = usePageMounted();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #ffedd533 100%)' }}>

      {/* Hero */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Scissors size={13} /> Free Online PDF Cropper
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Crop PDF Pages{' '}
            <span style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Precisely
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Remove unwanted margins, headers, or footers from your PDF pages. Drag the crop handles to select exactly what to keep — apply to all pages or customize per page. 100% private, runs entirely in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-orange-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="pb-8">
        <CropPdf id="crop-pdf" />
      </section>

      {/* How it works */}
      {!mounted ? <HowItWorksShimmer accent="rgba(249,115,22,0.15)" /> : (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 text-orange-500 mb-4"><s.icon size={28} /></div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related tools */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Tools You May Need</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED.map(t => (
                <a key={t.id} href={t.href}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                      <t.icon size={26} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">{t.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool &#8594;
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
