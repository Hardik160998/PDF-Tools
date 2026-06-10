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
  
  const themeMatch = content.match(/hover:text-([a-z]+)-500 transition-colors focus-visible:outline-none/);
  if (!themeMatch) {
     console.log("Could not find theme color for: " + file);
     continue;
  }
  const themeColor = themeMatch[1];
  let changed = false;

  const questionRegex = /(<HelpCircle[\s\S]*?className="[^"]*text-)[a-z]+(-500[^"]*"[\s\S]*?\/>)/g;
  content = content.replace(questionRegex, (match, p1, p2) => {
      changed = true;
      return `${p1}${themeColor}${p2}`;
  });

  const ringRegex = /(<summary[^>]*focus-visible:ring-)[a-z]+(-500[^>]*>)/g;
  content = content.replace(ringRegex, (match, p1, p2) => {
      changed = true;
      return `${p1}${themeColor}${p2}`;
  });

  const headerIconRegex = /(<span className="p-2 rounded-xl bg-)[a-z]+(-500\/10 text-)[a-z]+(-500">)/g;
  content = content.replace(headerIconRegex, (match, p1, p2, p3) => {
      changed = true;
      return `${p1}${themeColor}${p2}${themeColor}${p3}`;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    updatedFiles++;
  }
}

console.log(`Successfully forced theme color on ${updatedFiles} files.`);
