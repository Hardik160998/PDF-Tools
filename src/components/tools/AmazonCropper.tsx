"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText, AlertCircle, Settings, ChevronDown } from 'lucide-react';

interface LabelFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
}

interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ── Amazon Label Detection Logic ─────────────────────────────────────────────
async function detectAmazonLabels(
  page: any,
  scale: number
): Promise<{ labels: Array<{ bounds: CropBounds; awb: string; orderId: string; itemType: string }>; isInvoice: boolean }> {
  const viewport = page.getViewport({ scale });
  const content = await page.getTextContent();
  const items = content.items as any[];
  const pageH = viewport.height;
  const pageW = viewport.width;

  const text = items.map(i => i.str).join(' ');
  const upText = text.toUpperCase();

  // 1. Detect if it's an invoice-only page
  const invoiceKeywords = ["TAX INVOICE", "BILL OF SUPPLY", "UNIT PRICE", "AMOUNT IN WORDS", "AUTHORIZED SIGNATORY", "TRIPLICATE FOR SUPPLIER"];
  const isInvoicePage = invoiceKeywords.some(k => upText.includes(k));

  // 2. Identify Labels (AWB is the primary marker)
  const awbItems = items.filter(i => i.str.toUpperCase().includes('AWB'));

  // If it's an invoice page but NO AWB is found, skip it
  if (isInvoicePage && awbItems.length === 0) return { labels: [], isInvoice: true };

  const labels: Array<{ bounds: CropBounds; awb: string; orderId: string; itemType: string }> = [];

  for (const awbItem of awbItems) {
    const awbText = awbItem.str.match(/AWB\s*([0-9]+)/i)?.[1] || '';

    // Find anchors relative to this AWB
    const x = awbItem.transform[4];
    const y = awbItem.transform[5];

    // Look for items within a reasonable vertical distance from this AWB
    const relatedItems = items.filter(i => Math.abs(i.transform[5] - y) < 700 && Math.abs(i.transform[4] - x) < 300);
    const relatedText = relatedItems.map(i => i.str).join(' ');

    const orderIdMatch = relatedText.match(/Order Id[:\s]*([0-9-]{10,25})/i);
    const orderId = orderIdMatch ? orderIdMatch[1] : '';

    // NEW LOGIC: Determine vertical bounds dynamically
    // topPdfY: Try to capture the top of the page if it's a label page
    let topPdfY = viewport.height / scale; // Start with full page height in PDF points

    // botPdfY: If we find invoice keywords, we cut there. Otherwise, we keep until the bottom.
    const invoiceHeaders = items.filter(i => invoiceKeywords.some(k => i.str.toUpperCase().includes(k)));
    let botPdfY = 0; // Default to bottom of page (no cropping at bottom)

    if (invoiceHeaders.length > 0) {
      // Find the highest invoice header (the one closest to the label)
      const highestInvoiceY = Math.max(...invoiceHeaders.map(h => h.transform[5]));
      // Cut 20 points above the invoice header
      botPdfY = highestInvoiceY + 10;
    }

    // Refine top: If AWB is very low, we might not need the whole top, but usually labels are at the top.
    // For Amazon, we'll keep the top at page height unless there's a reason not to.

    const bounds: CropBounds = {
      x: 0, // Keep full width
      y: 0,
      width: viewport.width,
      height: (topPdfY - botPdfY) * scale
    };

    // Calculate Y from top for the canvas crop
    const canvasY = Math.max(0, viewport.height - topPdfY * scale);

    // Extract Item Type (SKU) - Improved Robustness
    const itemTypeHeader = items.find(i => i.str.toUpperCase().includes('ITEM TYPE'));
    let itemType = 'Unknown';
    if (itemTypeHeader) {
      const headerX = itemTypeHeader.transform[4];
      const headerY = itemTypeHeader.transform[5];

      // Strategy 1: Find item just below this header (within a 60pt vertical range)
      let itemBelow = items.find(i =>
        i.str.trim() !== '' &&
        i.str !== itemTypeHeader.str &&
        Math.abs(i.transform[4] - headerX) < 80 &&
        (headerY - i.transform[5]) > 2 && (headerY - i.transform[5]) < 60
      );

      // Strategy 2: If not found, look for text in the same "cell" area
      if (!itemBelow) {
        itemBelow = items.find(i =>
          i.str.trim() !== '' &&
          i.str !== itemTypeHeader.str &&
          Math.abs(i.transform[4] - headerX) < 120 &&
          Math.abs(i.transform[5] - headerY) < 30
        );
      }

      if (itemBelow) {
        itemType = itemBelow.str.trim();
        // Clean common prefixes if any
        itemType = itemType.replace(/^[:\s-]+/, '');
      }
    }

    labels.push({
      bounds: { ...bounds, y: canvasY },
      awb: awbText,
      orderId,
      itemType
    });
  }

  // Fallback for label-only pages (no AWB found but not an invoice)
  if (labels.length === 0 && !isInvoicePage) {
    labels.push({
      bounds: { x: 0, y: 0, width: pageW, height: pageH },
      awb: 'N/A',
      orderId: 'N/A',
      itemType: 'Unknown'
    });
  }

  return { labels, isInvoice: false };
}

export default function AmazonCropper({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [labelCount, setLabelCount] = useState(0);
  const [skipEvenPages, setSkipEvenPages] = useState(false);
  const [sortByAwb, setSortByAwb] = useState(false);
  const [sortBySku, setSortBySku] = useState(false);
  const [useA4Grid, setUseA4Grid] = useState(false);
  const [layout] = useState<'4'>('4');
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    const entries: LabelFile[] = Array.from(fl)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ id: crypto.randomUUID(), name: f.name, file: f, status: 'pending' }));
    setFiles(prev => [...prev, ...entries]);
    setDone(false); setPdfUrl(null);
  };

  const removeFile = (fid: string) => setFiles(prev => prev.filter(f => f.id !== fid));

  const processAll = async () => {
    if (!files.length) return;
    setProcessing(true); setDone(false);

    const { PDFDocument } = await import('pdf-lib');
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

    const outDoc = await PDFDocument.create();
    let totalProcessed = 0;
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    let currentPage: any = null;
    let labelIdxOnPage = 0;

    const allLabels: Array<{ pageIdx: number; srcDoc: any; data: any }> = [];

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const pdfJsDoc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        const srcDoc = await PDFDocument.load(buf);

        for (let p = 1; p <= pdfJsDoc.numPages; p++) {
          if (skipEvenPages && p % 2 === 0) continue;
          const pageJs = await pdfJsDoc.getPage(p);
          const { labels, isInvoice } = await detectAmazonLabels(pageJs, 1);
          if (labels.length > 0 && !isInvoice) {
            labels.forEach(l => allLabels.push({ pageIdx: p - 1, srcDoc, data: l }));
          }
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdfJsDoc.numPages } : f));
      } catch (err) {
        console.error(err);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }

    // Apply Sorting (Multi-level if both enabled)
    allLabels.sort((a, b) => {
      // 1. Primary Sort: Item Type (SKU)
      if (sortBySku) {
        const skuCmp = a.data.itemType.localeCompare(b.data.itemType);
        if (skuCmp !== 0) return skuCmp;
      }
      // 2. Secondary Sort: AWB Number
      if (sortByAwb) {
        return a.data.awb.localeCompare(b.data.awb, undefined, { numeric: true });
      }
      return 0;
    });

    // Process sorted labels into output
    for (const labelObj of allLabels) {
      const { data, srcDoc, pageIdx } = labelObj;
      const { bounds } = data;
      // Calculate PDF coordinates (pdf-lib uses bottom-left origin)
      const srcPage = srcDoc.getPage(pageIdx);
      const srcPageH = srcPage.getHeight();
      
      // PageBoundingBox for embedding: { left, bottom, right, top } in bottom-left coordinates
      const pdfCropBox = {
        left: bounds.x,
        bottom: srcPageH - (bounds.y + bounds.height),
        right: bounds.x + bounds.width,
        top: srcPageH - bounds.y
      };

      // Embed the SPECIFIC part of the page (the label)
      const embeddedPage = await outDoc.embedPage(srcPage, pdfCropBox);

      if (useA4Grid) {
        const maxLabels = 4;
        if (!currentPage || labelIdxOnPage >= maxLabels) {
          currentPage = outDoc.addPage([A4_WIDTH, A4_HEIGHT]);
          labelIdxOnPage = 0;
        }

        let targetW = (A4_WIDTH / 2) - 30;
        let targetH = (A4_HEIGHT / 2) - 30;
        let targetX = (labelIdxOnPage % 2 === 0) ? 20 : (A4_WIDTH / 2) + 10;
        let targetY = (labelIdxOnPage < 2) ? (A4_HEIGHT / 2) + 15 : 15;

        const scaleX = targetW / bounds.width;
        const scaleY = targetH / bounds.height;
        const finalScale = Math.min(scaleX, scaleY, 1.2);

        const drawW = bounds.width * finalScale;
        const drawH = bounds.height * finalScale;
        const offsetX = targetX + (targetW - drawW) / 2;
        const offsetY = targetY + (targetH - drawH) / 2;

        currentPage.drawPage(embeddedPage, {
          x: offsetX, y: offsetY, width: drawW, height: drawH,
        });

        labelIdxOnPage++;
      } else {
        // Standard single page output - size of the page matches the label
        const labelPage = outDoc.addPage([bounds.width, bounds.height]);
        labelPage.drawPage(embeddedPage, {
          x: 0, y: 0, width: bounds.width, height: bounds.height,
        });
      }
      totalProcessed++;
    }

    const pdfBytes = await outDoc.save();
    setPdfUrl(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    setLabelCount(totalProcessed);
    setProcessing(false); setDone(true);
  };

  const reset = () => { setFiles([]); setDone(false); setPdfUrl(null); setLabelCount(0); };
  const ACCENT = '#FF9900';

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-[280px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight text-left">Settings</h3>
            <div className="space-y-6 text-left">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={skipEvenPages} onChange={e => setSkipEvenPages(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-slate-300 text-[#FF9900]" style={{ accentColor: ACCENT }} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#FF9900]">Remove Invoice</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Auto-clear invoices (2, 4, 6...)</span>
                </div>
              </label>

              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort Batch By</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={sortByAwb}
                      onChange={() => setSortByAwb(!sortByAwb)}
                      className="w-4 h-4 rounded border-slate-300 text-[#FF9900]"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className={`text-xs font-bold transition-colors ${sortByAwb ? 'text-[#FF9900]' : 'text-slate-500 group-hover:text-slate-700'}`}>AWB Number</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={sortBySku}
                      onChange={() => setSortBySku(!sortBySku)}
                      className="w-4 h-4 rounded border-slate-300 text-[#FF9900]"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className={`text-xs font-bold transition-colors ${sortBySku ? 'text-[#FF9900]' : 'text-slate-500 group-hover:text-slate-700'}`}>Item Type (SKU)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Layout Settings</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={useA4Grid}
                    onChange={() => setUseA4Grid(!useA4Grid)}
                    className="w-4 h-4 rounded border-slate-300 text-[#FF9900]"
                    style={{ accentColor: ACCENT }}
                  />
                  <span className={`text-xs font-bold transition-colors ${useA4Grid ? 'text-[#FF9900]' : 'text-slate-500 group-hover:text-slate-700'}`}>4 Labels Per A4 (Grid)</span>
                </label>
                <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-tighter mt-1">
                  {useA4Grid ? 'Optimal 2x2 Warehouse Grid enabled' : 'Single label per page output'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-700 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Info</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">You can print 4 labels on a single A4 sheet. This is the standard warehouse setting for efficiency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Engine UI */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT }}><ShoppingBag size={32} /></div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">Amazon Extraction Engine</h2>
            <p className="text-slate-500 font-medium tracking-tight">Shipping Labels Only. Invoice Pages Removed.</p>
          </div>

          {!done ? (
            <div className="space-y-6 text-center">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-10 sm:p-16 hover:border-[#FF9900] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block mb-4" style={{ color: ACCENT }}><Upload size={32} /></div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Upload Amazon PDFs</div>
                <p className="text-slate-400 text-sm mt-4 italic font-bold tracking-tight">Even invoices automatically cleared.</p>
              </div>
              {files.length > 0 && (
                <div className="space-y-4">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="flex items-center gap-3 font-bold text-slate-600 dark:text-slate-300 text-xs truncate max-w-[200px]"><FileText size={16} />{f.name}</div>
                      {f.status === 'processing' ? <Loader2 size={16} className="animate-spin text-[#FF9900]" /> : <button onClick={() => removeFile(f.id)} className="text-slate-300 hover:text-red-500"><X size={16} /></button>}
                    </div>
                  ))}
                  <button onClick={processAll} disabled={processing} className="w-full py-5 text-white rounded-2xl text-2xl font-black shadow-xl hover:scale-[1.02] transition-all uppercase tracking-tighter" style={{ background: ACCENT }}>{processing ? 'Clearing Invoices...' : 'Extract Labels Only'}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500 text-center">
              <div className="p-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block"><CheckCircle2 size={64} /></div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{labelCount} Labels Extracted</h3>
              <p className="text-slate-500 font-medium -mt-4 italic font-bold text-sm leading-relaxed text-center">
                Shipping labels preserved. Invoice pages removed.
              </p>
              <a href={pdfUrl!} download="amazon_labels_ready.pdf" className="block py-5 text-white rounded-2xl text-2xl font-black shadow-xl hover:scale-[1.02] transition-all uppercase tracking-tighter" style={{ background: ACCENT }}><Download size={24} className="inline mr-2" /> Download Final PDF</a>
              <button onClick={reset} className="w-full py-4 font-black text-slate-400 uppercase tracking-widest text-xs hover:text-[#FF9900]">Process New Batch</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
