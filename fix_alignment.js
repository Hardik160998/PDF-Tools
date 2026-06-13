const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AddBlankPage.tsx', 'utf8');

// Center Universal feature grid
code = code.replace(
  'className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left"',
  'className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-center"'
);
code = code.replace(
  'className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left"',
  'className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-center"'
); // Just in case there's another

fs.writeFileSync('src/components/tools/AddBlankPage.tsx', code);
