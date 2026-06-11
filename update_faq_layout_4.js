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
  
  // Skip if it already has the new details styling class
  if (content.includes('bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden')) {
      // It already has the new style details elements!
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

  const faqTextIdx = content.indexOf('Frequently Asked Questions');
  
  // Try to find the start comment
  let startIdx = content.lastIndexOf('{/* FAQ Block */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQs Accordion */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQs */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQ Section */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('{/* FAQ */}', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<section className="space-y-8 max-w-4xl mx-auto">', faqTextIdx);
  if (startIdx === -1) startIdx = content.lastIndexOf('<div className="max-w-4xl mx-auto', faqTextIdx);
  
  if (startIdx === -1) {
      console.log("Could not find start block for", file);
      continue;
  }
  
  // Ensure the startIdx is reasonably close to the FAQ (within 2000 chars)
  if (faqTextIdx - startIdx > 2000) {
      console.log("Start block is too far for", file);
      continue;
  }

  // Find where the map starts. Since we're looking inside the FAQ section, we want the FIRST map.
  const endMap = content.indexOf('].map((', startIdx);
  if (endMap === -1 || endMap > content.indexOf('</section>', startIdx)) {
      console.log("Could not find map end in", file);
      continue;
  }
  
  const actualStartBracket = content.lastIndexOf('{[', endMap);
  const faqArrayStr = content.substring(actualStartBracket + 1, endMap + 1); // "[ ... ]"
  
  // Find the end of the map's generated content
  const matchAfterMap = content.substring(endMap).match(/<\/details>\s*\)\)\}\s*<\/div>\s*<\/div>/);
  const matchAfterMapSection = content.substring(endMap).match(/<\/details>\s*\)\)\}\s*<\/div>\s*<\/section>/);
  
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
