"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Layers, FileText, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const FEATURES = [
  { icon: '📝', title: 'Flatten Forms',       desc: 'Form fields become static text — no more editable inputs.' },
  { icon: '💬', title: 'Flatten Annotations', desc: 'Comments, highlights and stamps are baked into the page.' },
  { icon: '🔒', title: 'Lock Content',        desc: 'Prevents further editing of interactive elements.' },
  { icon: '🖨️', title: 'Print-Ready',         desc: 'Ensures consistent output across all printers and viewers.' },
];

const STEPS = [
  { n: '1', title: 'Upload your PDF',     desc: 'Select any PDF with forms, annotations or interactive layers.' },
  { n: '2', title: 'Click Flatten PDF',   desc: 'Each page is rendered and rebuilt as a flat image-based page.' },
  { n: '3', title: 'Download the result', desc: 'Get a clean, non-editable PDF ready for sharing or printing.' },
];

const FAQS = [
  { q: 'What does flattening a PDF mean?',
    a: 'Flattening merges all interactive elements — form fields, annotations, signatures, and layers — permanently into the page content. The result is a static PDF that looks identical but cannot be edited.' },
  { q: 'Will flattening reduce file quality?',
    a: 'Pages are rendered at 2× resolution before being embedded, so visual quality is preserved. Text may no longer be selectable since it becomes part of the image.' },
  { q: 'Is my file uploaded to a server?',
    a: 'No. Everything runs entirely in your browser using PDF.js and pdf-lib. Your file never leaves your device.' },
  { q: 'When should I flatten a PDF?',
    a: 'Before printing to avoid rendering issues, before sharing to prevent form editing, or before archiving to ensure the document looks the same in every viewer.' },
];

const RELATED = [
  { id: 'compress',     label: 'Compress PDF',  color: '#22c55e', desc: 'Reduce PDF file size.' },
  { id: 'protect',      label: 'Protect PDF',   color: '#e53e3e', desc: 'Add password protection.' },
  { id: 'redact-pdf',   label: 'Redact PDF',    color: '#e53e3e', desc: 'Permanently hide content.' },
  { id: 'watermark',    label: 'Watermark PDF', color: '#E8465D', desc: 'Stamp text or image.' },
  { id: 'metadata',     label: 'Edit Metadata', color: '#E8465D', desc: 'Change PDF properties.' },
  { id: 'delete-pages', label: 'Delete Pages',  color: '#f26522', desc: 'Remove unwanted pages.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <span className="font-black text-sm text-slate-900 dark:text-white pr-4">{q}</span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800">{a}</div>}
    </div>
  );
}

export default function FlattenPdf({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f); setResult(null);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      setPageCount(pdf.numPages);
    } catch { setPageCount(0); }
  };

  const handleFlatten = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp, canvas }).promise;
        const jpgBytes = await fetch(canvas.toDataURL('image/jpeg', 0.92)).then(r => r.arrayBuffer());
        const jpgImage = await outDoc.embedJpg(jpgBytes);
        const origVp = page.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([origVp.width, origVp.height]);
        outPage.drawImage(jpgImage, { x: 0, y: 0, width: origVp.width, height: origVp.height });
      }
      const bytes = await outDoc.save();
      setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch (err) { console.error(err); alert('Error flattening PDF.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); };

  return (
    <div className="py-6 sm:py-10 space-y-6">

      {/* ── TOOL CARD ── */}
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-violet-600 text-white shadow-lg shadow-violet-500/30">
            <Layers size={36} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Flatten PDF</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
            Merge all layers, forms and annotations into a single flat, non-editable PDF. 100% private — runs in your browser.
          </p>
        </div>

        {result ? (
          <div className="space-y-6 text-center animate-in zoom-in duration-500">
            <div className="inline-flex p-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">PDF Flattened!</h3>
              <p className="text-slate-500 font-medium mt-1">{pageCount} page{pageCount !== 1 ? 's' : ''} · all layers merged</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={result} download={`flattened_${file?.name || 'document.pdf'}`}
                className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download Flattened PDF
              </a>
              <button onClick={reset} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Flatten Another
              </button>
            </div>
          </div>

        ) : !file ? (
          <div className="space-y-6">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-violet-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
              onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
              <div className="space-y-4 pointer-events-none text-center">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-violet-600 group-hover:scale-110 transition-transform">
                  <Upload size={36} />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Select PDF File</div>
                <p className="text-sm text-slate-500">or drop PDF here</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FEATURES.map(f => (
                <div key={f.title} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 text-left space-y-2">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{f.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-violet-600"><FileText size={20} /></div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[220px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800 flex items-start gap-3">
              <ShieldCheck size={18} className="text-violet-600 shrink-0 mt-0.5" />
              <p className="text-sm text-violet-700 dark:text-violet-300 font-medium">
                All form fields, annotations, and interactive layers will be permanently merged into flat page content. This cannot be undone.
              </p>
            </div>
            <button onClick={handleFlatten} disabled={processing}
              className="w-full py-4 sm:py-5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3 transition-all">
              {processing ? <Loader2 className="animate-spin" size={24} /> : <Layers size={24} />}
              {processing ? `Flattening ${pageCount} pages...` : 'Flatten PDF'}
            </button>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">How to Flatten a PDF</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center shrink-0">{s.n}</div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{s.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHEN TO USE ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">When Should You Flatten a PDF?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🖨️', t: 'Before Printing',      d: 'Avoid rendering differences between printers and PDF viewers.' },
            { icon: '📤', t: 'Before Sharing',        d: 'Prevent recipients from editing form fields or removing annotations.' },
            { icon: '✍️', t: 'After Signing',         d: 'Lock digital signatures so they cannot be removed or altered.' },
            { icon: '🗄️', t: 'For Archiving',         d: 'Ensure the document renders identically in any future viewer.' },
            { icon: '🔐', t: 'For Compliance',        d: 'Some regulatory formats require flat, non-interactive PDFs.' },
            { icon: '📧', t: 'For Email Attachments', d: 'Reduce compatibility issues when sending to clients or colleagues.' },
          ].map(item => (
            <div key={item.t} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{item.t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* ── RELATED TOOLS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Related PDF Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RELATED.map(t => (
            <a key={t.id} href={`/tool/${t.id}`}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: t.color }}>
                <Layers size={16} />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 dark:text-white text-xs group-hover:text-violet-600 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
