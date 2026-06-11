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

  // Find the color from focus-visible:ring-[color]-500
  let color = 'orange';
  const colorMatch = content.match(/focus-visible:ring-([a-z]+)-500/);
  if (colorMatch) {
      color = colorMatch[1];
  } else {
      const pColorMatch = content.match(/bg-([a-z]+)-500\/10/);
      if (pColorMatch) color = pColorMatch[1];
  }

  let faqTextIdx = content.indexOf('Frequently Asked Questions');
  
  // Check if the FAQ block itself already has the exact wrapper div
  // A good check is whether `Frequently Asked Questions` is preceded by `<span className="p-2 rounded-xl bg-${color}-500/10`
  const hasNewHeading = content.indexOf(`<span className="p-2 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-500">\n                  <HelpCircle size={24} />\n                </span>\n                Frequently Asked Questions`) !== -1;
  const hasNewHeading2 = content.includes(`<span className="p-2 rounded-xl bg-${color}-500/10`);
  
  // Actually, let's just find the start of the block.
  // The block starts with a section or div that contains "Frequently Asked Questions"
  let startIdx = content.lastIndexOf('<div className="max-w-4xl mx-auto', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<div className="max-w-3xl mx-auto', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<div className="mt-16', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQ Section */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQs Accordion */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQ Block */}', faqTextIdx);
  
  if (startIdx === -1) {
      // Find the parent section/article/div that encapsulates the h2/h3
      let tagStart = content.lastIndexOf('<div', faqTextIdx);
      if (tagStart === -1 || content.substring(tagStart, faqTextIdx).length > 300) {
          tagStart = content.lastIndexOf('<section', faqTextIdx);
      }
      if (tagStart !== -1) {
          startIdx = tagStart;
      } else {
          console.log("Could not find start block for", file);
          continue;
      }
  }
  
  // Find where the map starts
  const endMap = content.indexOf('].map((', startIdx);
  if (endMap === -1) {
      console.log("Could not find map end in", file);
      continue;
  }
  
  const actualStartBracket = content.lastIndexOf('{[', endMap);
  const faqArrayStr = content.substring(actualStartBracket + 1, endMap + 1); // "[ ... ]"
  
  const matchAfterMap = content.substring(endMap).match(/<\/details>\s*\)\)\}\s*<\/div>\s*<\/div>/);
  let matchAfterMapSection = content.substring(endMap).match(/<\/details>\s*\)\)\}\s*<\/div>\s*<\/section>/);
  
  let endOfFaqBlock;
  if (matchAfterMap) {
      endOfFaqBlock = endMap + matchAfterMap.index + matchAfterMap[0].length;
  } else if (matchAfterMapSection) {
      endOfFaqBlock = endMap + matchAfterMapSection.index + matchAfterMapSection[0].length;
  } else {
      console.log("Could not find end of FAQ div in", file);
      continue;
  }

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
