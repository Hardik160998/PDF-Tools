'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { 
  Upload, Download, Crop, Loader2, ArrowRight, 
  CheckCircle2, Info, Maximize2, ZoomIn, ZoomOut, 
  ChevronUp, ChevronDown, RotateCcw 
} from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.mjs';

const DEFAULT_BOX = { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };

export default function CropPdf() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [pages, setPages] = useState<{ dataUrl: string; pdfW: number; pdfH: number }[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [cropBox, setCropBox] = useState(DEFAULT_BOX);
  const [perPage, setPerPage] = useState<Record<number, typeof DEFAULT_BOX>>({});
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<'all' | 'per'>('all');
  const [result, setResult] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState('1');

  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfFile = useRef<File | null>(null);

  const pg = pages[activePage];
  const zoomPct = Math.round(zoom * 100);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    pdfFile.current = file;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const infos = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context!, viewport }).promise;
        
        infos.push({
          dataUrl: canvas.toDataURL('image/jpeg', 0.8),
          pdfW: page.view[2],
          pdfH: page.view[3],
        });
      }

      setPages(infos);
      setActivePage(0);
      setCropBox(DEFAULT_BOX);
      setPerPage({});
      setPageInput('1');
      
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        if (isMobile && infos[0]) {
          const containerW = window.innerWidth - 32;
          const fitZoom = +(containerW / infos[0].pdfW).toFixed(2);
          setZoom(Math.min(1.5, Math.max(0.3, fitZoom)));
        } else {
          setZoom(1);
        }
      }
      
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Error loading PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCrop = async () => {
    if (!pdfFile.current) return;
    setProcessing(true);

    try {
      const arrayBuffer = await pdfFile.current.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pdfPages.forEach((page, idx) => {
        const box = mode === 'all' ? cropBox : (perPage[idx] || cropBox);
        const { width, height } = page.getSize();
        
        page.setCropBox(
          box.x * width,
          (1 - box.y - box.h) * height,
          box.w * width,
          box.h * height
        );
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Error cropping PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const switchPage = (idx: number) => {
    if (mode === 'per') {
      setPerPage(prev => ({ ...prev, [activePage]: cropBox }));
      setCropBox(perPage[idx] || DEFAULT_BOX);
    }
    setActivePage(idx);
    setPageInput(String(idx + 1));
  };

  const switchMode = (m: 'all' | 'per') => {
    if (m === 'all') {
      setPerPage({});
    } else {
      setPerPage({ [activePage]: cropBox });
    }
    setMode(m);
  };

  const onHandleDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.preventDefault();
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startBox = { ...cropBox };
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    const onMove = (me: MouseEvent | TouchEvent) => {
      const curX = 'touches' in me ? me.touches[0].clientX : me.clientX;
      const curY = 'touches' in me ? me.touches[0].clientY : me.clientY;
      const dx = (curX - startX) / (rect.width);
      const dy = (curY - startY) / (rect.height);

      setCropBox(prev => {
        let { x, y, w, h } = { ...prev };
        if (id === 'move') { x = Math.max(0, Math.min(1 - w, startBox.x + dx)); y = Math.max(0, Math.min(1 - h, startBox.y + dy)); }
        else if (id === 'tl') { x = Math.max(0, Math.min(startBox.x + startBox.w - 0.05, startBox.x + dx)); y = Math.max(0, Math.min(startBox.y + startBox.h - 0.05, startBox.y + dy)); w = startBox.w - (x - startBox.x); h = startBox.h - (y - startBox.y); }
        else if (id === 'tr') { y = Math.max(0, Math.min(startBox.y + startBox.h - 0.05, startBox.y + dy)); w = Math.max(0.05, Math.min(1 - x, startBox.w + dx)); h = startBox.h - (y - startBox.y); }
        else if (id === 'bl') { x = Math.max(0, Math.min(startBox.x + startBox.w - 0.05, startBox.x + dx)); w = startBox.w - (x - startBox.x); h = Math.max(0.05, Math.min(1 - y, startBox.h + dy)); }
        else if (id === 'br') { w = Math.max(0.05, Math.min(1 - x, startBox.w + dx)); h = Math.max(0.05, Math.min(1 - y, startBox.h + dy)); }
        else if (id === 't') { y = Math.max(0, Math.min(startBox.y + startBox.h - 0.05, startBox.y + dy)); h = startBox.h - (y - startBox.y); }
        else if (id === 'b') { h = Math.max(0.05, Math.min(1 - y, startBox.h + dy)); }
        else if (id === 'l') { x = Math.max(0, Math.min(startBox.x + startBox.w - 0.05, startBox.x + dx)); w = startBox.w - (x - startBox.x); }
        else if (id === 'r') { w = Math.max(0.05, Math.min(1 - x, startBox.w + dx)); }
        return { x, y, w, h };
      });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const handles = [
    { id: 'tl', cursor: 'nwse-resize', style: { top: 0, left: 0 } },
    { id: 'tr', cursor: 'nesw-resize', style: { top: 0, right: 0 } },
    { id: 'bl', cursor: 'nesw-resize', style: { bottom: 0, left: 0 } },
    { id: 'br', cursor: 'nwse-resize', style: { bottom: 0, right: 0 } },
    { id: 't', cursor: 'ns-resize', style: { top: 0, left: '50%', transform: 'translateX(-50%)' } },
    { id: 'b', cursor: 'ns-resize', style: { bottom: 0, left: '50%', transform: 'translateX(-50%)' } },
    { id: 'l', cursor: 'ew-resize', style: { top: '50%', left: 0, transform: 'translateY(-50%)' } },
    { id: 'r', cursor: 'ew-resize', style: { top: '50%', right: 0, transform: 'translateY(-50%)' } },
  ];

  const renderStep1 = () => (
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

  const renderStep2 = () => (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div className="h-[65vh] lg:h-auto flex-1 flex flex-col overflow-hidden relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
        <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-900/50 scrollbar-hide">
          <div className="min-h-full min-w-full flex items-center justify-center p-4 sm:p-12 pb-24 lg:pb-12">
            {pg && (
              <div ref={previewRef} className="relative select-none shadow-2xl bg-white shrink-0" style={{ width: `${Math.round(pg.pdfW * zoom)}px`, height: `${Math.round(pg.pdfH * zoom)}px` }}>
                <img src={pg.dataUrl} alt="Page preview" className="w-full h-full object-fill pointer-events-none" draggable={false} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.45) ${cropBox.y * 100}%, transparent ${cropBox.y * 100}%, transparent ${(cropBox.y + cropBox.h) * 100}%, rgba(0,0,0,0.45) ${(cropBox.y + cropBox.h) * 100}%)` }} />
                <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, left: 0, width: `${cropBox.x * 100}%`, background: 'rgba(0,0,0,0.45)' }} />
                <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, right: 0, width: `${(1 - cropBox.x - cropBox.w) * 100}%`, background: 'rgba(0,0,0,0.45)' }} />
                <div className="absolute" style={{ left: `${cropBox.x * 100}%`, top: `${cropBox.y * 100}%`, width: `${cropBox.w * 100}%`, height: `${cropBox.h * 100}%`, cursor: 'move', border: '2px solid #f97316', boxShadow: '0 0 0 9999px rgba(0,0,0,0)' }} onMouseDown={e => onHandleDown(e, 'move')} onTouchStart={e => onHandleDown(e, 'move')}>
                  <div className="absolute inset-0 pointer-events-none">
                    {[1,2].map(n => <div key={`v${n}`} className="absolute top-0 bottom-0" style={{ left: `${n*33.33}%`, borderLeft: '1px solid rgba(249,115,22,0.3)' }} />)}
                    {[1,2].map(n => <div key={`h${n}`} className="absolute left-0 right-0" style={{ top: `${n*33.33}%`, borderTop: '1px solid rgba(249,115,22,0.3)' }} />)}
                  </div>
                  {handles.map(h => (
                    <div key={h.id} className="absolute w-5 h-5 sm:w-3 sm:h-3 bg-orange-500 rounded-sm shadow-md z-10 -m-2.5 sm:-m-1.5 border border-white" style={{ ...h.style, cursor: h.cursor }} onMouseDown={e => onHandleDown(e, h.id)} onTouchStart={e => onHandleDown(e, h.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 shrink-0 bg-slate-900/95 backdrop-blur-lg text-white flex items-center justify-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl z-50 rounded-full lg:rounded-none border border-white/10 lg:border-0 lg:border-t lg:w-full">
          <div className="flex items-center gap-0.5">
            <button onClick={() => switchPage(Math.max(0, activePage - 1))} disabled={activePage === 0} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 disabled:opacity-20"><ChevronUp size={18} className="sm:w-4 sm:h-4" /></button>
            <button onClick={() => switchPage(Math.min(pages.length - 1, activePage + 1))} disabled={activePage === pages.length - 1} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 disabled:opacity-20"><ChevronDown size={18} className="sm:w-4 sm:h-4" /></button>
          </div>
          <div className="flex items-center gap-1 mx-1.5 sm:mx-3">
            <input type="text" value={pageInput} onChange={e => setPageInput(e.target.value)} onBlur={() => { const n = parseInt(pageInput); if (!isNaN(n) && n >= 1 && n <= pages.length) switchPage(n - 1); else setPageInput(String(activePage + 1)); }} className="w-8 sm:w-12 text-center bg-white/10 border border-white/20 rounded-md text-[10px] sm:text-sm py-0.5 sm:py-1 outline-none focus:border-orange-400" />
            <span className="text-white/30 text-[10px] sm:text-sm font-bold">/ {pages.length}</span>
          </div>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <div className="flex items-center gap-0.5">
            <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10"><ZoomOut size={18} className="sm:w-4 sm:h-4" /></button>
            <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10"><ZoomIn size={18} className="sm:w-4 sm:h-4" /></button>
          </div>
          <span className="text-[10px] sm:text-sm w-9 sm:w-14 text-center text-white/70 font-black tracking-tight">{zoomPct}%</span>
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-800 flex flex-col shadow-2xl z-30 overflow-hidden border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
        <div className="px-5 py-2.5 lg:py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
          <h2 className="text-[11px] lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider truncate mr-2">Crop Options</h2>
          <button onClick={() => setCropBox(DEFAULT_BOX)} className="shrink-0 text-[10px] lg:text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 transition-colors"><RotateCcw size={12} /> Reset</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 lg:px-5 py-3 lg:py-6 space-y-4 lg:space-y-6 scrollbar-hide">
          <div className="space-y-2 lg:space-y-3">
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-400">Apply to:</p>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              <button onClick={() => switchMode('all')} className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl border-2 transition-all ${mode === 'all' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/5' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}>
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${mode === 'all' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>{mode === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                <span className={`text-[11px] sm:text-sm font-bold ${mode === 'all' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>All Pages</span>
              </button>
              <button onClick={() => switchMode('per')} className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl border-2 transition-all ${mode === 'per' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/5' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}>
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${mode === 'per' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>{mode === 'per' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                <span className={`text-[11px] sm:text-sm font-bold ${mode === 'per' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>Current Only</span>
              </button>
            </div>
          </div>
          {pg && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 lg:p-4 border border-slate-100 dark:border-slate-700 shadow-inner">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className="flex items-center gap-2"><Maximize2 size={12} className="text-slate-400" /><p className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-400">Dimensions</p></div>
                <div className="px-1 py-0.5 rounded bg-orange-100 dark:bg-orange-500/20 text-[8px] font-black text-orange-600 dark:text-orange-400">PT</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center flex-1"><p className="text-[13px] lg:text-base font-black text-slate-900 dark:text-white leading-none">{Math.round(cropBox.w * pg.pdfW)}</p><p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Width</p></div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" /><div className="text-center flex-1"><p className="text-[13px] lg:text-base font-black text-slate-900 dark:text-white leading-none">{Math.round(cropBox.h * pg.pdfH)}</p><p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Height</p></div>
              </div>
            </div>
          )}
          <div className="flex gap-2 bg-blue-50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-xl p-2.5 lg:p-3">
            <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[9px] lg:text-xs text-blue-700/60 dark:text-blue-300/60 leading-relaxed font-medium">Drag handles to select area.</p>
          </div>
        </div>
        <div className="px-5 py-3 lg:py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button onClick={handleCrop} disabled={processing} className="w-full py-3.5 lg:py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-black text-[13px] lg:text-lg shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 lg:gap-3 transition-all active:scale-[0.98]">
            {processing ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            {processing ? 'Processing...' : 'Crop PDF Now'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
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
          <a href={result!} download="cropped.pdf" className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all">
            <Download size={18} /> Download PDF
          </a>
          <button onClick={() => { setStep(1); setResult(null); setPages([]); }} className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-all">
            Crop Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
