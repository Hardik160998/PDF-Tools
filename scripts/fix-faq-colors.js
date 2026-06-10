const fs = require('fs');

const files = [
  "d:\\PDF-Tools\\src\\app\\tool\\compare-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\excel-to-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\pdf-to-excel\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\repair-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\split\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\word-to-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\snapdeal-cropper\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\ppt-to-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\pdf-to-xml\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\pdf-to-word\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\organize\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\optimize-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\meshocrop\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\ocr-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\jpg-to-pdf\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\meesho-cropper\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\extract-text\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\extract-pages\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\flipkart-cropper\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\esign\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\delete-pages\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\amazon-cropper\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\compress\\page.tsx",
  "d:\\PDF-Tools\\src\\app\\tool\\add-blank-page\\page.tsx"
];

let updatedFiles = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the header color:
  const headerMatch = content.match(/<span[^>]*text-([a-z]+)-(?:500|600)[^>]*>[\s\S]*?<HelpCircle[^>]*>[\s\S]*?<\/span>[\s\S]*?Frequently Asked Questions/);
  
  if (headerMatch) {
    const headerColor = headerMatch[1];
    let changed = false;
    
    // Replace the question HelpCircle color
    const questionRegex = /<HelpCircle\s+size=\{18\}\s+className="text-([a-z]+)-500 shrink-0"/g;
    content = content.replace(questionRegex, (match, p1) => {
      if (p1 !== headerColor) {
        changed = true;
        return match.replace(`text-${p1}-500`, `text-${headerColor}-500`);
      }
      return match;
    });
    
    // Also fix the focus-visible ring color on the summary
    const ringRegex = /focus-visible:ring-([a-z]+)-500"/g;
    content = content.replace(ringRegex, (match, p1) => {
        if(p1 !== headerColor) {
            changed = true;
            return `focus-visible:ring-${headerColor}-500"`;
        }
        return match;
    });

    if (changed) {
      fs.writeFileSync(file, content);
      updatedFiles++;
    }
  }
}

console.log(`Successfully updated ${updatedFiles} files to match their FAQ heading colors.`);
