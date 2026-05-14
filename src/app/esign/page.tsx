"use client";
import { Stamp, FileDigit, Settings, Lock, Unlock, PenLine, ShieldCheck, FileSignature } from 'lucide-react';
import ESignTool from '@/components/tools/ESignTool';

const ESIGN_TOOLS = [
  { id: 'watermark',    title: 'Watermark PDF',  description: 'Stamp a text or image watermark over your PDF. Set transparency, position, and typography.', icon: Stamp, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Sign & Mark' },
  { id: 'page-numbers', title: 'Page Numbers',   description: 'Add professional page numbers to your PDF. Choose position, size, and font style.',          icon: FileDigit,gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Annotate' },
  { id: 'metadata',     title: 'Edit Metadata',  description: 'Add or update Author, Title, Subject and other document metadata fields.',                  icon: Settings, gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)',tag: 'Document Info' },
  { id: 'protect',      title: 'Protect PDF',    description: 'Encrypt your PDF with a password. Control who can open, print, or edit your document.',      icon: Lock,     gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
  { id: 'unlock',       title: 'Unlock PDF',     description: 'Remove password protection from your PDF and restore full access to your document.',        icon: Unlock,   gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Security' },
];

const STEPS = [
  { icon: FileSignature, title: 'Upload Document', desc: 'Select the PDF or image you want to sign.' },
  { icon: PenLine,       title: 'Create Signature', desc: 'Draw or type your signature in your style.' },
  { icon: ShieldCheck,   title: 'Download Signed',  desc: 'Place it anywhere and download instantly.' },
];

export default function ESignPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <ESignTool id="esign" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ESIGN_TOOLS.map((tool) => (
            <a key={tool.id} href={`/tool/${tool.id}`} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{tool.tag}</span>
              </div>
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">{tool.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tool.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-purple-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
