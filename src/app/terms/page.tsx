import { FileText } from 'lucide-react';

const SECTIONS = [
  { title: 'Acceptance of Terms', content: `By accessing or using SmartPDFs Plus ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes.` },
  { title: 'Use of Service', content: `SmartPDFs Plus is provided for lawful personal and commercial use. You agree not to: (1) use the service to process illegal, harmful, or infringing content, (2) attempt to reverse-engineer or exploit our systems, (3) use automated tools to abuse the service, or (4) upload malware or malicious files. We reserve the right to terminate access for violations.` },
  { title: 'Intellectual Property', content: `All content, design, code, and branding of SmartPDFs Plus are the intellectual property of SmartPDFs Plus and its licensors. You may not copy, reproduce, or distribute any part of the service without written permission. Your uploaded files remain your property — we claim no ownership over your documents.` },
  { title: 'File Processing & Data', content: `Client-side tools process files entirely in your browser. Server-side tools temporarily upload files to our servers for processing. All uploaded files are automatically deleted within 1 hour. We do not access, read, or retain your file contents beyond what is necessary for processing.` },
  { title: 'Disclaimer of Warranties', content: `SmartPDFs Plus is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that results will meet your specific requirements. Use of the service is at your own risk. We are not responsible for any data loss resulting from use of our tools.` },
  { title: 'Limitation of Liability', content: `To the maximum extent permitted by law, SmartPDFs Plus shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to loss of data, loss of profits, or business interruption.` },
  { title: 'Third-Party Services', content: `Our service integrates with third-party providers including ConvertAPI and Supabase. Use of these integrations is subject to their respective terms of service. We are not responsible for the practices or content of third-party services.` },
  { title: 'Governing Law', content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of India.` },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-xs font-black uppercase tracking-widest mb-6">
          <FileText size={13} /> Terms & Conditions
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-slate-500 mb-3">Last updated: April 2026</p>
        <p className="text-slate-500 leading-relaxed">
          Please read these terms carefully before using SmartPDFs Plus.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                {s.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-slate-900 text-white rounded-2xl text-center space-y-3">
          <p className="font-black">Have questions about our terms?</p>
          <p className="text-slate-400 text-sm">Contact us at legal@smartpdfs.com</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
