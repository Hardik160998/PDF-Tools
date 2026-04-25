"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, Copy, Check, Type, FileJson } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

export default function ExtractText({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'xml'>('text');

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessing(true);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let cumulativeText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          cumulativeText += strings.join(" ") + "\n\n";
        }
        setText(cumulativeText);
      } catch (err) {
        console.error(err);
        alert("Error extracting text.");
      } finally {
        setProcessing(false);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(viewMode === 'xml' ? toXML(text) : text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toXML = (txt: string) => {
    const lines = txt.split('\n').filter(l => l.trim());
    return `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <filename>${file?.name || 'document'}</filename>
  <pages>
    <page id="1">
${lines.map(line => `      <content>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</content>`).join('\n')}
    </page>
  </pages>
</document>`;
  };

  const downloadResult = () => {
    const content = viewMode === 'xml' ? toXML(text) : text;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name || 'result'}.${viewMode === 'xml' ? 'xml' : 'txt'}`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-blue-500 text-white shadow-lg">
             {id === 'pdf-to-xml' ? <FileJson size={32} className="sm:w-10 sm:h-10" /> : <Type size={32} className="sm:w-10 sm:h-10" />}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'pdf-to-xml' ? 'PDF to XML' : 'PDF to Text'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Extract structured data and text content with highest fidelity.</p>
        </div>

        {!text ? (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-blue-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-blue-500 group-hover:scale-110 transition-transform">
                <Upload size={32} className="sm:w-12 sm:h-12" />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight">Select PDF File</div>
              <p className="text-sm sm:text-base text-slate-500">or drop PDF here</p>
            </div>
            {processing && <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-[1.5rem] sm:rounded-[2.5rem]"><Loader2 className="animate-spin text-blue-500" size={48} className="sm:w-16 sm:h-16" /></div>}
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 w-full md:w-auto">
                <button onClick={() => setViewMode('text')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'text' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  Text View
                </button>
                <button onClick={() => setViewMode('xml')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'xml' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  XML View
                </button>
              </div>
              <div className="flex gap-2 w-full md:w-auto items-center">
                <button onClick={copyToClipboard} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 rounded-xl font-bold shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-[10px] sm:text-sm whitespace-nowrap">
                  {copySuccess ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
                <button onClick={downloadResult} className="flex-1 md:flex-none px-4 sm:px-8 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-[10px] sm:text-sm whitespace-nowrap">
                  <Download size={14} /> Download
                </button>
                <button onClick={() => {setText(""); setFile(null);}} className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-red-500 transition-colors shrink-0">
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 bg-slate-900 text-slate-300 rounded-[1.5rem] sm:rounded-[2rem] h-[400px] sm:h-[500px] overflow-auto text-left font-mono text-[10px] sm:text-sm leading-relaxed border-4 sm:border-8 border-slate-800 shadow-inner">
               <pre className="whitespace-pre-wrap">{viewMode === 'xml' ? toXML(text) : text}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
