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

async function findTotalLineY(page: pdfjsLib.PDFPageProxy): Promise<number | null> {
  const content = await page.getTextContent();
  const items = content.items as any[];
  let totalY: number | null = null;
  for (const item of items) {
    if (item.str?.trim() === 'Total') totalY = item.transform[5];
  }
  return totalY;
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

export default function MeeshoCropper({ id }: { id: string }) {
  const [files, setFiles] = useState<LabelFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [labelCount, setLabelCount] = useState(0);
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
    let total = 0;
    for (const entry of files) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));
      try {
        const buf = await entry.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(buf).promise;
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const totalY = await findTotalLineY(page);
          const canvas = await renderPageCroppedToCanvas(page, 2, totalY);
          const jpegBytes = await canvasToJpegBytes(canvas);
          const img = await outDoc.embedJpg(jpegBytes);
          const A4W = 595.28;
          const pageH = (img.height / img.width) * A4W;
          const outPage = outDoc.addPage([A4W, pageH]);
          outPage.drawImage(img, { x: 0, y: 0, width: A4W, height: pageH });
          total++;
        }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', pageCount: pdf.numPages } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }
    const pdfBytes = await outDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    setPdfUrl(URL.createObjectURL(blob));
    setLabelCount(total);
    setProcessing(false);
    setDone(true);
  };

  const reset = () => { setFiles([]); setDone(false); setPdfUrl(null); setLabelCount(0); };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-6 sm:space-y-10">

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#f26522] text-white shadow-lg">
            <ShoppingBag size={36} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Meesho Label with Invoice Cropper
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            Auto-remove the invoice section below "Total" from Meesho shipping label PDFs.
          </p>
        </div>

        {!done ? (
          <div className="space-y-6">
            {/* Upload Zone */}
            <div
              className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-[#f26522] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            >
              <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              <div className="space-y-4 sm:space-y-6 pointer-events-none">
                <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-[#f26522] group-hover:scale-110 transition-transform">
                  <Upload size={32} className="sm:w-12 sm:h-12" />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Drop Meesho Label PDFs here
                </div>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                  or click to browse · Multiple PDFs supported
                </p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-left">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-[#f26522] shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {(f.file.size / 1024).toFixed(0)} KB
                            {f.pageCount ? ` · ${f.pageCount} page${f.pageCount > 1 ? 's' : ''}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {f.status === 'pending'    && <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>}
                        {f.status === 'processing' && <Loader2 size={16} className="animate-spin text-[#f26522]" />}
                        {f.status === 'done'       && <CheckCircle2 size={16} className="text-green-500" />}
                        {f.status === 'error'      && <X size={16} className="text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={processAll}
                    disabled={processing}
                    className="flex-1 py-4 sm:py-5 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-60 transition-all"
                  >
                    {processing ? <Loader2 className="animate-spin" size={24} /> : <ShoppingBag size={24} />}
                    {processing ? 'Processing Labels…' : `Crop ${files.length} PDF${files.length > 1 ? 's' : ''}`}
                  </button>
                  <button
                    onClick={reset}
                    disabled={processing}
                    className="px-5 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-2xl font-bold transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Done State */
          pdfUrl && (
            <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700">
              <div className="p-10 sm:p-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 scale-110 inline-block">
                <CheckCircle2 size={72} sm-size={80} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {labelCount} Label{labelCount !== 1 ? 's' : ''} Ready!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                  Invoice section removed. Clean labels packed into one PDF.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={pdfUrl}
                  download="meesho_labels.pdf"
                  className="flex-1 py-4 sm:py-5 bg-[#f26522] hover:bg-[#d4541a] text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3"
                >
                  <Download size={24} /> Download PDF
                </a>
                <button
                  onClick={reset}
                  className="px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
                >
                  Crop More
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
