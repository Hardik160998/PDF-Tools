const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'tools', 'ImageConverter.tsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Update imports
code = code.replace(
  /import {([^}]+)} from "lucide-react";/,
  `import {$1, Sparkles, Lock, Trash2, Smartphone, Rocket, Plus} from "lucide-react";`
);

// 2. Extract parts
const returnIndex = code.indexOf('  return (\n  <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">');
const sidebarStart = code.indexOf('  {/* Sidebar Configuration */}');
const workspaceStart = code.indexOf('  {/* Main Workspace */}');

// The workspace empty state starts here:
const emptyStateStart = code.indexOf('  {files.length === 0 ? (');
const successStateStart = code.indexOf('  ) : status === "done" ? (');

const headerContentStart = code.indexOf('  <div className="relative text-center space-y-4 mb-12">');
const headerContentEnd = code.indexOf('  {files.length === 0 ? (');

const sidebarCode = code.substring(sidebarStart, workspaceStart);
const successAndProcessingCode = code.substring(successStateStart, code.length - 15); // Approximate end

const newEmptyState = `  {files.length === 0 ? (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header & Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto mb-2" style={{ background: ACCENT_GRADIENT }}>
          {isPdfToImg ? <FileImage size={32} /> : isImgToPdf ? <FileText size={32} /> : <ImageIcon size={32} />}
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          {meta.title}
        </h2>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
          {meta.desc}
        </p>
      </div>

      {/* 2. Top Features Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 w-full">
        {[
          { icon: Zap, title: "Instant", desc: "Lightning fast conversion" },
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

      {/* 3. Drop Zone */}
      <div className="w-full">
        <div 
          className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-12 sm:p-20 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 group relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Custom Illustration */}
          <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
             <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
                <div className="m-auto text-slate-300 dark:text-slate-600">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"/></svg>
                </div>
             </div>
             {/* Upload Arrow Overlay */}
             <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT_GRADIENT }}>
                <Upload size={20} strokeWidth={3} />
             </div>
             {/* Floating decorative crosses */}
             <Plus size={16} className="absolute -top-4 -left-6 text-yellow-400 opacity-60" />
             <Plus size={12} className="absolute top-10 -right-8 text-yellow-400 opacity-60" />
             <Plus size={14} className="absolute bottom-2 -left-8 text-yellow-400 opacity-60" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            Drag & drop your {isPdfToImg ? "PDF" : "Image"} files here
          </h3>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4">
            or click to <span style={{ color: ACCENT }}>browse</span>
          </p>
          <p className="text-sm text-slate-400 font-medium mb-8">
            Supports single or multiple {isPdfToImg ? "PDF files" : "images"}
          </p>

          <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
            <Plus size={20} /> SELECT {isPdfToImg ? "PDF" : "IMAGE"} FILES <ChevronDown size={18} className="ml-2" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Features Row */}
      <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
        {[
          { icon: Lock, title: "100% Secure", desc: "Your files are safe with us" },
          { icon: Trash2, title: "Auto Delete", desc: "Files removed after conversion" },
          { icon: Smartphone, title: "Works Offline", desc: "No internet required" },
          { icon: Rocket, title: "Super Fast", desc: "Built for speed & efficiency" }
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 min-w-[200px]">
             <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800" style={{ color: ACCENT }}>
                <f.icon size={16} />
             </div>
             <div className="text-left">
                <p className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
             </div>
          </div>
        ))}
      </div>

    </div>
  ) : (
    <div className="flex flex-col-reverse lg:flex-row-reverse gap-8 items-start w-full">
      ${sidebarCode.replace(/\$/g, '$$$$')}
      
      {/* Main Workspace */}
      <div className="flex-1 w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-12 min-h-[650px] flex flex-col relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" style={{ background: ACCENT }} />
          
          <div className="relative text-center space-y-4 mb-12">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: ACCENT_GRADIENT }}>
              {isPdfToImg ? <FileImage size={32} /> : isImgToPdf ? <FileText size={32} /> : <ImageIcon size={32} />}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {meta.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              {meta.desc}
            </p>
          </div>

          ${successAndProcessingCode.replace(/\$/g, '$$$$')}
  )}
`;

const newCode = code.substring(0, returnIndex) + '  return (\n  <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-center w-full">\n' + newEmptyState + '\n  </div>\n  );\n}';

fs.writeFileSync(file, newCode, 'utf8');
console.log('Layout applied to ImageConverter.tsx!');
