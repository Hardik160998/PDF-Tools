const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ExtractPages.tsx', 'utf8');

// The line is: <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-2">
// We want to change mb-2 to mb-6
code = code.replace(
  '<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-2">',
  '<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">'
);

fs.writeFileSync('src/components/tools/ExtractPages.tsx', code);
