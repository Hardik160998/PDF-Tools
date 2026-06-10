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

let replaced = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('border-slate-300 dark:border-slate-800 pt-4')) {
    content = content.replace(/border-t border-slate-300 dark:border-slate-800 pt-4/g, 'border-t border-slate-200 dark:border-slate-800 pt-4');
    fs.writeFileSync(file, content);
    replaced++;
  }
}
console.log(`Successfully updated ${replaced} files to border-slate-200.`);
