const fs = require('fs');
let code = fs.readFileSync('src/components/tools/OrganizeTool.tsx', 'utf8');

// 1. Remove the entire sidebar block from "return (" up to {/* Workspace */}
const sidebarRegex = /<div className="flex flex-col-reverse lg:flex-row-reverse gap-6 items-start">[\s\S]*?{\/\* Workspace \*\/}/;
code = code.replace(sidebarRegex, `{/* Workspace */}`);

// 2. Adjust the main container class since we don't have the flex row anymore
code = code.replace(
  '<div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">',
  '<div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left flex justify-center">'
);

// 3. Fix the max-width of the workspace div
code = code.replace(
  '<div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 min-h-[600px] flex flex-col w-full relative overflow-hidden">',
  '<div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 min-h-[600px] flex flex-col relative overflow-hidden">'
);

// 4. Inject the global actions toolbar directly ABOVE DndContext
const toolbar = `<>
    <div className="w-full mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-2 pt-2 border-b border-slate-100 dark:border-slate-800 pb-4 gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={rotateAll} className="justify-center px-2 sm:px-4 py-3 sm:py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 sm:gap-2">
            <RefreshCw size={14} /> Rotate All
          </button>
          <button onClick={reverseOrder} className="justify-center px-2 sm:px-4 py-3 sm:py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 sm:gap-2">
            <ArrowDownUp size={14} /> Reverse
          </button>
        </div>
        <button onClick={resetAll} className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
          <Trash2 size={14} /> Reset All
        </button>
      </div>
    </div>
    <DndContext`;
code = code.replace(/<DndContext/, toolbar);

// 5. Close the fragment at the end of DndContext
code = code.replace(/<\/DragOverlay>\s*<\/DndContext>/, '</DragOverlay>\n    </DndContext>\n  </>');

// 6. Delete the unneeded `</div></div>` which used to wrap the sidebar flex layout
// Since we removed `<div className="flex flex-col-reverse...`, we must remove one `</div>` at the very end
// We also remove the `<style jsx global>` completely.
code = code.replace(
  /\s*<\/div>\s*<\/div>\s*<style jsx global>[\s\S]*?<\/style>\s*<\/div>\s*\);\s*}\s*$/,
  '\n  </div>\n  );\n}\n'
);

fs.writeFileSync('src/components/tools/OrganizeTool.tsx', code);
