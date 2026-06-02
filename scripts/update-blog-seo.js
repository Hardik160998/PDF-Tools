const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../src/app/blog');
const dirs = fs.readdirSync(BLOG_DIR).filter(d => fs.statSync(path.join(BLOG_DIR, d)).isDirectory());

dirs.forEach(dir => {
  const pagePath = path.join(BLOG_DIR, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Skip if already has ArticleSchema
  if (content.includes('<ArticleSchema')) {
    return;
  }

  // 1. Add ArticleSchema to imports
  if (!content.includes('ArticleSchema')) {
    content = content.replace(/import BreadcrumbSchema.*?;\n/, match => match + `import ArticleSchema from "@/components/seo/ArticleSchema";\n`);
  }

  // 2. Extract metadata title and description (very naive extraction)
  let title = 'SmartPDFPro Blog';
  let description = 'PDF Tips and Guides';
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  const descMatch = content.match(/description:\s*["']([^"']+)["']/);
  if (titleMatch) title = titleMatch[1];
  if (descMatch) description = descMatch[1];
  
  // Extract date from the post (look for a date like Apr 15, 2026)
  let datePublished = new Date().toISOString();
  const dateMatch = content.match(/<span>(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}<\/span>/);
  if (dateMatch) {
    const rawDate = dateMatch[0].replace('<span>', '').replace('</span>', '');
    try {
      datePublished = new Date(rawDate).toISOString();
    } catch(e) {}
  }

  // 3. Inject ArticleSchema inside <main> or <div>
  const articleSchemaComponent = `\n      <ArticleSchema \n        title="${title}" \n        description="${description}" \n        url={\`\${siteUrl}/blog/${dir}\`} \n        datePublished="${datePublished}" \n      />`;
  
  content = content.replace(/(<BreadcrumbSchema.*?\/?>)/, match => articleSchemaComponent + '\n      ' + match);

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log(`Updated ${dir}/page.tsx`);
});
