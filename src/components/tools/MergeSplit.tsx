"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Combine, FileText, 
  CheckCircle2, Scissors, GripVertical, Settings, 
  ChevronDown, FilePlus, Zap, History, LayoutGrid
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProcessedFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  resultUrl?: string;
  resultName?: string;
  pageCount?: number;
}

export default function MergeSplit({ id }: { id: string }) {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [mergedResult, setMergedResult] = useState<{ url: string; count: number; filename: string } | null>(null);
  const [splitMode, setSplitMode] = useState<'parts' | 'extract'>('parts');
  const [splitParts, setSplitParts] = useState<number>(2);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSplit = id === 'split';
  const ACCENT = isSplit ? "#8b5cf6" : "#f97316"; 
  const ACCENT_GRADIENT = isSplit 
    ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" 
    : "linear-gradient(135deg,#f97316,#ea580c)";

  const handleReset = () => {
    files.forEach(f => f.resultUrl && URL.revokeObjectURL(f.resultUrl));
    if (mergedResult) URL.revokeObjectURL(mergedResult.url);
    setFiles([]);
    setMergedResult(null);
    setStatus('');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        status: 'pending' as const
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setMergedResult(null);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFiles(prev => {
      const oldIndex = prev.findIndex(f => f.id === active.id);
      const newIndex = prev.findIndex(f => f.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

    try {
      if (id === 'merge') {
        setStatus('Initializing Merge...');
        const mergedPdf = await PDFDocument.create();
        
        for (let i = 0; i < files.length; i++) {
          const entry = files[i];
          setStatus(`Merging ${entry.file.name}...`);
          const srcDoc = await PDFDocument.load(await entry.file.arrayBuffer());
          const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach(p => mergedPdf.addPage(p));
        }
        
        const pdfBytes = await mergedPdf.save();
        setMergedResult({
          url: URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })),
          count: files.length,
          filename: 'merged_document.pdf'
        });
        setFiles(prev => prev.map(f => ({ ...f, status: 'done' })));
      } else {
        const JSZip = (await import('jszip')).default;
        const updatedFiles = [...files];

        for (let i = 0; i < updatedFiles.length; i++) {
          const entry = updatedFiles[i];
          if (entry.status === 'done') continue;
          
          setStatus(`Splitting ${entry.file.name}...`);
          updatedFiles[i] = { ...entry, status: 'processing' };
          setFiles([...updatedFiles]);

          const pdf = await PDFDocument.load(await entry.file.arrayBuffer());
          const totalPages = pdf.getPageCount();
          const zip = new JSZip();

          if (splitMode === 'extract') {
            for (let pIdx = 0; pIdx < totalPages; pIdx++) {
              const newPdf = await PDFDocument.create();
              const [p] = await newPdf.copyPages(pdf, [pIdx]);
              newPdf.addPage(p);
              zip.file(`page_${pIdx + 1}.pdf`, await newPdf.save());
            }
          } else {
            const pagesPerPart = Math.ceil(totalPages / splitParts);
            let partNum = 1;
            for (let start = 0; start < totalPages; start += pagesPerPart) {
              const indices = Array.from({ length: Math.min(pagesPerPart, totalPages - start) }, (_, k) => start + k);
              const newPdf = await PDFDocument.create();
              const copied = await newPdf.copyPages(pdf, indices);
              copied.forEach(p => newPdf.addPage(p));
              zip.file(`part_${partNum++}.pdf`, await newPdf.save());
            }
          }

          const zipBlob = await zip.generateAsync({ type: 'blob' });
          updatedFiles[i] = {
            ...entry,
            status: 'done',
            resultUrl: URL.createObjectURL(zipBlob),
            resultName: `split_${entry.file.name.replace('.pdf', '')}.zip`,
            pageCount: totalPages
          };
          setFiles([...updatedFiles]);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error processing files.');
    } finally {
      setProcessing(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Tool Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Configuration</h3>
              <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6 text-left">
              {isSplit && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">Split Mode</span>
                    <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {(['parts', 'extract'] as const).map(mode => (
                        <button key={mode} onClick={() => setSplitMode(mode)}
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${splitMode === mode ? 'bg-white dark:bg-slate-900 shadow-xl text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
                          {mode === 'parts' ? 'Divide' : 'Extract'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {splitMode === 'parts' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">Target Parts</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map(num => (
                          <button key={num} onClick={() => setSplitParts(num)}
                            className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${splitParts === num ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm text-slate-400">
                      <Zap size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue Status</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {files.length === 0 ? 'Empty' : `${files.length} Item${files.length !== 1 ? 's' : ''} ready`}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleProcess}
                  disabled={processing || files.length === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> {id === 'merge' ? 'Merging...' : 'Splitting...'}</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">{id === 'merge' ? 'Merge All' : 'Split All'} {isSplit ? <Scissors size={24} /> : <Combine size={24} />}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            <div className="relative text-center space-y-4 mb-10">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
                {isSplit ? <Scissors size={32} /> : <Combine size={32} />}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                {isSplit ? 'Split PDF Documents' : 'Merge PDF Documents'}
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto uppercase text-[10px] tracking-widest text-center">
                {isSplit ? 'Process multiple PDFs into parts instantly' : 'Combine multiple files into one session'}
              </p>
            </div>

            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 sm:p-20 hover:border-orange-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl mb-6 group-hover:scale-110 transition-transform relative z-10" style={{ color: ACCENT }}>
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Drop PDF Files Here
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Secure local processing
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {id === 'merge' && mergedResult && (
                  <div className="bg-green-50 dark:bg-green-500/5 p-6 rounded-[2rem] border border-green-100 dark:border-green-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-left">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg"><CheckCircle2 size={24} /></div>
                       <div>
                         <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Merge Ready</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Combined {mergedResult.count} files</p>
                       </div>
                    </div>
                    <a href={mergedResult.url} download={mergedResult.filename} className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                      <Download size={14} /> Download Final PDF
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> {isSplit ? 'Files Queue' : 'Merging Order'} ({files.length})
                  </h4>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:opacity-80">
                    Add More
                  </button>
                </div>

                <div className="space-y-3">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      {files.map((f, i) => (
                        <SortableFile key={f.id} f={f} i={i} isSplit={isSplit} removeFile={removeFile} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Hardware Logic", desc: "Native browser processing means zero wait time for server uploads.", icon: Zap },
              { title: "Safe & Private", desc: "Your sensitive documents never leave your local machine.", icon: CheckCircle2 },
              { title: "Smart Batches", desc: "Handle multiple documents simultaneously with ease.", icon: LayoutGrid },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" multiple onChange={onFileChange} accept=".pdf" className="hidden" />
    </div>
  );
}

function SortableFile({ f, i, isSplit, removeFile }: { f: ProcessedFile; i: number; isSplit: boolean; removeFile: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: f.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all group gap-4"
    >
      <div className="flex items-center flex-1 min-w-0">
        {!isSplit && (
          <button {...attributes} {...listeners} className="p-1 text-slate-300 hover:text-orange-400 cursor-grab active:cursor-grabbing mr-3 shrink-0 touch-none">
            <GripVertical size={18} />
          </button>
        )}
        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black shadow-sm shrink-0 ${f.status === 'done' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-400'}`}>
            {f.status === 'processing' ? <Loader2 className="animate-spin" size={14} /> : i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-[11px] uppercase truncate tracking-tight">{f.file.name}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
         {f.resultUrl && (
           <a href={f.resultUrl} download={f.resultName} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2">
             <Download size={12} /> Save Split
           </a>
         )}
         <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
      </div>
    </div>
  );
}
