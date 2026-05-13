"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, X, FileText, ScanText, CheckCircle2, AlertCircle, RefreshCw, Globe } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";
}

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
  const base = window.location.origin;
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

async function renderPageThumb(pdfJs: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<string> {
  const page = await pdfJs.getPage(pageNum);
  const vp = page.getViewport({ scale: 0.3 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvas, viewport: vp }).promise;
  return canvas.toDataURL("image/jpeg", 0.7);
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
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState("eng");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

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
  };

  const removeFile = (id: string) => setPdfFiles(prev => prev.filter(f => f.id !== id));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const runOcr = useCallback(async () => {
    const pending = pdfFiles.filter(f => f.status === "pending");
    if (!pending.length) return;
    setProcessing(true); setAllDone(false);
    abortRef.current = false;

    for (const entry of pending) {
      if (abortRef.current) break;

      setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "processing", progress: 0 } : f));

      let ocrWorker: Tesseract.Worker | null = null;
      try {
        ocrWorker = await createOcrWorker(language);
        const buf = await entry.file.arrayBuffer();
        const pdfJs = await pdfjsLib.getDocument({ data: buf }).promise;
        const numPages = pdfJs.numPages;

        // Collect per-page PDF bytes from Tesseract's own PDF renderer
        const pagePdfChunks: Uint8Array[] = [];

        for (let i = 1; i <= numPages; i++) {
          if (abortRef.current) break;

          const pdfPage = await pdfJs.getPage(i);
          const vp2x = pdfPage.getViewport({ scale: 2 });
          const w = Math.floor(vp2x.width), h = Math.floor(vp2x.height);

          // Render page to canvas at 2x for better OCR accuracy
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
          await pdfPage.render({ canvas, viewport: vp2x, background: "rgb(255,255,255)" }).promise;

          // Use Tesseract's built-in PDF output — this produces a proper
          // searchable PDF with correct invisible text layer (Tr 3) natively
          const { data } = await ocrWorker.recognize(canvas, {}, { pdf: true });
          const pdfData = (data as any).pdf as Uint8Array | null;

          if (pdfData && pdfData.length > 0) {
            pagePdfChunks.push(pdfData);
          }

          setPdfFiles(prev => prev.map(f => f.id === entry.id ? { ...f, progress: Math.round((i / numPages) * 100) } : f));
        }

        await ocrWorker.terminate();

        if (!abortRef.current && pagePdfChunks.length > 0) {
          // Merge all single-page PDFs into one document using pdf-lib
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

  const doneFiles = pdfFiles.filter(f => f.status === "done");
  const errorFiles = pdfFiles.filter(f => f.status === "error");
  const pendingFiles = pdfFiles.filter(f => f.status === "pending");
  const processingFile = pdfFiles.find(f => f.status === "processing");

  // ── No files yet ──────────────────────────────────────────────────────────
  if (!pdfFiles.length) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-blue-500 text-white shadow-lg">
              <ScanText size={40} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">OCR PDF</h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Make scanned PDFs searchable and selectable.</p>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-16 group transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 ${dragging ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-500"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden"
              onChange={e => { if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ""; } }} />
            <div className="space-y-4 sm:space-y-6 pointer-events-none">
              <div className={`p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-blue-500 transition-transform ${dragging ? "scale-110" : "group-hover:scale-110"}`}>
                <Upload size={48} />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                {dragging ? "Drop your PDFs here!" : "Select PDF files"}
              </div>
              <p className="text-sm sm:text-base text-slate-500">or drop PDFs here · stays in your browser</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── All done ──────────────────────────────────────────────────────────────
  if (allDone && !processing && doneFiles.length > 0) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8 sm:space-y-12">
          <div className="space-y-4">
            <div className="p-10 sm:p-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 inline-block">
              <CheckCircle2 size={72} />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">OCR Complete!</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              {doneFiles.length} file{doneFiles.length !== 1 ? "s" : ""} processed{errorFiles.length > 0 ? ` · ${errorFiles.length} failed` : ""}
            </p>
          </div>

          {/* Per-file download list */}
          {pdfFiles.length > 1 && (
            <div className="space-y-2 text-left">
              {pdfFiles.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                    <FileText size={18} className={f.status === "done" ? "text-blue-500" : "text-red-400"} />
                  </div>
                  <span className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{f.file.name}</span>
                  {f.status === "done" && (
                    <button onClick={() => handleDownload(f)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors">
                      <Download size={13} /> Download
                    </button>
                  )}
                  {f.status === "error" && (
                    <span className="text-xs text-red-400 font-medium">{f.errorMsg ?? "Failed"}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {doneFiles.length === 1 ? (
              <button onClick={() => handleDownload(doneFiles[0])}
                className="flex-1 py-4 sm:py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 transition-all">
                <Download size={24} /> Download PDF
              </button>
            ) : (
              <button onClick={downloadAll}
                className="flex-1 py-4 sm:py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 transition-all">
                <Download size={24} /> Download All
              </button>
            )}
            <button onClick={reset}
              className="px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
              OCR Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Files loaded / processing ─────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-8">

        {/* Language selector */}
        {!processing && (
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-slate-400 shrink-0" />
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 shrink-0">OCR Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="flex-1 max-w-xs text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* File cards with thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfFiles.map(f => (
            <div key={f.id} className={`relative rounded-2xl border overflow-hidden transition-all ${
              f.status === "done" ? "border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5"
              : f.status === "error" ? "border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5"
              : f.status === "processing" ? "border-blue-300 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10"
              : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
            }`}>
              {/* Thumbnail strip */}
              {f.thumbs.length > 0 && (
                <div className="flex gap-1 p-2 bg-slate-100 dark:bg-slate-900/60 overflow-hidden">
                  {f.thumbs.map((thumb, i) => (
                    <img key={i} src={thumb} alt={`Page ${i + 1}`}
                      className="h-16 w-auto rounded object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0" />
                  ))}
                  {f.numPages > 4 && (
                    <div className="h-16 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                      +{f.numPages - 4}
                    </div>
                  )}
                </div>
              )}

              {/* File info */}
              <div className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                  <FileText size={16} className={
                    f.status === "done" ? "text-blue-500"
                    : f.status === "error" ? "text-red-400"
                    : "text-slate-400"
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{f.file.name}</p>
                  <p className="text-[10px] text-slate-400">{f.numPages} page{f.numPages !== 1 ? "s" : ""} · {(f.file.size / 1024).toFixed(0)} KB</p>
                </div>
                {f.status === "pending" && !processing && (
                  <button onClick={() => removeFile(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                )}
                {f.status === "done" && (
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                )}
                {f.status === "error" && (
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                )}
              </div>

              {/* Progress bar */}
              {f.status === "processing" && (
                <div className="px-3 pb-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Scanning…</span>
                    <span>{f.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                  </div>
                </div>
              )}

              {f.status === "error" && (
                <p className="px-3 pb-3 text-[10px] text-red-400 font-medium">{f.errorMsg ?? "Failed"}</p>
              )}
            </div>
          ))}

          {/* Add more files card */}
          {!processing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 p-6 text-slate-400 hover:text-blue-500 min-h-[120px]"
            >
              <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden"
                onChange={e => { if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ""; } }} />
              <Upload size={22} />
              <span className="text-xs font-bold">Add more PDFs</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!processing ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={runOcr}
              disabled={!pendingFiles.length}
              className="flex-1 py-4 sm:py-5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 transition-all"
            >
              <ScanText size={24} />
              {pendingFiles.length > 1 ? `OCR ${pendingFiles.length} PDFs` : "OCR PDF"}
            </button>
            <button onClick={reset}
              className="px-6 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 py-4 text-blue-500 font-bold">
            <Loader2 size={20} className="animate-spin" />
            <span>Processing{processingFile ? ` "${processingFile.file.name}"` : ""}…</span>
          </div>
        )}
      </div>
    </div>
  );
}
