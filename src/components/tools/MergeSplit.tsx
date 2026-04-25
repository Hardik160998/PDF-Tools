"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, Combine, FileText, CheckCircle2, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function MergeSplit({ id }: { id: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; count: number; filename?: string } | null>(null);
  
  // Split specific settings
  const [splitMode, setSplitMode] = useState<'parts' | 'extract'>('parts');
  const [splitParts, setSplitParts] = useState<number>(2);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (id === 'split') {
        // Split only supports 1 file at a time
        setFiles([e.target.files[0]]);
      } else {
        setFiles([...files, ...Array.from(e.target.files)]);
      }
      setResult(null);
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      if (id === 'merge') {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const fileBytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        setResult({ url: URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })), count: files.length, filename: 'merged_platform.pdf' });
      } else if (id === 'split') {
        const fileBytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const totalPages = pdf.getPageCount();
        
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        if (splitMode === 'extract') {
          for (let i = 0; i < totalPages; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(copiedPage);
            const bytes = await newPdf.save();
            zip.file(`page_${i + 1}.pdf`, bytes);
          }
        } else if (splitMode === 'parts') {
          const pagesPerPart = Math.ceil(totalPages / splitParts);
          let currentPart = 1;
          for (let start = 0; start < totalPages; start += pagesPerPart) {
            const end = Math.min(start + pagesPerPart, totalPages);
            const indicesToCopy = Array.from({ length: end - start }, (_, idx) => start + idx);
            
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, indicesToCopy);
            copiedPages.forEach(p => newPdf.addPage(p));
            
            const bytes = await newPdf.save();
            zip.file(`part_${currentPart}.pdf`, bytes);
            currentPart++;
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResult({ url: URL.createObjectURL(zipBlob), count: splitMode === 'extract' ? totalPages : splitParts, filename: `split_${files[0].name.replace('.pdf', '')}.zip` });
      }
    } catch (err) {
      console.error(err);
      alert("Error processing files.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-orange-500 text-white shadow-lg">
             {id === 'merge' ? <Combine size={32} className="sm:w-10 sm:h-10" /> : <Scissors size={32} className="sm:w-10 sm:h-10" />}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {id === 'merge' ? 'Merge PDF' : 'Split PDF'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Combine or separate your documents with ultra-speed.</p>
        </div>

        {!result ? (
          <div className="space-y-8">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-16 group hover:border-orange-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
              <input type="file" multiple={id === 'merge'} onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-orange-500 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="sm:w-12 sm:h-12" />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight">Select PDF Files</div>
                <p className="text-sm sm:text-base text-slate-500">or drop PDF here</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {files.map((file, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600 group">
                        <div className="flex items-center gap-4 text-left">
                           <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-orange-500">
                             <FileText size={18} />
                           </div>
                           <p className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[150px]">{file.name}</p>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                           <X size={18} />
                        </button>
                     </div>
                   ))}
                </div>

                {id === 'split' && files.length > 0 && (
                  <div className="space-y-4 text-left bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in slide-in-from-bottom-2">
                     <h4 className="font-bold text-slate-900 dark:text-white">Split Configuration</h4>
                     <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl">
                       <button onClick={() => setSplitMode('parts')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${splitMode === 'parts' ? 'bg-white dark:bg-slate-800 shadow-sm text-orange-500' : 'text-slate-400 hover:text-slate-900'}`}>
                         Divide in Parts
                       </button>
                       <button onClick={() => setSplitMode('extract')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${splitMode === 'extract' ? 'bg-white dark:bg-slate-800 shadow-sm text-orange-500' : 'text-slate-400 hover:text-slate-900'}`}>
                         Extract All Pages
                       </button>
                     </div>

                     {splitMode === 'parts' && (
                       <div className="space-y-2 mt-4 animate-in slide-in-from-top-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">How many chunks?</label>
                         <div className="flex gap-2">
                           {[2, 3, 4].map(num => (
                             <button key={num} onClick={() => setSplitParts(num)} className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${splitParts === num ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:border-orange-300'}`}>
                               {num} Parts
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>
                )}

                <button 
                  onClick={handleProcess} 
                  disabled={processing}
                  className="w-full py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-orange-500/20 flex items-center justify-center gap-4 group"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Combine size={24} className="sm:w-7 sm:h-7 fill-white/20" />}
                  {processing ? 'Processing...' : (id === 'merge' ? 'Merge PDF' : 'Split PDF')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-12 rounded-full bg-slate-100 dark:bg-slate-700 text-orange-500 scale-110 inline-block">
                <CheckCircle2 size={80} />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl font-black">{id === 'merge' ? 'Merge Successful!' : 'Archive Ready!'}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">{id === 'merge' ? `${result.count} files combined.` : `${result.count} files extracted.`}</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={result.url} download={result.filename || 'download'} className="flex-1 py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xl sm:text-2xl font-black shadow-xl flex items-center justify-center gap-4">
                   <Download size={24} className="sm:w-7 sm:h-7" /> Download
                </a>
                <button onClick={() => {setFiles([]); setResult(null);}} className="px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                   Start Over
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
