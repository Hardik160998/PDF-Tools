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

  // Add import if missing
  if (!content.includes('import RelatedTools')) {
    content = content.replace(
      'import { getToolMeta',
      'import RelatedTools from "@/components/tools/RelatedTools";\nimport { getToolMeta'
    );
  }

  // Remove the const RELATED array
  content = content.replace(/const RELATED(?:_TOOLS)?\s*=\s*\[[\s\S]*?\];/g, '');

  // Replace the Related Tools Navigation Links section with <RelatedTools />
  content = content.replace(
    /\{\/\*\s*Related Tools Navigation Links\s*\*\/\}\s*<div[^>]*>(?:(?!<\/div>\s*<\/div>)[\s\S])*?<\/div>\s*<\/div>/g,
    '<RelatedTools />'
  );

  // In case the comment is different, or missing, try another regex for the div mapping RELATED
  content = content.replace(
    /<div className="pt-10[^>]*>[\s\S]*?(?:Related Ecommerce|Related Image)[\s\S]*?<\/div>\s*<\/div>/gi,
    '<RelatedTools />'
  );
  
  // Just to be absolutely sure we get rid of the RELATED.map error if it's lingering
  content = content.replace(/\{RELATED(?:_TOOLS)?\.map\([\s\S]*?\)\}\s*<\/div>/g, '</div');

  fs.writeFileSync(fp, content);
  console.log('Fixed', tool);
});
