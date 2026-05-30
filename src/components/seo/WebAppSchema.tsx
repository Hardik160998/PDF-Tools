export default function WebAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SmartPDFs Plus Merge PDF",
    "description": "A free, instant, browser-based tool to merge multiple PDF files into one single document.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires a modern web browser with JavaScript enabled.",
    "url": "http://smartpdfpro.com//tool/merge",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
