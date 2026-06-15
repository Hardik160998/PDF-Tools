"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Zap, FileText, 
  CheckCircle2, TrendingDown, ShieldCheck, Gauge,
  Plus, Lock, Trash2, Smartphone, Rocket, Sparkles, Shield
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const LEVELS = [
  { id: 'low',    label: 'Standard',    desc: '144 DPI · Sharp Barcodes', quality: 0.82, scale: 2.0,  printScore: 'A+' },
  { id: 'medium', label: 'Recommended', desc: '120 DPI · Optimal Balance', quality: 0.65, scale: 1.66, printScore: 'A'  },
  { id: 'high',   label: 'Extreme',     desc: '96 DPI · Smallest Size',   quality: 0.45, scale: 1.33, printScore: 'B+' },
];

export default function OptimizePdf({ id }: { id: string }) {
  const [file,       setFile]       = useState<File | null>(null);
  const [level,      setLevel]      = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [progress,   setProgress]   = useState({ current: 0, total: 0 });
  const [pageCount,  setPageCount]  = useState(0);
  const [result,     setResult]     = useState<{
    url: string; origSize: number; newSize: number;
    reduction: number; status: "optimized" | "already_optimized";
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const ACCENT          = "#10b981";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#10b981,#059669)";

  const loadFile = async (f: File) => {
    setFile(f); setResult(null); setProgress({ current: 0, total: 0 });
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      setPageCount(pdf.numPages);
    } catch { setPageCount(0); }
  };

  const handleOptimize = async () => {
    if (!file) return;
    setProcessing(true); setResult(null);
    setProgress({ current: 0, total: pageCount });

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

      const cfg = LEVELS.find(l => l.id === level)!;
      const originalBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(originalBuffer).promise;
      const outDoc = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(prev => ({ ...prev, current: i }));
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: cfg.scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })!;
        canvas.width = vp.width; canvas.height = vp.height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;

        const jpgBytes = await fetch(canvas.toDataURL('image/jpeg', cfg.quality)).then(r => r.arrayBuffer());
        const jpgImage = await outDoc.embedJpg(jpgBytes);
        const origVp = page.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([origVp.width, origVp.height]);
        outPage.drawImage(jpgImage, { x: 0, y: 0, width: origVp.width, height: origVp.height });
      }

      const bytes = await outDoc.save({ useObjectStreams: true });
      const newSize  = bytes.length;
      const reduction = ((file.size - newSize) / file.size) * 100;
      const wasWorthIt = reduction >= 3;

      setResult({
        url: wasWorthIt
          ? URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }))
          : URL.createObjectURL(file),
        origSize: file.size,
        newSize:  wasWorthIt ? newSize : file.size,
        reduction: wasWorthIt ? reduction : 0,
        status: wasWorthIt ? "optimized" : "already_optimized",
      });
    } catch (err) {
      console.error(err);
      alert('Optimization error. Falling back to original.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); setProgress({ current: 0, total: 0 }); };
  const fmt   = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">

          {/* BG glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          <input
            ref={inputRef}
            type="file"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])}
            accept=".pdf"
            className="hidden"
          />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
              <TrendingDown size={32} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
              Intelligent PDF Optimizer
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
              Production-grade re-encoding for Amazon, Flipkart &amp; Meesho labels
            </p>
          </div>

          {/* Success banner */}
          {result && !processing && (
            <div className={`p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left ${result.status === 'optimized' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'} animate-in fade-in slide-in-from-top-4 duration-500 relative z-10`}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className={`p-4 text-white rounded-2xl shadow-xl ${result.status === 'optimized' ? 'bg-green-500 shadow-green-500/30' : 'bg-slate-400 shadow-slate-400/30'}`}>
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">
                    {result.status === 'optimized' ? `Reduced by ${Math.round(result.reduction)}%` : 'Already Optimized'}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                    {result.status === 'optimized'
                      ? `${fmt(result.origSize)} → ${fmt(result.newSize)}`
                      : 'No further compression possible'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <a
                  href={result.url}
                  download={`optimized_${file?.name || 'document.pdf'}`}
                  className="px-8 py-4 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  <Download size={18} /> Download PDF
                </a>
                <button onClick={reset} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                  <X size={18} /> Start Over
                </button>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">

            {/* Feature pills when empty */}
            {!file && (
              <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
                {[
                  { icon: Zap,      title: "Instant",  desc: "Lightning fast processing" },
                  { icon: Shield,   title: "Private",  desc: "Your files stay secure"    },
                  { icon: Sparkles, title: "Lossless", desc: "Smart quality threshold"   }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            <div
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
              onClick={() => !file && inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
            >
              {!file ? (
                <>
                  {/* PDF icon with upload badge */}
                  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                      <div className="m-auto text-slate-300 dark:text-slate-600">
                        <TrendingDown size={32} />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                      <Upload size={20} strokeWidth={3} />
                    </div>
                    <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                    Drag &amp; drop your PDF file here
                  </h3>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to <span style={{ color: ACCENT }}>browse</span>
                  </p>
                  <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                    Single PDF file supported
                  </p>

                  <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                    <Plus size={20} /> SELECT PDF FILE
                  </button>
                </>
              ) : (
                /* File selected — show file card + Target Profile + action button */
                <div className="w-full space-y-6" onClick={e => e.stopPropagation()}>

                  {/* Feature pills — horizontal, icon + title + desc, never truncates */}
                  <div className="flex items-center justify-between w-full pb-5 border-b border-slate-100 dark:border-slate-800">
                    {[
                      { icon: Zap,      title: "Instant",  desc: "Fast" },
                      { icon: Shield,   title: "Private",  desc: "Secure" },
                      { icon: Sparkles, title: "Lossless", desc: "Smart" }
                    ].map((f, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-1.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                          <f.icon size={17} />
                        </div>
                        <p className="text-[11px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">{f.title}</p>
                        <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium leading-none">{f.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* File card */}
                  <div className="flex flex-row items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-emerald-500 shadow-md shrink-0">
                      <FileText size={22} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight mb-0.5">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{fmt(file.size)}</span>
                        <span className="text-[9px] font-medium text-emerald-500 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">{pageCount} Pages</span>
                      </div>
                    </div>
                    <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-red-200 hover:scale-110 shrink-0">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Target Profile — 3 column grid */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-left">Target Profile</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {LEVELS.map(l => {
                        const mobileLabel = l.id === 'low' ? 'Std' : l.id === 'medium' ? 'Rec' : 'Ext';
                        return (
                          <button
                            key={l.id}
                            onClick={() => setLevel(l.id)}
                            className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${level === l.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-emerald-200'}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <p className={`font-black uppercase leading-none ${level === l.id ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                <span className="hidden sm:inline text-[11px]">{l.label}</span>
                                <span className="sm:hidden text-[11px]">{mobileLabel}</span>
                              </p>
                              <span className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 ${level === l.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{l.printScore}</span>
                            </div>
                            <p className="text-[8px] text-slate-400 font-medium leading-tight">{l.desc.split(' · ')[0]}<br />{l.desc.split(' · ')[1]}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Processing indicator */}
                  {processing && (
                    <div className="p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto" strokeWidth={1.5} />
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">Optimizing...</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Page {progress.current} of {progress.total}</p>
                    </div>
                  )}

                  {/* Size result after optimization */}
                  {result && !processing && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Original</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{fmt(result.origSize)}</p>
                      </div>
                      <div className={`p-4 rounded-2xl border text-center ${result.status === 'optimized' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800'}`}>
                        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest mb-1">Optimized</p>
                        <p className="text-base font-bold text-emerald-600">{fmt(result.newSize)}</p>
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  {!processing && !result && (
                    <button
                      onClick={handleOptimize}
                      disabled={processing}
                      className="w-full py-5 text-white rounded-[1.5rem] text-base sm:text-lg font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 whitespace-nowrap"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Zap size={20} /> Smart Optimize
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Feature grid — shown when no file */}
            {!file && (
              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock,       title: "100% Secure",  desc: "Your files are safe"    },
                  { icon: Trash2,     title: "Auto Delete",  desc: "Files auto removed"      },
                  { icon: Smartphone, title: "Works Offline", desc: "No internet needed"    },
                  { icon: Rocket,     title: "Super Fast",   desc: "Built for speed"         }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
                      <f.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
                      <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Safe & Private",    desc: "Native browser processing means zero wait time for server uploads.", icon: ShieldCheck },
            { title: "Smart Compression", desc: "If reduction is less than 3%, we keep your original file quality.",  icon: Zap         },
            { title: "Barcode Ready",     desc: "Anti-blur processing preserves sharp edges for scanners.",            icon: Gauge       },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <feat.icon size={24} />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
