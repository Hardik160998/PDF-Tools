"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Zap, FileText, Plus,
  CheckCircle2, Settings, ChevronDown, ShieldCheck,
  TrendingDown, Database, FilePlus, Shield, Layers, 
  MousePointer2, RefreshCw, Lock, Trash2, Smartphone, Rocket
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/lib/supabase';
import { verifyAndIncrementUsage } from '@/lib/usage';

interface CompressedFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  resultUrl?: string;
  oldSize: number;
  newSize?: number;
}

export default function Compressor({ id: _id }: { id: string }) {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#10b981";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#10b981,#059669)";

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: CompressedFile[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
      oldSize: file.size
    }));
    setFiles(prev => [...prev, ...entries]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    const check = await verifyAndIncrementUsage(supabase);
    if (!check.allowed) {
      if (confirm(check.error || "You have reached your daily limit of 3 operations. Upgrade to Premium for unlimited downloads?")) {
        window.location.href = "/premium-plans";
      }
      return;
    }

    setProcessing(true);
    const updatedFiles = [...files];
    try {
      for (let i = 0; i < updatedFiles.length; i++) {
        const entry = updatedFiles[i];
        if (entry.status === 'done') continue;

        updatedFiles[i] = { ...entry, status: "processing" };
        setFiles([...updatedFiles]);

        const arrayBuffer = await entry.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');

        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

        updatedFiles[i] = {
          ...entry,
          status: "done",
          resultUrl: URL.createObjectURL(blob),
          newSize: pdfBytes.length
        };
        setFiles([...updatedFiles]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    files.forEach(f => f.resultUrl && URL.revokeObjectURL(f.resultUrl));
    setFiles([]);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 min-h-[600px] flex flex-col relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            <div className="relative text-center space-y-4 mb-10">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto shadow-emerald-500/20" style={{ background: ACCENT_GRADIENT }}>
                <Zap size={32} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                Swift Compressor
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                Professional local optimization for multiple PDF files
              </p>
            </div>

            {/* Success Banner */}
            {files.some(f => f.status === 'done') && (
              <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Shrink Complete</h2>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Optimized documents are ready for local download</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <button onClick={reset} className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                    <RefreshCw size={18} /> Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Upload / File List */}
            {files.length === 0 ? (
              <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">
                <div
                  className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6 z-10"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                >
                  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                      <div className="m-auto text-slate-300 dark:text-slate-600">
                        <FilePlus size={32} />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                      <Upload size={20} strokeWidth={3} />
                    </div>
                    <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                    <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                    Drag &amp; drop your PDF files here
                  </h3>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to <span style={{ color: ACCENT }}>browse</span>
                  </p>
                  <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                    Supports multiple PDF files
                  </p>

                  <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                    <Plus size={20} /> SELECT PDF FILES
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                <div className="grid grid-cols-1 gap-4">
                  {files.map((f) => (
                    <div key={f.id} className="flex flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm gap-3 group hover:shadow-md transition-all relative overflow-hidden">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl shadow-md transition-all shrink-0 ${f.status === 'done' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-emerald-500'}`}>
                        {f.status === 'processing' ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                      </div>

                      {/* File Info */}
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight leading-none mb-1">{f.file.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {f.status === 'processing' ? (
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin" /> Compressing...
                            </span>
                          ) : f.status === 'done' ? (
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 size={10} /> Done
                            </span>
                          ) : f.status === 'error' ? (
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <X size={10} /> Failed
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              Ready
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{(f.oldSize / 1024 / 1024).toFixed(2)} MB</span>
                          {f.newSize && (
                            <span className="text-[9px] text-emerald-500 font-bold">→ {(f.newSize / 1024 / 1024).toFixed(2)} MB (-{Math.round(((f.oldSize - f.newSize) / f.oldSize) * 100)}%)</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {f.resultUrl && (
                          <a href={f.resultUrl} download={`compressed_${f.file.name}`} className="px-3 py-2 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-1.5" style={{ background: ACCENT_GRADIENT }}>
                            <Download size={12} /> Save
                          </a>
                        )}
                        <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 hover:border-red-200">
                          <X size={16} />
                        </button>
                      </div>

                      {f.status === 'processing' && (
                        <div className="absolute bottom-0 left-0 h-0.5 bg-emerald-500" style={{ width: '100%', animation: 'progress 2s infinite linear' }} />
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={() => fileInputRef.current?.click()} className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-4 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all bg-slate-50/10 group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <FilePlus size={24} />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest">Add More Documents</span>
                </button>

                {/* Compress Button */}
                <button
                  onClick={handleCompress}
                  disabled={processing || files.every(f => f.status === 'done')}
                  className="w-full py-5 text-white rounded-[1.5rem] text-lg font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" size={22} /> Compressing...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Optimize All <Zap size={22} /></span>
                  )}
                </button>
              </div>
            )}

            {/* Universal Feature Grid */}
            <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
              {[
                { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
                { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
              ].map((feat, i) => (
                <div key={i} className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
                    <feat.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{feat.title}</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <input ref={fileInputRef} type="file" multiple onChange={e => addFiles(e.target.files)} accept=".pdf" className="hidden" />
          </div>
        </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
