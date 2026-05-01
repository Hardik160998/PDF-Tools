"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Zap, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

const LEVELS = [
  { id: 'low',    label: 'Low',    desc: 'Max quality, minimal size reduction.',   quality: 0.92, scale: 1.5 },
  { id: 'medium', label: 'Medium', desc: 'Balanced quality and file size.',         quality: 0.75, scale: 1.2 },
  { id: 'high',   label: 'High',   desc: 'Smallest size, some quality reduction.', quality: 0.55, scale: 1.0 },
];

const FEATURES = [
  { icon: '🖼️', title: 'Image Compression',  desc: 'Re-encodes page images at your chosen quality level.' },
  { icon: '⚡', title: 'Fast Processing',     desc: 'Runs entirely in your browser — no upload needed.' },
  { icon: '📉', title: 'Smaller File Size',   desc: 'Reduce PDF size for email, web, or storage.' },
  { icon: '🔒', title: '100% Private',        desc: 'Your file never leaves your device.' },
];

const FAQS = [
  { q: 'How does PDF optimization work?',
    a: 'Each page is rendered to a canvas and re-encoded as a compressed JPEG image, then assembled into a new PDF. This reduces file size by compressing image data.' },
  { q: 'Will text still be selectable after optimization?',
    a: 'Since pages are converted to images, text will no longer be selectable. Use Low compression to preserve the best visual quality.' },
  { q: 'What is the difference between Optimize and Compress?',
    a: 'Compress PDF uses pdf-lib\'s built-in compression on the existing content. Optimize PDF re-renders each page as an image, which can achieve greater size reductions for image-heavy PDFs.' },
  { q: 'Is my file safe?',
    a: 'Yes. Everything runs in your browser using PDF.js and pdf-lib. Your file is never uploaded to any server.' },
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

export default function OptimizePdf({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; origSize: number; newSize: number } | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f); setResult(null);
    try {
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      setPageCount(pdf.numPages);
    } catch { setPageCount(0); }
  };

  const handleOptimize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const cfg = LEVELS.find(l => l.id === level)!;
      const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: cfg.scale });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp, canvas }).promise;
        const jpgBytes = await fetch(canvas.toDataURL('image/jpeg', cfg.quality)).then(r => r.arrayBuffer());
        const jpgImage = await outDoc.embedJpg(jpgBytes);
        const origVp = page.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([origVp.width, origVp.height]);
        outPage.drawImage(jpgImage, { x: 0, y: 0, width: origVp.width, height: origVp.height });
      }
      const bytes = await outDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), origSize: file.size, newSize: blob.size });
    } catch (err) { console.error(err); alert('Error optimizing PDF.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); };
  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;
  const saved = result ? Math.round((1 - result.newSize / result.origSize) * 100) : 0;

  return (
    <div className="py-6 sm:py-10 space-y-6">

      {/* ── TOOL CARD ── */}
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-green-500 text-white shadow-lg shadow-green-500/30">
            <Zap size={36} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Optimize PDF</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
            Reduce PDF file size by re-compressing page content. Choose your quality level. 100% private — runs in your browser.
          </p>
        </div>

        {result ? (
          <div className="space-y-6 text-center animate-in zoom-in duration-500">
            <div className="inline-flex p-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Optimization Complete!</h3>
              <p className="text-slate-500 font-medium mt-1">{pageCount} pages processed</p>
            </div>
            {/* Size comparison */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Original</p>
                <p className="font-black text-slate-900 dark:text-white text-sm mt-1">{fmt(result.origSize)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Saved</p>
                <p className="font-black text-green-600 text-sm mt-1">{saved}%</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">New Size</p>
                <p className="font-black text-slate-900 dark:text-white text-sm mt-1">{fmt(result.newSize)}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={result.url} download={`optimized_${file?.name || 'document.pdf'}`}
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download Optimized PDF
              </a>
              <button onClick={reset} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Optimize Another
              </button>
            </div>
          </div>

        ) : !file ? (
          <div className="space-y-6">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-green-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
              onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
              <div className="space-y-4 pointer-events-none text-center">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-green-500 group-hover:scale-110 transition-transform">
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
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-green-500"><FileText size={20} /></div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[220px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{pageCount} pages · {fmt(file.size)}</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>

            {/* Compression level */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-900 dark:text-white">Optimization Level</p>
              <div className="grid grid-cols-3 gap-3">
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => setLevel(l.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${level === l.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:border-green-300'}`}>
                    <p className={`font-black text-sm ${level === l.id ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>{l.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleOptimize} disabled={processing}
              className="w-full py-4 sm:py-5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all">
              {processing ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
              {processing ? `Optimizing ${pageCount} pages...` : 'Optimize PDF'}
            </button>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">How to Optimize a PDF</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { n: '1', t: 'Upload your PDF',        d: 'Select any PDF file you want to reduce in size.' },
            { n: '2', t: 'Choose quality level',   d: 'Pick Low, Medium or High compression based on your needs.' },
            { n: '3', t: 'Download optimized PDF', d: 'Get a smaller PDF ready for sharing, email or storage.' },
          ].map(s => (
            <div key={s.n} className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="w-9 h-9 rounded-full bg-green-500 text-white font-black text-sm flex items-center justify-center shrink-0">{s.n}</div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{s.t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-2">{FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}</div>
      </div>

      {/* ── RELATED TOOLS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Related PDF Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'compress',     label: 'Compress PDF',  color: '#22c55e', desc: 'Built-in PDF compression.' },
            { id: 'flatten-pdf',  label: 'Flatten PDF',   color: '#7c3aed', desc: 'Merge all layers.' },
            { id: 'repair-pdf',   label: 'Repair PDF',    color: '#22c55e', desc: 'Fix corrupted PDFs.' },
            { id: 'delete-pages', label: 'Delete Pages',  color: '#f26522', desc: 'Remove unwanted pages.' },
            { id: 'split',        label: 'Split PDF',     color: '#f26522', desc: 'Split into smaller files.' },
            { id: 'merge',        label: 'Merge PDF',     color: '#f26522', desc: 'Combine multiple PDFs.' },
          ].map(t => (
            <a key={t.id} href={`/tool/${t.id}`}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-green-300 hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: t.color }}>
                <Zap size={16} />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 dark:text-white text-xs group-hover:text-green-600 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
