"use client";

import { useState, useRef } from 'react';
import {
  Upload, Download, Loader2, X, CheckCircle2, ShoppingBag,
  Trash2, FileText, AlertCircle, Plus, Lock, Smartphone, Rocket, Sparkles, Zap, Shield,
  Settings, ChevronUp, ChevronDown, RotateCcw, Crop, ListOrdered, User, Box, Truck, Image, ArrowDownUp, CreditCard, Scan
} from 'lucide-react';
import type * as PDFJS from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import { useCredits } from '@/hooks/useCredits';
import OutOfCreditsModal from '@/components/credits/OutOfCreditsModal';

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
  const { remaining, isGuest, isPremium, deductCredit } = useCredits();
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('cod');
  const [sellerSortOrder, setSellerSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<HTMLDivElement>(null);

  const handleDownloadClick = () => {
    if (!isPremium && remaining <= 0) {
      setOutOfCreditsOpen(true);
      return;
    }

    deductCredit('flipkart-cropper');

    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'flipkart_labels.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    const entries: LabelFile[] = Array.from(fl)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ id: crypto.randomUUID(), name: f.name, file: f, status: 'pending' }));
    setFiles(prev => [...prev, ...entries]);
    setDone(false); setPdfUrl(null); setPngUrls([]);
    
    // Automatically open the settings menu upon upload to mimic desktop behavior
    setShowSettings(true);
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

  const ACCENT = '#e11d48';
  const ACCENT_GRADIENT = "linear-gradient(135deg,#e11d48,#be123c)";

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      <OutOfCreditsModal isOpen={outOfCreditsOpen} onClose={() => setOutOfCreditsOpen(false)} isGuest={isGuest} />
      <div className="flex flex-col lg:flex-row-reverse gap-4 sm:gap-8 items-start">
        {files.length > 0 && !done && (
          <div className="w-full lg:w-[400px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0 animate-in slide-in-from-left-4">
            <div
              className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between cursor-pointer lg:cursor-default select-none"
              onClick={() => setShowSettings(!showSettings)}
            >
              <div className="flex items-center gap-2 text-[#e11d48]">
                <Settings size={20} />
                <h3 className="text-[15px] font-black text-[#1e293b] dark:text-white tracking-widest uppercase">Settings</h3>
              </div>
              {showSettings ? (
                <ChevronUp size={20} className="text-[#e11d48] lg:hidden" />
              ) : (
                <ChevronDown size={20} className="text-[#e11d48] lg:hidden" />
              )}
            </div>

            <div className={`pt-5 px-5 pb-4 space-y-5 ${showSettings ? 'block' : 'hidden lg:block'}`}>
              {/* EXTRACTION OPTIONS */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Extraction Options</h4>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-[#e11d48]"><FileText size={16} /></div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">Keep Invoice</p>
                      <p className="text-[10px] text-slate-400">Extract tax invoice pages</p>
                    </div>
                  </div>
                  <button onClick={() => setKeepInvoice(!keepInvoice)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${keepInvoice ? 'bg-[#e11d48]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${keepInvoice ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-[#e11d48]"><Image size={16} /></div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">Export PNGs</p>
                      <p className="text-[10px] text-slate-400">Export cropped labels as PNG Images</p>
                    </div>
                  </div>
                  <button onClick={() => setExportPng(!exportPng)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${exportPng ? 'bg-[#e11d48]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${exportPng ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                  </button>
                </div>
              </div>

              {/* SORT & FILTER ORDERS */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <div className="text-[#e11d48]"><ListOrdered size={12} /></div> Sort & Filter Orders
                </h4>
                <div className="grid grid-cols-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 overflow-hidden divide-x divide-slate-100 dark:divide-slate-700">
                  <button onClick={() => setSortByAwb(!sortByAwb)} className={`py-2 text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${sortByAwb ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sortByAwb ? 'bg-red-50 dark:bg-red-500/10 text-[#e11d48]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <ArrowDownUp size={14} />
                    </div>
                    Order ID
                  </button>
                  <button onClick={() => setSortByQty(!sortByQty)} className={`py-2 text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${sortByQty ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sortByQty ? 'bg-red-50 dark:bg-red-500/10 text-[#e11d48]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <Truck size={14} />
                    </div>
                    Courier
                  </button>
                  <button onClick={() => setSortBySku(!sortBySku)} className={`py-2 text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${sortBySku ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sortBySku ? 'bg-red-50 dark:bg-red-500/10 text-[#e11d48]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <Box size={14} />
                    </div>
                    SKU
                  </button>
                  <button onClick={() => setSortBySeller(!sortBySeller)} className={`py-2 text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${sortBySeller ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sortBySeller ? 'bg-red-50 dark:bg-red-500/10 text-[#e11d48]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      <User size={14} />
                    </div>
                    Seller
                  </button>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <div className="text-[#e11d48]"><CreditCard size={12} /></div> Payment Method
                </h4>
                <div className="grid grid-cols-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 overflow-hidden divide-x divide-slate-100 dark:divide-slate-700">
                  <button onClick={() => setPaymentMethod('cod')} className={`py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cod' ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${paymentMethod === 'cod' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center p-0.5 ${paymentMethod === 'cod' ? 'border-[#e11d48]' : 'border-slate-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />}
                      </div>
                    </div>
                    COD First
                  </button>
                  <button onClick={() => setPaymentMethod('prepaid')} className={`py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'prepaid' ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${paymentMethod === 'prepaid' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center p-0.5 ${paymentMethod === 'prepaid' ? 'border-[#e11d48]' : 'border-slate-300'}`}>
                        {paymentMethod === 'prepaid' && <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />}
                      </div>
                    </div>
                    Prepaid First
                  </button>
                </div>
              </div>

              {/* SELLER */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <div className="text-[#e11d48]"><User size={12} /></div> Seller
                </h4>
                <div className="grid grid-cols-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 overflow-hidden divide-x divide-slate-100 dark:divide-slate-700">
                  <button onClick={() => setSellerSortOrder('asc')} className={`py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${sellerSortOrder === 'asc' ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sellerSortOrder === 'asc' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center p-0.5 ${sellerSortOrder === 'asc' ? 'border-[#e11d48]' : 'border-slate-300'}`}>
                        {sellerSortOrder === 'asc' && <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />}
                      </div>
                    </div>
                    A → Z
                  </button>
                  <button onClick={() => setSellerSortOrder('desc')} className={`py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${sellerSortOrder === 'desc' ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className={`p-1.5 rounded-lg transition-colors ${sellerSortOrder === 'desc' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center p-0.5 ${sellerSortOrder === 'desc' ? 'border-[#e11d48]' : 'border-slate-300'}`}>
                        {sellerSortOrder === 'desc' && <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />}
                      </div>
                    </div>
                    Z → A
                  </button>
                </div>
              </div>



            </div>
          </div>
        )}
        <div className="flex-1 w-full space-y-4 sm:space-y-6">
          <div ref={cropperRef} className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden w-full scroll-mt-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            {!done ? (
              <>
                <div className="relative text-center space-y-4 mb-6">
                  <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
                    <ShoppingBag size={32} />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                    Flipkart Label Cropper
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
                    Extracts shipping labels with zero invoice bleed. Optimized for high-speed warehouse processing.
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">
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

                  {files.length === 0 ? (
                    <div
                      className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (!isPremium && remaining <= 0) {
                          setOutOfCreditsOpen(true);
                          return;
                        }
                        addFiles(e.dataTransfer.files);
                      }}
                      onClick={() => {
                        if (!isPremium && remaining <= 0) {
                          setOutOfCreditsOpen(true);
                          return;
                        }
                        inputRef.current?.click();
                      }}
                    >
                      <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                      <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-32 h-40 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10 overflow-hidden">
                          <img src="/img/flipkart-label.png" alt="Flipkart Label Preview" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                          <Upload size={20} strokeWidth={3} />
                        </div>
                        <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                        <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                        <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                        Drag & drop Flipkart PDFs here
                      </h3>
                      <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                        or click to <span style={{ color: ACCENT }}>browse</span>
                      </p>
                      <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                        Supports multiple PDF files
                      </p>

                      <div className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                        <Plus size={20} /> SELECT PDF FILES
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-4 mb-6">
                      <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Selected Files</h3>
                        <button onClick={() => inputRef.current?.click()} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                          + Add More
                        </button>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {files.map(f => (
                          <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm shrink-0" style={{ color: ACCENT }}>
                                <FileText size={16} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{f.name}</span>
                            </div>
                            {f.status === 'processing' ? (
                              <Loader2 size={18} className="animate-spin text-slate-400 shrink-0" />
                            ) : (
                              <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={processAll} disabled={processing} className="w-full py-4 text-white rounded-xl text-lg font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                          {processing ? (
                            <><Loader2 size={24} className="animate-spin" /> Processing...</>
                          ) : (
                            <><Zap size={24} /> Start Extraction</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

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
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10 w-full max-w-lg mx-auto py-10">
                <div className="p-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block shadow-lg">
                  <CheckCircle2 size={64} />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-center">
                  {labelCount} Labels Extracted
                </h3>
                <div className="w-full space-y-4 mt-6">
                  <button onClick={handleDownloadClick} className="w-full py-4 text-white rounded-xl text-lg font-bold uppercase tracking-widest shadow-xl text-center flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95" style={{ background: ACCENT_GRADIENT }}>
                    <Download size={24} /> Download PDF
                  </button>
                  <button onClick={reset} className="w-full py-4 font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl">
                    Extract More
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



