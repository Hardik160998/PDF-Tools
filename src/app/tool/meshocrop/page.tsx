"use client";
import { useState, useEffect } from 'react';
import { ShoppingBag, Upload, Scissors, Download, CheckCircle, Zap, FileText, Wand2, Crop, Combine, Lock } from 'lucide-react';
import MeeshoCropLabel from '@/components/tools/MeeshoCropLabel';
import { updateMeeshoToolTitles } from '@/lib/supabase';

const STEPS = [
  { icon: Upload,   title: 'Upload Meesho Labels',   desc: 'Drop one or multiple Meesho shipping label PDFs. Everything runs in your browser — no uploads to any server.' },
  { icon: Scissors, title: 'Auto Crop TAX INVOICE',  desc: 'The tool scans each page, finds "TAX INVOICE" text and crops everything from top to just above that line.' },
  { icon: Download, title: 'Download Clean Labels',  desc: 'All cropped labels with only shipping info, return address & barcodes are merged into one PDF.' },
];

const RELATED_TOOLS = [
  { id: 'meesho-cropper',  title: 'Meesho Invoice Cropper',  description: 'Remove invoice section below "Total" from Meesho labels. Complementary to this tool.',          icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Ecommerce'  },
  { id: 'aadhar-crop',     title: 'Aadhar Cropper',          description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.',                icon: Wand2,       gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Special'  },
  { id: 'crop-pdf',        title: 'Crop PDF',                description: 'Trim margins and crop any pages of your PDF with custom margin controls.',                     icon: Crop,        gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Special'  },
  { id: 'merge',           title: 'Merge PDF',               description: 'Combine multiple PDF files into one document in the order you choose.',                        icon: Combine,     gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'split',           title: 'Split PDF',               description: 'Divide a PDF into separate parts or extract every page individually.',                         icon: Scissors,    gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
  { id: 'compress',        title: 'Compress PDF',            description: 'Reduce PDF file size while keeping text sharp and content intact.',                            icon: Zap,         gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
];

export default function MeeshoCropPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); updateMeeshoToolTitles(); }, []);

  return (
    <div className="min-h-screen">
      <section className="pb-8">
        <MeeshoCropLabel id="meshocrop" />
      </section>

      {mounted && (
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

      {mounted && (
        <section className="py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Why Use This Tool</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap,         color: '#f26522', title: 'Instant Processing',     desc: 'All processing happens in your browser using JavaScript — no server, no waiting, instant results.' },
                { icon: FileText,    color: '#22c55e', title: '100% Private',           desc: 'Your PDF files never leave your device. Zero data collection, fully secure and offline-capable.' },
                { icon: FileText,    color: '#3182ce', title: 'Batch PDF Support',      desc: 'Upload multiple Meesho label PDFs at once and process them all in a single click.' },
                { icon: Scissors,    color: '#8b5cf6', title: 'Smart Auto-Crop',        desc: 'Automatically detects "TAX INVOICE" text on each page — no manual selection or configuration needed.' },
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

      {mounted && (
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
