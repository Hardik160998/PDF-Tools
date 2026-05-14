"use client";
import { Lock, Upload, KeyRound, Download, Unlock, Stamp, Hash, Settings, PenLine, Combine } from 'lucide-react';
import SecurityTools from '@/components/tools/SecurityTools';

const STEPS = [
  { icon: Upload,   title: 'Upload Your PDF',        desc: 'Select the PDF you want to protect. It is securely uploaded over HTTPS to our encryption engine.' },
  { icon: KeyRound, title: 'Set a Password',         desc: 'Enter a strong password. Anyone who tries to open the PDF will need this password to access it.' },
  { icon: Download, title: 'Download Protected PDF', desc: 'Click "Add Password" and download your encrypted PDF instantly. Your file is deleted within 1 hour.' },
];

const RELATED = [
  { id: 'unlock',       title: 'Unlock PDF',     description: 'Remove password protection from a PDF you own and restore full access.',           icon: Unlock,   gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Security', href: '/tool/unlock'       },
  { id: 'watermark',    title: 'Watermark PDF',  description: 'Stamp a text or image watermark over every page of your PDF.',                     icon: Stamp,    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)',  tag: 'Edit',     href: '/tool/watermark'    },
  { id: 'page-numbers', title: 'Page Numbers',   description: 'Add professional page numbers to your PDF automatically.',                          icon: Hash,     gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)',  tag: 'Edit',     href: '/tool/page-numbers' },
  { id: 'metadata',     title: 'Edit Metadata',  description: 'Add or update Author, Title, Subject and other document metadata fields.',          icon: Settings, gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)',tag: 'Edit',     href: '/tool/metadata'     },
  { id: 'esign',        title: 'E-Sign PDF',     description: 'Draw or type your signature and place it anywhere on a PDF instantly.',             icon: PenLine,  gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'rgba(139,92,246,0.3)',  tag: 'Sign',     href: '/esign'             },
  { id: 'merge',        title: 'Merge PDF',      description: 'Combine multiple PDF files into one document in the order you choose.',             icon: Combine,  gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)',  tag: 'Organize', href: '/tool/merge'        },
];

export default function ProtectPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <SecurityTools id="protect" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-red-500" size={24} />
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
              <div><h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">{t.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p></div>
              <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
