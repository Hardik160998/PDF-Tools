const fs = require('fs');
const path = require('path');

const dir = 'src/app/tool';
const files = [];

function getFiles(d) {
  const items = fs.readdirSync(d);
  for (const item of items) {
    const fullPath = path.join(d, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath);
    } else if (item === 'page.tsx' && d !== 'src/app/tool') {
      files.push(fullPath);
    }
  }
}

getFiles(dir);

let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  let oldContent;
  do {
    oldContent = content;
    // Remove ANY section that maps over RELATED
    content = content.replace(/\{\/\*[^}]*(?:Related|Internal Links)[^}]*\*\/\}\s*<section[^>]*>[\s\S]*?RELATED(?:\_TOOLS)?\.map[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<section[^>]*>[\s\S]*?RELATED(?:\_TOOLS)?\.map[\s\S]*?<\/section>/gi, '');
    // Remove ANY div that maps over RELATED at the end
    content = content.replace(/<div[^>]*>\s*<h3[^>]*>[\s\S]*?RELATED(?:\_TOOLS)?\.map[\s\S]*?<\/div>\s*<\/div>/gi, '');
  } while (oldContent !== content);

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nModified ${modifiedCount} files to remove leftover RELATED sections.`);
