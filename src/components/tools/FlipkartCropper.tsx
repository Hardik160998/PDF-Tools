"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText, AlertCircle } from 'lucide-react';
import type * as PDFJS from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';

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

// ── Helpers ──────────────────────────────────────────────────────────────────
function normalize(v: string) {
  return v.replace(/\s+/g, ' ').trim().toLowerCase();
}

// ── Precise Anchor Detection Engine ──────────────────────────────────────────
async function detectFlipkartLabels(
  page: PDFJS.PDFPageProxy,
  scale: number
): Promise<CropBounds[]> {
  const viewport = page.getViewport({ scale });
  const content = await page.getTextContent();
  const items = content.items as any[];
  const pageH = viewport.height;

  // Find all anchors
  const stdAnchors = items.filter(i => normalize(i.str) === 'std');
  const resaleAnchors = items.filter(i => normalize(i.str).includes('not for resale'));
  const ekartAnchors = items.filter(i => normalize(i.str).includes('e-kart logistics'));
  const eAnchors = items.filter(i => normalize(i.str) === 'e');

  const labels: CropBounds[] = [];

  // Group into label blocks: each STD starts a label
  for (const std of stdAnchors) {
    const stdX = std.transform[4];
    const stdY = std.transform[5];
    const stdH = std.height || 10;

    // Bottom anchor: nearest "Not for resale" below this STD
    const bottom = resaleAnchors
      .filter(r => r.transform[5] < stdY)
      .sort((a, b) => b.transform[5] - a.transform[5])[0];

    if (!bottom) continue;

    const ekart = ekartAnchors.find(e => Math.abs(e.transform[5] - stdY) < 20);
    const eCell = eAnchors.find(e => Math.abs(e.transform[5] - stdY) < 20);

    // Top: Above STD/Ekart
    const topPdfY = stdY + stdH + 5;
    const canvasTop = Math.max(0, pageH - topPdfY * scale);

    // Bottom: Exactly at "Not for resale" line (prevents invoice bleed)
    const botPdfY = bottom.transform[5] - 2; 
    const canvasBottom = Math.min(pageH, pageH - botPdfY * scale);

    // Left: STD edge
    const canvasLeft = Math.max(0, (stdX - 5) * scale);

    // Right: E cell edge
    let canvasRight = viewport.width;
    if (eCell) {
      const eX = eCell.transform[4];
      const eW = eCell.width || 20;
      canvasRight = Math.min(viewport.width, (eX + eW + 5) * scale);
    }

    labels.push({
      x: canvasLeft,
      y: canvasTop,
      width: canvasRight - canvasLeft,
      height: canvasBottom - canvasTop,
      method: 'ocr'
    });
  }

  if (labels.length === 0) {
    // Fallback: render and find topmost area if no anchors
    labels.push({ x: 0, y: 0, width: viewport.width, height: viewport.height * 0.5, method: 'fallback' });
  }

  return labels;
}

// ── Precise Invoice Detection ──────────────────────────────────────────────
async function detectFlipkartInvoiceBounds(
  items: any[],
  viewport: any,
  scale: number
): Promise<CropBounds | null> {
  const pageH = viewport.height;
  const pageW = viewport.width;

  const taxInvItems = items.filter(i => (i.str || '').toUpperCase().includes('TAX INVOICE'));
  const allValuesItems = items.filter(i => (i.str || '').toUpperCase().includes('ALL VALUES ARE IN INR'));
  const soldByItems = items.filter(i => (i.str || '').toUpperCase().includes('SOLD BY'));
  const qrAreaItems = items.filter(i => (i.transform[4] > (pageW / scale) * 0.7) && (i.transform[5] > (pageH / scale) * 0.5));

  if (taxInvItems.length === 0 && soldByItems.length === 0) return null;

  // Top: Find highest point between Tax Invoice and QR code
  let topPdfY = 0;
  if (taxInvItems.length > 0) topPdfY = Math.max(topPdfY, ...taxInvItems.map(i => i.transform[5] + (i.height || 10)));
  if (qrAreaItems.length > 0) topPdfY = Math.max(topPdfY, ...qrAreaItems.map(i => i.transform[5] + (i.height || 10)));
  if (topPdfY === 0 && soldByItems.length > 0) topPdfY = Math.max(topPdfY, ...soldByItems.map(i => i.transform[5] + 50));

  // Bottom: Find "All values are in INR"
  let botPdfY = 0;
  if (allValuesItems.length > 0) {
    botPdfY = Math.min(...allValuesItems.map(i => i.transform[5])) - 5;
  } else {
    // Try to find bottom of some items
    const lowerItems = items.filter(i => i.transform[5] < topPdfY);
    if (lowerItems.length > 0) {
      botPdfY = Math.min(...lowerItems.map(i => i.transform[5])) - 10;
    } else {
      botPdfY = topPdfY - 300; // fallback height
    }
  }

  // Left: Align with "Tax Invoice" or "Sold By"
  let leftPdfX = pageW / scale;
  if (taxInvItems.length > 0) leftPdfX = Math.min(leftPdfX, ...taxInvItems.map(i => i.transform[4]));
  if (soldByItems.length > 0) leftPdfX = Math.min(leftPdfX, ...soldByItems.map(i => i.transform[4]));
  if (leftPdfX > (pageW / scale) * 0.5) leftPdfX = 20; // fallback

  // Right: End of page or end of "All values"
  let rightPdfX = (pageW / scale) - 20;
  if (qrAreaItems.length > 0) {
    const farRight = Math.max(...qrAreaItems.map(i => i.transform[4] + (i.width || 50)));
    rightPdfX = Math.max(rightPdfX, farRight);
  }

  // Apply offsets for borders and padding
  topPdfY += 15; // include the dashed border above Tax Invoice
  leftPdfX -= 5;
  rightPdfX += 5;
  botPdfY -= 5; // extra space below "all values"

  return {
    x: Math.max(0, leftPdfX * scale),
    y: Math.max(0, pageH - topPdfY * scale),
    width: Math.min(pageW, (rightPdfX - leftPdfX) * scale),
    height: Math.min(pageH, (topPdfY - botPdfY) * scale),
    method: 'ocr'
  };
}

// ── Metadata Extraction ─────────────────────────────────────────────────────
function extractMetadata(
  items: any[],
  bounds?: CropBounds,
  pageH?: number,
  scale?: number
): { awb: string; sellerName: string; qty: number; pincode: string; orderId: string; skuId: string; skuBounds?: any; qtyBounds?: any } {
  let filteredItems = items;
  if (bounds && pageH !== undefined && scale !== undefined) {
    const labelTopPdf = (pageH - bounds.y) / scale;
    const labelBotPdf = (pageH - (bounds.y + bounds.height)) / scale;
    filteredItems = items.filter(i => {
      const ty = i.transform[5];
      return ty <= labelTopPdf + 20 && ty >= labelBotPdf - 20;
    });
  }

  let awb = '', sellerName = 'ZZZ_UNKNOWN', qty = 1, pincode = '', orderId = '', skuId = 'ZZZ_UNKNOWN';
  let skuBounds: any = null;
  let qtyBounds: any = null;

  // Find SKU Header
  const skuHeader = filteredItems.find(i => {
    const s = (i.str || '').toUpperCase().trim();
    return s === 'SKU' || s.includes('SKU ID') || s === 'PRODUCT';
  });
  const skuHeaderX = skuHeader ? skuHeader.transform[4] : -1;
  const skuHeaderY = skuHeader ? skuHeader.transform[5] : -1;

  const qtyHeader = filteredItems.find(i => (i.str || '').toUpperCase() === 'QTY');
  const qtyHeaderX = qtyHeader ? qtyHeader.transform[4] : -1;
  const qtyHeaderY = qtyHeader ? qtyHeader.transform[5] : -1;

  for (let i = 0; i < filteredItems.length; i++) {
    const item = filteredItems[i];
    const text = (item.str || '').trim();
    const up = text.toUpperCase();
    if (!text) continue;

    if (!awb) { const m = text.match(/\b([A-Z]{2,4}[0-9]{8,})\b/); if (m) awb = m[1]; }
    if (!pincode) { const m = text.match(/\b([0-9]{6})\b/); if (m) pincode = m[1]; }
    if (!orderId) { const m = text.match(/\b([A-Z0-9]{10,20})\b/); if (m && up.includes('OD')) orderId = m[1]; }
    
    const qtyMatch = text.match(/Qty[:\s]*([0-9]+)/i);
    if (qtyMatch) {
      qty = parseInt(qtyMatch[1], 10);
    } else if (qtyHeader) {
      const isBelowQty = item.transform[5] < qtyHeaderY && item.transform[5] > qtyHeaderY - 40 && Math.abs(item.transform[4] - qtyHeaderX) < 40;
      if (isBelowQty && text.match(/^[0-9]+$/)) {
        qty = parseInt(text, 10);
        if (pageH && scale) {
          qtyBounds = {
            x: (item.transform[4] - 4) * scale,
            y: pageH - (item.transform[5] + (item.height || 12) + 4) * scale,
            w: ((item.width || 15) + 8) * scale,
            h: ((item.height || 12) + 8) * scale
          };
        }
      }
    }

    // SKU Detection - Robust Heuristic
    if (skuId === 'ZZZ_UNKNOWN') {
      const isBelowHeader = skuHeader && item.transform[5] < skuHeaderY && item.transform[5] > skuHeaderY - 60 && Math.abs(item.transform[4] - skuHeaderX) < 150;
      const looksLikeSku = /^[A-Z0-9]{2,}[-_][A-Z0-9_-]{2,}$/.test(up) || ((up.includes('-') || up.includes('_')) && up.length >= 4 && !up.includes(' ') && !up.includes(':'));
      
      if (isBelowHeader || looksLikeSku) {
        // Filter out common noise and instructions
        const isNoise = ['QTY', 'DESCRIPTION', 'PRODUCT', 'SKU ID', 'ITEM', 'TOTAL', 'ORDER', 'PACKAGING', 'TRANSPARENT'].some(k => up.includes(k));
        if (up.length > 3 && !isNoise) {
          // Extract clean SKU if it's in a pipe-separated line (e.g. 1 | SKU-ID | Desc)
          let cleanSku = up;
          if (up.includes('|')) {
            const parts = up.split('|');
            // Try to find the part that looks most like a SKU
            const skuPart = parts.find((p: string) => (p.includes('-') || p.includes('_')) && !p.includes('Description') && p.trim().length >= 3);
            if (skuPart) cleanSku = skuPart.trim();
            else cleanSku = (parts[1] || parts[0]).trim();
          }
          
          skuId = cleanSku;
          if (pageH && scale) {
            const itemW = item.width || (text.length * 7);
            const itemH = item.height || 12;
            skuBounds = {
              x: (item.transform[4] - 4) * scale,
              y: pageH - (item.transform[5] + itemH + 2) * scale,
              w: (itemW + 8) * scale,
              h: (itemH + 4) * scale
            };
          }
        }
      }
    }

    if (up.includes('SOLD BY') || up.includes('SELLER')) {
      let rawName = '';
      const m = text.match(/(?:sold\s*by|seller)[:\s]*(.*)/i);
      if (m && m[1] && m[1].trim().length > 1) {
        rawName = m[1];
      } else {
        // Look ahead
        for (let j = i + 1; j < Math.min(i + 5, filteredItems.length); j++) {
          const next = (filteredItems[j].str || '').trim();
          if (next && next.length > 2 && !next.toUpperCase().includes('GST')) {
            rawName = next;
            break;
          }
        }
      }

      if (rawName) {
        const cleanName = rawName.split(',')[0].replace(/[:\-]/g, '').trim().toUpperCase();
        if (cleanName && cleanName.length > 1) sellerName = cleanName;
      }
    }
  }
  return { awb, sellerName, qty, pincode, orderId, skuId, skuBounds, qtyBounds };
}

interface ProcessedItem {
  canvas: HTMLCanvasElement;
  awb: string;
  sellerName: string;
  qty: number;
  pincode: string;
  orderId: string;
  skuId: string;
  method: 'ocr' | 'fallback';
  type: 'label' | 'invoice';
  qtyBounds?: any;
}

interface ProcessedResult extends PageResult {
  isMulti: boolean;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

// ── Component ────────────────────────────────────────────────────────────────
export default function FlipkartCropper({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pngUrls, setPngUrls] = useState<{ name: string; url: string }[]>([]);
  const [labelCount, setLabelCount] = useState(0);
  const [ocrCount, setOcrCount] = useState(0);
  const [exportPng, setExportPng] = useState(false);
  const [keepInvoice, setKeepInvoice] = useState(false);
  const [sortByAwb, setSortByAwb] = useState(false);
  const [sortBySeller, setSortBySeller] = useState(false);
  const [sortBySku, setSortBySku] = useState(false);
  const [sortByQty, setSortByQty] = useState(false);
  const [labelsPerA4, setLabelsPerA4] = useState(false);
  const [highlightSku, setHighlightSku] = useState(false);
  const [multiOrderAtBottom, setMultiOrderAtBottom] = useState(false);
  const [fallbackAtBottom, setFallbackAtBottom] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    
    const allLabels: ProcessedItem[] = [];
    const allInvoices: ProcessedItem[] = [];

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let fileMethod: 'ocr' | 'fallback' = 'ocr';

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          const items = content.items as any[];
          const RENDER_SCALE = 5.0;
          const viewport = page.getViewport({ scale: RENDER_SCALE });
          
          const labelBounds = await detectFlipkartLabels(page, RENDER_SCALE);
          const fullCanvas = document.createElement('canvas');
          fullCanvas.width = viewport.width;
          fullCanvas.height = viewport.height;
          await page.render({ canvasContext: fullCanvas.getContext('2d')!, viewport, canvas: fullCanvas }).promise;

          if (labelBounds.length > 0 && labelBounds[0].method === 'ocr') {
            let lastLabelBottom = 0;
            for (const bounds of labelBounds) {
              const meta = extractMetadata(items, bounds, viewport.height, RENDER_SCALE);
              const out = document.createElement('canvas');
              out.width = Math.max(1, Math.round(bounds.width));
              out.height = Math.max(1, Math.round(bounds.height));
              const ctx = out.getContext('2d')!;
              ctx.drawImage(fullCanvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, out.width, out.height);
              
              if (highlightSku && meta.skuBounds) {
                ctx.strokeStyle = '#2563eb'; // Blue
                ctx.lineWidth = 5;
                ctx.strokeRect(meta.skuBounds.x - bounds.x - 2, meta.skuBounds.y - bounds.y - 2, meta.skuBounds.w + 4, meta.skuBounds.h + 4);
                ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
                ctx.fillRect(meta.skuBounds.x - bounds.x - 2, meta.skuBounds.y - bounds.y - 2, meta.skuBounds.w + 4, meta.skuBounds.h + 4);
              }

              if (highlightSku && meta.qty > 1 && meta.qtyBounds) {
                ctx.strokeStyle = '#ef4444'; // Red for bulk
                ctx.lineWidth = 4;
                ctx.strokeRect(meta.qtyBounds.x - bounds.x, meta.qtyBounds.y - bounds.y, meta.qtyBounds.w, meta.qtyBounds.h);
                ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
                ctx.fillRect(meta.qtyBounds.x - bounds.x, meta.qtyBounds.y - bounds.y, meta.qtyBounds.w, meta.qtyBounds.h);
                
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 24px Arial';
                ctx.fillText(`QTY: ${meta.qty} !!`, meta.qtyBounds.x - bounds.x, meta.qtyBounds.y - bounds.y - 5);
              }

              allLabels.push({ canvas: out, ...meta, method: bounds.method, type: 'label' });
              if (bounds.method === 'fallback') fileMethod = 'fallback';
              lastLabelBottom = Math.max(lastLabelBottom, bounds.y + bounds.height);
            }

            if (keepInvoice) {
              const invBounds = await detectFlipkartInvoiceBounds(items, viewport, RENDER_SCALE);
              if (invBounds) {
                const invCanvas = document.createElement('canvas');
                invCanvas.width = Math.max(1, Math.round(invBounds.width));
                invCanvas.height = Math.max(1, Math.round(invBounds.height));
                const ctx = invCanvas.getContext('2d')!;
                ctx.drawImage(fullCanvas, invBounds.x, invBounds.y, invBounds.width, invBounds.height, 0, 0, invCanvas.width, invCanvas.height);
                
                const firstLabelMeta = extractMetadata(items, labelBounds[0], viewport.height, RENDER_SCALE);
                
                if (highlightSku && firstLabelMeta.skuBounds) {
                  ctx.strokeStyle = '#2563eb';
                  ctx.lineWidth = 4;
                  ctx.strokeRect(firstLabelMeta.skuBounds.x - invBounds.x, firstLabelMeta.skuBounds.y - invBounds.y, firstLabelMeta.skuBounds.w, firstLabelMeta.skuBounds.h);
                  ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
                  ctx.fillRect(firstLabelMeta.skuBounds.x - invBounds.x, firstLabelMeta.skuBounds.y - invBounds.y, firstLabelMeta.skuBounds.w, firstLabelMeta.skuBounds.h);
                }

                allInvoices.push({ canvas: invCanvas, ...firstLabelMeta, method: 'ocr', type: 'invoice' });
              } else if (lastLabelBottom < viewport.height * 0.85) {
                // Fallback to simple bottom crop if precise detection fails
                const invH = viewport.height - lastLabelBottom;
                if (invH > 100) {
                  const invCanvas = document.createElement('canvas');
                  invCanvas.width = viewport.width;
                  invCanvas.height = invH;
                  invCanvas.getContext('2d')!.drawImage(fullCanvas, 0, lastLabelBottom, viewport.width, invH, 0, 0, viewport.width, invH);
                  const firstLabelMeta = extractMetadata(items, labelBounds[0], viewport.height, RENDER_SCALE);
                  allInvoices.push({ canvas: invCanvas, ...firstLabelMeta, method: 'ocr', type: 'invoice' });
                }
              }
            }
          } else if (keepInvoice) {
            // Check if it's an invoice page
            const pageText = items.map(i => i.str).join(' ').toUpperCase();
            if (pageText.includes('INVOICE') || pageText.includes('ORDER ID') || pageText.includes('TAX')) {
              const invBounds = await detectFlipkartInvoiceBounds(items, viewport, RENDER_SCALE);
              if (invBounds) {
                const invCanvas = document.createElement('canvas');
                invCanvas.width = Math.max(1, Math.round(invBounds.width));
                invCanvas.height = Math.max(1, Math.round(invBounds.height));
                invCanvas.getContext('2d')!.drawImage(fullCanvas, invBounds.x, invBounds.y, invBounds.width, invBounds.height, 0, 0, invCanvas.width, invCanvas.height);
                const meta = extractMetadata(items);
                allInvoices.push({ canvas: invCanvas, ...meta, method: 'ocr', type: 'invoice' });
              } else {
                const meta = extractMetadata(items);
                allInvoices.push({ canvas: fullCanvas, ...meta, method: 'ocr', type: 'invoice' });
              }
            }
          }
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages, method: fileMethod } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    // ── Matching ───────────────────────────────────────────────────────────
    interface ProcessedGroup {
      label: ProcessedItem;
      invoice?: ProcessedItem;
      isMulti: boolean;
    }

    const groups: ProcessedGroup[] = allLabels.map(label => ({ label, isMulti: false }));
    const usedInvoiceIds = new Set<number>();

    if (keepInvoice) {
      groups.forEach(group => {
        // Find matching invoice by AWB
        const invIdx = allInvoices.findIndex((inv, idx) => !usedInvoiceIds.has(idx) && inv.awb === group.label.awb && inv.awb !== '');
        if (invIdx !== -1) {
          group.invoice = allInvoices[invIdx];
          usedInvoiceIds.add(invIdx);
        }
      });
      // Fallback matching by sequence for invoices without AWB match
      allInvoices.forEach((inv, idx) => {
        if (!usedInvoiceIds.has(idx)) {
          const nextAvailableGroup = groups.find(g => !g.invoice);
          if (nextAvailableGroup) {
            nextAvailableGroup.invoice = inv;
            usedInvoiceIds.add(idx);
          }
        }
      });
    }

    // ── Multi-Order detection ──────────────────────────────────────────────
    const pincodeMap = new Map<string, number>();
    groups.forEach(g => {
      if (g.label.pincode) pincodeMap.set(g.label.pincode, (pincodeMap.get(g.label.pincode) || 0) + 1);
    });
    groups.forEach(g => {
      if (g.label.qty > 1 || (g.label.pincode && (pincodeMap.get(g.label.pincode) || 0) > 1)) {
        g.isMulti = true;
      }
    });

    // ── Sort ───────────────────────────────────────────────────────────────
    if (sortByAwb || sortBySeller || sortBySku || sortByQty || multiOrderAtBottom || fallbackAtBottom) {
      groups.sort((a, b) => {
        if (multiOrderAtBottom) {
          if (a.isMulti && !b.isMulti) return 1;
          if (!a.isMulti && b.isMulti) return -1;
        }
        if (fallbackAtBottom) {
          if (a.label.method === 'ocr' && b.label.method === 'fallback') return -1;
          if (a.label.method === 'fallback' && b.label.method === 'ocr') return 1;
        }
        if (sortByQty && a.label.qty !== b.label.qty) {
          return a.label.qty - b.label.qty;
        }
        if (sortBySku && a.label.skuId !== b.label.skuId) {
          return a.label.skuId.localeCompare(b.label.skuId);
        }
        if (sortBySeller && a.label.sellerName !== b.label.sellerName) {
          return a.label.sellerName.localeCompare(b.label.sellerName);
        }
        if (sortByAwb) return a.label.awb.localeCompare(b.label.awb);
        return 0;
      });
    }

    // ── Final List ─────────────────────────────────────────────────────────
    const finalResults: ProcessedItem[] = [];
    groups.forEach(g => {
      finalResults.push(g.label);
      if (g.invoice) finalResults.push(g.invoice);
    });

    // Build PDF
    if (labelsPerA4 && !keepInvoice) {
      const A4_W = 595.28;
      const A4_H = 841.89;
      const margin = 20;
      const slotW = (A4_W - margin * 3) / 2;
      const slotH = (A4_H - margin * 3) / 2;

      for (let i = 0; i < finalResults.length; i += 4) {
        const page = outDoc.addPage([A4_W, A4_H]);
        for (let j = 0; j < 4 && (i + j) < finalResults.length; j++) {
          const r = finalResults[i + j];
          const pngBytes = await canvasToPngBytes(r.canvas);
          const img = await outDoc.embedPng(pngBytes);
          
          // Fit image to slot while maintaining aspect ratio
          const scale = Math.min(slotW / img.width, slotH / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          
          const row = j % 2;
          const col = Math.floor(j / 2);
          
          const slotX = margin + col * (slotW + margin);
          const slotYTop = margin + row * (slotH + margin);
          
          const x = slotX + (slotW - drawW) / 2;
          const y = A4_H - (slotYTop + (slotH - drawH) / 2 + drawH);
          
          page.drawImage(img, { x, y, width: drawW, height: drawH });
          
          // Draw a very faint border for cutting guide
          page.drawRectangle({
            x: slotX,
            y: A4_H - (slotYTop + slotH),
            width: slotW,
            height: slotH,
            borderColor: rgb(0.9, 0.9, 0.9),
            borderWidth: 0.5
          });
        }
      }
    } else {
      for (const r of finalResults) {
        const pngBytes = await canvasToPngBytes(r.canvas);
        const img = await outDoc.embedPng(pngBytes);
        const origW = img.width / 5.0;
        const origH = img.height / 5.0;
        const page = outDoc.addPage([origW, origH]);
        page.drawImage(img, { x: 0, y: 0, width: origW, height: origH });
      }
    }
    const pdfBytes = await outDoc.save();
    setPdfUrl(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));

    // PNG export
    if (exportPng) {
      const pngList: { name: string; url: string }[] = [];
      for (const r of finalResults) {
        if (r.type === 'label') {
          const bytes = await canvasToPngBytes(r.canvas);
          pngList.push({
            name: r.awb ? `${r.awb}.png` : `flipkart_label_${finalResults.indexOf(r) + 1}.png`,
            url: URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'image/png' })),
          });
        }
      }
      setPngUrls(pngList);
    }

    setLabelCount(allLabels.length);
    setOcrCount(allLabels.filter(r => r.method === 'ocr').length);
    setProcessing(false); setDone(true);
  };

  const reset = () => {
    setFiles([]); setDone(false); setPdfUrl(null); setPngUrls([]); setLabelCount(0); setOcrCount(0);
  };

  const ACCENT = '#F7941D';

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 sm:gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700"
          >
            <span className="flex items-center gap-2"><FileText size={20} style={{ color: ACCENT }} /> Settings (સેટિંગ્સ)</span>
            <Loader2 className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>
          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="hidden lg:block text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Settings</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={keepInvoice} onChange={e => {
                setKeepInvoice(e.target.checked);
                if (e.target.checked) setLabelsPerA4(false);
              }} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Keep Invoice <span className="block text-[10px] text-slate-400">Under each label</span></span>
            </label>
            <label className={`flex items-start gap-3 cursor-pointer ${keepInvoice ? 'opacity-40 pointer-events-none' : ''}`}>
              <input type="checkbox" checked={labelsPerA4} onChange={e => setLabelsPerA4(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">4 Labels per A4 page</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">2x2 Grid (No Invoice)</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={sortByQty} onChange={e => setSortByQty(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Sort by Quantity</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Qty મુજબ સોર્ટ કરો</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={sortBySku} onChange={e => setSortBySku(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Sort by SKU ID</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Group identical items</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={highlightSku} onChange={e => setHighlightSku(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Highlight SKU ID</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Visible blue boxes</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={sortBySeller} onChange={e => setSortBySeller(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Sort by Sold By</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={sortByAwb} onChange={e => setSortByAwb(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Sort by AWB</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={multiOrderAtBottom} onChange={e => setMultiOrderAtBottom(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Multi order at bottom</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={exportPng} onChange={e => setExportPng(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Export PNGs</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT }}><ShoppingBag size={32} /></div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Flipkart Label Cropper</h2>
            <p className="text-slate-500 font-medium">Extracts 1st to end label with zero invoice bleed.</p>
            
            {/* Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
              {[
                { step: "1", title: "Upload", desc: "Select labels" },
                { step: "2", title: "Sort", desc: "By SKU ID" },
                { step: "3", title: "Highlight", desc: "Check SKU" },
                { step: "4", title: "Print", desc: "Download PDF" }
              ].map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center mb-1 mx-auto">{s.step}</div>
                  <div className="text-[11px] font-black text-slate-900 dark:text-white">{s.title}</div>
                  <div className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {!done ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-10 sm:p-16 hover:border-[#F7941D] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
                <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block mb-4" style={{ color: ACCENT }}><Upload size={32} /></div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Drop PDFs Here</div>
              </div>
              {files.length > 0 && (
                <div className="space-y-4">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                      <div className="flex items-center gap-3"><FileText size={16} /><span className="text-xs font-bold">{f.name}</span></div>
                      {f.status === 'processing' ? <Loader2 size={16} className="animate-spin" /> : <button onClick={() => removeFile(f.id)}><X size={16} /></button>}
                    </div>
                  ))}
                  <button onClick={processAll} disabled={processing} className="w-full py-5 text-white rounded-2xl text-2xl font-black shadow-xl" style={{ background: ACCENT }}>{processing ? 'Processing...' : 'Start Extraction'}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block"><CheckCircle2 size={64} /></div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{labelCount} Labels Extracted</h3>
              <a href={pdfUrl!} download="flipkart_labels.pdf" className="block py-5 text-white rounded-2xl text-2xl font-black shadow-xl" style={{ background: ACCENT }}><Download size={24} className="inline mr-2" /> Download PDF</a>
              <button onClick={reset} className="w-full py-4 font-bold text-slate-500">Extract More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
