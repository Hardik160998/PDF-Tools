"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, X, FileText, CheckCircle2, Loader2, EyeOff, Trash2, Plus, Shield } from "lucide-react";
import type * as PDFJS from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface Redaction { id: string; page: number; x: number; y: number; w: number; h: number; }

export default function RedactPdf({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFJS.PDFDocumentProxy | null>(null);
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
  const [showSidebar, setShowSidebar] = useState(true);
  const [zoom, setZoom] = useState(0.75);
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
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";
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
      await pg.render({ canvasContext: canvas.getContext("2d")!, canvas, viewport: vp }).promise;
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

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    const sx = overlayRef.current!.width / rect.width;
    const sy = overlayRef.current!.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  };

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== "draw") return;
    const pos = getPos(e);
    setDrawStart(pos); setDrawing(true); setDrawRect(null);
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !drawStart) return;
    const pos = getPos(e);
    setDrawRect({ x: Math.min(drawStart.x, pos.x), y: Math.min(drawStart.y, pos.y), w: Math.abs(pos.x - drawStart.x), h: Math.abs(pos.y - drawStart.y) });
  };

  const onEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !drawStart) return;
    // For end event, we might need to use the last known drawRect if it's a touchEnd
    const r = drawRect || { x: drawStart.x, y: drawStart.y, w: 0, h: 0 };
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
      const pdfjsLib = await import("pdfjs-dist");
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

  const reset = () => { setFile(null); setPdfDoc(null); setRedactions([]); setResult(null); setPage(1); bufRef.current = null; setShowSidebar(true); };

  const pageRedactions = redactions.filter(r => r.page === page);
  const totalRedactions = redactions.length;

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto py-10 sm:py-20 px-6">
       <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 sm:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-10 group">
          <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto text-red-500 shadow-xl group-hover:scale-110 transition-transform">
             <Shield size={48} />
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Redact PDF</h2>
             <p className="text-slate-400 font-medium text-sm sm:text-base max-w-md mx-auto uppercase tracking-widest">Permanently hide sensitive data with military-grade precision.</p>
          </div>
          <div className="relative border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] p-12 group-hover:border-red-500/50 transition-all cursor-pointer"
             onDragOver={e => e.preventDefault()}
             onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
             onClick={() => fileInputRef.current?.click()}>
             <Upload size={48} className="mx-auto mb-6 text-slate-200 group-hover:text-red-500 transition-colors" />
             <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Drop PDF Here</p>
             <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">or click to browse local files</p>
          </div>
       </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Workspace Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-100 dark:border-slate-800
        transition-all duration-500 ease-in-out shadow-2xl
        ${showSidebar ? 'w-full sm:w-96 translate-x-0' : 'w-0 -translate-x-full'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-5 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Workspace</h2>
            <button onClick={() => setShowSidebar(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white hover:scale-110 transition-all"><X size={20} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar pb-32">
             {/* File Info */}
             <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-red-500 shrink-0"><FileText size={20} /></div>
                <div className="min-w-0">
                   <p className="text-xs font-black uppercase truncate text-slate-900 dark:text-white">{file?.name}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{totalPages} Pages · {totalRedactions} Active</p>
                </div>
             </div>

             {/* Mode Selection */}
             <div className="space-y-4">
                <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Redaction Mode</span>
                <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-900 rounded-2xl p-1.5 gap-1.5">
                   <button onClick={() => setMode("draw")} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === "draw" ? "bg-white dark:bg-slate-800 text-red-500 shadow-lg" : "text-slate-400"}`}>
                      <EyeOff size={14} /> Manual
                   </button>
                   <button onClick={() => setMode("search")} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === "search" ? "bg-white dark:bg-slate-800 text-red-500 shadow-lg" : "text-slate-400"}`}>
                      <Shield size={14} /> Search
                   </button>
                </div>
             </div>

             {/* Search Tools */}
             {mode === "search" && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                   <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Search & Redact</span>
                   <div className="flex gap-2">
                      <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); setSearchMsg(""); }}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        placeholder="Keyword..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:border-red-500 transition-all placeholder:text-slate-300" />
                      <button onClick={handleSearch} className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                        <Plus size={20} />
                      </button>
                   </div>
                   {searchMsg && <p className={`text-[9px] font-black uppercase tracking-widest px-2 ${searchMsg.startsWith("✓") ? "text-green-500" : "text-slate-400"}`}>{searchMsg}</p>}
                </div>
             )}

             {/* Active Redactions List */}
             {totalRedactions > 0 && (
               <div className="space-y-4">
                  <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">History ({totalRedactions})</span>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                     {redactions.map((r, i) => (
                       <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Area {i + 1}</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Page {r.page} · {Math.round(r.w)}x{Math.round(r.h)}pt</span>
                          </div>
                          <button onClick={() => removeRedaction(r.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>

          <div className="p-6 sm:p-8 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 fixed bottom-0 left-0 w-full sm:w-96 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
             <button onClick={handleApply} disabled={processing || totalRedactions === 0} className="w-full py-4 sm:py-5 bg-red-500 text-white rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest shadow-2xl shadow-red-500/40 hover:scale-[1.02] active:scale-95 transition-all">
                {processing ? <Loader2 className="animate-spin mx-auto" size={24} /> : `Redact ${totalRedactions} Areas`}
             </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950 overflow-hidden transition-all duration-500 ${showSidebar ? 'lg:pl-[384px]' : 'pl-0'}`}>
         {/* Top toolbar */}
         <div className="h-14 sm:h-16 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 relative">
            <div className="flex items-center gap-2 sm:gap-4">
               {!showSidebar && (
                 <button onClick={() => setShowSidebar(true)} className="p-2 bg-red-500 text-white rounded-xl shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all mr-2">
                    <Plus size={18} />
                 </button>
               )}
               <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500"><Plus className="rotate-180" size={18} /></button>
               <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">P. {page} / {totalPages}</span>
               <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500"><Plus size={18} /></button>
            </div>
            
            <div className="flex items-center gap-2">
               {pageRedactions.length > 0 && (
                 <button onClick={clearPage} className="p-2 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={16} /></button>
               )}
               <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-2" />
               <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500"><Plus className="rotate-45" size={18} /></button>
               <span className="w-10 sm:w-12 text-center text-[9px] sm:text-[10px] font-black uppercase text-slate-900 dark:text-white">{Math.round(scale * 100)}%</span>
               <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500"><Plus size={18} /></button>
            </div>
         </div>

         {/* Visual Workspace */}
         <div className="flex-1 overflow-auto p-4 sm:p-12 flex items-start justify-center custom-scrollbar">
            <div className="relative shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group" style={{ touchAction: 'none' }}>
               {mode === "draw" && (
                 <div className="absolute -top-10 left-0 z-10 text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Plus size={10} /> Click & drag to redact
                 </div>
               )}
               <canvas ref={canvasRef} className="block" />
               <canvas ref={overlayRef} className="absolute inset-0 w-full h-full"
                 style={{ cursor: mode === "draw" ? "crosshair" : "default", touchAction: 'none' }}
                 onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd}
                 onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} />
            </div>
         </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
       <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-8 sm:space-y-10">
          <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto text-green-500 shadow-xl">
             <CheckCircle2 size={48} />
          </div>
          <div>
             <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Redaction Complete!</h2>
             <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-xs">{totalRedactions} areas permanently hidden from your file.</p>
          </div>

          <div className="max-w-md mx-auto">
             <a href={result!} download={`redacted_${file!.name}`}
               className="w-full py-4 sm:py-5 bg-green-500 text-white rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest shadow-2xl shadow-green-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
               <Download size={24} /> Download PDF
             </a>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-50 dark:border-slate-800">
             <button onClick={reset} className="w-full sm:w-auto px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Start New Batch</button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans">
      {pdfDoc && !result && renderStep2()}
      {!pdfDoc && !result && renderStep1()}
      {result && renderStep3()}
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
    </div>
  );
}



