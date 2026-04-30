"use client";
import dynamic from 'next/dynamic';
import { FileText, Upload, Sparkles, Download, FileSpreadsheet, Presentation, Type, ImageIcon, Lock, CheckCircle, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { CenteredCardSkeleton } from '../[id]/skeletons';
import { HowItWorksShimmer, RelatedToolsShimmer, usePageMounted } from '../_shimmer';

const OfficeTools = dynamic(() => import('@/components/tools/OfficeTools'), { ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(191 219 254)" /> });

const FEATURES = ['Converts PDF to editable DOCX', 'Preserves layout & formatting', 'Tables and images retained', 'Fast cloud conversion', 'Files deleted within 1 hour', 'Encrypted HTTPS transfer'];

const STEPS = [
  { icon: Upload,   title: 'Upload Your PDF',  desc: 'Select your PDF file. It is securely uploaded over HTTPS to our cloud conversion engine.' },
  { icon: Sparkles, title: 'Convert to DOCX',  desc: 'Our engine analyses the PDF structure and recreates it as an editable DOCX with high fidelity.' },
  { icon: Download, title: 'Download DOCX',    desc: 'Your Word file is ready to download and edit. The uploaded PDF is permanently deleted within 1 hour.' },
];

const ANALYSIS = [
  { icon: Zap,     title: 'High Accuracy',       desc: 'Advanced OCR and layout analysis ensures text, tables, and images are faithfully reproduced in DOCX.' },
  { icon: Shield,  title: '100% Secure',          desc: 'Files are transferred over HTTPS and permanently deleted from our servers within 1 hour of conversion.' },
  { icon: FileText,title: 'Fully Editable',       desc: 'The output DOCX opens in Microsoft Word, Google Docs, LibreOffice, and any other Word-compatible editor.' },
  { icon: Globe,   title: 'Works Everywhere',     desc: 'No software to install. Works on any device — Windows, Mac, Linux, iOS, or Android.' },
];

const RELATED = [
  { id: 'docx-to-pdf',  title: 'DOCX to PDF',        description: 'Convert Word documents back to PDF with perfect formatting.',                    icon: FileText,        gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'word-to-pdf',  title: 'Word to PDF',         description: 'Convert DOCX files to PDF with all formatting perfectly preserved.',             icon: FileText,        gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'pdf-to-excel', title: 'PDF to Excel',        description: 'Extract tables from your PDF into an editable XLSX spreadsheet.',               icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)',   tag: 'Convert' },
  { id: 'pdf-to-ppt',   title: 'PDF to PowerPoint',   description: 'Convert your PDF into an editable PPTX presentation file.',                     icon: Presentation,    gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)',  tag: 'Convert' },
  { id: 'extract-text', title: 'PDF to Text',         description: 'Extract all text content from your PDF into a clean plain-text format.',         icon: Type,            gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)',  tag: 'Convert' },
  { id: 'protect',      title: 'Protect PDF',         description: 'Encrypt your PDF with a password to keep it secure.',                           icon: Lock,            gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)',   tag: 'Security' },
];

const WHY_CONVERT = [
  { q: 'Why convert PDF to DOCX?',         a: 'PDFs are not easily editable. Converting to DOCX lets you update text, reformat content, and repurpose documents in Word or Google Docs.' },
  { q: 'Will my formatting be preserved?', a: 'Yes. Our engine analyses the PDF layout and recreates fonts, tables, images, and paragraph styles in the DOCX output with high fidelity.' },
  { q: 'Is my file safe?',                 a: 'Absolutely. Files are uploaded over encrypted HTTPS and permanently deleted from our servers within 1 hour of conversion.' },
  { q: 'What if my PDF is scanned?',       a: 'Scanned PDFs (image-based) may have reduced accuracy. For best results use PDFs with selectable text.' },
];

export default function PdfToDocxPage() {
  const mounted = usePageMounted();
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #eff6ff33 0%, #fff0 50%, #dbeafe33 100%)' }}>

      {/* ── HERO ── */}
      <section className="pt-16 pb-8 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <FileText size={13} /> Free PDF to DOCX Converter
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Convert PDF to DOCX{' '}
            <span style={{ background: 'linear-gradient(135deg, #3182ce, #1e3a8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Editable Word
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Convert any PDF into a fully editable DOCX file. Formatting, tables, and images are preserved with high accuracy — ready to edit in Microsoft Word or Google Docs.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {FEATURES.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle size={12} className="text-blue-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <OfficeTools id="pdf-to-word" />
        </div>
      </section>

      {/* ── ANALYSIS CARDS ── */}
      {mounted && (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 text-center uppercase">Why Use Our PDF to DOCX Converter?</h2>
            <p className="text-sm text-slate-500 text-center mb-10 font-medium">Everything you need for a perfect conversion, every time.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ANALYSIS.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-3">
                  <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-500">
                    <item.icon size={26} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      {!mounted ? <HowItWorksShimmer accent="rgba(59,130,246,0.15)" /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-500 mb-4"><s.icon size={28} /></div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ / ANALYSIS ── */}
      {mounted && (
        <section className="py-16 bg-white/60">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center uppercase">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {WHY_CONVERT.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <ArrowRight size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 mb-1">{item.q}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED TOOLS ── */}
      {!mounted ? <RelatedToolsShimmer /> : (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">More Convert Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED.map(t => (
                <a key={t.id} href={`/tool/${t.id}`} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}><t.icon size={26} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{t.tag}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">{t.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool &#8594;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
