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

  // 1. Skip if already has RelatedTools
  if (content.includes('RelatedTools />')) {
    continue;
  }

  // 2. Add import
  if (!content.includes('import RelatedTools')) {
    content = content.replace(/(import )/, 'import RelatedTools from "@/components/tools/RelatedTools";\n$1');
  }

  // 3. Remove old RELATED arrays
  content = content.replace(/const RELATED(_TOOLS)?\s*=\s*\[[\s\S]*?\];/g, '');

  // 4. Safely remove old sections without crossing tags
  let oldContent;
  do {
    oldContent = content;
    
    // Safely remove <section>...</section>
    content = content.replace(/\{\/\*[^}]*(?:Internal Linking|Related)[^}]*\*\/\}\s*<section[^>]*>(?:(?!<\/section>)[\s\S])*?(?:Explore More PDF Tools|Related Document Tools|Explore More Image & PDF Tools|Related Ecommerce|Explore More Image|Related Image)(?:(?!<\/section>)[\s\S])*?<\/section>/gi, '');
    content = content.replace(/<section[^>]*>(?:(?!<\/section>)[\s\S])*?(?:Explore More PDF Tools|Related Document Tools|Explore More Image & PDF Tools|Related Ecommerce|Explore More Image|Related Image)(?:(?!<\/section>)[\s\S])*?<\/section>/gi, '');
    
    // Safely remove <div>...</div> that contains the map
    content = content.replace(/\{\/\*[^}]*(?:Internal Linking|Related)[^}]*\*\/\}\s*<div[^>]*>(?:(?!<\/div>\s*<\/div>)[\s\S])*?(?:Explore More PDF Tools|Related Document Tools|Explore More Image & PDF Tools|Related Ecommerce|Explore More Image|Related Image)(?:(?!<\/div>\s*<\/div>)[\s\S])*?<\/div>\s*<\/div>/gi, '');
    content = content.replace(/<div[^>]*>(?:(?!<\/div>\s*<\/div>)[\s\S])*?(?:Explore More PDF Tools|Related Document Tools|Explore More Image & PDF Tools|Related Ecommerce|Explore More Image|Related Image)(?:(?!<\/div>\s*<\/div>)[\s\S])*?<\/div>\s*<\/div>/gi, '');
  } while (oldContent !== content);

  // 5. Inject <RelatedTools />
  const seoStartRegex = /({\/\*\s*(Feature Cards Grid|Rich SEO Content Section|4\. Complete SEO Optimized Content Section).*?\*\/})/i;
  if (seoStartRegex.test(content)) {
    content = content.replace(seoStartRegex, '<RelatedTools />\n\n        $1');
  } else {
    // Fallback: after mb-16
    const mb16Regex = /(className="mb-16"[^>]*>(?:(?!<\/(?:div|section)>)[\s\S])*?<\/(?:div|section)>)/;
    if (mb16Regex.test(content)) {
      content = content.replace(mb16Regex, '$1\n\n        <RelatedTools />\n');
    } else {
      content = content.replace(/(<\/article>)/, '  <RelatedTools />\n        $1');
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nModified ${modifiedCount} files safely.`);
