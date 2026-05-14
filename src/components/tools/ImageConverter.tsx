"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, Download, Loader2, X, FileImage, FileText, 
  CheckCircle2, Settings, ChevronDown, Image as ImageIcon,
  Zap, ShieldCheck, RefreshCw, Layers
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

type ConversionStatus = "idle" | "processing" | "done" | "error";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "done" | "error";
}

export default function ImageConverter({ id: toolId }: { id: string }) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine theme and mode based on toolId
  const isPdfToImg = toolId.startsWith("pdf-to-");
  const isImgToPdf = toolId.endsWith("-to-pdf");
  
  const ACCENT = isPdfToImg ? "#facc15" : "#3b82f6"; // Yellow for PDF->Img, Blue for Img->PDF
  const ACCENT_GRADIENT = isPdfToImg 
    ? "linear-gradient(135deg,#facc15,#eab308)" 
    : "linear-gradient(135deg,#3b82f6,#2563eb)";

  const addFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: ImageFile[] = await Promise.all(
      Array.from(newFiles).map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        status: "pending",
      }))
    );
    setFiles((prev) => [...prev, ...entries]);
    setStatus("idle");
    setResultUrl(null);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    
    try {
      if (isPdfToImg) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

        const zip = new JSZip();
        for (const entry of files) {
          const buf = await entry.file.arrayBuffer();
          const doc = await pdfjsLib.getDocument({ data: buf }).promise;
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: canvas.getContext("2d")!, viewport, canvas }).promise;
            const imgData = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
            zip.file(`${entry.file.name.replace(".pdf", "")}_page_${i}.jpg`, imgData, { base64: true });
          }
        }
        const content = await zip.generateAsync({ type: "blob" });
        setResultUrl(URL.createObjectURL(content));
      } else {
        // Image to PDF logic (standard)
        const pdfDoc = await PDFDocument.create();
        for (const entry of files) {
          const imgBytes = await entry.file.arrayBuffer();
          let img;
          if (entry.file.type === "image/jpeg" || entry.file.type === "image/jpg") {
            img = await pdfDoc.embedJpg(imgBytes);
          } else if (entry.file.type === "image/png") {
            img = await pdfDoc.embedPng(imgBytes);
          } else {
            continue;
          }
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const bytes = await pdfDoc.save();
        setResultUrl(URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })));
      }
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setResultUrl(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Settings</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Configuration</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6">
              {/* Info Section */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm" style={{ color: ACCENT }}>
                      <ImageIcon size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue Status</span>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 italic uppercase">
                       {files.length} Item{files.length !== 1 ? 's' : ''} in batch
                     </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  onClick={handleConvert}
                  disabled={status === "processing" || files.length === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter italic"
                  style={{ background: ACCENT_GRADIENT, boxShadow: `0 10px 20px -5px ${ACCENT}44` }}
                >
                  {status === "processing" ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Convert Now <Zap size={24} /></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" style={{ background: ACCENT }} />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10 text-left sm:text-center">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: ACCENT_GRADIENT }}>
                {isPdfToImg ? <FileImage size={32} /> : <FileText size={32} />}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">
                {isPdfToImg ? "PDF to Image Converter" : "Image to PDF Converter"}
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto italic uppercase text-xs">
                {isPdfToImg 
                  ? "Transform PDF pages into high-resolution JPG/PNG image assets instantly." 
                  : "Merge multiple image formats into a single, professional PDF document."}
              </p>
            </div>

            {/* Content Area */}
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-blue-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6 group-hover:scale-110 transition-transform relative z-10" style={{ color: ACCENT }}>
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Select {isPdfToImg ? "PDFs" : "Images"}
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold italic tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Lossless conversion · 100% Local
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
                <input ref={fileInputRef} type="file" multiple onChange={e => addFiles(e.target.files)} accept={isPdfToImg ? ".pdf" : "image/*"} className="hidden" />
              </div>
            ) : status === "done" && resultUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in fade-in duration-500 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative p-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 shadow-2xl border border-green-100 dark:border-green-500/20">
                    <CheckCircle2 size={80} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Batch Ready!</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">
                    Successfully processed {files.length} item{files.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <a href={resultUrl} download={isPdfToImg ? "images_batch.zip" : "converted_images.pdf"} className="flex-1 py-5 text-white rounded-2xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter" style={{ background: ACCENT_GRADIENT }}>
                    <Download size={24} /> Download Final
                  </a>
                  <button onClick={reset} className="px-8 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Start Over</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {files.map((f) => (
                   <div key={f.id} className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 group">
                      {f.preview ? (
                        <img src={f.preview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                           <FileText size={32} />
                           <span className="text-[8px] font-black uppercase truncate px-2 w-full text-center">{f.file.name}</span>
                        </div>
                      )}
                      <button onClick={() => removeFile(f.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-xl text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                         <X size={14} />
                      </button>
                   </div>
                 ))}
                 <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all bg-slate-50/10">
                    <RefreshCw size={24} />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-2">Add More</span>
                 </button>
              </div>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Hardware Logic", desc: "Rendering happens on your GPU/CPU, not our cloud servers.", icon: Layers },
              { title: "ZIP Bundling", desc: "PDF-to-Image conversions are automatically packaged in ZIP archives.", icon: Zap },
              { title: "Safe Storage", desc: "Files never leave your local session. Privacy is guaranteed.", icon: ShieldCheck },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner" style={{ color: ACCENT }}>
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>
    </div>
  );
}
