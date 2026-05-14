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
      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-orange-200 group"
    >
      <div className="flex items-center flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-300 hover:text-orange-400 cursor-grab active:cursor-grabbing touch-none mr-3 shrink-0"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-orange-500 shadow-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-[11px] uppercase truncate tracking-tight">{file.name}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {status === 'processing' && <Loader2 size={16} className="animate-spin text-orange-500" />}
        {status === 'done' && <CheckCircle2 size={16} className="text-green-500" />}
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
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
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSplit = id === 'split';
  const ACCENT = isSplit ? "#8b5cf6" : "#f97316"; // Violet for split, Orange for merge
  const ACCENT_GRADIENT = isSplit 
    ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" 
    : "linear-gradient(135deg,#f97316,#ea580c)";

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
      if (isSplit) {
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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
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
              {/* Tool specific settings */}
              {isSplit && files.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Split Mode</span>
                    <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {(['parts', 'extract'] as const).map(mode => (
                        <button key={mode} onClick={() => setSplitMode(mode)}
                          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${splitMode === mode ? 'bg-white dark:bg-slate-800 shadow-xl text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
                          {mode === 'parts' ? 'Divide into Parts' : 'Extract All Pages'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {splitMode === 'parts' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Parts</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map(num => (
                          <button key={num} onClick={() => setSplitParts(num)}
                            className={`py-4 rounded-2xl border-2 font-black text-sm transition-all ${splitParts === num ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Section */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-400">
                      <Zap size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 italic">
                    {files.length === 0 ? 'Waiting for upload...' : processing ? status : `Ready to ${id}`}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!result ? (
                  <button
                    onClick={handleProcess}
                    disabled={processing || files.length === 0}
                    className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter italic"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> {id === 'merge' ? 'Merging...' : 'Splitting...'}</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">{id === 'merge' ? 'Merge Now' : 'Split Now'} {isSplit ? <Scissors size={24} /> : <Combine size={24} />}</span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="text-xs font-black text-green-700 uppercase tracking-tighter italic leading-tight">Process Completed Successfully!</span>
                    </div>
                    <a
                      href={result.url}
                      download={result.filename || 'download.pdf'}
                      className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter italic shadow-orange-500/20"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Download size={24} /> Download
                    </a>
                    <button onClick={handleReset} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Start Over</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-orange-500/20" style={{ background: ACCENT_GRADIENT }}>
                {isSplit ? <Scissors size={32} /> : <Combine size={32} />}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">
                {isSplit ? 'Split PDF Document' : 'Merge PDF Documents'}
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto">
                {isSplit 
                  ? 'Extract pages into separate files or divide your PDF into smaller parts instantly.' 
                  : 'Combine multiple PDF files into one single document with enriched metadata.'}
              </p>
            </div>

            {/* Upload Area */}
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-orange-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-orange-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} style={{ color: ACCENT }} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Drop PDF Files Here
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold italic tracking-tight text-center relative z-10">
                  Select {isSplit ? 'a PDF' : 'multiple PDFs'} to begin processing locally
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
                <input ref={fileInputRef} type="file" multiple={!isSplit} onChange={onFileChange} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Selected Files ({files.length})
                  </h4>
                  {!isSplit && (
                    <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:opacity-80">
                      Add More
                    </button>
                  )}
                </div>

                {isSplit ? (
                  <div className="grid grid-cols-1 gap-3">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-violet-200 transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-violet-500 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900 dark:text-white text-xs uppercase truncate">{file.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • READY TO SPLIT</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={files.map((f, i) => f.name + i)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {files.map((file, i) => (
                          <SortableFile key={file.name + i} file={file} index={i} onRemove={removeFile} status={fileStatuses[file.name + i]} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
                
                <input ref={fileInputRef} type="file" multiple={!isSplit} onChange={onFileChange} accept=".pdf" className="hidden" />
              </div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Ultra Fast", desc: "Native browser processing means zero wait time for server uploads.", icon: Zap },
              { title: "Safe & Private", desc: "Your sensitive documents never leave your local machine.", icon: CheckCircle2 },
              { title: "No File Limit", desc: "Handle large documents with our optimized memory management.", icon: LayoutGrid },
            ].map((feat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <feat.icon size={20} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
