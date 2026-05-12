"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Copy, Check, Type, FileJson } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

export default function ExtractText({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [pages, setPages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  // Default to xml view for pdf-to-xml tool
  const [viewMode, setViewMode] = useState<'text' | 'xml'>(id === 'pdf-to-xml' ? 'xml' : 'text');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setText("");
    setFile(null);
    setPages([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessing(true);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const pageTexts: string[] = [];
        let cumulativeText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          const pageText = strings.join(" ");
          pageTexts.push(pageText);
          cumulativeText += pageText + "\n\n";
        }
        setText(cumulativeText);
        setPages(pageTexts);
      } catch (err) {
        console.error(err);
        alert("Error extracting text.");
      } finally {
        setProcessing(false);
        e.target.value = '';
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(viewMode === 'xml' ? toXML() : text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toXML = () => {
    const escape = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const pageBlocks = pages.map((pageText, i) => {
      const lines = pageText.split(/\s{2,}|\n/).filter(l => l.trim());
      return `    <page number="${i + 1}">
${lines.map(line => `      <line>${escape(line.trim())}</line>`).join('\n')}
    </page>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <filename>${escape(file?.name || 'document')}</filename>
  <totalPages>${pages.length}</totalPages>
  <pages>
${pageBlocks}
  </pages>
</document>`;
  };

  const downloadResult = () => {
    const isXml = viewMode === 'xml';
    const content = isXml ? toXML() : text;
    const mimeType = isXml ? 'application/xml' : 'text/plain';
    const ext = isXml ? '.xml' : '.txt';
    const baseName = (file?.name || 'result').replace(/\.pdf$/i, '');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + ext;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-blue-500 text-white shadow-lg">
             {id === 'pdf-to-xml' ? <FileJson size={24} className="sm:w-10 sm:h-10" /> : <Type size={24} className="sm:w-10 sm:h-10" />}
          </div>
          <h2 className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight sm:tracking-tighter">
            {id === 'pdf-to-xml' ? 'PDF to XML' : 'PDF to Text'}
          </h2>
          <p className="text-xs sm:text-base text-slate-500 font-medium px-2">Extract structured data and text content with highest fidelity.</p>
        </div>

        {!text ? (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-3xl p-6 sm:p-16 group hover:border-blue-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <input ref={inputRef} type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-3 sm:space-y-6">
              <div className="p-3 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl inline-block text-blue-500 group-hover:scale-110 transition-transform">
                <Upload size={28} className="sm:w-12 sm:h-12" />
              </div>
              <div className="text-lg sm:text-2xl font-black tracking-tight">Select PDF File</div>
              <p className="text-xs sm:text-base text-slate-500">or drop PDF here</p>
            </div>
            {processing && <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-xl sm:rounded-[2.5rem]"><Loader2 className="animate-spin text-blue-500 sm:w-16 sm:h-16" size={40} /></div>}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-2 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 w-full md:w-auto">
                <button onClick={() => setViewMode('text')} className={`flex-1 md:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'text' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  Text View
                </button>
                <button onClick={() => setViewMode('xml')} className={`flex-1 md:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'xml' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  XML View
                </button>
              </div>
              <div className="flex gap-2 w-full md:w-auto items-center">
                <button onClick={copyToClipboard} className="flex-1 md:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl font-bold shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-50 transition-all text-[9px] sm:text-sm whitespace-nowrap">
                  {copySuccess ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
                <button onClick={downloadResult} className="flex-1 md:flex-none px-3 sm:px-8 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-sm whitespace-nowrap">
                  <Download size={12} className="sm:w-[14px] sm:h-[14px]" /> Download
                </button>
                <button onClick={handleReset} className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-700 rounded-lg sm:rounded-xl text-slate-400 hover:text-red-500 transition-colors shrink-0">
                   <X size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-8 bg-slate-900 text-slate-300 rounded-xl sm:rounded-[2rem] h-[350px] sm:h-[500px] overflow-auto text-left font-mono text-[9px] sm:text-sm leading-relaxed border-[4px] sm:border-[8px] border-slate-800 shadow-inner">
               <pre className="whitespace-pre-wrap">{viewMode === 'xml' ? toXML() : text}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
