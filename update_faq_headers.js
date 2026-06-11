const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('page.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles(path.join('src', 'app', 'tool'));
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip files that don't have FAQs
  if (!content.includes('Frequently Asked Questions')) continue;

  // Find the color from focus-visible:ring-[color]-500
  const colorMatch = content.match(/focus-visible:ring-([a-z]+)-500/);
  if (!colorMatch) continue;
  const themeColor = colorMatch[1];

  let updated = false;

  // We want to target the span inside the H2 that says "Frequently Asked Questions"
  // Example: 
  // <h2 className="...">
  //   <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
  //     <HelpCircle size={24} />
  //   </span>
  //   Frequently Asked Questions
  // </h2>

  // We find <h2... then <span className="...bg-... text-..."> then <HelpCircle .../> then </span> then Frequently Asked Questions </h2>
  const h2Regex = /(<h2[^>]*>\s*<span className="[^"]*bg-)[a-z]+(-500\/10 text-)[a-z]+(-(?:500|600)[^"]*">\s*<HelpCircle[^>]*\/>\s*<\/span>\s*Frequently Asked Questions\s*<\/h2>)/g;

  content = content.replace(h2Regex, (match, p1, p2, p3) => {
    // If it already matches the theme color, it's fine, but we'll just overwrite it anyway
    updated = true;
    return `${p1}${themeColor}${p2}${themeColor}${p3}`;
  });

  if (updated) {
    fs.writeFileSync(file, content);
    count++;
  }
}

console.log(`Updated ${count} files.`);
