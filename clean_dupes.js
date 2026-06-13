const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

// The exact string block we want to find and only keep once per section
const grid3Line1 = `<div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">`;
const grid3LineEnd = `      </div>`;

function removeConsecutiveDuplicates(text, startMarker, endMarker) {
    let result = text;
    let index = 0;
    while ((index = result.indexOf(startMarker, index)) !== -1) {
        const endIndex = result.indexOf(endMarker, index) + endMarker.length;
        const block = result.substring(index, endIndex);
        
        // Check if the EXACT SAME block is repeated immediately after
        const nextBlockStart = result.indexOf(startMarker, endIndex);
        if (nextBlockStart !== -1 && result.substring(endIndex, nextBlockStart).trim() === '') {
            const nextBlockEnd = result.indexOf(endMarker, nextBlockStart) + endMarker.length;
            const nextBlock = result.substring(nextBlockStart, nextBlockEnd);
            
            if (block === nextBlock) {
                // Remove the duplicate block
                result = result.substring(0, nextBlockStart) + result.substring(nextBlockEnd);
                continue; // check again at the same index in case there are 3 duplicates
            }
        }
        index = endIndex;
    }
    return result;
}

code = removeConsecutiveDuplicates(code, grid3Line1, `        ))}\r\n      </div>`);
code = removeConsecutiveDuplicates(code, grid3Line1, `        ))}\n      </div>`);

// Also do it for the 4 item grid
const grid4Line1 = `<div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-12 border-t border-slate-100 dark:border-slate-800/50 z-10">`;
const grid4LineEnd = `      </div>`;

code = removeConsecutiveDuplicates(code, grid4Line1, `      ))}\r\n      </div>`);
code = removeConsecutiveDuplicates(code, grid4Line1, `      ))}\n      </div>`);

// In case the universal grid comment is duplicated too
code = code.replace(/\{\/\* Universal Feature Grid \*\/\}\s*\{\/\* Universal Feature Grid \*\/\}/g, '{/* Universal Feature Grid */}');

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
