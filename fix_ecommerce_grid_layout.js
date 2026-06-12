const fs = require('fs');
const path = require('path');

const targetFiles = [
  'FlipkartCropper.tsx',
  'MeeshoCropper.tsx',
  'SnapdealCropper.tsx',
  'MeeshoCropLabel.tsx'
];

targetFiles.forEach(file => {
  const fp = path.join('src/components/tools', file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // 1. Change grid to flex
    content = content.replace(
      /className="grid grid-cols-1 lg:grid-cols-\[300px_1fr\] gap-4 sm:gap-8"/g,
      'className="flex flex-col-reverse lg:flex-row-reverse gap-4 sm:gap-8 items-start"'
    );

    // 2. Add flex dimensions to the Sidebar
    content = content.replace(
      /className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow duration-300 h-fit lg:sticky lg:top-4 overflow-hidden"/g,
      'className="w-full lg:w-[300px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow duration-300 h-fit lg:sticky lg:top-4 overflow-hidden flex-shrink-0"'
    );

    // 3. Add flex dimensions to the Main Workspace
    content = content.replace(
      /className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-shadow duration-300 text-center"/g,
      'className="flex-1 w-full bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-shadow duration-300 text-center"'
    );

    fs.writeFileSync(fp, content);
    console.log(`Updated layout in ${file}`);
  }
});
