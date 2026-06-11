const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('page.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles(path.join('src', 'app', 'tool'));
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip files that don't have FAQs
  if (!content.includes('Frequently Asked Questions')) continue;

  // Find the color from focus-visible:ring-[color]-500
  const colorMatch = content.match(/focus-visible:ring-([a-z]+)-500/);
  if (!colorMatch) continue;
  const color = colorMatch[1];

  let updated = false;

  // TYPE A: <h3 ...> {item.q} </h3> 
  // We need to wrap it in a div and add the icon span
  const typeARegex = /(<h3 className="[^"]*text-base[^"]*text-slate-800[^"]*group-hover:text-[a-z]+-500[^"]*">\s*\{(?:item|faq)\.q\}\s*<\/h3>)/g;
  
  if (typeARegex.test(content)) {
    content = content.replace(typeARegex, (match) => {
      return `<div className="flex items-center gap-3 pr-4">\n  <span className="p-1.5 rounded-full bg-${color}-500/10 text-${color}-500 shrink-0">\n    <HelpCircle size={18} />\n  </span>\n  ${match.replace(' pr-4', '')}\n</div>`;
    });
    updated = true;
  }

  // TYPE B: <HelpCircle size={18} className="text-[color]-500 shrink-0" />
  // We need to replace it with the span wrapper around HelpCircle
  // Need to account for optional newlines and spaces.
  const typeBRegex = /<HelpCircle\s*size=\{18\}\s*className="text-[a-z]+-500 shrink-0"\s*\/>/g;
  
  if (typeBRegex.test(content)) {
    content = content.replace(typeBRegex, `<span className="p-1.5 rounded-full bg-${color}-500/10 text-${color}-500 shrink-0">\n  <HelpCircle size={18} />\n</span>`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(file, content);
    count++;
  }
}

console.log(`Updated ${count} files.`);
