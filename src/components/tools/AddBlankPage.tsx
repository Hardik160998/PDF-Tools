"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, FilePlus, FileText, CheckCircle2, ChevronDown, Plus, Minus, Settings } from 'lucide-react';
import { PDFDocument, PageSizes } from 'pdf-lib';

const PAGE_SIZES = [
  { label: 'Match PDF',    value: 'same' },
  { label: 'A4 Standard',  value: 'a4' },
  { label: 'US Letter',    value: 'letter' },
  { label: 'A3 Poster',    value: 'a3' },
];

export default function AddBlankPage({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<'beginning' | 'end' | 'after' | 'after-every'>('end');
  const [afterPage, setAfterPage] = useState(1);
  const [blankCount, setBlankCount] = useState(1);
  const [pageSize, setPageSize] = useState('same');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#6366f1";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#6366f1,#4f46e5)";

  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f); setResult(null);
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(pdf.getPageCount());
      setAfterPage(pdf.getPageCount());
    } catch { setPageCount(0); }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  const getBlankDims = (pdf: PDFDocument): [number, number] => {
    if (pageSize === 'a4')     return [PageSizes.A4[0], PageSizes.A4[1]];
    if (pageSize === 'letter') return [PageSizes.Letter[0], PageSizes.Letter[1]];
    if (pageSize === 'a3')     return [PageSizes.A3[0], PageSizes.A3[1]];
    const first = pdf.getPage(0);
    const { width, height } = first.getSize();
    return [width, height];
  };

  const handleAdd = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const dims = getBlankDims(pdf);
      const total = pdf.getPageCount();

      const addBlanks = (doc: PDFDocument, insertAt: number) => {
        for (let i = 0; i < blankCount; i++) {
          const blank = doc.insertPage(insertAt + i, dims);
          blank.drawRectangle({ x: 0, y: 0, width: dims[0], height: dims[1], color: { red: 1, green: 1, blue: 1, type: 'RGB' as any } });
        }
      };

      if (position === 'beginning') {
        addBlanks(pdf, 0);
      } else if (position === 'end') {
        for (let i = 0; i < blankCount; i++) pdf.addPage(dims);
      } else if (position === 'after') {
        const idx = Math.min(Math.max(afterPage, 1), total);
        addBlanks(pdf, idx);
      } else if (position === 'after-every') {
        for (let i = total - 1; i >= 0; i--) {
          for (let j = 0; j < blankCount; j++) {
            pdf.insertPage(i + 1 + j, dims);
          }
        }
      }

      const bytes = await pdf.save();
      setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch (err) { console.error(err); alert('Error adding blank pages.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Settings Sidebar */}
        <div className={`w-full lg:w-[300px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0`}>
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-medium text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Page Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="font-outfit hidden lg:block text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter text-left">Configuration</h3>
            
            <div className="space-y-6 text-left">
              {/* Position */}
              <div className="space-y-3">
                <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Insertion Point</span>
                <div className="grid grid-cols-1 gap-2">
                  {([
                    { val: 'beginning',  label: 'At Beginning' },
                    { val: 'end',        label: 'At End' },
                    { val: 'after',      label: 'After Specific Page' },
                    { val: 'after-every',label: 'After Every Page' },
                  ] as const).map(p => (
                    <button key={p.val} onClick={() => setPosition(p.val)} disabled={!file}
                      className={`py-2.5 px-4 rounded-xl border-2 font-outfit text-[11px] font-medium transition-all text-left ${position === p.val ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* After Page Input */}
              {position === 'after' && (
                <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                  <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Target Page</span>
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                    <button onClick={() => setAfterPage(p => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-600"><Minus size={14} /></button>
                    <span className="font-outfit font-medium text-slate-900 dark:text-white text-xs uppercase tracking-tight">{afterPage} <span className="text-[10px] text-slate-400">/ {pageCount}</span></span>
                    <button onClick={() => setAfterPage(p => Math.min(pageCount, p + 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-600"><Plus size={14} /></button>
                  </div>
                </div>
              )}

              {/* Page Count */}
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Number of Pages</span>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                  <button onClick={() => setBlankCount(c => Math.max(1, c - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-600"><Minus size={14} /></button>
                  <span className="font-outfit font-medium text-slate-900 dark:text-white text-xs uppercase tracking-tight">{blankCount} {blankCount === 1 ? 'Page' : 'Pages'}</span>
                  <button onClick={() => setBlankCount(c => Math.min(10, c + 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-600"><Plus size={14} /></button>
                </div>
              </div>

              {/* Page Size */}
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Dimensions</span>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_SIZES.map(s => (
                    <button key={s.value} onClick={() => setPageSize(s.value)} disabled={!file}
                      className={`py-2 px-1 rounded-lg border-2 font-outfit text-[11px] font-medium transition-all ${pageSize === s.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl min-h-[500px] flex flex-col w-full">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-indigo-500/20" style={{ background: ACCENT_GRADIENT }}>
              <FilePlus size={32} />
            </div>
            <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add Blank Pages</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Expand your PDF by inserting high-quality blank templates.</p>
          </div>

          {!file && !processing && (
            <div
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 sm:p-20 hover:border-indigo-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 group"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-lg sm:text-lg sm:text-xl font-medium text-slate-800 dark:text-white mb-1">Drop PDF to expand</div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Perfect for notes, printing, or spacers</p>
              <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-medium uppercase tracking-widest shadow-xl hover:scale-105 transition-all" style={{ background: ACCENT_GRADIENT }}>
                Choose PDF
              </button>
            </div>
          )}

          {file && !result && (
            <div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
              {/* File Info Card */}
              <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-xl border border-slate-50 dark:border-slate-700"><FileText size={32} /></div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-xl truncate">{file.name}</p>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Current Document: {pageCount} Pages</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="min-w-0 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1 truncate">New Total</p>
                    <p className="text-base sm:text-2xl font-medium text-slate-900 dark:text-white tracking-widest truncate">
                      {position === 'after-every' ? pageCount * blankCount + pageCount : pageCount + blankCount}
                    </p>
                  </div>
                  <div className="min-w-0 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1 truncate">Page Size</p>
                    <p className="text-[13px] sm:text-2xl font-medium text-slate-900 dark:text-white uppercase tracking-widest truncate">
                      {pageSize === 'same' ? 'Matched' : pageSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    Will insert {blankCount} {blankCount === 1 ? 'page' : 'pages'} {position === 'beginning' ? 'at the very start' : position === 'end' ? 'at the very end' : position === 'after' ? `after page ${afterPage}` : 'after every single page'}.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleAdd} disabled={processing}
                  className="flex-1 py-5 text-white rounded-[1.5rem] text-lg sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Adding Pages...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Process &amp; Update <FilePlus size={24} /></span>
                  )}
                </button>
                <button onClick={reset} className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-lg hover:shadow-red-500/10"><X size={28} /></button>
              </div>
            </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in fade-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative p-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 shadow-2xl border border-green-100 dark:border-green-500/20">
                  <CheckCircle2 size={80} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Document Updated!</h3>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">
                  {blankCount} blank page{blankCount !== 1 ? 's' : ''} added successfully
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                  href={result}
                  download={`blank_added_${file!.name}`}
                  className="flex-1 py-5 text-white rounded-2xl text-lg sm:text-xl font-medium shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-indigo-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  <Download size={24} /> Download PDF
                </a>
                <button
                  onClick={reset}
                  className="px-8 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-medium uppercase tracking-widest text-xs transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



