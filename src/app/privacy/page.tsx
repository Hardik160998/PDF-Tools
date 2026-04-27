import { Shield } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: `We collect minimal information to provide our services. For client-side tools, no data is collected — all processing happens in your browser. For server-side tools (Office conversions, Repair, Security), files are temporarily uploaded to our servers solely for processing and are permanently deleted within 1 hour. We do not store, read, or share your file contents.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use collected information only to: (1) provide and improve our PDF tools, (2) analyze anonymous usage patterns to enhance performance, and (3) respond to support requests. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: 'Cookies & Analytics',
    content: `We use essential cookies to maintain basic site functionality. We may use anonymous analytics (such as page view counts) to understand how our tools are used. No personally identifiable information is collected through analytics. You can disable cookies in your browser settings without affecting core functionality.`,
  },
  {
    title: 'File Security',
    content: `All file transfers use HTTPS encryption. Files uploaded for server-side processing are stored in isolated temporary storage, processed, and deleted automatically. We do not access, read, or analyze the content of your files. Our servers are hosted in secure data centers with industry-standard security practices.`,
  },
  {
    title: 'Third-Party Services',
    content: `We use ConvertAPI for certain file conversion operations. Files sent to ConvertAPI are subject to their privacy policy (convertapi.com/privacy). We use Supabase for optional authentication features. No file content is shared with these services beyond what is necessary for the requested operation.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to: access any personal data we hold about you, request deletion of your data, opt out of any non-essential data collection, and receive a copy of your data in a portable format. To exercise these rights, contact us at privacy@smartpdfs.com.`,
  },
  {
    title: 'Children\'s Privacy',
    content: `SmartPDFs Plus is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on our website. Continued use of SmartPDFs Plus after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-black uppercase tracking-widest mb-6">
          <Shield size={13} /> Privacy Policy
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Your Privacy Matters
        </h1>
        <p className="text-lg text-slate-500 mb-3">Last updated: April 2026</p>
        <p className="text-slate-500 leading-relaxed">
          We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.
        </p>
      </section>

      {/* Sections */}
      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                {s.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-slate-900 text-white rounded-2xl text-center space-y-3">
          <p className="font-black">Questions about our privacy practices?</p>
          <p className="text-slate-400 text-sm">Contact our privacy team at privacy@smartpdfs.com</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
