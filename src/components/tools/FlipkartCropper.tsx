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

// ── Extract AWB from text ────────────────────────────────────────────────────
async function extractAWB(page: pdfjsLib.PDFPageProxy): Promise<string> {
  const content = await page.getTextContent();
  for (const item of content.items as any[]) {
    const m = item.str?.match(/\b([A-Z]{2,4}[0-9]{8,})\b/);
    if (m) return m[1];
  }
  return '';
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

// ── Component ────────────────────────────────────────────────────────────────
export default function FlipkartCropper({ id }: { id: string }) {
  const [files,      setFiles]      = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done,       setDone]       = useState(false);
  const [pdfUrl,     setPdfUrl]     = useState<string | null>(null);
  const [pngUrls,    setPngUrls]    = useState<{ name: string; url: string }[]>([]);
  const [labelCount, setLabelCount] = useState(0);
  const [ocrCount,   setOcrCount]   = useState(0);
  const [exportPng,  setExportPng]  = useState(false);
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
          const { canvas, method } = await renderAndCrop(page, 2.5);
          const awb = await extractAWB(page);
          if (method === 'fallback') fileMethod = 'fallback';
          results.push({ canvas, awb, method });
        }

        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages, method: fileMethod } : f
        ));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    // Build PDF (PNG embedded for quality)
    for (const r of results) {
      const pngBytes = await canvasToPngBytes(r.canvas);
      const img = await outDoc.embedPng(pngBytes);
      const page = outDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const pdfBytes = await outDoc.save();
    setPdfUrl(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));

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

    setLabelCount(results.length);
    setOcrCount(results.filter(r => r.method === 'ocr').length);
    setProcessing(false);
    setDone(true);
  };

  const reset = () => {
    setFiles([]); setDone(false); setPdfUrl(null); setPngUrls([]); setLabelCount(0); setOcrCount(0);
  };

  const ACCENT = '#F7941D'; // Flipkart orange-ish (Ekart brand)

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
            {['Detects STD / E-kart border', 'Crops at routing code box (B6/S1)', 'Keeps AWB + QR + Barcode', 'Removes invoice & billing', 'PNG fallback if OCR fails'].map(f => (
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

              {/* Settings */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 text-left">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Export Options</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={exportPng} onChange={e => setExportPng(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-slate-300 cursor-pointer" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Also export individual PNG per label</span>
                </label>
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
        pdfUrl && (
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
                Invoice &amp; billing removed · AWB, QR &amp; barcode preserved
              </p>
            </div>
            <div className="space-y-4">
              <a
                href={pdfUrl}
                download="flipkart_labels.pdf"
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">
          <ToolContent />
        </div>
      </div>
    </div>
  );
}
