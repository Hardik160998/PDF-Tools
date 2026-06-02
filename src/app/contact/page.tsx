import { Metadata } from 'next';
import ContactClient from './ContactClient';
import OrganizationSchema from '@/components/seo/OrganizationSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfpro.com';

export const metadata: Metadata = {
 title: 'Contact Us | SmartPDFs Plus',
 description: 'Get in touch with the SmartPDFs Plus team. We\'re here to help with any questions, support requests, or feedback you may have.',
 alternates: {
 canonical: '/contact',
 },
 openGraph: {
 title: 'Contact Us | SmartPDFs Plus',
 description: 'Get in touch with the SmartPDFs Plus team. We\'re here to help with any questions, support requests, or feedback you may have.',
 url: `${siteUrl}/contact`,
 },
};

export default function ContactPage() {
 const schema = {
 '@context': 'https://schema.org',
 '@type': 'ContactPage',
 name: 'Contact SmartPDFs Plus',
 description: 'Contact form and support information for SmartPDFs Plus users.',
 url: `${siteUrl}/contact`,
 };

 return (
 <>
 <OrganizationSchema />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
 />
 <ContactClient />
 </>
 );
}
