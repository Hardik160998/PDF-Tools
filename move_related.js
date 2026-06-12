const fs = require('fs');
const path = require('path');

const ecomFiles = [
  'flipkart-cropper',
  'amazon-cropper',
  'meesho-cropper',
  'snapdeal-cropper',
  'meshocrop'
];

ecomFiles.forEach(tool => {
  const fp = path.join('src/app/tool', tool, 'page.tsx');
  if (!fs.existsSync(fp)) return;
  
  let content = fs.readFileSync(fp, 'utf8');

  // Step 1: Remove from the bottom
  content = content.replace(/\{\/\*\s*Related Tools Section\s*\*\/\}\s*<RelatedTools \/>/gi, '');
  content = content.replace(/<RelatedTools \/>/gi, ''); // remove any other instances

  // Step 2: Insert before SEO section
  content = content.replace(
    /\{\/\* 4\. Complete SEO Optimized Content Section \*\/\}/g,
    '<RelatedTools />\n\n        {/* 4. Complete SEO Optimized Content Section */}'
  );

  fs.writeFileSync(fp, content);
  console.log('Moved RelatedTools in', tool);
});
