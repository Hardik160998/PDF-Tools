"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, Download, Loader2, X, FileText, ScanText, 
  CheckCircle2, AlertCircle, Globe, Settings,
  ChevronDown, Zap, ShieldCheck, Search
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "por", label: "Portuguese" },
  { code: "ita", label: "Italian" },
  { code: "rus", label: "Russian" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "jpn", label: "Japanese" },
  { code: "ara", label: "Arabic" },
];

async function createOcrWorker(lang: string): Promise<Tesseract.Worker> {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return Tesseract.createWorker(lang as any, 1, {
    workerPath: `${base}/workers/worker.min.js`,
    workerBlobURL: false,
    corePath: `${base}/workers/tesseract-core`,
    langPath: `${base}/workers`,
    cacheMethod: "write",
    gzip: false,
    legacyLang: false,
  });
}

type FileStatus = "pending" | "processing" | "done" | "error";
interface PdfFile {
  id: string;
  file: File;
  numPages: number;
  thumbs: string[];
  status: FileStatus;
  progress: number;
  errorMsg?: string;
  resultBlob?: Blob;
}

export default function OcrPdf({ id: _id }: { id: string }) {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [language, setLanguage] = useState("eng");
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const ACCENT = "#3b82f6"; // Blue
  const ACCENT_GRADIENT = "linear-gradient(135deg,#3b82f6,#2563eb)";

  const renderPageThumb = async (pdfJs: any, pageNum: number): Promise<string> => {
    const page = await pdfJs.getPage(pageNum);
    const vp = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const reset = () => {
    abortRef.current = true;
    setPdfFiles([]);
    setProcessing(false);
    setAllDone(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => { abortRef.current = false; }, 100);
  };

  const addFiles = async (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) return;
    setAllDone(false);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

      const entries: PdfFile[] = await Promise.all(pdfs.map(async (file) => {
        const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
        try {
          const buf = await file.arrayBuffer();
          const pdfJs = await pdfjsLib.getDocument({ data: buf }).promise;
          const numPages = pdfJs.numPages;
          const thumbCount = Math.min(numPages, 4);
          const thumbs = await Promise.all(
            Array.from({ length: thumbCount }, (_, i) => renderPageThumb(pdfJs, i + 1))
          );
          return { id, file, numPages, thumbs, status: "pending" as FileStatus, progress: 0 };
        } catch {
          return { id, file, numPages: 0, thumbs: [], status: "error" as FileStatus, progress: 0, errorMsg: "Failed to read PDF" };
        }
      }));

      setPdfFiles(prev => [...prev, ...entries]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFile = (id: string) => setPdfFiles(prev => prev.filter(f => f.id !== id));

  const runOcr = useCallback(async () => {
    const pending = pdfFiles.filter(f => f.status === "pending");
    if (!pending.length) return;
    setProcessing(true); setAllDone(false);
    abortRef.current = false;

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

      for (const entry of pending) {
        if (abortRef.current) break;

        setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "processing", progress: 0 } : f));

        let ocrWorker: Tesseract.Worker | null = null;
        try {
          ocrWorker = await createOcrWorker(language);
          const buf = await entry.file.arrayBuffer();
          const pdfJs = await pdfjsLib.getDocument({ data: buf }).promise;
          const numPages = pdfJs.numPages;

          const pagePdfChunks: Uint8Array[] = [];

          for (let i = 1; i <= numPages; i++) {
            if (abortRef.current) break;

            const pdfPage = await pdfJs.getPage(i);
            const vp2x = pdfPage.getViewport({ scale: 2 });
            const w = Math.floor(vp2x.width), h = Math.floor(vp2x.height);

            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
            await pdfPage.render({ canvasContext: ctx, viewport: vp2x, background: "rgb(255,255,255)" }).promise;

            const { data } = await ocrWorker.recognize(canvas, {}, { pdf: true });
            const pdfData = (data as any).pdf as Uint8Array | null;

            if (pdfData && pdfData.length > 0) {
              pagePdfChunks.push(pdfData);
            }

            setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, progress: Math.round((i / numPages) * 100) } : f));
          }

          await ocrWorker.terminate();

          if (!abortRef.current && pagePdfChunks.length > 0) {
            const mergedDoc = await PDFDocument.create();
            for (const chunk of pagePdfChunks) {
              const pageDoc = await PDFDocument.load(chunk);
              const [copiedPage] = await mergedDoc.copyPages(pageDoc, [0]);
              mergedDoc.addPage(copiedPage);
            }
            const mergedBytes = await mergedDoc.save();
            const resultBlob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "done", progress: 100, resultBlob } : f));
          }
        } catch (err: any) {
          if (ocrWorker) { try { await ocrWorker.terminate(); } catch { } }
          const msg = err?.message ?? String(err);
          setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "error", errorMsg: msg } : f));
        }
      }
    } catch (err) {
      console.error(err);
    }

    setProcessing(false);
    setAllDone(true);
  }, [pdfFiles, language]);

  const handleDownload = (entry: PdfFile) => {
    if (!entry.resultBlob) return;
    const url = URL.createObjectURL(entry.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.file.name.replace(/\.pdf$/i, "_ocr.pdf");
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    pdfFiles.filter(f => f.status === "done").forEach(f => handleDownload(f));
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> OCR Options</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Configuration</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6">
              {/* Language Selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Recognition Language</span>
                <div className="relative">
                   <select
                     value={language}
                     onChange={e => setLanguage(e.target.value)}
                     disabled={processing}
                     className="w-full text-sm font-black text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                   >
                     {LANGUAGES.map(l => (
                       <option key={l.code} value={l.code}>{l.label}</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Status Section */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-blue-500">
                      <Search size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Status</span>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 italic uppercase">
                       {pdfFiles.length === 0 ? 'Queue Empty' : `${pdfFiles.length} Documents`}
                     </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!allDone ? (
                  <button
                    onClick={runOcr}
                    disabled={processing || pdfFiles.length === 0}
                    className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter italic shadow-blue-500/20"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> OCR Active...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">Start OCR <Zap size={24} /></span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={downloadAll}
                      className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter italic shadow-blue-500/20"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Download size={24} /> Download All
                    </button>
                    <button onClick={reset} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Start Over</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10 text-left sm:text-center">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
                <ScanText size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">
                Optical Character Recognition
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto italic uppercase text-xs">
                Transform scanned PDF documents into fully searchable text layers using local Tesseract engine.
              </p>
            </div>

            {/* Content Area */}
            {pdfFiles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-blue-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-blue-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Select Scanned PDF
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold italic tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Native browser OCR · No cloud upload
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
                <input ref={fileInputRef} type="file" multiple onChange={e => e.target.files && addFiles(Array.from(e.target.files))} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar p-1">
                 <AnimatePresence>
                   {pdfFiles.map((f) => (
                     <motion.div
                       key={f.id}
                       layout
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0.9, opacity: 0 }}
                       className={`relative rounded-[2rem] border-2 transition-all overflow-hidden ${f.status === 'done' ? 'border-green-500/50 bg-green-50/10' : f.status === 'error' ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30'}`}
                     >
                       {/* Thumbnail Strip */}
                       <div className="flex gap-1 p-3 bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-slate-700 overflow-x-auto scrollbar-hide">
                         {f.thumbs.map((thumb, i) => (
                           <img key={i} src={thumb} className="h-20 w-auto rounded-lg object-cover shadow-sm border border-slate-100 dark:border-slate-700 shrink-0" alt="Preview" />
                         ))}
                         {f.numPages > 4 && (
                           <div className="h-20 w-12 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                             +{f.numPages - 4}
                           </div>
                         )}
                       </div>

                       {/* Progress / Status Overlay */}
                       {f.status === 'processing' && (
                         <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 pt-24">
                            <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden mb-2">
                               <motion.div 
                                 className="h-full bg-blue-500"
                                 initial={{ width: 0 }}
                                 animate={{ width: `${f.progress}%` }}
                               />
                            </div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{f.progress}% ANALYZED</span>
                         </div>
                       )}

                       {/* File Details */}
                       <div className="p-5 flex items-center gap-4 relative z-20">
                          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                             <FileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate italic">{f.file.name}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{f.numPages} Pages · {(f.file.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <div className="flex gap-2">
                             {f.status === 'done' && (
                                <button onClick={() => handleDownload(f)} className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform">
                                   <Download size={14} />
                                </button>
                             )}
                             {!processing && f.status !== 'done' && (
                                <button onClick={() => removeFile(f.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                   <X size={18} />
                                </button>
                             )}
                          </div>
                       </div>

                       {/* Error Message */}
                       {f.status === 'error' && (
                         <div className="px-5 pb-5 flex items-center gap-2 text-red-500">
                            <AlertCircle size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{f.errorMsg || 'Process failed'}</span>
                         </div>
                       )}
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Multi-Language", desc: "Native support for English, Spanish, Japanese, and 10+ major languages.", icon: Globe },
              { title: "Native Search", desc: "Injects a proper invisible text layer into your reconstructed PDF.", icon: Search },
              { title: "Total Privacy", desc: "OCR engine runs inside your browser sandbox. No server processing.", icon: ShieldCheck },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
