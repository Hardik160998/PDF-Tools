const fs = require('fs');

let code = fs.readFileSync('src/components/tools/Compressor.tsx', 'utf8');

// I'll replace the bottom section. I need to be precise.
// Let's just find the Add More Documents button and go from there.

const startMarker = '<span className="text-xs font-medium uppercase tracking-widest">Add More Documents</span>';
const startIndex = code.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find start marker');
  process.exit(1);
}

// Keep everything up to the button label
const before = code.substring(0, startIndex + startMarker.length);

const replacement = `
  </button>
  </div>
  )}
  </div>

  <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 mt-6 relative z-10">
  {[
  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
  ].map((f, i) => (
  <div key={i} className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
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

fs.writeFileSync('src/components/tools/Compressor.tsx', before + replacement);
console.log('Done!');
