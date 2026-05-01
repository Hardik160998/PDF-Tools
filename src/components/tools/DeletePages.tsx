"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setLoading(true);
    setFile(f);
    setSelected(new Set());
    setResult(null);
    try {
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp, canvas }).promise;
        pages.push(canvas.toDataURL('image/jpeg', 0.7));
      }
      setThumbs(pages);
    } catch { alert('Could not read PDF.'); setFile(null); }
    finally { setLoading(false); }
  };

  const toggle = (i: number) => setSelected(prev => {
    const s = new Set(prev);
    s.has(i) ? s.delete(i) : s.add(i);
    return s;
  });

  const selectAll = () => setSelected(new Set(thumbs.map((_, i) => i)));
  const clearAll = () => setSelected(new Set());

  const handleDelete = async () => {
    if (!file || selected.size === 0) return;
    if (selected.size === thumbs.length) { alert('Cannot delete all pages.'); return; }
    setProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const keep = pdf.getPageIndices().filter(i => !selected.has(i));
      const out = await PDFDocument.create();
      const copied = await out.copyPages(pdf, keep);
      copied.forEach(p => out.addPage(p));
      const bytes = await out.save();
      setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch { alert('Error deleting pages.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setThumbs([]); setSelected(new Set()); setResult(null); };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-red-500 text-white shadow-lg shadow-red-500/30">
            <Trash2 size={36} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Delete PDF Pages</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Select pages to remove, then download the cleaned PDF.</p>
        </div>

        {result ? (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="inline-flex p-6 rounded-full bg-green-50 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Done!</h3>
              <p className="text-slate-500 font-medium mt-1">{selected.size} page{selected.size > 1 ? 's' : ''} deleted · {thumbs.length - selected.size} page{thumbs.length - selected.size > 1 ? 's' : ''} remaining</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={result} download={`deleted_${file?.name || 'pages.pdf'}`}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download PDF
              </a>
              <button onClick={reset} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Start Over
              </button>
            </div>
          </div>
        ) : !file ? (
          <div
            className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-red-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <div className="space-y-4 pointer-events-none">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-red-500 group-hover:scale-110 transition-transform">
                <Upload size={36} />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Select PDF File</div>
              <p className="text-sm text-slate-500">or drop PDF here</p>
            </div>
          </div>
        ) : loading ? (
          <div className="py-16 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 size={40} className="animate-spin text-red-500" />
            <p className="font-bold">Loading pages...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* File info + controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-red-500"><FileText size={18} /></div>
                <div className="text-left">
                  <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{thumbs.length} pages total</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={selectAll} className="text-xs font-black px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">Select All</button>
                <button onClick={clearAll} className="text-xs font-black px-3 py-1.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-all">Clear</button>
                <button onClick={reset} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* Selection info */}
            {selected.size > 0 && (
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                <Trash2 size={14} className="text-red-500" />
                <span className="text-sm font-black text-red-600 dark:text-red-400">{selected.size} page{selected.size > 1 ? 's' : ''} selected for deletion</span>
              </div>
            )}

            {/* Page thumbnails grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {thumbs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    selected.has(i)
                      ? 'border-red-500 shadow-lg shadow-red-500/20 scale-95'
                      : 'border-slate-200 dark:border-slate-600 hover:border-red-300'
                  }`}
                >
                  <img src={src} alt={`Page ${i + 1}`} className="w-full aspect-[3/4] object-cover" />
                  {/* Overlay when selected */}
                  {selected.has(i) && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                      <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
                        <X size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                  {/* Page number */}
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selected.has(i) ? 'bg-red-500 text-white' : 'bg-black/50 text-white'
                  }`}>
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              disabled={processing || selected.size === 0}
              className="w-full py-4 sm:py-5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all"
            >
              {processing ? <Loader2 className="animate-spin" size={24} /> : <Trash2 size={24} />}
              {processing ? 'Deleting...' : selected.size === 0 ? 'Select pages to delete' : `Delete ${selected.size} Page${selected.size > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
