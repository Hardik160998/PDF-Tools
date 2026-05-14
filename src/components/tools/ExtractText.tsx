"use client";

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, Download, Loader2, X, FileText, CheckCircle2, 
  Settings, ChevronDown, Copy, Terminal, FileJson, 
  ShieldCheck, Zap, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ExtractionStatus = 'idle' | 'processing' | 'done' | 'error';

export default function ExtractText({ id: toolId }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [xml, setXml] = useState<string>("");
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [mode, setMode] = useState<'text' | 'xml'>(toolId === 'pdf-to-xml' ? 'xml' : 'text');
  const [showSettings, setShowSettings] = useState(false);
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
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
            <span className="flex items-center gap-2"><Settings size={20} style={{ color: ACCENT }} /> Configuration</span>
            <ChevronDown className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} size={20} />
          </button>

          <div className={`${showSettings ? 'block' : 'hidden'} lg:block p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="hidden lg:block text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Export Options</h3>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Reset</button>
            </div>

            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Output Format</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => setMode('text')} 
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'text' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <FileText size={14} /> TEXT
                  </button>
                  <button 
                    onClick={() => setMode('xml')} 
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'xml' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <FileJson size={14} /> XML
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-blue-500">
                      <Terminal size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parser Status</span>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                       {status === 'idle' ? 'Ready to analyze' : status === 'processing' ? 'Extracting text...' : 'Analysis complete'}
                     </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  disabled={status !== 'done'}
                  className="w-full py-5 text-white rounded-[1.5rem] text-xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter shadow-blue-500/20"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  Download {mode.toUpperCase()}
                </button>
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">Local Extraction Engine v2.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-6 sm:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            {/* Header */}
            <div className="relative text-center space-y-4 mb-10 text-left sm:text-center">
              <div className="inline-flex p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 mx-auto" style={{ background: ACCENT_GRADIENT }}>
                {mode === 'text' ? <FileText size={32} /> : <FileJson size={32} />}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                {mode === 'text' ? 'Extract PDF Text' : 'PDF to XML Converter'}
              </h2>
              <p className="text-slate-500 font-medium tracking-tight max-w-md mx-auto">
                {mode === 'text' ? 'Pull raw content from your documents with structural integrity.' : 'Convert flat PDF data into machine-readable hierarchical XML schema.'}
              </p>
            </div>

            {/* Content Area */}
            {!file ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-10 sm:p-20 hover:border-blue-400 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-900/30 group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-blue-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={48} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center relative z-10">
                  Select Source PDF
                </div>
                <p className="text-slate-400 text-sm mt-2 font-bold tracking-tight text-center relative z-10 uppercase tracking-widest">
                  Secure local parsing · No cloud upload
                </p>
                <button className="mt-8 px-10 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10" style={{ background: ACCENT_GRADIENT }}>
                  Choose Files
                </button>
                <input ref={fileInputRef} type="file" onChange={e => e.target.files && loadFile(e.target.files[0])} accept=".pdf" className="hidden" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-4 min-w-0">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-500 shadow-sm"><FileText size={20} /></div>
                      <div className="truncate">
                         <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate">{file.name}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{(file.size / 1024).toFixed(0)} KB · READY FOR EXPORT</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleCopy} className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase ${copied ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-500 shadow-sm'}`}>
                         {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                         <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button onClick={reset} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><X size={20} /></button>
                   </div>
                </div>

                <div className="flex-1 relative group">
                   <div className="absolute inset-0 bg-slate-950 rounded-[1.5rem] shadow-inner overflow-hidden border border-slate-800">
                      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                         <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                         </div>
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{mode === 'text' ? 'Plaintext Output' : 'XML Document Stream'}</div>
                      </div>
                      
                      {status === 'processing' ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm z-20">
                           <Loader2 className="animate-spin text-blue-500" size={32} />
                           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Parsing Binary Stream...</p>
                        </div>
                      ) : (
                        <textarea
                          readOnly
                          value={mode === 'text' ? text : xml}
                          className="w-full h-full bg-transparent text-blue-400/90 font-mono text-sm p-8 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                          placeholder="Extraction content will appear here..."
                        />
                      )}
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Structural Integrity", desc: "Preserves page-level attributes and line breaks for clean ingestion.", icon: Layers },
              { title: "Batch Processing", desc: "Instantly process multi-hundred page documents with zero lag.", icon: Zap },
              { title: "Privacy First", desc: "No data is ever sent to a server. Processing stays on your hardware.", icon: ShieldCheck },
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform shadow-inner">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>
    </div>
  );
}
