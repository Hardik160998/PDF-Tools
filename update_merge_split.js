const fs = require('fs');
const content = fs.readFileSync('d:\\PDF-Tools\\src\\components\\tools\\MergeSplit.tsx', 'utf8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('{files.length === 0 ? ('));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.trim() === ')}' && lines[i+1].trim() === '</div>' && lines[i+2].trim() === '{/* Mobile-only action button in upload section */}');

if (startIndex !== -1 && endIndex !== -1) {
  const before = lines.slice(0, startIndex).join('\n');
  const after = lines.slice(endIndex + 1).join('\n');

  const newSection = `
  {(mergedResult || (isSplit && files.some(f => f.status === 'done'))) ? (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className={\`p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 mb-8 sm:mb-6 text-center lg:text-left \${isSplit ? 'bg-violet-50 dark:bg-violet-500/5 border-violet-100 dark:border-violet-500/20' : 'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20'}\`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className={\`p-4 text-white rounded-2xl shadow-xl \${isSplit ? 'bg-violet-500 shadow-violet-500/30' : 'bg-green-500 shadow-green-500/30'}\`}><CheckCircle2 size={32} /></div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">{isSplit ? 'Processing Complete' : 'Merge Ready'}</h4>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            {isSplit ? \`Successfully processed \${files.length} documents\` : \`Your unified PDF is ready for download\`}
          </p>
        </div>
      </div>
      {mergedResult && (
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <a href={mergedResult.url} download={mergedResult.filename} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
            <Download size={18} /> {isSplit ? 'Download Batch (ZIP)' : 'Download PDF'}
          </a>
          {isSplit && (
            <button onClick={downloadIndividually} className="px-10 py-5 bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 border-2 border-violet-100 dark:border-violet-500/20 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
              <FilePlus size={18} /> Individually
            </button>
          )}
        </div>
      )}
    </div>

    {isSplit && splitResults.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {splitResults.map((res, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:gap-6 group hover:shadow-2xl transition-all relative">
            <div className="aspect-square rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-violet-500/50 transition-colors">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-violet-500 shadow-inner group-hover:scale-110 transition-transform">
                <FileText size={48} />
              </div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest text-center">{res.pageCount || '?'} Pages</p>
              </div>
              <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center justify-between gap-4 px-1">
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-slate-900 dark:text-white uppercase truncate tracking-tighter mb-1">{res.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Part {i + 1}</p>
                </div>
              </div>
              <a href={res.url} download={res.name} className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl hover:scale-110 transition-all hover:bg-violet-500 hover:text-white group/btn">
                <Download size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  ) : (
  <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">
    {files.length === 0 && (
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
    )}

    <div 
      className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group relative overflow-hidden mb-6"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300">
        <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
          <div className="m-auto text-slate-300 dark:text-slate-600">
            {isSplit ? <Scissors size={32} /> : <Combine size={32} />}
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
        Supports single or multiple PDF files
      </p>

      {files.length === 0 ? (
        <button className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" style={{ background: ACCENT_GRADIENT }}>
          <Plus size={20} /> SELECT PDF FILES
        </button>
      ) : (
        <button 
          className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3" 
          style={{ background: ACCENT_GRADIENT }}
          onClick={(e) => {
            e.stopPropagation();
            handleProcess();
          }}
          disabled={processing}
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={20} /> PROCESSING...</>
          ) : (
            <>{isSplit ? <Scissors size={20} /> : <Combine size={20} />} {isSplit ? 'SPLIT PDF' : 'MERGE PDF'}</>
          )}
        </button>
      )}
    </div>

    {files.length === 0 && (
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
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
    )}

    {files.length > 0 && (
      <div className="w-full mt-6 space-y-3">
        <div className="flex items-center justify-between px-2 mb-4">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <History size={14} /> {isSplit ? 'Files Queue' : 'Merging Order'} ({files.length})
          </h4>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {files.map((f, i) => (
              <SortableFile key={f.id} f={f} i={i} isSplit={isSplit} removeFile={removeFile} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    )}
  </div>
  )}
`.replace(/\\/g, ''); // Fix escaping issues by replacing literal backslashes with nothing inside the string? No, just don't use raw backslash for \${}

// Wait, standard node string doesn't need double escaping.
`;

  const finalContent = before + '\n' + newSection + '\n' + after;
  fs.writeFileSync('d:\\PDF-Tools\\src\\components\\tools\\MergeSplit.tsx', finalContent, 'utf8');
  console.log('Successfully updated MergeSplit.tsx');
} else {
  console.log('Failed to find start or end bounds for replacement. Start: ', startIndex, 'End: ', endIndex);
}
