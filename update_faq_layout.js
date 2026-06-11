const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('page.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles(path.join('src', 'app', 'tool'));
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the color from focus-visible:ring-[color]-500
  const colorMatch = content.match(/focus-visible:ring-([a-z]+)-500/);
  if (!colorMatch) continue;
  const color = colorMatch[1];

  // Try to find the start of FAQ Block
  const faqIndex = content.indexOf('{/* FAQ Block */}');
  if (faqIndex === -1) {
    console.log("No FAQ block found in", file);
    continue;
  }

  // Extract the FAQ array definition
  const startBracket = content.indexOf('{[', faqIndex);
  const endMap = content.indexOf('].map((item, idx) =>', startBracket);
  if (startBracket === -1 || endMap === -1) {
    console.log("Could not find FAQ array in", file);
    continue;
  }
  
  const faqArrayStr = content.substring(startBracket + 1, endMap + 1); // "[ ... ]"

  // Now find the end of the entire FAQ block
  // This is tricky because it could be deeply nested.
  // We can just use string replacement on the parts we know.
  // Actually, we can find the matching closing div for the FAQ Block div.
  
  // The FAQ Block usually starts with: <div className="..."> \n <h2 ...
  // Let's replace the entire FAQ Block.
  
  // To find the end of the FAQ Block, we can parse the JSX manually or just use a regex
  // to replace from {/* FAQ Block */} to the end of the details map.
  
  // Wait, let's look for the end of the mapping block:
  const endOfMapCode = '</details>\n                ))}';
  const endOfMapCode2 = '</details>\n                  ))}';
  const endOfMapCode3 = '</details>\r\n                ))}';
  let endOfMapIdx = content.indexOf(endOfMapCode, endMap);
  if (endOfMapIdx === -1) endOfMapIdx = content.indexOf(endOfMapCode2, endMap);
  if (endOfMapIdx === -1) endOfMapIdx = content.indexOf(endOfMapCode3, endMap);
  
  if (endOfMapIdx === -1) {
      // Let's use regex to find the end of the map
      const matchEnd = content.substring(endMap).match(/<\/details>\s*\)\)\}/);
      if (matchEnd) {
          endOfMapIdx = endMap + matchEnd.index;
      } else {
          console.log("Could not find end of map in", file);
          continue;
      }
  }
  
  // Find the end of the `</div>\n            </div>` after the details map.
  // Let's just find the closing tags by counting divs? No, it's safer to just replace from 
  // `{/* FAQ Block */}` up to `</details>\s*\)\)\}\s*</div>\s*</div>`
  
  const matchAfterMap = content.substring(endOfMapIdx).match(/<\/details>\s*\)\)\}\s*<\/div>\s*<\/div>/);
  if (!matchAfterMap) {
      console.log("Could not find end of FAQ div in", file);
      continue;
  }
  
  const endOfFaqBlock = endOfMapIdx + matchAfterMap.index + matchAfterMap[0].length;
  
  const newFaqBlock = `{/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {${faqArrayStr}.map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="p-1.5 rounded-full bg-${color}-500/10 text-${color}-500 shrink-0">
                          <HelpCircle size={18} />
                        </span>
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="mx-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>`;

  const newContent = content.substring(0, faqIndex) + newFaqBlock + content.substring(endOfFaqBlock);
  fs.writeFileSync(file, newContent);
  count++;
}

console.log('Updated ' + count + ' files.');
