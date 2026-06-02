const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir("./src", (filePath) => {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;
    
    // Remove explicit font family classes
    content = content.replace(/\bfont-outfit\b/g, "");
    content = content.replace(/\bfont-sans\b/g, "");
    content = content.replace(/\bfont-inter\b/g, "");
    
    // Downgrade font weights > 700 to font-bold (700)
    content = content.replace(/\bfont-black\b/g, "font-bold");
    content = content.replace(/\bfont-\[900\]\b/g, "font-bold");
    content = content.replace(/\bfont-extrabold\b/g, "font-bold");

    // Clean up multiple spaces that might result from removal
    content = content.replace(/ +/g, " ");
    content = content.replace(/ "\}/g, "\"}");
    content = content.replace(/className=" /g, "className=\"");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  }
});
