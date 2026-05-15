"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, Download, Loader2, X, FileImage, FileText, 
  CheckCircle2, Settings, ChevronDown, Image as ImageIcon,
  Zap, ShieldCheck, RefreshCw, Layers, MousePointer2, Shield
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
  isProcessing?: boolean;
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
  const [showSettings, setShowSettings] = useState(false);
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

  const [results, setResults] = useState<{ url: string; name: string; preview: string }[]>([]);

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

            const fileName = doc.numPages > 1 
              ? `${baseName}-page-${p}.${targetExt}`
              : `${baseName}.${targetExt}`;
            
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
        // Image to Image
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

      if (isImgToPdf) {
        setResultUrl(allResults[0].url);
      } else if (totalOutputCount > 1) {
        const content = await globalZip.generateAsync({ type: "blob" });
        setResultUrl(URL.createObjectURL(content));
      } else {
        setResultUrl(allResults[0]?.url || null);
      }
      
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const reset = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    results.forEach(r => URL.revokeObjectURL(r.url));
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setResultUrl(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-medium text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Configuration</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-8`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="hidden lg:block font-outfit text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tools</h3>
              <button onClick={reset} className="font-outfit text-[11px] font-medium uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Instant", desc: "Local processing engine." },
                  { icon: Shield, title: "Private", desc: "Files never leave device." },
                  { icon: RefreshCw, title: "Lossless", desc: "Perfect quality output." }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0" style={{ color: ACCENT }}>
                      <f.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{f.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ color: ACCENT }}>
                      <ImageIcon size={14} />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-slate-400 uppercase tracking-widest">Queue Status</span>
                  </div>
                  <p className="font-outfit text-xs font-medium text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                    {files.length} Item{files.length !== 1 ? 's' : ''} ready
                  </p>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={status === "processing" || files.length === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-lg sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT, boxShadow: `0 10px 20px -5px ${ACCENT}44` }}
                >
                  {status === "processing" ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Working...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Convert {isImgToPdf ? "to PDF" : "All"} <Zap size={24} /></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-12 min-h-[650px] flex flex-col relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" style={{ background: ACCENT }} />
            
            <div className="relative text-center space-y-4 mb-12">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: ACCENT_GRADIENT }}>
                {isPdfToImg ? <FileImage size={32} /> : isImgToPdf ? <FileText size={32} /> : <ImageIcon size={32} />}
              </div>
              <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {meta.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                {meta.desc}
              </p>
            </div>

            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[40px] p-10 sm:p-20 hover:border-blue-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl mb-8 group-hover:scale-110 transition-transform relative z-10" style={{ color: ACCENT }}>
                  <Upload size={32} strokeWidth={2.5} />
                </div>
                <div className="text-lg sm:text-lg sm:text-xl font-medium text-slate-800 dark:text-white mb-1 relative z-10">
                  Select {isPdfToImg ? "PDFs" : "Images"}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium relative z-10 text-center">
                  Secure local processing · zero wait time
                </p>
                <button className="mt-10 px-12 py-5 rounded-2xl text-white text-base font-medium uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Start Now
                </button>
              </div>
            ) : status === "done" ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-green-50 dark:bg-green-500/5 p-8 rounded-[2.5rem] border border-green-100 dark:border-green-500/20 text-left">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Success!</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-[11px]">{results.length} Image{results.length !== 1 ? 's' : ''} generated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {resultUrl && (
                      <a href={resultUrl} download={isImgToPdf ? "converted.pdf" : "converted_images.zip"} className="flex-1 sm:flex-none px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                        <Download size={20} /> Download {results.length > 1 ? "Batch (ZIP)" : "File"}
                      </a>
                    )}
                    <button onClick={reset} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-red-500 transition-all hover:scale-110">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((res, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-5 group hover:shadow-2xl transition-all relative">
                      <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-900 relative border border-slate-50 dark:border-slate-700">
                        {res.preview ? (
                          <img src={res.preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <FileText size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                           <ImageIcon className="text-white/40" size={48} />
                           <span className="text-white font-outfit text-[11px] font-medium uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">Result Image</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 px-1">
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-medium text-slate-900 dark:text-white uppercase truncate tracking-tighter mb-1">{res.name}</p>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Individual Download</p>
                          </div>
                        </div>
                        <a href={res.url} download={res.name} className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl hover:scale-110 transition-all group/btn relative overflow-hidden">
                          <Download size={20} className="relative z-10" />
                          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {files.map((f) => (
                    <div key={f.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 group shadow-sm hover:shadow-xl transition-all">
                      {f.preview ? (
                        <img src={f.preview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                           <FileText size={40} />
                           <span className="text-[8px] font-medium uppercase truncate px-4 w-full text-center">{f.file.name}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button onClick={() => removeFile(f.id)} className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-xl text-red-500 shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90">
                         <X size={16} />
                      </button>
                    </div>
                 ))}
                 <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all bg-slate-50/10 group relative overflow-hidden">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl group-hover:scale-110 transition-transform relative z-10">
                      <RefreshCw size={24} />
                    </div>
                    <span className="text-[9px] font-medium uppercase tracking-widest mt-4 relative z-10">Add More</span>
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: "Native Engine", desc: "No wait times. Everything happens instantly on your device hardware.", icon: Layers },
              { title: "Smart Batches", desc: "Process hundreds of items. ZIP archives are created automatically.", icon: Zap },
              { title: "Ironclad Privacy", desc: "We never see your files. Zero server-side uploads or data logs.", icon: ShieldCheck },
            ].map((feat, i) => (
              <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner" style={{ color: ACCENT }}>
                  <feat.icon size={28} />
                </div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 leading-none">{feat.title}</h5>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <input 
        ref={fileInputRef} 
        type="file" 
        multiple 
        onChange={e => addFiles(e.target.files)} 
        accept={isPdfToImg ? ".pdf" : (sourceFormat === 'jpg' || sourceFormat === 'jpeg') ? ".jpg,.jpeg" : `.${sourceFormat}`} 
        className="hidden" 
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>
    </div>
  );
}



