const fs = require('fs');

let code = fs.readFileSync('src/components/tools/Compressor.tsx', 'utf8');

// The code has a syntax error. We'll find the last correctly parsed chunk and overwrite everything after it.
// Actually, let's just use regex to replace everything from `files.length === 0 ?` to the end of the file
// with perfectly formatted, syntax-correct code.

const startMarker = '{files.length === 0 ? (';
const startIndex = code.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find start marker');
  process.exit(1);
}

const replacement = `{files.length === 0 ? (
   <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">
     <div 
     className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6 z-10"
     onClick={() => fileInputRef.current?.click()}
     onDragOver={e => e.preventDefault()}
     onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
     >
     <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
     <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
     <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
     <div className="m-auto text-slate-300 dark:text-slate-600">
     <FilePlus size={32} />
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
     Drag & drop your PDF files here
     </h3>
     <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
     or click to <span style={{ color: ACCENT }}>browse</span>
     </p>
     <p className="text-sm text-slate-400 font-medium mb-8 text-center">
     Supports multiple PDF files
     </p>

     <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
     <Plus size={20} /> SELECT PDF FILES
     </button>
     </div>
   </div>
   ) : (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
  <div className="grid grid-cols-1 gap-4">
  {files.map((f) => (
  <div key={f.id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm gap-6 group hover:shadow-xl transition-all relative overflow-hidden">
  <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1 w-full sm:w-auto">
  <div className={\`p-4 sm:p-5 rounded-2xl shadow-xl transition-all shrink-0 \${f.status === 'done' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-emerald-500'}\`}>
  {f.status === 'processing' ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
  </div>
  <div className="text-left min-w-0 flex-1">
  <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white uppercase truncate tracking-tighter mb-1">{f.file.name}</h4>
  <div className="flex flex-wrap items-center gap-3">
  {f.status === 'processing' ? (
  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1.5">
  <Loader2 size={12} className="animate-spin" /> Compressing...
  </span>
  ) : f.status === 'done' ? (
  <span className="text-[10px] sm:text-[11px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1.5">
  <CheckCircle2 size={12} /> Optimization Complete
  </span>
  ) : f.status === 'error' ? (
  <span className="text-[10px] sm:text-[11px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1.5">
  <X size={12} /> Processing Failed
  </span>
  ) : (
  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
  Ready for processing
  </span>
  )}
  <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase">
  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{(f.oldSize / 1024 / 1024).toFixed(2)} MB</span>
  {f.newSize && (
  <>
  <ChevronDown size={14} className="text-emerald-500" />
  <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">{(f.newSize / 1024 / 1024).toFixed(2)} MB</span>
  <span className="text-emerald-500 font-bold ml-1">(-{Math.round(((f.oldSize - f.newSize) / f.oldSize) * 100)}%)</span>
  </>
  )}
  </div>
  </div>
  </div>
  </div>
  
  <div className="flex items-center gap-2 sm:gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
  {f.resultUrl && (
  <a href={f.resultUrl} download={\`compressed_\${f.file.name}\`} className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
  <Download size={14} /> Download
  </a>
  )}
  <button onClick={() => removeFile(f.id)} className="p-3.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:scale-110">
  <X size={18} />
  </button>
  </div>
  {f.status === 'processing' && (
  <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-progress" style={{ width: '100%' }} />
  )}
  </div>
  ))}
  </div>
  
  <button onClick={() => fileInputRef.current?.click()} className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-4 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all bg-slate-50/10 group">
  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
  <FilePlus size={24} />
  </div>
  <span className="text-xs font-medium uppercase tracking-widest">Add More Documents</span>
  </button>
  </div>
  )}
  </div>
  </div>

  <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-12 border-t border-slate-100 dark:border-slate-800/50 z-10">
  {[
  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
  ].map((f, i) => (
  <div key={i} className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-center">
  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: \`\${ACCENT}10\` }}>
  <f.icon size={16} />
  </div>
  <div>
  <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
  <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
  </div>
  </div>
  ))}
  </div>
  
  <input ref={fileInputRef} type="file" multiple onChange={e => addFiles(e.target.files)} accept=".pdf" className="hidden" />

  <style jsx global>{\`
  @keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
  }
  .animate-progress {
  animation: progress 2s infinite linear;
  }
  \`}</style>
  </div>
  );
}
`;

const newCode = code.substring(0, startIndex) + replacement;
fs.writeFileSync('src/components/tools/Compressor.tsx', newCode);
console.log('Fixed syntax error and applied Universal grid!');
