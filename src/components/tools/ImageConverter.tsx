"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, Download, Loader2, X, FileImage, FileText,
  CheckCircle2, Image as ImageIcon, Zap, ShieldCheck,
  RefreshCw, Layers, Smartphone, Rocket, Plus, Lock, Trash2
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

type ConversionStatus = "idle" | "processing" | "done" | "error";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "done" | "error";
  resultUrl?: string;
  resultName?: string;
}

const TOOL_METADATA: Record<string, { title: string; desc: string; accent: string; gradient: string }> = {
  'pdf-to-jpg': { title: 'PDF to JPG', desc: 'Transform PDF pages into high-resolution JPG images instantly.', accent: '#facc15', gradient: 'linear-gradient(135deg,#facc15,#eab308)' },
  'pdf-to-png': { title: 'PDF to PNG', desc: 'Convert PDF pages to transparent PNG images with high fidelity.', accent: '#facc15', gradient: 'linear-gradient(135deg,#facc15,#eab308)' },
  'jpg-to-pdf': { title: 'JPG to PDF', desc: 'Merge multiple JPG images into a single, professional PDF document.', accent: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  'png-to-pdf': { title: 'PNG to PDF', desc: 'Convert PNG images into a clean, searchable PDF document.', accent: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  'jpg-to-png': { title: 'JPG to PNG', desc: 'Convert JPG images to PNG format to preserve transparency and quality.', accent: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
  'png-to-jpg': { title: 'PNG to JPG', desc: 'Convert PNG images to JPG format for smaller file sizes and compatibility.', accent: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  'jpg-to-webp': { title: 'JPG to WebP', desc: 'Optimize JPG images for the web by converting them to WebP format.', accent: '#06b6d4', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  'webp-to-jpg': { title: 'WebP to JPG', desc: 'Convert WebP images back to JPG for wider software support.', accent: '#f43f5e', gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)' },
  'png-to-webp': { title: 'PNG to WebP', desc: 'Convert PNG to WebP for modern, highly efficient web graphics.', accent: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  'webp-to-png': { title: 'WebP to PNG', desc: 'Convert WebP images to PNG to restore lossless editing capability.', accent: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  'jpg-to-avif': { title: 'JPG to AVIF', desc: 'Convert JPG to AVIF for the next generation of image compression.', accent: '#ec4899', gradient: 'linear-gradient(135deg,#ec4899,#db2777)' },
  'avif-to-jpg': { title: 'AVIF to JPG', desc: 'Convert AVIF images to JPG for legacy system compatibility.', accent: '#64748b', gradient: 'linear-gradient(135deg,#64748b,#475569)' },
};

export default function ImageConverter({ id: toolId }: { id: string }) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [results, setResults] = useState<{ url: string; name: string; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const meta = TOOL_METADATA[toolId] || {
    title: toolId.replace(/-/g, ' ').toUpperCase(),
    desc: 'Professional image conversion tool running 100% in your browser.',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)'
  };

  const isPdfToImg = toolId.startsWith("pdf-to-");
  const isImgToPdf = toolId.endsWith("-to-pdf");
  const ACCENT = meta.accent;
  const ACCENT_GRADIENT = meta.gradient;
  const [sourceFormat] = toolId.split("-to-");
  const to = toolId.split("-to-")[1].toUpperCase();

  const addFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const allowedExtensions = isPdfToImg ? ['pdf'] :
      (sourceFormat === 'jpg' || sourceFormat === 'jpeg') ? ['jpg', 'jpeg'] :
        [sourceFormat.toLowerCase()];

    const filteredFiles = Array.from(newFiles).filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || "";
      if (!toolId.includes("-to-")) return file.type.startsWith("image/");
      return allowedExtensions.includes(ext);
    });

    if (filteredFiles.length < newFiles.length) {
      alert(`Support for ${sourceFormat.toUpperCase()} files only. Some files were skipped.`);
    }

    if (filteredFiles.length === 0) return;

    const entries: ImageFile[] = await Promise.all(
      filteredFiles.map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        status: "pending",
      }))
    );
    setFiles((prev) => [...prev, ...entries]);
    setStatus("idle");
    setResultUrl(null);
  }, [toolId, isPdfToImg, sourceFormat]);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find(f => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setResults([]);

    try {
      const globalZip = new JSZip();
      let finalBlob: Blob | null = null;
      let totalOutputCount = 0;
      const allResults: { url: string; name: string; preview: string }[] = [];

      const targetFormat = toolId.split("-to-")[1];
      const mimeMap: Record<string, string> = {
        'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'webp': 'image/webp', 'avif': 'image/avif',
      };
      const targetMime = mimeMap[targetFormat] || 'image/png';
      const targetExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

      const updatedFiles = [...files];

      if (isPdfToImg) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

        for (let i = 0; i < updatedFiles.length; i++) {
          const entry = updatedFiles[i];
          const buf = await entry.file.arrayBuffer();
          const doc = await pdfjsLib.getDocument({ data: buf }).promise;
          const baseName = entry.file.name.replace(/\.pdf$/i, "");

          const entryZip = doc.numPages > 1 ? new JSZip() : null;
          let firstPageUrl: string | null = null;

          for (let p = 1; p <= doc.numPages; p++) {
            const page = await doc.getPage(p);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d", { alpha: false })!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({ canvasContext: ctx, viewport, canvas }).promise;
            const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), targetMime, 0.90));
            const url = URL.createObjectURL(blob);

            const fileName = doc.numPages > 1 ? `${baseName}-page-${p}.${targetExt}` : `${baseName}.${targetExt}`;

            globalZip.file(fileName, blob);
            if (entryZip) entryZip.file(fileName, blob);

            allResults.push({ url, name: fileName, preview: url });
            if (p === 1) firstPageUrl = url;
            totalOutputCount++;
          }

          if (entryZip) {
            const zipBlob = await entryZip.generateAsync({ type: "blob" });
            updatedFiles[i] = {
              ...entry,
              status: "done",
              resultUrl: URL.createObjectURL(zipBlob),
              resultName: `${baseName}_images.zip`
            };
          } else if (firstPageUrl) {
            updatedFiles[i] = {
              ...entry,
              status: "done",
              resultUrl: firstPageUrl,
              resultName: `${baseName}.${targetExt}`
            };
          }
        }
      } else if (isImgToPdf) {
        const pdfDoc = await PDFDocument.create();
        for (let i = 0; i < updatedFiles.length; i++) {
          const entry = updatedFiles[i];
          const imgBytes = await entry.file.arrayBuffer();
          let img;
          if (entry.file.type === "image/jpeg" || entry.file.type === "image/jpg") {
            img = await pdfDoc.embedJpg(imgBytes);
          } else if (entry.file.type === "image/png") {
            img = await pdfDoc.embedPng(imgBytes);
          } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = await new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = URL.createObjectURL(entry.file);
            });
            canvas.width = image.width; canvas.height = image.height;
            ctx?.drawImage(image, 0, 0);
            img = await pdfDoc.embedJpg(await (await fetch(canvas.toDataURL('image/jpeg'))).arrayBuffer());
          }
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
          updatedFiles[i] = { ...entry, status: "done" };
        }
        const bytes = await pdfDoc.save();
        finalBlob = new Blob([bytes] as BlobPart[], { type: "application/pdf" });
        const url = URL.createObjectURL(finalBlob);
        allResults.push({ url, name: "converted.pdf", preview: "" });
      } else {
        for (let i = 0; i < updatedFiles.length; i++) {
          const entry = updatedFiles[i];
          const image = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(entry.file);
          });
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          canvas.getContext('2d')?.drawImage(image, 0, 0);
          const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), targetMime, 0.90));
          const url = URL.createObjectURL(blob);

          const fileName = `${entry.file.name.split('.')[0]}.${targetExt}`;
          updatedFiles[i] = {
            ...entry,
            status: "done",
            resultUrl: url,
            resultName: fileName
          };
          globalZip.file(fileName, blob);
          allResults.push({ url, name: fileName, preview: url });
          totalOutputCount++;
        }
      }

      setFiles(updatedFiles);
      setResults(allResults);

      if (isImgToPdf) setResultUrl(allResults[0].url);
      else if (totalOutputCount > 1) {
        const content = await globalZip.generateAsync({ type: "blob" });
        setResultUrl(URL.createObjectURL(content));
      } else setResultUrl(allResults[0]?.url || null);

      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const reset = () => {
    files.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    results.forEach(r => URL.revokeObjectURL(r.url));
    setFiles([]); setResults([]); setStatus("idle"); setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" style={{ background: ACCENT }} />

          <input
            ref={fileInputRef} type="file" multiple
            onChange={e => addFiles(e.target.files)}
            accept={isPdfToImg ? ".pdf" : (sourceFormat === 'jpg' || sourceFormat === 'jpeg') ? ".jpg,.jpeg" : `.${sourceFormat}`}
            className="hidden"
          />

          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: ACCENT_GRADIENT, boxShadow: `0 10px 20px -5px ${ACCENT}44` }}>
              {isPdfToImg ? <FileImage size={32} /> : isImgToPdf ? <FileText size={32} /> : <ImageIcon size={32} />}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {meta.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              {meta.desc}
            </p>
          </div>

          {/* Success Banner */}
          {status === "done" && (
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Conversion Complete!</h2>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{results.length} Item{results.length !== 1 ? 's' : ''} Generated Successfully</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {resultUrl && (
                  <a href={resultUrl} download={isImgToPdf ? "converted.pdf" : "converted_images.zip"} className="px-8 py-4 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto" style={{ background: ACCENT_GRADIENT }}>
                    <Download size={18} /> Download {results.length > 1 ? "All (ZIP)" : "File"}
                  </a>
                )}
                <button onClick={reset} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                  <RefreshCw size={18} /> Start Over
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">
            {/* Feature pills when empty */}
            {files.length === 0 && (
              <div className="hidden sm:flex items-center justify-center gap-6 w-full mb-6">
                {[
                  { icon: Zap, title: "Instant", desc: "In your browser" },
                  { icon: ShieldCheck, title: "Private", desc: "No server upload" },
                  { icon: Layers, title: "Lossless", desc: "Format preserved" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            {files.length === 0 ? (
              <div
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              >
                <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10 overflow-hidden">
                    <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase z-20" style={{ background: ACCENT }}>{isPdfToImg ? "PDF" : sourceFormat}</div>
                    <div className="m-auto text-slate-300 dark:text-slate-600 z-10">
                      {isPdfToImg ? <FileImage size={32} /> : isImgToPdf ? <FileText size={32} /> : <ImageIcon size={32} />}
                    </div>
                    {/* Tiny gradient flair bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: ACCENT_GRADIENT }} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                    <Upload size={20} strokeWidth={3} />
                  </div>
                  <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                  <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                  <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                  Drag &amp; drop your {isPdfToImg ? "PDF" : sourceFormat.toUpperCase()} files here
                </h3>
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                  or click to <span style={{ color: ACCENT }}>browse</span>
                </p>
                <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                  Supports multiple files for batch conversion
                </p>
                <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                  <Plus size={20} /> SELECT FILES
                </button>
              </div>
            ) : status === "done" ? (
              /* Results Grid */
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-6">
                {results.map((res, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:shadow-xl transition-all relative">
                    <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-white dark:bg-slate-900 relative border border-slate-100 dark:border-slate-700">
                      {res.preview ? (
                        <img src={res.preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <FileText size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <a href={res.url} download={res.name} className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
                          <Download size={14} /> Download
                        </a>
                      </div>
                    </div>
                    <div className="text-center px-2 pb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight">{res.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Files loaded list */
              <div className="w-full space-y-5" onClick={e => e.stopPropagation()}>

                {/* Feature pills inline bordered cards */}
                <div className="grid grid-cols-3 gap-2 w-full pb-4 border-b border-slate-100 dark:border-slate-800">
                  {[
                    { icon: Zap, title: "Instant", desc: "In your browser" },
                    { icon: ShieldCheck, title: "Private", desc: "No server upload" },
                    { icon: Layers, title: "Lossless", desc: "Format preserved" }
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                        <f.icon size={16} />
                      </div>
                      <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-none">{f.title}</p>
                      <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium leading-none">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {files.map(f => (
                    <div key={f.id} className="flex flex-row items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 gap-3 group relative overflow-hidden transition-all">
                      {f.preview ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          <img src={f.preview} className="w-full h-full object-cover" alt="" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl text-white shrink-0 flex items-center justify-center shadow-md" style={{ background: ACCENT_GRADIENT }}>
                          <FileText size={20} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight mb-1">{f.file.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{fmt(f.file.size)}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>{isPdfToImg ? 'PDF' : sourceFormat.toUpperCase()}</span>
                        </div>
                      </div>

                      <button onClick={() => removeFile(f.id)} disabled={status === 'processing'} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 disabled:opacity-50 shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add more */}
                <button onClick={() => fileInputRef.current?.click()} disabled={status === 'processing'} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-400 transition-all bg-slate-50/10 group disabled:opacity-50">
                  <Plus size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Add More Files</span>
                </button>

                {/* Process overlay */}
                {status === "processing" && (
                  <div className="p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Loader2 size={40} className="animate-spin mx-auto" style={{ color: ACCENT }} strokeWidth={1.5} />
                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">Converting to {to}...</p>
                  </div>
                )}

                {/* Actions */}
                {!status.includes("processing") && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleConvert}
                      disabled={status === "processing" || files.length === 0}
                      className="w-full sm:flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-sm sm:text-lg font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Zap size={18} /> Convert to {to}
                    </button>
                    <button onClick={reset} className="w-full sm:w-auto sm:px-6 py-3 sm:py-5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={14} /> Start Over
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Feature grid when empty */}
            {files.length === 0 && (
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
            )}

          </div>
        </div>

        {/* Bottom features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Native Engine", desc: "No wait times. Everything happens instantly on your device hardware.", icon: Layers },
            { title: "Smart Batches", desc: "Process hundreds of items. ZIP archives are created automatically.", icon: Zap },
            { title: "Ironclad Privacy", desc: "We never see your files. Zero server-side uploads or data logs.", icon: ShieldCheck },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
                <feat.icon size={24} />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>
    </div>
  );
}
