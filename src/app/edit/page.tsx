"use client";
import { PenLine, Stamp, FileDigit, Settings, EyeOff, Bookmark, Layers, CheckCircle } from 'lucide-react';
import EditTools from '@/components/tools/EditTools';

const RELATED_TOOLS = [
  { id: 'watermark',    title: 'Watermark PDF',  description: 'Stamp a text or image watermark over every page of your PDF.',        icon: Stamp,    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Edit' },
  { id: 'page-numbers', title: 'Page Numbers',   description: 'Add professional page numbers to any position on your PDF pages.',    icon: FileDigit,gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Edit' },
  { id: 'metadata',     title: 'Edit Metadata',  description: 'Update Author, Title, Subject and other document metadata fields.',   icon: Settings, gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)',tag: 'Edit' },
  { id: 'redact-pdf',   title: 'Redact PDF',     description: 'Permanently black out sensitive text and images from your PDF.',      icon: EyeOff,   gradient: 'linear-gradient(135deg, #e53e3e, #7f1d1d)', shadow: 'rgba(229,62,62,0.3)',  tag: 'Security' },
  { id: 'bookmark-pdf', title: 'Bookmark PDF',   description: 'Add clickable bookmarks and a table of contents to your PDF.',        icon: Bookmark, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Edit' },
  { id: 'flatten-pdf',  title: 'Flatten PDF',    description: 'Flatten form fields and annotations into the PDF page content.',      icon: Layers,   gradient: 'linear-gradient(135deg, #0ea5e9, #0369a1)', shadow: 'rgba(14,165,233,0.3)', tag: 'Edit' },
];

const FEATURES = [
  'Add text & image watermarks',
  'Insert page numbers',
  'Edit document metadata',
  'Flatten form fields',
  'Bookmark navigation',
  '100% private — runs in browser',
];

export default function EditPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <EditTools id="edit-pdf" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {FEATURES.slice(0, 3).map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="text-pink-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{f}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Professional PDF editing tool to {f.toLowerCase()} directly in your browser.</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELATED_TOOLS.map((tool) => (
            <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{tool.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-pink-500 transition-colors">{tool.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-pink-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
