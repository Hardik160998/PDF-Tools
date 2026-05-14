"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, X, FileText, CheckCircle2, Loader2, Layers, Eye, EyeOff, Settings, ChevronDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";

type PageEntry = { pageNum: number; thumb: string; selected: boolean };

export default function ExtractPages({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; count: number } | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#f26522";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#f26522,#c2410c)";

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".pdf")) return;
    setFile(f);
    setResult(null);
    setRangeInput("");
    setRangeError("");
    setLoading(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const entries: PageEntry[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i);
        const vp = pg.getViewport({ scale: 0.25 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await pg.render({ canvasContext: canvas.getContext("2d")!, canvas, viewport: vp }).promise;
        entries.push({ pageNum: i, thumb: canvas.toDataURL(), selected: false });
      }
      setPages(entries);
    } catch (err) {
      console.error(err);
      alert("Error reading PDF.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  const togglePage = (i: number) =>
    setPages(prev => prev.map((p, idx) => idx === i ? { ...p, selected: !p.selected } : p));

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  const applyRange = () => {
    if (!rangeInput.trim()) { setRangeError("Enter a page range."); return; }
    const total = pages.length;
    const selected = new Set<number>();
    const parts = rangeInput.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (/^\d+$/.test(trimmed)) {
        const n = parseInt(trimmed);
        if (n < 1 || n > total) { setRangeError(`Page ${n} out of range (1–${total}).`); return; }
        selected.add(n);
      } else if (/^\d+-\d+$/.test(trimmed)) {
        const [a, b] = trimmed.split("-").map(Number);
        if (a < 1 || b > total || a > b) { setRangeError(`Range ${trimmed} is invalid.`); return; }
        for (let x = a; x <= b; x++) selected.add(x);
      } else {
        setRangeError(`Invalid format: "${trimmed}". Use e.g. 1,3,5-8`);
        return;
      }
    }
    setRangeError("");
    setPages(prev => prev.map(p => ({ ...p, selected: selected.has(p.pageNum) })));
  };

  const selectedPages = pages.filter(p => p.selected);

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) return;
    setProcessing(true);
    try {
      const buf = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buf);
      const newDoc = await PDFDocument.create();
      const indices = selectedPages.map(p => p.pageNum - 1);
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach(p => newDoc.addPage(p));
      const bytes = await newDoc.save();
      const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setResult({ url, count: selectedPages.length });
    } catch {
      alert("Error extracting pages.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setResult(null);
    setRangeInput("");
    setRangeError("");
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Settings Sidebar */}
        <div className={`w-full lg:w-[280px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0`}>
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight text-left">Extraction Settings</h3>
            
            <div className="space-y-6 text-left">
              {/* Range Input */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select by Range</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={e => { setRangeInput(e.target.value); setRangeError(""); }}
                    placeholder={`e.g. 1,3,5-8`}
                    disabled={!file}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-orange-500 transition-colors"
                  />
                  <button 
                    onClick={applyRange} 
                    disabled={!file}
                    className="w-full py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    Apply Range
                  </button>
                  {rangeError && <p className="text-[10px] text-red-500 font-bold">{rangeError}</p>}
                </div>
              </div>

              {/* Quick Selection */}
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Selection</span>
                <div className="flex gap-2">
                  <button onClick={selectAll} disabled={!file} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors">
                    <Eye size={14} /> All
                  </button>
                  <button onClick={deselectAll} disabled={!file} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors">
                    <EyeOff size={14} /> None
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  {selectedPages.length} of {pages.length || 0} pages selected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl min-h-[500px] flex flex-col w-full">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
              <Layers size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Extract PDF Pages</h2>
            {!file && <p className="text-slate-500 font-medium tracking-tight">Select specific pages to create a new PDF document.</p>}
          </div>

          {!file && !loading && (
            <div
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 sm:p-20 hover:border-orange-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 group"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center">Drop your PDF here</div>
              <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center">Visual page extraction made simple</p>
              <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all" style={{ background: ACCENT_GRADIENT }}>
                Choose File
              </button>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 size={64} className="animate-spin text-orange-500" />
                <Layers className="absolute inset-0 m-auto text-orange-500/20" size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Document...</p>
            </div>
          )}

          {!loading && pages.length > 0 && !result && (
            <div className="space-y-8 flex-1 flex flex-col">
              {/* File bar */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm"><FileText size={20} /></div>
                  <div className="truncate">
                    <p className="font-black text-slate-900 dark:text-white text-sm truncate">{file?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pages.length} Pages Found</p>
                  </div>
                </div>
                <button onClick={reset} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><X size={20} /></button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar p-1">
                {pages.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => togglePage(i)}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all group shadow-sm ${p.selected ? "border-orange-500 ring-4 ring-orange-500/20 scale-[1.02]" : "border-slate-100 dark:border-slate-700 hover:border-orange-200"}`}
                  >
                    <img src={p.thumb} alt={`Page ${p.pageNum}`} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-all ${p.selected ? "bg-orange-500/10" : "bg-transparent group-hover:bg-orange-500/5"}`} />
                    
                    {/* Checkbox badge */}
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${p.selected ? "bg-orange-500 border-orange-500 scale-110" : "bg-white/90 border-slate-200"}`}>
                      {p.selected && <CheckCircle2 size={14} className="text-white" />}
                    </div>

                    {/* Page Number Label */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/20 tracking-tighter">
                      PAGE {p.pageNum}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Action */}
              <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-700">
                <button
                  onClick={handleExtract}
                  disabled={processing || selectedPages.length === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-orange-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Finalizing PDF...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Extract {selectedPages.length} {selectedPages.length === 1 ? 'Page' : 'Pages'} <Download size={24} />
                    </span>
                  )}
                </button>
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
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Extraction Ready!</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                  {result.count} high-quality page{result.count !== 1 ? "s" : ""} isolated
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                  href={result.url}
                  download={`extracted_${file!.name}`}
                  className="flex-1 py-5 text-white rounded-2xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter shadow-orange-500/20"
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
