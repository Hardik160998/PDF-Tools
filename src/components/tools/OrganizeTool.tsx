"use client";

import { useState, useRef } from 'react';
import { 
 Upload, Download, Loader2, X, RefreshCw, 
 Trash2, ArrowDownUp, RotateCw, FilePlus, 
 CheckCircle2, LayoutGrid, FileSymlink,
 Settings, ChevronDown, MousePointer2,
 Zap, Shield, Sparkles, Lock, Smartphone, Rocket, Plus, Combine
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
 <div className="absolute bottom-3 left-3 z-20 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium rounded-full border border-white/20 tracking-widest">
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
 <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-orange-500 text-white text-[9px] font-medium rounded-lg uppercase tracking-widest shadow-sm">
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
 <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left flex justify-center">
 {/* Workspace */}
 <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 min-h-[600px] flex flex-col relative overflow-hidden">
 
 <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

 <input type="file" multiple ref={fileInputRef} onChange={onFileChange} accept=".pdf" className="hidden" />

 {/* Header */}
 <div className="relative text-center space-y-4 mb-6">
 <div className="inline-flex p-3 rounded-xl text-white shadow-lg shadow-orange-500/20" style={{ background: ACCENT_GRADIENT }}>
 <LayoutGrid size={32} />
 </div>
 <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
 Organize PDF Documents
 </h2>
 <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
 {pages.length > 0 ? "Drag and drop to reorder. Rotate or delete individual pages below." : "Rearrange, rotate, or delete pages across multiple files."}
 </p>
 </div>

 {!loadingPages && !result && (
 <div className={`w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ${pages.length === 0 ? 'flex-1 flex flex-col items-center max-w-3xl mx-auto' : 'max-w-3xl mx-auto mb-10'}`}>
 {pages.length === 0 && (
 <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6 relative z-10">
 {[
 { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
 { icon: Shield, title: "Private", desc: "Your files stay secure" },
 { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
 ].map((f, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
 <f.icon size={20} />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
 <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
 </div>
 </div>
 ))}
 </div>
 )}

 <div 
 className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6 z-10"
 onClick={() => fileInputRef.current?.click()}
 onDragOver={e => e.preventDefault()}
 onDrop={onDrop}
 >
 <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
 <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
 <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
 <div className="m-auto text-slate-300 dark:text-slate-600">
 <LayoutGrid size={32} />
 </div>
 </div>
 <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
 <Upload size={20} strokeWidth={3} />
 </div>
 <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
 <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
 <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
 </div>

 <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
 Drag & drop your PDF files here
 </h3>
 <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
 or click to <span style={{ color: ACCENT }}>browse</span>
 </p>
 <p className="text-sm text-slate-400 font-medium mb-8 text-center">
 Supports single or multiple PDF files
 </p>

 {pages.length === 0 ? (
 <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
 <Plus size={20} /> SELECT PDF FILES
 </button>
 ) : (
 <button 
 className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" 
 style={{ background: ACCENT_GRADIENT }}
 onClick={(e) => {
 e.stopPropagation();
 handleProcess();
 }}
 disabled={processing}
 >
 {processing ? (
 <><Loader2 className="animate-spin" size={20} /> PROCESSING...</>
 ) : (
 <><LayoutGrid size={20} /> ORGANIZE PDF</>
 )}
 </button>
 )}
 </div>

 {pages.length === 0 && (
 <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50 z-10">
 {[
 { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
 { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
 { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
 { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
 ].map((f, i) => (
 <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
 <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
 <f.icon size={16} />
 </div>
 <div>
 <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
 <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {result && (
 <div className={`p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500`}>
 <div className="flex flex-col sm:flex-row items-center gap-6">
 <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
 <div>
 <h4 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Success!</h4>
 <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Reconstructed PDF is ready for download</p>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
 <a href={result.url} download={result.filename} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
 <Download size={18} /> Download PDF
 </a>
 <button onClick={resetAll} className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
 <RefreshCw size={18} /> Start Over
 </button>
 </div>
 </div>
 )}

 {loadingPages && (
 <div className="flex-1 flex flex-col items-center justify-center gap-6">
 <div className="relative">
 <Loader2 size={64} className="animate-spin text-orange-500" />
 <LayoutGrid className="absolute inset-0 m-auto text-orange-500/20" size={32} />
 </div>
 <div className="text-center space-y-2">
 <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">Generating Thumbnails</p>
 <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-none">Scanning locally in your browser</p>
 </div>
 </div>
 )}

 {!loadingPages && !result && pages.length > 0 && (
 <>
    <div className="w-full mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-2 pt-2 border-b border-slate-100 dark:border-slate-800 pb-4 gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={rotateAll} className="justify-center px-2 sm:px-4 py-3 sm:py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 sm:gap-2">
            <RefreshCw size={14} /> Rotate All
          </button>
          <button onClick={reverseOrder} className="justify-center px-2 sm:px-4 py-3 sm:py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 sm:gap-2">
            <ArrowDownUp size={14} /> Reverse
          </button>
        </div>
        <button onClick={resetAll} className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
          <Trash2 size={14} /> Reset All
        </button>
      </div>
    </div>
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
 <span className="text-[11px] font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100">Add More</span>
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
  </>
 )}

 {/* Tips footer */}
 {pages.length > 0 && !result && (
 <div className="relative z-10 mt-10 pt-8 border-t border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-6">
 <div className="flex items-center gap-3 text-slate-400">
 <MousePointer2 size={16} />
 <span className="text-[11px] font-medium uppercase tracking-widest">Drag pages to reorder</span>
 </div>
 <div className="flex items-center gap-3 text-slate-400">
 <RotateCw size={16} />
 <span className="text-[11px] font-medium uppercase tracking-widest">Rotate Individual Pages</span>
 </div>
 </div>
 )}
  </div>
  </div>
  );
}
