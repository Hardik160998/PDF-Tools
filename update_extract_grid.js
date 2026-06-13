const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ExtractPages.tsx', 'utf8');

const newGrid = `      <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
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
`;

// Insert newGrid right after `{!file && !loading && (\n  <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">`
const targetRegex = /(\{\!file && \!loading && \(\s*<div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center">)/;

code = code.replace(targetRegex, `$1\n${newGrid}`);

fs.writeFileSync('src/components/tools/ExtractPages.tsx', code);
