export default function FAQSchema() {
  const faqs = [
    {
      question: "Is there a file size limit for merging?",
      answer: "No, there is no hard limit on file size because processing happens locally in your browser. However, very large files may slow down your browser depending on your device RAM."
    },
    {
      question: "Can I merge password-protected PDFs?",
      answer: "Yes, but you must know the password to unlock them first before they can be merged. The tool will prompt you if a file is locked."
    },
    {
      question: "Will merging reduce the quality of my PDFs?",
      answer: "No. The tool combines the files without re-encoding images or stripping data, so the quality remains exactly the same as the original files."
    },
    {
      question: "Do I need to install any software to merge PDFs?",
      answer: "No installation is required. Our merge PDF tool works entirely in your web browser, making it completely online and hassle-free."
    },
    {
      question: "Are my files secure when merging?",
      answer: "Yes, absolutely. Because the merging process happens locally in your browser, your files are never uploaded to our servers, ensuring 100% privacy and security."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
