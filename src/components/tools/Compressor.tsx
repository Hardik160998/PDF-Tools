"use client";

import { useState, useRef } from 'react';
import { 
  Upload, Download, Loader2, X, Zap, FileText, 
  CheckCircle2, Settings, ChevronDown, ShieldCheck,
  TrendingDown, Database
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function Compressor({ id: _id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; oldSize: number; newSize: number } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#10b981"; // Emerald
  const ACCENT_GRADIENT = "linear-gradient(135deg,#10b981,#059669)";

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      e.target.value = '';
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression: Remove metadata and optimize for production
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      setResult({
        url: URL.createObjectURL(blob),
        oldSize: file.size,
        newSize: pdfBytes.length
      });
    } catch (err) {
      console.error(err);
      alert("Error compressing PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => { setFile(null); setResult(null); };
  const saved = result ? Math.round((1 - result.newSize / result.oldSize) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Compressor Tools</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Tools</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Clear</button>
            </div>

            <div className="space-y-6 text-left">
              {/* Status Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">Analysis</span>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-emerald-500">
                      <Database size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Info</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 italic uppercase">
                    {file ? `Size: ${formatSize(file.size)}` : 'No file selected'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!result ? (
                  <button
                    onClick={handleCompress}
                    disabled={processing || !file}
                    className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter italic shadow-emerald-500/20"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Compressing...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">Compress Now <Zap size={24} /></span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center animate-in zoom-in">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">Space Reclaimed</p>
                      <p className="text-3xl font-black text-emerald-600 italic tracking-tighter">-{saved}%</p>
                    </div>
                    <a
                      href={result.url}
                      download={`compressed_${file?.name || 'document.pdf'}`}
                      className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter italic shadow-emerald-500/20"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <Download size={24} /> Download PDF
                    </a>
                    <button onClick={reset} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Compress Another</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20" style={{ background: ACCENT_GRADIENT }}>
                <Zap size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">
                Swift PDF Compressor
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto">
                Shrink your documents by optimizing object streams and metadata. Quality preserved, size reduced.
              </p>
            </div>

            {/* Upload Area */}
            {!file ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-emerald-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-emerald-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Select Large PDF
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold italic tracking-tight text-center relative z-10">
                  Advanced structural optimization without re-rendering pages
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose File
                </button>
                <input ref={fileInputRef} type="file" onChange={onFileChange} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* File Info Card */}
                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                   <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
                      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shrink-0 group-hover:rotate-12 transition-transform">
                        <FileText size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter truncate">{file.name}</h4>
                         <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">{formatSize(file.size)}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full italic">Ready to Compress</span>
                         </div>
                      </div>
                      <button onClick={reset} className="p-3 text-slate-300 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                        <X size={24} />
                      </button>
                   </div>
                   {/* Background icon decoration */}
                   <Database size={120} className="absolute -bottom-10 -right-10 text-slate-200/20 dark:text-slate-700/20 -rotate-12 pointer-events-none" />
                </div>

                {/* Processing Visualization */}
                {processing && (
                  <div className="p-10 text-center space-y-6">
                    <div className="relative inline-block">
                       <Loader2 size={80} className="animate-spin text-emerald-500 mx-auto" strokeWidth={1} />
                       <Database className="absolute inset-0 m-auto text-emerald-500/20" size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter animate-pulse">Scanning Cross-Reference Tables...</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">Optimizing internal object streams and purging redundant metadata</p>
                    </div>
                  </div>
                )}

                {/* Post-Process stats */}
                {result && !processing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                     <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <TrendingDown size={24} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Size</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{formatSize(result.oldSize)}</p>
                     </div>
                     <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center">
                        <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Final Size</p>
                        <p className="text-xl font-black text-emerald-600 tracking-tighter italic">{formatSize(result.newSize)}</p>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Browser Native", desc: "No uploads required. Processing happens 100% on your local hardware.", icon: ShieldCheck },
              { title: "Stream Optimized", desc: "Uses object streams and cross-reference table compression.", icon: Database },
              { title: "Privacy First", desc: "Secure local processing for sensitive documents.", icon: Zap },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  <feat.icon size={24} />
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
