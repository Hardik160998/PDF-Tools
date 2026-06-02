const fs = require('fs');
const path = require('path');
const TOOL_DIR = path.join(__dirname, '../src/app/tool');
const dirs = fs.readdirSync(TOOL_DIR).filter(d => fs.statSync(path.join(TOOL_DIR, d)).isDirectory() && d !== '[id]');

dirs.forEach(dir => {
  const file = path.join(TOOL_DIR, dir, 'page.tsx');
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import { getToolMeta, getToolUrl } from ["']@\/data\/tools["'];/g, 'import { getToolMeta, getToolUrl } from "@/data/toolMeta";');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', dir);
});
