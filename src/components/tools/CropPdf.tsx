'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Crop, Loader2, ArrowRight, 
  CheckCircle2, Info, Maximize2, ZoomIn, ZoomOut, 
  ChevronUp, ChevronDown, RotateCcw, Zap, MousePointer2,
  Layers, Shield, RefreshCw
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import type * as PDFJS from 'pdfjs-dist';

const DEFAULT_BOX = { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };

export default function CropPdf({ id: _id }: { id: string }) {
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
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
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
        await page.render({ canvasContext: context!, viewport, canvas }).promise;
        
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
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
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
    <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl p-8 flex-shrink-0 space-y-10">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
              <Zap size={12} /> Tool Capabilities
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">Professional <br/> PDF Cropping</h3>
            <p className="text-slate-400 text-xs font-medium">All processing occurs locally on your hardware.</p>
          </div>
          
          <div className="space-y-6 text-left">
            {[
              { icon: MousePointer2, title: "Visual Precision", desc: "Pixel-perfect area selection." },
              { icon: Layers, title: "Batch Engine", desc: "Trim all pages in one click." },
              { icon: Shield, title: "Privacy First", desc: "Zero data ever leaves your browser." },
              { icon: RefreshCw, title: "High Speed", desc: "Optimized for large documents." }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-110 transition-transform">
                  <f.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{f.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 text-left">
            <div className="bg-orange-50 dark:bg-orange-500/5 rounded-2xl p-4 border border-orange-100/50 dark:border-orange-500/10">
              <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-[11px] text-orange-700/70 dark:text-orange-400/70 font-medium">System Ready for PDF Processing</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-[40px] p-8 sm:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl text-center min-h-[650px] flex flex-col justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
          
          <div className="relative z-10 space-y-12">
            <div className="relative group/zone border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[48px] p-16 sm:p-24 hover:border-orange-400 hover:bg-orange-50/5 transition-all cursor-pointer bg-slate-50/30 dark:bg-slate-900/30">
              <input ref={fileRef} type="file" accept=".pdf" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" />
              <div className="flex flex-col items-center gap-10">
                <div className="p-10 bg-white dark:bg-slate-800 rounded-[32px] text-orange-500 shadow-2xl group-hover/zone:scale-110 transition-transform">
                  <Upload size={72} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">Select PDF</h2>
                  <p className="text-slate-400 text-lg sm:text-xl font-bold uppercase tracking-widest">or drop your file here to start</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">100%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Private</p>
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">SECURE</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol</p>
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">FREE</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Forever</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col lg:flex-row min-h-[700px] bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col relative border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex-1 overflow-auto bg-slate-100/50 dark:bg-slate-900/50 min-h-[600px] scrollbar-hide">
          <div className="min-h-full min-w-full flex items-center justify-center p-4 sm:p-20 pb-32 lg:pb-20">
            {pg && (
              <div ref={previewRef} className="relative select-none shadow-2xl bg-white shrink-0" style={{ width: `${Math.round(pg.pdfW * zoom)}px`, height: `${Math.round(pg.pdfH * zoom)}px` }}>
                <img src={pg.dataUrl} alt="Page preview" className="w-full h-full object-fill pointer-events-none" draggable={false} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.45) ${cropBox.y * 100}%, transparent ${cropBox.y * 100}%, transparent ${(cropBox.y + cropBox.h) * 100}%, rgba(0,0,0,0.45) ${(cropBox.y + cropBox.h) * 100}%)` }} />
                <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, left: 0, width: `${cropBox.x * 100}%`, background: 'rgba(0,0,0,0.45)' }} />
                <div className="absolute pointer-events-none" style={{ top: `${cropBox.y * 100}%`, height: `${cropBox.h * 100}%`, right: 0, width: `${(1 - cropBox.x - cropBox.w) * 100}%`, background: 'rgba(0,0,0,0.45)' }} />
                <div className="absolute" style={{ left: `${cropBox.x * 100}%`, top: `${cropBox.y * 100}%`, width: `${cropBox.w * 100}%`, height: `${cropBox.h * 100}%`, cursor: 'move', border: '2px solid #f97316', boxShadow: '0 0 0 9999px rgba(0,0,0,0)' }} onMouseDown={e => onHandleDown(e, 'move')} onTouchStart={e => onHandleDown(e, 'move')}>
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2].map(n => <div key={`v${n}`} className="absolute top-0 bottom-0" style={{ left: `${n * 33.33}%`, borderLeft: '1px solid rgba(249,115,22,0.3)' }} />)}
                    {[1, 2].map(n => <div key={`h${n}`} className="absolute left-0 right-0" style={{ top: `${n * 33.33}%`, borderTop: '1px solid rgba(249,115,22,0.3)' }} />)}
                  </div>
                  {handles.map(h => (
                    <div key={h.id} className="absolute w-6 h-6 sm:w-4 sm:h-4 bg-orange-500 rounded-sm shadow-xl z-10 -m-3 sm:-m-2 border-2 border-white" style={{ ...h.style, cursor: h.cursor }} onMouseDown={e => onHandleDown(e, h.id)} onTouchStart={e => onHandleDown(e, h.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur-2xl text-white px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 rounded-[32px] border border-white/10">
          <div className="flex items-center gap-2">
            <button onClick={() => switchPage(Math.max(0, activePage - 1))} disabled={activePage === 0} className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all"><ChevronUp size={22} /></button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <input type="text" value={pageInput} onChange={e => setPageInput(e.target.value)} onBlur={() => { const n = parseInt(pageInput); if (!isNaN(n) && n >= 1 && n <= pages.length) switchPage(n - 1); else setPageInput(String(activePage + 1)); }} className="w-12 text-center bg-transparent text-lg font-black outline-none text-orange-400" />
              <span className="text-white/30 text-xs font-black uppercase tracking-widest">/ {pages.length}</span>
            </div>
            <button onClick={() => switchPage(Math.min(pages.length - 1, activePage + 1))} disabled={activePage === pages.length - 1} className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all"><ChevronDown size={22} /></button>
          </div>
          <div className="w-px h-10 bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))} className="p-2 rounded-xl hover:bg-white/10 transition-all"><ZoomOut size={22} /></button>
            <div className="w-20 text-center">
              <span className="text-lg font-black text-orange-400 tracking-tighter">{zoomPct}%</span>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Zoom</p>
            </div>
            <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))} className="p-2 rounded-xl hover:bg-white/10 transition-all"><ZoomIn size={22} /></button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 flex flex-col shadow-2xl z-30 overflow-hidden border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Crop Settings</h2>
          <button onClick={() => setCropBox(DEFAULT_BOX)} className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 transition-all active:scale-95">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide">
          <div className="space-y-4 text-left">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Application Scope</p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => switchMode('all')} className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${mode === 'all' ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${mode === 'all' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                    {mode === 'all' && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <div>
                    <span className={`text-base font-black uppercase tracking-tight block ${mode === 'all' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Apply to all</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global batch crop</span>
                  </div>
                </div>
              </button>
              <button onClick={() => switchMode('per')} className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${mode === 'per' ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${mode === 'per' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                    {mode === 'per' && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <div>
                    <span className={`text-base font-black uppercase tracking-tight block ${mode === 'per' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Current only</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Custom per page</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {pg && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-inner space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Maximize2 size={14} /> Output Size
                </p>
                <span className="text-[9px] font-black px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-500 uppercase tracking-widest">Points</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(cropBox.w * pg.pdfW)}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Width</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(cropBox.h * pg.pdfH)}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Height</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100/50 dark:border-blue-500/10 flex gap-4 text-left">
            <Info size={18} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 font-medium leading-relaxed">
              Selection area is automatically constrained within the original page boundaries.
            </p>
          </div>
        </div>
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={handleCrop} 
            disabled={processing} 
            className="w-full py-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
          >
            {processing ? <Loader2 className="animate-spin" size={28} /> : <Crop size={28} />}
            {processing ? 'Processing...' : 'Export Cropped PDF'}
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
