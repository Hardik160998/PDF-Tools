"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, Zap, FileText, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function Compressor({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; oldSize: number; newSize: number } | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
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

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex p-5 rounded-3xl bg-green-500 text-white shadow-lg">
             <Zap size={40} className="fill-white/20" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Compress PDF</h2>
          <p className="text-slate-500 font-medium">Reduce file size without losing quality.</p>
        </div>

        {!result ? (
          <div className="space-y-8">
            {!file ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-20 group hover:border-green-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-green-500 group-hover:scale-110 transition-transform">
                    <Upload size={48} />
                  </div>
                  <div className="text-2xl font-black tracking-tight">Select PDF File</div>
                  <p className="text-slate-500">or drop PDF here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-6 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-500/20">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md text-green-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <button 
                  onClick={handleCompress} 
                  disabled={processing}
                  className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-2xl font-black shadow-xl shadow-green-500/20 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Zap size={28} className="fill-white/20" />}
                  {processing ? 'Compressing...' : 'Compress PDF'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="relative inline-block">
                <div className="p-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 scale-110">
                   <CheckCircle2 size={80} />
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl">
                   -{Math.round((1 - result.newSize / result.oldSize) * 100)}%
                </div>
             </div>
             
             <div className="space-y-4">
                <h3 className="text-4xl font-black">Success!</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">
                  Reduced from <span className="text-slate-900 dark:text-white">{formatSize(result.oldSize)}</span> to <span className="text-green-500">{formatSize(result.newSize)}</span>
                </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={result.url} download={`compressed_${file?.name}`} className="flex-1 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-3">
                   <Download size={24} /> Download PDF
                </a>
                <button onClick={() => {setFile(null); setResult(null);}} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                   Compress Another
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
