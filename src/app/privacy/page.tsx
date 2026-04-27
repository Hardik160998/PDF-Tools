import { Shield, Lock, Eye, Trash2, Server, Users, Bell, CheckCircle2, ArrowRight, FileText, Globe } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Eye, title: 'No File Reading', desc: 'We never read or analyze your PDF content', color: 'bg-green-500' },
  { icon: Trash2, title: 'Auto-Deleted', desc: 'Server files deleted within 1 hour', color: 'bg-orange-500' },
  { icon: Lock, title: 'HTTPS Encrypted', desc: 'All transfers use TLS encryption', color: 'bg-blue-500' },
  { icon: Users, title: 'Never Sold', desc: 'Your data is never sold to third parties', color: 'bg-purple-500' },
];

const SECTIONS = [
  {
    icon: Eye,
    title: 'Information We Collect',
    color: 'bg-green-500',
    content: [
      {
        subtitle: 'Client-Side Tools (No Data Collected)',
        text: 'For tools that run in your browser — Merge PDF, Split PDF, Compress PDF, Organize PDF, Watermark, Page Numbers, Edit Metadata, PDF to JPG, JPG to PDF, PDF to Text, PDF to XML, Unlock PDF, Protect PDF, and Aadhar Cropper — absolutely no data is collected. Your files are processed entirely on your device using JavaScript and WebAssembly. Nothing is uploaded to any server.',
      },
      {
        subtitle: 'Server-Side Tools (Temporary Processing)',
        text: 'For tools that require cloud processing — Word to PDF, PDF to Word, Excel to PDF, PDF to Excel, PowerPoint to PDF, PDF to PowerPoint, HTML to PDF, and Repair PDF — your file is temporarily uploaded to our processing server via encrypted HTTPS. The file is processed and permanently deleted within 1 hour. We do not store, read, or share your file contents.',
      },
      {
        subtitle: 'Contact Form',
        text: 'When you submit our contact form, we collect your name, email address, subject, and message. This information is used solely to respond to your inquiry and is not shared with third parties.',
      },
      {
        subtitle: 'Anonymous Analytics',
        text: 'We may collect anonymous, aggregated usage data such as page views and tool usage counts to understand how SmartPDFs Plus is used and improve our services. This data contains no personally identifiable information.',
      },
    ],
  },
  {
    icon: Server,
    title: 'How We Use Your Information',
    color: 'bg-blue-500',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'File data is used exclusively to perform the requested PDF operation (merge, convert, repair, etc.) and return the result to you. We do not use your file content for any other purpose.',
      },
      {
        subtitle: 'Service Improvement',
        text: 'Anonymous usage statistics help us understand which tools are most used, identify performance bottlenecks, and prioritize new features. No personal data is involved in this analysis.',
      },
      {
        subtitle: 'Customer Support',
        text: 'Contact form submissions are used to respond to your questions, bug reports, and feedback. We retain support communications for up to 12 months to provide consistent support.',
      },
    ],
  },
  {
    icon: Globe,
    title: 'Cookies & Tracking',
    color: 'bg-yellow-500',
    content: [
      {
        subtitle: 'Essential Cookies Only',
        text: 'SmartPDFs Plus uses only essential cookies required for basic site functionality (such as remembering your theme preference). We do not use advertising cookies, tracking pixels, or third-party marketing cookies.',
      },
      {
        subtitle: 'No Cross-Site Tracking',
        text: 'We do not track your activity across other websites. We do not use Facebook Pixel, Google Ads remarketing, or any other cross-site tracking technology.',
      },
      {
        subtitle: 'Disabling Cookies',
        text: 'You can disable cookies in your browser settings at any time. Disabling cookies will not affect the core functionality of any PDF tool — all tools will continue to work normally.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'File Security',
    color: 'bg-red-500',
    content: [
      {
        subtitle: 'Client-Side Processing (Most Tools)',
        text: 'The majority of SmartPDFs Plus tools process files entirely in your browser. Your PDF never leaves your device. This is the most secure approach possible — there is no server involved, no network transfer, and no risk of interception.',
      },
      {
        subtitle: 'Server-Side Processing (Office & Repair Tools)',
        text: 'When server processing is required, files are transmitted using TLS 1.2+ encryption (HTTPS). Files are stored in isolated temporary storage, processed by ConvertAPI, and automatically deleted within 1 hour. Our servers are hosted in secure, SOC 2-compliant data centers.',
      },
      {
        subtitle: 'Aadhar & Sensitive Documents',
        text: 'The Aadhar Cropper tool is 100% client-side. Your Aadhar card data never leaves your browser. We strongly recommend using client-side tools for any sensitive documents containing personal information.',
      },
    ],
  },
  {
    icon: FileText,
    title: 'Third-Party Services',
    color: 'bg-indigo-500',
    content: [
      {
        subtitle: 'ConvertAPI',
        text: 'We use ConvertAPI (convertapi.com) for server-side file conversions (Office formats, Repair PDF). Files sent to ConvertAPI are subject to their privacy policy. ConvertAPI is GDPR-compliant and does not retain files after processing. Learn more at convertapi.com/privacy.',
      },
      {
        subtitle: 'Supabase',
        text: 'We use Supabase for optional user authentication features. Supabase is an open-source Firebase alternative with strong privacy practices. No file content is ever stored in Supabase — only account credentials if you choose to create an account.',
      },
      {
        subtitle: 'No Advertising Networks',
        text: 'SmartPDFs Plus does not use Google AdSense, Facebook Ads, or any other advertising network. We do not share your data with advertisers.',
      },
    ],
  },
  {
    icon: Users,
    title: 'Your Rights',
    color: 'bg-purple-500',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to request a copy of any personal data we hold about you (primarily contact form submissions). We will provide this in a portable format within 30 days of your request.',
      },
      {
        subtitle: 'Deletion',
        text: 'You can request deletion of your personal data at any time. For contact form data, we will delete your information within 7 business days. Note: Anonymous analytics data cannot be deleted as it contains no personal identifiers.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of anonymous analytics by disabling cookies in your browser. You can opt out of support communications by requesting removal from our records.',
      },
      {
        subtitle: 'GDPR & Indian IT Act',
        text: 'SmartPDFs Plus complies with GDPR (EU General Data Protection Regulation) and the Indian Information Technology Act, 2000. Users in the EU have additional rights under GDPR including the right to object to processing.',
      },
    ],
  },
  {
    icon: Bell,
    title: 'Policy Updates',
    color: 'bg-slate-600',
    content: [
      {
        subtitle: 'Notification of Changes',
        text: 'We will notify users of significant changes to this Privacy Policy by posting a prominent notice on our website at least 14 days before the changes take effect.',
      },
      {
        subtitle: 'Continued Use',
        text: 'Continued use of SmartPDFs Plus after policy changes constitutes acceptance of the updated policy. If you do not agree with changes, please discontinue use and contact us to request data deletion.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-black uppercase tracking-widest mb-6">
          <Shield size={13} /> Privacy Policy
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Your Privacy is Our<br />
          <span className="text-green-500">Top Priority</span>
        </h1>
        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto mb-3">
          SmartPDFs Plus is built with a privacy-first approach. Most tools process files entirely in your browser — your documents never leave your device.
        </p>
        <p className="text-xs text-slate-400 font-medium">Last updated: April 27, 2026 · Effective immediately</p>
      </section>

      {/* Quick highlights */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center space-y-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white mx-auto shadow-md`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm">{title}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client vs Server banner */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h2 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            Quick Summary: Which Tools Are 100% Private?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <span className="font-black text-green-700 text-sm">100% Browser-Based (No Upload)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Merge PDF', 'Split PDF', 'Compress PDF', 'Organize PDF', 'Watermark', 'Page Numbers', 'Edit Metadata', 'PDF to JPG', 'JPG to PDF', 'PDF to Text', 'PDF to XML', 'Unlock PDF', 'Protect PDF', 'Aadhar Cropper'].map(t => (
                  <span key={t} className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Server size={10} className="text-white" />
                </div>
                <span className="font-black text-blue-700 text-sm">Server-Side (File Deleted in 1hr)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Word to PDF', 'PDF to Word', 'Excel to PDF', 'PDF to Excel', 'PPT to PDF', 'PDF to PPT', 'HTML to PDF', 'Repair PDF'].map(t => (
                  <span key={t} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed sections */}
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-3 p-5 border-b border-slate-50">
                <div className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  <section.icon size={17} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <h2 className="font-black text-slate-900 text-base">{section.title}</h2>
                </div>
              </div>
              {/* Sub-sections */}
              <div className="divide-y divide-slate-50">
                {section.content.map((item, j) => (
                  <div key={j} className="p-5">
                    <h3 className="font-black text-slate-700 text-sm mb-1.5">{item.subtitle}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
          <Shield size={32} className="mx-auto text-green-400" />
          <h3 className="text-xl font-black">Questions About Your Privacy?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            If you have any questions about this Privacy Policy or how we handle your data, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-sm transition-all">
              Contact Privacy Team <ArrowRight size={14} />
            </a>
            <a href="/terms" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-sm transition-all border border-white/20">
              View Terms & Conditions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
