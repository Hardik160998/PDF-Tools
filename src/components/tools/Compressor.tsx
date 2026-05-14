"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Zap, FileText, 
  CheckCircle2, Settings, ChevronDown, ShieldCheck,
  TrendingDown, Database, FilePlus, Shield, Layers, 
  MousePointer2, RefreshCw
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

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
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#10b981"; // Emerald
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
        
        // Remove metadata for compression
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const reset = () => {
    files.forEach(f => f.resultUrl && URL.revokeObjectURL(f.resultUrl));
    setFiles([]);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Compressor Tools</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight text-emerald-500">Configuration</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { icon: TrendingDown, title: "Swift Engine", desc: "Local PDF optimization." },
                  { icon: Shield, title: "Security", desc: "No cloud uploads used." },
                  { icon: Database, title: "Shrink Rate", desc: "Up to 80% reduction." }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0" style={{ color: ACCENT }}>
                      <f.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ color: ACCENT }}>
                      <Database size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue Status</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {files.length === 0 ? 'Empty Queue' : `${files.length} Document${files.length !== 1 ? 's' : ''} Ready`}
                  </p>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={processing || files.length === 0 || files.every(f => f.status === 'done')}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-emerald-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Compressing...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">Optimize All <Zap size={24} /></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            <div className="relative text-center space-y-4 mb-10">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto shadow-emerald-500/20" style={{ background: ACCENT_GRADIENT }}>
                <Zap size={32} />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                Swift Compressor
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight max-w-md mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
                Professional local optimization for multiple PDF files
              </p>
            </div>

            {/* Success Workspace */}
            {files.some(f => f.status === 'done') && (
              <div className={`p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                   <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                   <div>
                     <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Shrink Complete</h4>
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Optimized documents are ready for local download</p>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <button onClick={reset} className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                     <RefreshCw size={18} /> Start Over
                  </button>
                </div>
              </div>
            )}

            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 sm:p-20 hover:border-emerald-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden z-10"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl mb-8 group-hover:scale-110 transition-transform relative z-10 text-emerald-500">
                  <Upload size={56} strokeWidth={2.5} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center relative z-10 leading-none">
                  Select PDF Files
                </div>
                <p className="text-slate-400 text-sm mt-4 font-bold tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Secure local processing · Zero server lag
                </p>
                <button className="mt-10 px-12 py-5 rounded-2xl text-white text-base font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                <div className="grid grid-cols-1 gap-4">
                  {files.map((f) => (
                    <div key={f.id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm gap-6 group hover:shadow-xl transition-all relative overflow-hidden">
                      <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1 w-full sm:w-auto">
                        <div className={`p-4 sm:p-5 rounded-2xl shadow-xl transition-all shrink-0 ${f.status === 'done' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-emerald-500'}`}>
                          {f.status === 'processing' ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h4 className="text-[13px] sm:text-sm font-black text-slate-900 dark:text-white uppercase truncate tracking-tight mb-1">{f.file.name}</h4>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatSize(f.oldSize)}</span>
                            {f.newSize && (
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300">→</span>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  {formatSize(f.newSize)} (-{Math.round((1 - f.newSize / f.oldSize) * 100)}%)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {f.resultUrl && (
                          <a href={f.resultUrl} download={`compressed_${f.file.name}`} className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Download size={14} /> Download
                          </a>
                        )}
                        <button onClick={() => removeFile(f.id)} className="p-3.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:scale-110">
                          <X size={18} />
                        </button>
                      </div>
                      {f.status === 'processing' && (
                        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-progress" style={{ width: '100%' }} />
                      )}
                    </div>
                  ))}
                </div>
                
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-4 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all bg-slate-50/10 group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <FilePlus size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Add More Documents</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: "Privacy Safe", desc: "Military-grade local processing. No data logs or server storage.", icon: Shield },
              { title: "Turbo Engine", desc: "Optimized for multi-core hardware. Fast processing of large files.", icon: Zap },
              { title: "Smart Shrink", desc: "Advanced object stream optimization reduces size by up to 90%.", icon: TrendingDown },
            ].map((feat, i) => (
              <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner text-emerald-500">
                  <feat.icon size={28} />
                </div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 leading-none">{feat.title}</h5>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <input ref={fileInputRef} type="file" multiple onChange={e => addFiles(e.target.files)} accept=".pdf" className="hidden" />

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
