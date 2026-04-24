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
    <div className="max-w-5xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex p-5 rounded-3xl bg-blue-500 text-white shadow-lg">
             {id === 'pdf-to-xml' ? <FileJson size={40} /> : <Type size={40} />}
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'pdf-to-xml' ? 'PDF to XML' : 'PDF to Text'}
          </h2>
          <p className="text-slate-500 font-medium">Extract structured data and text content with highest fidelity.</p>
        </div>

        {!text ? (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 group hover:border-blue-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-blue-500 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div className="text-2xl font-black tracking-tight">Select PDF File</div>
              <p className="text-slate-500">or drop PDF here</p>
            </div>
            {processing && <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-[2.5rem]"><Loader2 className="animate-spin text-blue-500" size={64} /></div>}
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <button onClick={() => setViewMode('text')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${viewMode === 'text' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  Text View
                </button>
                <button onClick={() => setViewMode('xml')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${viewMode === 'xml' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  XML View
                </button>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={copyToClipboard} className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-800 rounded-xl font-bold shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  {copySuccess ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
                <button onClick={downloadResult} className="flex-1 md:flex-none px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Download size={18} /> Download
                </button>
                <button onClick={() => {setText(""); setFile(null);}} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-900 text-slate-300 rounded-[2rem] h-[500px] overflow-auto text-left font-mono text-sm leading-relaxed border-8 border-slate-800 shadow-inner">
               <pre className="whitespace-pre-wrap">{viewMode === 'xml' ? toXML(text) : text}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
