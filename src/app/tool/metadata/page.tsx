"use client";
import { PenLine, Upload, Download, Stamp, Hash, Lock, Unlock, Combine, Zap } from 'lucide-react';
import EditTools from '@/components/tools/EditTools';

const STEPS = [
  { icon: Upload,  title: 'Upload Your PDF',       desc: 'Select any PDF file. Existing metadata is automatically read and pre-filled in the form for you to review.' },
  { icon: PenLine, title: 'Edit Metadata Fields',  desc: 'Update Title, Author, Subject, Keywords, Creator, Producer, and date fields as needed.' },
  { icon: Download,title: 'Download Updated PDF',  desc: 'Click "Apply Metadata" and download your PDF with the updated document information instantly.' },
];

const RELATED = [
  { id: 'watermark',    title: 'Watermark PDF',  description: 'Stamp a text or image watermark over every page of your PDF.',                    icon: Stamp,   gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)',  tag: 'Edit' },
  { id: 'page-numbers', title: 'Page Numbers',   description: 'Add professional page numbers to your PDF automatically.',                         icon: Hash,    gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Edit' },
  { id: 'protect',      title: 'Protect PDF',    description: 'Encrypt your PDF with a password to keep it secure.',                              icon: Lock,    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
  { id: 'unlock',       title: 'Unlock PDF',     description: 'Remove password protection from a PDF and restore full access.',                   icon: Unlock,  gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Security' },
  { id: 'compress',     title: 'Compress PDF',   description: 'Reduce PDF file size while keeping quality sharp and text crisp.',                 icon: Zap,     gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Optimize' },
  { id: 'merge',        title: 'Merge PDF',      description: 'Combine multiple PDF files into one document in the order you choose.',            icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize' },
];

export default function MetadataPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <EditTools id="metadata" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-slate-600 dark:text-slate-400" size={24} />
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
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-slate-600 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-slate-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
