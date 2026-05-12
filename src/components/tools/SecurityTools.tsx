"use client";

import { useState } from 'react';
import { Upload, FileText, Loader2, X, Download, CheckCircle2, Unlock, Lock, KeyRound } from 'lucide-react';

export default function SecurityTools({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
      setPassword('');
      e.target.value = '';
    }
  };

  const handleProcess = async () => {
    if (!file || !password.trim()) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', id);
      formData.append('password', password);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response from server:', text);
        throw new Error('Server returned an invalid response format.');
      }

      if (!res.ok) throw new Error(data.error || 'Conversion failed');
      setResultUrl(data.url);    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to process file. Check password and API Configuration.");
    } finally {
      setProcessing(false);
    }
  };

  const getToolInfo = () => {
    if (id === 'unlock') return { title: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: Unlock, action: 'Unlock PDF', color: 'bg-red-500' };
    return { title: 'Protect PDF', desc: 'Encrypt PDF with a password. Manage PDF permissions and access control.', icon: Lock, action: 'Add Password', color: 'bg-red-500' };
  };

  const info = getToolInfo();

  return (
    <div className="max-w-2xl mx-auto py-2 sm:py-12 px-2 sm:px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10 overflow-hidden">
        <div className="space-y-3 sm:space-y-4">
          <div className={`inline-flex p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl ${info.color} text-white shadow-xl shadow-red-500/20`}>
             <info.icon size={32} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{info.title}</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">{info.desc}</p>
        </div>

        {!resultUrl ? (
          <div className="space-y-6 sm:space-y-8">
            {!file ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-20 group hover:border-red-500 hover:bg-red-50/30 dark:hover:bg-red-500/5 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                <div className="space-y-4 sm:space-y-6 pointer-events-none">
                  <div className={`p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-red-500 group-hover:scale-110 transition-transform`}>
                    <Upload size={32} className="sm:w-12 sm:h-12" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black tracking-tight">Select PDF File</div>
                    <p className="text-sm text-slate-500 mt-1">or drop PDF here</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-4 sm:p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-500/20">
                  <div className="flex items-center gap-3 sm:gap-4 text-left overflow-hidden">
                    <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md text-red-500 shrink-0">
                      <FileText size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">{file.name}</p>
                      <p className="text-[10px] text-red-500/70 font-black uppercase tracking-widest">{id === 'unlock' ? 'Encrypted PDF' : 'Standard PDF'}</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors rounded-lg shrink-0">
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 text-left bg-slate-50/50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                     {id === 'unlock' ? 'Current Password' : 'New Password'}
                   </label>
                   <div className="relative">
                     <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                       placeholder={id === 'unlock' ? 'Enter password' : 'Type a strong password'}
                       className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 ring-red-500/20 font-black tracking-widest text-sm sm:text-base"
                     />
                   </div>
                </div>

                <button 
                  onClick={handleProcess} 
                  disabled={processing || !password.trim()}
                  className="w-full py-4 sm:py-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 sm:gap-4 transition-all active:scale-[0.98]"
                >
                  {processing ? <Loader2 className="animate-spin" size={24} /> : <info.icon size={24} className="sm:w-7 sm:h-7" />}
                  {processing ? 'Processing...' : info.action}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700">
             <div className="p-8 sm:p-12 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 scale-110 inline-block border border-green-500/20 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={60} className="sm:w-20 sm:h-20" />
             </div>
             
             <div className="space-y-2 sm:space-y-4">
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">{id === 'unlock' ? 'PDF Unlocked!' : 'PDF Protected!'}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-widest px-4">
                   {file?.name} is ready for download.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a 
                   href={resultUrl} 
                   className={`flex-1 py-4 sm:py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3 sm:gap-4 transition-all active:scale-[0.98]`}
                   target="_blank"
                   rel="noreferrer"
                   download={id === 'unlock' ? `unlocked_${file?.name}` : `protected_${file?.name}`}
                >
                   <Download size={24} className="sm:w-7 sm:h-7" /> Download
                </a>
                <button onClick={() => {setFile(null); setResultUrl(null); setPassword('');}} className="px-8 sm:px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all text-sm sm:text-base">
                   {id === 'unlock' ? 'Unlock Another' : 'Protect Another'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
