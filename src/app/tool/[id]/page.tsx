import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolClient from './ToolClient';
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { getToolMeta, getToolUrl } from '@/data/toolData';

interface PageProps {
 params: Promise<{ id: string }>;
}

/**
 * Dynamically generates Next.js <head> metadata for each tool page.
 * Falls back gracefully if the tool slug is not in the toolMeta config.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { id } = await params;
 const meta = getToolMeta(id);

 if (!meta) {
 return {
 title: 'PDF Tool | SmartPDFPro',
 description: 'Free online PDF tool. Process your files securely in your browser.',
 };
 }

 const url = getToolUrl(id);

 return {
 title: `${meta.title} | SmartPDFPro`,
 description: meta.description,
 keywords: meta.keywords,
 alternates: { canonical: url },
 openGraph: {
 type: 'website',
 title: `${meta.title} | SmartPDFPro`,
 description: meta.description,
 url,
 siteName: 'SmartPDFPro',
 },
 twitter: {
 card: 'summary_large_image',
 title: `${meta.title} | SmartPDFPro`,
 description: meta.description,
 },
 robots: {
 index: true,
 follow: true,
 googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
 },
 };
}

/**
 * Server Component: Renders the tool page with dynamic JSON-LD schemas.
 * - WebAppSchema → WebApplication structured data
 * - FAQSchema → FAQPage structured data (only if FAQs exist)
 * - BreadcrumbSchema → BreadcrumbList structured data
 */
export default async function ToolPage({ params }: PageProps) {
 const { id } = await params;
 const meta = getToolMeta(id);
 const toolUrl = getToolUrl(id);

 return (
 <>
 {/* ── JSON-LD Structured Data ── */}
 <WebAppSchema
 name={meta ? `${meta.title} – Free Online Tool` : `PDF Tool`}
 description={meta?.description ?? 'Free online PDF tool. Process your files securely in your browser.'}
 url={toolUrl}
 />

 {meta && meta.faqs.length > 0 && (
 <FAQSchema faqs={meta.faqs} />
 )}

 <BreadcrumbSchema
 items={[
 { label: 'Tools', href: '/#tools' },
 { label: meta?.title ?? id, href: `/tool/${id}` },
 ]}
 />

 {/* ── Tool UI ── */}
 <ToolClient id={id} />
 </>
 );
}
