"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Crop, Download, Loader2, X, Zap, FileText, 
  CheckCircle2, Settings, ChevronDown, ShieldCheck,
  Maximize2, RotateCcw, ZoomIn, ZoomOut, ChevronUp, Info,
  MousePointer2, Shield, RefreshCw, Layers, History
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';

type PageData = {
  pageNum: number;
  dataUrl: string;
  pdfW: number;
  pdfH: number;
};

type CropBox = { x: number; y: number; w: number; h: number };

const DEFAULT_BOX: CropBox = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };

interface CropFile {
  id: string;
  file: File;
  pages: PageData[];
  status: "pending" | "processing" | "done" | "error";
  resultUrl?: string;
  cropBox: CropBox;
}

export default function CropPdf({ id: _id }: { id: string }) {
  const [files, setFiles] = useState<CropFile[]>([]);
  const [activeFileIdx, setActiveFileIdx] = useState<number>(-1);
  const [activePage, setActivePage] = useState(0);
  const [cropBox, setCropBox] = useState<CropBox>(DEFAULT_BOX);
  const [mode, setMode] = useState<'all' | 'per'>('all');
  const [zoom, setZoom] = useState(0.75);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [step, setStep] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const ACCENT = "#f97316";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#f97316,#ea580c)";

  const loadFile = async (f: File) => {
    setLoading(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const pages: PageData[] = [];
      
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i);
        const viewport = pg.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pg.render({ canvasContext: canvas.getContext("2d")!, viewport, canvas }).promise;
        pages.push({
          pageNum: i,
          dataUrl: canvas.toDataURL('image/jpeg', 0.8),
          pdfW: pg.view[2],
          pdfH: pg.view[3]
        });
      }
      
      const newFile: CropFile = {
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        pages,
        status: "pending",
        cropBox: DEFAULT_BOX
      };
      
      setFiles(prev => [...prev, newFile]);
      if (activeFileIdx === -1) setActiveFileIdx(files.length);
      setStep(2);
      if (window.innerWidth < 1024) setShowSidebar(false);
    } catch (err) {
      console.error(err);
      alert("Error loading PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (fList: FileList | null) => {
    if (!fList) return;
    Array.from(fList).forEach(f => loadFile(f));
  };

  const handleCrop = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const updatedFiles = [...files];
      for (let i = 0; i < updatedFiles.length; i++) {
        const entry = updatedFiles[i];
        if (entry.status === 'done') continue;

        const srcDoc = await PDFDocument.load(await entry.file.arrayBuffer());
        const newDoc = await PDFDocument.create();
        const pages = srcDoc.getPages();
        
        for (let pIdx = 0; pIdx < pages.length; pIdx++) {
          const page = pages[pIdx];
          const { width, height } = page.getSize();
          
          // Use either global cropBox or the one specific to the file
          const box = mode === 'all' ? cropBox : entry.cropBox;
          
          const cropW = width * box.w;
          const cropH = height * box.h;
          const cropX = width * box.x;
          const cropY = height * (1 - box.y - box.h); // PDF coordinate system is bottom-left

          const [copiedPage] = await newDoc.copyPages(srcDoc, [pIdx]);
          copiedPage.setCropBox(cropX, cropY, cropW, cropH);
          newDoc.addPage(copiedPage);
        }
        
        const bytes = await newDoc.save();
        updatedFiles[i] = {
          ...entry,
          status: "done",
          resultUrl: URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }))
        };
        setFiles([...updatedFiles]);
      }
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Crop failed.");
    } finally {
      setProcessing(false);
    }
  };

  const onHandleDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startBox = { ...cropBox };

    const onMove = (me: MouseEvent | TouchEvent) => {
      const curX = 'touches' in me ? me.touches[0].clientX : me.clientX;
      const curY = 'touches' in me ? me.touches[0].clientY : me.clientY;
      const dx = (curX - startX) / rect.width;
      const dy = (curY - startY) / rect.height;

      setCropBox(prev => {
        let { x, y, w, h } = { ...prev };
        if (id === 'move') {
          x = Math.max(0, Math.min(1 - w, startBox.x + dx));
          y = Math.max(0, Math.min(1 - h, startBox.y + dy));
        } else if (id === 'tl') {
          x = Math.max(0, Math.min(startBox.x + startBox.w - 0.05, startBox.x + dx));
          y = Math.max(0, Math.min(startBox.y + startBox.h - 0.05, startBox.y + dy));
          w = startBox.w - (x - startBox.x);
          h = startBox.h - (y - startBox.y);
        } else if (id === 'br') {
          w = Math.max(0.05, Math.min(1 - x, startBox.w + dx));
          h = Math.max(0.05, Math.min(1 - y, startBox.h + dy));
        } else if (id === 'tr') {
          y = Math.max(0, Math.min(startBox.y + startBox.h - 0.05, startBox.y + dy));
          w = Math.max(0.05, Math.min(1 - x, startBox.w + dx));
          h = startBox.h - (y - startBox.y);
        } else if (id === 'bl') {
          x = Math.max(0, Math.min(startBox.x + startBox.w - 0.05, startBox.x + dx));
          w = startBox.w - (x - startBox.x);
          h = Math.max(0.05, Math.min(1 - y, startBox.h + dy));
        }
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

  const reset = () => {
    files.forEach(f => f.resultUrl && URL.revokeObjectURL(f.resultUrl));
    setFiles([]);
    setStep(1);
    setActiveFileIdx(-1);
    setCropBox(DEFAULT_BOX);
  };

  const activeFile = files[activeFileIdx];
  const activePg = activeFile?.pages[activePage];

  const renderStep1 = () => (
    <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl p-8 flex-shrink-0 space-y-10">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-outfit text-[11px] font-medium uppercase tracking-widest">
              <Zap size={12} /> Capabilities
            </div>
            <h3 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Advanced <br/> PDF Cropping</h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Precision tool for trimming PDF documents perfectly.</p>
          </div>
          
          <div className="space-y-6 text-left">
            {[
              { icon: MousePointer2, title: "Precision Tool", desc: "Drag to define area." },
              { icon: Layers, title: "Batch Support", desc: "Crop multiple PDFs." },
              { icon: Shield, title: "100% Private", desc: "Secure local execution." },
              { icon: RefreshCw, title: "Fast Engine", desc: "Instant visual feedback." }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-orange-500 shrink-0">
                  <f.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{f.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 text-left">
            <div className="bg-orange-50 dark:bg-orange-500/5 rounded-2xl p-4 border border-orange-100/50 dark:border-orange-500/10">
              <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-[11px] text-orange-700/70 dark:text-orange-400/70 font-medium uppercase">Ready to process</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] p-4 sm:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl text-center min-h-[400px] sm:min-h-[650px] flex flex-col justify-center relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 space-y-8 sm:space-y-12">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] sm:rounded-[48px] p-8 sm:p-24 hover:border-orange-400 hover:bg-orange-50/5 transition-all cursor-pointer bg-slate-50/30 dark:bg-slate-900/30 group/zone"
              onClick={() => fileInputRef.current?.click()}>
              <div className="flex flex-col items-center gap-6 sm:gap-10">
                <div className="p-6 sm:p-10 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[32px] text-orange-500 shadow-2xl group-hover/zone:scale-110 transition-transform">
                  <Upload className="w-10 h-10 sm:w-[72px] sm:h-[72px]" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-lg sm:text-xl font-black text-slate-800 dark:text-white mb-1 leading-none">Select PDFs</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Drop files here to start</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Workspace Sidebar - Toggleable Drawer for Desktop & Mobile */}
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
           <div className="space-y-4 text-left">
              <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Active Queue ({files.length})</span>
              <div className="space-y-3">
                {files.map((f, i) => (
                  <button key={f.id} onClick={() => { setActiveFileIdx(i); setActivePage(0); }} 
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${activeFileIdx === i ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-100'}`}>
                    <div className={`p-2 rounded-lg ${activeFileIdx === i ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0 text-left">
                       <p className={`text-xs font-medium uppercase truncate ${activeFileIdx === i ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{f.file.name}</p>
                       <p className="text-[9px] font-medium text-slate-400 uppercase">{f.pages.length} Pages</p>
                    </div>
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4 text-left pt-6 border-t border-slate-50 dark:border-slate-800">
              <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Configuration</span>
              <div className="space-y-3">
                 <button onClick={() => setMode('all')} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${mode === 'all' ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/5' : 'border-slate-50 dark:border-slate-800'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'all' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                       {mode === 'all' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                       <p className={`text-xs font-medium uppercase ${mode === 'all' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Global Crop</p>
                       <p className="text-[9px] font-medium text-slate-400 uppercase">Same box for all pages</p>
                    </div>
                 </button>
                 <button onClick={() => setMode('per')} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${mode === 'per' ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/5' : 'border-slate-50 dark:border-slate-800'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'per' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                       {mode === 'per' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                       <p className={`text-xs font-medium uppercase ${mode === 'per' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Individual</p>
                       <p className="text-[9px] font-medium text-slate-400 uppercase">Custom per document</p>
                    </div>
                 </button>
              </div>
           </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 fixed bottom-0 left-0 w-full sm:w-96 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <button onClick={handleCrop} disabled={processing} className="w-full py-4 sm:py-5 bg-orange-500 text-white rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all">
              {processing ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Export Batch'}
           </button>
        </div>
        </div>
      </div>

      {/* Main Container - Adjusts width based on Sidebar */}
      <div className={`flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950 overflow-hidden transition-all duration-500 ${showSidebar ? 'lg:pl-[384px]' : 'pl-0'}`}>
         {/* Top toolbar */}
         <div className="h-14 sm:h-16 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 relative">
            <div className="flex items-center gap-2 sm:gap-4">
               {!showSidebar && (
                 <button onClick={() => setShowSidebar(true)} className="p-2 bg-orange-500 text-white rounded-xl shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all mr-2">
                    <Settings size={18} />
                 </button>
               )}
               <button onClick={() => setActivePage(p => Math.max(0, p - 1))} className="p-1.5 sm:p-2 text-slate-400 hover:text-orange-500"><ChevronUp size={18} /></button>
               <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">P. {activePage + 1} / {activeFile?.pages.length || 0}</span>
               <button onClick={() => setActivePage(p => Math.min((activeFile?.pages.length || 1) - 1, p + 1))} className="p-1.5 sm:p-2 text-slate-400 hover:text-orange-500 rotate-180"><ChevronUp size={18} /></button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
               <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="p-1.5 sm:p-2 text-slate-400 hover:text-orange-500"><ZoomOut size={18} /></button>
               <span className="w-10 sm:w-12 text-center text-[9px] sm:text-[10px] font-black uppercase text-slate-900 dark:text-white">{Math.round(zoom * 100)}%</span>
               <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1.5 sm:p-2 text-slate-400 hover:text-orange-500"><ZoomIn size={18} /></button>
            </div>
         </div>

         {/* Visual Workspace */}
         <div className="flex-1 overflow-auto p-10 flex items-center justify-center custom-scrollbar">
            {activePg && (
              <div ref={previewRef} className="relative shadow-[0_40px_100px_rgba(0,0,0,0.2)] bg-white shrink-0 group/canvas" style={{ width: activePg.pdfW * zoom, height: activePg.pdfH * zoom }}>
                <img src={activePg.dataUrl} className="w-full h-full object-fill select-none pointer-events-none" alt="PDF Page" draggable={false} />
                
                {/* Overlay Darkener */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity" />

                {/* Crop Box */}
                <div className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move touch-none" 
                  style={{ 
                    left: `${cropBox.x * 100}%`, 
                    top: `${cropBox.y * 100}%`, 
                    width: `${cropBox.w * 100}%`, 
                    height: `${cropBox.h * 100}%`,
                    border: '2px solid #f97316',
                    touchAction: 'none'
                  }}
                  onMouseDown={e => onHandleDown(e, 'move')}
                  onTouchStart={e => onHandleDown(e, 'move')}
                >
                  <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                    <div className="h-px bg-orange-500/30 w-full" />
                    <div className="h-px bg-orange-500/30 w-full" />
                  </div>
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                    <div className="w-px bg-orange-500/30 h-full" />
                    <div className="w-px bg-orange-500/30 h-full" />
                  </div>

                  {/* Handles */}
                  {[
                    { id: 'tl', style: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2' },
                    { id: 'tr', style: 'top-0 right-0 translate-x-1/2 -translate-y-1/2' },
                    { id: 'bl', style: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' },
                    { id: 'br', style: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2' }
                  ].map(h => (
                    <div key={h.id} onMouseDown={e => { e.stopPropagation(); onHandleDown(e, h.id); }} onTouchStart={e => { e.stopPropagation(); onHandleDown(e, h.id); }}
                      className={`absolute w-5 h-5 bg-white border-4 border-orange-500 rounded-full shadow-2xl cursor-pointer hover:scale-150 transition-transform ${h.style} z-10 touch-none`}
                      style={{ touchAction: 'none' }} />
                  ))}
                </div>
              </div>
            )}
         </div>

         {/* Bottom Floating Info */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl pointer-events-none">
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-medium uppercase text-slate-400">Width</span>
               <span className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">{activePg ? Math.round(cropBox.w * activePg.pdfW) : 0} pt</span>
            </div>
            <div className="w-px h-6 bg-slate-100 dark:bg-slate-800" />
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-medium uppercase text-slate-400">Height</span>
               <span className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">{activePg ? Math.round(cropBox.h * activePg.pdfH) : 0} pt</span>
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
             <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Batch Process Ready!</h2>
             <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-xs">Successfully cropped {files.length} documents.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
             {files.map((f, i) => (
               <div key={f.id} className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 sm:gap-4 text-left min-w-0">
                     <div className="p-2 sm:p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-orange-500 shrink-0"><FileText size={18} /></div>
                     <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase truncate text-slate-900 dark:text-white">{f.file.name}</p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase">Ready for pickup</p>
                     </div>
                  </div>
                  <a href={f.resultUrl} download={`cropped_${f.file.name}`} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                     <Download size={14} /> Download
                  </a>
               </div>
             ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-50 dark:border-slate-800">
             <button onClick={reset} className="w-full sm:w-auto px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Start New Batch</button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center gap-6">
           <div className="relative">
              <Loader2 size={64} className="animate-spin text-orange-500" />
              <Zap className="absolute inset-0 m-auto text-orange-500/20" size={32} />
           </div>
           <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">Rendering Engine Booting...</p>
        </div>
      )}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <input ref={fileInputRef} type="file" multiple accept=".pdf" onChange={e => handleFiles(e.target.files)} className="hidden" />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>
    </div>
  );
}



