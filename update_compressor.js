const fs = require('fs');
let code = fs.readFileSync('src/components/tools/Compressor.tsx', 'utf8');

// 1. Fix flex-col-reverse
code = code.replace(
  '<div className="flex flex-col-reverse lg:flex-row-reverse gap-8 items-start">',
  '<div className="flex flex-col lg:flex-row-reverse gap-8 items-start">'
);

// 2. Hide Sidebar before upload
const oldSidebarWrapper = '<div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0">';
const newSidebarWrapper = `<div className={\`w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-fit lg:sticky lg:top-4 flex-shrink-0 \${files.length === 0 ? 'hidden' : ''}\`}>`;
if (code.includes(oldSidebarWrapper)) {
    code = code.replace(oldSidebarWrapper, newSidebarWrapper);
}

// 3. Update the Dropzone
const oldDropzoneRegex = /\{files\.length === 0 \? \([\s\S]*?<\/button>\s*<\/div>\s*\) : \(/;
const newDropzone = `{files.length === 0 ? (
  <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">
       <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
         {[
           { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
           { icon: Shield, title: "Private", desc: "Your files stay secure" },
           { icon: Database, title: "Lossless", desc: "Advanced compression algorithms" }
         ].map((f, i) => (
           <div key={i} className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: \`\${ACCENT}15\` }}>
               <f.icon size={20} />
             </div>
             <div className="text-left">
               <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
               <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
             </div>
           </div>
         ))}
       </div>

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
  ) : (`;

if (code.match(oldDropzoneRegex)) {
    code = code.replace(oldDropzoneRegex, newDropzone);
}

// 4. Update the "Add More Documents" button to be consistent with MergeSplit if necessary.
// MergeSplit uses a dashed border button. Compressor already uses a dashed border button. So that's fine.

// 5. Add Plus import if missing
if (!code.includes('Plus,')) {
    code = code.replace(
      'Upload, Download, Loader2, X, Zap, FileText,',
      'Plus, Upload, Download, Loader2, X, Zap, FileText,'
    );
}

fs.writeFileSync('src/components/tools/Compressor.tsx', code);
