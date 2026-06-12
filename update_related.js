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
    content = content.replace(/(import .*;\n)/, '$1import RelatedTools from "@/components/tools/RelatedTools";\n');
  }

  // 3. Remove old RELATED arrays
  content = content.replace(/\/\/.*Internal links configuration[\s\S]*?\];/g, '');
  content = content.replace(/const RELATED = \[[\s\S]*?\];/g, '');

  // 4. Remove old sections
  // Remove sections containing "Explore More PDF Tools" or "Related Document Tools"
  // Note: We use lazy matching but bounded to </section>
  let oldContent;
  do {
    oldContent = content;
    // Remove the comment blocks above them too
    content = content.replace(/\{\/\*[^}]*(?:Internal Linking Section|Related tools)[^}]*\*\/\}\s*<section[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools)[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<section[^>]*>[\s\S]*?(?:Explore More PDF Tools|Related Document Tools)[\s\S]*?<\/section>/gi, '');
  } while (oldContent !== content);

  // 5. Inject <RelatedTools /> before the Feature Cards or SEO section
  const seoStartRegex = /({\/\*\s*(Feature Cards Grid|Rich SEO Content Section|4\. Complete SEO Optimized Content Section).*?\*\/})/i;
  if (seoStartRegex.test(content)) {
    content = content.replace(seoStartRegex, '<RelatedTools />\n\n        $1');
  } else {
    // Fallback: find mb-16 wrapper
    const mb16Regex = /(className="mb-16"[^>]*>[\s\S]*?<\/(?:div|section)>)/;
    if (mb16Regex.test(content)) {
      content = content.replace(mb16Regex, '$1\n\n        <RelatedTools />\n');
    } else {
      // Just put it before </article>
      content = content.replace(/(<\/article>)/, '  <RelatedTools />\n        $1');
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nModified ${modifiedCount} files.`);
