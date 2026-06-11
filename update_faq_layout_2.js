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

  if (!content.includes('Frequently Asked Questions')) {
      continue;
  }

  // Find the color from focus-visible:ring-[color]-500 or default to orange
  let color = 'orange';
  const colorMatch = content.match(/focus-visible:ring-([a-z]+)-500/);
  if (colorMatch) {
      color = colorMatch[1];
  } else {
      const pColorMatch = content.match(/bg-([a-z]+)-500\/10/);
      if (pColorMatch) color = pColorMatch[1];
  }

  // To find the start of the FAQ block, we can find the <div> containing the h2 with "Frequently Asked Questions"
  // Usually it looks like:
  // <div className="max-w-4xl mx-auto mt-20 mb-20 text-center">
  //   <h2 ...> Frequently Asked Questions </h2>
  // Let's find "Frequently Asked Questions"
  
  // Actually, we can just find the FAQ array definition `{[ ... ]}` first
  let faqTextIdx = content.indexOf('Frequently Asked Questions');
  const startBracket = content.indexOf('{[', faqTextIdx - 500); // look around
  
  if (startBracket === -1) {
    // maybe before?
    const startBracket2 = content.indexOf('{[', faqTextIdx - 2000);
    if (startBracket2 === -1) {
        console.log("Could not find FAQ array in", file);
        continue;
    }
  }
  
  // Because the previous script already updated 24 files to use {/* FAQ Block */},
  // we can look for `{/* FAQ Block */}` and skip if it already exists AND has the new structure.
  if (content.includes('bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm')) {
      // Already updated!
      continue;
  }
  
  // Okay, how to find the start of the old block?
  // It's the parent div of the h2. Let's look for `<div className="max-w-4xl mx-auto` or similar near `Frequently Asked Questions`
  let blockStart = content.lastIndexOf('<div', faqTextIdx);
  let blockStart2 = content.lastIndexOf('<div', blockStart - 1);
  let blockStart3 = content.lastIndexOf('<div', blockStart2 - 1);
  // It's probably `blockStart2` or `blockStart3`
  
  // Let's just find the closest previous `<section` or `<div className="max-w-4xl`
  let startIdx = content.lastIndexOf('<div className="max-w-4xl mx-auto', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<div className="max-w-3xl mx-auto', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<div className="mt-16', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQ Section */}', faqTextIdx);
  if (startIdx === -1) {
      console.log("Could not find start block for", file);
      continue;
  }
  
  // Extract the FAQ array definition
  const endMap = content.indexOf('].map((item, idx) =>', startIdx);
  if (endMap === -1) {
      console.log("Could not find map end in", file);
      continue;
  }
  
  const actualStartBracket = content.lastIndexOf('{[', endMap);
  const faqArrayStr = content.substring(actualStartBracket + 1, endMap + 1); // "[ ... ]"
  
  const endOfMapCode = '</details>\n                ))}';
  const endOfMapCode2 = '</details>\n                  ))}';
  const endOfMapCode3 = '</details>\r\n                ))}';
  let endOfMapIdx = content.indexOf(endOfMapCode, endMap);
  if (endOfMapIdx === -1) endOfMapIdx = content.indexOf(endOfMapCode2, endMap);
  if (endOfMapIdx === -1) endOfMapIdx = content.indexOf(endOfMapCode3, endMap);
  
  if (endOfMapIdx === -1) {
      const matchEnd = content.substring(endMap).match(/<\/details>\s*\)\)\}/);
      if (matchEnd) {
          endOfMapIdx = endMap + matchEnd.index;
      } else {
          console.log("Could not find end of map in", file);
          continue;
      }
  }
  
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

  const newContent = content.substring(0, startIdx) + newFaqBlock + content.substring(endOfFaqBlock);
  fs.writeFileSync(file, newContent);
  count++;
}

console.log('Updated ' + count + ' files.');
