"use client";

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, Download, Loader2, X, FileText, CheckCircle2, 
  Copy, Terminal, FileJson, ShieldCheck, Zap, RefreshCw, Layers,
  Plus, Lock, Trash2, Smartphone, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ExtractionStatus = 'idle' | 'processing' | 'done' | 'error';

export default function ExtractText({ id: toolId }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [xml, setXml] = useState<string>("");
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [mode, setMode] = useState<'text' | 'xml'>(toolId === 'pdf-to-xml' ? 'xml' : 'text');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCENT = "#3b82f6";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#3b82f6,#1e3a8a)";

  const toXML = (pages: any[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<pdf_document name="${file?.name}">\n`;
    pages.forEach((page, i) => {
      xml += `  <page number="${i + 1}">\n`;
      page.items.forEach((item: any) => {
        const escaped = item.str.replace(/[<>&"']/g, (c: string) => {
          switch (c) { case '<': return '&lt;'; case '>': return '&gt;'; case '&': return '&amp;'; case '"': return '&quot;'; case "'": return '&apos;'; default: return c; }
        });
        xml += `    <text>${escaped}</text>\n`;
      });
      xml += `  </page>\n`;
    });
    xml += `</pdf_document>`;
    return xml;
  };

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
    setStatus('processing');
    setText(""); setXml("");
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      let fullText = "";
      const pageData: any[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n\n";
        pageData.push({ items: content.items });
      }

      setText(fullText);
      setXml(toXML(pageData));
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [file]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  const handleCopy = () => {
    const content = mode === 'text' ? text : xml;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = mode === 'text' ? text : xml;
    const blob = new Blob([content], { type: mode === 'text' ? 'text/plain' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file!.name.replace(".pdf", mode === 'text' ? ".txt" : ".xml");
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setText("");
    setXml("");
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          <input ref={fileInputRef} type="file" onChange={e => e.target.files && loadFile(e.target.files[0])} accept=".pdf" className="hidden" />

          {/* Header */}
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
              {mode === 'text' ? <FileText size={32} /> : <FileJson size={32} />}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {mode === 'text' ? 'Extract PDF Text' : 'PDF to XML Converter'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              {mode === 'text' ? 'Pull raw content from your documents with structural integrity.' : 'Convert flat PDF data into machine-readable hierarchical XML schema.'}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">
            
            {/* Feature pills (empty state) */}
            {!file && (
              <div className="hidden sm:flex items-center justify-center gap-6 w-full mb-6">
                {[
                  { icon: Zap,         title: "Instant",  desc: "In your browser" },
                  { icon: ShieldCheck, title: "Private",  desc: "No server upload" },
                  { icon: Layers,      title: "Accurate", desc: "Format preserved" }
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
            <div
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
              onClick={() => !file && fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              {!file ? (
                <>
                  {/* File Type Icon with badges */}
                  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                      <div className="m-auto text-slate-300 dark:text-slate-600">
                        {mode === 'text' ? <FileText size={32} /> : <FileJson size={32} />}
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
                    Drag &amp; drop your PDF file here
                  </h3>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to <span style={{ color: ACCENT }}>browse</span>
                  </p>
                  <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                    Secure local parsing · No cloud upload
                  </p>

                  <button
                    className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3 whitespace-nowrap"
                    style={{ background: ACCENT_GRADIENT }}
                  >
                    <Plus size={20} /> SELECT PDF FILE
                  </button>
                </>
              ) : (
                /* File selected view */
                <div className="w-full space-y-5" onClick={e => e.stopPropagation()}>
                  
                  {/* Format Toggle Inline */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                        <Terminal size={16} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Output Format</span>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                      <button 
                        onClick={() => setMode('text')} 
                        className={`flex-1 sm:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'text' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <FileText size={14} /> Text
                      </button>
                      <button 
                        onClick={() => setMode('xml')} 
                        className={`flex-1 sm:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'xml' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <FileJson size={14} /> XML
                      </button>
                    </div>
                  </div>

                  {/* Feature pills inline — 3 col with bordered cards */}
                  <div className="grid grid-cols-3 gap-2 w-full pb-4 border-b border-slate-100 dark:border-slate-800">
                    {[
                      { icon: Zap,         title: "Instant",  desc: "In your browser" },
                      { icon: ShieldCheck, title: "Private",  desc: "No server upload" },
                      { icon: Layers,      title: "Accurate", desc: "Format preserved" }
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

                  {/* File card */}
                  <div className="flex flex-row items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-xl shadow-md text-white shrink-0" style={{ background: ACCENT_GRADIENT }}>
                      {mode === 'text' ? <FileText size={20} /> : <FileJson size={20} />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight mb-0.5">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{fmt(file.size)}</span>
                        {status === 'done' && <span className="text-[9px] font-medium uppercase tracking-wider bg-green-50 text-green-500 px-2 py-0.5 rounded-full">✓ Ready</span>}
                      </div>
                    </div>
                    <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-red-200 hover:scale-110 shrink-0">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Editor preview area */}
                  <div className="w-full relative h-[300px] sm:h-[400px]">
                    <div className="absolute inset-0 bg-slate-950 rounded-2xl shadow-inner overflow-hidden border border-slate-800 flex flex-col">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm shrink-0">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{mode === 'text' ? 'Plaintext Output' : 'XML Document Stream'}</div>
                      </div>
                      
                      <div className="flex-1 relative min-h-0">
                        {status === 'processing' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm z-20">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                            <p className="text-[10px] font-medium text-blue-500 uppercase tracking-widest animate-pulse">Parsing Binary Stream...</p>
                          </div>
                        ) : (
                          <textarea
                            readOnly
                            value={mode === 'text' ? text : xml}
                            className="absolute inset-0 w-full h-full bg-transparent text-blue-400/90 font-mono text-xs sm:text-sm p-4 sm:p-6 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                            placeholder="Extraction content will appear here..."
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions — always side by side */}
                  {status === 'done' && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={handleDownload}
                        className="w-full sm:flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-sm sm:text-lg font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        style={{ background: ACCENT_GRADIENT }}
                      >
                        <Download size={18} /> Download {mode.toUpperCase()}
                      </button>
                      <button
                        onClick={handleCopy}
                        className={`w-full sm:w-auto sm:px-6 py-4 sm:py-5 rounded-[1.5rem] border-2 font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:scale-[1.02] active:scale-[0.98]'}`}
                      >
                        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Text'}</span>
                        <span className="sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={reset}
                        className="w-full sm:w-auto sm:px-6 py-3 sm:py-5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} /> Start Over
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Feature grid — shown when no file */}
            {!file && (
              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock,        title: "100% Secure",  desc: "Your files are safe"      },
                  { icon: Trash2,      title: "Auto Delete",  desc: "Files auto removed"        },
                  { icon: Smartphone,  title: "Works Offline", desc: "No internet needed"       },
                  { icon: Rocket,      title: "Super Fast",   desc: "Built for speed"           }
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

        {/* Bottom feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Structural Integrity", desc: "Preserves page-level attributes and line breaks for clean ingestion.", icon: Layers },
            { title: "Batch Processing", desc: "Instantly process multi-hundred page documents with zero lag.", icon: Zap },
            { title: "Privacy First", desc: "No data is ever sent to a server. Processing stays on your hardware.", icon: ShieldCheck },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <feat.icon size={24} />
              </div>
              <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{feat.title}</h5>
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
