"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, X, FileText, EyeOff, CheckCircle, AlertCircle, RefreshCw, Zap, Shield, Sparkles, Plus, Lock, Trash2, Smartphone, Rocket } from "lucide-react";
import type * as PDFJS from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

async function pageHasTextLayer(pdfPage: PDFJS.PDFPageProxy): Promise<boolean> {
 const content = await pdfPage.getTextContent();
 return content.items.some((item: any) => item.str?.trim().length > 0);
}

type PageStatus = "pending" | "processing" | "done" | "error";
interface PageInfo { num: number; status: PageStatus; }

export default function RemoveOcr({ id: _id }: { id: string }) {
 const [file, setFile] = useState<File | null>(null);
 const [pages, setPages] = useState<PageInfo[]>([]);
 const [processing, setProcessing] = useState(false);
 const [done, setDone] = useState(false);
 const [resultBlob, setResultBlob] = useState<Blob | null>(null);
 const [dragging, setDragging] = useState(false);
 const [overallProgress, setOverallProgress] = useState(0);
 const [textLayerDetected, setTextLayerDetected] = useState<boolean | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const abortRef = useRef(false);

 const reset = () => {
 abortRef.current = true;
 setFile(null); setPages([]); setProcessing(false); setDone(false);
 setResultBlob(null); setOverallProgress(0); setTextLayerDetected(null);
 setTimeout(() => { abortRef.current = false; }, 100);
 };

 const loadFile = (f: File) => {
 if (!f.name.toLowerCase().endsWith(".pdf")) return;
 reset();
 setTimeout(async () => {
 abortRef.current = false;
 setFile(f); setDone(false); setResultBlob(null);
 try {
 const pdfjsLib = await import("pdfjs-dist");
 pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";
 const buf = await f.arrayBuffer();
 const pdfJs = await pdfjsLib.getDocument({ data: buf }).promise;
 const firstPage = await pdfJs.getPage(1);
 setTextLayerDetected(await pageHasTextLayer(firstPage));
 } catch { /* ignore */ }
 }, 120);
 };

 const onDrop = (e: React.DragEvent) => {
 e.preventDefault(); setDragging(false);
 const f = e.dataTransfer.files[0]; if (f) loadFile(f);
 };

 const runFlatten = useCallback(async (f: File) => {
 setProcessing(true); setDone(false); setResultBlob(null);

 const pdfjsLib = await import("pdfjs-dist");
 pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

 const buf = await f.arrayBuffer();
 const pdfJs = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
 const numPages = pdfJs.numPages;
 setPages(Array.from({ length: numPages }, (_, i) => ({ num: i + 1, status: "pending" })));

 const outDoc = await PDFDocument.create();

 for (let i = 1; i <= numPages; i++) {
 if (abortRef.current) break;
 setPages(prev => prev.map(p => p.num === i ? { ...p, status: "processing" } : p));

 try {
 const pdfPage = await pdfJs.getPage(i);
 const vp1x = pdfPage.getViewport({ scale: 1 });
 const vp3x = pdfPage.getViewport({ scale: 3 });

 const canvas = document.createElement("canvas");
 canvas.width = Math.floor(vp3x.width);
 canvas.height = Math.floor(vp3x.height);
 await pdfPage.render({ canvasContext: canvas.getContext("2d")!, canvas: canvas, viewport: vp3x, intent: "print", background: "rgb(255,255,255)" }).promise;

 const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
 const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer());
 const embeddedImg = await outDoc.embedJpg(imgBytes);
 const outPage = outDoc.addPage([vp1x.width, vp1x.height]);
 outPage.drawImage(embeddedImg, { x: 0, y: 0, width: vp1x.width, height: vp1x.height });

 setPages(prev => prev.map(p => p.num === i ? { ...p, status: "done" } : p));
 } catch {
 setPages(prev => prev.map(p => p.num === i ? { ...p, status: "error" } : p));
 }

 setOverallProgress(Math.round((i / numPages) * 100));
 }

 if (!abortRef.current) {
 const pdfBytes = await outDoc.save();
 setResultBlob(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
 setDone(true);
 }
 setProcessing(false);
 }, []);

 const handleDownload = () => {
 if (!resultBlob || !file) return;
 const url = URL.createObjectURL(resultBlob);
 const a = document.createElement("a");
 a.href = url; a.download = file.name.replace(/\.pdf$/i, "_image-only.pdf"); a.click();
 URL.revokeObjectURL(url);
 };

 const doneCount = pages.filter(p => p.status === "done").length;
 const errorCount = pages.filter(p => p.status === "error").length;
 const allFailed = done && doneCount === 0 && errorCount > 0;
 const blocked = textLayerDetected === false;

 const hex = '#8b5cf6';
 return (
 <div className="w-full max-w-4xl mx-auto py-4 sm:py-12 px-2 sm:px-6 text-center">
 <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[48px] p-4 sm:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 sm:space-y-12 relative">
 <div className="space-y-3">
 <div className="inline-flex p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl text-white shadow-xl shadow-violet-500/20" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
 <EyeOff size={32} className="sm:w-9 sm:h-9" />
 </div>
 <h2 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Remove OCR</h2>
 <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">Flatten PDF to image-only — permanently remove all hidden text layers and OCR data.</p>
 </div>

 <div className="space-y-6 w-full max-w-3xl mx-auto">
 <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
 {[
 { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
 { icon: Shield, title: "Private", desc: "Your files stay secure" },
 { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
 ].map((f, i) => (
 <div key={i} className="flex items-center gap-3 pointer-events-none">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: hex, backgroundColor: `${hex}15` }}>
 <f.icon size={20} />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
 <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Info banner */}
 <div className="rounded-2xl w-full px-4 py-3 flex items-start gap-3 text-sm font-medium bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20 text-left">
 <EyeOff size={16} className="mt-0.5 shrink-0" />
 <span>Upload a selectable PDF. Each page will be rasterized to an image — removing all text layers, making it non-selectable and non-searchable.</span>
 </div>

 {!file ? (
 <>
 <div className="relative w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group overflow-hidden mb-6"
 onDragOver={e => { e.preventDefault(); setDragging(true); }}
 onDragLeave={() => setDragging(false)}
 onDrop={onDrop}
 onClick={() => fileInputRef.current?.click()}>
 <input ref={fileInputRef} type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-30" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
 
 <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
 <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
 <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
 <div className="m-auto text-slate-300 dark:bg-slate-800">
 <EyeOff size={32} />
 </div>
 </div>
 <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
 <Upload size={20} strokeWidth={3} />
 </div>
 <Plus size={16} className="absolute -top-4 -left-6 opacity-60 text-slate-400" />
 <Plus size={12} className="absolute top-10 -right-8 opacity-60 text-slate-400" />
 <Plus size={14} className="absolute bottom-2 -left-8 opacity-60 text-slate-400" />
 </div>

 <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center pointer-events-none z-10">
 Drag & drop your PDF file here
 </h3>
 <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center pointer-events-none z-10">
 or click to <span style={{ color: hex }}>browse</span>
 </p>
 <p className="text-sm text-slate-400 font-medium mb-8 text-center pointer-events-none z-10">
 Supports single PDF file
 </p>

 <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-20 flex items-center gap-3 pointer-events-none" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
 <Plus size={20} /> SELECT PDF FILE
 </button>
 </div>

 <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/50 z-10 pointer-events-none">
 {[
 { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
 { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
 { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
 { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
 ].map((f, i) => (
 <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
 <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: hex, backgroundColor: `${hex}10` }}>
 <f.icon size={16} />
 </div>
 <div>
 <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
 <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </>
 ) : (
 <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
 <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 shrink-0"><FileText size={20} className="text-red-500" /></div>
 <div className="flex-1 min-w-0">
 <p className="font-medium text-slate-800 dark:text-white text-sm truncate">{file.name}</p>
 <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
 </div>
 {!processing && (
 <button onClick={reset} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
 )}
 </div>
 )}

 {/* Already image-based error */}
 {file && !processing && !done && blocked && (
 <div className="rounded-2xl px-4 py-3 flex items-start gap-3 text-sm font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-500/20">
 <AlertCircle size={16} className="mt-0.5 shrink-0" />
 <span>This PDF is already non-selectable. It has no text layer to remove.</span>
 </div>
 )}

 {/* Process button */}
 {file && !processing && !done && !blocked && (
 <button onClick={() => runFlatten(file)}
 className="w-full py-4 rounded-2xl font-medium text-white text-sm uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
 style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 20px -4px rgba(139,92,246,0.4)" }}>
 Remove OCR — Flatten to Image
 </button>
 )}

 {/* Progress */}
 {processing && (
 <div className="space-y-3">
 <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
 <span className="flex items-center gap-2">
 <Loader2 size={14} className="animate-spin text-violet-500" />
 Flattening page {Math.min(doneCount + errorCount + 1, pages.length)} of {pages.length}…
 </span>
 <span>{overallProgress}%</span>
 </div>
 <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
 <div className="h-full rounded-full transition-all duration-300" style={{ width: `${overallProgress}%`, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }} />
 </div>
 <p className="text-xs text-slate-400 text-center">{doneCount} of {pages.length} pages done{errorCount > 0 && ` · ${errorCount} error${errorCount > 1 ? "s" : ""}`}</p>
 </div>
 )}

 {/* Done */}
 {done && (
 <div className="space-y-4">
 {allFailed ? (
 <div className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
 <AlertCircle size={28} className="text-red-500" />
 <div>
 <p className="font-medium text-sm text-slate-800 dark:text-white">Flattening failed</p>
 <p className="text-xs text-slate-500 mt-1">Could not process this PDF. It may be encrypted or corrupted.</p>
 </div>
 <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
 <RefreshCw size={14} /> Try Another File
 </button>
 </div>
 ) : (
 <>
 <div className={`rounded-2xl p-4 flex items-center gap-3 ${errorCount === 0 ? "bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20" : "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20"}`}>
 {errorCount === 0 ? <CheckCircle size={20} className="text-green-500 shrink-0" /> : <AlertCircle size={20} className="text-yellow-500 shrink-0" />}
 <div className="flex-1">
 <p className="font-medium text-sm text-slate-800 dark:text-white">{errorCount === 0 ? "Flattening complete!" : `${doneCount} of ${pages.length} pages processed`}</p>
 <p className="text-xs text-slate-500 mt-0.5">
 {errorCount === 0 ? `${doneCount} page${doneCount !== 1 ? "s" : ""} flattened — text layer removed` : `${doneCount} flattened · ${errorCount} failed`}
 </p>
 </div>
 </div>
 <div className="flex gap-3">
 <button onClick={handleDownload}
 className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-white text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
 style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 20px -4px rgba(139,92,246,0.4)" }}>
 <Download size={16} /> Download PDF
 </button>
 <button onClick={reset} className="px-5 py-3.5 rounded-2xl font-medium text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
 New File
 </button>
 </div>
 </>
 )}
 </div>
 )}

 {/* Page grid */}
 {pages.length > 0 && pages.some(p => p.status !== "pending") && (
 <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
 {pages.map(p => (
 <div key={p.num} className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 text-center transition-all ${
 p.status === "done" ? "border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/20"
 : p.status === "processing" ? "border-violet-200 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500/20"
 : p.status === "error" ? "border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20"
 : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
 }`}>
 {p.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600" />}
 {p.status === "processing" && <Loader2 size={14} className="animate-spin text-violet-500" />}
 {p.status === "done" && <CheckCircle size={14} className="text-green-500" />}
 {p.status === "error" && <AlertCircle size={14} className="text-red-400" />}
 <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{p.num}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}



