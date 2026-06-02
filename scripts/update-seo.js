const fs = require('fs');
const path = require('path');

const TOOL_DIR = path.join(__dirname, '../src/app/tool');

// We will find all page.tsx files in src/app/tool/*/page.tsx
const dirs = fs.readdirSync(TOOL_DIR).filter(d => fs.statSync(path.join(TOOL_DIR, d)).isDirectory() && d !== '[id]');

dirs.forEach(dir => {
  const pagePath = path.join(TOOL_DIR, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // 1. Remove existing metadata export
  content = content.replace(/export const metadata.*?};\n/gs, '');
  // Also catch cases where it's `export const metadata: Metadata = { ... };` with some trailing stuff
  content = content.replace(/export const metadata:\s*Metadata\s*=\s*\{[\s\S]*?\n\s*\};\n/g, '');

  // 2. Remove JSON-LD objects
  content = content.replace(/const webAppJsonLd\s*=\s*\{[\s\S]*?\n\s*\};\n/g, '');
  content = content.replace(/const breadcrumbJsonLd\s*=\s*\{[\s\S]*?\n\s*\};\n/g, '');
  content = content.replace(/const faqJsonLd\s*=\s*\{[\s\S]*?\n\s*\};\n/g, '');
  
  // 3. Remove script tags
  content = content.replace(/<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(webAppJsonLd\)\s*\}\}\s*\/>/g, '');
  content = content.replace(/<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(breadcrumbJsonLd\)\s*\}\}\s*\/>/g, '');
  content = content.replace(/<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(faqJsonLd\)\s*\}\}\s*\/>/g, '');

  // 4. Import the shared schemas and toolMeta
  if (!content.includes('getToolMeta')) {
    const importsToAdd = `
import { getToolMeta, getToolUrl } from '@/data/toolMeta';
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
`;
    // Add right after the last import
    content = content.replace(/^(import.*?\n)+/m, match => match + importsToAdd);
  }

  // 5. Add generateMetadata function
  if (!content.includes('generateMetadata')) {
    const genMeta = `
export function generateMetadata() {
  const id = '${dir}';
  const meta = getToolMeta(id);
  if (!meta) return { title: 'PDF Tool | SmartPDFPro' };

  const url = getToolUrl(id);
  return {
    title: \`\${meta.title} | SmartPDFPro\`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: \`\${meta.title} | SmartPDFPro\`,
      description: meta.description,
      url,
      siteName: 'SmartPDFPro',
    },
    twitter: {
      card: 'summary_large_image',
      title: \`\${meta.title} | SmartPDFPro\`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}
`;
    // Add before the default export
    content = content.replace(/export default function/g, genMeta + '\nexport default function');
  }

  // 6. Inject components into the main return
  // Find `<main className=...>` or `<div className="max-w-7xl...>`
  if (!content.includes('<WebAppSchema')) {
    const schemasToInject = `
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('${dir}');
        return meta ? (
          <>
            <WebAppSchema name={\`\${meta.title} – Free Online Tool\`} description={meta.description} url={getToolUrl('${dir}')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: \`/tool/${dir}\` }]} />
          </>
        ) : null;
      })()}
`;
    // Insert after the first opening tag of the default export component
    // We'll just look for `<main` or `<div`
    content = content.replace(/(return\s*\(\s*(?:<main[^>]*>|<div[^>]*>))/, `$1\n${schemasToInject}`);
  }

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log(`Updated ${dir}/page.tsx`);
});
