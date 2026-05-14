"use client";
import { Upload, Crop, Download, Lock, Unlock, FileText, ImageIcon, Merge, SplitSquareHorizontal } from 'lucide-react';
import CropPdf from '@/components/tools/CropPdf';

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
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <CropPdf id="crop-pdf" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-orange-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELATED.map(t => (
            <a key={t.id} href={t.href} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
