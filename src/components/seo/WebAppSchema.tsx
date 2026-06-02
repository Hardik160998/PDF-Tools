interface WebAppSchemaProps {
 name: string;
 description: string;
 url: string;
 /** Optional: override the default applicationCategory */
 applicationCategory?: string;
}

/**
 * Renders a WebApplication JSON-LD schema script tag.
 * Follows Google Structured Data guidelines for Rich Results.
 * https://schema.org/WebApplication
 */
export default function WebAppSchema({
 name,
 description,
 url,
 applicationCategory = 'UtilitiesApplication',
}: WebAppSchemaProps) {
 const schema = {
 '@context': 'https://schema.org',
 '@type': 'WebApplication',
 name,
 description,
 url,
 applicationCategory,
 operatingSystem: 'All',
 browserRequirements: 'Requires JavaScript',
 inLanguage: 'en',
 isAccessibleForFree: true,
 offers: {
 '@type': 'Offer',
 price: '0',
 priceCurrency: 'USD',
 },
 creator: {
 '@type': 'Organization',
 name: 'SmartPDFs Plus',
 url: 'https://smartpdfpro.com',
 },
 };

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
 />
 );
}
