interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export default function ArticleSchema({
  title,
  description,
  url,
  imageUrl = 'https://smartpdfpro.com/img/snapdeal-label.png',
  datePublished,
  dateModified,
  authorName = 'SmartPDFPro',
}: ArticleSchemaProps) {
  const defaultDate = new Date().toISOString();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    url: url,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: 'https://smartpdfpro.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartPDFs Plus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smartpdfpro.com/img/snapdeal-label.png',
      },
    },
    datePublished: datePublished || defaultDate,
    dateModified: dateModified || datePublished || defaultDate,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
