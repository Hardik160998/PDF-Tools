import { Metadata } from 'next';
import HomeClient from './HomeClient';
import WebSiteSchema from '@/components/seo/WebSiteSchema';
import OrganizationSchema from '@/components/seo/OrganizationSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfpro.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SmartPDFs Plus | Free Online PDF Tools',
  description: 'Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'SmartPDFs Plus | Free Online PDF Tools',
    description: 'Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.',
    url: '/',
    siteName: 'SmartPDFs Plus',
    images: [
      { url: `${siteUrl}/img/snapdeal-label.png`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartPDFs Plus | Free Online PDF Tools',
    description: 'Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.',
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

export default function Page() {
  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <HomeClient />
    </>
  );
}
