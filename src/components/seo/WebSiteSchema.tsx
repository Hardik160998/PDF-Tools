export default function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SmartPDFs Plus',
    url: 'https://smartpdfpro.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://smartpdfpro.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
