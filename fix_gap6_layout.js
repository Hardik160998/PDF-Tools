const fs = require('fs');
const path = require('path');

const targetFiles = [
  'OrganizeTool.tsx',
  'ExtractPages.tsx',
  'DeletePages.tsx',
  'AmazonCropper.tsx',
  'AddBlankPage.tsx'
];

targetFiles.forEach(file => {
  const fp = path.join('src/components/tools', file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // Replace flex-col lg:flex-row gap-6 with flex-col-reverse lg:flex-row-reverse gap-6
    content = content.replace(
      /className="\s*flex flex-col lg:flex-row gap-6 items-start"/g,
      'className="flex flex-col-reverse lg:flex-row-reverse gap-6 items-start"'
    );

    // Some might have extra spaces, so also try a looser regex
    content = content.replace(
      /className="flex flex-col lg:flex-row gap-6 items-start"/g,
      'className="flex flex-col-reverse lg:flex-row-reverse gap-6 items-start"'
    );

    fs.writeFileSync(fp, content);
    console.log(`Updated layout in ${file}`);
  }
});
