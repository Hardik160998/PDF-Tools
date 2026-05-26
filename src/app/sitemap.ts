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
    '/tool/protect',
    '/tool/unlock',
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
