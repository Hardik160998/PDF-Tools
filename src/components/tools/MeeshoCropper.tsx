"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText } from 'lucide-react';
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
}

async function findTotalLineY(page: pdfjsLib.PDFPageProxy): Promise<number | null> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let totalY: number | null = null;
  for (const item of items) {
    if (item.str?.trim() === 'Total') totalY = item.transform[5];
  }
  return totalY;
}

async function extractPageMetadata(page: pdfjsLib.PDFPageProxy): Promise<{ courierName: string; sellerName: string; qty: number; pincode: string; orderId: string; awb: string; customerName: string }> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let courierName = 'Unknown';
  let sellerName = 'Unknown';
  let qty = 1;
  let pincode = '';
  let orderId = '';
  let awb = '';
  let customerName = '';

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
    if (qtyMatch) qty = parseInt(qtyMatch[1], 10);

    const pincodeMatch = text.match(/\b([0-9]{6})\b/);
    if (pincodeMatch && !pincode) pincode = pincodeMatch[1];

    const orderIdMatch = text.match(/\b([0-9]{15,}_[0-9]+)\b/);
    if (orderIdMatch && !orderId) orderId = orderIdMatch[1];

    const awbMatch = text.match(/\b([A-Z]{2}[0-9]{10,})\b/);
    if (awbMatch && !awb) awb = awbMatch[1];

    if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) && !customerName) {
      customerName = text;
    }
  }

  return { courierName, sellerName, qty, pincode, orderId, awb, customerName };
}

async function renderPageCroppedToCanvas(page: pdfjsLib.PDFPageProxy, scale: number, cropBelowY: number | null): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = viewport.width;
  fullCanvas.height = viewport.height;
  const ctx = fullCanvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport, canvas: fullCanvas }).promise;
  if (cropBelowY === null) return fullCanvas;
  const cropCanvasY = Math.floor(viewport.height - cropBelowY * scale) + 5;
  const croppedHeight = Math.max(1, cropCanvasY);
  const out = document.createElement('canvas');
  out.width = fullCanvas.width;
  out.height = croppedHeight;
  out.getContext('2d')!.drawImage(fullCanvas, 0, 0, fullCanvas.width, croppedHeight, 0, 0, fullCanvas.width, croppedHeight);
  return out;
}

async function canvasToJpegBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  return new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
}

export default function MeeshoCropLabel({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{ courier: string; url: string }[]>([]);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [labelCount, setLabelCount] = useState(0);
  const [sortBySeller, setSortBySeller] = useState(true);
  const [sortByCourier, setSortByCourier] = useState(true);
  const [multiOrderAtBottom, setMultiOrderAtBottom] = useState(true);
  const [splitByCourier, setSplitByCourier] = useState(false);
  const [exportMetadata, setExportMetadata] = useState(false);
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
        const pdf = await pdfjsLib.getDocument(buf).promise;
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const totalY = await findTotalLineY(page);
          const canvas = await renderPageCroppedToCanvas(page, 2, totalY);
          const metadata = await extractPageMetadata(page);
          allPages.push({ canvas, ...metadata });
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

    if (sortBySeller || sortByCourier || multiOrderAtBottom) {
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
          const jpegBytes = await canvasToJpegBytes(pageData.canvas);
          const img = await courierDoc.embedJpg(jpegBytes);
          const A4W = 595.28;
          const pageH = (img.height / img.width) * A4W;
          const outPage = courierDoc.addPage([A4W, pageH]);
          outPage.drawImage(img, { x: 0, y: 0, width: A4W, height: pageH });
        }
        const pdfBytes = await courierDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        urls.push({ courier, url: URL.createObjectURL(blob) });
      }
      setPdfUrls(urls);
    } else {
      for (const pageData of allPages) {
        const jpegBytes = await canvasToJpegBytes(pageData.canvas);
        const img = await outDoc.embedJpg(jpegBytes);
        const A4W = 595.28;
        const pageH = (img.height / img.width) * A4W;
        const outPage = outDoc.addPage([A4W, pageH]);
        outPage.drawImage(img, { x: 0, y: 0, width: A4W, height: pageH });
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
        <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#f26522] text-white shadow-lg">
          <ShoppingBag size={36} className="sm:w-10 sm:h-10" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Meesho Label with Invoice Cropper</h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Auto-remove the invoice section below "Total" from Meesho shipping label PDFs.</p>
      </div>

      {!done ? (
        <div className="space-y-6">
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-[#f26522] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
            <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            <div className="space-y-4 sm:space-y-6 pointer-events-none">
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-[#f26522] group-hover:scale-110 transition-transform"><Upload size={32} className="sm:w-12 sm:h-12" /></div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Drop Meesho Label PDFs here</div>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">or click to browse · Multiple PDFs supported</p>
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
                <button onClick={processAll} disabled={processing} className="flex-1 py-4 sm:py-5 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-60 transition-all">
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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {files.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-lg h-fit sticky top-4">
            <div className="p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">Settings</h3>
              <div className="space-y-4">
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
