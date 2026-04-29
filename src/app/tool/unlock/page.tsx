"use client";

import dynamic from 'next/dynamic';
import { Unlock, Upload, KeyRound, Download, Lock, Stamp, Hash, Settings, PenLine, Combine, CheckCircle } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';

const SecurityTools = dynamic(() => import('@/components/tools/SecurityTools'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 max-w-7xl"><CenteredCardSkeleton accent="rgb(254 202 202)" /></div>,
});

const FEATURES = [
  'Removes password protection',
  'Restores full PDF access',
  'Works on owner-locked PDFs',
  'Powered by cloud engine',
  'Files deleted within 1 hour',
  'Encrypted HTTPS transfer',
];

const STEPS = [
  { icon: Upload, title: 'Upload Locked PDF', desc: 'Select the password-protected PDF you own. It is securely uploaded over HTTPS to our unlock engine.' },
  { icon: KeyRound, title: 'Enter the Password', desc: 'Type the current password for the PDF. You must know the password — this tool removes protection from PDFs you own.' },
  { icon: Download, title: 'Download Unlocked PDF', desc: 'Click "Unlock PDF" and download your password-free PDF instantly. Your file is deleted within 1 hour.' },
];

const RELATED_TOOLS = [
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to control who can open it.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
  { id: 'watermark', title: 'Watermark PDF', description: 'Stamp a text or image watermark over every page of your PDF.', icon: Stamp, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Edit' },
  { id: 'page-numbers', title: 'Page Numbers', description: 'Add professional page numbers to your PDF automatically.', icon: Hash, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Edit' },
  { id: 'metadata', title: 'Edit Metadata', description: 'Add or update Author, Title, Subject and other document metadata fields.', icon: Settings, gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)', tag: 'Edit' },
  { id: 'esign', title: 'E-Sign PDF', description: 'Draw or type your signature and place it anywhere on a PDF instantly.', icon: PenLine, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'rgba(139,92,246,0.3)', tag: 'Sign' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize' },
];

export default function UnlockPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed33 0%, #fff0 50%, #ffedd533 100%)' }}>
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Unlock size={13} /> Free PDF Unlock Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Unlock Password-Protected PDF{' '}
            <span style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Remove password protection from any PDF you own. Enter the current password, unlock it, and download a fully accessible PDF — free to use however you need.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-orange-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="container mx-auto px-4 max-w-7xl"><SecurityTools id="unlock" /></div></section>

      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-orange-50 text-orange-500 mb-4"><step.icon size={28} /></div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Security &amp; Edit Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED_TOOLS.map((tool) => (
              <a key={tool.id} href={tool.id === 'esign' ? '/esign' : `/tool/${tool.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}><tool.icon size={26} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{tool.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
