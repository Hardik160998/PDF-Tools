const fs = require('fs');
const path = require('path');

const TOOL_DIR = path.join(__dirname, '../src/app/tool');

const dirs = fs.readdirSync(TOOL_DIR).filter(d => fs.statSync(path.join(TOOL_DIR, d)).isDirectory() && d !== '[id]');

dirs.forEach(dir => {
  const pagePath = path.join(TOOL_DIR, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Find where export const metadata starts
  const metaStart = content.indexOf('export const metadata');
  if (metaStart !== -1) {
    // We want to delete from metaStart until the FIRST "};" that has no indentation (or just find the next export or function)
    // A simpler regex: match `export const metadata: Metadata = { ... };` robustly
    content = content.replace(/export const metadata.*?=.*?\{[\s\S]*?\n};\n?/m, '');
    
    // In case there are trailing spaces before };
    content = content.replace(/export const metadata[\s\S]*?\n\s*};\n?/m, '');
    
    // If it STILL exists, let's just do a manual curly brace matching
    if (content.includes('export const metadata')) {
       let start = content.indexOf('export const metadata');
       let end = start;
       let braceCount = 0;
       let foundFirstBrace = false;
       for (let i = start; i < content.length; i++) {
         if (content[i] === '{') {
           braceCount++;
           foundFirstBrace = true;
         } else if (content[i] === '}') {
           braceCount--;
         }
         if (foundFirstBrace && braceCount === 0) {
           // wait for the trailing semicolon if any
           let finalEnd = i + 1;
           if (content[finalEnd] === ';') finalEnd++;
           content = content.substring(0, start) + content.substring(finalEnd);
           break;
         }
       }
    }
  }

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log(`Updated ${dir}`);
});
