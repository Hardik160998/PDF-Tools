"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Download, ChevronLeft, ChevronRight, Minus, Plus, Highlighter, Type, Pen, Eraser,
  FileText, X, MousePointer, Undo2, Move, Image, ChevronDown
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

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

// Floating draggable text box state
interface FloatingText {
  // fixed viewport position (for rendering the box)
  fixedX: number; fixedY: number;
  // canvas pixel coords (for storing the annotation)
  canvasX: number; canvasY: number;
  text: string; color: string; fontSize: number;
}

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
  const [floatingText, setFloatingText] = useState<FloatingText | null>(null);
  const [boxDragging, setBoxDragging] = useState(false);
  const boxDragOffset = useRef({ dx: 0, dy: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const commitText = useCallback(() => {
    if (!floatingText) return;
    const safe = floatingText.text.trim();
    if (safe) {
      setAnnotations(prev => [...prev, {
        id: crypto.randomUUID(), type: "text", page,
        data: { x: floatingText.canvasX, y: floatingText.canvasY, text: safe, color: floatingText.color, fontSize: floatingText.fontSize }
      } as TextAnnotation]);
    }
    setFloatingText(null);
  }, [floatingText, page]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "text") return;
    if (floatingText) commitText();
    const overlay = overlayRef.current!;
    const rect = overlay.getBoundingClientRect();
    const sx = overlay.width / rect.width;
    const sy = overlay.height / rect.height;
    setFloatingText({
      fixedX: e.clientX,
      fixedY: e.clientY,
      canvasX: (e.clientX - rect.left) * sx,
      canvasY: (e.clientY - rect.top) * sy,
      text: "",
      color,
      fontSize,
    });
    setTimeout(() => textAreaRef.current?.focus(), 30);
  };

  const [dragging, setDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [penSize, setPenSize] = useState(3);
  const [fontSize, setFontSize] = useState(18);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [showDlMenu, setShowDlMenu] = useState(false);
  const originalFileRef = useRef<ArrayBuffer | null>(null);

  // close download menu on outside click
  useEffect(() => {
    if (!showDlMenu) return;
    const handler = () => setShowDlMenu(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showDlMenu]);

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const overlayRef   = useRef<HTMLCanvasElement>(null);
  const drawingRef   = useRef<{ points: { x: number; y: number }[] } | null>(null);
  const highlightRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawAnnotations = useCallback(() => {
    const overlay = overlayRef.current;
    const base = canvasRef.current;
    if (!overlay || !base) return;
    if (overlay.width !== base.width || overlay.height !== base.height) {
      overlay.width = base.width;
      overlay.height = base.height;
    }
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
        // Adjust y for text baseline (fillText uses baseline, not top)
        const textY = t.data.y + t.data.fontSize * 0.85;
        ctx.fillText(t.data.text, t.data.x, textY);
      }
    });
  }, [annotations, page]);

  const generateThumbnails = useCallback(async (doc: pdfjsLib.PDFDocumentProxy) => {
    const thumbs: string[] = [];
    const thumbScale = 0.15;
    for (let i = 1; i <= doc.numPages; i++) {
      try {
        const pg = await doc.getPage(i);
        const viewport = pg.getViewport({ scale: thumbScale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pg.render({ canvas, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      } catch (e) {
        thumbs.push("");
      }
    }
    setPageThumbnails(thumbs);
  }, []);

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
      if (!cancelled) {
        const overlay = overlayRef.current;
        if (overlay) { overlay.width = canvas.width; overlay.height = canvas.height; }
        drawAnnotations();
      }
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, page, scale, drawAnnotations]);

  useEffect(() => { drawAnnotations(); }, [drawAnnotations]);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const overlay = overlayRef.current!;
    const rect = overlay.getBoundingClientRect();
    const scaleX = overlay.width / rect.width;
    const scaleY = overlay.height / rect.height;
    return {
      canvasX: (e.clientX - rect.left) * scaleX,
      canvasY: (e.clientY - rect.top) * scaleY,
      cssX: e.clientX - rect.left,
      cssY: e.clientY - rect.top,
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select" || tool === "text") return; // text handled by onClick
    const pos = getPos(e);
    if (tool === "draw") drawingRef.current = { points: [{ x: pos.canvasX, y: pos.canvasY }] };
    if (tool === "highlight") highlightRef.current = { x: pos.canvasX, y: pos.canvasY };
    if (tool === "eraser") {
      const hit = [...annotations].reverse().find(a => {
        if (a.page !== page) return false;
        if (a.type === "highlight") {
          const h = a as HighlightAnnotation;
          const x0 = Math.min(h.data.x, h.data.x + h.data.w);
          const x1 = Math.max(h.data.x, h.data.x + h.data.w);
          const y0 = Math.min(h.data.y, h.data.y + h.data.h);
          const y1 = Math.max(h.data.y, h.data.y + h.data.h);
          return pos.canvasX >= x0 && pos.canvasX <= x1 && pos.canvasY >= y0 && pos.canvasY <= y1;
        }
        if (a.type === "text") {
          const t = a as TextAnnotation;
          return Math.abs(pos.canvasX - t.data.x) < 80 && Math.abs(pos.canvasY - t.data.y) < 20;
        }
        if (a.type === "draw") {
          const d = a as DrawAnnotation;
          return d.data.points.some(p => Math.hypot(p.x - pos.canvasX, p.y - pos.canvasY) < 12);
        }
        return false;
      });
      if (hit) setAnnotations(prev => prev.filter(a => a.id !== hit.id));
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "draw" && drawingRef.current) {
      const pos = getPos(e);
      drawingRef.current.points.push({ x: pos.canvasX, y: pos.canvasY });
      drawAnnotations();
      const pts = drawingRef.current.points;
      if (pts.length >= 2) {
        const ctx = overlayRef.current!.getContext("2d")!;
        ctx.strokeStyle = color; ctx.lineWidth = penSize;
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
      ctx.fillRect(start.x, start.y, pos.canvasX - start.x, pos.canvasY - start.y);
      ctx.globalAlpha = 1;
    }
  };

  const finishStroke = useCallback((e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const pos = getPos(e);
    if (tool === "draw" && drawingRef.current) {
      const pts = drawingRef.current.points;
      if (pts.length > 1)
        setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "draw", page, data: { points: pts, color, width: penSize } } as DrawAnnotation]);
      drawingRef.current = null;
    }
    if (tool === "highlight" && highlightRef.current) {
      const start = highlightRef.current;
      const w = pos.canvasX - start.x, h = pos.canvasY - start.y;
      if (Math.abs(w) > 5 && Math.abs(h) > 5)
        setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "highlight", page, data: { x: start.x, y: start.y, w, h, color } } as HighlightAnnotation]);
      highlightRef.current = null;
    }
  }, [tool, page, color, getPos, penSize]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawingRef.current || highlightRef.current) finishStroke(e);
    };
    window.addEventListener("mouseup", handler);
    return () => window.removeEventListener("mouseup", handler);
  }, [finishStroke]);

  const undo = useCallback(() => {
    const pageAnns = annotations.filter(a => a.page === page);
    if (!pageAnns.length) return;
    setAnnotations(prev => prev.filter(a => a.id !== pageAnns[pageAnns.length - 1].id));
  }, [annotations, page]);

  const clearPage = useCallback(() => {
    setAnnotations(prev => prev.filter(a => a.page !== page));
  }, [page]);

  const loadFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    originalFileRef.current = buf.slice(0);
    const doc = await pdfjsLib.getDocument({ data: buf }).promise;
    setPdfDoc(doc); setTotalPages(doc.numPages); setPage(1); setAnnotations([]); setFloatingText(null);
    await generateThumbnails(doc);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  // helper: render one page with its annotations into a merged canvas → PNG dataURL
  const renderPageToDataURL = useCallback(async (pageNum: number): Promise<string> => {
    if (!pdfDoc) return "";
    const pg = await pdfDoc.getPage(pageNum);
    const viewport = pg.getViewport({ scale });
    const base = document.createElement("canvas");
    base.width = viewport.width; base.height = viewport.height;
    await pg.render({ canvas: base, viewport }).promise;

    const overlay = document.createElement("canvas");
    overlay.width = viewport.width; overlay.height = viewport.height;
    const ctx = overlay.getContext("2d")!;
    annotations.filter(a => a.page === pageNum).forEach(ann => {
      if (ann.type === "highlight") {
        const h = ann as HighlightAnnotation;
        ctx.globalAlpha = 0.35; ctx.fillStyle = h.data.color;
        ctx.fillRect(h.data.x, h.data.y, h.data.w, h.data.h);
        ctx.globalAlpha = 1;
      } else if (ann.type === "draw") {
        const d = ann as DrawAnnotation;
        if (d.data.points.length < 2) return;
        ctx.strokeStyle = d.data.color; ctx.lineWidth = d.data.width;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(d.data.points[0].x, d.data.points[0].y);
        d.data.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (ann.type === "text") {
        const t = ann as TextAnnotation;
        ctx.font = `bold ${t.data.fontSize}px Inter, sans-serif`;
        ctx.fillStyle = t.data.color;
        ctx.fillText(t.data.text, t.data.x, t.data.y + t.data.fontSize * 0.85);
      }
    });

    const merged = document.createElement("canvas");
    merged.width = viewport.width; merged.height = viewport.height;
    const mctx = merged.getContext("2d")!;
    mctx.drawImage(base, 0, 0); mctx.drawImage(overlay, 0, 0);
    return merged.toDataURL("image/png");
  }, [pdfDoc, scale, annotations]);

  // Download current page as PNG image
  const downloadAsImage = useCallback(async () => {
    setDownloading(true); setShowDlMenu(false);
    try {
      const dataUrl = await renderPageToDataURL(page);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName.replace(".pdf", "")}_page${page}.png`;
      a.click();
    } finally { setDownloading(false); }
  }, [page, fileName, renderPageToDataURL]);

  // Download all pages as annotated PDF using pdf-lib
  const downloadAsPDF = useCallback(async () => {
    if (!originalFileRef.current || !pdfDoc) return;
    setDownloading(true); setShowDlMenu(false);
    try {
      const pdfDoc2 = await PDFDocument.load(originalFileRef.current);
      const pages = pdfDoc2.getPages();

      for (let i = 0; i < pages.length; i++) {
        const pageAnns = annotations.filter(a => a.page === i + 1);
        if (!pageAnns.length) continue;

        // render annotations-only overlay for this page
        const pg = await pdfDoc.getPage(i + 1);
        const viewport = pg.getViewport({ scale });
        const overlayCanvas = document.createElement("canvas");
        overlayCanvas.width = viewport.width; overlayCanvas.height = viewport.height;
        const ctx = overlayCanvas.getContext("2d")!;

        pageAnns.forEach(ann => {
          if (ann.type === "highlight") {
            const h = ann as HighlightAnnotation;
            ctx.globalAlpha = 0.35; ctx.fillStyle = h.data.color;
            ctx.fillRect(h.data.x, h.data.y, h.data.w, h.data.h);
            ctx.globalAlpha = 1;
          } else if (ann.type === "draw") {
            const d = ann as DrawAnnotation;
            if (d.data.points.length < 2) return;
            ctx.strokeStyle = d.data.color; ctx.lineWidth = d.data.width;
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(d.data.points[0].x, d.data.points[0].y);
            d.data.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
          } else if (ann.type === "text") {
            const t = ann as TextAnnotation;
            ctx.font = `bold ${t.data.fontSize}px Inter, sans-serif`;
            ctx.fillStyle = t.data.color;
            ctx.fillText(t.data.text, t.data.x, t.data.y + t.data.fontSize * 0.85);
          }
        });

        const pngDataUrl = overlayCanvas.toDataURL("image/png");
        const pngBytes = await fetch(pngDataUrl).then(r => r.arrayBuffer());
        const pngImage = await pdfDoc2.embedPng(pngBytes);

        const pdfPage = pages[i];
        const { width, height } = pdfPage.getSize();
        // draw the annotation overlay scaled to the PDF page size
        pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height, opacity: 1 });
      }

      const pdfBytes = await pdfDoc2.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName.replace(".pdf", "")}_annotated.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setDownloading(false); }
  }, [pdfDoc, annotations, fileName, scale]);

  const fitWidth = () => {
    if (!pdfDoc || !canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;
    const padding = 48;
    const availableWidth = container.clientWidth - padding;
    pdfDoc.getPage(1).then(pg => {
      const viewport = pg.getViewport({ scale: 1 });
      const newScale = availableWidth / viewport.width;
      setScale(Math.max(0.3, Math.min(3, newScale)));
    });
  };

  const cursorMap: Record<Tool, string> = {
    select: "default", highlight: "crosshair", text: "text", draw: "crosshair", eraser: "cell",
  };

  if (!pdfDoc) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(160deg,#f0f7ff 0%,#faf5ff 50%,#fff7f0 100%)" }}>
        <div className="bg-mesh-premium" />
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} className="hidden" />
        <section className="mx-auto px-4 py-24 text-center relative z-10 max-w-7xl">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border" style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", borderColor: "rgba(59,130,246,0.2)" }}>
              <Pen size={12} /> Work Directly on Your Files
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-5">
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
              <button onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }} className="px-7 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest shadow-lg transition-all group-hover:shadow-xl group-hover:scale-105" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Choose PDF File</button>
            </div>
          </div>
        </section>
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

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-900" style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => { setPdfDoc(null); setAnnotations([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <X size={18} />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-blue-500 shrink-0" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{fileName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fitWidth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
            Fit Width
          </button>
          <span className="text-xs font-bold text-slate-400 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <Minus size={16} />
          </button>
          <button onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} title="Undo last" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <Undo2 size={17} />
          </button>
          <button onClick={clearPage} title="Clear all annotations on this page" className="px-3 py-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-600">
            Clear Page
          </button>
          {/* Download split button */}
          <div className="relative">
            <div className="flex items-center rounded-xl overflow-hidden shadow-lg">
              <button
                onClick={downloadAsPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                <Download size={15} />
                {downloading ? "Saving…" : "Download PDF"}
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowDlMenu(v => !v); }}
                disabled={downloading}
                className="px-2 py-2 bg-blue-700 hover:bg-blue-800 text-white border-l border-blue-500 transition-colors disabled:opacity-60"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            {showDlMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 min-w-[180px]">
                <button
                  onClick={downloadAsPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <FileText size={15} className="text-blue-500" />
                  Download as PDF
                </button>
                <button
                  onClick={downloadAsImage}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors border-t border-slate-100 dark:border-slate-700"
                >
                  <Image size={15} className="text-green-500" />
                  Download as PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden ${sidebarOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pages</p>
          </div>
          <div className="overflow-y-auto h-full custom-scrollbar" style={{ height: "calc(100vh - 60px)" }}>
            <div className="p-2 space-y-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const thumb = pageThumbnails[p - 1];
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-full rounded-lg overflow-hidden border-2 transition-all ${page === p ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"}`}>
                    {thumb ? (
                      <img src={thumb} alt={`Page ${p}`} className="w-full h-auto block" />
                    ) : (
                      <div className="w-full h-16 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-400">{p}</span>
                      </div>
                    )}
                    <div className="p-1.5 text-center">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Page {p}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* scroll container */}
        <div
          ref={canvasWrapRef}
          className="flex-1 overflow-auto relative"
          style={{ background: "#e2e8f0" }}
        >
          <div className="flex items-start justify-center p-6 min-h-full">
            <div className="relative shadow-2xl rounded-lg" style={{ overflow: "visible" }}>
              <canvas ref={canvasRef} className="block rounded-lg" />
              <canvas ref={overlayRef} className="absolute inset-0 rounded-lg"
                style={{ cursor: cursorMap[tool] }}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={finishStroke}
                onClick={handleCanvasClick} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating draggable text box ── */}
      {floatingText && (
        <div
          className="fixed z-[60] select-none"
          style={{
            left: floatingText.fixedX,
            top: floatingText.fixedY,
            width: 260,
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            borderRadius: 12,
            overflow: "hidden",
            background: "white",
          }}
        >
          {/* drag handle — only this bar triggers drag */}
          <div
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-grab active:cursor-grabbing"
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              // record offset from box top-left to mouse
              boxDragOffset.current = {
                dx: e.clientX - floatingText.fixedX,
                dy: e.clientY - floatingText.fixedY,
              };
              setBoxDragging(true);
            }}
          >
            <Move size={13} className="text-white shrink-0" />
            <span className="text-white text-xs font-bold flex-1 leading-none">Drag to move</span>
            <button
              className="text-white/70 hover:text-white text-base leading-none w-5 h-5 flex items-center justify-center"
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setFloatingText(null); }}
            >✕</button>
          </div>

          {/* textarea — pointer-events always on, never blocked */}
          <textarea
            ref={textAreaRef}
            value={floatingText.text}
            onChange={e => setFloatingText(prev => prev ? { ...prev, text: e.target.value } : null)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
              if (e.key === "Escape") setFloatingText(null);
            }}
            className="block w-full outline-none resize-none border-x-2 border-blue-600 bg-white font-semibold"
            style={{
              color: floatingText.color,
              height: 90,
              padding: "10px 12px",
              fontSize: `${floatingText.fontSize}px`,
              lineHeight: 1.5,
              fontFamily: "inherit",
              display: "block",
            }}
            placeholder="Type here…"
            autoFocus
          />

          {/* action row */}
          <div className="flex border-t-2 border-blue-600">
            <button
              onClick={commitText}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >✓ Add Text</button>
            <button
              onClick={() => setFloatingText(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border-l border-blue-600 transition-colors"
            >Cancel</button>
          </div>
        </div>
      )}

      {/* drag capture — z higher than box so it captures mousemove everywhere */}
      {boxDragging && (
        <div
          className="fixed inset-0 z-[70] cursor-grabbing"
          onMouseMove={e => {
            // box top-left = mouse minus the initial grab offset
            const newFixedX = e.clientX - boxDragOffset.current.dx;
            const newFixedY = e.clientY - boxDragOffset.current.dy;
            // map box top-left to canvas coords
            const overlay = overlayRef.current;
            if (!overlay) return;
            const rect = overlay.getBoundingClientRect();
            const sx = overlay.width  / rect.width;
            const sy = overlay.height / rect.height;
            const canvasX = (newFixedX - rect.left) * sx;
            const canvasY = (newFixedY - rect.top)  * sy;
            setFloatingText(prev => prev
              ? { ...prev, fixedX: newFixedX, fixedY: newFixedY, canvasX, canvasY }
              : null);
          }}
          onMouseUp={() => setBoxDragging(false)}
        />
      )}

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
            {(Object.keys(TOOL_META) as Tool[]).map(t => {
              const { icon: Icon, label } = TOOL_META[t];
              return (
                <button key={t} title={label} onClick={() => setTool(t)}
                  className={`p-2.5 rounded-xl transition-all ${tool === t ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"}`}>
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
          {(tool === "highlight" || tool === "draw" || tool === "text") && (
            <>
              <div className="flex items-center gap-1 px-2 border-r border-slate-200 dark:border-slate-700">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? "scale-125 border-slate-400" : "border-transparent hover:scale-110"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </>
          )}
          {(tool === "draw" || tool === "highlight") && (
            <>
              <div className="flex items-center gap-2 px-2 border-r border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400">Size</span>
                <input type="range" min="1" max="20" value={penSize} onChange={e => setPenSize(Number(e.target.value))}
                  className="w-20 accent-blue-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-5 text-center">{penSize}</span>
              </div>
            </>
          )}
          {tool === "text" && (
            <div className="flex items-center gap-2 px-2 border-r border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400">Size</span>
              <input type="range" min="10" max="72" value={fontSize}
                onChange={e => {
                  const v = Number(e.target.value);
                  setFontSize(v);
                  setFloatingText(prev => prev ? { ...prev, fontSize: v } : null);
                }}
                className="w-20 accent-blue-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-6 text-center">{fontSize}</span>
            </div>
          )}
          {tool === "eraser" && (
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs font-bold text-slate-400">Sensitivity</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">12px</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}