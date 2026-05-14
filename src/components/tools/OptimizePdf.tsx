"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Zap, FileText, 
  CheckCircle2, ChevronDown, Settings, ShieldCheck,
  TrendingDown, Gauge
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const LEVELS = [
  { id: 'low',    label: 'Low',    desc: 'Max quality, minimal size reduction.',   quality: 0.92, scale: 1.5 },
  { id: 'medium', label: 'Medium', desc: 'Balanced quality and file size.',         quality: 0.75, scale: 1.2 },
  { id: 'high',   label: 'High',   desc: 'Smallest size, some quality reduction.', quality: 0.55, scale: 1.0 },
];

export default function OptimizePdf({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; origSize: number; newSize: number } | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#10b981"; // Emerald
  const ACCENT_GRADIENT = "linear-gradient(135deg,#10b981,#059669)";

  const loadFile = async (f: File) => {
    setFile(f); setResult(null);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      setPageCount(pdf.numPages);
    } catch { setPageCount(0); }
  };

  const handleOptimize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Quality Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Optimization</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Clear</button>
            </div>

            <div className="space-y-6 text-left">
              {/* Level selection */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compression Level</span>
                <div className="space-y-2">
                  {LEVELS.map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${level === l.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-emerald-200'}`}>
                      <div className="flex items-center justify-between relative z-10">
                        <p className={`font-black text-xs uppercase tracking-tighter ${level === l.id ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{l.label}</p>
                        {level === l.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 leading-relaxed relative z-10 uppercase tracking-widest">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Section */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-emerald-500">
                      <Gauge size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase text-left">
                    {file ? `${pageCount} Pages Loaded` : 'No file selected'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!result ? (
                  <button
                    onClick={handleOptimize}
                    disabled={processing || !file}
                    className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-emerald-500/20"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Optimizing...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">Run Optimizer <Zap size={24} /></span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center animate-in zoom-in">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Efficiency Score</p>
                      <p className="text-3xl font-black text-emerald-600 tracking-tighter">-{saved}%</p>
                    </div>
                    <a
                      href={result.url}
                      download={`optimized_${file?.name || 'document.pdf'}`}
                      className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter shadow-emerald-500/20"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Download size={24} /> Download PDF
                    </a>
                    <button onClick={reset} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Optimize Another</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10 text-left sm:text-center">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
                <Zap size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                High-Fidelity PDF Optimizer
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto uppercase text-xs">
                Re-compress page images to achieve massive file size reductions without sacrificing legibility.
              </p>
            </div>

            {/* Upload Area */}
            {!file ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-emerald-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => inputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-emerald-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Select Large PDF
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Secure local re-encoding stream
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose File
                </button>
                <input ref={inputRef} type="file" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                {/* File Info Card */}
                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                   <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
                      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shrink-0 group-hover:rotate-12 transition-transform">
                        <FileText size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">{file.name}</h4>
                         <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">{fmt(file.size)}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">{pageCount} Pages Loaded</span>
                         </div>
                      </div>
                      <button onClick={reset} className="p-3 text-slate-300 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                        <X size={24} />
                      </button>
                   </div>
                   {/* Background icon decoration */}
                   <Zap size={120} className="absolute -bottom-10 -right-10 text-slate-200/20 dark:text-slate-700/20 -rotate-12 pointer-events-none" />
                </div>

                {/* Processing Visualization */}
                {processing && (
                  <div className="p-10 text-center space-y-6">
                    <div className="relative inline-block">
                       <Loader2 size={80} className="animate-spin text-emerald-500 mx-auto" strokeWidth={1} />
                       <Gauge className="absolute inset-0 m-auto text-emerald-500/20" size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter animate-pulse">Rendering Pixel Buffers...</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">Processing every page through our local JPEG pipeline</p>
                    </div>
                  </div>
                )}

                {/* Post-Process stats */}
                {result && !processing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                     <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <TrendingDown size={24} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Volume</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{fmt(result.origSize)}</p>
                     </div>
                     <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center">
                        <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Optimized Volume</p>
                        <p className="text-xl font-black text-emerald-600 tracking-tighter">{fmt(result.newSize)}</p>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Local Privacy", desc: "No data is sent to servers. Everything stays on your machine.", icon: ShieldCheck },
              { title: "Smart Compression", desc: "Adaptive JPEG re-encoding balances quality and size.", icon: Gauge },
              { title: "Fast Delivery", desc: "Optimized documents are ready for email instantly.", icon: Zap },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
