"use client";

import { useState } from 'react';
import { 
  Upload, FileText, Loader2, X, Sparkles, 
  Download, CheckCircle2, FileSpreadsheet, 
  Presentation, Globe 
} from 'lucide-react';

export default function OfficeTools({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', id);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Conversion failed');
      
      setResultUrl(data.url);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to convert file. Check API Configuration.");
    } finally {
      setProcessing(false);
    }
  };

  const toolInfo: Record<string, { title: string; color: string; icon: any; ext: string; type: string }> = {
    'word-to-pdf': { title: 'Word to PDF', color: 'bg-blue-600', icon: FileText, ext: '.doc, .docx', type: 'Office' },
    'pdf-to-word': { title: 'PDF to Word', color: 'bg-blue-600', icon: FileText, ext: '.pdf', type: 'PDF' },
    'excel-to-pdf': { title: 'Excel to PDF', color: 'bg-green-600', icon: FileSpreadsheet, ext: '.xls, .xlsx', type: 'Spreadsheet' },
    'pdf-to-excel': { title: 'PDF to Excel', color: 'bg-green-600', icon: FileSpreadsheet, ext: '.pdf', type: 'PDF' },
    'ppt-to-pdf': { title: 'PowerPoint to PDF', color: 'bg-orange-600', icon: Presentation, ext: '.ppt, .pptx', type: 'Presentation' },
    'pdf-to-ppt': { title: 'PDF to PowerPoint', color: 'bg-orange-600', icon: Presentation, ext: '.pdf', type: 'PDF' },
    'html-to-pdf': { title: 'HTML to PDF', color: 'bg-indigo-600', icon: Globe, ext: '.html, .htm', type: 'Web' },
  };

  const info = toolInfo[id] || toolInfo['word-to-pdf'];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="space-y-4">
          <div className={`inline-flex p-5 rounded-3xl ${info.color} text-white shadow-lg`}>
             <info.icon size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{info.title}</h2>
          <p className="text-slate-500 font-medium">Easily convert your {info.title.split(' to ')[0]} files to {info.title.split(' to ')[1]}.</p>
        </div>

        {!resultUrl ? (
          <div className="space-y-8">
            {!file ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-20 group hover:border-blue-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                <input type="file" onChange={onFileChange} accept={info.ext} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-6">
                  <div className={`p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-blue-500 group-hover:scale-110 transition-transform`}>
                    <Upload size={48} />
                  </div>
                  <div className="text-2xl font-black tracking-tight tracking-tight">Select {info.type} File</div>
                  <p className="text-slate-500">or drop {info.ext} here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md text-blue-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{info.type} Document</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <button 
                  onClick={handleConvert} 
                  disabled={processing}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 group transition-all"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Sparkles size={28} className="fill-white/20" />}
                  {processing ? 'Converting File...' : 'Convert to PDF'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 scale-110 inline-block">
                <CheckCircle2 size={80} />
             </div>
             
             <div className="space-y-4">
                <h3 className="text-4xl font-black">Conversion Complete!</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">
                   {file?.name} has been processed flawlessly.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                   href={resultUrl} 
                   className={`flex-1 py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all`}
                   target="_blank"
                   rel="noreferrer"
                >
                   <Download size={28} /> Download Result
                </a>
                <button onClick={() => {setFile(null); setResultUrl(null);}} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                   Convert Another
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
