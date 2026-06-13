const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

const grid3 = `<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
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

// Find first occurrence of grid 3 inside the After-Upload view
const firstGrid3Index = code.indexOf(grid3, code.indexOf('{file && !result && ('));
if (firstGrid3Index !== -1) {
    // Find second occurrence
    const secondGrid3Index = code.indexOf(grid3, firstGrid3Index + grid3.length);
    if (secondGrid3Index !== -1) {
        // Remove second occurrence
        code = code.substring(0, secondGrid3Index) + code.substring(secondGrid3Index + grid3.length);
    }
}

const grid4 = `{/* Universal Feature Grid */}
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
      </div>`;

const firstGrid4Index = code.indexOf(grid4);
if (firstGrid4Index !== -1) {
    const secondGrid4Index = code.indexOf(grid4, firstGrid4Index + grid4.length);
    if (secondGrid4Index !== -1) {
        code = code.substring(0, secondGrid4Index) + code.substring(secondGrid4Index + grid4.length);
    }
}

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
