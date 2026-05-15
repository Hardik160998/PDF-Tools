"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, X, FileText, EyeOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import type * as PDFJS from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

async function pageHasTextLayer(pdfPage: PDFJS.PDFPageProxy): Promise<boolean> {
  const content = await pdfPage.getTextContent();
  return content.items.some((item: any) => item.str?.trim().length > 0);
}

type PageStatus = "pending" | "processing" | "done" | "error";
interface PageInfo { num: number; status: PageStatus; }

export default function RemoveOcr({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [dragging, setDragging] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [textLayerDetected, setTextLayerDetected] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const reset = () => {
    abortRef.current = true;
    setFile(null); setPages([]); setProcessing(false); setDone(false);
    setResultBlob(null); setOverallProgress(0); setTextLayerDetected(null);
    setTimeout(() => { abortRef.current = false; }, 100);
  };

  const loadFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    reset();
    setTimeout(async () => {
      abortRef.current = false;
      setFile(f); setDone(false); setResultBlob(null);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";
        const buf = await f.arrayBuffer();
        const pdfJs = await pdfjsLib.getDocument({ data: buf }).promise;
        const firstPage = await pdfJs.getPage(1);
        setTextLayerDetected(await pageHasTextLayer(firstPage));
      } catch { /* ignore */ }
    }, 120);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const runFlatten = useCallback(async (f: File) => {
    setProcessing(true); setDone(false); setResultBlob(null);

    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

    const buf = await f.arrayBuffer();
    const pdfJs = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const numPages = pdfJs.numPages;
    setPages(Array.from({ length: numPages }, (_, i) => ({ num: i + 1, status: "pending" })));

    const outDoc = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      if (abortRef.current) break;
      setPages(prev => prev.map(p => p.num === i ? { ...p, status: "processing" } : p));

      try {
        const pdfPage = await pdfJs.getPage(i);
        const vp1x = pdfPage.getViewport({ scale: 1 });
        const vp3x = pdfPage.getViewport({ scale: 3 });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp3x.width);
        canvas.height = Math.floor(vp3x.height);
        await pdfPage.render({ canvasContext: canvas.getContext("2d")!, canvas: canvas, viewport: vp3x, intent: "print", background: "rgb(255,255,255)" }).promise;

        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer());
        const embeddedImg = await outDoc.embedJpg(imgBytes);
        const outPage = outDoc.addPage([vp1x.width, vp1x.height]);
        outPage.drawImage(embeddedImg, { x: 0, y: 0, width: vp1x.width, height: vp1x.height });

        setPages(prev => prev.map(p => p.num === i ? { ...p, status: "done" } : p));
      } catch {
        setPages(prev => prev.map(p => p.num === i ? { ...p, status: "error" } : p));
      }

      setOverallProgress(Math.round((i / numPages) * 100));
    }

    if (!abortRef.current) {
      const pdfBytes = await outDoc.save();
      setResultBlob(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setDone(true);
    }
    setProcessing(false);
  }, []);

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url; a.download = file.name.replace(/\.pdf$/i, "_image-only.pdf"); a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = pages.filter(p => p.status === "done").length;
  const errorCount = pages.filter(p => p.status === "error").length;
  const allFailed = done && doneCount === 0 && errorCount > 0;
  const blocked = textLayerDetected === false;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 mx-auto">
            <EyeOff size={32} className="sm:w-9 sm:h-9" />
          </div>
          <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Remove OCR</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Flatten PDF to image-only — permanently remove all hidden text layers and OCR data.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">

          {/* Info banner */}
          <div className="rounded-2xl px-4 py-3 flex items-start gap-3 text-sm font-medium bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20">
            <EyeOff size={16} className="mt-0.5 shrink-0" />
            <span>Upload a selectable PDF. Each page will be rasterized to an image — removing all text layers, making it non-selectable and non-searchable.</span>
          </div>

          {/* Drop zone */}
          {!file ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all ${dragging ? "border-violet-400 bg-violet-50 dark:bg-violet-500/10" : "border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-700/40"}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
              <div className={`p-4 rounded-2xl shadow-lg transition-transform ${dragging ? "scale-110" : ""}`} style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
                <Upload size={32} className="text-white" />
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-lg sm:text-xl font-black text-slate-800 dark:text-white mb-1">{dragging ? "Drop your PDF here!" : "Click or drag & drop PDF"}</div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Your file stays in your browser — never uploaded</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 shrink-0"><FileText size={20} className="text-red-500" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              {!processing && (
                <button onClick={reset} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
              )}
            </div>
          )}

          {/* Already image-based error */}
          {file && !processing && !done && blocked && (
            <div className="rounded-2xl px-4 py-3 flex items-start gap-3 text-sm font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-500/20">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>This PDF is already non-selectable. It has no text layer to remove.</span>
            </div>
          )}

          {/* Process button */}
          {file && !processing && !done && !blocked && (
            <button onClick={() => runFlatten(file)}
              className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 20px -4px rgba(139,92,246,0.4)" }}>
              Remove OCR — Flatten to Image
            </button>
          )}

          {/* Progress */}
          {processing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-violet-500" />
                  Flattening page {Math.min(doneCount + errorCount + 1, pages.length)} of {pages.length}…
                </span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${overallProgress}%`, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }} />
              </div>
              <p className="text-xs text-slate-400 text-center">{doneCount} of {pages.length} pages done{errorCount > 0 && ` · ${errorCount} error${errorCount > 1 ? "s" : ""}`}</p>
            </div>
          )}

          {/* Done */}
          {done && (
            <div className="space-y-4">
              {allFailed ? (
                <div className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                  <AlertCircle size={28} className="text-red-500" />
                  <div>
                    <p className="font-black text-sm text-slate-800 dark:text-white">Flattening failed</p>
                    <p className="text-xs text-slate-500 mt-1">Could not process this PDF. It may be encrypted or corrupted.</p>
                  </div>
                  <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <RefreshCw size={14} /> Try Another File
                  </button>
                </div>
              ) : (
                <>
                  <div className={`rounded-2xl p-4 flex items-center gap-3 ${errorCount === 0 ? "bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20" : "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20"}`}>
                    {errorCount === 0 ? <CheckCircle size={20} className="text-green-500 shrink-0" /> : <AlertCircle size={20} className="text-yellow-500 shrink-0" />}
                    <div className="flex-1">
                      <p className="font-black text-sm text-slate-800 dark:text-white">{errorCount === 0 ? "Flattening complete!" : `${doneCount} of ${pages.length} pages processed`}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {errorCount === 0 ? `${doneCount} page${doneCount !== 1 ? "s" : ""} flattened — text layer removed` : `${doneCount} flattened · ${errorCount} failed`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-white text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 20px -4px rgba(139,92,246,0.4)" }}>
                      <Download size={16} /> Download PDF
                    </button>
                    <button onClick={reset} className="px-5 py-3.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      New File
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Page grid */}
          {pages.length > 0 && pages.some(p => p.status !== "pending") && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {pages.map(p => (
                <div key={p.num} className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                  p.status === "done" ? "border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/20"
                  : p.status === "processing" ? "border-violet-200 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500/20"
                  : p.status === "error" ? "border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20"
                  : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
                }`}>
                  {p.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600" />}
                  {p.status === "processing" && <Loader2 size={14} className="animate-spin text-violet-500" />}
                  {p.status === "done" && <CheckCircle size={14} className="text-green-500" />}
                  {p.status === "error" && <AlertCircle size={14} className="text-red-400" />}
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{p.num}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
