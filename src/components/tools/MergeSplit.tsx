"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Combine, FileText, CheckCircle2, Scissors, GripVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
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

// Sortable file row
function SortableFile({ file, index, onRemove }: { file: File; index: number; onRemove: (i: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.name + index });

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
      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none mr-2 shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex items-center gap-3 text-left flex-1 min-w-0">
        <div className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-orange-500 shadow-sm shrink-0">
          {index + 1}
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-orange-500 shrink-0">
          <FileText size={16} />
        </div>
        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{file.name}</p>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0 ml-2"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function MergeSplit({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; count: number; filename?: string } | null>(null);
  const [splitMode, setSplitMode] = useState<'parts' | 'extract'>('parts');
  const [splitParts, setSplitParts] = useState<number>(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (id === 'split') {
        setFiles([e.target.files[0]]);
      } else {
        setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      }
      setResult(null);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFiles(prev => {
      const oldIndex = prev.findIndex((f, i) => f.name + i === active.id);
      const newIndex = prev.findIndex((f, i) => f.name + i === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      if (id === 'merge') {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const pdf = await PDFDocument.load(await file.arrayBuffer());
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        setResult({ url: URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })), count: files.length, filename: 'merged.pdf' });
      } else if (id === 'split') {
        const pdf = await PDFDocument.load(await files[0].arrayBuffer());
        const totalPages = pdf.getPageCount();
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        if (splitMode === 'extract') {
          for (let i = 0; i < totalPages; i++) {
            const newPdf = await PDFDocument.create();
            const [p] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(p);
            zip.file(`page_${i + 1}.pdf`, await newPdf.save());
          }
        } else {
          const pagesPerPart = Math.ceil(totalPages / splitParts);
          let part = 1;
          for (let start = 0; start < totalPages; start += pagesPerPart) {
            const indices = Array.from({ length: Math.min(pagesPerPart, totalPages - start) }, (_, i) => start + i);
            const newPdf = await PDFDocument.create();
            const copied = await newPdf.copyPages(pdf, indices);
            copied.forEach(p => newPdf.addPage(p));
            zip.file(`part_${part++}.pdf`, await newPdf.save());
          }
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResult({ url: URL.createObjectURL(zipBlob), count: splitMode === 'extract' ? totalPages : splitParts, filename: `split_${files[0].name.replace('.pdf', '')}.zip` });
      }
    } catch (err) {
      console.error(err);
      alert('Error processing files.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        {/* Header */}
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-orange-500 text-white shadow-lg">
            {id === 'merge' ? <Combine size={24} className="sm:w-10 sm:h-10" /> : <Scissors size={24} className="sm:w-10 sm:h-10" />}
          </div>
          <h2 className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight sm:tracking-tighter">
            {id === 'merge' ? 'Merge PDF' : 'Split PDF'}
          </h2>
          <p className="text-xs sm:text-base text-slate-500 font-medium px-2">
            {id === 'merge' ? 'Drag to reorder files, then merge into one PDF.' : 'Combine or separate your documents with ultra-speed.'}
          </p>
        </div>

        {!result ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Drop zone */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-3xl p-6 sm:p-16 group hover:border-orange-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
              <input ref={fileInputRef} type="file" multiple={id === 'merge'} onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <div className="space-y-3 sm:space-y-6 pointer-events-none">
                <div className="p-3 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl inline-block text-orange-500 group-hover:scale-110 transition-transform">
                  <Upload size={24} className="sm:w-12 sm:h-12" />
                </div>
                <div className="text-lg sm:text-2xl font-black tracking-tight">Select PDF Files</div>
                <p className="text-xs sm:text-base text-slate-500">or drop PDF here</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                {/* Drag-and-drop file list (merge only) */}
                {id === 'merge' ? (
                  <div className="space-y-2 text-left">
                    {files.length > 1 && (
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-1.5">
                        <GripVertical size={10} /> Drag to reorder merge sequence
                      </p>
                    )}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={files.map((f, i) => f.name + i)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {files.map((file, i) => (
                            <SortableFile key={file.name + i} file={file} index={i} onRemove={removeFile} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  /* Split — single file, no drag needed */
                  <div className="grid grid-cols-1 gap-3 text-left">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-600">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                          <div className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-orange-500 shrink-0">
                            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs truncate max-w-[150px] sm:max-w-[200px]">{file.name}</p>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Split config */}
                {id === 'split' && (
                  <div className="space-y-3 sm:space-y-4 text-left bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest text-slate-400">Split Configuration</h4>
                    <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-lg sm:rounded-xl">
                      {(['parts', 'extract'] as const).map(mode => (
                        <button key={mode} onClick={() => setSplitMode(mode)}
                          className={`flex-1 py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-md sm:rounded-lg transition-all ${splitMode === mode ? 'bg-white dark:bg-slate-800 shadow-sm text-orange-500' : 'text-slate-400 hover:text-slate-900'}`}>
                          {mode === 'parts' ? 'Divide' : 'Extract'}
                        </button>
                      ))}
                    </div>
                    {splitMode === 'parts' && (
                      <div className="flex gap-2">
                        {[2, 3, 4].map(num => (
                          <button key={num} onClick={() => setSplitParts(num)}
                            className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 font-black text-xs sm:text-sm transition-all ${splitParts === num ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'}`}>
                            {num} Parts
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button onClick={handleProcess} disabled={processing}
                  className="w-full py-3.5 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl sm:rounded-2xl text-base sm:text-2xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 sm:gap-4 transition-all disabled:opacity-50">
                  {processing ? <Loader2 className="animate-spin" /> : <Combine size={20} className="sm:w-[24px] sm:h-[24px] fill-white/20" />}
                  {processing ? 'Processing...' : (id === 'merge' ? 'Merge PDF' : 'Split PDF')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
            <div className="p-12 rounded-full bg-slate-100 dark:bg-slate-700 text-orange-500 scale-110 inline-block">
              <CheckCircle2 size={80} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black">{id === 'merge' ? 'Merge Successful!' : 'Archive Ready!'}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest">
                {id === 'merge' ? `${result.count} files combined.` : `${result.count} files extracted.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={result.url} download={result.filename || 'download'}
                className="flex-1 py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4">
                <Download size={24} /> Download
              </a>
              <button onClick={handleReset}
                className="px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
