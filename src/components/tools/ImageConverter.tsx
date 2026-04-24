"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, ImageIcon, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker — served locally to avoid CDN fetch failures
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

export default function ImageConverter({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
      setResults([]);
      setZipUrl(null);
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      if (id === 'jpg-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        for (const file of files) {
          const imgBytes = await file.arrayBuffer();
          let img;
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            img = await pdfDoc.embedJpg(imgBytes);
          } else if (file.type === 'image/png') {
            img = await pdfDoc.embedPng(imgBytes);
          } else continue;

          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const pdfBytes = await pdfDoc.save();
        setResults([URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }))]);
      } else if (id === 'pdf-to-jpg') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const pageImages: string[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // pdfjs-dist v5 requires 'canvas' in RenderParameters
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.9));
        }
        setResults(pageImages);
      }
    } catch (err) {
      console.error(err);
      alert("Error during image conversion.");
    } finally {
      setProcessing(true);
      setTimeout(() => setProcessing(false), 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex p-5 rounded-3xl bg-yellow-400 text-white shadow-lg">
             <ImageIcon size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'jpg-to-pdf' ? 'JPG to PDF' : 'PDF to JPG'}
          </h2>
          <p className="text-slate-500 font-medium">Fast, visual, and secure image conversion.</p>
        </div>

        {results.length === 0 ? (
          <div className="space-y-8">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 group hover:border-yellow-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
              <input type="file" multiple={id === 'jpg-to-pdf'} onChange={onFileChange} accept={id === 'jpg-to-pdf' ? 'image/*' : '.pdf'} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-yellow-400 group-hover:scale-110 transition-transform">
                  <Upload size={48} />
                </div>
                <div className="text-2xl font-black tracking-tight">{id === 'jpg-to-pdf' ? 'Select Images' : 'Select PDF File'}</div>
                <p className="text-slate-500">or drop {id === 'jpg-to-pdf' ? 'images' : 'PDF'} here</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {files.map((file, i) => (
                     <div key={i} className="relative group p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                        <div className="aspect-square bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300">
                           {file.type.startsWith('image/') ? <ImageIcon size={32} /> : <FileText size={32} />}
                        </div>
                        <p className="text-[10px] font-bold mt-2 truncate text-slate-500">{file.name}</p>
                        <button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-600 text-red-500 rounded-full shadow-lg border border-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                           <X size={14} />
                        </button>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={handleConvert} 
                  disabled={processing}
                  className="w-full py-5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl text-2xl font-black shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-4 transition-all"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Sparkles size={28} className="fill-slate-900/10" />}
                  {processing ? 'Converting...' : 'Convert to ' + (id === 'jpg-to-pdf' ? 'PDF' : 'JPG')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-12 rounded-full bg-slate-100 dark:bg-slate-700 text-yellow-500 scale-110 inline-block">
                <CheckCircle2 size={80} />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl font-black">Conversion Ready!</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">{results.length} item(s) processed.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {id === 'jpg-to-pdf' ? (
                  <a href={results[0]} download="converted_images.pdf" className="col-span-1 sm:col-span-2 py-6 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4">
                     <Download size={28} /> Download PDF
                  </a>
                ) : (
                  results.map((url, i) => (
                    <div key={i} className="glass-card p-4 space-y-4 border-yellow-400/20">
                       <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden relative group">
                          <img src={url} alt={`Page ${i+1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-yellow-400/80 items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity">
                             <a href={url} download={`page_${i+1}.jpg`} className="primary-button bg-slate-900">
                                <Download size={20} />
                             </a>
                          </div>
                       </div>
                       <p className="text-xs font-bold text-slate-500">Page {i + 1}</p>
                    </div>
                  ))
                )}
             </div>

             <button onClick={() => {setFiles([]); setResults([]);}} className="mt-8 px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Convert More
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
