interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

const SITE_URL = 'https://smartpdfpro.com';

/**
 * Renders a BreadcrumbList JSON-LD schema script tag.
 * Home is always prepended automatically as position 1.
 * https://schema.org/BreadcrumbList
 */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const allItems = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
