"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, X, FileText, CheckCircle2, Loader2, EyeOff, Trash2, Plus, Shield } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

interface Redaction { id: string; page: number; x: number; y: number; w: number; h: number; }

export default function RedactPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.4);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [redactions, setRedactions] = useState<Redaction[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawRect, setDrawRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<"draw" | "search">("draw");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bufRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".pdf")) return;
    setLoading(true);
    setFile(f); setRedactions([]); setResult(null); setPage(1);
    const buf = await f.arrayBuffer();
    bufRef.current = buf.slice(0);
    const doc = await pdfjsLib.getDocument({ data: buf }).promise;
    setPdfDoc(doc); setTotalPages(doc.numPages);
    setLoading(false);
  }, []);

  // Render page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const pg = await pdfDoc.getPage(page);
      const vp = pg.getViewport({ scale });
      const canvas = canvasRef.current!;
      canvas.width = vp.width; canvas.height = vp.height;
      await pg.render({ canvas, viewport: vp }).promise;
      if (!cancelled && overlayRef.current) {
        overlayRef.current.width = vp.width;
        overlayRef.current.height = vp.height;
        drawOverlay();
      }
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, page, scale]);

  const drawOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d")!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redactions.filter(r => r.page === page).forEach(r => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    });
    if (drawRect) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
      ctx.setLineDash([]);
    }
  }, [redactions, page, drawRect]);

  useEffect(() => { drawOverlay(); }, [drawOverlay]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    const sx = overlayRef.current!.width / rect.width;
    const sy = overlayRef.current!.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "draw") return;
    const pos = getPos(e);
    setDrawStart(pos); setDrawing(true); setDrawRect(null);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !drawStart) return;
    const pos = getPos(e);
    setDrawRect({ x: Math.min(drawStart.x, pos.x), y: Math.min(drawStart.y, pos.y), w: Math.abs(pos.x - drawStart.x), h: Math.abs(pos.y - drawStart.y) });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !drawStart) return;
    const pos = getPos(e);
    const r = { x: Math.min(drawStart.x, pos.x), y: Math.min(drawStart.y, pos.y), w: Math.abs(pos.x - drawStart.x), h: Math.abs(pos.y - drawStart.y) };
    if (r.w > 5 && r.h > 5) {
      setRedactions(prev => [...prev, { id: crypto.randomUUID(), page, ...r }]);
    }
    setDrawing(false); setDrawStart(null); setDrawRect(null);
  };

  // Search & redact text
  const handleSearch = useCallback(async () => {
    if (!pdfDoc || !searchText.trim()) return;
    setSearchMsg("Searching…");
    const term = searchText.trim().toLowerCase();
    let found = 0;
    const newRedactions: Redaction[] = [];
    for (let p = 1; p <= pdfDoc.numPages; p++) {
      const pg = await pdfDoc.getPage(p);
      const vp = pg.getViewport({ scale });
      const content = await pg.getTextContent();
      for (const item of content.items as any[]) {
        if (!item.str || !item.str.toLowerCase().includes(term)) continue;
        const tx = pdfjsLib.Util.transform(vp.transform, item.transform);
        const x = tx[4]; const y = tx[5] - item.height * scale;
        const w = item.width * scale; const h = item.height * scale * 1.2;
        newRedactions.push({ id: crypto.randomUUID(), page: p, x, y, w: Math.max(w, 20), h: Math.max(h, 12) });
        found++;
      }
    }
    setRedactions(prev => [...prev, ...newRedactions]);
    setSearchMsg(found > 0 ? `✓ ${found} match${found > 1 ? "es" : ""} redacted` : "No matches found.");
  }, [pdfDoc, searchText, scale]);

  const removeRedaction = (id: string) => setRedactions(prev => prev.filter(r => r.id !== id));
  const clearPage = () => setRedactions(prev => prev.filter(r => r.page !== page));

  const handleApply = async () => {
    if (!bufRef.current || redactions.length === 0) return;
    setProcessing(true);
    try {
      const doc = await PDFDocument.load(bufRef.current);
      const pages = doc.getPages();
      for (const r of redactions) {
        const pg = pages[r.page - 1];
        const { height } = pg.getSize();
        const pdfJsPage = await pdfDoc!.getPage(r.page);
        const vp = pdfJsPage.getViewport({ scale });
        const scaleX = pg.getWidth() / vp.width;
        const scaleY = pg.getHeight() / vp.height;
        const pdfX = r.x * scaleX;
        const pdfY = height - (r.y + r.h) * scaleY;
        const pdfW = r.w * scaleX;
        const pdfH = r.h * scaleY;
        pg.drawRectangle({ x: pdfX, y: pdfY, width: pdfW, height: pdfH, color: rgb(0, 0, 0) });
      }
      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setResult(url);
    } catch { alert("Error applying redactions."); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setPdfDoc(null); setRedactions([]); setResult(null); setPage(1); bufRef.current = null; };

  const pageRedactions = redactions.filter(r => r.page === page);
  const totalRedactions = redactions.length;

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-10 px-2 sm:px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-8 overflow-hidden">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-red-500/20" style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
            <EyeOff size={32} className="sm:w-9 sm:h-9" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Redact PDF</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Draw black boxes or search text to permanently hide sensitive information.</p>
        </div>

        {/* Upload */}
        {!file && !loading && (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-red-500 hover:bg-red-50/30 dark:hover:bg-red-500/5 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
            onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
            <div className="flex flex-col items-center gap-4 pointer-events-none text-center">
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-red-500 group-hover:scale-110 transition-transform"><Upload size={32} className="sm:w-9 sm:h-9" /></div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">Click or drag & drop your PDF</p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Your file stays on your device — always</p>
              </div>
              <button className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all" style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>Choose PDF File</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 py-12 sm:py-16">
            <Loader2 size={40} className="animate-spin text-red-500" />
            <p className="text-sm font-bold text-slate-500">Loading PDF…</p>
          </div>
        )}

        {pdfDoc && !result && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* File bar */}
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-red-500 shrink-0"><FileText size={18} /></div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-[13px] sm:text-sm truncate leading-tight">{file!.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{totalPages} pages · {totalRedactions} redaction{totalRedactions !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"><X size={18} /></button>
            </div>

            {/* Mode + tools */}
            <div className="flex flex-col gap-4">
              {/* Mode toggle */}
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
                <button onClick={() => setMode("draw")} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-black transition-all ${mode === "draw" ? "bg-white dark:bg-slate-600 text-red-600 shadow-sm" : "text-slate-500"}`}>
                  <EyeOff size={14} /> Draw
                </button>
                <button onClick={() => setMode("search")} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-black transition-all ${mode === "search" ? "bg-white dark:bg-slate-600 text-red-600 shadow-sm" : "text-slate-500"}`}>
                  <Shield size={14} /> Search
                </button>
              </div>

              {/* Search bar */}
              {mode === "search" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2">
                    <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); setSearchMsg(""); }}
                      onKeyDown={e => e.key === "Enter" && handleSearch()}
                      placeholder="Enter text to redact..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[13px] sm:text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-red-400 transition-colors" />
                    <button onClick={handleSearch} className="px-4 py-2.5 rounded-xl text-white shadow-lg active:scale-95 transition-all shrink-0" style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
                      <Plus size={20} />
                    </button>
                  </div>
                  {searchMsg && <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-2 ${searchMsg.startsWith("✓") ? "text-green-600" : "text-slate-400"}`}>{searchMsg}</p>}
                </div>
              )}
            </div>

            {/* Page nav */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-200 transition-colors">‹</button>
                <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300">Pg {page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-200 transition-colors">›</button>
              </div>
              <div className="flex items-center gap-2">
                {pageRedactions.length > 0 && (
                  <button onClick={clearPage} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-100 dark:border-red-800" title="Clear page">
                    <Trash2 size={16} />
                  </button>
                )}
                <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{pageRedactions.length} on page</span>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
              {mode === "draw" && (
                <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 uppercase tracking-widest pointer-events-none">
                  <EyeOff size={11} /> Draw area
                </div>
              )}
              <div className="relative inline-block w-full">
                <canvas ref={canvasRef} className="block w-full h-auto" />
                <canvas ref={overlayRef} className="absolute inset-0 w-full h-full"
                  style={{ cursor: mode === "draw" ? "crosshair" : "default" }}
                  onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
              </div>
            </div>

            {/* Redaction list */}
            {totalRedactions > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Active Redactions ({totalRedactions})</p>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-hide">
                  {redactions.map((r, i) => (
                    <div key={r.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700 group hover:border-red-200 dark:hover:border-red-800 transition-all">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Page {r.page} — Area {i + 1} <span className="text-[10px] text-slate-400 font-medium ml-2">{Math.round(r.w)}×{Math.round(r.h)}px</span>
                      </span>
                      <button onClick={() => removeRedaction(r.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply button */}
            <button onClick={handleApply} disabled={processing || totalRedactions === 0}
              className="w-full py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
              {processing ? <Loader2 className="animate-spin" size={24} /> : <Shield size={24} />}
              {processing ? "Applying Changes…" : `Redact ${totalRedactions} Area${totalRedactions !== 1 ? "s" : ""}`}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-10 text-center animate-in zoom-in duration-600 py-4">
            <div className="inline-flex p-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 scale-110 border border-green-500/20 shadow-xl shadow-green-500/10"><CheckCircle2 size={72} /></div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">PDF Redacted!</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-black uppercase tracking-widest leading-relaxed px-4">{totalRedactions} area{totalRedactions !== 1 ? "s" : ""} permanently hidden from your file</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <a href={result} download={`redacted_${file!.name}`}
                className="flex-1 py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
                <Download size={24} /> Download PDF
              </a>
              <button onClick={reset} className="px-8 py-4 sm:px-10 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all text-sm sm:text-base">
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
