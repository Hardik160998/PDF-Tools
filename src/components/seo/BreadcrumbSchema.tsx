interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfsplus.com';
  
  const schemaListElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": "Blog", // Default fallback, but overriden below if needed
      "item": `${siteUrl}${item.href}`
    }))
  ];

  // Fix up names
  items.forEach((item, index) => {
    schemaListElements[index + 1].name = item.label;
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaListElements
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
