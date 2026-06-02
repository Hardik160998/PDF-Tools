import { Metadata } from 'next';
import FaqClient from './FaqClient';
import { CATEGORIES } from '@/data/faqData';
import FAQSchema from '@/components/seo/FAQSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfpro.com';

export const metadata: Metadata = {
  title: 'FAQ | SmartPDFs Plus',
  description: 'Frequently asked questions about SmartPDFs Plus. Learn how our free PDF tools work, security practices, and troubleshooting tips.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ | SmartPDFs Plus',
    description: 'Frequently asked questions about SmartPDFs Plus. Learn how our free PDF tools work, security practices, and troubleshooting tips.',
    url: `${siteUrl}/faq`,
  },
};

export default function FAQPage() {
  // Flatten all FAQs for the schema
  const allFaqs = CATEGORIES.flatMap((category) => 
    category.faqs.map(faq => ({ question: faq.q, answer: faq.a }))
  );

  return (
    <>
      <FAQSchema faqs={allFaqs} />
      <FaqClient />
    </>
  );
}
