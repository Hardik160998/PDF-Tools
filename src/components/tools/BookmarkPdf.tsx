"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, X, FileText, CheckCircle2, Loader2, Bookmark, Plus, Trash2, Edit3, ChevronUp, ChevronDown, Save, Zap, Shield, Sparkles, Lock, Smartphone, Rocket } from "lucide-react";
import { PDFDocument, PDFDict, PDFName, PDFNull, PDFNumber, PDFString } from "pdf-lib";
import type * as PDFJS from 'pdfjs-dist';

interface BookmarkItem { id: string; title: string; page: number; }

export default function BookmarkPdf({ id: _id }: { id: string }) {
 const [file, setFile] = useState<File | null>(null);
 const [pdfDoc, setPdfDoc] = useState<PDFJS.PDFDocumentProxy | null>(null);
 const [totalPages, setTotalPages] = useState(0);
 const [currentPage, setCurrentPage] = useState(1);
 const [scale, setScale] = useState(1.3);
 const [loading, setLoading] = useState(false);
 const [processing, setProcessing] = useState(false);
 const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
 const [result, setResult] = useState<string | null>(null);
 const [newTitle, setNewTitle] = useState("");
 const [editId, setEditId] = useState<string | null>(null);
 const [editTitle, setEditTitle] = useState("");
 const [editPage, setEditPage] = useState(1);
 const [addingNew, setAddingNew] = useState(false);
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const bufRef = useRef<ArrayBuffer | null>(null);
 const renderTaskRef = useRef<any>(null);

 const loadFile = useCallback(async (f: File) => {
 if (!f.name.endsWith(".pdf")) return;
 setLoading(true);
 setFile(f); setBookmarks([]); setResult(null); setCurrentPage(1);
 const buf = await f.arrayBuffer();
 bufRef.current = buf.slice(0);
 const pdfjsLib = await import('pdfjs-dist');
 pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
 const doc = await pdfjsLib.getDocument({ data: buf }).promise;
 setPdfDoc(doc);
 setTotalPages(doc.numPages);
 setLoading(false);
 }, []);

 // Render current page
 useEffect(() => {
 if (!pdfDoc || !canvasRef.current) return;
 if (renderTaskRef.current) { renderTaskRef.current.cancel(); }
 let cancelled = false;
 (async () => {
 try {
 const pg = await pdfDoc.getPage(currentPage);
 const vp = pg.getViewport({ scale });
 const canvas = canvasRef.current!;
 canvas.width = vp.width;
 canvas.height = vp.height;
 const task = pg.render({ canvasContext: canvas.getContext("2d")!, canvas, viewport: vp });
 renderTaskRef.current = task;
 await task.promise;
 } catch {}
 })();
 return () => { cancelled = true; };
 }, [pdfDoc, currentPage, scale]);

 const addBookmark = () => {
 if (!newTitle.trim()) return;
 setBookmarks(prev => [...prev, { id: crypto.randomUUID(), title: newTitle.trim(), page: currentPage }]);
 setNewTitle("");
 setAddingNew(false);
 };

 const removeBookmark = (id: string) => setBookmarks(prev => prev.filter(b => b.id !== id));

 const startEdit = (b: BookmarkItem) => { setEditId(b.id); setEditTitle(b.title); setEditPage(b.page); };
 const saveEdit = () => {
 setBookmarks(prev => prev.map(b => b.id === editId ? { ...b, title: editTitle.trim() || b.title, page: editPage } : b));
 setEditId(null);
 };

 const moveUp = (i: number) => {
 if (i === 0) return;
 setBookmarks(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
 };
 const moveDown = (i: number) => {
 setBookmarks(prev => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
 };

 const handleApply = async () => {
 if (!bufRef.current || bookmarks.length === 0) return;
 setProcessing(true);
 try {
 const doc = await PDFDocument.load(bufRef.current);
 const ctx = doc.context;
 const pages = doc.getPages();

 // 1. Build root outline dict first so we can reference it as Parent
 const root = PDFDict.withContext(ctx);
 root.set(PDFName.of('Type'), PDFName.of('Outlines'));
 const rootRef = ctx.register(root);

 // 2. Build each outline item
 const refs = bookmarks.map(b => {
 const idx = Math.min(Math.max(b.page - 1, 0), pages.length - 1);
 const pageRef = doc.getPage(idx).ref;
 const dict = PDFDict.withContext(ctx);
 dict.set(PDFName.of('Title'), PDFString.of(b.title));
 // Dest as indirect array so all viewers resolve it correctly
 const destRef = ctx.register(ctx.obj([pageRef, PDFName.of('XYZ'), PDFNull, PDFNull, PDFNull]));
 dict.set(PDFName.of('Dest'), destRef);
 dict.set(PDFName.of('Parent'), rootRef);
 dict.set(PDFName.of('Count'), PDFNumber.of(0));
 return ctx.register(dict);
 });

 // 3. Link siblings
 for (let i = 0; i < refs.length; i++) {
 const item = ctx.lookup(refs[i]) as PDFDict;
 if (i > 0) item.set(PDFName.of('Prev'), refs[i - 1]);
 if (i < refs.length - 1) item.set(PDFName.of('Next'), refs[i + 1]);
 }

 // 4. Finalise root
 root.set(PDFName.of('First'), refs[0]);
 root.set(PDFName.of('Last'), refs[refs.length - 1]);
 root.set(PDFName.of('Count'), PDFNumber.of(refs.length));

 doc.catalog.set(PDFName.of('Outlines'), rootRef);
 doc.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));

 const bytes = await doc.save();
 setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
 } catch (e) { console.error(e); alert('Error adding bookmarks.'); }
 finally { setProcessing(false); }
 };

 const reset = () => {
 setFile(null); setPdfDoc(null); setBookmarks([]); setResult(null);
 setCurrentPage(1); bufRef.current = null; setAddingNew(false);
 };

 const [showSidebar, setShowSidebar] = useState(true);

 useEffect(() => {
 const handleResize = () => {
 if (window.innerWidth < 768) setShowSidebar(false);
 else setShowSidebar(true);
 };
 handleResize();
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);

  if (!file && !loading) {
  const hex = '#f59e0b';
  return (
  <div className="w-full max-w-4xl mx-auto py-4 sm:py-12 px-2 sm:px-6 text-center">
  <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[48px] p-4 sm:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 sm:space-y-12 relative">
  <div className="space-y-3">
  <div className="inline-flex p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl text-white shadow-xl shadow-amber-500/20" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
  <Bookmark size={32} className="sm:w-9 sm:h-9" />
  </div>
  <h2 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Bookmark PDF</h2>
  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">Add a clickable outline to your PDF — visible in all modern PDF viewers.</p>
  </div>

  <div className="space-y-6 flex-1 flex flex-col items-center w-full max-w-3xl mx-auto">
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

  <div className="relative w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group overflow-hidden mb-6"
  onDragOver={e => e.preventDefault()}
  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
  onClick={() => fileInputRef.current?.click()}>
  <input ref={fileInputRef} type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-30" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
  
  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
  <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
  <div className="m-auto text-slate-300 dark:bg-slate-800">
  <Bookmark size={32} />
  </div>
  </div>
  <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
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

  <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-20 flex items-center gap-3 pointer-events-none" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
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
  </div>
  </div>
  </div>
  );
  }

 if (loading) {
 return (
 <div className="max-w-5xl mx-auto py-12 sm:py-20 px-4 flex flex-col items-center gap-4">
 <Loader2 size={40} className="animate-spin text-amber-500" />
 <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Loading PDF…</p>
 </div>
 );
 }

 if (result) {
 return (
 <div className="max-w-5xl mx-auto py-2 sm:py-10 px-2 sm:px-4">
 <div className="bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-shadow duration-300 space-y-10 text-center py-10 sm:py-16">
 <div className="inline-flex p-10 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 scale-110 border border-amber-500/20 shadow-xl shadow-amber-500/10"><CheckCircle2 size={72} /></div>
 <div className="space-y-3">
 <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Bookmarks Added!</h3>
 <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest px-4 leading-relaxed">{bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""} added to your PDF successfully</p>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
 <a href={result} download={`bookmarked_${file!.name}`}
 className="flex-1 py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-lg sm:text-xl font-medium shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
 style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
 <Download size={24} /> Download PDF
 </a>
 <button onClick={reset} className="px-8 py-4 sm:px-10 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-medium transition-all text-sm sm:text-base">
 Start Over
 </button>
 </div>
 </div>
 </div>
 );
 }

 // ── MAIN EDITOR VIEW (like Adobe Reader) ──
 return (
 <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden" style={{ height: "85vh", minHeight: 600 }}>

 {/* Top toolbar */}
 <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700 gap-2 shrink-0">
 <div className="flex items-center gap-2 sm:gap-3 min-w-0">
 <button onClick={() => setShowSidebar(!showSidebar)} className={`p-2 rounded-lg transition-colors ${showSidebar ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
 <Bookmark size={18} />
 </button>
 <div className="hidden sm:block min-w-0">
 <p className="font-medium text-slate-800 dark:text-white text-[13px] truncate max-w-[150px]">{file!.name}</p>
 </div>
 </div>
 
 <div className="flex items-center gap-1.5 sm:gap-2">
 <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm">
 <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-500 disabled:opacity-30">‹</button>
 <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 px-1">{currentPage} / {totalPages}</span>
 <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-500 disabled:opacity-30">›</button>
 </div>
 
 <div className="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm">
 <button onClick={() => setScale(s => Math.max(0.3, +(s - 0.2).toFixed(1)))} className="p-1.5 text-slate-500">−</button>
 <span className="text-[10px] font-medium text-slate-400 w-9 text-center">{Math.round(scale * 100)}%</span>
 <button onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))} className="p-1.5 text-slate-500">+</button>
 </div>

 <button onClick={handleApply} disabled={processing || bookmarks.length === 0}
 className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-white text-[11px] sm:text-xs font-medium disabled:opacity-50 transition-all shadow-lg active:scale-95 shrink-0"
 style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
 {processing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
 <span className="hidden sm:inline">{processing ? "Saving…" : "Save PDF"}</span>
 <span className="sm:hidden">{processing ? "" : "Save"}</span>
 </button>
 <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"><X size={18} /></button>
 </div>
 </div>

 {/* Body: sidebar + PDF viewer */}
 <div className="flex-1 flex overflow-hidden relative">

 {/* ── LEFT SIDEBAR — Bookmarks panel ── */}
 <div className={`absolute md:relative z-20 h-full w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full md:hidden'}`}>
 {/* Sidebar header */}
 <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
 <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Document Outline</span>
 <button onClick={() => setAddingNew(true)} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
 <Plus size={16} />
 </button>
 </div>

 {/* Add new bookmark inline */}
 {addingNew && (
 <div className="px-4 py-4 border-b border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 space-y-3 animate-in slide-in-from-top-2 duration-300">
 <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
 onKeyDown={e => { if (e.key === "Enter") addBookmark(); if (e.key === "Escape") setAddingNew(false); }}
 placeholder="Enter outline title…"
 className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-800 text-[13px] font-medium text-slate-800 dark:text-white outline-none focus:ring-2 ring-amber-500/20" />
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
 <span>At Page:</span>
 <span className="text-amber-600">{currentPage}</span>
 </div>
 <div className="flex gap-2">
 <button onClick={() => { setAddingNew(false); setNewTitle(""); }} className="px-3 py-1.5 rounded-lg text-slate-400 text-[11px] font-medium uppercase tracking-widest hover:text-slate-600">Cancel</button>
 <button onClick={addBookmark} disabled={!newTitle.trim()} className="px-4 py-1.5 rounded-lg text-white text-[11px] font-medium uppercase tracking-widest shadow-md disabled:opacity-50" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>Add</button>
 </div>
 </div>
 </div>
 )}

 {/* Bookmark list */}
 <div className="flex-1 overflow-y-auto scrollbar-hide">
 {bookmarks.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-48 gap-3 px-4 text-center opacity-40">
 <Bookmark size={32} className="text-slate-300" />
 <div>
 <p className="text-[11px] font-medium uppercase tracking-widest">No Outlines Yet</p>
 <p className="text-[10px] font-medium mt-1">Navigate to a page and click +</p>
 </div>
 </div>
 ) : (
 <div className="py-1">
 {bookmarks.map((b, i) => (
 <div key={b.id}>
 {editId === b.id ? (
 <div className="px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border-l-2 border-amber-400 space-y-1.5">
 <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
 onKeyDown={e => e.key === "Enter" && saveEdit()}
 className="w-full px-2 py-1 rounded-lg border border-amber-300 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white outline-none" />
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] text-slate-400">Page</span>
 <input type="number" min={1} max={totalPages} value={editPage}
 onChange={e => setEditPage(Math.min(totalPages, Math.max(1, Number(e.target.value))))}
 className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-medium text-center outline-none" />
 <button onClick={saveEdit} className="ml-auto p-1 rounded-lg text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"><Save size={13} /></button>
 <button onClick={() => setEditId(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><X size={13} /></button>
 </div>
 </div>
 ) : (
 <div
 onClick={() => setCurrentPage(b.page)}
 className={`group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-amber-50 dark:hover:bg-amber-500/10 ${currentPage === b.page ? "bg-amber-50 dark:bg-amber-500/10 border-l-2 border-amber-400" : "border-l-2 border-transparent"}`}>
 <Bookmark size={12} className={`shrink-0 ${currentPage === b.page ? "text-amber-500" : "text-slate-400"}`} />
 <div className="flex-1 min-w-0">
 <p className={`text-xs font-medium truncate ${currentPage === b.page ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}>{b.title}</p>
 <p className="text-[10px] text-slate-400">Page {b.page}</p>
 </div>
 <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
 <button onClick={e => { e.stopPropagation(); moveUp(i); }} disabled={i === 0} className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={11} /></button>
 <button onClick={e => { e.stopPropagation(); moveDown(i); }} disabled={i === bookmarks.length - 1} className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={11} /></button>
 <button onClick={e => { e.stopPropagation(); startEdit(b); }} className="p-0.5 text-slate-400 hover:text-amber-500"><Edit3 size={11} /></button>
 <button onClick={e => { e.stopPropagation(); removeBookmark(b.id); }} className="p-0.5 text-slate-400 hover:text-red-500"><Trash2 size={11} /></button>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Sidebar footer */}
 <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30">
 <button onClick={() => { setAddingNew(true); }}
 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[11px] font-medium uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
 style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
 <Plus size={14} /> Add Outline
 </button>
 </div>
 </div>

 {/* ── RIGHT — PDF Canvas ── */}
 <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 scrollbar-hide" onClick={() => { if (window.innerWidth < 768 && showSidebar) setShowSidebar(false); }}>
 <div className="flex items-start justify-center p-4 sm:p-8 min-h-full">
 <canvas ref={canvasRef} className="block shadow-2xl rounded-sm bg-white shrink-0 max-w-full h-auto" />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}



