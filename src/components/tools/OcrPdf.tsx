"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, Download, Loader2, X, FileText, ScanText,
  EyeOff, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";
}

type Mode = "make-selectable" | "remove-ocr";
type PageStatus = "pending" | "processing" | "done" | "error";

interface PageInfo {
  num: number;
  status: PageStatus;
  text?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

async function renderPageToCanvas(
  pdfPage: pdfjsLib.PDFPageProxy,
  scale = 2
): Promise<HTMLCanvasElement> {
  const viewport = pdfPage.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await pdfPage.render({ canvas, viewport }).promise;
  return canvas;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function OcrPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("make-selectable");
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [dragging, setDragging] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const reset = () => {
    abortRef.current = true;
    setFile(null);
    setPages([]);
    setProcessing(false);
    setDone(false);
    setResultBlob(null);
    setOverallProgress(0);
    setExpandedPages(new Set());
    setTimeout(() => { abortRef.current = false; }, 100);
  };

  const loadFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    reset();
    setTimeout(() => {
      abortRef.current = false;
      setFile(f);
      setDone(false);
      setResultBlob(null);
    }, 120);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  // ── Make Selectable (OCR) ──────────────────────────────────────────────────
  const runMakeSelectable = useCallback(async (f: File) => {
    setProcessing(true);
    setDone(false);
    setResultBlob(null);

    const buf = await f.arrayBuffer();
    const pdfJs = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const numPages = pdfJs.numPages;

    const initialPages: PageInfo[] = Array.from({ length: numPages }, (_, i) => ({
      num: i + 1, status: "pending",
    }));
    setPages(initialPages);

    // Build output PDF with pdf-lib
    const outDoc = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      if (abortRef.current) break;

      setPages(prev => prev.map(p => p.num === i ? { ...p, status: "processing" } : p));

      try {
        const pdfPage = await pdfJs.getPage(i);
        const canvas = await renderPageToCanvas(pdfPage, 2);
        const imgDataUrl = canvas.toDataURL("image/png");

        // OCR
        const result = await Tesseract.recognize(imgDataUrl, "eng", {
          logger: () => {},
        });
        const ocrData = result.data;

        // Embed page image into pdf-lib
        const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer());
        const embeddedImg = await outDoc.embedPng(imgBytes);

        const viewport = pdfPage.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([viewport.width, viewport.height]);

        // Draw the page image as background
        outPage.drawImage(embeddedImg, {
          x: 0, y: 0,
          width: viewport.width,
          height: viewport.height,
        });

        // Overlay invisible text (white, tiny font — makes text selectable/searchable)
        const scaleX = viewport.width / (canvas.width / 2);
        const scaleY = viewport.height / (canvas.height / 2);

        for (const word of (ocrData as any).words as Array<{ bbox: { x0: number; y0: number; x1: number; y1: number }; text: string }>) {
          const { bbox, text } = word;
          if (!text.trim()) continue;
          const x = bbox.x0 * scaleX;
          // PDF y-axis is bottom-up
          const y = viewport.height - bbox.y1 * scaleY;
          const h = (bbox.y1 - bbox.y0) * scaleY;
          const fontSize = Math.max(4, h * 0.85);

          try {
            outPage.drawText(text, {
              x,
              y,
              size: fontSize,
              opacity: 0,
            });
          } catch {
            // skip words with unsupported chars
          }
        }

        const pageText = ocrData.text.trim();
        setPages(prev => prev.map(p =>
          p.num === i ? { ...p, status: "done", text: pageText } : p
        ));
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

  // ── Remove OCR (flatten to image-only) ────────────────────────────────────
  const runRemoveOcr = useCallback(async (f: File) => {
    setProcessing(true);
    setDone(false);
    setResultBlob(null);

    const buf = await f.arrayBuffer();
    const pdfJs = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const numPages = pdfJs.numPages;

    const initialPages: PageInfo[] = Array.from({ length: numPages }, (_, i) => ({
      num: i + 1, status: "pending",
    }));
    setPages(initialPages);

    const outDoc = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      if (abortRef.current) break;

      setPages(prev => prev.map(p => p.num === i ? { ...p, status: "processing" } : p));

      try {
        const pdfPage = await pdfJs.getPage(i);
        // Render at 2× for quality, then embed as image — strips all text layers
        const canvas = await renderPageToCanvas(pdfPage, 2);
        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer());
        const embeddedImg = await outDoc.embedJpg(imgBytes);

        const viewport = pdfPage.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([viewport.width, viewport.height]);
        outPage.drawImage(embeddedImg, {
          x: 0, y: 0,
          width: viewport.width,
          height: viewport.height,
        });

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

  const handleProcess = () => {
    if (!file) return;
    if (mode === "make-selectable") runMakeSelectable(file);
    else runRemoveOcr(file);
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.pdf$/i, "");
    const suffix = mode === "make-selectable" ? "_ocr" : "_image-only";
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${base}${suffix}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const togglePage = (num: number) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const doneCount = pages.filter(p => p.status === "done").length;
  const errorCount = pages.filter(p => p.status === "error").length;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden">

        {/* ── Mode selector ── */}
        <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={() => { if (!processing) setMode("make-selectable"); }}
            disabled={processing}
            className={`flex flex-col items-center gap-2 py-5 px-4 transition-all ${
              mode === "make-selectable"
                ? "bg-blue-500 text-white"
                : "bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <ScanText size={22} />
            <span className="text-xs font-black uppercase tracking-widest leading-tight text-center">
              Make Selectable
            </span>
            <span className={`text-[10px] font-medium leading-tight text-center ${mode === "make-selectable" ? "text-blue-100" : "text-slate-400"}`}>
              Add OCR text layer
            </span>
          </button>

          <button
            onClick={() => { if (!processing) setMode("remove-ocr"); }}
            disabled={processing}
            className={`flex flex-col items-center gap-2 py-5 px-4 transition-all border-l border-slate-100 dark:border-slate-700 ${
              mode === "remove-ocr"
                ? "bg-violet-500 text-white"
                : "bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <EyeOff size={22} />
            <span className="text-xs font-black uppercase tracking-widest leading-tight text-center">
              Remove OCR
            </span>
            <span className={`text-[10px] font-medium leading-tight text-center ${mode === "remove-ocr" ? "text-violet-100" : "text-slate-400"}`}>
              Flatten to image-only
            </span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* ── Mode description ── */}
          <div className={`rounded-2xl px-4 py-3 flex items-start gap-3 text-sm font-medium ${
            mode === "make-selectable"
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20"
              : "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20"
          }`}>
            {mode === "make-selectable" ? <ScanText size={16} className="mt-0.5 shrink-0" /> : <EyeOff size={16} className="mt-0.5 shrink-0" />}
            <span>
              {mode === "make-selectable"
                ? "Scanned or image-based PDF? OCR will detect text and add an invisible selectable layer — so you can copy, search, and highlight text."
                : "Has an existing OCR or text layer you want to remove? This flattens every page to a pure image, making all text non-selectable and non-searchable."}
            </span>
          </div>

          {/* ── Drop zone / file info ── */}
          {!file ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all ${
                dragging
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }}
              />
              <div className={`p-4 rounded-2xl shadow-lg transition-transform ${dragging ? "scale-110" : ""}`}
                style={{ background: mode === "make-selectable" ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
                <Upload size={28} className="text-white" />
              </div>
              <div className="text-center">
                <p className="font-black text-slate-800 dark:text-white text-base">
                  {dragging ? "Drop your PDF here!" : "Click or drag & drop PDF"}
                </p>
                <p className="text-sm text-slate-400 mt-1">Your file stays in your browser — never uploaded</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 shrink-0">
                <FileText size={20} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              {!processing && (
                <button onClick={reset} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* ── Process button ── */}
          {file && !processing && !done && (
            <button
              onClick={handleProcess}
              className={`w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                mode === "make-selectable"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-blue-500/30"
                  : "bg-gradient-to-r from-violet-500 to-violet-700 shadow-violet-500/30"
              }`}
            >
              {mode === "make-selectable" ? "Run OCR — Make Selectable" : "Remove OCR — Flatten to Image"}
            </button>
          )}

          {/* ── Progress ── */}
          {processing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  {mode === "make-selectable" ? "Running OCR…" : "Flattening pages…"}
                </span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${mode === "make-selectable" ? "bg-blue-500" : "bg-violet-500"}`}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                {doneCount} of {pages.length} pages complete
                {errorCount > 0 && ` · ${errorCount} error${errorCount > 1 ? "s" : ""}`}
              </p>
            </div>
          )}

          {/* ── Done banner + download ── */}
          {done && (
            <div className="space-y-4">
              <div className={`rounded-2xl p-4 flex items-center gap-3 ${
                errorCount === 0
                  ? "bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20"
                  : "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20"
              }`}>
                {errorCount === 0
                  ? <CheckCircle size={20} className="text-green-500 shrink-0" />
                  : <AlertCircle size={20} className="text-yellow-500 shrink-0" />}
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-800 dark:text-white">
                    {errorCount === 0 ? "All done!" : `Done with ${errorCount} page error${errorCount > 1 ? "s" : ""}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === "make-selectable"
                      ? `${doneCount} page${doneCount !== 1 ? "s" : ""} OCR'd — text is now selectable`
                      : `${doneCount} page${doneCount !== 1 ? "s" : ""} flattened — text layer removed`}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-white text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    mode === "make-selectable"
                      ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-blue-500/30"
                      : "bg-gradient-to-r from-violet-500 to-violet-700 shadow-violet-500/30"
                  }`}
                >
                  <Download size={16} /> Download PDF
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-3.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  New File
                </button>
              </div>
            </div>
          )}

          {/* ── Per-page results (OCR mode only) ── */}
          {mode === "make-selectable" && pages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Page Results</p>
              {pages.map(p => (
                <div key={p.num} className="rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={() => p.status === "done" && p.text ? togglePage(p.num) : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      p.status === "done" && p.text ? "hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {/* Status icon */}
                    <div className="shrink-0">
                      {p.status === "pending" && <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600" />}
                      {p.status === "processing" && <Loader2 size={18} className="animate-spin text-blue-500" />}
                      {p.status === "done" && <CheckCircle size={18} className="text-green-500" />}
                      {p.status === "error" && <AlertCircle size={18} className="text-red-400" />}
                    </div>

                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1">
                      Page {p.num}
                    </span>

                    {p.status === "done" && (
                      <span className="text-xs text-slate-400 font-medium">
                        {p.text ? `${p.text.split(/\s+/).filter(Boolean).length} words` : "No text found"}
                      </span>
                    )}
                    {p.status === "error" && (
                      <span className="text-xs text-red-400 font-medium">Failed</span>
                    )}
                    {p.status === "done" && p.text && (
                      expandedPages.has(p.num)
                        ? <ChevronUp size={14} className="text-slate-400 shrink-0" />
                        : <ChevronDown size={14} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {/* Expanded OCR text preview */}
                  {expandedPages.has(p.num) && p.text && (
                    <div className="px-4 pb-4 pt-1 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700">
                      <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                        {p.text}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Remove-OCR page list (simple) */}
          {mode === "remove-ocr" && pages.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {pages.map(p => (
                <div key={p.num} className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                  p.status === "done" ? "border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/20"
                  : p.status === "processing" ? "border-blue-200 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/20"
                  : p.status === "error" ? "border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20"
                  : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
                }`}>
                  {p.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600" />}
                  {p.status === "processing" && <Loader2 size={14} className="animate-spin text-blue-500" />}
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
