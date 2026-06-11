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

const oldRegex = /<summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg">\s*<h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors pr-4">\s*\{item\.q\}\s*<\/h3>/g;

const newStr = `<summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg">
                      <div className="flex items-center gap-3 pr-4">
                        <span className="p-1.5 rounded-full bg-red-500/10 text-red-500 shrink-0">
                          <HelpCircle size={18} />
                        </span>
                        <h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors">
                          {item.q}
                        </h3>
                      </div>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (oldRegex.test(content)) {
    content = content.replace(oldRegex, newStr);
    fs.writeFileSync(file, content);
    count++;
  } else if (content.includes('{item.q}')) {
    console.log('Mismatch format in ' + file);
  }
}
console.log('Updated ' + count + ' files.');
