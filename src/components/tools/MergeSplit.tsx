"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Combine, FileText, CheckCircle2, Scissors, GripVertical } from 'lucide-react';
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



// Sortable file row
function SortableFile({ file, index, onRemove, status }: { file: File; index: number; onRemove: (i: number) => void, status?: string }) {
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
      <div className="flex items-center flex-1 min-w-0">
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
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {status === 'processing' && <Loader2 size={16} className="animate-spin text-orange-500" />}
        {status === 'done' && <CheckCircle2 size={16} className="text-green-500" />}
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          disabled={status === 'processing'}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function MergeSplit({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<{ url: string; count: number; filename?: string } | null>(null);
  const [splitMode, setSplitMode] = useState<'parts' | 'extract'>('parts');
  const [splitParts, setSplitParts] = useState<number>(2);
  const [fileStatuses, setFileStatuses] = useState<Record<string, 'pending' | 'processing' | 'done' | 'error'>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setStatus('');
    setFileStatuses({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (id === 'split') {
        setFiles([newFiles[0]]);
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
      setResult(null);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    setFiles(files.filter((_, i) => i !== index));
    setFileStatuses(prev => {
      const next = { ...prev };
      delete next[fileName + index];
      return next;
    });
  };

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
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

    setStatus('Initializing...');
    try {
      if (id === 'merge') {
        const mergedPdf = await PDFDocument.create();
        const StandardFont = await mergedPdf.embedFont('Helvetica');
        const BoldFont = await mergedPdf.embedFont('Helvetica-Bold');
        
        const invoiceMap: Record<string, { sku: string; qty: string }> = {};
        const labelPages: Array<{ pageIdx: number; orderId: string; fileIndex: number; awb: string }> = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileKey = file.name + i;
          setFileStatuses(prev => ({ ...prev, [fileKey]: 'processing' }));
          setStatus(`Scanning ${file.name}...`);
          
          const buf = await file.arrayBuffer();
          const pdfJsDoc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
          
          for (let p = 1; p <= pdfJsDoc.numPages; p++) {
            const page = await pdfJsDoc.getPage(p);
            const content = await page.getTextContent();
            let items = content.items as any[];
            
            const text = items.map(it => it.str).join(' ');
            const upText = text.toUpperCase();
            
            const isInv = ["TAX INVOICE", "BILL OF SUPPLY", "UNIT PRICE"].some(k => upText.includes(k));
            if (isInv) {
              const orderMatch = text.match(/(?:Order Number|Order ID)[:\s]*([0-9-]{15,22})/i);
              const orderId = orderMatch ? orderMatch[1].trim() : '';
              const skuRegex = /\|\s*[A-Z0-9]{10}\s*(?:\([^)]+\)\s*)*\(([^)]+)\)/i;
              const hsnMatch = text.match(/\(([^)]+)\)\s*HSN/i);
              const bracketMatch = text.match(skuRegex) || hsnMatch;
              let sku = bracketMatch ? bracketMatch[1].trim() : '';
              const qtyMatch = text.match(/Qty[:\s]*(\d+)/i);
              if (orderId) invoiceMap[orderId] = { sku, qty: qtyMatch ? qtyMatch[1] : '1' };
            }

            const awbMatch = text.match(/(?:AWB|AVVB|AWE)[:\s]*([0-9OI\s]{12,20})/i);
            const orderIdMatch = text.match(/(?:Order Id|Order Number)[:\s]*([0-9-]{15,22})/i);
            
            if (awbMatch && !isInv) {
              let awb = awbMatch[1].replace(/O/g, '0').replace(/I/g, '1').replace(/\s/g, '').trim();
              const qtyHeader = items.find(it => it.str.toUpperCase().replace(/\s/g, '') === 'QTY');
              let evenPageQty = '';
              if (qtyHeader) {
                const qX = qtyHeader.transform[4];
                const qY = qtyHeader.transform[5];
                const qtyVal = items.find(it => Math.abs(it.transform[4] - qX) < 25 && (qY - it.transform[5]) > 2 && (qY - it.transform[5]) < 60 && /^\d+$/.test(it.str.trim()));
                if (qtyVal) evenPageQty = qtyVal.str.trim();
              }
              labelPages.push({ pageIdx: p - 1, orderId: orderIdMatch ? orderIdMatch[1].trim() : '', fileIndex: i, awb });
              if (orderIdMatch && evenPageQty) {
                const oid = orderIdMatch[1].trim();
                if (invoiceMap[oid]) invoiceMap[oid].qty = evenPageQty;
                else invoiceMap[oid] = { sku: '', qty: evenPageQty };
              }
            }
          }
          setFileStatuses(prev => ({ ...prev, [fileKey]: 'done' }));
        }

        const summaryPage = mergedPdf.addPage([595.28, 841.89]);
        summaryPage.drawText('AMAZON LABEL CROP Summary (Merged)', { x: 50, y: 790, size: 22, font: BoldFont });
        let yPos = 740;
        labelPages.forEach(lp => {
          if (yPos < 50) return;
          const inv = invoiceMap[lp.orderId];
          const line = `${inv?.sku || 'Unknown'} | Qty - ${inv?.qty || '1'} | AWB: ${lp.awb}`;
          summaryPage.drawText(line, { x: 50, y: yPos, size: 11, font: StandardFont });
          yPos -= 22;
        });

        setStatus('Assembling PDF...');
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const srcDoc = await PDFDocument.load(await file.arrayBuffer());
          const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
          for (let j = 0; j < copiedPages.length; j++) {
            const page = copiedPages[j];
            const meta = labelPages.find(m => m.fileIndex === i && m.pageIdx === j);
            if (meta && invoiceMap[meta.orderId]) {
              const { sku, qty } = invoiceMap[meta.orderId];
              page.drawText(`${sku} | Qty - ${qty}`, { x: 35, y: 115, size: 11, font: BoldFont, color: rgb(0, 0, 0) });
            }
            mergedPdf.addPage(page);
          }
        }
        const pdfBytes = await mergedPdf.save();
        setResult({ url: URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })), count: files.length, filename: 'amazon_enriched_merge.pdf' });
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

        <div className="space-y-6 sm:space-y-10">
          {/* Result Section */}
          {result && (
            <div className="p-6 sm:p-10 bg-orange-50 dark:bg-orange-500/10 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-orange-200 dark:border-orange-500/20 animate-in zoom-in duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 text-orange-500 shadow-lg">
                  <CheckCircle2 size={40} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{id === 'merge' ? 'Merge Successful!' : 'Archive Ready!'}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{id === 'merge' ? `${result.count} files enriched & combined.` : `${result.count} files extracted.`}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a href={result.url} download={result.filename || 'download'}
                    className="flex-1 py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-black shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                    <Download size={20} /> Download
                  </a>
                  <button onClick={handleReset}
                    className="py-4 px-8 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white rounded-xl font-bold transition-all active:scale-95">
                    Clear Batch
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6 relative">
            {/* Drop zone */}
            <div className={`relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-3xl p-6 sm:p-16 group hover:border-orange-500 transition-all bg-slate-50/50 dark:bg-slate-900/50 ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <input ref={fileInputRef} type="file" multiple={id === 'merge'} onChange={onFileChange} accept=".pdf" disabled={processing} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed" />
              <div className="space-y-3 sm:space-y-6 pointer-events-none">
                <div className="p-3 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl inline-block text-orange-500 group-hover:scale-110 transition-transform">
                  <Upload size={24} className="sm:w-12 sm:h-12" />
                </div>
                <div className="text-lg sm:text-2xl font-black tracking-tight">Select PDF Files</div>
                <p className="text-xs sm:text-base text-slate-500">or drop PDF here</p>
              </div>
            </div>

            {/* Individual File List */}
            {files.length > 0 && (
              <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {id === 'merge' ? (
                  <div className="space-y-2 text-left">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={files.map((f, i) => f.name + i)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {files.map((file, i) => (
                            <SortableFile key={file.name + i} file={file} index={i} onRemove={removeFile} status={fileStatuses[file.name + i]} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 text-left">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-600">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                          <div className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-orange-500 shrink-0">
                            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs truncate max-w-[150px] sm:max-w-[200px]">{file.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {processing && <Loader2 size={16} className="animate-spin text-orange-500" />}
                          <button onClick={() => removeFile(i)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0" disabled={processing}>
                            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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

                {!result && (
                  <button onClick={handleProcess} disabled={processing}
                    className="w-full py-3.5 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl sm:rounded-2xl text-base sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3 sm:gap-4 transition-all disabled:opacity-50">
                    {processing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={20} className="animate-spin mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">{status}</span>
                      </div>
                    ) : (
                      <Combine size={20} className="sm:w-[24px] sm:h-[24px] fill-white/20" />
                    )}
                    {processing ? 'Extracting SKU...' : (id === 'merge' ? 'Merge PDF' : 'Split PDF')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
