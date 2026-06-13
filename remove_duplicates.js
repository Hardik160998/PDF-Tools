const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

// 1. Remove duplicate 3-item grids (Instant, Private, Lossless)
const threeItemGridRegex = /<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">\s*\{\[\s*\{ icon: Zap, title: "Instant", desc: "Lightning fast processing" \},[\s\S]*?\]\.map\(\(f, i\) => \([\s\S]*?<\/div>\s*\)\}\)\s*<\/div>/g;

let threeItemMatches = [...code.matchAll(threeItemGridRegex)];
if (threeItemMatches.length > 1) {
    // Keep only the first occurrence, replace the rest with empty string
    // Wait, the first one is the intended one before the card, or AFTER the card?
    // Looking at AddBlankPage.tsx, one is above the dropzone, one is inside the After Upload view.
    // Wait! The 3-item grid is supposed to be BOTH in the before-upload view AND the after-upload view. So there should be TWO copies total in the file!
    // Let's check how many there are. In view_file, we saw lines 345-398 had 3 copies stacked next to each other! That means they are ALL inside the after-upload view.
    // The safest way is to just replace consecutive identical blocks.
    
    // The exact string for the 3-item grid:
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
      
    // Replace 3 consecutive copies with 1. We don't know the exact whitespace, so we use regex
    const repeatedGrid3Regex = /(<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">[\s\S]*?<\/div>\s*){2,}/g;
    
    code = code.replace(repeatedGrid3Regex, (match, p1) => {
        return p1;
    });
}


// 2. Remove duplicate 4-item grids (100% Secure, Auto Delete, Works Offline, Super Fast)
// The exact string is preceded by {/* Universal Feature Grid */} (sometimes)
const repeatedGrid4Regex = /((\{\/\*\s*Universal Feature Grid\s*\*\/\}\s*)?<div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-12 border-t border-slate-100 dark:border-slate-800\/50 z-10">[\s\S]*?<\/div>\s*){2,}/g;

code = code.replace(repeatedGrid4Regex, (match, p1) => {
    return p1;
});

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
