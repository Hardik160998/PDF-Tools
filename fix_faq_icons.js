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

  // We are looking for:
  // <span className="p-1.5 rounded-full bg-[color]-500/10 text-[color]-500 shrink-0">
  //   <HelpCircle size={18} />
  // </span>
  
  // This can be matched with a regex
  const regex = /<span className="p-1\.5 rounded-full bg-([a-z]+)-500\/10 text-\1-500 shrink-0">\s*<HelpCircle size=\{18\} \/>\s*<\/span>/g;
  
  if (regex.test(content)) {
      const newContent = content.replace(regex, '<HelpCircle size={22} className="text-$1-500 shrink-0" />');
      fs.writeFileSync(file, newContent);
      count++;
  }
}

console.log('Updated ' + count + ' files to remove double circle in FAQs.');
