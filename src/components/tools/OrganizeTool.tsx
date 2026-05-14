"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, RefreshCw, 
  Trash2, ArrowDownUp, RotateCw, FilePlus, 
  CheckCircle2, LayoutGrid, FileSymlink,
  Settings, ChevronDown, MousePointer2
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PdfPage {
  id: string;
  fileIndex: number;
  pageIndex: number;
  thumbnail: string;
  rotation: number;
  fileName: string;
}

interface LoadedFile {
  file: File;
  name: string;
}

function SortableItem({ page, onRotate, onDelete }: {
  page: PdfPage;
  onRotate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto' as any,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-[3/4] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 overflow-hidden select-none group hover:border-orange-200 transition-all"
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-900/50">
        <img
          src={page.thumbnail}
          alt={`Page ${page.pageIndex + 1}`}
          className="max-w-full max-h-full shadow-lg transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* Drag handle overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      />

      {/* Page number badge */}
      <div className="absolute bottom-3 left-3 z-20 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/20 tracking-tighter">
        PAGE {page.pageIndex + 1}
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onPointerDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRotate(page.id); }}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-xl text-slate-600 hover:text-orange-500 hover:scale-110 transition-all"
        >
          <RotateCw size={14} />
        </button>
        <button
          onPointerDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-xl text-slate-600 hover:text-red-500 hover:scale-110 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* File origin badge */}
      <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm">
        {page.fileName.slice(0, 3)}
      </div>
    </div>
  );
}

export default function OrganizeTool({ id: _id }: { id: string }) {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#f97316";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#f97316,#ea580c)";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const generateThumbnails = async (file: File, fileIdx: number) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const newPages: PdfPage[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (context) {
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        newPages.push({
          id: `${fileIdx}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          fileIndex: fileIdx,
          pageIndex: i - 1,
          thumbnail: canvas.toDataURL(),
          rotation: 0,
          fileName: file.name,
        });
      }
    }
    return newPages;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLoadingPages(true);
    const newFiles = Array.from(e.target.files);
    const updatedFilesList = [...files];
    let allNewPages: PdfPage[] = [];
    for (const file of newFiles) {
      const fileIdx = updatedFilesList.length;
      updatedFilesList.push({ file, name: file.name });
      const rendered = await generateThumbnails(file, fileIdx);
      allNewPages = [...allNewPages, ...rendered];
    }
    setFiles(updatedFilesList);
    setPages(prev => [...prev, ...allNewPages]);
    setLoadingPages(false);
    setResult(null);
    e.target.value = '';
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;
    setLoadingPages(true);
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith(".pdf"));
    const updatedFilesList = [...files];
    let allNewPages: PdfPage[] = [];
    for (const file of newFiles) {
      const fileIdx = updatedFilesList.length;
      updatedFilesList.push({ file, name: file.name });
      const rendered = await generateThumbnails(file, fileIdx);
      allNewPages = [...allNewPages, ...rendered];
    }
    setFiles(updatedFilesList);
    setPages(prev => [...prev, ...allNewPages]);
    setLoadingPages(false);
    setResult(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      setPages(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const rotatePage = (id: string) => setPages(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  const deletePage = (id: string) => setPages(prev => prev.filter(p => p.id !== id));
  const reverseOrder = () => setPages(prev => [...prev].reverse());
  const rotateAll = () => setPages(prev => prev.map(p => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  const resetAll = () => { setFiles([]); setPages([]); setResult(null); };

  const handleProcess = async () => {
    if (!pages.length) return;
    setProcessing(true);
    try {
      const organizedPdf = await PDFDocument.create();
      const docCache: Record<number, PDFDocument> = {};
      for (let i = 0; i < files.length; i++) {
        docCache[i] = await PDFDocument.load(await files[i].file.arrayBuffer());
      }
      for (const pageMeta of pages) {
        const [copiedPage] = await organizedPdf.copyPages(docCache[pageMeta.fileIndex], [pageMeta.pageIndex]);
        if (pageMeta.rotation !== 0) {
          copiedPage.setRotation(degrees((copiedPage.getRotation().angle + pageMeta.rotation) % 360));
        }
        organizedPdf.addPage(copiedPage);
      }
      const pdfBytes = await organizedPdf.save();
      setResult({ url: URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })), filename: 'organized_document.pdf' });
    } catch (err) {
      console.error(err);
      alert("Error generating PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Settings Sidebar */}
        <div className={`w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0`}>
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Organizer Tools</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Tools</h3>
              <button onClick={resetAll} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset All</button>
            </div>
            
            <div className="space-y-6 text-left">
              {/* Batch Controls */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={rotateAll} disabled={pages.length === 0} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">
                    <RefreshCw size={16} /> Rotate All
                  </button>
                  <button onClick={reverseOrder} disabled={pages.length === 0} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">
                    <ArrowDownUp size={16} /> Reverse
                  </button>
                </div>
              </div>

              {/* File list */}
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileSymlink size={14} /> Sources ({files.length})
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-orange-200">
                      <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-orange-500 shadow-sm shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black truncate text-slate-900 dark:text-white uppercase">{file.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{pages.filter(p => p.fileIndex === idx).length} Pages</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors mt-2">
                  <FilePlus size={14} /> Add More Files
                </button>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-50 dark:border-slate-700">
                {!result ? (
                  <button
                    onClick={handleProcess}
                    disabled={processing || pages.length === 0}
                    className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-orange-500/20"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Finalizing...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">Organize &amp; Save <LayoutGrid size={24} /></span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="text-xs font-black text-green-700 uppercase tracking-tighter leading-tight">PDF successfully reconstructed!</span>
                    </div>
                    <a
                      href={result.url}
                      download={result.filename}
                      className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter shadow-orange-500/20"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Download size={24} /> Download
                    </a>
                    <button onClick={resetAll} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Start Over</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl min-h-[600px] flex flex-col w-full relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          <input type="file" multiple ref={fileInputRef} onChange={onFileChange} accept=".pdf" className="hidden" />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-orange-500/20" style={{ background: ACCENT_GRADIENT }}>
              <LayoutGrid size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Organize PDF Pages</h2>
            {pages.length > 0 && <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto">Drag and drop to reorder. Rotate or delete individual pages below.</p>}
          </div>

          {pages.length === 0 && !loadingPages && (
            <div
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 sm:p-20 hover:border-orange-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 group relative z-10"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center">Select PDFs to Organize</div>
              <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center uppercase tracking-widest">Visual batch reorder & merge</p>
              <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all" style={{ background: ACCENT_GRADIENT }}>
                Upload Files
              </button>
            </div>
          )}

          {loadingPages && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 size={64} className="animate-spin text-orange-500" />
                <LayoutGrid className="absolute inset-0 m-auto text-orange-500/20" size={32} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter animate-pulse">Generating Thumbnails</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Scanning locally in your browser</p>
              </div>
            </div>
          )}

          {!loadingPages && pages.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveId(e.active.id as string)}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar p-1 relative z-10">
                <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                  {pages.map(page => (
                    <SortableItem key={page.id} page={page} onRotate={rotatePage} onDelete={deletePage} />
                  ))}
                </SortableContext>
                
                {/* Add more button in grid */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-all bg-slate-50/20 group shadow-sm"
                >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md transition-transform group-hover:scale-110"><FilePlus size={24} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Add More</span>
                </button>
              </div>

              <DragOverlay adjustScale={true}>
                {activeId ? (
                  <div className="aspect-[3/4] w-32 bg-white rounded-2xl shadow-2xl border-4 border-orange-500 overflow-hidden opacity-90 pointer-events-none ring-8 ring-orange-500/20">
                    <img
                      src={pages.find(p => p.id === activeId)?.thumbnail}
                      className="w-full h-full object-contain p-1"
                      style={{ transform: `rotate(${pages.find(p => p.id === activeId)?.rotation}deg)` }}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* Tips footer */}
          {pages.length > 0 && !result && (
            <div className="relative z-10 mt-10 pt-8 border-t border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 text-slate-400">
                <MousePointer2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Drag pages to reorder</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <RotateCw size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Rotate Individual Pages</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffedd5; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
