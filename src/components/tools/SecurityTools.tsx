"use client";

import { useState } from 'react';
import { Upload, FileText, Loader2, X, Download, CheckCircle2, Unlock, Lock, KeyRound, Zap, Shield, Sparkles, Smartphone, Rocket, Trash2, Plus } from 'lucide-react';

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
 setResultUrl(data.url); } catch (err: any) {
 console.error(err);
 alert(err.message || "Failed to process file. Check password and API Configuration.");
 } finally {
 setProcessing(false);
 }
 };

  const getToolInfo = () => {
  if (id === 'unlock') return { title: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: Unlock, action: 'Unlock PDF', color: 'bg-red-500', hex: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' };
  return { title: 'Protect PDF', desc: 'Encrypt PDF with a password. Manage PDF permissions and access control.', icon: Lock, action: 'Add Password', color: 'bg-red-500', hex: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' };
  };

  const info = getToolInfo();
  const ACCENT = info.hex;
  const ACCENT_GRADIENT = info.gradient;

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-8 px-2 sm:px-6">
      <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
        <div className="flex-1 w-full space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden max-w-4xl mx-auto w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            <div className="relative text-center space-y-4 mb-6">
              <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
                <info.icon size={32} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                {info.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
                {info.desc}
              </p>
            </div>

            {!resultUrl ? (
              <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">
                {!file && (
                  <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
                    {[
                      { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
                      { icon: Shield, title: "Private", desc: "Your files stay secure" },
                      { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                          <f.icon size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                          <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!file ? (
                  <label className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6">
                    <input type="file" onChange={onFileChange} accept=".pdf" className="hidden" />
                    
                    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                        <div className="m-auto text-slate-300 dark:bg-slate-600">
                          <info.icon size={32} />
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
                      Drag & drop your PDF file here
                    </h3>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                      or click to <span style={{ color: ACCENT }}>browse</span>
                    </p>
                    <p className="text-sm text-slate-400 font-medium mb-8 text-center">
                      Supports single PDF file
                    </p>

                    <div className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
                      <Plus size={20} /> SELECT PDF FILE
                    </div>
                  </label>
                ) : (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 w-full mb-6 relative z-10">
                    <div className="flex items-center justify-between p-4 sm:p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-500/20">
                      <div className="flex items-center gap-3 sm:gap-4 text-left overflow-hidden">
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md text-red-500 shrink-0">
                          <FileText size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate text-sm sm:text-base">{file.name}</p>
                          <p className="text-[10px] text-red-500/70 font-medium uppercase tracking-widest">{id === 'unlock' ? 'Encrypted PDF' : 'Standard PDF'}</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="p-2 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors rounded-lg shrink-0">
                        <X size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-left bg-slate-50/50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <label className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-400 px-1">
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
                          className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 ring-red-500/20 font-medium tracking-widest text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleProcess} 
                      disabled={processing || !password.trim()}
                      className="w-full py-4 sm:py-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-lg sm:text-xl font-medium shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 sm:gap-4 transition-all active:scale-[0.98]"
                    >
                      {processing ? <Loader2 className="animate-spin" size={24} /> : <info.icon size={24} className="sm:w-7 sm:h-7" />}
                      {processing ? 'Processing...' : info.action}
                    </button>
                  </div>
                )}

                {!file && (
                  <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                    {[
                      { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                      { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                      { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
                      { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
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
            ) : (
              <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700 flex-1 flex flex-col items-center justify-center py-10 w-full relative z-10">
                <div className="p-8 sm:p-12 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 scale-110 inline-block border border-green-500/20 shadow-xl shadow-green-500/10">
                  <CheckCircle2 size={60} className="sm:w-20 sm:h-20" />
                </div>
                
                <div className="space-y-2 sm:space-y-4">
                  <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{id === 'unlock' ? 'PDF Unlocked!' : 'PDF Protected!'}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-widest px-4">
                    {file?.name} is ready for download.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
                  <a 
                    href={resultUrl} 
                    className={`flex-1 py-4 sm:py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-lg sm:text-lg sm:text-xl font-medium shadow-xl flex items-center justify-center gap-3 sm:gap-4 transition-all active:scale-[0.98]`}
                    target="_blank"
                    rel="noreferrer"
                    download={id === 'unlock' ? `unlocked_${file?.name}` : `protected_${file?.name}`}
                  >
                    <Download size={24} className="sm:w-7 sm:h-7" /> Download
                  </a>
                  <button onClick={() => {setFile(null); setResultUrl(null); setPassword('');}} className="px-8 sm:px-10 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-medium transition-all text-sm sm:text-base">
                    {id === 'unlock' ? 'Unlock Another' : 'Protect Another'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
}
