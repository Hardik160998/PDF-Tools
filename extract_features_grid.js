const fs = require('fs');
const path = require('path');

const targetFiles = [
  'ExtractText.tsx',
  'OcrPdf.tsx',
  'OptimizePdf.tsx',
  'RepairTool.tsx',
  'Compressor.tsx',
  'ImageConverter.tsx'
];

targetFiles.forEach(file => {
  const fp = path.join('src/components/tools', file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // The map function returns JSX in parenthesis: .map(() => ( ... ))
    // So it ends with ))}
    const regex = /(<div className="grid grid-cols-1 sm:grid-cols-3 gap-[68]">[\s\S]*?\)\)\}\r?\n\s*<\/div>)\r?\n(\s*)<\/div>\r?\n(\s*)<\/div>/;
    
    if (regex.test(content)) {
      content = content.replace(regex, (match, gridStr, space1, space2) => {
        // Inject mt-8 into the grid class
        const updatedGridStr = gridStr.replace('gap-6"', 'gap-6 mt-8"').replace('gap-8"', 'gap-8 mt-8"');
        
        // Return the two closing divs FIRST, then the updated grid
        return `\n${space1}</div>\n${space2}</div>\n\n${space1}${updatedGridStr}`;
      });
      
      fs.writeFileSync(fp, content);
      console.log(`Successfully extracted features grid for ${file}`);
    } else {
      console.log(`Regex did not match for ${file}`);
    }
  } else {
    console.log(`${file} does not exist`);
  }
});
