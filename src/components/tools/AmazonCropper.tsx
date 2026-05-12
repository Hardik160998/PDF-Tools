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
): Promise<{ labels: Array<{ bounds: CropBounds; awb: string; orderId: string }>; isInvoice: boolean }> {
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

  const labels: Array<{ bounds: CropBounds; awb: string; orderId: string }> = [];

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
    
    labels.push({ 
      bounds: { ...bounds, y: canvasY }, 
      awb: awbText, 
      orderId 
    });
  }

  // Fallback for label-only pages (no AWB found but not an invoice)
  if (labels.length === 0 && !isInvoicePage) {
    labels.push({
      bounds: { x: 0, y: 0, width: pageW, height: pageH },
      awb: '',
      orderId: ''
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
  const [skipEvenPages, setSkipEvenPages] = useState(true);
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
    
    // Dynamic imports for browser-only libraries
    const { PDFDocument } = await import('pdf-lib');
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

    const outDoc = await PDFDocument.create();
    let totalProcessed = 0;

    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        
        // Load for detection
        const pdfJsDoc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        // Load for vector cropping
        const srcDoc = await PDFDocument.load(buf);

        for (let p = 1; p <= pdfJsDoc.numPages; p++) {
          if (skipEvenPages && p % 2 === 0) continue;

          const pageJs = await pdfJsDoc.getPage(p);
          const { labels, isInvoice } = await detectAmazonLabels(pageJs, 1); // Detection at scale 1 is fine for text

          if (labels.length > 0 && !isInvoice) {
            for (const label of labels) {
              const { bounds } = label;
              // Bounds are now in PDF points
              
              // Copy the original page to maintain vector quality
              const [copiedPage] = await outDoc.copyPages(srcDoc, [p - 1]);
              
              // Apply vector crop
              // bounds.y is currently distance from top in our logic, let's fix it for PDF-Lib (bottom-up)
              const pageH = copiedPage.getHeight();
              const pageW = copiedPage.getWidth();
              
              // PDF coordinates are bottom-up
              // Our bounds.y was (pageH - topPdfY * scale) -> with scale 1 it's (pageH - topPdfY)
              // So top edge = pageH - bounds.y, bottom edge = top edge - bounds.height
              const topEdge = pageH - bounds.y;
              const bottomEdge = topEdge - bounds.height;
              const leftEdge = bounds.x;
              const rightEdge = leftEdge + bounds.width;

              copiedPage.setMediaBox(leftEdge, bottomEdge, rightEdge, topEdge);
              copiedPage.setCropBox(leftEdge, bottomEdge, rightEdge, topEdge);
              
              outDoc.addPage(copiedPage);
              totalProcessed++;
            }
          }
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdfJsDoc.numPages } : f));
      } catch (err) {
        console.error(err);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
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
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Settings Sidebar */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight text-left">Settings</h3>
            <div className="space-y-4 text-left">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={skipEvenPages} onChange={e => setSkipEvenPages(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-slate-300 text-[#FF9900]" style={{ accentColor: ACCENT }} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#FF9900]">Remove Even Pages (2,4,6...)</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ઇન્વૉઇસ રિમૂવલ (Even Pages)</span>
                </div>
              </label>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">આ માહિતી (Gujarati Info)</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">ટૂલ ઈવન પેજ (2, 4, 6) કાઢી નાખશે અને ઓડ પેજ (1, 3, 5) પરથી લેબલ ક્રોપ કરશે.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Engine UI */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: ACCENT }}><ShoppingBag size={32} /></div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">Amazon Extraction Engine</h2>
            <p className="text-slate-500 font-medium tracking-tight">Odd pages only (Labels). Even pages removed (Invoices).</p>
            <p className="text-[10px] font-bold text-[#FF9900] uppercase tracking-widest -mt-2 italic">ફુલ હાઇટ ક્રોપિંગ (Full Height labels)</p>
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
                Odd pages preserved. Even invoice pages removed.<br/>
                બધા ઓડ પેજ રાખવામાં આવ્યા છે અને ઈવન પેજ કાઢી નાખ્યા છે.
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
