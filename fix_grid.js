const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

const regex3 = /<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">\s*\{\[\s*\{ icon: Zap, title: "Instant", desc: "Lightning fast processing" \},\s*\{ icon: Shield, title: "Private", desc: "Your files stay secure" \},\s*\{ icon: Sparkles, title: "Lossless", desc: "Perfect quality output" \}\s*\]\.map\(\(f, i\) => \([\s\S]*?<\/div>\s*\)\}\)\s*<\/div>\s*/g;

let matches = [...code.matchAll(regex3)];

if (matches.length === 3) {
    // Keep the 1st (before upload) and 2nd (after upload)
    // Remove the 3rd one. Actually, wait.
    // Let's just remove the 3rd one exactly.
    code = code.substring(0, matches[2].index) + code.substring(matches[2].index + matches[2][0].length);
}

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
