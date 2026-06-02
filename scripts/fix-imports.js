const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');
const dirs = fs.readdirSync(BLOG_DIR).filter(d => fs.statSync(path.join(BLOG_DIR, d)).isDirectory());

dirs.forEach(dir => {
  const file = path.join(BLOG_DIR, dir, 'page.tsx');
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import ArticleSchema')) {
    content = content.replace(/import { Metadata } from ["']next["'];/, 'import { Metadata } from "next";\nimport ArticleSchema from "@/components/seo/ArticleSchema";');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', dir);
  }
});
