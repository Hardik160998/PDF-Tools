"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, X, FileText, CheckCircle2, Loader2, Layers, Eye, EyeOff } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

type PageEntry = { pageNum: number; thumb: string; selected: boolean };

export default function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; count: number } | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".pdf")) return;
    setFile(f);
    setResult(null);
    setRangeInput("");
    setRangeError("");
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const entries: PageEntry[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i);
        const vp = pg.getViewport({ scale: 0.25 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await pg.render({ canvas, viewport: vp }).promise;
        entries.push({ pageNum: i, thumb: canvas.toDataURL(), selected: false });
      }
      setPages(entries);
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
    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: "linear-gradient(135deg,#f26522,#c2410c)" }}>
            <Layers size={36} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Extract PDF Pages</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Select pages visually or by range, then download as a new PDF.</p>
        </div>

        {!file && !loading && (
          <div
            className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-orange-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
            <div className="flex flex-col items-center gap-4 pointer-events-none">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-orange-500 group-hover:scale-110 transition-transform">
                <Upload size={36} />
              </div>
              <p className="text-xl font-black text-slate-800 dark:text-white">Click or drag &amp; drop your PDF</p>
              <p className="text-sm text-slate-400 font-medium">Your file stays on your device — always</p>
              <button className="px-7 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest shadow-lg" style={{ background: "linear-gradient(135deg,#f26522,#c2410c)" }}>
                Choose PDF File
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader2 size={40} className="animate-spin text-orange-500" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading pages…</p>
          </div>
        )}

        {!loading && pages.length > 0 && !result && (
          <div className="space-y-6">
            {/* File info + reset */}
            <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-orange-500 shrink-0"><FileText size={18} /></div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{file!.name}</p>
                  <p className="text-xs text-slate-400">{pages.length} pages</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"><X size={18} /></button>
            </div>

            {/* Range input */}
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Select by Range</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rangeInput}
                  onChange={e => { setRangeInput(e.target.value); setRangeError(""); }}
                  placeholder={`e.g. 1,3,5-8 (max ${pages.length})`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-orange-400 transition-colors"
                />
                <button onClick={applyRange} className="px-5 py-2.5 rounded-xl text-white text-sm font-black" style={{ background: "linear-gradient(135deg,#f26522,#c2410c)" }}>
                  Apply
                </button>
              </div>
              {rangeError && <p className="text-xs text-red-500 font-medium">{rangeError}</p>}
            </div>

            {/* Select all / deselect */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                {selectedPages.length} of {pages.length} pages selected
              </p>
              <div className="flex gap-2">
                <button onClick={selectAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-colors">
                  <Eye size={13} /> All
                </button>
                <button onClick={deselectAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-colors">
                  <EyeOff size={13} /> None
                </button>
              </div>
            </div>

            {/* Page grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {pages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all group ${p.selected ? "border-orange-500 ring-2 ring-orange-500/30 scale-[1.03]" : "border-slate-200 dark:border-slate-700 hover:border-orange-300"}`}
                >
                  <img src={p.thumb} alt={`Page ${p.pageNum}`} className="w-full h-auto block" />
                  <div className={`absolute inset-0 transition-all ${p.selected ? "bg-orange-500/15" : "bg-transparent group-hover:bg-orange-500/5"}`} />
                  <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${p.selected ? "bg-orange-500 border-orange-500" : "bg-white/80 border-slate-300"}`}>
                    {p.selected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] font-black text-center py-0.5">{p.pageNum}</div>
                </button>
              ))}
            </div>

            {/* Extract button */}
            <button
              onClick={handleExtract}
              disabled={processing || selectedPages.length === 0}
              className="w-full py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#f26522,#c2410c)" }}
            >
              {processing ? <Loader2 className="animate-spin" /> : <Layers size={24} />}
              {processing ? "Extracting…" : `Extract ${selectedPages.length > 0 ? selectedPages.length : ""} Page${selectedPages.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-10 text-center animate-in zoom-in duration-500">
            <div className="inline-flex p-10 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500">
              <CheckCircle2 size={72} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Extraction Complete!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                {result.count} page{result.count !== 1 ? "s" : ""} extracted
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={result.url}
                download={`extracted_${file!.name}`}
                className="flex-1 py-4 sm:py-5 text-white rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg,#f26522,#c2410c)" }}
              >
                <Download size={22} /> Download PDF
              </a>
              <button
                onClick={reset}
                className="px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
