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
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="space-y-4">
          <div className={`inline-flex p-5 rounded-3xl ${info.color} text-white shadow-lg`}>
             <info.icon size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{info.title}</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">{info.desc}</p>
        </div>

        {!resultUrl ? (
          <div className="space-y-8">
            {!file ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-20 group hover:border-red-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-6">
                  <div className={`p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-red-500 group-hover:scale-110 transition-transform`}>
                    <Upload size={48} />
                  </div>
                  <div className="text-2xl font-black tracking-tight tracking-tight">Select PDF File</div>
                  <p className="text-slate-500">or drop PDF here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-500/20">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md text-red-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{id === 'unlock' ? 'Encrypted PDF' : 'Standard PDF'}</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 text-left bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                     {id === 'unlock' ? 'Current Password' : 'New Password'}
                   </label>
                   <div className="relative">
                     <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder={id === 'unlock' ? 'Enter password to unlock' : 'Type a strong password'}
                       className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 ring-red-500/20 font-black tracking-widest"
                     />
                   </div>
                </div>

                <button 
                  onClick={handleProcess} 
                  disabled={processing || !password.trim()}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white rounded-2xl text-2xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-4 group transition-all"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <info.icon size={28} className="fill-white/20" />}
                  {processing ? 'Processing...' : info.action}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 scale-110 inline-block">
                <CheckCircle2 size={80} />
             </div>
             
             <div className="space-y-4">
                <h3 className="text-4xl font-black">{id === 'unlock' ? 'PDF Unlocked!' : 'PDF Protected!'}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">
                   {file?.name} is ready for download.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                   href={resultUrl} 
                   className={`flex-1 py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all`}
                   target="_blank"
                   rel="noreferrer"
                   download={id === 'unlock' ? `unlocked_${file?.name}` : `protected_${file?.name}`}
                >
                   <Download size={28} /> Download
                </a>
                <button onClick={() => {setFile(null); setResultUrl(null); setPassword('');}} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                   {id === 'unlock' ? 'Unlock Another' : 'Protect Another'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
