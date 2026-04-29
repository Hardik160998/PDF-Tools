"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Download, ChevronLeft, ChevronRight,
  Minus, Plus, Highlighter, Type, Pen, Eraser,
  FileText, X, MousePointer, Undo2, Shield, Zap, Lock
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

type Tool = "select" | "highlight" | "text" | "draw" | "eraser";

interface DrawAnnotation {
  id: string; type: "draw"; page: number;
  data: { points: { x: number; y: number }[]; color: string; width: number };
}
interface HighlightAnnotation {
  id: string; type: "highlight"; page: number;
  data: { x: number; y: number; w: number; h: number; color: string };
}
interface TextAnnotation {
  id: string; type: "text"; page: number;
  data: { x: number; y: number; text: string; color: string; fontSize: number };
}
type AnyAnnotation = DrawAnnotation | HighlightAnnotation | TextAnnotation;

const COLORS = ["#FBBF24", "#34D399", "#60A5FA", "#F87171", "#A78BFA", "#000000"];
const TOOL_META: Record<Tool, { label: string; icon: React.ElementType }> = {
  select:    { label: "Select",    icon: MousePointer },
  highlight: { label: "Highlight", icon: Highlighter  },
  text:      { label: "Text",      icon: Type         },
  draw:      { label: "Draw",      icon: Pen          },
  eraser:    { label: "Eraser",    icon: Eraser       },
};

const FEATURES = [
  { icon: Highlighter, label: "Highlight", desc: "Mark key passages instantly", color: "#f59e0b", bg: "rgba(251,191,36,0.1)" },
  { icon: Type,        label: "Add Text",  desc: "Insert notes anywhere",        color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { icon: Pen,         label: "Draw",      desc: "Freehand pen annotations",     color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { icon: Eraser,      label: "Erase",     desc: "Remove marks cleanly",         color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
];

export default function PdfEditor() {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [fileName, setFileName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.3);
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]);
  const [annotations, setAnnotations] = useState<AnyAnnotation[]>([]);
  const [editingText, setEditingText] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState("");
  const [dragging, setDragging] = useState(false);

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const overlayRef  = useRef<HTMLCanvasElement>(null);
  const drawingRef  = useRef<{ points: { x: number; y: number }[] } | null>(null);
  const highlightRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const pg = await pdfDoc.getPage(page);
      const viewport = pg.getViewport({ scale });
      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pg.render({ canvas: canvas, viewport }).promise;
      if (!cancelled) drawAnnotations();
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, page, scale]);

  const drawAnnotations = useCallback(() => {
    const overlay = overlayRef.current;
    const base = canvasRef.current;
    if (!overlay || !base) return;
    overlay.width = base.width;
    overlay.height = base.height;
    const ctx = overlay.getContext("2d")!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    annotations.filter(a => a.page === page).forEach(ann => {
      if (ann.type === "highlight") {
        const h = ann as HighlightAnnotation;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = h.data.color;
        ctx.fillRect(h.data.x, h.data.y, h.data.w, h.data.h);
        ctx.globalAlpha = 1;
      } else if (ann.type === "draw") {
        const d = ann as DrawAnnotation;
        if (d.data.points.length < 2) return;
        ctx.strokeStyle = d.data.color;
        ctx.lineWidth = d.data.width;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(d.data.points[0].x, d.data.points[0].y);
        d.data.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (ann.type === "text") {
        const t = ann as TextAnnotation;
        ctx.font = `bold ${t.data.fontSize}px Inter, sans-serif`;
        ctx.fillStyle = t.data.color;
        ctx.fillText(t.data.text, t.data.x, t.data.y);
      }
    });
  }, [annotations, page]);

  useEffect(() => { drawAnnotations(); }, [drawAnnotations]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") return;
    const pos = getPos(e);
    if (tool === "text") {
      setEditingText(pos); setTextInput("");
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }
    if (tool === "draw") drawingRef.current = { points: [pos] };
    if (tool === "highlight") highlightRef.current = pos;
    if (tool === "eraser") {
      const hit = [...annotations].reverse().find(a => {
        if (a.page !== page) return false;
        if (a.type === "highlight") {
          const h = a as HighlightAnnotation;
          return pos.x >= h.data.x && pos.x <= h.data.x + h.data.w &&
                 pos.y >= h.data.y && pos.y <= h.data.y + h.data.h;
        }
        if (a.type === "text") {
          const t = a as TextAnnotation;
          return Math.abs(pos.x - t.data.x) < 80 && Math.abs(pos.y - t.data.y) < 20;
        }
        return false;
      });
      if (hit) setAnnotations(prev => prev.filter(a => a.id !== hit.id));
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "draw" && drawingRef.current) {
      const pos = getPos(e);
      drawingRef.current.points.push(pos);
      drawAnnotations();
      const pts = drawingRef.current.points;
      if (pts.length >= 2) {
        const ctx = overlayRef.current!.getContext("2d")!;
        ctx.strokeStyle = color; ctx.lineWidth = 3;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
    }
    if (tool === "highlight" && highlightRef.current) {
      const pos = getPos(e);
      const start = highlightRef.current;
      drawAnnotations();
      const ctx = overlayRef.current!.getContext("2d")!;
      ctx.globalAlpha = 0.35; ctx.fillStyle = color;
      ctx.fillRect(start.x, start.y, pos.x - start.x, pos.y - start.y);
      ctx.globalAlpha = 1;
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    if (tool === "draw" && drawingRef.current) {
      const pts = drawingRef.current.points;
      if (pts.length > 1)
        setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "draw", page, data: { points: pts, color, width: 3 } } as DrawAnnotation]);
      drawingRef.current = null;
    }
    if (tool === "highlight" && highlightRef.current) {
      const start = highlightRef.current;
      const w = pos.x - start.x, h = pos.y - start.y;
      if (Math.abs(w) > 5 && Math.abs(h) > 5)
        setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "highlight", page, data: { x: start.x, y: start.y, w, h, color } } as HighlightAnnotation]);
      highlightRef.current = null;
    }
  };

  const commitText = () => {
    if (editingText && textInput.trim())
      setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "text", page, data: { x: editingText.x, y: editingText.y, text: textInput.trim(), color, fontSize: 18 } } as TextAnnotation]);
    setEditingText(null); setTextInput("");
  };

  const undo = () => {
    const pageAnns = annotations.filter(a => a.page === page);
    if (!pageAnns.length) return;
    setAnnotations(prev => prev.filter(a => a.id !== pageAnns[pageAnns.length - 1].id));
  };

  const loadFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    setFileName(file.name);
    const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    setPdfDoc(doc); setTotalPages(doc.numPages); setPage(1); setAnnotations([]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const downloadAnnotated = () => {
    const base = canvasRef.current!, overlay = overlayRef.current!;
    const merged = document.createElement("canvas");
    merged.width = base.width; merged.height = base.height;
    const ctx = merged.getContext("2d")!;
    ctx.drawImage(base, 0, 0); ctx.drawImage(overlay, 0, 0);
    merged.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `annotated_page${page}.png`;
      a.click();
    });
  };

  const cursorMap: Record<Tool, string> = {
    select: "default", highlight: "crosshair", text: "text", draw: "crosshair", eraser: "cell",
  };

  /* ── UPLOAD / LANDING SCREEN ── */
  if (!pdfDoc) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(160deg,#f0f7ff 0%,#faf5ff 50%,#fff7f0 100%)" }}>
        <div className="bg-mesh-premium" />
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} className="hidden" />

        {/* Hero */}
        <section className="mx-auto px-4 py-24 text-center relative z-10 max-w-7xl">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border" style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", borderColor: "rgba(59,130,246,0.2)" }}>
              <Pen size={12} /> Work Directly on Your Files
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-5" style={{ color: "#0f172a" }}>
              Open, Annotate &amp; Edit<br />
              <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Your PDF Instantly
              </span>
            </h1>

            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
              Highlight, draw, and add text directly on any PDF — processed entirely in your browser. No uploads, no accounts.
            </p>
          </div>
        </section>

        {/* Drop zone */}
        <section className="mx-auto px-4 pb-16 max-w-7xl relative z-10">
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => fileInputRef.current?.click()} className="relative rounded-3xl cursor-pointer transition-all duration-200 group" style={{ background: dragging ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.9)", border: `2px dashed ${dragging ? "#3b82f6" : "#cbd5e1"}`, padding: "3.5rem 2rem", boxShadow: dragging ? "0 0 0 4px rgba(59,130,246,0.15)" : "0 8px 32px -8px rgba(0,0,0,0.1)" }}>
            <div className="flex flex-col items-center gap-4 pointer-events-none">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-110" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  <Upload size={36} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md" style={{ animation: "bounce 2s infinite" }}>
                  <FileText size={14} className="text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-slate-800 mb-1">{dragging ? "Drop your PDF here!" : "Click or drag & drop your PDF"}</p>
                <p className="text-sm text-slate-400 font-medium">Your file stays on your device — always</p>
              </div>
              <button className="px-7 py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest shadow-lg transition-all group-hover:shadow-xl group-hover:scale-105" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Choose PDF File</button>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mx-auto px-4 pb-20 max-w-7xl relative z-10">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-6">What you can do</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="rounded-2xl p-5 text-center bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="font-black text-sm text-slate-800 mb-1">{label}</p>
                <p className="text-xs text-slate-400 font-medium leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto px-4 pb-24 max-w-7xl relative z-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-8">How it works</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[ { n: "1", title: "Open Your PDF", desc: "Click or drag any PDF. It loads instantly — no server involved.", color: "#3b82f6" }, { n: "2", title: "Annotate Freely", desc: "Highlight, draw, add text, or erase using the toolbar.", color: "#8b5cf6" }, { n: "3", title: "Save Your Work", desc: "Download the annotated page as a PNG with one click.", color: "#f59e0b" }, ].map(({ n, title, desc, color }) => (
                <div key={n} className="space-y-2">
                  <div className="text-5xl font-black opacity-15 leading-none" style={{ color }}>{n}</div>
                  <p className="font-black text-slate-800">{title}</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ── EDITOR ── */
  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => { setPdfDoc(null); setAnnotations([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-blue-500 shrink-0" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{fileName}</span>
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          {(Object.keys(TOOL_META) as Tool[]).map(t => {
            const { icon: Icon, label } = TOOL_META[t];
            return (
              <button key={t} title={label} onClick={() => setTool(t)}
                className={`p-2 rounded-lg transition-all ${tool === t ? "bg-white dark:bg-slate-800 shadow text-blue-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}>
                <Icon size={17} />
              </button>
            );
          })}
        </div>

        {/* Color picker */}
        {(tool === "highlight" || tool === "draw" || tool === "text") && (
          <div className="flex items-center gap-1.5">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-slate-400" : "border-transparent"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button onClick={undo} title="Undo" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <Undo2 size={17} />
          </button>
          <button onClick={downloadAnnotated}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow">
            <Download size={15} /> Save Page
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <div className="relative shadow-2xl rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="block" />
          <canvas ref={overlayRef} className="absolute inset-0"
            style={{ cursor: cursorMap[tool] }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
          {editingText && (
            <input ref={textInputRef} value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commitText(); if (e.key === "Escape") { setEditingText(null); setTextInput(""); } }}
              onBlur={commitText}
              className="absolute bg-transparent border-b-2 border-blue-500 outline-none text-lg font-bold"
              style={{ left: editingText.x, top: editingText.y - 20, color, minWidth: 120 }}
              placeholder="Type here…" />
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 min-w-[80px] text-center">{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
          <ChevronRight size={18} />
        </button>
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
        <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Minus size={16} />
        </button>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-12 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
