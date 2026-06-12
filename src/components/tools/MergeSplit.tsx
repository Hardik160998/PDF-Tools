"use client";

import { useState, useRef } from 'react';
import { 
 Upload, Download, Loader2, X, Combine, FileText, 
 CheckCircle2, Scissors, GripVertical, Settings, 
 ChevronDown, FilePlus, Zap, History, LayoutGrid,
 Sparkles, Lock, Trash2, Smartphone, Rocket, Plus, Shield
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

import { supabase } from '@/lib/supabase';
import { verifyAndIncrementUsage } from '@/lib/usage';

export default function MergeSplit({ id }: { id: string }) {
 const [files, setFiles] = useState<ProcessedFile[]>([]);
 const [processing, setProcessing] = useState(false);
 const [status, setStatus] = useState<string>('');
 const [mergedResult, setMergedResult] = useState<{ url: string; count: number; filename: string } | null>(null);
 const [splitMode, setSplitMode] = useState<'parts' | 'extract'>('parts');
 const [splitParts, setSplitParts] = useState<number>(2);
 const [splitResults, setSplitResults] = useState<{ url: string; name: string; pageCount: number }[]>([]);
 const [showSettings, setShowSettings] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const isSplit = id === 'split';
 const ACCENT = isSplit ? "#8b5cf6" : "#f97316"; 
 const ACCENT_GRADIENT = isSplit 
 ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" 
 : "linear-gradient(135deg,#f97316,#ea580c)";

 const handleReset = () => {
 files.forEach(f => f.resultUrl && URL.revokeObjectURL(f.resultUrl));
 splitResults.forEach(r => URL.revokeObjectURL(r.url));
 if (mergedResult) URL.revokeObjectURL(mergedResult.url);
 setFiles([]);
 setSplitResults([]);
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
 setSplitResults([]);
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

 // Check usage limits
 const check = await verifyAndIncrementUsage(supabase);
 if (!check.allowed) {
 if (confirm(check.error || "You have reached your daily limit of 3 operations. Upgrade to Premium for unlimited downloads?")) {
 window.location.href = "/premium-plans";
 }
 return;
 }

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
 const allResults: { url: string; name: string; pageCount: number }[] = [];

 for (let i = 0; i < updatedFiles.length; i++) {
 const entry = updatedFiles[i];
 if (entry.status === 'done') continue;
 
 setStatus(`Splitting ${entry.file.name}...`);
 updatedFiles[i] = { ...entry, status: 'processing' };
 setFiles([...updatedFiles]);

 const pdf = await PDFDocument.load(await entry.file.arrayBuffer());
 const totalPages = pdf.getPageCount();
 const zip = new JSZip();
 const baseName = entry.file.name.replace('.pdf', '');

 let finalBlob: Blob;
 let finalName: string;

 if (splitMode === 'extract') {
 for (let pIdx = 0; pIdx < totalPages; pIdx++) {
 const newPdf = await PDFDocument.create();
 const [p] = await newPdf.copyPages(pdf, [pIdx]);
 newPdf.addPage(p);
 const bytes = await newPdf.save();
 const partName = `${baseName}_pg${pIdx + 1}.pdf`;
 zip.file(partName, bytes);
 
 allResults.push({
 url: URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })),
 name: partName,
 pageCount: 1
 });
 }
 finalBlob = await zip.generateAsync({ type: 'blob' });
 finalName = `${baseName}_split.zip`;
 } else {
 const pagesPerPart = Math.ceil(totalPages / splitParts);
 let partNum = 1;
 for (let start = 0; start < totalPages; start += pagesPerPart) {
 const indices = Array.from({ length: Math.min(pagesPerPart, totalPages - start) }, (_, k) => start + k);
 const newPdf = await PDFDocument.create();
 const copied = await newPdf.copyPages(pdf, indices);
 copied.forEach(p => newPdf.addPage(p));
 const bytes = await newPdf.save();
 const partName = `${baseName}_part${partNum++}.pdf`;
 zip.file(partName, bytes);
 
 allResults.push({
 url: URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })),
 name: partName,
 pageCount: indices.length
 });
 }
 finalBlob = await zip.generateAsync({ type: 'blob' });
 finalName = `${baseName}_parts.zip`;
 }

 updatedFiles[i] = {
 ...entry,
 status: 'done',
 resultUrl: URL.createObjectURL(finalBlob),
 resultName: finalName,
 pageCount: totalPages
 };
 setFiles([...updatedFiles]);
 }

 setSplitResults(allResults);

 // Global Zip for all files in queue if multiple
 if (updatedFiles.length > 1) {
 const mainZip = new JSZip();
 for (const f of updatedFiles) {
 if (f.resultUrl) {
 const b = await fetch(f.resultUrl).then(r => r.blob());
 mainZip.file(f.resultName || 'file.pdf', b);
 }
 }
 const mainZipBlob = await mainZip.generateAsync({ type: 'blob' });
 setMergedResult({
 url: URL.createObjectURL(mainZipBlob),
 count: updatedFiles.length,
 filename: 'all_split_results.zip'
 });
 } else if (allResults.length > 1) {
 const lastFile = updatedFiles[0];
 if (lastFile?.resultUrl && lastFile.resultName?.endsWith('.zip')) {
 setMergedResult({
 url: lastFile.resultUrl,
 count: allResults.length,
 filename: lastFile.resultName
 });
 }
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

 const downloadIndividually = () => {
 const list = isSplit ? splitResults : files.filter(f => f.status === 'done' && f.resultUrl).map(f => ({ url: f.resultUrl!, name: f.resultName! }));
 
 list.forEach((item, idx) => {
 setTimeout(() => {
 const a = document.createElement('a');
 a.href = item.url;
 a.download = item.name;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 }, idx * 250); 
 });
 };

 return (
 <div className="max-w-7xl mx-auto py-2 sm:py-8 px-2 sm:px-6 ">
 <div className="flex flex-col-reverse lg:flex-row-reverse gap-8 items-start">
 
 {/* Sidebar Configuration */}
 <div className={`w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0 ${files.length === 0 ? 'hidden' : ''}`}>
 <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-medium text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
 <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Tool Settings</span>
 <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
 </button>

 <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
 <div className="flex items-center justify-between mb-6">
 <h3 className="hidden lg:block text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Configuration</h3>
 <button onClick={handleReset} className="text-[11px] font-medium uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
 </div>

 <div className="space-y-6 text-left">
 {isSplit && (
 <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
 <div className="space-y-2">
 <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest text-left block">Split Mode</span>
 <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
 {(['parts', 'extract'] as const).map(mode => (
 <button key={mode} onClick={() => setSplitMode(mode)}
 className={`flex-1 py-3 text-[11px] font-medium uppercase tracking-widest rounded-xl transition-all ${splitMode === mode ? 'bg-white dark:bg-slate-900 shadow-xl text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
 {mode === 'parts' ? 'Divide' : 'Extract'}
 </button>
 ))}
 </div>
 </div>

 {splitMode === 'parts' && (
 <div className="space-y-2">
 <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest text-left block">Target Parts</span>
 <div className="grid grid-cols-3 gap-2">
 {[2, 3, 4].map(num => (
 <button key={num} onClick={() => setSplitParts(num)}
 className={`py-3 rounded-xl border-2 font-medium text-xs transition-all ${splitParts === num ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
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
 <div className="p-2 rounded-lg shadow-sm flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
 <Zap size={14} />
 </div>
 <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Queue Status</span>
 </div>
 <p className="text-xs font-medium text-slate-700 dark:text-slate-200 uppercase tracking-tight">
 {files.length === 0 ? 'Empty' : `${files.length} Item${files.length !== 1 ? 's' : ''} ready`}
 </p>
 </div>
 </div>

 <div className="pt-2 hidden lg:block">
 <button
 onClick={handleProcess}
 disabled={processing || files.length === 0}
 className="w-full py-5 text-white rounded-[1.5rem] text-lg sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter"
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
 <div className="flex-1 w-full space-y-4 sm:space-y-6">
 <div className={`bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden ${files.length === 0 ? 'max-w-4xl mx-auto w-full' : 'w-full'}`}>
 
 <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
 
 <div className="relative text-center space-y-4 mb-6">
 <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
 {isSplit ? <Scissors size={32} /> : <Combine size={32} />}
 </div>
 <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
 {isSplit ? 'Split PDF Documents' : 'Merge PDF Documents'}
 </h2>
 <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
 {isSplit ? 'Process multiple PDFs into parts instantly' : 'Combine multiple files into one session'}
 </p>
 </div>

 {files.length === 0 ? (
 <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">
   {/* Top Features Row */}
   <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
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

   {/* Custom Drop Zone */}
   <div 
     className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
     onClick={() => fileInputRef.current?.click()}
   >
     {/* Custom Illustration */}
     <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
        <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
           <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
           <div className="m-auto text-slate-300 dark:text-slate-600">
              {isSplit ? <Scissors size={32} /> : <Combine size={32} />}
           </div>
        </div>
        {/* Upload Arrow Overlay */}
        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
           <Upload size={20} strokeWidth={3} />
        </div>
        {/* Decorative elements */}
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

     <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
       <Plus size={20} /> SELECT PDF FILES
     </button>
   </div>

   {/* Bottom Features Row */}
   <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
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
 </div>
 ) : (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {(mergedResult || (isSplit && files.some(f => f.status === 'done'))) && (
 <div className={`p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 mb-8 sm:mb-6 text-center lg:text-left ${isSplit ? 'bg-violet-50 dark:bg-violet-500/5 border-violet-100 dark:border-violet-500/20' : 'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20'}`}>
 <div className="flex flex-col sm:flex-row items-center gap-6">
 <div className={`p-4 text-white rounded-2xl shadow-xl ${isSplit ? 'bg-violet-500 shadow-violet-500/30' : 'bg-green-500 shadow-green-500/30'}`}><CheckCircle2 size={32} /></div>
 <div>
 <h4 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">{isSplit ? 'Processing Complete' : 'Merge Ready'}</h4>
 <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
 {isSplit ? `Successfully processed ${files.length} documents` : `Your unified PDF is ready for download`}
 </p>
 </div>
 </div>
 {mergedResult && (
 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
 <a href={mergedResult.url} download={mergedResult.filename} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
 <Download size={18} /> {isSplit ? 'Download Batch (ZIP)' : 'Download PDF'}
 </a>
 {isSplit && (
 <button onClick={downloadIndividually} className="px-10 py-5 bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 border-2 border-violet-100 dark:border-violet-500/20 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
 <FilePlus size={18} /> Individually
 </button>
 )}
 </div>
 )}
 </div>
 )}

 {isSplit && splitResults.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {splitResults.map((res, i) => (
 <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:gap-6 group hover:shadow-2xl transition-all relative">
 <div className="aspect-square rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-violet-500/50 transition-colors">
 <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-violet-500 shadow-inner group-hover:scale-110 transition-transform">
 <FileText size={48} />
 </div>
 <div className="absolute bottom-4 left-0 right-0 px-4">
 <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest text-center">{res.pageCount || '?'} Pages</p>
 </div>
 <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 <div className="flex items-center justify-between gap-4 px-1">
 <div className="flex-1 min-w-0 text-left">
 <p className="text-xs font-medium text-slate-900 dark:text-white uppercase truncate tracking-tighter mb-1">{res.name}</p>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
 <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Part {i + 1}</p>
 </div>
 </div>
 <a href={res.url} download={res.name} className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl hover:scale-110 transition-all hover:bg-violet-500 hover:text-white group/btn">
 <Download size={20} />
 </a>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <>
 <div className="flex items-center justify-between px-2 mb-6">
 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
 <History size={14} /> {isSplit ? 'Files Queue' : 'Merging Order'} ({files.length})
 </h4>
 <button onClick={() => fileInputRef.current?.click()} className="text-[11px] font-medium uppercase tracking-widest text-orange-500 hover:opacity-80">
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
 </>
 )}
 </div>
 )}
 </div>

        {/* Mobile-only action button in upload section */}
        {files.length > 0 && !mergedResult && (!isSplit || splitResults.length === 0) && (
          <div className="pt-6 lg:hidden block animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleProcess}
              disabled={processing || files.length === 0}
              className="w-full py-5 text-white rounded-[1.5rem] text-lg font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter"
              style={{ background: ACCENT_GRADIENT }}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> {id === 'merge' ? 'Merging...' : 'Splitting...'}</span>
              ) : (
                <span className="flex items-center justify-center gap-3">{id === 'merge' ? 'Merge All' : 'Split All'} {isSplit ? <Scissors size={24} /> : <Combine size={24} />}</span>
              )}
            </button>
          </div>
        )}

 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
 {[
 { title: "Hardware Logic", desc: "Native browser processing means zero wait time for server uploads.", icon: Zap },
 { title: "Safe & Private", desc: "Your sensitive documents never leave your local machine.", icon: CheckCircle2 },
 { title: "Smart Batches", desc: "Handle multiple documents simultaneously with ease.", icon: LayoutGrid },
 ].map((feat, i) => (
 <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
 <feat.icon size={24} />
 </div>
 <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
 <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
 </div>
 ))}
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
 <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-medium shadow-sm shrink-0 ${f.status === 'done' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-400'}`}>
 {f.status === 'processing' ? <Loader2 className="animate-spin" size={14} /> : i + 1}
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-medium text-slate-900 dark:text-white text-[11px] uppercase truncate tracking-tighter">{f.file.name}</p>
 <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-0.5">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 {f.resultUrl && (
 <a href={f.resultUrl} download={f.resultName} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-[11px] font-medium uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2">
 <Download size={12} /> Save Split
 </a>
 )}
 <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
 </div>
 </div>
 );
}



