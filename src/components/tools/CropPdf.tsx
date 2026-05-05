"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Loader2, Crop, CheckCircle2, RotateCcw, ChevronUp, ChevronDown, ZoomIn, ZoomOut, Maximize2, Info, ArrowRight } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

interface PageInfo { index: number; pdfW: number; pdfH: number; dataUrl: string; }
interface CropBox  { x: number; y: number; w: number; h: number; }

const DEFAULT_BOX: CropBox = { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };
const MIN_SIZE = 0.04;
type Handle = 'tl'|'tc'|'tr'|'ml'|'mr'|'bl'|'bc'|'br'|'move';
type Mode = 'all' | 'per';

export default function CropPdf({ id }: { id: string }) {
  const [pages, setPages]           = useState<PageInfo[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [cropBox, setCropBox]       = useState<CropBox>(DEFAULT_BOX);
  const [mode, setMode]             = useState<Mode>('all');
  const [perPage, setPerPage]       = useState<Record<number, CropBox>>({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult]         = useState<string | null>(null);
  const [step, setStep]             = useState<1 | 2 | 3>(1);
  const [pdfBytes, setPdfBytes]     = useState<Uint8Array | null>(null);
  const [zoom, setZoom]             = useState(1);
  const [pageInput, setPageInput]   = useState('1');

  const fileRef    = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef    = useRef<{ handle: Handle; startX: number; startY: number; startBox: CropBox } | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setPdfBytes(bytes);
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      const infos: PageInfo[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i);
        const vp = pg.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await pg.render({ canvasContext: canvas.getContext('2d')!, viewport: vp, canvas }).promise;
        infos.push({ index: i - 1, pdfW: pg.getViewport({ scale: 1 }).width, pdfH: pg.getViewport({ scale: 1 }).height, dataUrl: canvas.toDataURL('image/jpeg', 0.85) });
      }
      setPages(infos);
      setActivePage(0);
      setCropBox(DEFAULT_BOX);
      setPerPage({});
      setPageInput('1');
      setZoom(1);
      setStep(2);
    } catch {
      alert('Could not load PDF. If password protected, remove the password first.');
    } finally {
      setProcessing(false);
    }
  };

  const onHandleDown = useCallback((e: React.MouseEvent | React.TouchEvent, handle: Handle) => {
    e.preventDefault(); e.stopPropagation();
    if (!previewRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { handle, startX: clientX, startY: clientY, startBox: { ...cropBox } };
  }, [cropBox]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = (clientX - dragRef.current.startX) / rect.width;
      const dy = (clientY - dragRef.current.startY) / rect.height;
      const { handle, startBox: b } = dragRef.current;
      setCropBox(() => {
        let { x, y, w, h } = b;
        if (handle === 'move') {
          x = Math.max(0, Math.min(1 - w, b.x + dx));
          y = Math.max(0, Math.min(1 - h, b.y + dy));
        } else {
          if (handle.includes('l')) { const nx = Math.min(b.x + dx, b.x + b.w - MIN_SIZE); x = Math.max(0, nx); w = b.x + b.w - x; }
          if (handle.includes('r')) { w = Math.max(MIN_SIZE, Math.min(1 - b.x, b.w + dx)); }
          if (handle.includes('t')) { const ny = Math.min(b.y + dy, b.y + b.h - MIN_SIZE); y = Math.max(0, ny); h = b.y + b.h - y; }
          if (handle.includes('b')) { h = Math.max(MIN_SIZE, Math.min(1 - b.y, b.h + dy)); }
          if (handle === 'tc' || handle === 'bc') { x = b.x; w = b.w; }
          if (handle === 'ml' || handle === 'mr') { y = b.y; h = b.h; }
        }
        return { x, y, w, h };
      });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const switchPage = (idx: number) => {
    if (mode === 'per') setPerPage(prev => ({ ...prev, [activePage]: cropBox }));
    setActivePage(idx);
    setPageInput(String(idx + 1));
    // In 'all' mode keep the same cropBox; in 'per' restore saved or default
    if (mode === 'per') {
      setCropBox(perPage[idx] ?? DEFAULT_BOX);
    }
    // mode === 'all': do NOT touch cropBox
  };

  const switchMode = (m: Mode) => {
    if (mode === 'per') setPerPage(prev => ({ ...prev, [activePage]: cropBox }));
    setMode(m);
    // switching to 'all': keep current cropBox as the shared box
    // switching to 'per': restore this page's saved box or keep current
    if (m === 'per') setCropBox(perPage[activePage] ?? cropBox);
  };

  const handleCrop = async () => {
    if (!pdfBytes) return;
    if (mode === 'per') setPerPage(prev => ({ ...prev, [activePage]: cropBox }));
    setProcessing(true);
    try {
      const srcDoc = await PDFDocument.load(pdfBytes!.slice(0));
      const outDoc = await PDFDocument.create();
      const count  = srcDoc.getPageCount();
      const copied = await outDoc.copyPages(srcDoc, Array.from({ length: count }, (_, i) => i));
      const finalPerPage = mode === 'per' ? { ...perPage, [activePage]: cropBox } : perPage;
      for (let i = 0; i < copied.length; i++) {
        const pg = copied[i];
        outDoc.addPage(pg);
        const box = mode === 'all' ? cropBox : (finalPerPage[i] ?? null);
        if (box) {
          const { width, height } = pg.getSize();
          pg.setCropBox(box.x * width, (1 - box.y - box.h) * height, box.w * width, box.h * height);
        }
      }
      const bytes = await outDoc.save();
      setResult(URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })));
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Crop failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setStep(1); setPages([]); setCropBox(DEFAULT_BOX);
    setResult(null); setPdfBytes(null); setPerPage({});
    setMode('all'); setZoom(1); setPageInput('1');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handles: { id: Handle; style: React.CSSProperties; cursor: string }[] = [
    { id: 'tl', style: { top: -5,    left: -5   }, cursor: 'nwse-resize' },
    { id: 'tc', style: { top: -5,    left: '50%', transform: 'translateX(-50%)' }, cursor: 'ns-resize' },
    { id: 'tr', style: { top: -5,    right: -5  }, cursor: 'nesw-resize' },
    { id: 'ml', style: { top: '50%', left: -5,   transform: 'translateY(-50%)' }, cursor: 'ew-resize' },
    { id: 'mr', style: { top: '50%', right: -5,  transform: 'translateY(-50%)' }, cursor: 'ew-resize' },
    { id: 'bl', style: { bottom: -5, left: -5   }, cursor: 'nesw-resize' },
    { id: 'bc', style: { bottom: -5, left: '50%', transform: 'translateX(-50%)' }, cursor: 'ns-resize' },
    { id: 'br', style: { bottom: -5, right: -5  }, cursor: 'nwse-resize' },
  ];

  const pg = pages[activePage];
  const zoomPct = Math.round(zoom * 100);

  // ── Step 1: Upload ────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-16 hover:border-orange-400 hover:bg-orange-50/20 dark:hover:bg-orange-500/5 transition-all cursor-pointer text-center bg-white dark:bg-slate-800 shadow-xl">
            <input ref={fileRef} type="file" accept=".pdf" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <div className="pointer-events-none flex flex-col items-center gap-4">
              {processing ? <Loader2 className="animate-spin text-orange-500" size={44} /> : (
                <>
                  <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                    <Crop size={40} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">Select PDF file</p>
                    <p className="text-slate-400 text-sm mt-1">or drop PDF here</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Result ────────────────────────────────────────────────────────
  if (step === 3 && result) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">PDF Cropped!</h3>
            <p className="text-slate-400 text-sm mt-1">Your PDF is ready to download.</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <a href={result} download="cropped.pdf"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all">
              <Download size={18} /> Download Cropped PDF
            </a>
            <button onClick={reset}
              className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-all">
              Crop Another PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Two-panel crop editor ─────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100 dark:bg-slate-900">

      {/* ── LEFT: PDF viewer ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Scrollable page area */}
        <div className="flex-1 overflow-auto">
          <div className="min-h-full min-w-full flex items-start justify-center p-6">
          {pg && (
            <div
              ref={previewRef}
              className="relative select-none shadow-2xl bg-white shrink-0"
              style={{
                width: `${Math.round(pg.pdfW * zoom)}px`,
                height: `${Math.round(pg.pdfH * zoom)}px`,
              }}
            >
              <img src={pg.dataUrl} alt="Page preview" className="w-full h-full object-fill pointer-events-none" draggable={false} />

              {/* Dark overlay outside crop */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.45) ${cropBox.y * 100}%, transparent ${cropBox.y * 100}%, transparent ${(cropBox.y + cropBox.h) * 100}%, rgba(0,0,0,0.45) ${(cropBox.y + cropBox.h) * 100}%)` }} />
              <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, left: 0, width: `${cropBox.x * 100}%`, background: 'rgba(0,0,0,0.45)' }} />
              <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, right: 0, width: `${(1 - cropBox.x - cropBox.w) * 100}%`, background: 'rgba(0,0,0,0.45)' }} />

              {/* Crop box */}
              <div
                className="absolute"
                style={{
                  left: `${cropBox.x * 100}%`, top: `${cropBox.y * 100}%`,
                  width: `${cropBox.w * 100}%`, height: `${cropBox.h * 100}%`,
                  cursor: 'move',
                  border: '2px solid #f97316',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0)',
                }}
                onMouseDown={e => onHandleDown(e, 'move')}
                onTouchStart={e => onHandleDown(e, 'move')}
              >
                {/* Rule-of-thirds */}
                <div className="absolute inset-0 pointer-events-none">
                  {[1,2].map(n => <div key={`v${n}`} className="absolute top-0 bottom-0" style={{ left: `${n*33.33}%`, borderLeft: '1px solid rgba(249,115,22,0.3)' }} />)}
                  {[1,2].map(n => <div key={`h${n}`} className="absolute left-0 right-0" style={{ top: `${n*33.33}%`, borderTop: '1px solid rgba(249,115,22,0.3)' }} />)}
                </div>
                {handles.map(h => (
                  <div key={h.id}
                    className="absolute w-3 h-3 bg-orange-500 rounded-sm shadow-md z-10"
                    style={{ ...h.style, cursor: h.cursor }}
                    onMouseDown={e => onHandleDown(e, h.id)}
                    onTouchStart={e => onHandleDown(e, h.id)}
                  />
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className="shrink-0 bg-slate-800 dark:bg-slate-950 text-white flex items-center justify-center gap-1 px-4 py-2 shadow-lg">
          {/* Page nav */}
          <button onClick={() => switchPage(Math.max(0, activePage - 1))} disabled={activePage === 0}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">
            <ChevronUp size={16} />
          </button>
          <button onClick={() => switchPage(Math.min(pages.length - 1, activePage + 1))} disabled={activePage === pages.length - 1}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">
            <ChevronDown size={16} />
          </button>

          <div className="flex items-center gap-1 mx-1">
            <input
              type="text"
              value={pageInput}
              onChange={e => setPageInput(e.target.value)}
              onBlur={() => {
                const n = parseInt(pageInput);
                if (!isNaN(n) && n >= 1 && n <= pages.length) switchPage(n - 1);
                else setPageInput(String(activePage + 1));
              }}
              onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              className="w-10 text-center bg-white/10 border border-white/20 rounded text-sm py-0.5 outline-none focus:border-orange-400"
            />
            <span className="text-white/50 text-sm">/ {pages.length}</span>
          </div>

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* Zoom */}
          <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"><ZoomOut size={16} /></button>
          <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"><ZoomIn size={16} /></button>
          <span className="text-sm w-12 text-center text-white/80">{zoomPct}%</span>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <button onClick={() => setZoom(1)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Fit page">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* ── RIGHT: Sidebar ── */}
      <div className="w-72 shrink-0 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-xl">

        {/* Sidebar header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Crop PDF</h2>
        </div>

        {/* Sidebar body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Info box */}
          <div className="flex gap-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-3">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Click and drag to select the area you want to keep. Resize if needed.
            </p>
          </div>

          {/* Reset all */}
          <div className="flex justify-end">
            <button onClick={() => setCropBox(DEFAULT_BOX)}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
              <RotateCcw size={11} /> Reset all
            </button>
          </div>

          {/* Pages */}
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Pages:</p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${mode === 'all' ? 'border-green-500 bg-green-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-green-400'}`}
                  onClick={() => switchMode('all')}>
                  {mode === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 select-none" onClick={() => switchMode('all')}>All pages</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${mode === 'per' ? 'border-green-500 bg-green-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-green-400'}`}
                  onClick={() => switchMode('per')}>
                  {mode === 'per' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 select-none" onClick={() => switchMode('per')}>Current page</span>
              </label>
            </div>
          </div>

          {/* Crop dimensions */}
          {pg && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Selected area</p>
              <p className="text-sm font-bold text-orange-500">
                {Math.round(cropBox.w * pg.pdfW)} × {Math.round(cropBox.h * pg.pdfH)} pt
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {Math.round(cropBox.w * 100)}% × {Math.round(cropBox.h * 100)}% of page
              </p>
            </div>
          )}
        </div>

        {/* Crop button */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
          <button onClick={handleCrop} disabled={processing}
            className="w-full py-4 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-black text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all">
            {processing ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            {processing ? 'Cropping…' : 'Crop PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
