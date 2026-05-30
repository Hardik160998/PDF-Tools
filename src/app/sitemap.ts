import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfsplus.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/blog',
    '/blog/ultimate-pdf-optimization-guide',
    '/blog/pdf-to-word-conversion-guide',
    '/blog/how-to-merge-pdf',
    '/blog/compress-pdf-without-losing-quality',
    '/blog/protect-pdf-with-password',
    '/blog/how-to-redact-pdf',
    '/blog/how-to-crop-aadhar-card',
    '/blog/how-to-crop-pdf',
    '/tool/merge',
    '/tool/split',
    '/tool/compress',
    '/tool/pdf-to-word',
    '/tool/word-to-pdf',
    '/tool/pdf-to-excel',
    '/tool/pdf-to-jpg',
    '/tool/optimize-pdf',
    '/login',
    '/signup'
  ];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes('/blog') ? 'weekly' : 'daily',
    priority: route === '' ? 1.0 : route.includes('/tool') ? 0.9 : 0.8,
  }));
}
