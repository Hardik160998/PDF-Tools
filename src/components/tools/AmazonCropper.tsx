"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, CheckCircle2, ShoppingBag, Trash2, FileText, AlertCircle, Settings, ChevronDown, ChevronUp, Zap, Shield, Sparkles, Lock, Smartphone, Rocket } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import OutOfCreditsModal from '@/components/credits/OutOfCreditsModal';

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
 const { remaining, isGuest, isPremium, deductCredit } = useCredits();
 const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
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

 const handleDownloadClick = () => {
 if (!isPremium && remaining <= 0) {
 setOutOfCreditsOpen(true);
 return;
 }

 deductCredit('amazon-cropper');

 if (pdfUrl) {
 const link = document.createElement('a');
 link.href = pdfUrl;
 link.download = 'amazon_labels_ready.pdf';
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
  setDone(false); setPdfUrl(null);
  setShowSettings(true);
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
 const ACCENT_GRADIENT = "linear-gradient(135deg,#FF9900,#ea580c)";

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
      <div className="flex items-center gap-2 text-[#FF9900]">
        <Settings size={20} />
        <h3 className="text-[15px] font-black text-[#1e293b] dark:text-white tracking-widest uppercase">Settings</h3>
      </div>
      {showSettings ? (
        <ChevronUp size={20} className="text-[#FF9900] lg:hidden" />
      ) : (
        <ChevronDown size={20} className="text-[#FF9900] lg:hidden" />
      )}
    </div>

    <div className={`pt-5 px-5 pb-4 space-y-5 ${showSettings ? 'block' : 'hidden lg:block'}`}>
 <div className="space-y-5 text-left">

  {/* SORT OPTIONS */}
  <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sort Batch By</h4>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-[#FF9900]"><FileText size={16} /></div>
        <div>
          <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">AWB Number</p>
          <p className="text-[10px] text-slate-400">Sort extracted labels sequentially</p>
        </div>
      </div>
      <button onClick={() => setSortByAwb(!sortByAwb)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${sortByAwb ? 'bg-[#FF9900]' : 'bg-slate-200 dark:bg-slate-700'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${sortByAwb ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
      </button>
    </div>
  </div>

  {/* LAYOUT SETTINGS */}
  <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Layout Settings</h4>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-[#FF9900]"><ShoppingBag size={16} /></div>
        <div>
          <p className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">4 Labels Per A4 (Grid)</p>
          <p className="text-[10px] text-slate-400">Optimal 2x2 Warehouse Grid</p>
        </div>
      </div>
      <button onClick={() => setUseA4Grid(!useA4Grid)} className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${useA4Grid ? 'bg-[#FF9900]' : 'bg-slate-200 dark:bg-slate-700'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${useA4Grid ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
      </button>
    </div>
  </div>

  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Technical Info</p>
    <p className="text-[10px] text-slate-400 font-medium leading-tight">You can print 4 labels on a single A4 sheet. This is the standard warehouse setting for efficiency.</p>
  </div>
 </div>
 </div>
 </div>
 )}

 {/* Extraction Engine UI */}
  <div className="flex-1 w-full space-y-4 sm:space-y-6">
    <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      
      {!done ? (
        <>
          <div className="relative text-center space-y-4 mb-6">
            <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
              Amazon Extraction Engine
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
              Extract shipping labels instantly. Invoices and extra pages are automatically removed.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">


            {files.length === 0 ? (
              <div 
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
                onClick={() => {
                if (!isPremium && remaining <= 0) {
                setOutOfCreditsOpen(true);
                return;
                }
                inputRef.current?.click();
                }}>
                <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 mb-5 sm:mb-6" style={{ color: ACCENT }}><Upload size={36} /></div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mb-2 sm:mb-3 text-center tracking-tight">Upload Amazon PDFs</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">Invoices automatically cleared.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">{files.length} Files Selected</h3>
                  <button onClick={() => inputRef.current?.click()} className="text-xs font-bold text-[#FF9900] hover:text-[#ea580c] uppercase tracking-widest">Add More</button>
                  <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                </div>
                <div className="flex-1 space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-[#FF9900]/30 transition-colors">
                      <div className="flex items-center gap-3 font-medium text-[#1e293b] dark:text-slate-300 text-sm truncate max-w-[200px]">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-[#FF9900]"><FileText size={16} /></div>
                        {f.name}
                      </div>
                      {f.status === 'processing' ? <Loader2 size={16} className="animate-spin text-[#FF9900]" /> : <button onClick={() => removeFile(f.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={processAll} disabled={processing} className="w-full py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest flex items-center justify-center gap-2" style={{ background: ACCENT_GRADIENT }}>
                    {processing ? <Loader2 size={24} className="animate-spin" /> : 'Start Extraction'}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 mt-6 border-t border-slate-100 dark:border-slate-800/50">
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
              <button onClick={handleDownloadClick} className="w-full py-4 sm:py-5 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest text-center flex items-center justify-center gap-2" style={{ background: ACCENT_GRADIENT }}>
                <Download size={24} /> Download Final PDF
              </button>
              <button onClick={reset} className="w-full py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm hover:text-[#FF9900] hover:bg-orange-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
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



