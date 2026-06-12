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

  // 1. Add import (robust for \r\n and any first import)
  if (!content.includes('import RelatedTools')) {
    content = content.replace(/(import )/, 'import RelatedTools from "@/components/tools/RelatedTools";\n$1');
  }

  // 2. Remove old RELATED arrays
  content = content.replace(/const RELATED(_TOOLS)?\s*=\s*\[[\s\S]*?\];/g, '');

  // 3. Remove old bottom sections that are div or section
  let oldContent;
  do {
    oldContent = content;
    // Remove if it's a section
    content = content.replace(/\{\/\*[^}]*(?:Internal Linking|Related)[^}]*\*\/\}\s*<section[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools|Related Ecommerce)[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<section[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools|Related Ecommerce)[\s\S]*?<\/section>/gi, '');
    
    // Remove if it's a div (like in meesho-cropper)
    content = content.replace(/\{\/\*[^}]*(?:Internal Linking|Related)[^}]*\*\/\}\s*<div[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools|Related Ecommerce)[\s\S]*?<\/div>/gi, '');
    // Or just a div block that contains the heading
    content = content.replace(/<div[^>]*>[\s\S]*?<h3[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools|Related Ecommerce)[\s\S]*?<\/h3>[\s\S]*?<\/div>\s*<\/div>/gi, '');

  } while (oldContent !== content);

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nModified ${modifiedCount} files for missing imports or remaining old sections.`);
