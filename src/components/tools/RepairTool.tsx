"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Loader2, X, Download, 
  CheckCircle2, Plus, Info, LifeBuoy, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

interface RepairFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  repairedName?: string;
}

export default function RepairTool({ id }: { id: string }) {
  const [files, setFiles] = useState<RepairFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateThumbnail = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
       await page.render({ canvasContext: context!, viewport, canvas }).promise;
      return canvas.toDataURL();
    } catch (e) {
      console.error("Thumbnail error:", e);
      return undefined;
    }
  };

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let newFiles: File[] = [];
    if ('files' in e.target && e.target.files) {
      newFiles = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      newFiles = Array.from(e.dataTransfer.files);
    }

    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    
    const repairFiles: RepairFile[] = await Promise.all(
      validFiles.map(async (f) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        preview: await generateThumbnail(f),
        status: 'pending' as const
      }))
    );

    setFiles(prev => [...prev, ...repairFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRepair = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'completed') continue;
      
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const formData = new FormData();
        formData.append('file', updatedFiles[i].file);
        formData.append('id', 'repair-pdf');

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Repair failed');

        updatedFiles[i].resultUrl = data.url;
        updatedFiles[i].repairedName = `repaired_${updatedFiles[i].file.name}`;
        updatedFiles[i].status = 'completed';
      } catch (err) {
        console.error(err);
        updatedFiles[i].status = 'error';
      }
      setFiles([...updatedFiles]);
    }

    setProcessing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      {/* Workspace */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Repair PDF Files
            </h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 px-6 font-bold"
            >
              <Plus size={20} /> Add Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileDrop} 
              multiple 
              accept=".pdf" 
              className="hidden" 
            />
          </div>

          {!files.length ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-24 flex flex-col items-center justify-center gap-6 group hover:border-red-500 transition-all cursor-pointer bg-white/50 dark:bg-slate-800/50"
            >
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-red-500 group-hover:scale-110 transition-transform">
                <Upload size={64} />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">Drop damaged PDFs here</p>
                <p className="text-slate-500 font-medium">Click to browse your computer</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-500">
              <AnimatePresence>
                {files.map((f) => (
                  <motion.div 
                    key={f.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative aspect-[3/4] bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden group"
                  >
                    {f.preview ? (
                      <img src={f.preview} className="w-full h-full object-cover p-2" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <LifeBuoy size={48} className="animate-pulse" />
                      </div>
                    )}

                    {/* Overlay status */}
                    {f.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={32} />
                      </div>
                    )}
                    {f.status === 'completed' && f.resultUrl && (
                      <div className="absolute inset-0 z-10 bg-green-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={f.resultUrl} 
                          download={f.repairedName}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest scale-90 hover:scale-100 transition-transform no-underline"
                        >
                          <Download size={14} /> Download
                        </a>
                      </div>
                    )}
                    {f.status === 'completed' && (
                      <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                         <div className="bg-white rounded-full p-2 shadow-xl">
                            <CheckCircle2 className="text-green-500" size={32} />
                         </div>
                      </div>
                    )}

                    {/* Header badges */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button 
                        onClick={() => removeFile(f.id)}
                        className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent z-10">
                       <p className="text-[10px] text-white font-bold truncate">{f.file.name}</p>
                    </div>

                    {f.status === 'completed' && f.resultUrl && (
                      <a 
                        href={f.resultUrl} 
                        download={f.repairedName}
                        className="absolute inset-0 z-0"
                        title="Download Repaired PDF"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] rounded-2xl border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-500 transition-all bg-slate-50/50 dark:bg-slate-900/50 group"
              >
                <Plus size={48} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest mt-4">Add More</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[400px] bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 shadow-2xl flex flex-col">
        <div className="p-8 space-y-8 flex-1">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Repair PDF</h1>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex gap-4">
             <Info className="text-blue-500 shrink-0" size={24} />
             <div className="space-y-2">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">We will try to repair your PDFs.</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">You can get a different file format on download if we detect that format in your file.</p>
             </div>
          </div>

          {!files.length && (
            <div className="py-12 text-center space-y-4">
               <LifeBuoy size={48} className="mx-auto text-slate-200 dark:text-slate-700" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs font-medium px-4">Upload your damaged documents to begin recovery process</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-slate-400">
                  <span>Selected Files</span>
                  <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-[10px]">{files.length}</span>
               </div>
               <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <LifeBuoy size={16} className={f.status === 'completed' ? 'text-green-500' : 'text-red-500'} />
                          <span className="text-xs font-bold truncate dark:text-slate-300">{f.file.name}</span>
                       </div>
                       {f.status === 'completed' ? (
                         <CheckCircle2 size={16} className="text-green-500" />
                       ) : (
                         <button onClick={() => removeFile(f.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                           <X size={16} />
                         </button>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            onClick={handleRepair}
            disabled={processing || files.length === 0}
            className={`w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-4 transition-all disabled:grayscale disabled:opacity-50 group overflow-hidden relative active:scale-95`}
          >
            {processing ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Repair PDF
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Plus className="rotate-45" size={24} />
                </motion.span>
              </>
            )}
            
            {/* Glossy shine effect */}
            <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
          
          <p className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest">Powered by SmartPDFs Shield Recovery Engine</p>
        </div>
      </div>
    </div>
  );
}
