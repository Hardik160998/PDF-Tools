"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Download, ChevronLeft, ChevronRight, Minus, Plus, Highlighter, Type, Pen, Eraser,
  FileText, X, MousePointer, Undo2, Move, Image, ChevronDown, EyeOff
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

type Tool = "select" | "highlight" | "text" | "draw" | "eraser" | "blur";

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
  data: { x: number; y: number; w?: number; h?: number; text: string; color: string; fontSize: number };
}
interface BlurAnnotation {
  id: string; type: "blur"; page: number;
  data: { x: number; y: number; w: number; h: number; amount: number };
}
type AnyAnnotation = DrawAnnotation | HighlightAnnotation | TextAnnotation | BlurAnnotation;

// No longer using FloatingText interface

const COLORS = ["#EF4444", "#22C55E", "#3B82F6", "#000000"];
const TOOL_META: Record<Tool, { label: string; icon: React.ElementType }> = {
  select: { label: "Select", icon: MousePointer },
  highlight: { label: "Highlight", icon: Highlighter },
  text: { label: "Text", icon: Type },
  draw: { label: "Draw", icon: Pen },
  eraser: { label: "Eraser", icon: Eraser },
  blur: { label: "Blur", icon: EyeOff },
};

const FEATURES = [
  { icon: Highlighter, label: "Highlight", desc: "Mark key passages instantly", color: "#f59e0b", bg: "rgba(251,191,36,0.1)" },
  { icon: Type, label: "Add Text", desc: "Insert notes anywhere", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { icon: Pen, label: "Draw", desc: "Freehand pen annotations", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { icon: Eraser, label: "Erase", desc: "Remove marks cleanly", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, annotation: null as TextAnnotation | null });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const commitText = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "text") {
      if (editingId) commitText();
      return;
    }
    const pos = getPos(e);

    // Check if we clicked an existing text annotation
    const hit = [...annotations].reverse().find(a => {
      if (a.page !== page || a.type !== "text") return false;
      const t = a as TextAnnotation;
      const w = t.data.w || 200;
      const h = t.data.h || 40;
      return pos.canvasX >= t.data.x && pos.canvasX <= t.data.x + w &&
        pos.canvasY >= t.data.y && pos.canvasY <= t.data.y + h;
    });

    if (hit) {
      setEditingId(hit.id);
    } else {
      const newId = crypto.randomUUID();
      setAnnotations(prev => [...prev, {
        id: newId, type: "text", page,
        data: { x: pos.canvasX, y: pos.canvasY, w: 200, h: 60, text: "", color, fontSize }
      } as TextAnnotation]);
      setEditingId(newId);
    }
    setTimeout(() => textAreaRef.current?.focus(), 50);
  };

  const [dragging, setDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [penSize, setPenSize] = useState(3);
  const [fontSize, setFontSize] = useState(18);
  const [blurAmount, setBlurAmount] = useState(10);
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<{ points: { x: number; y: number }[] } | null>(null);
  const highlightRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const drawAnnotations = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
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
        if (t.id === editingId) return; // Skip if being edited
        ctx.font = `bold ${t.data.fontSize}px Inter, sans-serif`;
        ctx.fillStyle = t.data.color;
        // Handle multiline text in canvas
        const lines = t.data.text.split("\n");
        lines.forEach((line, i) => {
          ctx.fillText(line, t.data.x, t.data.y + (t.data.fontSize * 0.85) + (i * t.data.fontSize * 1.2));
        });
      } else if (ann.type === "blur") {
        const b = ann as BlurAnnotation;
        ctx.save();
        ctx.beginPath();
        ctx.rect(b.data.x, b.data.y, b.data.w, b.data.h);
        ctx.clip();
        ctx.filter = `blur(${b.data.amount}px)`;
        // Draw the PDF canvas onto the overlay canvas with blur
        if (canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0);
        ctx.restore();

        // Add a dashed border for visibility
        ctx.save();
        ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"; // Indigo-500 with alpha
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(b.data.x, b.data.y, b.data.w, b.data.h);
        ctx.restore();
      }
    });
  }, [annotations, page, editingId]);

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
    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const pg = await pdfDoc.getPage(page);
        if (cancelled) return;

        const viewport = pg.getViewport({ scale });
        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = pg.render({ canvas, viewport });
        await renderTask.promise;

        if (!cancelled) {
          const overlay = overlayRef.current;
          if (overlay) {
            overlay.width = canvas.width;
            overlay.height = canvas.height;
          }
          drawAnnotations();
        }
      } catch (e: any) {
        if (e.name !== "RenderingCancelledException" && !cancelled) {
          console.error("Render error:", e);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
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
    if (tool === "text") return; // text handled by onClick
    const pos = getPos(e);
    if (tool === "draw") drawingRef.current = { points: [{ x: pos.canvasX, y: pos.canvasY }] };
    if (tool === "highlight" || tool === "blur") highlightRef.current = { x: pos.canvasX, y: pos.canvasY };
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
          const w = t.data.w || 200;
          const h = t.data.h || 40;
          return pos.canvasX >= t.data.x && pos.canvasX <= t.data.x + w &&
            pos.canvasY >= t.data.y && pos.canvasY <= t.data.y + h;
        }
        if (a.type === "draw") {
          const d = a as DrawAnnotation;
          return d.data.points.some(p => Math.hypot(p.x - pos.canvasX, p.y - pos.canvasY) < 12);
        }
        if (a.type === "blur") {
          const b = a as BlurAnnotation;
          const bx = Math.min(b.data.x, b.data.x + b.data.w);
          const bx1 = Math.max(b.data.x, b.data.x + b.data.w);
          const by = Math.min(b.data.y, b.data.y + b.data.h);
          const by1 = Math.max(b.data.y, b.data.y + b.data.h);
          return pos.canvasX >= bx && pos.canvasX <= bx1 && pos.canvasY >= by && pos.canvasY <= by1;
        }
        return false;
      });
      if (hit) setAnnotations(prev => prev.filter(a => a.id !== hit.id));
    }

    if (tool === "select") {
      const hit = [...annotations].reverse().find(a => {
        if (a.page !== page || a.type !== "text") return false;
        const t = a as TextAnnotation;
        const w = t.data.w || 200;
        const h = t.data.h || 40;
        return pos.canvasX >= t.data.x && pos.canvasX <= t.data.x + w &&
          pos.canvasY >= t.data.y && pos.canvasY <= t.data.y + h;
      });
      if (hit) setEditingId(hit.id);
      else setEditingId(null);
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
    if (tool === "blur" && highlightRef.current) {
      const pos = getPos(e);
      const start = highlightRef.current;
      drawAnnotations();
      const ctx = overlayRef.current!.getContext("2d")!;
      ctx.save();
      ctx.beginPath();
      ctx.rect(start.x, start.y, pos.canvasX - start.x, pos.canvasY - start.y);
      ctx.clip();
      ctx.filter = `blur(${blurAmount}px)`;
      if (canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0);
      ctx.restore();
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
    if (tool === "blur" && highlightRef.current) {
      const start = highlightRef.current;
      const w = pos.canvasX - start.x, h = pos.canvasY - start.y;
      if (Math.abs(w) > 5 && Math.abs(h) > 5)
        setAnnotations(prev => [...prev, { id: crypto.randomUUID(), type: "blur", page, data: { x: start.x, y: start.y, w, h, amount: blurAmount } } as BlurAnnotation]);
      highlightRef.current = null;
    }
  }, [tool, page, color, getPos, penSize, blurAmount]);

  const updateAnnotation = useCallback((id: string, data: Partial<TextAnnotation["data"]>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, data: { ...a.data, ...data } } : a));
  }, []);

  const undo = useCallback(() => {
    const pageAnns = annotations.filter(a => a.page === page);
    if (!pageAnns.length) return;
    setAnnotations(prev => prev.filter(a => a.id !== pageAnns[pageAnns.length - 1].id));
  }, [annotations, page]);

  const clearPage = useCallback(() => {
    setAnnotations(prev => prev.filter(a => a.page !== page));
    setEditingId(null);
  }, [page]);

  useEffect(() => {
    const onUp = (e: MouseEvent) => {
      if (dragHandle) setDragHandle(null);
      if (drawingRef.current || highlightRef.current) finishStroke(e);
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [dragHandle, finishStroke]);



  const loadFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    originalFileRef.current = buf.slice(0);
    const doc = await pdfjsLib.getDocument({ data: buf }).promise;
    setPdfDoc(doc); setTotalPages(doc.numPages); setPage(1); setAnnotations([]); setEditingId(null);
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

    // Keep a clean copy for blur sampling
    const clean = document.createElement("canvas");
    clean.width = base.width; clean.height = base.height;
    clean.getContext("2d")!.drawImage(base, 0, 0);
    const baseCtx = base.getContext("2d")!;

    const overlay = document.createElement("canvas");
    overlay.width = viewport.width; overlay.height = viewport.height;
    const ctx = overlay.getContext("2d")!;

    annotations.filter(a => a.page === pageNum).forEach(ann => {
      if (ann.type === "blur") {
        const b = ann as BlurAnnotation;
        const bx = Math.min(b.data.x, b.data.x + b.data.w);
        const by = Math.min(b.data.y, b.data.y + b.data.h);
        const bw = Math.abs(b.data.w);
        const bh = Math.abs(b.data.h);
        if (bw > 1 && bh > 1) {
          const pad = b.data.amount * 2;
          const tmp = document.createElement("canvas");
          tmp.width = bw + pad; tmp.height = bh + pad;
          const tctx = tmp.getContext("2d")!;
          tctx.filter = `blur(${b.data.amount}px)`;
          tctx.drawImage(clean, bx, by, bw, bh, b.data.amount, b.data.amount, bw, bh);
          tctx.filter = "none";
          baseCtx.drawImage(tmp, b.data.amount, b.data.amount, bw, bh, bx, by, bw, bh);
        }
      } else if (ann.type === "highlight") {
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

        // render a clean base canvas once for blur use
        let baseForBlur: HTMLCanvasElement | null = null;
        if (pageAnns.some(a => a.type === "blur")) {
          baseForBlur = document.createElement("canvas");
          baseForBlur.width = viewport.width; baseForBlur.height = viewport.height;
          await pg.render({ canvas: baseForBlur, viewport }).promise;
        }

        for (const ann of pageAnns) {
          if (ann.type === "highlight") {
            const h = ann as HighlightAnnotation;
            ctx.globalAlpha = 0.35; ctx.fillStyle = h.data.color;
            ctx.fillRect(h.data.x, h.data.y, h.data.w, h.data.h);
            ctx.globalAlpha = 1;
          } else if (ann.type === "draw") {
            const d = ann as DrawAnnotation;
            if (d.data.points.length < 2) continue;
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
          } else if (ann.type === "blur" && baseForBlur) {
            const b = ann as BlurAnnotation;
            const bx = Math.min(b.data.x, b.data.x + b.data.w);
            const by = Math.min(b.data.y, b.data.y + b.data.h);
            const bw = Math.abs(b.data.w);
            const bh = Math.abs(b.data.h);
            if (bw > 1 && bh > 1) {
              const tmp = document.createElement("canvas");
              tmp.width = bw; tmp.height = bh;
              const tctx = tmp.getContext("2d")!;
              tctx.filter = `blur(${b.data.amount}px)`;
              tctx.drawImage(baseForBlur, bx, by, bw, bh, 0, 0, bw, bh);
              ctx.drawImage(tmp, 0, 0, bw, bh, bx, by, bw, bh);
            }
          }
        }

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
    select: "default", highlight: "crosshair", text: "text", draw: "crosshair", eraser: "cell", blur: "crosshair",
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
              {[{ n: "1", title: "Open Your PDF", desc: "Click or drag any PDF. It loads instantly — no server involved.", color: "#3b82f6" }, { n: "2", title: "Annotate Freely", desc: "Highlight, draw, add text, or erase using the toolbar.", color: "#8b5cf6" }, { n: "3", title: "Save Your Work", desc: "Download the annotated page as a PNG with one click.", color: "#f59e0b" },].map(({ n, title, desc, color }) => (
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

      {/* ── Inline Text Editor ── */}
      {editingId && (() => {
        const ann = annotations.find(a => a.id === editingId) as TextAnnotation;
        if (!ann) return null;

        const overlay = overlayRef.current;
        if (!overlay) return null;
        const rect = overlay.getBoundingClientRect();
        const scaleX = rect.width / overlay.width;
        const scaleY = rect.height / overlay.height;

        const left = ann.data.x * scaleX;
        const top = ann.data.y * scaleY;
        const width = (ann.data.w || 200) * scaleX;
        const height = (ann.data.h || 60) * scaleY;

        const handleSize = 10;
        const handles = ["nw","n","ne","w","e","sw","s","se"];

        return (
          <div
            className="absolute z-[60]"
            style={{
              left: `calc(${rect.left}px + ${left}px)`,
              top: `calc(${rect.top}px + ${top}px)`,
              width, height,
              border: "2px solid #3b82f6",
              backgroundColor: "rgba(59,130,246,0.05)",
              boxSizing: "border-box",
              cursor: dragHandle === "move" ? "grabbing" : "grab",
            }}
            onMouseDown={e => {
              if ((e.target as HTMLElement).dataset.handle) return;
              e.preventDefault();
              setDragHandle("move");
              dragStart.current = { x: e.clientX, y: e.clientY, annotation: ann };
            }}
            onMouseMove={e => {
              if (dragHandle !== "move" || !dragStart.current.annotation) return;
              e.preventDefault();
              const dx = (e.clientX - dragStart.current.x) / scaleX;
              const dy = (e.clientY - dragStart.current.y) / scaleY;
              updateAnnotation(ann.id, {
                x: ann.data.x + dx,
                y: ann.data.y + dy,
              });
              dragStart.current = { x: e.clientX, y: e.clientY, annotation: { ...ann, data: { ...ann.data, x: ann.data.x + dx, y: ann.data.y + dy } } };
            }}
            onMouseUp={() => setDragHandle(null)}
          >
            <textarea
              ref={textAreaRef}
              value={ann.data.text}
              onChange={e => updateAnnotation(ann.id, { text: e.target.value })}
              onKeyDown={e => { if (e.key === "Escape") commitText(); }}
              onMouseDown={e => e.stopPropagation()}
              className="absolute inset-0 w-full h-full bg-transparent outline-none resize-none border-none overflow-hidden font-bold"
              style={{
                color: ann.data.color,
                fontSize: ann.data.fontSize * scaleX,
                lineHeight: 1.2,
                padding: 4,
                cursor: "text",
              }}
              autoFocus
              placeholder="Type here..."
            />

            {handles.map(h => {
              const s: React.CSSProperties = {
                position: "absolute",
                width: handleSize, height: handleSize,
                backgroundColor: "#3b82f6",
                border: "1px solid white",
                borderRadius: 2,
                cursor: `${h}-resize`,
                zIndex: 1,
              };
              if (h.includes("n")) s.top = -handleSize / 2;
              if (h.includes("s")) s.bottom = -handleSize / 2;
              if (h.includes("w")) s.left = -handleSize / 2;
              if (h.includes("e")) s.right = -handleSize / 2;
              if (h === "n" || h === "s") { s.left = "50%"; s.transform = "translateX(-50%)"; }
              if (h === "w" || h === "e") { s.top = "50%"; s.transform = "translateY(-50%)"; }
              return (
                <div key={h} data-handle={h} style={s}
                  onMouseDown={e => {
                    e.preventDefault(); e.stopPropagation();
                    setDragHandle(h);
                    dragStart.current = { x: e.clientX, y: e.clientY, annotation: ann };
                  }}
                />
              );
            })}
          </div>
        );
      })()}

      {/* Global resize handler */}
      {dragHandle && dragHandle !== "move" && (
        <div
          className="fixed inset-0 z-[70]"
          style={{ cursor: `${dragHandle}-resize` }}
          onMouseMove={e => {
            if (!dragStart.current.annotation) return;
            const ann = dragStart.current.annotation;
            const overlay = overlayRef.current;
            if (!overlay) return;
            const rect = overlay.getBoundingClientRect();
            const scaleX = overlay.width / rect.width;
            const scaleY = overlay.height / rect.height;
            const dx = (e.clientX - dragStart.current.x) * scaleX;
            const dy = (e.clientY - dragStart.current.y) * scaleY;
            let { x, y, w, h } = ann.data;
            w = w || 200; h = h || 60;
            if (dragHandle.includes("e")) w += dx;
            if (dragHandle.includes("w")) { x += dx; w -= dx; }
            if (dragHandle.includes("s")) h += dy;
            if (dragHandle.includes("n")) { y += dy; h -= dy; }
            updateAnnotation(ann.id, { x, y, w: Math.max(20, w), h: Math.max(20, h) });
            dragStart.current = { x: e.clientX, y: e.clientY, annotation: { ...ann, data: { ...ann.data, x, y, w: Math.max(20, w), h: Math.max(20, h) } } };
          }}
          onMouseUp={() => setDragHandle(null)}
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
                  <button key={c} onClick={() => {
                    setColor(c);
                    if (editingId) updateAnnotation(editingId, { color: c });
                  }}
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
                  if (editingId) updateAnnotation(editingId, { fontSize: v });
                }}
                className="w-20 accent-blue-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-6 text-center">{fontSize}</span>
            </div>
          )}
          {tool === "blur" && (
            <div className="flex items-center gap-2 px-2 border-r border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400">Blur</span>
              <input type="range" min="1" max="50" value={blurAmount}
                onChange={e => setBlurAmount(Number(e.target.value))}
                className="w-20 accent-blue-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-6 text-center">{blurAmount}</span>
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