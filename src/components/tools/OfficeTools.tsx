"use client";

import { useState, useRef } from 'react';
import {
  Upload, FileText, Loader2, X,
  Download, CheckCircle2, FileSpreadsheet,
  Presentation, Globe, Plus, Lock, Trash2,
  Smartphone, Rocket, Zap, Shield, Sparkles,
  RefreshCw
} from 'lucide-react';

const TOOL_INFO: Record<string, {
  title: string;
  gradient: string;
  accent: string;
  icon: any;
  ext: string;
  accept: string;
  type: string;
  apiId: string;
}> = {
  'word-to-pdf': { title: 'Word to PDF', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', accent: '#2563eb', icon: FileText, ext: '.doc, .docx', accept: '.doc,.docx', type: 'Word', apiId: 'word-to-pdf' },
  'docx-to-pdf': { title: 'DOCX to PDF', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', accent: '#2563eb', icon: FileText, ext: '.docx', accept: '.docx', type: 'DOCX', apiId: 'docx-to-pdf' },
  'pdf-to-word': { title: 'PDF to Word', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', accent: '#2563eb', icon: FileText, ext: '.pdf', accept: '.pdf', type: 'PDF', apiId: 'pdf-to-word' },
  'pdf-to-docx': { title: 'PDF to DOCX', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', accent: '#2563eb', icon: FileText, ext: '.pdf', accept: '.pdf', type: 'PDF', apiId: 'pdf-to-docx' },
  'excel-to-pdf': { title: 'Excel to PDF', gradient: 'linear-gradient(135deg,#16a34a,#15803d)', accent: '#16a34a', icon: FileSpreadsheet, ext: '.xls, .xlsx', accept: '.xls,.xlsx', type: 'Excel', apiId: 'excel-to-pdf' },
  'pdf-to-excel': { title: 'PDF to Excel', gradient: 'linear-gradient(135deg,#16a34a,#15803d)', accent: '#16a34a', icon: FileSpreadsheet, ext: '.pdf', accept: '.pdf', type: 'PDF', apiId: 'pdf-to-excel' },
  'ppt-to-pdf': { title: 'PowerPoint to PDF', gradient: 'linear-gradient(135deg,#ea580c,#c2410c)', accent: '#ea580c', icon: Presentation, ext: '.ppt, .pptx', accept: '.ppt,.pptx', type: 'PowerPoint', apiId: 'ppt-to-pdf' },
  'pdf-to-ppt': { title: 'PDF to PowerPoint', gradient: 'linear-gradient(135deg,#ea580c,#c2410c)', accent: '#ea580c', icon: Presentation, ext: '.pdf', accept: '.pdf', type: 'PDF', apiId: 'pdf-to-ppt' },
  'html-to-pdf': { title: 'HTML to PDF', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)', accent: '#7c3aed', icon: Globe, ext: '.html, .htm', accept: '.html,.htm', type: 'HTML', apiId: 'html-to-pdf' },
};

export default function OfficeTools({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const info = TOOL_INFO[id] || TOOL_INFO['word-to-pdf'];
  const [from, to] = info.title.split(' to ');

  const handleReset = () => { setFile(null); setResultUrl(null); if (inputRef.current) inputRef.current.value = ''; };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setFile(e.target.files[0]); setResultUrl(null); e.target.value = ''; }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setResultUrl(null); }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', info.apiId);
      const res = await fetch('/api/convert', { method: 'POST', body: formData });
      let data;
      const ct = res.headers.get('content-type');
      if (ct?.includes('application/json')) { data = await res.json(); }
      else { const t = await res.text(); console.error('API error:', t); throw new Error(`Server error (${res.status}).`); }
      if (!res.ok) throw new Error(data?.error || 'Conversion failed');
      setResultUrl(data.url);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to convert file.');
    } finally {
      setProcessing(false);
    }
  };

  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[560px] flex flex-col relative overflow-hidden">

          {/* BG glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-40" style={{ backgroundColor: `${info.accent}20` }} />

          <input ref={inputRef} type="file" onChange={onFileChange} accept={info.accept} className="hidden" />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: info.gradient, boxShadow: `0 10px 40px ${info.accent}30` }}>
              <info.icon size={32} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
              {info.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
              Easily convert your {from} files to {to} — free, fast &amp; secure
            </p>
          </div>

          {/* Success banner */}
          {resultUrl && (
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Converted!</h2>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Your {to} file is ready to download</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <a
                  href={resultUrl}
                  download={`converted_${file?.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : 'output'}.${to.toLowerCase()}`}
                  className="px-8 py-4 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto whitespace-nowrap"
                  style={{ background: info.gradient }}
                >
                  <Download size={18} /> Download {to}
                </a>
                <button onClick={handleReset} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                  <RefreshCw size={18} /> Convert Another
                </button>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">

            {/* Feature pills — shown when no file */}
            {!file && !resultUrl && (
              <div className="hidden sm:flex items-center justify-center gap-6 w-full mb-6">
                {[
                  { icon: Zap, title: "Instant", desc: "Lightning fast" },
                  { icon: Shield, title: "Private", desc: "Files stay secure" },
                  { icon: Sparkles, title: "Accurate", desc: "Format preserved" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: info.accent, backgroundColor: `${info.accent}15` }}>
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
            <div
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
              onClick={() => !file && !resultUrl && inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              {!file && !resultUrl ? (
                <>
                  {/* File type icon with upload badge */}
                  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                      <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase" style={{ background: info.gradient }}>
                        {info.ext.split(',')[0].replace('.', '').toUpperCase()}
                      </div>
                      <div className="m-auto text-slate-300 dark:text-slate-600">
                        <info.icon size={32} />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: info.gradient }}>
                      <Upload size={20} strokeWidth={3} />
                    </div>
                    <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: info.accent }} />
                    <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: info.accent }} />
                    <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: info.accent }} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                    Drag &amp; drop your {info.type} file here
                  </h3>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to <span style={{ color: info.accent }}>browse</span>
                  </p>
                  <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                    Supports {info.ext} files
                  </p>

                  <button
                    className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3 whitespace-nowrap"
                    style={{ background: info.gradient }}
                  >
                    <Plus size={20} /> SELECT {info.type} FILE
                  </button>
                </>
              ) : file && !resultUrl ? (
                /* File selected — card + convert button */
                <div className="w-full space-y-5" onClick={e => e.stopPropagation()}>

                  {/* Feature pills — 3 col bordered cards */}
                  <div className="grid grid-cols-3 gap-2 w-full pb-4 border-b border-slate-100 dark:border-slate-800">
                    {[
                      { icon: Zap, title: "Instant", desc: "In your browser" },
                      { icon: Shield, title: "Private", desc: "No server upload" },
                      { icon: Sparkles, title: "Accurate", desc: "Format preserved" }
                    ].map((f, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ color: info.accent, backgroundColor: `${info.accent}15` }}>
                          <f.icon size={16} />
                        </div>
                        <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-none">{f.title}</p>
                        <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium leading-none">{f.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* File card */}
                  <div className="flex flex-row items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-xl shadow-md text-white shrink-0" style={{ background: info.gradient }}>
                      <info.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight mb-0.5">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{fmt(file.size)}</span>
                        <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: info.accent, backgroundColor: `${info.accent}15` }}>{info.type} File</span>
                      </div>
                    </div>
                    <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-red-200 hover:scale-110 shrink-0">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Processing indicator */}
                  {processing && (
                    <div className="p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Loader2 size={40} className="animate-spin mx-auto" style={{ color: info.accent }} strokeWidth={1.5} />
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">Converting...</p>
                    </div>
                  )}

                  {/* Convert + Start Over — stacked on mobile, row on desktop */}
                  {!processing && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleConvert}
                        disabled={processing}
                        className="w-full sm:flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-sm sm:text-lg font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                        style={{ background: info.gradient }}
                      >
                        <Sparkles size={18} /> Convert to {to}
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full sm:w-auto sm:px-6 py-3 sm:py-5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} /> Start Over
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Feature grid — shown when no file */}
            {!file && !resultUrl && (
              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                  { icon: Smartphone, title: "Works on Mobile", desc: "Any device" },
                  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: info.accent, backgroundColor: `${info.accent}10` }}>
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
      </div>
    </div>
  );
}
