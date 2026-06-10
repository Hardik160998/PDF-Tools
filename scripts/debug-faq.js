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

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  const headerMatch = content.match(/<span[^>]*text-([a-z]+)-(?:500|600)[^>]*>[\s\S]*?<HelpCircle[^>]*>[\s\S]*?<\/span>[\s\S]*?Frequently Asked Questions/);
  
  let qMatch = content.match(/<HelpCircle\s+size=\{18\}\s+className="text-([a-z]+)-500 shrink-0"/);
  
  let filename = file.split('\\').pop();
  let folder = file.split('\\').slice(-2, -1)[0];
  
  if (!headerMatch) {
    console.log(`${folder} -> NO HEADER MATCH`);
  } else if (!qMatch) {
    console.log(`${folder} -> NO QUESTION MATCH (Header: ${headerMatch[1]})`);
  } else {
    if (headerMatch[1] !== qMatch[1]) {
       console.log(`${folder} -> MISMATCH: Header=${headerMatch[1]}, Q=${qMatch[1]}`);
    } else {
       // match
    }
  }
}
