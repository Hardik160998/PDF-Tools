"use client";

import dynamic from 'next/dynamic';
import { Stamp, FileDigit, Settings, Lock, Unlock, PenLine, ShieldCheck, FileSignature, CheckCircle } from 'lucide-react';

const ESignTool = dynamic(() => import('@/components/tools/ESignTool'), {
  ssr: false,
  loading: () => (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-2xl flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm font-bold">Loading E-Sign Tool…</p>
        </div>
      </div>
    </div>
  ),
});

const ESIGN_TOOLS = [
  {
    id: 'watermark',
    title: 'Watermark PDF',
    description: 'Stamp a text or image watermark over your PDF. Set transparency, position, and typography.',
    icon: Stamp,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    shadow: 'rgba(139,92,246,0.3)',
    tag: 'Sign & Mark',
  },
  {
    id: 'page-numbers',
    title: 'Page Numbers',
    description: 'Add professional page numbers to your PDF. Choose position, size, and font style.',
    icon: FileDigit,
    gradient: 'linear-gradient(135deg, #6366f1, #4338ca)',
    shadow: 'rgba(99,102,241,0.3)',
    tag: 'Annotate',
  },
  {
    id: 'metadata',
    title: 'Edit Metadata',
    description: 'Add or update Author, Title, Subject and other document metadata fields.',
    icon: Settings,
    gradient: 'linear-gradient(135deg, #64748b, #334155)',
    shadow: 'rgba(100,116,139,0.3)',
    tag: 'Document Info',
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    description: 'Encrypt your PDF with a password. Control who can open, print, or edit your document.',
    icon: Lock,
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    shadow: 'rgba(239,68,68,0.3)',
    tag: 'Security',
  },
  {
    id: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove password protection from your PDF and restore full access to your document.',
    icon: Unlock,
    gradient: 'linear-gradient(135deg, #f97316, #c2410c)',
    shadow: 'rgba(249,115,22,0.3)',
    tag: 'Security',
  },
];

const STEPS = [
  { icon: FileSignature, title: 'Upload Document', desc: 'Select the PDF or image you want to sign.' },
  { icon: PenLine,       title: 'Create Signature', desc: 'Draw or type your signature in your style.' },
  { icon: ShieldCheck,   title: 'Download Signed',  desc: 'Place it anywhere and download instantly.' },
];

const FEATURES = [
  'Draw or type your signature',
  'Place anywhere on the document',
  'Drag, resize & reposition freely',
  'Supports PDF & image files',
  'Download as signed PDF',
  '100% private — no uploads to server',
];

export default function ESignPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3e8ff33 0%, #fff0 50%, #fce7f333 100%)' }}>

      {/* ── HERO ── */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <PenLine size={13} />
            Free E-Signature Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Sign Documents{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Instantly
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Upload any PDF or image, draw or type your signature, place it anywhere on the document, and download the signed file — all in your browser.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-purple-500" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── E-SIGN TOOL ── */}
      <section className="pb-8">
        <ESignTool />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-white/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-purple-50 text-purple-600 mb-4">
                  <step.icon size={28} />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER TOOLS ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">
            More Signing &amp; Security Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ESIGN_TOOLS.map((tool) => (
              <a
                key={tool.id}
                href={`/tool/${tool.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: tool.gradient, boxShadow: `0 8px 20px -4px ${tool.shadow}` }}
                  >
                    <tool.icon size={26} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-purple-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool &#8594;
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
