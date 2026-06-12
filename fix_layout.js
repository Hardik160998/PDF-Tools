const fs = require('fs');
const path = require('path');

const targetFiles = [
  'RepairTool.tsx',
  'OptimizePdf.tsx',
  'OcrPdf.tsx',
  'MergeSplit.tsx',
  'ImageConverter.tsx',
  'ExtractText.tsx',
  'CropPdf.tsx',
  'Compressor.tsx'
];

targetFiles.forEach(file => {
  const fp = path.join('src/components/tools', file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // Replace flex-col lg:flex-row with flex-col-reverse lg:flex-row-reverse
    content = content.replace(
      /className="flex flex-col lg:flex-row gap-8 items-start"/g,
      'className="flex flex-col-reverse lg:flex-row-reverse gap-8 items-start"'
    );

    fs.writeFileSync(fp, content);
    console.log(`Updated layout in ${file}`);
  }
});
