export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SmartPDFs Plus',
    url: 'https://smartpdfpro.com',
    logo: 'https://smartpdfpro.com/img/snapdeal-label.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@smartpdfpro.com',
      contactType: 'customer support',
    },
    sameAs: [
      // Add social links here if available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
