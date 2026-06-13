const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ExtractPages.tsx', 'utf8');

const featureGridStr = `
      {/* Universal Feature Grid - After Upload */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/50 z-10">
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

// Insert featureGridStr right after the Footer Action button block finishes
// Specifically, find `</button>\n  </div>\n  </div>\n  )}`
// and insert before `</div>\n  )}`

const insertionRegex = /(<\/button>\s*<\/div>\s*)(<\/div>\s*\)\})/;
code = code.replace(insertionRegex, `$1${featureGridStr}\n  $2`);

fs.writeFileSync('src/components/tools/ExtractPages.tsx', code);
