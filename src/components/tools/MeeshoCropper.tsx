"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText } from 'lucide-react';
import type * as PDFJS from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';

interface LabelFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
}

interface PageData {
  canvas: HTMLCanvasElement;
  courierName: string;
  sellerName: string;
  qty: number;
  pincode: string;
  orderId: string;
  awb: string;
  customerName: string;
  skuId: string;
  skuBounds?: any;
  qtyBounds?: any;
  pdfPage?: any;
  pdfBox?: { left: number; bottom: number; right: number; top: number };
  skuPdfBounds?: { x: number; y: number; w: number; h: number };
  qtyPdfBounds?: { x: number; y: number; w: number; h: number };
}

async function findTotalLineY(page: PDFJS.PDFPageProxy): Promise<number | null> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let totalY: number | null = null;
  for (const item of items) {
    if (item.str?.trim() === 'Total') totalY = item.transform[5];
  }
  return totalY;
}

async function extractPageMetadata(page: PDFJS.PDFPageProxy, viewport: any, scale: number): Promise<{ courierName: string; sellerName: string; qty: number; pincode: string; orderId: string; awb: string; customerName: string; skuId: string; skuBounds?: any; qtyBounds?: any; skuPdfBounds?: any; qtyPdfBounds?: any }> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let courierName = 'Unknown';
  let sellerName = 'Unknown';
  let qty = 1;
  let pincode = '';
  let orderId = '';
  let awb = '';
  let customerName = '';
  let skuId = 'ZZZ_UNKNOWN';
  let skuBounds: any = null;
  let qtyBounds: any = null;
  let skuPdfBounds: any = null;
  let qtyPdfBounds: any = null;

  const pageH = viewport.height;
  const skuHeader = items.find(i => (i.str || '').trim().toUpperCase() === 'SKU');
  const skuHeaderX = skuHeader ? skuHeader.transform[4] : -1;
  const skuHeaderY = skuHeader ? skuHeader.transform[5] : -1;

  const qtyHeader = items.find(i => (i.str || '').trim().toUpperCase() === 'QTY');
  const qtyHeaderX = qtyHeader ? qtyHeader.transform[4] : -1;
  const qtyHeaderY = qtyHeader ? qtyHeader.transform[5] : -1;

  for (let i = 0; i < items.length; i++) {
    const text = items[i].str?.trim();
    if (!text) continue;

    const upperText = text.toUpperCase();
    if (upperText.includes('VALMO')) courierName = 'Valmo';
    else if (upperText.includes('DELHIVERY')) courierName = 'Delhivery';
    else if (upperText.includes('ECOM') && upperText.includes('EXPRESS')) courierName = 'Ecom Express';
    else if (upperText.includes('XPRESSBEES') || upperText.includes('XPRESS BEES')) courierName = 'Xpressbees';
    else if (upperText.includes('SHADOWFAX')) courierName = 'Shadowfax';
    else if (upperText.includes('EKART')) courierName = 'Ekart';
    else if (upperText.includes('BLUEDART') || upperText.includes('BLUE DART')) courierName = 'Blue Dart';
    else if (upperText.includes('DTDC')) courierName = 'DTDC';

    const soldByPattern = /Sold\s+by\s*:?/i;
    if (soldByPattern.test(text)) {
      for (let j = i + 1; j < Math.min(i + 4, items.length); j++) {
        const nextText = items[j].str?.trim();
        if (nextText && nextText.length > 3 && !nextText.match(/^[:\-,\.]+$/)) {
          sellerName = nextText.replace(/\s+/g, ' ').trim().toUpperCase();
          break;
        }
      }
    }

    const qtyMatch = text.match(/Qty[:\s]*([0-9]+)/i);
    if (qtyMatch) {
      qty = parseInt(qtyMatch[1], 10);
    } else if (qtyHeader) {
      const isBelowQty = items[i].transform[5] < qtyHeaderY && items[i].transform[5] > qtyHeaderY - 40 && Math.abs(items[i].transform[4] - qtyHeaderX) < 30;
      if (isBelowQty && text.match(/^[0-9]+$/)) {
        qty = parseInt(text, 10);
        const item = items[i];
        qtyBounds = {
          x: (item.transform[4] - 5) * scale,
          y: pageH - (item.transform[5] + (item.height || 10) + 5) * scale,
          w: ((item.width || 10) + 10) * scale,
          h: ((item.height || 10) + 10) * scale
        };
        const [pdfLeft, pdfTop] = viewport.convertToPdfPoint(qtyBounds.x, qtyBounds.y);
        const [pdfRight, pdfBottom] = viewport.convertToPdfPoint(qtyBounds.x + qtyBounds.w, qtyBounds.y + qtyBounds.h);
        qtyPdfBounds = {
          x: Math.min(pdfLeft, pdfRight),
          y: Math.min(pdfTop, pdfBottom),
          w: Math.abs(pdfRight - pdfLeft),
          h: Math.abs(pdfBottom - pdfTop)
        };
      }
    }

    const pincodeMatch = text.match(/\b([0-9]{6})\b/);
    if (pincodeMatch && !pincode) pincode = pincodeMatch[1];

    const orderIdMatch = text.match(/\b([0-9]{15,}_[0-9]+)\b/);
    if (orderIdMatch && !orderId) orderId = orderIdMatch[1];

    const awbMatch = text.match(/\b([A-Z]{2}[0-9]{10,})\b/);
    if (awbMatch && !awb) awb = awbMatch[1];

    if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) && !customerName) {
      customerName = text;
    }

    // SKU Detection
    if (skuId === 'ZZZ_UNKNOWN' && skuHeader) {
      const isBelowSku = items[i].transform[5] < skuHeaderY && items[i].transform[5] > skuHeaderY - 40 && Math.abs(items[i].transform[4] - skuHeaderX) < 50;
      if (isBelowSku && text.length > 2) {
        skuId = text.toUpperCase();
        const item = items[i];
        const itemW = item.width || (text.length * 6);
        const itemH = item.height || 10;
        skuBounds = {
          x: (item.transform[4] - 2) * scale,
          y: pageH - (item.transform[5] + itemH + 2) * scale,
          w: (itemW + 4) * scale,
          h: (itemH + 4) * scale
        };
        const [pdfLeft, pdfTop] = viewport.convertToPdfPoint(skuBounds.x, skuBounds.y);
        const [pdfRight, pdfBottom] = viewport.convertToPdfPoint(skuBounds.x + skuBounds.w, skuBounds.y + skuBounds.h);
        skuPdfBounds = {
          x: Math.min(pdfLeft, pdfRight),
          y: Math.min(pdfTop, pdfBottom),
          w: Math.abs(pdfRight - pdfLeft),
          h: Math.abs(pdfBottom - pdfTop)
        };
      }
    }
  }

  return { courierName, sellerName, qty, pincode, orderId, awb, customerName, skuId, skuBounds, qtyBounds, skuPdfBounds, qtyPdfBounds };
}

async function renderPageCroppedToCanvas(page: PDFJS.PDFPageProxy, scale: number, cropBelowY: number | null): Promise<{ canvas: HTMLCanvasElement; minX: number; maxX: number; croppedHeight: number }> {
  const viewport = page.getViewport({ scale });
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = viewport.width;
  fullCanvas.height = viewport.height;
  const ctx = fullCanvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport, canvas: fullCanvas }).promise;
  if (cropBelowY === null) return { canvas: fullCanvas, minX: 0, maxX: viewport.width, croppedHeight: viewport.height };
  const cropCanvasY = Math.floor(viewport.height - cropBelowY * scale) + 5;
  const croppedHeight = Math.max(1, cropCanvasY);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = fullCanvas.width;
  tempCanvas.height = croppedHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(fullCanvas, 0, 0, fullCanvas.width, croppedHeight, 0, 0, fullCanvas.width, croppedHeight);

  // Auto-trim horizontal white space
  const pixels = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = pixels.data;
  let minX = tempCanvas.width, maxX = 0;

  for (let y = 0; y < tempCanvas.height; y++) {
    for (let x = 0; x < tempCanvas.width; x++) {
      const idx = (y * tempCanvas.width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 240 || g < 240 || b < 240) { // Not white
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }

  const trimPadding = 5;
  minX = Math.max(0, minX - trimPadding);
  maxX = Math.min(tempCanvas.width, maxX + trimPadding);
  const trimmedWidth = maxX - minX;

  if (trimmedWidth <= 0) return { canvas: tempCanvas, minX: 0, maxX: tempCanvas.width, croppedHeight };

  const out = document.createElement('canvas');
  out.width = trimmedWidth;
  out.height = croppedHeight;
  out.getContext('2d')!.drawImage(tempCanvas, minX, 0, trimmedWidth, croppedHeight, 0, 0, trimmedWidth, croppedHeight);
  return { canvas: out, minX, maxX, croppedHeight };
}

async function canvasToJpegBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  return new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
}

export default function MeeshoCropper({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{ courier: string; url: string }[]>([]);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [labelCount, setLabelCount] = useState(0);
  const [sortBySeller, setSortBySeller] = useState(false);
  const [sortByCourier, setSortByCourier] = useState(false);
  const [sortBySku, setSortBySku] = useState(false);
  const [sortByQty, setSortByQty] = useState(false);
  const [highlightSku, setHighlightSku] = useState(false);
  const [multiOrderAtBottom, setMultiOrderAtBottom] = useState(false);
  const [splitByCourier, setSplitByCourier] = useState(false);
  const [exportMetadata, setExportMetadata] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: LabelFile[] = Array.from(newFiles)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ id: crypto.randomUUID(), name: f.name, file: f, status: 'pending' }));
    setFiles(prev => [...prev, ...entries]);
    setDone(false);
    setPdfUrl(null);
  };

  const removeFile = (fileId: string) => setFiles(prev => prev.filter(f => f.id !== fileId));

  const processAll = async () => {
    if (!files.length) return;
    setProcessing(true);
    setDone(false);
    const outDoc = await PDFDocument.create();
    const allPages: PageData[] = [];

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buf);
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
        const pdf = await pdfjsLib.getDocument(buf).promise;
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 2 });
          const totalY = await findTotalLineY(page);
          const metadata = await extractPageMetadata(page, viewport, 2);
          const { canvas, minX, maxX, croppedHeight } = await renderPageCroppedToCanvas(page, 2, totalY);
          
          const [pdfLeft, pdfTop] = viewport.convertToPdfPoint(minX, 0);
          const [pdfRight, pdfBottom] = viewport.convertToPdfPoint(maxX, croppedHeight);
          const pdfBox = {
            left: Math.min(pdfLeft, pdfRight),
            bottom: Math.min(pdfTop, pdfBottom),
            right: Math.max(pdfLeft, pdfRight),
            top: Math.max(pdfTop, pdfBottom)
          };
          
          if (highlightSku && metadata.skuBounds) {
            const ctx = canvas.getContext('2d')!;
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 3;
            ctx.strokeRect(metadata.skuBounds.x, metadata.skuBounds.y, metadata.skuBounds.w, metadata.skuBounds.h);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
            ctx.fillRect(metadata.skuBounds.x, metadata.skuBounds.y, metadata.skuBounds.w, metadata.skuBounds.h);
          }

          if (highlightSku && metadata.qty > 1 && metadata.qtyBounds) {
            const ctx = canvas.getContext('2d')!;
            ctx.strokeStyle = '#ef4444'; // Red for bulk
            ctx.lineWidth = 4;
            ctx.strokeRect(metadata.qtyBounds.x, metadata.qtyBounds.y, metadata.qtyBounds.w, metadata.qtyBounds.h);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.fillRect(metadata.qtyBounds.x, metadata.qtyBounds.y, metadata.qtyBounds.w, metadata.qtyBounds.h);
            
            // Add "BULK" tag
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`QTY: ${metadata.qty} !!`, metadata.qtyBounds.x, metadata.qtyBounds.y - 10);
          }

          allPages.push({ canvas, pdfPage: srcDoc.getPages()[p - 1], pdfBox, ...metadata });
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    const customerMap = new Map<string, number>();
    const duplicateIndices = new Set<number>();
    allPages.forEach((page, index) => {
      const key = `${page.sellerName}_${page.pincode}`;
      if (customerMap.has(key)) {
        duplicateIndices.add(index);
      } else {
        customerMap.set(key, index);
      }
    });

    if (sortBySeller || sortByCourier || sortBySku || sortByQty || multiOrderAtBottom) {
      allPages.sort((a, b) => {
        const aIndex = allPages.indexOf(a);
        const bIndex = allPages.indexOf(b);
        const aIsDuplicate = duplicateIndices.has(aIndex);
        const bIsDuplicate = duplicateIndices.has(bIndex);

        if (multiOrderAtBottom) {
          const aIsMulti = a.qty > 1 || aIsDuplicate;
          const bIsMulti = b.qty > 1 || bIsDuplicate;
          if (aIsMulti && !bIsMulti) return 1;
          if (!aIsMulti && bIsMulti) return -1;
        }

        if (sortByQty && a.qty !== b.qty) {
          return a.qty - b.qty;
        }

        if (sortBySku && a.skuId !== b.skuId) {
          return a.skuId.localeCompare(b.skuId);
        }

        if (sortByCourier && a.courierName !== b.courierName) {
          return a.courierName.localeCompare(b.courierName);
        }

        if (sortBySeller && a.sellerName !== b.sellerName) {
          return a.sellerName.localeCompare(b.sellerName);
        }

        return 0;
      });
    }

    if (splitByCourier) {
      const courierGroups = new Map<string, PageData[]>();
      allPages.forEach(page => {
        if (!courierGroups.has(page.courierName)) {
          courierGroups.set(page.courierName, []);
        }
        courierGroups.get(page.courierName)!.push(page);
      });

      const urls: { courier: string; url: string }[] = [];
      for (const [courier, pages] of courierGroups) {
        const courierDoc = await PDFDocument.create();
        for (const pageData of pages) {
          if (!pageData.pdfPage || !pageData.pdfBox) continue;
          
          const embedded = await courierDoc.embedPage(pageData.pdfPage, pageData.pdfBox);
          const A4W = 595.28;
          const scale = A4W / embedded.width;
          const pageH = embedded.height * scale;
          const outPage = courierDoc.addPage([A4W, pageH]);
          outPage.drawPage(embedded, { x: 0, y: 0, width: A4W, height: pageH });
          
          if (highlightSku && pageData.skuPdfBounds) {
            outPage.drawRectangle({
              x: (pageData.skuPdfBounds.x - pageData.pdfBox.left) * scale,
              y: (pageData.skuPdfBounds.y - pageData.pdfBox.bottom) * scale,
              width: pageData.skuPdfBounds.w * scale,
              height: pageData.skuPdfBounds.h * scale,
              borderColor: rgb(0.145, 0.388, 0.921),
              borderWidth: 3,
              color: rgb(0.145, 0.388, 0.921),
              opacity: 0.2
            });
          }

          if (highlightSku && pageData.qty > 1 && pageData.qtyPdfBounds) {
            outPage.drawRectangle({
              x: (pageData.qtyPdfBounds.x - pageData.pdfBox.left) * scale,
              y: (pageData.qtyPdfBounds.y - pageData.pdfBox.bottom) * scale,
              width: pageData.qtyPdfBounds.w * scale,
              height: pageData.qtyPdfBounds.h * scale,
              borderColor: rgb(0.937, 0.266, 0.266),
              borderWidth: 4,
              color: rgb(0.937, 0.266, 0.266),
              opacity: 0.15
            });
          }
        }
        const pdfBytes = await courierDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        urls.push({ courier, url: URL.createObjectURL(blob) });
      }
      setPdfUrls(urls);
    } else {
      for (const pageData of allPages) {
        if (!pageData.pdfPage || !pageData.pdfBox) continue;
        
        const embedded = await outDoc.embedPage(pageData.pdfPage, pageData.pdfBox);
        const A4W = 595.28;
        const scale = A4W / embedded.width;
        const pageH = embedded.height * scale;
        const outPage = outDoc.addPage([A4W, pageH]);
        outPage.drawPage(embedded, { x: 0, y: 0, width: A4W, height: pageH });
        
        if (highlightSku && pageData.skuPdfBounds) {
          outPage.drawRectangle({
            x: (pageData.skuPdfBounds.x - pageData.pdfBox.left) * scale,
            y: (pageData.skuPdfBounds.y - pageData.pdfBox.bottom) * scale,
            width: pageData.skuPdfBounds.w * scale,
            height: pageData.skuPdfBounds.h * scale,
            borderColor: rgb(0.145, 0.388, 0.921),
            borderWidth: 3,
            color: rgb(0.145, 0.388, 0.921),
            opacity: 0.2
          });
        }

        if (highlightSku && pageData.qty > 1 && pageData.qtyPdfBounds) {
          outPage.drawRectangle({
            x: (pageData.qtyPdfBounds.x - pageData.pdfBox.left) * scale,
            y: (pageData.qtyPdfBounds.y - pageData.pdfBox.bottom) * scale,
            width: pageData.qtyPdfBounds.w * scale,
            height: pageData.qtyPdfBounds.h * scale,
            borderColor: rgb(0.937, 0.266, 0.266),
            borderWidth: 4,
            color: rgb(0.937, 0.266, 0.266),
            opacity: 0.15
          });
        }
      }
      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    }

    if (exportMetadata) {
      const csvRows = [['Order ID', 'Customer Name', 'AWB/Tracking', 'Courier', 'Seller', 'Pincode', 'Qty']];
      allPages.forEach(page => {
        csvRows.push([page.orderId, page.customerName, page.awb, page.courierName, page.sellerName, page.pincode, page.qty.toString()]);
      });
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      setCsvUrl(URL.createObjectURL(csvBlob));
    }
    setLabelCount(allPages.length);
    setProcessing(false);
    setDone(true);
  };

  const reset = () => { setFiles([]); setDone(false); setPdfUrl(null); setPdfUrls([]); setCsvUrl(null); setLabelCount(0); };

  const ToolContent = () => (
    <>
      <div className="space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-[#f26522] text-white shadow-lg mb-4">
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Meesho Label with Invoice Cropper</h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Auto-crop Meesho shipping labels — removes the invoice section below "Total", keeps the shipping label.</p>
        
        {/* Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
          {[
            { step: "1", title: "Upload", desc: "Select labels" },
            { step: "2", title: "Sort", desc: "By SKU ID" },
            { step: "3", title: "Highlight", desc: "Check SKU" },
            { step: "4", title: "Print", desc: "Download PDF" }
          ].map((s, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-[#f26522] text-white text-[10px] font-black flex items-center justify-center mb-1 mx-auto">{s.step}</div>
              <div className="text-[11px] font-black text-slate-900 dark:text-white">{s.title}</div>
              <div className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {!done ? (
        <div className="space-y-6">
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-[#f26522] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
            <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              <div className="space-y-4 pointer-events-none">
                <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-[#f26522] group-hover:scale-110 transition-transform"><Upload size={32} className="sm:w-12 sm:h-12" /></div>
                <div className="text-lg sm:text-lg sm:text-xl font-black text-slate-800 dark:text-white">Drop Meesho Label PDFs here</div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">or click to browse · Multiple PDFs supported</p>
              </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-left">
                {files.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-[#f26522] shrink-0"><FileText size={16} /></div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{(f.file.size / 1024).toFixed(0)} KB{f.pageCount ? ` · ${f.pageCount} page${f.pageCount > 1 ? 's' : ''}` : ''}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {f.status === 'pending' && <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>}
                      {f.status === 'processing' && <Loader2 size={16} className="animate-spin text-[#f26522]" />}
                      {f.status === 'done' && <CheckCircle2 size={16} className="text-green-500" />}
                      {f.status === 'error' && <X size={16} className="text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={processAll} disabled={processing} className="flex-1 py-4 sm:py-5 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-lg sm:text-lg sm:text-xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-60 transition-all">
                  {processing ? <Loader2 className="animate-spin" size={24} /> : <ShoppingBag size={24} />}
                  {processing ? 'Processing Labels…' : `Crop ${files.length} PDF${files.length > 1 ? 's' : ''}`}
                </button>
                <button onClick={reset} disabled={processing} className="px-5 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-2xl font-bold transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        (pdfUrl || pdfUrls.length > 0) && (
          <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700">
            <div className="p-10 sm:p-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block"><CheckCircle2 size={72} /></div>
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{labelCount} Label{labelCount !== 1 ? 's' : ''} Ready!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Invoice section removed. Clean labels packed into PDF{pdfUrls.length > 1 ? 's' : ''}.</p>
            </div>
            <div className="space-y-4">
              {pdfUrl && <a href={pdfUrl} download="meesho_labels.pdf" className="block py-4 sm:py-5 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3"><Download size={24} /> Download PDF</a>}
              {pdfUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pdfUrls.map(({ courier, url }) => (
                    <a key={courier} href={url} download={`${courier}_Labels.pdf`} className="py-4 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-lg font-black shadow-xl flex items-center justify-center gap-2"><Download size={20} /> {courier} Labels</a>
                  ))}
                </div>
              )}
              {csvUrl && <a href={csvUrl} download="meesho_labels_metadata.csv" className="block py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-black shadow-xl flex items-center justify-center gap-3"><Download size={20} /> Download CSV</a>}
              <button onClick={reset} className="w-full px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">Crop More</button>
            </div>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      {files.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 sm:gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700"
            >
              <span className="flex items-center gap-2"><FileText size={20} className="text-[#f26522]" /> Settings (સેટિંગ્સ)</span>
              <Loader2 className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
            </button>
            <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
              <h3 className="font-outfit hidden lg:block text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Settings</h3>
              <div className="space-y-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortByQty} onChange={(e) => setSortByQty(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-outfit text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort by Quantity</span>
                    <span className="font-outfit text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none">Qty મુજબ સોર્ટ કરો</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortBySku} onChange={(e) => setSortBySku(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-outfit text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort by SKU ID</span>
                    <span className="font-outfit text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none">Group identical items</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={highlightSku} onChange={(e) => setHighlightSku(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-outfit text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Highlight SKU ID</span>
                    <span className="font-outfit text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none">Visible blue boxes</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortBySeller} onChange={(e) => setSortBySeller(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort by <span className="font-black">Sold By</span></span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sortByCourier} onChange={(e) => setSortByCourier(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Sort Courier wise</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={multiOrderAtBottom} onChange={(e) => setMultiOrderAtBottom(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Multi order at bottom</span>
                </label>
                <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={splitByCourier} onChange={(e) => setSplitByCourier(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Split by Courier</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={exportMetadata} onChange={(e) => setExportMetadata(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#f26522] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#f26522] cursor-pointer flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">Export Metadata CSV</span>
                </label>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">
            <ToolContent />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">
            <ToolContent />
          </div>
        </div>
      )}
    </div>
  );
}
