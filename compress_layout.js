const fs = require('fs');

function compressFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Reduce Title margin
  code = code.replace(/mb-12/g, 'mb-6');
  code = code.replace(/mb-10/g, 'mb-6');
  
  // Reduce padding on dropzone
  code = code.replace(/p-12 sm:p-20/g, 'p-8 sm:p-10');
  
  // Reduce container max-width to make it look manually sized and neat
  code = code.replace(/max-w-4xl/g, 'max-w-3xl');

  // Also reduce the space between top features
  code = code.replace(/gap-4 sm:gap-10/g, 'gap-4 sm:gap-6');

  // Reduce icon sizes in Title
  code = code.replace(/size={32}/g, 'size={24}');
  code = code.replace(/p-4 rounded-2xl/g, 'p-3 rounded-xl');

  // Reduce vertical padding on main container
  code = code.replace(/py-4 sm:py-8/g, 'py-2 sm:py-4');

  fs.writeFileSync(filePath, code, 'utf8');
}

compressFile('src/components/tools/ImageConverter.tsx');
compressFile('src/components/tools/MergeSplit.tsx');
console.log('Done');
