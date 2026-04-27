"use client";

import { useState, useRef } from 'react';
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
      className="relative aspect-[3/4] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden select-none"
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-900">
        <img
          src={page.thumbnail}
          alt={`Page ${page.pageIndex + 1}`}
          className="max-w-full max-h-full shadow-lg transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* Dedicated drag handle at bottom center — touch-friendly */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-0 inset-x-0 z-20 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none bg-gradient-to-t from-black/60 to-transparent"
      >
        <div className="flex gap-0.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-0.5 h-3 bg-white/70 rounded-full" />
          ))}
        </div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-full">
        {page.pageIndex + 1}
      </div>

      {/* Action buttons — always visible */}
      <div className="absolute top-1 right-1 z-30 flex flex-col gap-1">
        <button
          onPointerDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRotate(page.id); }}
          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-slate-600 hover:text-orange-500 transition-colors"
        >
          <RotateCw size={12} />
        </button>
        <button
          onPointerDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
          className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-slate-600 hover:text-red-500 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* File label */}
      <div className="absolute top-1 left-1 z-20 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded uppercase">
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

  // Mobile: only TouchSensor with longer delay to distinguish scroll vs drag
  // Desktop: PointerSensor with small distance threshold
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
    // Reset input so same file can be re-selected
    e.target.value = '';
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
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Workspace */}
      <div className="flex-1 w-full">
        <div className="relative bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-8 min-h-[400px] flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg">
                <LayoutGrid size={20} />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Visual Organizer
              </h2>
            </div>
            {pages.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={rotateAll} className="p-2 text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-1 text-[10px] font-bold">
                  <RefreshCw size={13} /> <span className="hidden sm:inline">Rotate All</span>
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                <button onClick={reverseOrder} className="p-2 text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-1 text-[10px] font-bold">
                  <ArrowDownUp size={13} /> <span className="hidden sm:inline">Reverse</span>
                </button>
              </div>
            )}
          </div>

          <input type="file" multiple ref={fileInputRef} onChange={onFileChange} accept=".pdf" className="hidden" />

          {!pages.length ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-orange-500 cursor-pointer transition-all bg-slate-50/50 p-8 min-h-[280px]"
            >
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-orange-500 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-black tracking-tight mb-1">Select PDF Files</div>
                <p className="text-sm text-slate-500 font-medium">Tap to browse or drop PDFs here</p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveId(e.active.id as string)}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
                <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                  {pages.map(page => (
                    <SortableItem key={page.id} page={page} onRotate={rotatePage} onDelete={deletePage} />
                  ))}
                </SortableContext>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all bg-slate-50/30"
                >
                  <FilePlus size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Add</span>
                </button>
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="aspect-[3/4] w-24 bg-white rounded-xl shadow-2xl border-2 border-orange-500 overflow-hidden opacity-90 pointer-events-none">
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

          {/* Loading overlay */}
          {loadingPages && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 rounded-[1.5rem]">
              <Loader2 className="animate-spin text-orange-500" size={40} />
              <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">Generating Thumbnails...</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72 xl:w-80">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-5 lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight">Organize PDF</h3>
            <button onClick={resetAll} className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600">
              Reset all
            </button>
          </div>

          {/* File list */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileSymlink size={12} /> Files ({files.length})
            </label>
            <div className="space-y-2 max-h-[200px] lg:max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-orange-500 shadow-sm shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{pages.filter(p => p.fileIndex === idx).length} pages</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5">
            {!result ? (
              <button
                onClick={handleProcess}
                disabled={processing || pages.length === 0}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:grayscale text-white rounded-2xl text-base font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {processing ? <Loader2 className="animate-spin" size={20} /> : <Settings2 size={20} />}
                {processing ? 'Organizing...' : 'Organize PDF'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                  <CheckCircle2 className="mx-auto text-green-500 mb-2" size={28} />
                  <p className="font-black text-green-600 text-xs uppercase tracking-widest">Organized!</p>
                </div>
                <a
                  href={result.url}
                  download={result.filename}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-base font-black shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  <Download size={20} /> Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
