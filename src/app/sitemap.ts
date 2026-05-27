import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfsplus.com';
  
  // List of all static routes in our tool suite
  const routes = [
    '',
    '/tool/merge',
    '/tool/split',
    '/tool/compress',
    '/tool/organize',
    '/tool/compare-pdf',
    '/tool/extract-pages',
    '/tool/delete-pages',
    '/tool/add-blank-page',
    '/tool/repair-pdf',
    '/tool/optimize-pdf',
    '/tool/extract-text',
    '/tool/ocr-pdf',
    '/tool/pdf-to-xml',
    '/tool/pdf-to-jpg',
    '/tool/jpg-to-pdf',
    '/tool/word-to-pdf',
    '/tool/pdf-to-word',
    '/tool/docx-to-pdf',
    '/tool/pdf-to-docx',
    '/tool/excel-to-pdf',
    '/tool/pdf-to-excel',
    '/tool/ppt-to-pdf',
    '/tool/pdf-to-ppt',
    '/tool/protect',
    '/tool/unlock',
    '/tool/bookmark-pdf',
    '/tool/watermark',
    '/tool/page-numbers',
    '/tool/metadata',
    '/tool/flatten-pdf',
    '/tool/remove-ocr',
    '/esign',
    '/edit',
    '/about',
    '/faq',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : route.startsWith('/tool/') ? 0.9 : 0.6,
  }));
}
