"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

interface LabelFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  method?: 'ocr' | 'fallback';
}

interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  method: 'ocr' | 'fallback';
}

interface PageResult {
  canvas: HTMLCanvasElement;
  awb: string;
  method: 'ocr' | 'fallback';
  sellerName: string;
  qty: number;
  pincode: string;
}

// Routing code: "B6", "S1", "A12" — 1 uppercase letter + 1-2 digits, standalone
const ROUTING_RE = /^[A-Z][0-9]{1,2}$/;

// ── OCR-based anchor detection ──────────────────────────────────────────────
async function detectFlipkartCropBounds(
  page: pdfjsLib.PDFPageProxy,
  scale: number
): Promise<CropBounds> {
  const viewport = page.getViewport({ scale });
  const content = await page.getTextContent();
  const items = content.items as any[];

  let topY: number | null = null;    // "STD" row top  → top border of label
  let bottomY: number | null = null; // routing-code box bottom → bottom border
  let leftX: number | null = null;   // "STD" left edge → left border
  // Right border: use the "E" cell's tx as the start of the right cell,
  // then extend to viewport.width — the label always fills the full page width
  let eCellX: number | null = null;

  for (const item of items) {
    const raw: string = item.str?.trim() ?? '';
    const up = raw.toUpperCase();
    const tx: number = item.transform[4];
    const ty: number = item.transform[5];
    const w: number  = item.width  ?? 0;
    const h: number  = item.height ?? 0;

    // Top + Left anchor — "STD" is the top-left cell of the label
    if (up === 'STD' && topY === null) {
      topY  = ty + h + 6; // above the STD cell top to include the outer border
      leftX = tx - 6;     // left of STD cell
    }

    // Right anchor — record where the "E" cell starts so we know the page
    // right margin; the actual right border is at viewport edge
    if (raw === 'E' && eCellX === null) {
      eCellX = tx; // left edge of the E cell
    }

    // Bottom anchor — routing code box ("B6", "S1", "A12") at bottom-right
    if (ROUTING_RE.test(raw)) {
      const boxBottom = ty - h - 8; // baseline − height − 8pt border gap
      if (bottomY === null || boxBottom < bottomY) bottomY = boxBottom;
    }
  }

  // Right crop = viewport width minus the same margin that exists on the left.
  // This guarantees the "E" cell border is fully included.
  const rightMargin = leftX !== null ? leftX : 0; // left margin ≈ right margin on Ekart labels
  const canvasRight = viewport.width - rightMargin * scale;

  // Convert PDF coords (origin bottom-left) → canvas coords (origin top-left)
  const pageH = viewport.height;

  if (topY !== null && bottomY !== null) {
    const canvasTop    = Math.max(0, pageH - topY * scale);
    const canvasBottom = Math.min(pageH, pageH - bottomY * scale);
    const canvasLeft   = leftX !== null ? Math.max(0, leftX * scale) : 0;

    return {
      x:      canvasLeft,
      y:      canvasTop,
      width:  canvasRight - canvasLeft,
      height: canvasBottom - canvasTop,
      method: 'ocr',
    };
  }

  // ── Fallback: largest bordered rectangle in upper half ───────────────────
  return await fallbackDetect(page, scale, viewport);
}

// Fallback: render page, scan upper half for the densest dark-border rectangle
async function fallbackDetect(
  page: pdfjsLib.PDFPageProxy,
  scale: number,
  viewport: pdfjsLib.PageViewport
): Promise<CropBounds> {
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width  = viewport.width;
  tmpCanvas.height = viewport.height;
  const ctx = tmpCanvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport, canvas: tmpCanvas }).promise;

  const imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
  const { data, width, height } = imgData;
  const halfH = Math.floor(height / 2);

  // Find topmost and bottommost dark pixel rows in upper half
  let firstRow = -1, lastRow = -1;
  for (let y = 0; y < halfH; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness < 80) {
        if (firstRow === -1) firstRow = y;
        lastRow = y;
        break;
      }
    }
  }

  if (firstRow === -1) {
    // Nothing found — return full upper half
    return { x: 0, y: 0, width: viewport.width, height: halfH, method: 'fallback' };
  }

  // Find leftmost and rightmost dark pixel columns in detected row range
  let firstCol = width, lastCol = 0;
  for (let y = firstRow; y <= lastRow; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 80) {
        if (x < firstCol) firstCol = x;
        if (x > lastCol)  lastCol  = x;
      }
    }
  }

  return {
    x:      Math.max(0, firstCol - 4),
    y:      Math.max(0, firstRow - 4),
    width:  Math.min(width,  lastCol  - firstCol + 8),
    height: Math.min(height, lastRow  - firstRow + 8),
    method: 'fallback',
  };
}

// ── Invoice crop: anchored on "Tax Invoice" → "All values are in INR" ────────
async function detectInvoiceCropBounds(
  page: pdfjsLib.PDFPageProxy,
  scale: number,
  viewportWidth: number,
  viewportHeight: number,
  renderedCanvas: HTMLCanvasElement,
  labelBottomY: number
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  const content = await page.getTextContent();
  const items = content.items as any[];

  let botY: number | null = null;
  let invoiceTopPdfY: number | null = null;

  // Pass 1: find "Tax Invoice" PDF Y (used only to scope Pass 2)
  // Also capture "Sold By" X as left anchor fallback
  let soldByX: number | null = null;
  for (const item of items) {
    const raw: string = (item.str ?? '').trim();
    if (/tax\s*invoice/i.test(raw)) {
      const ty: number = item.transform[5];
      const h: number  = item.height ?? 0;
      invoiceTopPdfY = ty + h;
    }
    if (/^sold\s*by$/i.test(raw) && soldByX === null) {
      soldByX = item.transform[4] * scale;
    }
    if (invoiceTopPdfY !== null && soldByX !== null) break;
  }
  if (invoiceTopPdfY === null) return null;

  // Pass 2: find "All values are in INR" bottom anchor
  for (const item of items) {
    const raw: string = (item.str ?? '').trim();
    if (!raw || item.transform[5] > invoiceTopPdfY + 2) continue;
    if (/all\s*values\s*are\s*in\s*inr/i.test(raw)) {
      const ty: number = item.transform[5];
      const h: number  = item.height ?? 0;
      botY = viewportHeight - (ty - h * 0.25) * scale;
    }
  }
  if (botY === null) return null;

  // Pass 3: pixel-scan downward from label bottom to find first dark row (dashed border)
  const scanStart  = Math.max(0, Math.floor(labelBottomY));
  const bandBottom = Math.min(viewportHeight, Math.ceil(botY));
  const ctx        = renderedCanvas.getContext('2d')!;
  const imgData    = ctx.getImageData(0, scanStart, viewportWidth, bandBottom - scanStart);
  const { data, width: iw } = imgData;
  const rows = bandBottom - scanStart;

  // Find first dark row scanning downward — this is the dashed border
  let firstDarkRow = 0;
  outer: for (let y = 0; y < rows; y++) {
    for (let x = 0; x < iw; x++) {
      const i = (y * iw + x) * 4;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 100) {
        firstDarkRow = y;
        break outer;
      }
    }
  }

  // Find rightmost dark column
  let rightX = viewportWidth;
  for (let x = iw - 1; x >= 0; x--) {
    let found = false;
    for (let y = 0; y < rows; y++) {
      const i = (y * iw + x) * 4;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 100) { found = true; break; }
    }
    if (found) { rightX = x + 1; break; }
  }

  // Left edge: use "Sold By" text X from PDF (most reliable left anchor)
  // Fall back to pixel scan if not found
  let leftX = soldByX !== null ? Math.max(0, Math.floor(soldByX)) : 0;
  if (soldByX === null) {
    for (let x = 0; x < iw; x++) {
      let found = false;
      for (let y = 0; y < rows; y++) {
        const i = (y * iw + x) * 4;
        if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 100) { found = true; break; }
      }
      if (found) { leftX = x; break; }
    }
  }

  const finalTop = scanStart + firstDarkRow;
  return {
    x:      leftX,
    y:      finalTop,
    width:  Math.max(1, rightX - leftX),
    height: Math.max(1, bandBottom - finalTop),
  };
}

// ── Render + crop ────────────────────────────────────────────────────────────
async function renderAndCrop(
  page: pdfjsLib.PDFPageProxy,
  scale: number
): Promise<{ canvas: HTMLCanvasElement; method: 'ocr' | 'fallback' }> {
  const bounds  = await detectFlipkartCropBounds(page, scale);
  const viewport = page.getViewport({ scale });

  const fullCanvas = document.createElement('canvas');
  fullCanvas.width  = viewport.width;
  fullCanvas.height = viewport.height;
  await page.render({ canvasContext: fullCanvas.getContext('2d')!, viewport, canvas: fullCanvas }).promise;

  const out = document.createElement('canvas');
  out.width  = Math.max(1, Math.round(bounds.width));
  out.height = Math.max(1, Math.round(bounds.height));
  out.getContext('2d')!.drawImage(
    fullCanvas,
    bounds.x, bounds.y, bounds.width, bounds.height,
    0, 0, out.width, out.height
  );

  return { canvas: out, method: bounds.method };
}

// ── Extract metadata from Flipkart label text ───────────────────────────────
async function extractFlipkartMetadata(page: pdfjsLib.PDFPageProxy): Promise<{ awb: string; sellerName: string; qty: number; pincode: string }> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let awb = '', sellerName = 'Unknown', qty = 1, pincode = '';

  for (let i = 0; i < items.length; i++) {
    const text = items[i].str?.trim() ?? '';
    if (!text) continue;

    if (!awb) { const m = text.match(/\b([A-Z]{2,4}[0-9]{8,})\b/); if (m) awb = m[1]; }
    if (!pincode) { const m = text.match(/\b([0-9]{6})\b/); if (m) pincode = m[1]; }

    const qtyMatch = text.match(/Qty[:\s]*([0-9]+)/i);
    if (qtyMatch) qty = parseInt(qtyMatch[1], 10);

    // Flipkart labels show "Sold by: <SellerName>" or "Seller: <SellerName>"
    if (/sold\s*by|seller\s*:/i.test(text)) {
      for (let j = i + 1; j < Math.min(i + 4, items.length); j++) {
        const next = items[j].str?.trim();
        if (next && next.length > 2 && !/^[:\-,\.]+$/.test(next)) {
          sellerName = next.replace(/\s+/g, ' ').trim().toUpperCase();
          break;
        }
      }
    }
  }
  return { awb, sellerName, qty, pincode };
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

// ── Component ────────────────────────────────────────────────────────────────
export default function FlipkartCropper({ id }: { id: string }) {
  const [files,           setFiles]           = useState<LabelFile[]>([]);
  const [processing,      setProcessing]      = useState(false);
  const [done,            setDone]            = useState(false);
  const [pdfUrl,          setPdfUrl]          = useState<string | null>(null);
  const [pngUrls,         setPngUrls]         = useState<{ name: string; url: string }[]>([]);
  const [labelCount,      setLabelCount]      = useState(0);
  const [ocrCount,        setOcrCount]        = useState(0);
  const [exportPng,          setExportPng]          = useState(false);
  const [keepInvoice,        setKeepInvoice]        = useState(false);
  const [sortByAwb,          setSortByAwb]          = useState(false);
  const [sortBySeller,       setSortBySeller]       = useState(false);
  const [multiOrderAtBottom, setMultiOrderAtBottom] = useState(true);
  const [fallbackAtBottom,   setFallbackAtBottom]   = useState(true);
  const [splitByMethod,      setSplitByMethod]      = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    const entries: LabelFile[] = Array.from(fl)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ id: crypto.randomUUID(), name: f.name, file: f, status: 'pending' }));
    setFiles(prev => [...prev, ...entries]);
    setDone(false); setPdfUrl(null); setPngUrls([]);
  };

  const removeFile = (fid: string) => setFiles(prev => prev.filter(f => f.id !== fid));

  const processAll = async () => {
    if (!files.length) return;
    setProcessing(true); setDone(false);

    const outDoc = await PDFDocument.create();
    const results: PageResult[] = [];

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let fileMethod: 'ocr' | 'fallback' = 'ocr';

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const meta = await extractFlipkartMetadata(page);
          if (keepInvoice) {
            // Split into label page + invoice page
            const scale = 2.5;
            const viewport = page.getViewport({ scale });
            const fc = document.createElement('canvas');
            fc.width = viewport.width; fc.height = viewport.height;
            await page.render({ canvasContext: fc.getContext('2d')!, viewport, canvas: fc }).promise;

            const bounds = await detectFlipkartCropBounds(page, scale);
            const method: 'ocr' | 'fallback' = bounds.method;

            // Crop 1: label area
            const labelCanvas = document.createElement('canvas');
            labelCanvas.width  = Math.max(1, Math.round(bounds.width));
            labelCanvas.height = Math.max(1, Math.round(bounds.height));
            labelCanvas.getContext('2d')!.drawImage(fc, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, labelCanvas.width, labelCanvas.height);

            // Crop 2: invoice area — anchor on "Tax Invoice" → "All values are in INR"
            const invoiceBounds = await detectInvoiceCropBounds(page, scale, viewport.width, viewport.height, fc, bounds.y + bounds.height);
            const invoiceCanvas = document.createElement('canvas');
            if (invoiceBounds) {
              invoiceCanvas.width  = Math.max(1, Math.round(invoiceBounds.width));
              invoiceCanvas.height = Math.max(1, Math.round(invoiceBounds.height));
              invoiceCanvas.getContext('2d')!.drawImage(fc, invoiceBounds.x, invoiceBounds.y, invoiceBounds.width, invoiceBounds.height, 0, 0, invoiceCanvas.width, invoiceCanvas.height);
            } else {
              // fallback: everything below the label
              const invoiceY      = bounds.y + bounds.height;
              const invoiceHeight = Math.max(1, viewport.height - invoiceY);
              invoiceCanvas.width  = Math.max(1, Math.round(viewport.width));
              invoiceCanvas.height = Math.max(1, Math.round(invoiceHeight));
              invoiceCanvas.getContext('2d')!.drawImage(fc, 0, invoiceY, viewport.width, invoiceHeight, 0, 0, invoiceCanvas.width, invoiceCanvas.height);
            }

            if (method === 'fallback') fileMethod = 'fallback';
            results.push({ canvas: labelCanvas,   method, ...meta });
            results.push({ canvas: invoiceCanvas, method, ...meta });
          } else {
            const result = await renderAndCrop(page, 2.5);
            const { canvas, method } = result;
            if (method === 'fallback') fileMethod = 'fallback';
            results.push({ canvas, method, ...meta });
          }
        }

        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages, method: fileMethod } : f
        ));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    // Build PDF (PNG embedded for quality) — will be rebuilt after sorting if needed
    if (!sortByAwb && !sortBySeller && !multiOrderAtBottom && !fallbackAtBottom && !splitByMethod) {
      for (const r of results) {
        const pngBytes = await canvasToPngBytes(r.canvas);
        const img = await outDoc.embedPng(pngBytes);
        const page = outDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await outDoc.save();
      setPdfUrl(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    }

    // Optional per-page PNG export
    if (exportPng) {
      const urls = results.map((r, i) => ({
        name: r.awb ? `${r.awb}.png` : `flipkart_label_${i + 1}.png`,
        url:  URL.createObjectURL(new Blob([r.canvas.toDataURL('image/png').split(',')[1]
          ? Uint8Array.from(atob(r.canvas.toDataURL('image/png').split(',')[1]), c => c.charCodeAt(0))
          : new Uint8Array()], { type: 'image/png' })),
      }));
      // Use proper blob creation
      const pngList: { name: string; url: string }[] = [];
      for (const r of results) {
        const bytes = await canvasToPngBytes(r.canvas);
        pngList.push({
          name: r.awb ? `${r.awb}.png` : `flipkart_label_${results.indexOf(r) + 1}.png`,
          url:  URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'image/png' })),
        });
      }
      setPngUrls(pngList);
    }

    // ── Sort results ──────────────────────────────────────────────────────────
    if (sortByAwb || sortBySeller || multiOrderAtBottom || fallbackAtBottom) {
      // detect duplicates by pincode for multi-order
      const pincodeMap = new Map<string, number>();
      const dupIndices = new Set<number>();
      results.forEach((r, i) => {
        if (r.pincode) {
          if (pincodeMap.has(r.pincode)) dupIndices.add(i);
          else pincodeMap.set(r.pincode, i);
        }
      });

      results.sort((a, b) => {
        const ai = results.indexOf(a), bi = results.indexOf(b);
        if (multiOrderAtBottom) {
          const aMulti = a.qty > 1 || dupIndices.has(ai);
          const bMulti = b.qty > 1 || dupIndices.has(bi);
          if (aMulti && !bMulti) return 1;
          if (!aMulti && bMulti) return -1;
        }
        if (fallbackAtBottom) {
          if (a.method === 'ocr' && b.method === 'fallback') return -1;
          if (a.method === 'fallback' && b.method === 'ocr') return 1;
        }
        if (sortBySeller && a.sellerName !== b.sellerName) return a.sellerName.localeCompare(b.sellerName);
        if (sortByAwb) return a.awb.localeCompare(b.awb);
        return 0;
      });
    }

    if (splitByMethod) {
      // Build separate PDFs for OCR and fallback
      const groups: { label: string; items: PageResult[] }[] = [
        { label: 'OCR',      items: results.filter(r => r.method === 'ocr') },
        { label: 'Fallback', items: results.filter(r => r.method === 'fallback') },
      ].filter(g => g.items.length > 0);

      const splitUrls: { name: string; url: string }[] = [];
      for (const g of groups) {
        const doc = await PDFDocument.create();
        for (const r of g.items) {
          const pngBytes = await canvasToPngBytes(r.canvas);
          const img = await doc.embedPng(pngBytes);
          const p = doc.addPage([img.width, img.height]);
          p.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const bytes = await doc.save();
        splitUrls.push({
          name: `flipkart_labels_${g.label.toLowerCase()}.pdf`,
          url:  URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })),
        });
      }
      setPngUrls(prev => [...splitUrls, ...prev.filter(u => u.name.endsWith('.png'))]);
    } else if (sortByAwb || sortBySeller || multiOrderAtBottom || fallbackAtBottom) {
      const sortedDoc = await PDFDocument.create();
      for (const r of results) {
        const pngBytes = await canvasToPngBytes(r.canvas);
        const img = await sortedDoc.embedPng(pngBytes);
        const p = sortedDoc.addPage([img.width, img.height]);
        p.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const sortedBytes = await sortedDoc.save();
      setPdfUrl(URL.createObjectURL(new Blob([sortedBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    }

    setLabelCount(results.length);
    setOcrCount(results.filter(r => r.method === 'ocr').length);
    setProcessing(false);
    setDone(true);
  };

  const reset = () => {
    setFiles([]); setDone(false); setPdfUrl(null); setPngUrls([]); setLabelCount(0); setOcrCount(0);
  };

  const ACCENT = '#F7941D';

  const ToolContent = () => (
    <>
      <div className="space-y-4">
        <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-white shadow-lg" style={{ background: ACCENT }}>
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Flipkart Label Cropper
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
          Auto-detect and crop Flipkart / E-kart shipping labels. Removes invoice, billing &amp; footer — keeps AWB, QR code, address &amp; barcode.
        </p>
      </div>

      {!done ? (
        <div className="space-y-6">
          {/* Drop zone */}
          <div
            className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-[#F7941D] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          >
            <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            <div className="space-y-4 sm:space-y-6 pointer-events-none">
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block group-hover:scale-110 transition-transform" style={{ color: ACCENT }}>
                <Upload size={32} className="sm:w-12 sm:h-12" />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Drop Flipkart Label PDFs here
              </div>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                or click to browse · Multiple PDFs supported
              </p>
            </div>
          </div>

          {/* How it works chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {(keepInvoice
              ? ['Label cropped + invoice on next page', 'Keeps AWB + QR + Barcode', 'Batch PDF support', '100% private — runs in browser']
              : ['Detects STD / E-kart border', 'Crops at routing code box (B6/S1)', 'Keeps AWB + QR + Barcode', 'Removes invoice & billing', 'PNG fallback if OCR fails']
            ).map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                <CheckCircle2 size={11} style={{ color: ACCENT }} /> {f}
              </span>
            ))}
          </div>

          {files.length > 0 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* File list */}
              <div className="space-y-2 text-left">
                {files.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0" style={{ color: ACCENT }}><FileText size={16} /></div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {(f.file.size / 1024).toFixed(0)} KB
                          {f.pageCount ? ` · ${f.pageCount} page${f.pageCount > 1 ? 's' : ''}` : ''}
                          {f.method ? ` · ${f.method === 'ocr' ? '✓ OCR' : '⚡ Fallback'}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {f.status === 'pending'    && <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>}
                      {f.status === 'processing' && <Loader2 size={16} className="animate-spin" style={{ color: ACCENT }} />}
                      {f.status === 'done'       && <CheckCircle2 size={16} className="text-green-500" />}
                      {f.status === 'error'      && <AlertCircle size={16} className="text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>



              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={processAll}
                  disabled={processing}
                  className="flex-1 py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3 disabled:opacity-60 transition-all hover:opacity-90"
                  style={{ background: ACCENT }}
                >
                  {processing ? <Loader2 className="animate-spin" size={24} /> : <ShoppingBag size={24} />}
                  {processing ? 'Detecting & Cropping…' : `Crop ${files.length} PDF${files.length > 1 ? 's' : ''}`}
                </button>
                <button onClick={reset} disabled={processing} className="px-5 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-2xl font-bold transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        (pdfUrl || pngUrls.length > 0) && (
          <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700">
            <div className="p-10 sm:p-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block">
              <CheckCircle2 size={72} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {labelCount} Label{labelCount !== 1 ? 's' : ''} Cropped!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                {ocrCount} via OCR anchors · {labelCount - ocrCount} via fallback detection
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-black">
                {keepInvoice ? 'Label & invoice split onto separate pages' : 'Invoice & billing removed · AWB, QR & barcode preserved'}
              </p>
            </div>
            <div className="space-y-4">
              <a
                href={pdfUrl!}
                download={keepInvoice ? 'flipkart_label_and_invoice.pdf' : 'flipkart_labels.pdf'}
                className="block py-4 sm:py-5 text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                style={{ background: ACCENT }}
              >
                <Download size={24} /> Download PDF
              </a>

              {pngUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pngUrls.map(({ name, url }) => (
                    <a key={name} href={url} download={name}
                      className="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all">
                      <Download size={13} /> {name.replace('.png', '')}
                    </a>
                  ))}
                </div>
              )}

              <button onClick={reset} className="w-full px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Crop More Labels
              </button>
            </div>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {files.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 sm:gap-6">
          {/* Settings sidebar */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-lg h-fit sticky top-4">
            <div className="p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">Settings</h3>
              <div className="space-y-4">
                {/* Keep Invoice */}
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={keepInvoice} onChange={e => setKeepInvoice(e.target.checked)}
                      className="w-5 h-5 mt-0.5 bg-white border-2 border-amber-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                      style={{ accentColor: '#f59e0b' }} />
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 group-hover:text-amber-900 dark:group-hover:text-amber-200 leading-tight">
                      Keep Invoice <span className="block text-[10px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">Label &amp; invoice on separate pages</span>
                    </span>
                  </label>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 my-1" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortBySeller} onChange={e => setSortBySeller(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort by <span className="font-black">Sold By</span></span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortByAwb} onChange={e => setSortByAwb(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort by <span className="font-black">AWB</span></span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={multiOrderAtBottom} onChange={e => setMultiOrderAtBottom(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Multi order at bottom</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={fallbackAtBottom} onChange={e => setFallbackAtBottom(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Fallback labels at bottom</span>
                </label>
                <div className="border-t border-slate-200 dark:border-slate-600 my-2" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={splitByMethod} onChange={e => setSplitByMethod(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Split by Detection Method</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={exportPng} onChange={e => setExportPng(e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-white border-2 border-slate-300 rounded focus:ring-2 cursor-pointer flex-shrink-0"
                    style={{ accentColor: ACCENT }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Export individual PNG per label</span>
                </label>
              </div>
            </div>
          </div>
          {/* Main tool card */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">
            <ToolContent />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">
            <ToolContent />
          </div>
        </div>
      )}
    </div>
  );
}
