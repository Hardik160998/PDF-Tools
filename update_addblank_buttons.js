const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

// The code currently has:
// <div className="flex gap-4">
//   <button
//     onClick={handleAdd}
//     disabled={processing}
//     ...

const oldButtonsRegex = /<div className="flex gap-4">\s*<button\s*onClick=\{handleAdd\}[\s\S]*?<X size=\{28\} \/>\s*<\/button>\s*<\/div>/;

const newButtons = `<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAdd}
                  disabled={processing}
                  className="flex-1 py-4 sm:py-5 text-white rounded-[1.5rem] text-base sm:text-xl font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <Loader2 className="animate-spin" /> Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      Process &amp; Update <FilePlus size={20} className="sm:w-6 sm:h-6" />
                    </span>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="w-full sm:w-16 h-14 sm:h-auto rounded-[1.5rem] bg-slate-100 dark:bg-slate-700 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-all shadow-lg hover:shadow-red-500/10 font-bold uppercase tracking-widest text-sm sm:text-base shrink-0"
                >
                  <X size={24} /> <span className="sm:hidden">Cancel</span>
                </button>
              </div>`;

code = code.replace(oldButtonsRegex, newButtons);

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
