"use client";

import { useState, useRef } from 'react';
import {
  Upload, Loader2, X, Download,
  CheckCircle2, Plus, LifeBuoy,
  FileText, ShieldAlert, RefreshCw,
  Lock, Trash2, Smartphone, Rocket, Zap, Shield, Sparkles
} from 'lucide-react';

interface RepairFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  repairedName?: string;
}

export default function RepairTool({ id: _id }: { id: string }) {
  const [files, setFiles] = useState<RepairFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#ef4444";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#ef4444,#dc2626)";

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let newFiles: File[] = [];
    if ('target' in e && 'files' in e.target && e.target.files) {
      newFiles = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      newFiles = Array.from(e.dataTransfer.files);
    }

    const validFiles = newFiles.filter(f => f.type === 'application/pdf');

    const repairFiles: RepairFile[] = validFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      status: 'pending' as const
    }));

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

      updatedFiles[i] = { ...updatedFiles[i], status: 'processing' };
      setFiles([...updatedFiles]);

      try {
        const formData = new FormData();
        formData.append('file', updatedFiles[i].file);
        formData.append('id', 'repair-pdf');

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error("Repair API error response:", text);
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }

        if (!response.ok) {
          throw new Error(data?.error || `Server Error: ${response.status}`);
        }

        updatedFiles[i] = {
          ...updatedFiles[i],
          resultUrl: data.url,
          repairedName: `repaired_${updatedFiles[i].file.name}`,
          status: 'completed'
        };
      } catch (err: any) {
        console.error('Repair Error:', err);
        updatedFiles[i] = { ...updatedFiles[i], status: 'error' };
      }
      setFiles([...updatedFiles]);
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileDrop}
            accept=".pdf"
            className="hidden"
          />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-red-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
              <LifeBuoy size={32} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
              PDF Repair &amp; Recovery
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
              Recover data from corrupted or unreadable PDF documents
            </p>
          </div>

          {/* Success Banner */}
          {files.some(f => f.status === 'completed') && (
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Repaired!</h2>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Structural recovery complete for your files</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <button onClick={resetAll} className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                  <RefreshCw size={18} /> Start Over
                </button>
              </div>
            </div>
          )}

          {/* Upload / File List */}
          <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">

            {/* Mini feature pills — shown when no files yet */}
            {files.length === 0 && (
              <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
                {[
                  { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
                  { icon: Shield, title: "Private", desc: "Your files stay secure" },
                  { icon: Sparkles, title: "Smart", desc: "Deep structural analysis" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            <div
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFileDrop(e); }}
            >
              {/* PDF icon with upload badge */}
              <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                  <div className="m-auto text-slate-300 dark:text-slate-600">
                    <LifeBuoy size={32} />
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
                Supports single or multiple PDF files
              </p>

              {files.length === 0 ? (
                <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                  <Plus size={20} /> SELECT PDF FILES
                </button>
              ) : (
                <button
                  className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
                  style={{ background: ACCENT_GRADIENT }}
                  onClick={e => { e.stopPropagation(); handleRepair(); }}
                  disabled={processing}
                >
                  {processing ? (
                    <><Loader2 className="animate-spin" size={20} /> REPAIRING...</>
                  ) : (
                    <><LifeBuoy size={20} /> REPAIR PDF</>
                  )}
                </button>
              )}
            </div>

            {/* Feature grid — shown when no files */}
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

            {/* File list */}
            {files.length > 0 && (
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LifeBuoy size={14} /> Repair Queue ({files.length})
                  </div>
                  <button onClick={resetAll} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">
                    Clear All
                  </button>
                </div>
                <div className="space-y-3">
                  {files.map((f) => (
                    <div key={f.id} className="flex flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm gap-3 group hover:shadow-md transition-all relative overflow-hidden">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl shadow-md transition-all shrink-0 ${f.status === 'completed' ? 'bg-green-500 text-white' : f.status === 'error' ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-800 text-red-500'}`}>
                        {f.status === 'processing' ? <Loader2 className="animate-spin" size={20} /> : f.status === 'completed' ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                      </div>

                      {/* File info */}
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight leading-none mb-1">{f.file.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {f.status === 'processing' ? (
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin" /> Repairing...
                            </span>
                          ) : f.status === 'completed' ? (
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 size={10} /> Repaired
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
                          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{(f.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {f.resultUrl && (
                          <a href={f.resultUrl} download={f.repairedName} className="px-3 py-2 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-1.5" style={{ background: ACCENT_GRADIENT }}>
                            <Download size={12} /> Save
                          </a>
                        )}
                        {f.status !== 'processing' && (
                          <button onClick={() => removeFile(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 hover:border-red-200">
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      {f.status === 'processing' && (
                        <div className="absolute bottom-0 left-0 h-0.5 bg-red-500" style={{ width: '100%', animation: 'progress 2s infinite linear' }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add more */}
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-red-500 hover:border-red-400 transition-all bg-slate-50/10 group">
                  <Plus size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium uppercase tracking-widest">Add More Files</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Deep Analysis", desc: "Our engine scans internal file tables for structural anomalies.", icon: LifeBuoy },
            { title: "Smart Recovery", desc: "Rebuilds corrupted cross-reference tables and object streams.", icon: ShieldAlert },
            { title: "Batch Support", desc: "Repair multiple documents simultaneously with high priority.", icon: FileText },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <feat.icon size={24} />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">{feat.desc}</p>
            </div>
          ))}
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
