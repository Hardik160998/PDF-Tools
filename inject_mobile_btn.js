const fs = require('fs');
const fp = 'src/components/tools/MergeSplit.tsx';
let lines = fs.readFileSync(fp, 'utf8').split(/\r?\n/);

const injection = `
        {/* Mobile-only action button in upload section */}
        {files.length > 0 && !mergedResult && (!isSplit || splitResults.length === 0) && (
          <div className="pt-6 lg:hidden block animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleProcess}
              disabled={processing || files.length === 0}
              className="w-full py-5 text-white rounded-[1.5rem] text-lg font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter"
              style={{ background: ACCENT_GRADIENT }}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> {id === 'merge' ? 'Merging...' : 'Splitting...'}</span>
              ) : (
                <span className="flex items-center justify-center gap-3">{id === 'merge' ? 'Merge All' : 'Split All'} {isSplit ? <Scissors size={24} /> : <Combine size={24} />}</span>
              )}
            </button>
          </div>
        )}
`;

// Find where to inject: we want it before the closing </div> of the main workspace.
// Line 458 is `)}`
// Line 459 is `</div>`
// Line 460 is `</div>`
// Line 461 is `</div>`

lines.splice(459, 0, injection);

fs.writeFileSync(fp, lines.join('\n'));
console.log("Success");
