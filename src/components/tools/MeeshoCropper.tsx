"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText, Image, Settings, ChevronDown, ChevronUp, Lock, Smartphone, Rocket, Zap, Shield, Sparkles, Plus } from 'lucide-react';
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
 const { remaining, isGuest, isPremium, deductCredit } = useCredits();
 const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
 const [files, setFiles] = useState<LabelFile[]>([]);
 const [processing, setProcessing] = useState(false);
 const [done, setDone] = useState(false);
 const [pdfUrl, setPdfUrl] = useState<string | null>(null);
 const [pdfUrls, setPdfUrls] = useState<{ courier: string; url: string }[]>([]);
 const [csvUrl, setCsvUrl] = useState<string | null>(null);
 const [labelCount, setLabelCount] = useState(0);

 const handleDownloadClick = (url: string | null, filename: string) => {
 if (!url) return;

 if (!isPremium && remaining <= 0) {
 setOutOfCreditsOpen(true);
 return;
 }

 deductCredit('meesho-cropper');

 const link = document.createElement('a');
 link.href = url;
 link.download = filename;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const handleCsvDownloadClick = (url: string | null) => {
 if (!url) return;
 const link = document.createElement("a");
 link.href = url;
 link.download = "meesho_labels_metadata.csv";
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };
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
    
    if (window.innerWidth < 1024) {
      setShowSettings(true);
    }
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

 const ACCENT = '#f43397'; // Meesho Pink

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
             <div className="flex items-center gap-2" style={{ color: ACCENT }}>
               <Settings size={20} />
               <h3 className="text-[15px] font-black text-[#1e293b] dark:text-white tracking-widest uppercase">Settings</h3>
             </div>
             {showSettings ? (
               <ChevronUp size={20} style={{ color: ACCENT }} className="lg:hidden" />
             ) : (
               <ChevronDown size={20} style={{ color: ACCENT }} className="lg:hidden" />
             )}
           </div>

           <div className={`pt-5 px-5 pb-4 space-y-5 ${showSettings ? 'block' : 'hidden lg:block'}`}>
             {/* EXTRACTION & EXPORT OPTIONS */}
             <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Extraction & Export</h4>

               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg" style={{ color: ACCENT }}><FileText size={16} /></div>
                   <div>
                     <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">Split by Courier</p>
                     <p className="text-[10px] text-slate-400">Separate PDFs for each courier</p>
                   </div>
                 </div>
                 <button onClick={() => setSplitByCourier(!splitByCourier)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${splitByCourier ? 'bg-[#f43397]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${splitByCourier ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                 </button>
               </div>

               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg" style={{ color: ACCENT }}><Image size={16} /></div>
                   <div>
                     <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">Export Metadata</p>
                     <p className="text-[10px] text-slate-400">Download CSV details</p>
                   </div>
                 </div>
                 <button onClick={() => setExportMetadata(!exportMetadata)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${exportMetadata ? 'bg-[#f43397]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${exportMetadata ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                 </button>
               </div>
               
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg" style={{ color: ACCENT }}><Zap size={16} /></div>
                   <div>
                     <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">Highlight SKU ID</p>
                     <p className="text-[10px] text-slate-400">Visible blue boxes on labels</p>
                   </div>
                 </div>
                 <button onClick={() => setHighlightSku(!highlightSku)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${highlightSku ? 'bg-[#f43397]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highlightSku ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                 </button>
               </div>
             </div>

             {/* SORT OPTIONS */}
             <div className="space-y-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sort Orders</h4>
                  <span className="text-[9px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Multi-select</span>
                </div>
               
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setSortByQty(!sortByQty)} className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-lg border-2 ${sortByQty ? 'border-[#f43397] text-[#f43397] bg-pink-50 dark:bg-pink-500/10' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   By Quantity
                 </button>
                 <button onClick={() => setSortBySku(!sortBySku)} className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-lg border-2 ${sortBySku ? 'border-[#f43397] text-[#f43397] bg-pink-50 dark:bg-pink-500/10' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   By SKU ID
                 </button>
                 <button onClick={() => setSortBySeller(!sortBySeller)} className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-lg border-2 ${sortBySeller ? 'border-[#f43397] text-[#f43397] bg-pink-50 dark:bg-pink-500/10' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   By Seller
                 </button>
                 <button onClick={() => setSortByCourier(!sortByCourier)} className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-lg border-2 ${sortByCourier ? 'border-[#f43397] text-[#f43397] bg-pink-50 dark:bg-pink-500/10' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   By Courier
                 </button>
               </div>
               <div className="pt-2">
                  <button onClick={() => setMultiOrderAtBottom(!multiOrderAtBottom)} className={`w-full py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-lg border-2 ${multiOrderAtBottom ? 'border-[#f43397] text-[#f43397] bg-pink-50 dark:bg-pink-500/10' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   Multi-order at Bottom
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       <div className="flex-1 w-full space-y-4 sm:space-y-6">
         <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden w-full scroll-mt-6">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

           {!done ? (
             <>
               <div className="relative text-center space-y-4 mb-6">
                 <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT }}>
                   <ShoppingBag size={32} />
                 </div>
                 <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                   Meesho Label Cropper
                 </h2>
                 <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
                   Auto-crop Meesho shipping labels — removes the invoice section below "Total", keeps the shipping label.
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
                      }}>
                      <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />

                      {/* Label Preview Image with Upload Badge */}
                      <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-32 h-40 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-pink-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                            <ShoppingBag size={48} className="opacity-20" style={{ color: ACCENT }} />
                          </div>
                          <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm" style={{ background: ACCENT }}>PDF</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT }}>
                          <Upload size={20} strokeWidth={3} />
                        </div>
                        <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                        <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                        <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                        Drag &amp; drop Meesho PDFs here
                      </h3>
                      <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                        or click to <span style={{ color: ACCENT }}>browse</span>
                      </p>
                      <p className="text-sm text-slate-400 font-medium mb-8 text-center">Supports multiple PDF files</p>

                      <div className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT }}>
                        <Plus size={20} /> SELECT PDF FILES
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-4 mb-6">
                      <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Selected Files</h3>
                        <button onClick={() => inputRef.current?.click()} className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>+ Add More</button>
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
                        <button onClick={processAll} disabled={processing} className="w-full py-4 text-white rounded-xl text-lg font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3" style={{ background: ACCENT }}>
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
             <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 text-center w-full max-w-lg mx-auto">
               <div className="p-8 sm:p-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 shadow-inner relative">
                 <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                 <CheckCircle2 size={64} className="relative z-10" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-3xl sm:text-4xl font-black text-[#1e293b] dark:text-white uppercase tracking-tighter">{labelCount} Labels Extracted</h3>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed text-center">
                   All shipping labels preserved. Invoice pages successfully removed.
                 </p>
               </div>
               <div className="w-full space-y-4">
                 {pdfUrl && (
                   <button onClick={() => handleDownloadClick(pdfUrl, "meesho_labels.pdf")} className="w-full py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest text-center flex items-center justify-center gap-2" style={{ background: ACCENT }}>
                     <Download size={24} /> Download Final PDF
                   </button>
                 )}
                 {pdfUrls.length > 0 && (
                   <div className="grid grid-cols-2 gap-4">
                     {pdfUrls.map(({ courier, url }) => (
                       <button key={courier} onClick={() => handleDownloadClick(url, `${courier}_Labels.pdf`)} className="py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors truncate px-2 text-center shadow-sm">
                         {courier} Labels
                       </button>
                     ))}
                   </div>
                 )}
                 {csvUrl && (
                   <button onClick={() => handleCsvDownloadClick(csvUrl)} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-black shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest transition-colors"><Download size={20} /> Download CSV</button>
                 )}
                 <button onClick={reset} className="w-full py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm hover:text-[#f43397] hover:bg-pink-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                   Process New Batch
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
