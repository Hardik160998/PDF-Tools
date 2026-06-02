interface FAQItem {
 question: string;
 answer: string;
}

interface FAQSchemaProps {
 /** Optional list of FAQs. Falls back to generic PDF tool FAQs if not provided. */
 faqs?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
 { question: 'Is this tool free to use?', answer: 'Yes. All tools on SmartPDFPro are completely free with no watermarks and no sign-up required.' },
 { question: 'Are my files safe?', answer: 'Yes. All processing happens locally in your browser. Your files are never uploaded to our servers.' },
 { question: 'Do I need to install any software?', answer: 'No. Everything runs in your web browser with no installation required.' },
 { question: 'What browsers are supported?', answer: 'All modern browsers are supported, including Chrome, Firefox, Edge, and Safari.' },
];

/**
 * Renders an FAQPage JSON-LD schema script tag.
 * Falls back to generic FAQs if none are provided.
 * https://schema.org/FAQPage
 */
export default function FAQSchema({ faqs = DEFAULT_FAQS }: FAQSchemaProps) {
 const schema = {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: faqs.map((faq) => ({
 '@type': 'Question',
 name: faq.question,
 acceptedAnswer: {
 '@type': 'Answer',
 text: faq.answer,
 },
 })),
 };

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
 />
 );
}
