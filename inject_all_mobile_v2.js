const fs = require('fs');
const path = require('path');

const targetFiles = [
  'RepairTool.tsx',
  'OptimizePdf.tsx',
  'OcrPdf.tsx',
  'ExtractText.tsx',
  'Compressor.tsx',
  'ImageConverter.tsx',
  'OrganizeTool.tsx',
  'ExtractPages.tsx',
  'DeletePages.tsx',
  'AmazonCropper.tsx',
  'FlipkartCropper.tsx',
  'SnapdealCropper.tsx',
  'MeeshoCropper.tsx',
  'MeeshoCropLabel.tsx',
  'AddBlankPage.tsx',
  'CropPdf.tsx',
  'FlattenPdf.tsx'
];

targetFiles.forEach(file => {
  const fp = path.join('src/components/tools', file);
  if (!fs.existsSync(fp)) return;
  
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  const buttonRegex = /<div className=\"(pt-[2468]|pt-10)(?:\s+border-t[^\"]*)?\">\s*<button[^>]+onClick={([^}]+)}[^>]+>[\s\S]*?<\/button>\s*<\/div>/g;
  
  let match;
  let mobileButtonHTML = null;
  let wrapperToReplace = null;
  let newWrapperHTML = null;

  while ((match = buttonRegex.exec(content)) !== null) {
      const btnWrapper = match[0];
      
      // Heuristic for submit button: typically large and colored
      if ((btnWrapper.includes('py-') || btnWrapper.includes('p-')) && btnWrapper.includes('text-white') && btnWrapper.includes('shadow')) {
          if (!btnWrapper.includes('hidden lg:block')) {
              wrapperToReplace = btnWrapper;
              newWrapperHTML = btnWrapper.replace(/className=\"(pt-[^\"]*)\"/, 'className="$1 hidden lg:block"');
              
              const buttonMatch = btnWrapper.match(/<button[\s\S]*?<\/button>/);
              if (buttonMatch) {
                  mobileButtonHTML = `\n        {/* Mobile-only action button in upload section */}\n        <div className="pt-6 lg:hidden block animate-in fade-in slide-in-from-bottom-4 duration-500">\n          ${buttonMatch[0]}\n        </div>\n`;
              }
              break;
          }
      }
  }

  if (wrapperToReplace && mobileButtonHTML) {
      content = content.replace(wrapperToReplace, newWrapperHTML);
      
      // Escape the parenthesis in the regex properly: \);
      const endRegex = /(<\/div>\s*)\r?\n(\s*)(<\/div>\s*)\r?\n(\s*)(<\/div>\s*)\r?\n(?:\s*(?:<div className="grid grid-cols-1|<style jsx global>|<\/div>|\);|export default|function))/;
      
      const endMatch = content.match(endRegex);
      if (endMatch) {
          const injection = mobileButtonHTML + endMatch[1] + "\n" + endMatch[2] + endMatch[3] + "\n" + endMatch[4] + endMatch[5] + "\n";
          content = content.replace(endRegex, injection);
          fs.writeFileSync(fp, content);
          console.log("Successfully injected mobile button for " + file);
      } else {
          const altEndRegex = /(<\/div>\s*)\r?\n(\s*)(<\/div>\s*)\r?\n(\s*)(<\/div>\s*)\r?\n/;
          const altEndMatches = [...content.matchAll(new RegExp(altEndRegex, 'g'))];
          if (altEndMatches.length > 0) {
              const lastMatch = altEndMatches[altEndMatches.length - 1];
              const injection = mobileButtonHTML + lastMatch[1] + "\n" + lastMatch[2] + lastMatch[3] + "\n" + lastMatch[4] + lastMatch[5] + "\n";
              content = content.replace(lastMatch[0], injection);
              fs.writeFileSync(fp, content);
              console.log("Successfully injected mobile button for " + file + " (using alt regex)");
          } else {
              console.log("Could not find workspace end for " + file);
          }
      }
  } else {
      console.log("Could not find or already processed button for " + file);
  }
});
