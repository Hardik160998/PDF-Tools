"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, ImageIcon, FileText, CheckCircle2, Sparkles, FolderDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

export default function ImageConverter({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [pdfName, setPdfName] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => id === 'jpg-to-pdf'
        ? [...prev, ...Array.from(e.target.files!)]
        : [e.target.files![0]]
      );
      setResults([]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const handleConvert = async () => {
    if (!files.length) return;
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
        setPdfName(file.name.replace(/\.pdf$/i, ''));
        const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
        const pageImages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const context = canvas.getContext('2d')!;
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.9));
        }
        setResults(pageImages);
      }
    } catch (err) {
      console.error(err);
      alert('Error during image conversion.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAllZip = async () => {
    if (!results.length) return;
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folder = zip.folder('pages')!;
      results.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(',')[1];
        folder.file(`page_${i + 1}.jpg`, base64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfName || 'pages'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error creating ZIP.');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-yellow-400 text-white shadow-lg">
            <ImageIcon size={36} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'jpg-to-pdf' ? 'JPG to PDF' : 'PDF to JPG'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Fast, visual, and secure image conversion.</p>
        </div>

        {results.length === 0 ? (
          <div className="space-y-6">
            {/* Drop zone */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-yellow-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
              <input
                type="file"
                multiple={id === 'jpg-to-pdf'}
                onChange={onFileChange}
                accept={id === 'jpg-to-pdf' ? 'image/*' : '.pdf'}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-4 pointer-events-none">
                <div className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-yellow-400 group-hover:scale-110 transition-transform">
                  <Upload size={36} />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight">
                  {id === 'jpg-to-pdf' ? 'Select Images' : 'Select PDF File'}
                </div>
                <p className="text-sm text-slate-500">or drop {id === 'jpg-to-pdf' ? 'images' : 'PDF'} here</p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="relative p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="aspect-square bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300">
                        {file.type.startsWith('image/') ? <ImageIcon size={28} /> : <FileText size={28} />}
                      </div>
                      <p className="text-[10px] font-bold mt-2 truncate text-slate-500">{file.name}</p>
                      {/* Always visible remove button */}
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConvert}
                  disabled={processing}
                  className="w-full py-4 sm:py-5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-4 transition-all disabled:opacity-50"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                  {processing ? 'Converting...' : `Convert to ${id === 'jpg-to-pdf' ? 'PDF' : 'JPG'}`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-700">
            {/* Success header */}
            <div className="flex flex-col items-center gap-3">
              <div className="p-5 rounded-full bg-yellow-50 text-yellow-500">
                <CheckCircle2 size={52} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">Conversion Ready!</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                {results.length} {results.length === 1 ? 'item' : 'items'} processed
              </p>
            </div>

            {id === 'jpg-to-pdf' ? (
              <a
                href={results[0]}
                download="converted_images.pdf"
                className="w-full py-5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all"
              >
                <Download size={26} /> Download PDF
              </a>
            ) : (
              <>
                {/* Action buttons row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Download All ZIP */}
                  <button
                    onClick={downloadAllZip}
                    disabled={zipping}
                    className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl font-black text-base shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                  >
                    {zipping ? <Loader2 className="animate-spin" size={20} /> : <FolderDown size={20} />}
                    {zipping ? 'Creating ZIP...' : `Download All (${results.length} JPGs)`}
                  </button>

                  {/* Convert More */}
                  <button
                    onClick={() => { setFiles([]); setResults([]); }}
                    className="sm:w-40 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all text-sm"
                  >
                    Convert More
                  </button>
                </div>

                {/* Individual page thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.map((url, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                        <img src={url} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <a
                        href={url}
                        download={`${pdfName || 'page'}_${i + 1}.jpg`}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Download size={12} /> Page {i + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Convert More for jpg-to-pdf */}
            {id === 'jpg-to-pdf' && (
              <button
                onClick={() => { setFiles([]); setResults([]); }}
                className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
              >
                Convert More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
