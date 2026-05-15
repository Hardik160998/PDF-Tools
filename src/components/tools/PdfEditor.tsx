"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Download, Loader2, X, FileText, Type, ImageIcon, 
  Square, Hash, Stamp, Trash2, Move, ChevronLeft, ChevronRight,
  MousePointer2, Plus, Settings2, CheckCircle2, RotateCcw, Layers
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type EditorElement = {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
  content?: string;
  page: number;
  fontSize?: number;
  color?: string;
};

export default function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'upload' | 'editing' | 'processing' | 'done'>('upload');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'shape'>('select');
  const [zoom, setZoom] = useState(0.8);

  // Editor State
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [shapeFill, setShapeFill] = useState('#ffffff'); // White-out by default

  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);

  const [aspectRatio, setAspectRatio] = useState<number>(1.414); // Default A4

  // ─── PDF Loading ─────────────────────────────────────────────────────────
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setStatus('processing');
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      const imgs: string[] = [];

      // Calculate Aspect Ratio from first page
      const firstPage = await pdf.getPage(1);
      const vp = firstPage.getViewport({ scale: 1 });
      setAspectRatio(vp.width / vp.height);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        imgs.push(canvas.toDataURL('image/jpeg', 0.85));
      }
      setPageImages(imgs);
      setStatus('editing');
      
      // Auto-fit logic
      setTimeout(() => {
        if (previewRef.current) {
          const workspace = previewRef.current.parentElement;
          if (workspace) {
            const pad = 80;
            const scaleX = (workspace.offsetWidth - pad) / 1000;
            setZoom(Math.min(1.2, Math.max(0.4, scaleX)));
          }
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert('Error loading PDF.');
      setStatus('upload');
    }
  };

  // ─── Interaction Handlers ────────────────────────────────────────────────
  const addElement = (type: 'text' | 'image' | 'shape', data?: string) => {
    const newEl: EditorElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 10, // Percent
      y: 10, // Percent
      width: type === 'text' ? 30 : 25, // Percent
      height: type === 'text' ? 8 : 20,  // Percent
      page: currentPage,
      content: type === 'text' ? 'Double click' : data,
      fontSize: type === 'text' ? fontSize : undefined,
      color: type === 'text' ? textColor : (type === 'shape' ? shapeFill : undefined),
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
    setTool('select');
  };

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const el = elements.find(item => item.id === id);
    if (!el) return;
    setSelectedId(id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent, id: string) => {
    const drag = dragRef.current;
    const container = previewRef.current;
    if (!drag || !container || selectedId !== id) return;
    
    const rect = container.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    
    setElements(prev => prev.map(el => el.id === id ? { 
      ...el, 
      x: Math.max(0, Math.min(100 - el.width, drag.elX + dx)), 
      y: Math.max(0, Math.min(100 - el.height, drag.elY + dy)) 
    } : el));
  };

  const onResizeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const el = elements.find(item => item.id === id);
    if (!el) return;
    setSelectedId(id);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, w: el.width, h: el.height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent, id: string) => {
    const resize = resizeRef.current;
    const container = previewRef.current;
    if (!resize || !container || selectedId !== id) return;

    const rect = container.getBoundingClientRect();
    const dx = ((e.clientX - resize.startX) / rect.width) * 100;
    const dy = ((e.clientY - resize.startY) / rect.height) * 100;

    setElements(prev => prev.map(el => el.id === id ? { 
      ...el, 
      width: Math.max(2, Math.min(100 - el.x, resize.w + dx)), 
      height: Math.max(2, Math.min(100 - el.y, resize.h + dy)) 
    } : el));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    resizeRef.current = null;
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addElement('image', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ─── Export Logic ────────────────────────────────────────────────────────
  const savePdf = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const el of elements) {
        const page = pages[el.page];
        const { width: pdfW, height: pdfH } = page.getSize();

        // Convert percentages to PDF units
        const x = (el.x / 100) * pdfW;
        const y = pdfH - ((el.y / 100) * pdfH);
        const w = (el.width / 100) * pdfW;
        const h = (el.height / 100) * pdfH;

        if (el.type === 'text') {
          page.drawText(el.content || '', {
            x: x,
            y: y - ((el.fontSize || 12) * (pdfW / 800)), // Approximate text baseline
            size: (el.fontSize || 12) * (pdfW / 800),
            font: helvetica,
            color: hexToRgb(el.color || '#000000'),
          });
        } else if (el.type === 'image') {
          const imgBytes = await fetch(el.content!).then(res => res.arrayBuffer());
          const img = el.content!.includes('png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
          page.drawImage(img, {
            x: x,
            y: y - h,
            width: w,
            height: h,
          });
        } else if (el.type === 'shape') {
          page.drawRectangle({
            x: x,
            y: y - h,
            width: w,
            height: h,
            color: hexToRgb(el.color || '#ffffff'),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (err) {
      console.error(err);
      alert('Error saving PDF.');
      setStatus('editing');
    }
  };

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  }

  const reset = () => {
    setFile(null);
    setStatus('upload');
    setElements([]);
    setPageImages([]);
    setResultUrl(null);
  };

  // ─── Rendering ───────────────────────────────────────────────────────────
  if (status === 'upload') {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-20 hover:border-pink-500 hover:bg-pink-50/20 transition-all cursor-pointer group">
          <input type="file" className="hidden" accept=".pdf" onChange={onFileChange} />
          <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center text-pink-500 mb-8 group-hover:scale-110 transition-transform">
            <Upload size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Edit Your PDF</h2>
          <p className="text-slate-400 font-medium mt-2">Add text, images, and white-out directly in your browser.</p>
        </label>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-6">
        <Loader2 size={64} className="animate-spin text-pink-500" />
        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Processing Document...</p>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-10">
        <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">PDF Edited Successfully!</h2>
          <p className="text-slate-500 font-medium">Your document has been updated with all changes.</p>
        </div>
        <div className="flex gap-4">
          <a href={resultUrl!} download="edited.pdf" className="flex-1 py-5 bg-pink-500 text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
            <Download size={24} /> Download Now
          </a>
          <button onClick={reset} className="px-10 py-5 bg-slate-100 dark:bg-slate-800 rounded-3xl font-bold transition-all hover:bg-slate-200">
            Edit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-sm z-[10]">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setTool('select')} className={`p-3 rounded-xl transition-all ${tool === 'select' ? 'bg-pink-500 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`} title="Select Tool">
            <MousePointer2 size={20} />
          </button>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 mx-1" />
          <button onClick={() => addElement('text')} className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 transition-all active:scale-95">
            <Type size={18} /> <span className="hidden sm:inline">Add Text</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer">
            <ImageIcon size={18} /> <span className="hidden sm:inline">Add Image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <button onClick={() => addElement('shape')} className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 transition-all active:scale-95">
            <Square size={18} /> <span className="hidden sm:inline">White-out</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
           {/* Zoom Controls */}
           <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
             <button onClick={() => setZoom(prev => Math.max(0.2, prev - 0.1))} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"><X size={14} className="rotate-45" /></button>
             <span className="text-[10px] font-black w-10 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"><Plus size={14} /></button>
             <button onClick={() => setZoom(0.8)} className="ml-2 text-[9px] font-black uppercase text-pink-500 hover:underline">Reset</button>
           </div>

          <button onClick={savePdf} className="px-6 sm:px-8 py-2.5 sm:py-3 bg-pink-500 text-white rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            Save PDF <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Workspace */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 sm:p-10 overflow-auto flex flex-col items-center min-h-[50vh] sm:min-h-0">
          
          <div className="mb-6 flex items-center gap-6 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft /></button>
            <span className="font-black text-sm uppercase tracking-widest text-slate-500">Page {currentPage + 1} of {pageImages.length}</span>
            <button onClick={() => setCurrentPage(p => Math.min(pageImages.length - 1, p + 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight /></button>
          </div>

          <div 
            className="relative select-none mb-20 transition-transform duration-200 ease-out origin-top"
            style={{ 
              transform: `scale(${zoom})`,
              width: '100%',
              maxWidth: '1000px',
              height: 'fit-content'
            }}
          >
            <div 
              ref={previewRef}
              className="relative bg-white shadow-2xl border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden w-full h-full"
            >
              <img 
                src={pageImages[currentPage]} 
                className="w-full h-auto block" 
                draggable={false} 
                alt="PDF Page Preview"
              />
            
              {elements.filter(el => el.page === currentPage).map(el => (
                <div
                  key={el.id}
                  className={`absolute group cursor-move ${selectedId === el.id ? 'ring-2 ring-pink-500' : 'ring-1 ring-transparent hover:ring-pink-300'} transition-shadow`}
                  style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%`, touchAction: 'none' }}
                  onPointerDown={e => onPointerDown(e, el.id)}
                  onPointerMove={e => onPointerMove(e, el.id)}
                  onPointerUp={handlePointerUp}
                >
                  {el.type === 'text' ? (
                    <div 
                      contentEditable 
                      suppressContentEditableWarning
                      className="w-full h-full p-1 outline-none break-words leading-tight overflow-hidden"
                      style={{ fontSize: (el.fontSize || 20) * (previewRef.current?.offsetWidth || 800) / 800, color: el.color, fontWeight: 'bold' }}
                      onBlur={(e) => setElements(prev => prev.map(item => item.id === el.id ? { ...item, content: e.target.innerText } : item))}
                    >
                      {el.content}
                    </div>
                  ) : el.type === 'image' ? (
                    <img src={el.content} className="w-full h-full object-contain pointer-events-none" draggable={false} />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: el.color }} />
                  )}

                  {/* Controls */}
                  <div className={`absolute -top-10 left-0 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 flex items-center gap-3 scale-0 group-hover:scale-100 transition-transform origin-bottom-left z-20 ${selectedId === el.id ? 'scale-100' : ''}`}>
                    <button onClick={() => removeElement(el.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    {el.type === 'text' && (
                      <div className="flex items-center gap-3">
                        <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                        <input type="color" value={el.color} onChange={(e) => setElements(prev => prev.map(i => i.id === el.id ? { ...i, color: e.target.value } : i))} className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer" />
                        <input type="number" value={el.fontSize} onChange={(e) => setElements(prev => prev.map(i => i.id === el.id ? { ...i, fontSize: parseInt(e.target.value) } : i))} className="w-12 bg-slate-50 border-0 text-xs font-bold px-1 rounded" />
                      </div>
                    )}
                    {el.type === 'shape' && (
                       <input type="color" value={el.color} onChange={(e) => setElements(prev => prev.map(i => i.id === el.id ? { ...i, color: e.target.value } : i))} className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer" />
                    )}
                  </div>

                  {/* Resize Handle */}
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 cursor-se-resize rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={e => onResizeDown(e, el.id)}
                    onPointerMove={e => onResizeMove(e, el.id)}
                    onPointerUp={handlePointerUp}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] h-auto lg:h-full bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-10 overflow-y-auto z-10">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Settings2 size={14} /> Global Settings
            </h3>
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Default Text Color</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-12 rounded-2xl border-0 p-1 bg-slate-50 cursor-pointer shadow-sm" />
                    <span className="font-bold text-sm uppercase">{textColor}</span>
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Default Font Size</label>
                  <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-pink-500" />
                  <div className="text-right font-black text-sm text-pink-500">{fontSize}px</div>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
             <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Layers size={14} /> Elements ({elements.length})
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {elements.map(el => (
                <div key={el.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${selectedId === el.id ? 'border-pink-500 bg-pink-50/20 shadow-md' : 'border-slate-100 bg-slate-50/50 hover:bg-white'}`} onClick={() => { setSelectedId(el.id); setCurrentPage(el.page); }}>
                   <div className="flex items-center gap-3">
                      {el.type === 'text' ? <Type size={16} className="text-blue-500" /> : el.type === 'image' ? <ImageIcon size={16} className="text-orange-500" /> : <Square size={16} className="text-purple-500" />}
                      <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{el.type === 'text' ? (el.content || 'Untitled Text') : el.type.toUpperCase()}</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-300">P{el.page + 1}</span>
                </div>
              ))}
              {elements.length === 0 && <p className="text-xs text-slate-400 font-medium text-center py-4">No elements added yet.</p>}
            </div>
          </div>

          <div className="mt-auto pb-10">
             <button onClick={reset} className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2">
                <RotateCcw size={14} /> Reset Editor
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
