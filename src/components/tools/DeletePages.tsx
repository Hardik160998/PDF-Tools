"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, X, Trash2, FileText, CheckCircle2, Settings, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function DeletePages({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#ef4444";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#ef4444,#b91c1c)";

  const loadFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    setLoading(true);
    setFile(f);
    setSelected(new Set());
    setResult(null);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

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
    } catch { 
      alert('Could not read PDF.'); 
      setFile(null); 
    } finally { 
      setLoading(false); 
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
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
    } catch { 
      alert('Error deleting pages.'); 
    } finally { 
      setProcessing(false); 
    }
  };

  const reset = () => { 
    setFile(null); 
    setThumbs([]); 
    setSelected(new Set()); 
    setResult(null); 
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Settings Sidebar */}
        <div className={`w-full lg:w-[280px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0`}>
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter text-left">Removal Settings</h3>
            
            <div className="space-y-6 text-left">
              {/* Quick Selection */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Selection Controls</span>
                <div className="flex flex-col gap-2">
                  <button onClick={selectAll} disabled={!file} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors">
                    <Eye size={14} /> Select All
                  </button>
                  <button onClick={clearAll} disabled={!file} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors">
                    <EyeOff size={14} /> Deselect All
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <p className="font-outfit text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-[10px] text-red-500 font-bold uppercase leading-tight">
                  {selected.size} page{selected.size !== 1 ? 's' : ''} marked for removal
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-700 text-left">
                <p className="font-outfit text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Info</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight uppercase tracking-widest">100% Client-side reconstruction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl min-h-[500px] flex flex-col w-full relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-red-500/20" style={{ background: ACCENT_GRADIENT }}>
              <Trash2 size={32} />
            </div>
            <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Delete PDF Pages</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Pick pages to discard and download the trimmed document instantly.</p>
          </div>

          {!file && !loading && (
            <div
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 sm:p-20 hover:border-red-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 group relative z-10"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-red-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-lg sm:text-lg sm:text-xl font-black text-slate-800 dark:text-white mb-1">Select PDF to clean</div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Fast, visual page removal</p>
              <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all" style={{ background: ACCENT_GRADIENT }}>
                Choose Document
              </button>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 size={64} className="animate-spin text-red-500" />
                <Trash2 className="absolute inset-0 m-auto text-red-500/20" size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Pages...</p>
            </div>
          )}

          {!loading && thumbs.length > 0 && !result && (
            <div className="space-y-8 flex-1 flex flex-col relative z-10">
              {/* File bar */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-red-500 shadow-sm"><FileText size={20} /></div>
                  <div className="truncate text-left">
                    <p className="font-black text-slate-900 dark:text-white text-sm truncate">{file?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{thumbs.length} Pages Loaded</p>
                  </div>
                </div>
                <button onClick={reset} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><X size={20} /></button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar p-1">
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all group shadow-sm ${selected.has(i) ? "border-red-500 ring-4 ring-red-500/20 scale-[0.95] grayscale-[0.5]" : "border-slate-100 dark:border-slate-700 hover:border-red-200"}`}
                  >
                    <img src={src} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-all ${selected.has(i) ? "bg-red-500/20" : "bg-transparent group-hover:bg-red-500/5"}`} />
                    
                    {/* Delete badge */}
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${selected.has(i) ? "bg-red-500 border-red-500 scale-110" : "bg-white/90 border-slate-200"}`}>
                      {selected.has(i) && <X size={14} className="text-white" />}
                    </div>

                    {/* Page Number Label */}
                    <div className={`absolute bottom-3 left-3 px-3 py-1 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/20 tracking-widest ${selected.has(i) ? 'bg-red-600' : 'bg-black/60'}`}>
                      PAGE {i + 1}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Action */}
              <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-700">
                <button
                  onClick={handleDelete}
                  disabled={processing || selected.size === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-lg sm:text-xl font-black shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest shadow-red-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Purging Content...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      {selected.size === 0 ? 'Mark pages to delete' : `Delete ${selected.size} Selected`} <Trash2 size={24} />
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in fade-in duration-500 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative p-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 shadow-2xl border border-green-100 dark:border-green-500/20">
                  <CheckCircle2 size={80} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Cleanup Complete</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                  {selected.size} page{selected.size !== 1 ? 's' : ''} removed successfully
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                  href={result}
                  download={`deleted_${file!.name}`}
                  className="flex-1 py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-red-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  <Download size={24} /> Download PDF
                </a>
                <button
                  onClick={reset}
                  className="px-8 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
