"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, Download, Loader2, X, FileText, ScanText,
  CheckCircle2, AlertCircle, Globe, ShieldCheck, Search,
  Plus, Lock, Trash2, Smartphone, Rocket, Zap, RefreshCw,
  ChevronDown
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import { useCredits } from "@/hooks/useCredits";
import OutOfCreditsModal from "@/components/credits/OutOfCreditsModal";

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
  return Tesseract.createWorker(lang as any);
}

type FileStatus = "pending" | "processing" | "done" | "error";
interface PdfFile {
  id: string;
  file: File;
  numPages: number;
  status: FileStatus;
  progress: number;
  errorMsg?: string;
  resultBlob?: Blob;
}

export default function OcrPdf({ id: _id }: { id: string }) {
  const { remaining, isGuest, isPremium, deductCredit } = useCredits();
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [language, setLanguage] = useState("eng");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const ACCENT = "#3b82f6";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#3b82f6,#2563eb)";

  const reset = () => {
    abortRef.current = true;
    setPdfFiles([]); setProcessing(false); setAllDone(false);
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
          return { id, file, numPages: pdfJs.numPages, status: "pending" as FileStatus, progress: 0 };
        } catch {
          return { id, file, numPages: 0, status: "error" as FileStatus, progress: 0, errorMsg: "Failed to read PDF" };
        }
      }));
      setPdfFiles(prev => [...prev, ...entries]);
    } catch (err) { console.error(err); }
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
            await pdfPage.render({ canvasContext: ctx, viewport: vp2x, background: "rgb(255,255,255)", canvas }).promise;
            const { data } = await ocrWorker.recognize(canvas, {}, { pdf: true });
            const pdfData = (data as any).pdf as Uint8Array | null;
            if (pdfData && pdfData.length > 0) pagePdfChunks.push(pdfData);
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
          setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "error", errorMsg: err?.message ?? String(err) } : f));
        }
      }
    } catch (err) { console.error(err); }
    setProcessing(false); setAllDone(true);
  }, [pdfFiles, language]);

  const handleDownload = (entry: PdfFile) => {
    if (!entry.resultBlob) return;
    if (!isPremium && remaining <= 0) { setOutOfCreditsOpen(true); return; }
    deductCredit("ocr-pdf");
    const url = URL.createObjectURL(entry.resultBlob);
    const a = document.createElement("a");
    a.href = url; a.download = entry.file.name.replace(/\.pdf$/i, "_ocr.pdf");
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const downloadAll = () => pdfFiles.filter(f => f.status === "done").forEach(f => handleDownload(f));
  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <OutOfCreditsModal isOpen={outOfCreditsOpen} onClose={() => setOutOfCreditsOpen(false)} isGuest={isGuest} />

      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">

          {/* BG glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={e => e.target.files && addFiles(Array.from(e.target.files))}
            accept=".pdf"
            className="hidden"
          />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
              <ScanText size={32} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
              Optical Character Recognition
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
              Transform scanned PDFs into searchable text — runs entirely in your browser
            </p>
          </div>

          {/* Success banner */}
          {allDone && pdfFiles.some(f => f.status === "done") && (
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">OCR Complete!</h2>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Text layer has been embedded in your PDFs</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button onClick={downloadAll} className="px-8 py-4 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto" style={{ background: ACCENT_GRADIENT }}>
                  <Download size={18} /> Download All
                </button>
                <button onClick={reset} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                  <RefreshCw size={18} /> Start Over
                </button>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">

            {/* Feature pills — shown when no files */}
            {pdfFiles.length === 0 && (
              <div className="hidden sm:flex items-center justify-center gap-6 w-full mb-6">
                {[
                  { icon: Zap, title: "Instant", desc: "Browser-native processing" },
                  { icon: ShieldCheck, title: "Private", desc: "No server upload needed" },
                  { icon: Globe, title: "10+ Langs", desc: "Multi-language support" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            <div
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
              onClick={() => {
                if (pdfFiles.length > 0) return;
                if (!isPremium && remaining <= 0) { setOutOfCreditsOpen(true); return; }
                fileInputRef.current?.click();
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }}
            >
              {pdfFiles.length === 0 ? (
                <>
                  {/* PDF icon with upload badge */}
                  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                      <div className="m-auto text-slate-300 dark:text-slate-600"><ScanText size={32} /></div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                      <Upload size={20} strokeWidth={3} />
                    </div>
                    <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                    Drag &amp; drop your PDF files here
                  </h3>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to <span style={{ color: ACCENT }}>browse</span>
                  </p>
                  <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                    Supports single or multiple PDF files
                  </p>
                  <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                    <Plus size={20} /> SELECT PDF FILES
                  </button>
                </>
              ) : (
                /* Files loaded — language selector + file list + actions */
                <div className="w-full space-y-5" onClick={e => e.stopPropagation()}>

                  {/* Language selector row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                        <Globe size={16} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Language</span>
                    </div>
                    <div className="relative flex-1 w-full sm:w-auto">
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        disabled={processing}
                        className="w-full text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 pr-10"
                      >
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Feature pill cards — always visible after upload */}
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {[
                      { icon: Zap, title: "Instant", desc: "In your browser" },
                      { icon: ShieldCheck, title: "Private", desc: "No server upload" },
                      { icon: Globe, title: "10+ Langs", desc: "Multi-language" }
                    ].map((f, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                          <f.icon size={16} />
                        </div>
                        <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-none">{f.title}</p>
                        <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium leading-none">{f.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* File list */}
                  <div className="space-y-3">
                    {pdfFiles.map(f => (
                      <div key={f.id} className={`flex flex-row items-center justify-between p-4 rounded-2xl border gap-3 group relative overflow-hidden transition-all ${f.status === 'done' ? 'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20' : f.status === 'error' ? 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                        {/* Icon */}
                        <div className={`p-3 rounded-xl shadow-md shrink-0 transition-all ${f.status === 'done' ? 'bg-green-500 text-white' : f.status === 'error' ? 'bg-red-500 text-white' : 'text-blue-500'}`} style={f.status === 'pending' || f.status === 'processing' ? { background: ACCENT_GRADIENT } : {}}>
                          {f.status === 'processing' ? <Loader2 className="animate-spin text-white" size={20} /> : f.status === 'done' ? <CheckCircle2 size={20} /> : f.status === 'error' ? <AlertCircle size={20} /> : <FileText size={20} className="text-white" />}
                        </div>

                        {/* File info */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[12px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight leading-none mb-1">{f.file.name}</p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {f.status === 'processing' ? (
                              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Loader2 size={9} className="animate-spin" /> {f.progress}% OCR
                              </span>
                            ) : f.status === 'done' ? (
                              <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">✓ Done</span>
                            ) : f.status === 'error' ? (
                              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">{f.errorMsg || 'Error'}</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Ready</span>
                            )}
                            <span className="text-[9px] text-slate-400 font-medium uppercase">{fmt(f.file.size)}</span>
                            {f.numPages > 0 && <span className="text-[9px] text-slate-400 font-medium uppercase">{f.numPages}pp</span>}
                          </div>
                          {/* Progress bar */}
                          {f.status === 'processing' && (
                            <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 transition-all duration-300 rounded-full" style={{ width: `${f.progress}%` }} />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {f.status === 'done' && f.resultBlob && (
                            <button onClick={() => handleDownload(f)} className="px-3 py-2 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-1.5" style={{ background: ACCENT_GRADIENT }}>
                              <Download size={12} /> Save
                            </button>
                          )}
                          {f.status !== 'processing' && (
                            <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 hover:border-red-200">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add more */}
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-400 transition-all bg-slate-50/10 group">
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Add More Files</span>
                  </button>

                  {/* Action buttons */}
                  {!allDone ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={runOcr}
                        disabled={processing || pdfFiles.every(f => f.status !== 'pending')}
                        className="w-full sm:flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-sm sm:text-lg font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                        style={{ background: ACCENT_GRADIENT }}
                      >
                        {processing ? <><Loader2 className="animate-spin" size={18} /> OCR Active...</> : <><ScanText size={18} /> Start OCR</>}
                      </button>
                      <button onClick={reset} className="w-full sm:w-auto sm:px-6 py-3 sm:py-5 bg-white dark:bg-slate-800 text-slate-500 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <RefreshCw size={14} /> Start Over
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Feature grid — shown when no files */}
            {pdfFiles.length === 0 && (
              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
                  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
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
            { title: "Multi-Language", desc: "Native support for English, Spanish, Japanese, and 10+ major languages.", icon: Globe },
            { title: "Native Search", desc: "Injects a proper invisible text layer into your reconstructed PDF.", icon: Search },
            { title: "Total Privacy", desc: "OCR engine runs inside your browser sandbox. No server processing.", icon: ShieldCheck },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
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
