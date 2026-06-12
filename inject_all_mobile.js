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
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    let changed = false;

    // 1. Hide the sidebar button by adding 'hidden lg:block' to its wrapper div
    // Most sidebar buttons are wrapped in a <div className="pt-2"> or <div className="pt-6 border-t ...">
    // Let's find the button wrapper inside the sidebar. The sidebar is between "Settings Sidebar" and "Main Workspace"
    
    // Split the file into Sidebar and Workspace
    const workspaceIdx = content.indexOf('Main Workspace');
    if (workspaceIdx !== -1) {
      let sidebarCode = content.substring(0, workspaceIdx);
      let workspaceCode = content.substring(workspaceIdx);

      // Find the last button in the sidebar (which is the submit button)
      // We look for a <div className="pt-..."> that wraps the main button
      const buttonWrapperRegex = /<div className=\"pt-(?:2|6)[^\"]*\">\s*<button[\s\S]*?<\/button>\s*<\/div>/;
      
      const match = sidebarCode.match(buttonWrapperRegex);
      if (match) {
        const originalWrapper = match[0];
        
        // Add hidden lg:block if not already there
        if (!originalWrapper.includes('hidden lg:block')) {
          const newWrapper = originalWrapper.replace(/className=\"(pt-(?:2|6)[^\"]*)\"/, 'className="$1 hidden lg:block"');
          sidebarCode = sidebarCode.replace(originalWrapper, newWrapper);
          
          // 2. Inject the mobile button into the workspace
          // We need to find the right place to inject it. Usually right before the closing </div> of the workspace's main wrapper.
          // In most files, the workspace ends just before the features grid, or just before the final 3 closing </div>s.
          // Actually, let's extract the button element itself from the originalWrapper
          const buttonMatch = originalWrapper.match(/<button[\s\S]*?<\/button>/);
          if (buttonMatch) {
            let buttonHTML = buttonMatch[0];
            
            // Adjust the button wrapper for mobile
            let mobileButtonWrapper = `\n        {/* Mobile-only action button in upload section */}\n        <div className="pt-6 lg:hidden block animate-in fade-in slide-in-from-bottom-4 duration-500">\n          ${buttonHTML}\n        </div>\n`;
            
            // Where to inject? Let's find the closing </div> of the flex-1 workspace.
            // A heuristic: find the last occurrence of </div> before <input type="file" (if any) or before the end of the flex-1 div.
            // Better heuristic: match the end of the file list or the empty state.
            
            // Let's do something simpler: inject it just before the </> or </div> that closes the workspace
            // We can look for the string that marks the end of the workspace.
            // Since every file varies, maybe we can inject it right after the file list or drag-and-drop zone.
            // The safest generic spot in the workspace is at the very end of the <div className="flex-1 w-full space-y-..."> div.
            
            const flex1EndRegex = /(<\/div>\s*)\n\s*<\/div>\n\s*<\/div>\n\s*(?:<div className="grid|<style jsx global>|export default|function|$)/;
            
            // Let's try finding the closing of the `flex-1` div which is the second to last </div> before the features grid or end.
            const workspaceMatch = workspaceCode.match(/(<\/div>\s*)\n\s*(<\/div>\s*)\n\s*(<\/div>\s*)\n\s*(?:<div className="grid|<style jsx global>|export default|function|<input ref={fileInputRef}|$)/);
            if (workspaceMatch) {
                // The workspace is inside the flex container. The structure is usually:
                // <div flex-1> ... </div>
                // </div> (flex container)
                // </div> (max-w-7xl)
                // 
                // We want to insert inside the flex-1 div, so before the first </div>
                workspaceCode = workspaceCode.replace(workspaceMatch[0], mobileButtonWrapper + workspaceMatch[0]);
                changed = true;
            } else {
                console.log("Could not find insertion point for " + file);
            }
          }
          
          if (changed) {
             content = sidebarCode + workspaceCode;
             fs.writeFileSync(fp, content);
             console.log("Successfully updated " + file);
          }
        } else {
          console.log("Already updated " + file);
        }
      } else {
        console.log("Could not find sidebar button wrapper in " + file);
      }
    } else {
      console.log("No Main Workspace comment in " + file);
    }
  }
});
