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
    
    // Replace font-bold with font-black but only on lines containing <h1
    content = content.split("\n").map(line => {
      if (line.includes("<h1") && line.includes("font-bold")) {
        return line.replace(/\bfont-bold\b/g, "font-black");
      }
      return line;
    }).join("\n");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  }
});
