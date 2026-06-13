const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

// 1. Add missing imports
if (!code.includes('Zap,')) {
    code = code.replace(
      'import {\n  Upload,\n  Download,\n  Loader2,',
      'import {\n  Zap,\n  Shield,\n  Sparkles,\n  Lock,\n  Smartphone,\n  Rocket,\n  Trash2,\n  Upload,\n  Download,\n  Loader2,'
    );
}

// 2. Change flex-col-reverse to flex-col on the main layout
code = code.replace(
    '<div className="flex flex-col-reverse lg:flex-row-reverse gap-6 items-start">',
    '<div className="flex flex-col lg:flex-row-reverse gap-6 items-start">'
);

// 3. Hide Sidebar before upload
const oldSidebarWrapper = `<div\n          className={\`w-full lg:w-[300px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0\`}\n        >`;
const newSidebarWrapper = `<div\n          className={\`w-full lg:w-[300px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0 \${!file ? 'hidden' : ''}\`}\n        >`;
code = code.replace(oldSidebarWrapper, newSidebarWrapper);

// 4. Update the Dropzone and add 3-item grid
const oldDropzoneRegex = /\{\!file && \!processing && \([\s\S]*?<\/button>\s*<\/div>\s*\)\}/;

const newDropzone = `{!file && !processing && (
  <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">
       <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
         {[
           { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
           { icon: Shield, title: "Private", desc: "Your files stay secure" },
           { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
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
    onClick={() => inputRef.current?.click()}
    onDragOver={e => e.preventDefault()}
    onDrop={onDrop}
    >
    <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
    
    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
    <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
    <div className="absolute top-3 left-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
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
    Drag & drop your PDF file here
    </h3>
    <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
    or click to <span style={{ color: ACCENT }}>browse</span>
    </p>
    <p className="text-sm text-slate-400 font-medium mb-8 text-center">
    Supports single PDF files
    </p>

    <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
    <Plus size={20} /> SELECT PDF FILE
    </button>
    </div>
  </div>
  )}`;

code = code.replace(oldDropzoneRegex, newDropzone);

// 5. Add 3-item grid to After-Upload view
const afterUploadTopRegex = /(\{file && \!result && \(\s*<div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">)/;
const gridAfterUpload = `
      <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
        {[
          { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
          { icon: Shield, title: "Private", desc: "Your files stay secure" },
          { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
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
      </div>`;

code = code.replace(afterUploadTopRegex, `$1\n${gridAfterUpload}`);

// 6. Add 4-item Universal Feature Grid to the bottom of the card
const universalGrid = `
      {/* Universal Feature Grid */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-12 border-t border-slate-100 dark:border-slate-800/50 z-10">
      {[
      { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
      { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
      { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
      { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
      ].map((f, i) => (
      <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
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
`;

code = code.replace(/(\s*<\/div>\s*<\/div>\s*<\/div>\s*\);)/, `${universalGrid}$1`);

// 7. Auto-expand settings on upload
code = code.replace(
  'setResult(null);\n    try {',
  'setResult(null);\n    setShowSettings(true);\n    try {'
);

// 8. Improve action buttons mobile view
const oldButtons = `<div className="flex gap-4">
                <button
                  onClick={handleAdd}
                  disabled={processing}
                  className="flex-1 py-5 text-white rounded-[1.5rem] text-lg sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" /> Adding Pages...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Process &amp; Update <FilePlus size={24} />
                    </span>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-lg hover:shadow-red-500/10"
                >
                  <X size={28} />
                </button>
              </div>`;
const newButtons = `<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAdd}
                  disabled={processing}
                  className="flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-base sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <Loader2 className="animate-spin" /> Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      Process &amp; Update <FilePlus size={20} className="sm:w-6 sm:h-6" />
                    </span>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="w-full sm:w-16 h-14 sm:h-auto rounded-[1.5rem] bg-slate-100 dark:bg-slate-700 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-all shadow-lg hover:shadow-red-500/10 font-bold uppercase tracking-widest text-sm sm:text-base shrink-0"
                >
                  <X size={24} /> <span className="sm:hidden">Cancel</span>
                </button>
              </div>`;

code = code.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
