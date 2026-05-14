"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Loader2, X, Download, 
  CheckCircle2, Plus, LifeBuoy, 
  Settings, ChevronDown, FileText, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RepairFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  repairedName?: string;
}

export default function RepairTool({ id: _id }: { id: string }) {
  const [files, setFiles] = useState<RepairFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#ef4444"; // Red
  const ACCENT_GRADIENT = "linear-gradient(135deg,#ef4444,#dc2626)";

  const generateThumbnail = async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

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
    if ('target' in e && 'files' in e.target && e.target.files) {
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

  const resetAll = () => { setFiles([]); };

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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Repair Tools</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Recovery</h3>
              <button onClick={resetAll} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6">
              {/* Info Box */}
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={14} className="text-red-500" />
                  <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Repair Info</span>
                </div>
                <p className="text-[10px] font-bold text-red-600 dark:text-red-300 leading-relaxed">
                  Corrupted PDFs are analyzed and rebuilt using our restoration engine. Some formats may change if data recovery requires it.
                </p>
              </div>

              {/* Selection List */}
              {files.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Selected Files ({files.length})</span>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {files.map(f => (
                      <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-red-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 flex items-center justify-center rounded-lg shadow-sm shrink-0 ${f.status === 'completed' ? 'bg-green-500 text-white' : f.status === 'error' ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-800 text-red-500'}`}>
                             {f.status === 'completed' ? <CheckCircle2 size={12} /> : <FileText size={12} />}
                          </div>
                          <span className="text-[10px] font-black truncate text-slate-900 dark:text-white uppercase">{f.file.name}</span>
                        </div>
                        {f.status === 'completed' ? (
                          <a href={f.resultUrl} download={f.repairedName} className="p-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:scale-110 transition-transform">
                             <Download size={10} />
                          </a>
                        ) : (
                          <button onClick={() => removeFile(f.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                    <Plus size={14} /> Add More
                  </button>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleRepair}
                  disabled={processing || files.length === 0}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-red-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Repairing...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Repair Batch <LifeBuoy size={24} /></span>
                  )}
                </button>
                <p className="text-[9px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Secure data recovery engine active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10 text-left sm:text-center">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-red-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
                <LifeBuoy size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                PDF Repair & Recovery
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto uppercase text-xs">
                Recover data from corrupted or unreadable PDF documents. We analyze and rebuild internal structures.
              </p>
            </div>

            {/* Upload Area */}
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-red-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-red-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Drop Damaged PDFs
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Scan and reconstruct corrupted file tables
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
                <input ref={fileInputRef} type="file" multiple onChange={handleFileDrop} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar p-1 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center relative z-10">
                <AnimatePresence>
                  {files.map((f) => (
                    <motion.div
                      key={f.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative aspect-[3/4] group"
                    >
                      <div className={`absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 ${f.status === 'completed' ? 'border-green-500/50' : f.status === 'error' ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`}>
                        {f.preview ? (
                          <img src={f.preview} className="w-full h-full object-contain p-2" alt="Preview" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-100 dark:text-slate-800">
                            <LifeBuoy size={48} className="animate-pulse" />
                          </div>
                        )}

                        {/* Processing overlay */}
                        {f.status === 'processing' && (
                          <div className="absolute inset-0 bg-red-600/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <Loader2 className="animate-spin text-white mb-2" size={32} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Fixing...</span>
                          </div>
                        )}

                        {/* Completed overlay */}
                        {f.status === 'completed' && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-white rounded-full p-2 shadow-2xl scale-125">
                              <CheckCircle2 className="text-green-500" size={24} />
                            </div>
                          </div>
                        )}

                        {/* File info overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10 text-left">
                          <p className="text-[10px] text-white font-black truncate uppercase tracking-tighter">{f.file.name}</p>
                        </div>
                      </div>

                      {/* Floating actions */}
                      <div className="absolute -top-2 -right-2 z-30 flex gap-1">
                        {f.status === 'completed' ? (
                          <a href={f.resultUrl} download={f.repairedName} className="w-8 h-8 bg-green-500 text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <Download size={14} />
                          </a>
                        ) : f.status !== 'processing' && (
                          <button onClick={() => removeFile(f.id)} className="w-8 h-8 bg-white dark:bg-slate-800 text-red-500 rounded-xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] rounded-2xl border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-200 hover:text-red-500 hover:border-red-500 transition-all bg-slate-50/20 dark:bg-slate-900/20 group"
                >
                  <Plus size={48} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-4">Add More</span>
                </button>
              </div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Deep Analysis", desc: "Our engine scans internal file tables for structural anomalies.", icon: LifeBuoy },
              { title: "Smart Recovery", desc: "Rebuilds corrupted cross-reference tables and object streams.", icon: ShieldAlert },
              { title: "Batch Support", desc: "Repair multiple documents simultaneously with high priority.", icon: FileText },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
