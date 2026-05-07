"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, ImageIcon, FileText, CheckCircle2, Sparkles, FolderDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

const ACCENT: Record<string, { bg: string; hover: string; text: string; shadow: string }> = {
  'jpg-to-pdf':  { bg: 'bg-yellow-400',  hover: 'hover:border-yellow-400',  text: 'text-yellow-400',  shadow: 'shadow-yellow-400/20'  },
  'pdf-to-jpg':  { bg: 'bg-yellow-400',  hover: 'hover:border-yellow-400',  text: 'text-yellow-400',  shadow: 'shadow-yellow-400/20'  },
  'jpg-to-png':  { bg: 'bg-green-500',   hover: 'hover:border-green-400',   text: 'text-green-500',   shadow: 'shadow-green-500/20'   },
  'png-to-jpg':  { bg: 'bg-orange-400',  hover: 'hover:border-orange-400',  text: 'text-orange-400',  shadow: 'shadow-orange-400/20'  },
  'jpg-to-webp': { bg: 'bg-violet-500',  hover: 'hover:border-violet-400',  text: 'text-violet-500',  shadow: 'shadow-violet-500/20'  },
  'webp-to-jpg': { bg: 'bg-pink-500',    hover: 'hover:border-pink-400',    text: 'text-pink-500',    shadow: 'shadow-pink-500/20'    },
  'png-to-webp': { bg: 'bg-cyan-500',    hover: 'hover:border-cyan-400',    text: 'text-cyan-500',    shadow: 'shadow-cyan-500/20'    },
  'webp-to-png': { bg: 'bg-teal-500',    hover: 'hover:border-teal-400',    text: 'text-teal-500',    shadow: 'shadow-teal-500/20'    },
  'jpg-to-avif': { bg: 'bg-rose-500',    hover: 'hover:border-rose-400',    text: 'text-rose-500',    shadow: 'shadow-rose-500/20'    },
  'avif-to-jpg': { bg: 'bg-amber-500',   hover: 'hover:border-amber-400',   text: 'text-amber-500',   shadow: 'shadow-amber-500/20'   },
  'png-to-avif': { bg: 'bg-indigo-500',  hover: 'hover:border-indigo-400',  text: 'text-indigo-500',  shadow: 'shadow-indigo-500/20'  },
  'avif-to-png': { bg: 'bg-lime-500',    hover: 'hover:border-lime-400',    text: 'text-lime-500',    shadow: 'shadow-lime-500/20'    },
  'webp-to-avif':{ bg: 'bg-fuchsia-500', hover: 'hover:border-fuchsia-400', text: 'text-fuchsia-500', shadow: 'shadow-fuchsia-500/20' },
  'avif-to-webp':{ bg: 'bg-sky-500',     hover: 'hover:border-sky-400',     text: 'text-sky-500',     shadow: 'shadow-sky-500/20'     },
};

export default function ImageConverter({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [pdfName, setPdfName] = useState('');
  const accent = ACCENT[id] ?? ACCENT['jpg-to-pdf'];
  const inputRef = useRef<HTMLInputElement>(null);

  // "Convert More" — keep existing files, clear results, open file picker to add more
  const handleConvertMore = () => {
    setResults([]);
    setTimeout(() => inputRef.current?.click(), 50);
  };

  const isMultiMode = id !== 'pdf-to-jpg'; // all except pdf-to-jpg support multiple files

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files!);
      setFiles(prev => isMultiMode ? [...prev, ...incoming] : incoming);
      const newPreviews = incoming.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : '');
      setPreviews(prev => isMultiMode ? [...prev, ...newPreviews] : newPreviews);
      setResults([]);
      e.target.value = '';
    }
  };

  const convertImageFormat = async (file: File, toFormat: 'png' | 'jpeg' | 'webp' | 'avif') => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        if (toFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL(`image/${toFormat}`, 0.95));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
      img.src = url;
    });
  };

  const removeFile = (index: number) => {
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const getTargetFormat = (): 'png' | 'jpeg' | 'webp' | 'avif' => {
    if (['jpg-to-png', 'webp-to-png', 'avif-to-png'].includes(id)) return 'png';
    if (['png-to-jpg', 'webp-to-jpg', 'avif-to-jpg'].includes(id)) return 'jpeg';
    if (['jpg-to-webp', 'png-to-webp', 'avif-to-webp'].includes(id)) return 'webp';
    if (['jpg-to-avif', 'png-to-avif', 'webp-to-avif'].includes(id)) return 'avif';
    return 'jpeg';
  };

  const getTargetExt = () => {
    const fmt = getTargetFormat();
    return fmt === 'jpeg' ? 'jpg' : fmt;
  };

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
      } else {
        // All image-to-image: convert every file
        const fmt = getTargetFormat();
        const converted = await Promise.all(files.map(f => convertImageFormat(f, fmt)));
        setResults(converted);
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
      const ext = id === 'pdf-to-jpg' ? 'jpg' : getTargetExt();
      const folder = zip.folder('converted')!;
      results.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(',')[1];
        const baseName = files[i] ? files[i].name.replace(/\.[^.]+$/, '') : `image_${i + 1}`;
        const fileName = id === 'pdf-to-jpg' ? `${pdfName || 'page'}_${i + 1}.${ext}` : `${baseName}.${ext}`;
        folder.file(fileName, base64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${ext}.zip`;
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
          <div className={`inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${accent.bg} text-white shadow-lg`}>
            <ImageIcon size={36} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'jpg-to-pdf' ? 'JPG to PDF' : id === 'pdf-to-jpg' ? 'PDF to JPG' : id === 'jpg-to-png' ? 'JPG to PNG' : id === 'png-to-jpg' ? 'PNG to JPG' : id === 'jpg-to-webp' ? 'JPG to WebP' : id === 'webp-to-jpg' ? 'WebP to JPG' : id === 'png-to-webp' ? 'PNG to WebP' : id === 'webp-to-png' ? 'WebP to PNG' : id === 'jpg-to-avif' ? 'JPG to AVIF' : id === 'avif-to-jpg' ? 'AVIF to JPG' : id === 'png-to-avif' ? 'PNG to AVIF' : id === 'avif-to-png' ? 'AVIF to PNG' : id === 'webp-to-avif' ? 'WebP to AVIF' : 'AVIF to WebP'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Fast, visual, and secure image conversion.</p>
        </div>

        {results.length === 0 ? (
          <div className="space-y-6">
            {/* Drop zone */}
            <div className={`relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group ${accent.hover} transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50`}>
              <input
                ref={inputRef}
                type="file"
                multiple={isMultiMode}
                onChange={onFileChange}
                accept={
                  id === 'jpg-to-pdf' ? 'image/*' :
                  id === 'jpg-to-png' || id === 'jpg-to-webp' || id === 'jpg-to-avif' ? 'image/jpeg,image/jpg' :
                  id === 'png-to-jpg' || id === 'png-to-webp' || id === 'png-to-avif' ? 'image/png' :
                  id === 'webp-to-jpg' || id === 'webp-to-png' || id === 'webp-to-avif' ? 'image/webp' :
                  id === 'avif-to-jpg' || id === 'avif-to-png' || id === 'avif-to-webp' ? 'image/avif' :
                  '.pdf'
                }
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-4 pointer-events-none">
                <div className={`p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block ${accent.text} group-hover:scale-110 transition-transform`}>
                  <Upload size={36} />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight">
                  {id === 'pdf-to-jpg' ? 'Select PDF File' : `Select ${id.split('-')[0].toUpperCase()} Image${isMultiMode ? 's' : ''}`}
                </div>
                <p className="text-sm text-slate-500">
                  {isMultiMode ? 'Drop multiple images or click to browse' : 'or drop file here'}
                </p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="relative p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="aspect-square bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 overflow-hidden">
                        {previews[i] ? <img src={previews[i]} alt={file.name} className="w-full h-full object-cover" /> : <FileText size={28} />}
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
                  className={`w-full py-4 sm:py-5 ${accent.bg} hover:opacity-90 text-slate-900 rounded-2xl text-lg sm:text-2xl font-black shadow-xl ${accent.shadow} flex items-center justify-center gap-4 transition-all disabled:opacity-50`}
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                  {processing ? 'Converting...' : id === 'jpg-to-pdf' ? `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF` : `Convert ${files.length > 1 ? `${files.length} Images` : '1 Image'} to ${getTargetExt().toUpperCase()}`}
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
                className={`w-full py-5 ${accent.bg} hover:opacity-90 text-slate-900 rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all`}
              >
                <Download size={26} /> Download PDF
              </a>
            ) : id !== 'pdf-to-jpg' ? (
              <div className="space-y-4">
                {results.length === 1 ? (
                  <>
                    <a
                      href={results[0]}
                      download={`${files[0]?.name.replace(/\.[^.]+$/, '') || 'converted'}.${getTargetExt()}`}
                      className={`w-full py-5 ${accent.bg} hover:opacity-90 text-slate-900 rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all`}
                    >
                      <Download size={26} /> Download {getTargetExt().toUpperCase()}
                    </a>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-80">
                      <img src={results[0]} alt="Converted" className="w-full h-full object-contain" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={downloadAllZip}
                        disabled={zipping}
                        className={`flex-1 py-4 ${accent.bg} hover:opacity-90 text-slate-900 rounded-2xl font-black text-base shadow-xl ${accent.shadow} flex items-center justify-center gap-3 transition-all disabled:opacity-50`}
                      >
                        {zipping ? <Loader2 className="animate-spin" size={20} /> : <FolderDown size={20} />}
                        {zipping ? 'Creating ZIP...' : `Download All (${results.length} ${getTargetExt().toUpperCase()}s)`}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {results.map((url, i) => (
                        <div key={i} className="space-y-2">
                          <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                            <img src={url} alt={files[i]?.name} className="w-full h-full object-cover" />
                          </div>
                          <a
                            href={url}
                            download={`${files[i]?.name.replace(/\.[^.]+$/, '') || `image_${i+1}`}.${getTargetExt()}`}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Download size={12} /> {files[i]?.name.replace(/\.[^.]+$/, '').slice(0, 10) || `Image ${i+1}`}
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={handleConvertMore} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold transition-all">
                  Convert More
                </button>
              </div>
            ) : (
              <>
                {/* Action buttons row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Download All ZIP */}
                  <button
                    onClick={downloadAllZip}
                    disabled={zipping}
                    className={`flex-1 py-4 ${accent.bg} hover:opacity-90 text-slate-900 rounded-2xl font-black text-base shadow-xl ${accent.shadow} flex items-center justify-center gap-3 transition-all disabled:opacity-50`}
                  >
                    {zipping ? <Loader2 className="animate-spin" size={20} /> : <FolderDown size={20} />}
                    {zipping ? 'Creating ZIP...' : `Download All (${results.length} JPGs)`}
                  </button>

                  {/* Convert More */}
                  <button
                    onClick={handleConvertMore}
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
                onClick={handleConvertMore}
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
