"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, RefreshCw, 
  Trash2, ArrowDownUp, RotateCw, FilePlus, 
  Settings2, CheckCircle2, LayoutGrid, FileSymlink
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

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

// Sortable Item Component
function SortableItem({ page, onRotate, onDelete }: { 
  page: PdfPage, 
  onRotate: (id: string) => void, 
  onDelete: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group aspect-[3/4] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-orange-500 transition-colors"
    >
      {/* Drag Handle Overlay */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" 
      />

      {/* Thumbnail */}
      <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-900">
        <img 
          src={page.thumbnail} 
          alt={`Page ${page.pageIndex + 1}`}
          className="max-w-full max-h-full shadow-lg transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        />
      </div>

      {/* Page Number Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
        {page.pageIndex + 1}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onRotate(page.id); }}
          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
          title="Rotate 90°"
        >
          <RotateCw size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
          title="Delete Page"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {/* File Label (Source Indicator) */}
      <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded uppercase tracking-tighter">
        {page.fileName.slice(0, 1)}
      </div>
    </div>
  );
}

export default function OrganizeTool({ id }: { id: string }) {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateThumbnails = async (file: File, fileIdx: number) => {
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
          fileName: file.name
        });
      }
    }
    return newPages;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoadingPages(true);
      const newFiles = Array.from(e.target.files);
      const updatedFilesList = [...files];
      let allNewPages: PdfPage[] = [];

      for (const file of newFiles) {
        const fileIdx = updatedFilesList.length;
        updatedFilesList.push({ file, name: file.name });
        const renderedPages = await generateThumbnails(file, fileIdx);
        allNewPages = [...allNewPages, ...renderedPages];
      }

      setFiles(updatedFilesList);
      setPages(prev => [...prev, ...allNewPages]);
      setLoadingPages(false);
      setResult(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setPages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const rotatePage = (id: string) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  // Batch actions
  const reverseOrder = () => setPages(prev => [...prev].reverse());
  const rotateAll = () => setPages(prev => prev.map(p => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  const resetAll = () => {
    setFiles([]);
    setPages([]);
    setResult(null);
  };

  const handleProcess = async () => {
    if (pages.length === 0) return;
    setProcessing(true);
    try {
      const organizedPdf = await PDFDocument.create();
      
      // Cache opened PDF documents to avoid re-reading
      const docCache: Record<number, PDFDocument> = {};
      for (let i = 0; i < files.length; i++) {
        const bytes = await files[i].file.arrayBuffer();
        docCache[i] = await PDFDocument.load(bytes);
      }

      for (const pageMeta of pages) {
        const sourceDoc = docCache[pageMeta.fileIndex];
        const [copiedPage] = await organizedPdf.copyPages(sourceDoc, [pageMeta.pageIndex]);
        
        // Apply rotation
        if (pageMeta.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + pageMeta.rotation) % 360));
        }
        
        organizedPdf.addPage(copiedPage);
      }

      const pdfBytes = await organizedPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({
        url: URL.createObjectURL(blob),
        filename: 'organized_document.pdf'
      });
    } catch (err) {
      console.error(err);
      alert("Error generating PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col lg:flex-row gap-8 items-start">
      {/* Main Workspace (Thumbnails Grid) */}
      <div className="flex-1 w-full space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8 min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg">
                <LayoutGrid size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Visual Organizer
              </h2>
            </div>
            
            {pages.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={rotateAll}
                  className="p-2 text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <RefreshCw size={16} /> Rotate All
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" />
                <button 
                  onClick={reverseOrder}
                  className="p-2 text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <ArrowDownUp size={16} /> Reverse
                </button>
              </div>
            )}
          </div>

          <input 
            type="file" 
            multiple 
            ref={fileInputRef}
            onChange={onFileChange} 
            accept=".pdf" 
            className="hidden" 
          />

          {!pages.length ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-6 group hover:border-orange-500 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/10"
            >
              <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-orange-500 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-black tracking-tight mb-2">Select PDF Files</div>
                <p className="text-slate-500 font-medium">Add document pages to organize them visually</p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveId(e.active.id as string)}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                  {pages.map((page) => (
                    <SortableItem 
                      key={page.id} 
                      page={page} 
                      onRotate={rotatePage}
                      onDelete={deletePage}
                    />
                  ))}
                </SortableContext>
                
                {/* Add More Trigger Card */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all bg-slate-50/30 dark:bg-slate-900/10 group"
                >
                  <FilePlus size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Pages</span>
                </button>
              </div>
              
              <DragOverlay adjustScale={true}>
                {activeId ? (
                  <div className="aspect-[3/4] w-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-orange-500 overflow-hidden opacity-90 scale-105 pointer-events-none">
                    <img 
                      src={pages.find(p => p.id === activeId)?.thumbnail} 
                      className="w-full h-full object-contain p-2"
                      style={{ transform: `rotate(${pages.find(p => p.id === activeId)?.rotation}deg)` }}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {loadingPages && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 rounded-[2rem]">
              <Loader2 className="animate-spin text-orange-500" size={48} />
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest">Generating Thumbnails...</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Controls & Files) */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8 space-y-8 sticky top-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight">Organize PDF</h3>
            <button onClick={resetAll} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600">
              Reset all
            </button>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileSymlink size={12} /> Files ({files.length})
            </label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 group animate-in slide-in-from-right-4">
                  <div className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-orange-500 shadow-sm">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium tracking-wide">
                      {pages.filter(p => p.fileIndex === idx).length} pages
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            {!result ? (
              <button 
                onClick={handleProcess}
                disabled={processing || pages.length === 0}
                className="w-full py-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:grayscale text-white rounded-2xl text-xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 px-6"
              >
                {processing ? <Loader2 className="animate-spin" /> : <Settings2 size={24} />}
                {processing ? 'Organizing...' : 'Organize PDF'}
              </button>
            ) : (
              <div className="space-y-4 animate-in zoom-in duration-500">
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                  <CheckCircle2 className="mx-auto text-green-500 mb-3" size={32} />
                  <p className="font-black text-green-600 text-sm uppercase tracking-widest">Organized!</p>
                </div>
                <a 
                  href={result.url} 
                  download={result.filename}
                  className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-4 transition-all"
                >
                  <Download size={24} /> Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
