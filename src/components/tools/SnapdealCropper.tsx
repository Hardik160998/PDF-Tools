"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, FileText, ChevronDown } from 'lucide-react';
import type * as PDFJS from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

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
  quantity?: number;
  payment?: string;
  sku?: string;
  seller?: string;
  pkd?: number;
  refNo?: string;
}

interface ProcessedItem {
  canvas: HTMLCanvasElement;
  awb: string;
  method: 'ocr' | 'fallback';
  type: 'label' | 'invoice';
  courier: string;
  quantity: number;
  payment: string;
  sku: string;
  seller: string;
  pkd: number;
  refNo: string;
}

interface ProcessedGroup {
  courier: string;
  awb: string;
  quantity: number;
  payment: string;
  sku: string;
  seller: string;
  pkd: number;
  refNo: string;
  items: ProcessedItem[];
}

function normalize(v: string) {
  return v.replace(/\s+/g, ' ').trim().toLowerCase();
}

async function detectSnapdealLabels(
  page: PDFJS.PDFPageProxy,
  scale: number
): Promise<CropBounds[]> {
  const viewport = page.getViewport({ scale });
  const content = await page.getTextContent();
  const items = content.items as any[];
  const pageH = viewport.height;
  const pageW = viewport.width;

  const labels: CropBounds[] = [];

  // Robust Anchor Detection using single words
  const totalAnchors = items.filter(i => normalize(i.str).includes('total'));
  const shippedAnchors = items.filter(i => normalize(i.str).includes('shipped'));
  const refAnchors = items.filter(i => normalize(i.str).includes('reference'));
  const snapdealAnchors = items.filter(i => normalize(i.str).includes('snapdeal'));
  const codAnchors = items.filter(i => normalize(i.str) === 'cod' || normalize(i.str) === 'prepaid');

  // Check if this is actually a label page
  const isLabel = snapdealAnchors.length > 0 || shippedAnchors.length > 0 || codAnchors.length > 0;

  if (isLabel) {
    // Top Calculation
    let topY = 0;
    const topElements = [...snapdealAnchors, ...codAnchors, ...totalAnchors];
    if (topElements.length > 0) {
      topY = Math.max(...topElements.map(a => a.transform[5]));
    } else if (items.length > 0) {
      topY = Math.max(...items.map(i => i.transform[5]));
    }
    const topPdfY = topY + 60; // generous padding

    // Bottom Calculation
    let botY = pageH;
    let foundBot = false;

    // Check reference barcode
    if (refAnchors.length > 0) {
      const refY = refAnchors[0].transform[5];
      const belowRef = items.filter(i => i.transform[5] < refY && i.transform[5] > refY - 120 && i.transform[4] > pageW * 0.4);
      if (belowRef.length > 0) {
        botY = Math.min(...belowRef.map(i => i.transform[5]));
        foundBot = true;
      }
    }

    // Check shipped from address
    if (shippedAnchors.length > 0) {
      const shipY = shippedAnchors[0].transform[5];
      const addrTexts = items.filter(i => i.transform[5] < shipY && i.transform[5] > shipY - 150 && i.transform[4] < pageW * 0.5);
      if (addrTexts.length > 0) {
        const minAddrY = Math.min(...addrTexts.map(i => i.transform[5]));
        if (!foundBot || minAddrY < botY) botY = minAddrY;
        foundBot = true;
      }
    }

    if (!foundBot) botY = pageH * 0.4;
    const botPdfY = Math.max(0, botY - 60); // generous padding

    // Right Calculation & Quantity Extraction
    let rightX = 0;
    let extractedQty = 1;
    if (totalAnchors.length > 0) {
      const topAnchor = totalAnchors[0];
      const qtyTexts = items.filter(i => Math.abs(i.transform[5] - topAnchor.transform[5]) < 30 && i.transform[4] > topAnchor.transform[4]);
      if (qtyTexts.length > 0) {
        rightX = Math.max(...qtyTexts.map(i => i.transform[4] + (i.width || 30)));
        // Extract quantity number
        const numStrs = qtyTexts.map(i => i.str.replace(/\D/g, '')).filter(s => s.length > 0);
        if (numStrs.length > 0) {
          const parsed = parseInt(numStrs[0], 10);
          if (!isNaN(parsed) && parsed > 0) extractedQty = parsed;
        }
      } else {
        rightX = topAnchor.transform[4] + 60;
      }
    } else {
      rightX = pageW - 20;
    }
    const rightPdfX = Math.min(pageW, rightX + 60);

    // Left Calculation
    let leftX = pageW;
    if (shippedAnchors.length > 0) leftX = Math.min(...shippedAnchors.map(a => a.transform[4]));
    if (snapdealAnchors.length > 0) leftX = Math.min(leftX, ...snapdealAnchors.map(a => a.transform[4]));
    if (leftX === pageW) leftX = 30;
    const leftPdfX = Math.max(0, leftX - 60);

    const canvasTop = Math.max(0, pageH - topPdfY * scale);
    const canvasBottom = Math.min(pageH, pageH - botPdfY * scale);
    const canvasLeft = Math.max(0, leftPdfX * scale);
    const canvasRight = Math.min(pageW, rightPdfX * scale);

    // Payment extraction
    let paymentStr = 'UNKNOWN';
    if (codAnchors.length > 0) {
      paymentStr = codAnchors[0].str.toUpperCase().trim();
    }

    // SKU Extraction
    let skuStr = 'UNKNOWN';
    const suborderAnchors = items.filter(i => normalize(i.str).includes('suborder'));
    if (suborderAnchors.length > 0) {
      const subY = suborderAnchors[0].transform[5];
      // Search slightly below SUBORDER CODE header, restricted to left side of the page (before SELLER column)
      const skuItems = items.filter(i =>
        i.transform[5] < subY &&
        i.transform[5] > subY - 45 &&
        i.transform[4] < pageW * 0.4
      );

      // Sort primarily by Y (top to bottom) then X (left to right) for multi-line skus
      skuItems.sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) > 5) {
          return b.transform[5] - a.transform[5]; // higher Y comes first
        }
        return a.transform[4] - b.transform[4];
      });

      const fullText = skuItems.map(i => i.str.trim()).filter(Boolean).join(' ');
      if (fullText.includes('|')) {
        skuStr = fullText.split('|').slice(1).join('|').trim(); // handle multiple pipes just in case
      }
    }

    // Seller Extraction
    let sellerStr = 'UNKNOWN';
    const sellerAnchors = items.filter(i => normalize(i.str) === 'seller');
    const gstinAnchors = items.filter(i => normalize(i.str) === 'gstin');
    if (sellerAnchors.length > 0) {
      const sellerY = sellerAnchors[0].transform[5];
      const sellerX = sellerAnchors[0].transform[4];
      let limitX = pageW * 0.8;
      if (gstinAnchors.length > 0) {
        limitX = gstinAnchors[0].transform[4];
      }

      const sellerItems = items.filter(i =>
        i.transform[5] < sellerY &&
        i.transform[5] > sellerY - 45 &&
        i.transform[4] > sellerX - 80 &&
        i.transform[4] < limitX - 5
      );

      sellerItems.sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) > 5) return b.transform[5] - a.transform[5];
        return a.transform[4] - b.transform[4];
      });

      const fullText = sellerItems.map(i => i.str.trim()).filter(Boolean).join(' ');
      if (fullText) sellerStr = fullText;
    }

    // PKD (Packed Date) Extraction
    let pkdTimestamp = 0;
    const pkdAnchors = items.filter(i => normalize(i.str).includes('pkd:'));
    if (pkdAnchors.length > 0) {
      const pkdY = pkdAnchors[0].transform[5];
      const pkdX = pkdAnchors[0].transform[4];
      const pkdItems = items.filter(i =>
        i.transform[5] <= pkdY + 5 &&
        i.transform[5] >= pkdY - 35 &&
        i.transform[4] >= pkdX - 5
      );

      pkdItems.sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) > 5) return b.transform[5] - a.transform[5];
        return a.transform[4] - b.transform[4];
      });

      const fullText = pkdItems.map(i => i.str.trim()).filter(Boolean).join(' ');
      const match = fullText.match(/PKD:\s*(\d{4}-\d{2}-\d{2})(?:\s*(\d{2}:\d{2}:\d{2}))?/i);
      if (match) {
        const dateStr = match[2] ? `${match[1]}T${match[2]}` : match[1];
        const parsed = new Date(dateStr).getTime();
        if (!isNaN(parsed)) pkdTimestamp = parsed;
      }
    }

    // Snapdeal Reference No Extraction
    let refNoStr = 'UNKNOWN';
    const refNoAnchors = items.filter(i => normalize(i.str).includes('snapdeal reference no'));
    if (refNoAnchors.length > 0) {
      const refY = refNoAnchors[0].transform[5];
      const refItems = items.filter(i => 
        i.transform[5] < refY - 10 && 
        i.transform[5] > refY - 100 && 
        i.transform[4] > pageW * 0.4
      );
      
      const fullText = refItems.map(i => i.str.trim()).filter(Boolean).join('');
      const match = fullText.match(/SLP\d{10}/i);
      if (match) {
        refNoStr = match[0].toUpperCase();
      } else if (fullText) {
        // Fallback to any long alphanumeric if SLP pattern not found
        const anyMatch = fullText.match(/[A-Z0-9]{8,}/i);
        if (anyMatch) refNoStr = anyMatch[0].toUpperCase();
      }
    }

    labels.push({
      x: canvasLeft,
      y: canvasTop,
      width: canvasRight - canvasLeft,
      height: canvasBottom - canvasTop,
      method: 'ocr',
      quantity: extractedQty,
      payment: paymentStr,
      sku: skuStr,
      seller: sellerStr,
      pkd: pkdTimestamp,
      refNo: refNoStr
    });
  }

  return labels;
}

function tightCropCanvas(
  sourceCanvas: HTMLCanvasElement,
  approxBounds: CropBounds,
  paddingPx: number
): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  const { width, height } = sourceCanvas;

  // Constrain bounds to canvas size
  const sx = Math.max(0, Math.floor(approxBounds.x));
  const sy = Math.max(0, Math.floor(approxBounds.y));
  const sw = Math.min(width - sx, Math.ceil(approxBounds.width));
  const sh = Math.min(height - sy, Math.ceil(approxBounds.height));

  if (sw <= 0 || sh <= 0) return sourceCanvas;

  const imageData = ctx.getImageData(sx, sy, sw, sh);
  const data = imageData.data;

  let minX = sw, minY = sh, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = (y * sw + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
      // Find non-white pixels (darker than 240)
      if (a > 50 && (r < 240 || g < 240 || b < 240)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) {
    const out = document.createElement('canvas');
    out.width = sw; out.height = sh;
    out.getContext('2d')!.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return out;
  }

  // Exact padding around the true drawn border
  let finalX = sx + minX - paddingPx;
  let finalY = sy + minY - paddingPx;
  let finalW = (maxX - minX) + (paddingPx * 2);
  let finalH = (maxY - minY) + (paddingPx * 2);

  if (finalX < 0) { finalW += finalX; finalX = 0; }
  if (finalY < 0) { finalH += finalY; finalY = 0; }
  if (finalX + finalW > width) finalW = width - finalX;
  if (finalY + finalH > height) finalH = height - finalY;

  const out = document.createElement('canvas');
  out.width = finalW;
  out.height = finalH;
  out.getContext('2d')!.drawImage(sourceCanvas, finalX, finalY, finalW, finalH, 0, 0, finalW, finalH);
  return out;
}

// Invoice Bounds detection (if they want to keep the invoice)
async function detectSnapdealInvoiceBounds(
  items: any[],
  viewport: any,
  scale: number,
  labelBottom: number
): Promise<CropBounds | null> {
  const pageH = viewport.height;
  const pageW = viewport.width;

  const taxInvItems = items.filter(i => normalize(i.str).includes('tax invoice'));
  if (taxInvItems.length === 0) return null;

  const topPdfY = taxInvItems[0].transform[5] + 20;
  const botPdfY = 20; // almost to the bottom

  return {
    x: 0,
    y: Math.max(0, pageH - topPdfY * scale),
    width: pageW,
    height: Math.min(pageH, (topPdfY - botPdfY) * scale),
    method: 'ocr'
  };
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

export default function SnapdealCropper({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pngUrls, setPngUrls] = useState<{ name: string; url: string }[]>([]);
  const [labelCount, setLabelCount] = useState(0);
  const [detectedCouriers, setDetectedCouriers] = useState<Record<string, number>>({});
  const [detectedPayments, setDetectedPayments] = useState<Record<string, number>>({});
  const [exportPng, setExportPng] = useState(false);
  const [keepInvoice, setKeepInvoice] = useState(false);

  const [sortPayment, setSortPayment] = useState<'none' | 'cod' | 'prepaid'>('none');
  const [sortSeller, setSortSeller] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortCourier, setSortCourier] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortSku, setSortSku] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortQty, setSortQty] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortPkd, setSortPkd] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortRefNo, setSortRefNo] = useState<'none' | 'asc' | 'desc'>('none');

  const inputRef = useRef<HTMLInputElement>(null);

  const COURIERS = ['EKART', 'DELHIVERY', 'XPRESSBEES', 'BLUEDART', 'ECOM', 'SHADOWFAX', 'AMAZON', 'ATS'];

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

    const allGroups: ProcessedGroup[] = [];

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let fileMethod: 'ocr' | 'fallback' = 'ocr';

        // Snapdeal labels typically only process the first page or all pages
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          const items = content.items as any[];
          const RENDER_SCALE = 3.0; // Optimized for speed while maintaining barcode readability
          const viewport = page.getViewport({ scale: RENDER_SCALE });

          const pageText = items.map(i => i.str).join(' ').toLowerCase();
          const isInvoicePage = pageText.includes('tax invoice') || pageText.includes('original for recipient');

          if (isInvoicePage && !keepInvoice) {
            continue; // Skip the invoice page entirely if they don't want it
          }

          let labelBounds = await detectSnapdealLabels(page, RENDER_SCALE);

          // If no labels were detected on this page, and it's not an invoice we want to keep,
          // check if it's the first page and has no text. If so, fallback to top 60%
          if (labelBounds.length === 0 && !isInvoicePage) {
            if (p === 1 && pageText.trim() === '') {
              labelBounds.push({ x: 0, y: 0, width: viewport.width, height: viewport.height * 0.6, method: 'fallback' });
            } else {
              continue;
            }
          }

          const fullCanvas = document.createElement('canvas');
          fullCanvas.width = viewport.width;
          fullCanvas.height = viewport.height;
          await page.render({ canvasContext: fullCanvas.getContext('2d')!, viewport, canvas: fullCanvas }).promise;

          const groupItems: ProcessedItem[] = [];

          for (const bounds of labelBounds) {
            let out: HTMLCanvasElement;
            if (bounds.method === 'fallback') {
              out = document.createElement('canvas');
              out.width = Math.max(1, Math.round(bounds.width));
              out.height = Math.max(1, Math.round(bounds.height));
              out.getContext('2d')!.drawImage(fullCanvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, out.width, out.height);
            } else {
              // 10 PDF points = 10 * RENDER_SCALE pixels of exact padding
              out = tightCropCanvas(fullCanvas, bounds, 10 * RENDER_SCALE);
            }

            // Extract AWB
            let awb = '';
            const awbMatch = pageText.match(/[a-z0-9]{10,15}/i);
            if (awbMatch) awb = awbMatch[0].toUpperCase();

            // Extract Courier Name
            let courier = 'UNKNOWN';
            const upperText = pageText.toUpperCase();
            for (const c of COURIERS) {
              if (new RegExp(`\\b${c}\\b`).test(upperText)) {
                courier = c;
                break;
              }
            }

            groupItems.push({
              canvas: out, awb, method: bounds.method, type: 'label',
              courier, quantity: bounds.quantity || 1, payment: bounds.payment || 'UNKNOWN', sku: bounds.sku || 'UNKNOWN', seller: bounds.seller || 'UNKNOWN', pkd: bounds.pkd || 0, refNo: bounds.refNo || 'UNKNOWN'
            });
            if (bounds.method === 'fallback') fileMethod = 'fallback';
          }

          if (keepInvoice) {
            const invBounds = await detectSnapdealInvoiceBounds(items, viewport, RENDER_SCALE, labelBounds[0]?.y + labelBounds[0]?.height || viewport.height * 0.5);
            if (invBounds) {
              const invCanvas = document.createElement('canvas');
              invCanvas.width = Math.max(1, Math.round(invBounds.width));
              invCanvas.height = Math.max(1, Math.round(invBounds.height));
              invCanvas.getContext('2d')!.drawImage(fullCanvas, invBounds.x, invBounds.y, invBounds.width, invBounds.height, 0, 0, invCanvas.width, invCanvas.height);

              // Use the same info as the label for grouping
              const parentLabel = groupItems[0];
              groupItems.push({
                canvas: invCanvas, awb: parentLabel?.awb || '', method: 'ocr', type: 'invoice',
                courier: parentLabel?.courier || 'UNKNOWN', quantity: parentLabel?.quantity || 1, payment: parentLabel?.payment || 'UNKNOWN', sku: parentLabel?.sku || 'UNKNOWN', seller: parentLabel?.seller || 'UNKNOWN', pkd: parentLabel?.pkd || 0, refNo: parentLabel?.refNo || 'UNKNOWN'
              });
            }
          }

          if (groupItems.length > 0) {
            const first = groupItems[0];
            allGroups.push({
              courier: first.courier, awb: first.awb, quantity: first.quantity,
              payment: first.payment, sku: first.sku, seller: first.seller, pkd: first.pkd, refNo: first.refNo, items: groupItems
            });
          }
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages, method: fileMethod } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    // Multi-level Sort Groups
    allGroups.sort((a, b) => {
      // 1. Payment
      if (sortPayment !== 'none') {
        if (sortPayment === 'cod') {
          const valA = a.payment === 'COD' ? 0 : a.payment === 'PREPAID' ? 1 : 2;
          const valB = b.payment === 'COD' ? 0 : b.payment === 'PREPAID' ? 1 : 2;
          if (valA !== valB) return valA - valB;
        } else {
          const valA = a.payment === 'PREPAID' ? 0 : a.payment === 'COD' ? 1 : 2;
          const valB = b.payment === 'PREPAID' ? 0 : b.payment === 'COD' ? 1 : 2;
          if (valA !== valB) return valA - valB;
        }
      }

      // 2. Seller
      if (sortSeller !== 'none') {
        if (a.seller === 'UNKNOWN' && b.seller !== 'UNKNOWN') return 1;
        if (a.seller !== 'UNKNOWN' && b.seller === 'UNKNOWN') return -1;
        const cmp = sortSeller === 'asc' ? a.seller.localeCompare(b.seller) : b.seller.localeCompare(a.seller);
        if (cmp !== 0) return cmp;
      }

      // 3. Courier
      if (sortCourier !== 'none') {
        if (a.courier === 'UNKNOWN' && b.courier !== 'UNKNOWN') return 1;
        if (a.courier !== 'UNKNOWN' && b.courier === 'UNKNOWN') return -1;
        const cmp = sortCourier === 'asc' ? a.courier.localeCompare(b.courier) : b.courier.localeCompare(a.courier);
        if (cmp !== 0) return cmp;
      }

      // 4. SKU
      if (sortSku !== 'none') {
        if (a.sku === 'UNKNOWN' && b.sku !== 'UNKNOWN') return 1;
        if (a.sku !== 'UNKNOWN' && b.sku === 'UNKNOWN') return -1;
        const cmp = sortSku === 'asc' ? a.sku.localeCompare(b.sku) : b.sku.localeCompare(a.sku);
        if (cmp !== 0) return cmp;
      }

      // 5. Packed Date
      if (sortPkd !== 'none') {
        if (a.pkd === 0 && b.pkd !== 0) return 1;
        if (a.pkd !== 0 && b.pkd === 0) return -1;
        const cmp = sortPkd === 'asc' ? a.pkd - b.pkd : b.pkd - a.pkd;
        if (cmp !== 0) return cmp;
      }

      // 6. Quantity
      if (sortQty !== 'none') {
        const cmp = sortQty === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
        if (cmp !== 0) return cmp;
      }

      // 7. Ref No
      if (sortRefNo !== 'none') {
        if (a.refNo === 'UNKNOWN' && b.refNo !== 'UNKNOWN') return 1;
        if (a.refNo !== 'UNKNOWN' && b.refNo === 'UNKNOWN') return -1;
        const cmp = sortRefNo === 'asc' ? a.refNo.localeCompare(b.refNo) : b.refNo.localeCompare(a.refNo);
        if (cmp !== 0) return cmp;
      }

      return 0;
    });

    const allLabels = allGroups.flatMap(g => g.items);

    for (const r of allLabels) {
      const pngBytes = await canvasToPngBytes(r.canvas);
      const img = await outDoc.embedPng(pngBytes);
      const origW = img.width / 3.0;
      const origH = img.height / 3.0;
      const page = outDoc.addPage([origW, origH]);
      page.drawImage(img, { x: 0, y: 0, width: origW, height: origH });
    }
    const pdfBytes = await outDoc.save();
    setPdfUrl(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));

    const couriersCount: Record<string, number> = {};
    const paymentsCount: Record<string, number> = {};
    const counters: Record<string, number> = {};

    if (exportPng) {
      const pngList: { name: string; url: string }[] = [];
      for (const r of allLabels) {
        if (r.type === 'label') {
          couriersCount[r.courier] = (couriersCount[r.courier] || 0) + 1;
          paymentsCount[r.payment] = (paymentsCount[r.payment] || 0) + 1;
          counters[r.courier] = (counters[r.courier] || 0) + 1;
          const bytes = await canvasToPngBytes(r.canvas);
          pngList.push({
            name: `${r.courier}_${r.payment}_${String(counters[r.courier]).padStart(3, '0')}.png`,
            url: URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'image/png' })),
          });
        }
      }
      setPngUrls(pngList);
    } else {
      for (const r of allLabels) {
        if (r.type === 'label') {
          couriersCount[r.courier] = (couriersCount[r.courier] || 0) + 1;
          paymentsCount[r.payment] = (paymentsCount[r.payment] || 0) + 1;
        }
      }
    }

    setDetectedCouriers(couriersCount);
    setDetectedPayments(paymentsCount);
    setLabelCount(allLabels.filter(l => l.type === 'label').length);
    setProcessing(false); setDone(true);
  };

  const reset = () => {
    setFiles([]); setDone(false); setPdfUrl(null); setPngUrls([]); setLabelCount(0); setDetectedCouriers({}); setDetectedPayments({});
  };

  const [showSettings, setShowSettings] = useState(false);
  const ACCENT = '#E40046'; // Snapdeal Red

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 sm:gap-8">
        <div 
          className="rounded-3xl h-fit lg:sticky lg:top-4 overflow-hidden p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
            borderRadius: '16px'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-0">Settings</h3>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <ChevronDown size={20} className={`transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`${showSettings ? 'block' : 'hidden'} lg:block space-y-4`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={keepInvoice} onChange={e => setKeepInvoice(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Keep Invoice <span className="block text-[10px] text-slate-400">Extract tax invoice pages</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={exportPng} onChange={e => setExportPng(e.target.checked)} className="w-5 h-5 mt-0.5" style={{ accentColor: ACCENT }} />
              <span className="text-sm font-semibold">Export PNGs</span>
            </label>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">SORT & FILTER ORDERS</span>
              <div className="space-y-4">
                
                {/* Payment Method */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">Payment Method</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortPayment(sortPayment === 'cod' ? 'none' : 'cod')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortPayment === 'cod' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortPayment === 'cod' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortPayment === 'cod' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>COD First</span>
                    </div>
                    <div 
                      onClick={() => setSortPayment(sortPayment === 'prepaid' ? 'none' : 'prepaid')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortPayment === 'prepaid' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortPayment === 'prepaid' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortPayment === 'prepaid' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Prepaid First</span>
                    </div>
                  </div>
                </div>

                {/* Seller */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">Seller</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortSeller(sortSeller === 'asc' ? 'none' : 'asc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortSeller === 'asc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortSeller === 'asc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortSeller === 'asc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>A → Z</span>
                    </div>
                    <div 
                      onClick={() => setSortSeller(sortSeller === 'desc' ? 'none' : 'desc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortSeller === 'desc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortSeller === 'desc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortSeller === 'desc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Z → A</span>
                    </div>
                  </div>
                </div>

                {/* Courier */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">Courier</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortCourier(sortCourier === 'asc' ? 'none' : 'asc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortCourier === 'asc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortCourier === 'asc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortCourier === 'asc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>A → Z</span>
                    </div>
                    <div 
                      onClick={() => setSortCourier(sortCourier === 'desc' ? 'none' : 'desc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortCourier === 'desc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortCourier === 'desc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortCourier === 'desc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Z → A</span>
                    </div>
                  </div>
                </div>

                {/* Product / SKU */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">{"Product / SKU"}</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortSku(sortSku === 'asc' ? 'none' : 'asc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortSku === 'asc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortSku === 'asc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortSku === 'asc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>A → Z</span>
                    </div>
                    <div 
                      onClick={() => setSortSku(sortSku === 'desc' ? 'none' : 'desc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortSku === 'desc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortSku === 'desc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortSku === 'desc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Z → A</span>
                    </div>
                  </div>
                </div>

                {/* Packed Date */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">Packed Date (PKD)</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortPkd(sortPkd === 'desc' ? 'none' : 'desc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortPkd === 'desc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortPkd === 'desc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortPkd === 'desc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Newest</span>
                    </div>
                    <div 
                      onClick={() => setSortPkd(sortPkd === 'asc' ? 'none' : 'asc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortPkd === 'asc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortPkd === 'asc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortPkd === 'asc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Oldest</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block pl-1">Quantity</span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div 
                      onClick={() => setSortQty(sortQty === 'asc' ? 'none' : 'asc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortQty === 'asc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortQty === 'asc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortQty === 'asc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>Low to High</span>
                    </div>
                    <div 
                      onClick={() => setSortQty(sortQty === 'desc' ? 'none' : 'desc')}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${sortQty === 'desc' ? 'bg-indigo-50 border-indigo-500 border' : 'bg-transparent border-transparent border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 ${sortQty === 'desc' ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`} />
                      <span className={`text-sm whitespace-nowrap ${sortQty === 'desc' ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>High to Low</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT }}><ShoppingBag size={32} /></div>
            <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Snapdeal Label Cropper</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Perfectly extracts Snapdeal shipping labels directly in your browser. 100% accurate border detection.</p>
          </div>

          {!done ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 hover:border-[#E40046] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
                <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block mb-4" style={{ color: ACCENT }}><Upload size={32} /></div>
                <div className="text-lg sm:text-xl font-medium text-slate-800 dark:text-white mb-1">Drop Snapdeal PDFs</div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Automatic label boundary detection</p>
              </div>
              {files.length > 0 && (
                <div className="space-y-4">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                      <div className="flex items-center gap-3"><FileText size={16} /><span className="text-xs font-medium">{f.name}</span></div>
                      {f.status === 'processing' ? <Loader2 size={16} className="animate-spin" /> : <button onClick={() => removeFile(f.id)}><X size={16} /></button>}
                    </div>
                  ))}
                  <button onClick={processAll} disabled={processing} className="w-full py-5 text-white rounded-2xl text-2xl font-medium shadow-xl" style={{ background: ACCENT }}>{processing ? 'Processing...' : 'Crop Snapdeal Labels'}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block"><CheckCircle2 size={64} /></div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{labelCount} Labels Extracted</h3>
                {Object.keys(detectedCouriers).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {Object.entries(detectedCouriers).map(([c, count]) => (
                      <span key={c} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">{c}</span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md" style={{ color: ACCENT }}>{count}</span>
                      </span>
                    ))}
                  </div>
                )}
                {Object.keys(detectedPayments).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {Object.entries(detectedPayments).map(([p, count]) => (
                      <span key={p} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">{p}</span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md" style={{ color: ACCENT }}>{count}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a href={pdfUrl!} download="snapdeal_sorted_labels.pdf" className="block py-5 text-white rounded-2xl text-2xl font-medium shadow-xl" style={{ background: ACCENT }}><Download size={24} className="inline mr-2" /> Download Cropped PDF</a>
              {exportPng && pngUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {pngUrls.map(p => (
                    <a key={p.name} href={p.url} download={p.name} className="py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors truncate px-2">Download {p.name}</a>
                  ))}
                </div>
              )}
              <button onClick={reset} className="w-full py-4 font-medium text-slate-500 hover:text-slate-700 transition-colors">Extract More Labels</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
