import { FileText, CheckCircle2, XCircle, Scale, Shield, Server, Code, AlertTriangle, Globe, ArrowRight, RefreshCw } from 'lucide-react';

const ALLOWED = [
  'Merge, split, compress, and organize your own PDF files',
  'Convert Office documents to/from PDF for personal or commercial use',
  'Add watermarks, page numbers, or metadata to your documents',
  'Protect or unlock PDFs that you own or have permission to modify',
  'Use the Aadhar Cropper for your own identity documents',
  'Use SmartPDFs Plus tools for client work and business purposes',
  'Share the SmartPDFs Plus website link with others',
];

const NOT_ALLOWED = [
  'Process files containing illegal, harmful, or infringing content',
  'Upload malware, viruses, or malicious files to our servers',
  'Attempt to reverse-engineer, hack, or exploit our systems',
  'Use automated bots or scripts to abuse our service',
  'Circumvent any rate limits or security measures',
  'Resell or redistribute SmartPDFs Plus as your own product',
  'Use the service to infringe on others\' intellectual property',
];

const SECTIONS = [
  {
    icon: CheckCircle2,
    color: 'bg-purple-500',
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using SmartPDFs Plus ("the Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our service.',
      },
      {
        subtitle: 'Updates to Terms',
        text: 'We reserve the right to update these Terms at any time. We will notify users of significant changes by posting a notice on our website at least 14 days before changes take effect. Continued use of SmartPDFs Plus after changes constitutes acceptance of the updated Terms.',
      },
      {
        subtitle: 'Age Requirement',
        text: 'You must be at least 13 years old to use SmartPDFs Plus. By using our service, you confirm that you meet this age requirement. Users under 18 should have parental consent.',
      },
    ],
  },
  {
    icon: Scale,
    color: 'bg-blue-500',
    title: 'Permitted & Prohibited Use',
    content: [
      {
        subtitle: 'Permitted Use',
        text: 'SmartPDFs Plus is provided for lawful personal and commercial use. You may use our tools to process your own documents or documents you have legal permission to modify.',
      },
      {
        subtitle: 'Prohibited Activities',
        text: 'You agree not to use SmartPDFs Plus to process illegal content, upload malware, attempt to exploit our systems, use automated abuse tools, or infringe on intellectual property rights. Violations may result in immediate termination of access.',
      },
      {
        subtitle: 'Commercial Use',
        text: 'Commercial use of SmartPDFs Plus is permitted. You may use our tools for client work, business document processing, and commercial projects at no charge. You may not resell or white-label our service without written permission.',
      },
    ],
  },
  {
    icon: Server,
    color: 'bg-green-500',
    title: 'File Processing & Data',
    content: [
      {
        subtitle: 'Client-Side Processing',
        text: 'Most SmartPDFs Plus tools (Merge, Split, Compress, Organize, Watermark, Page Numbers, Edit Metadata, PDF to JPG, JPG to PDF, PDF to Text, PDF to XML, Unlock, Protect, Aadhar Cropper) process files entirely in your browser. Your files never leave your device.',
      },
      {
        subtitle: 'Server-Side Processing',
        text: 'Server-side tools (Word to PDF, PDF to Word, Excel to PDF, PDF to Excel, PowerPoint to PDF, PDF to PowerPoint, HTML to PDF, Repair PDF) temporarily upload files to our processing servers. Files are automatically deleted within 1 hour of processing.',
      },
      {
        subtitle: 'Your Responsibility',
        text: 'You are solely responsible for the files you upload and process. You warrant that you have the legal right to process any files submitted to SmartPDFs Plus. We are not responsible for the content of files processed through our service.',
      },
      {
        subtitle: 'No Backup Guarantee',
        text: 'SmartPDFs Plus does not store your files. We strongly recommend keeping backups of your original documents before processing. We are not liable for any data loss resulting from use of our tools.',
      },
    ],
  },
  {
    icon: Code,
    color: 'bg-indigo-500',
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Our Property',
        text: 'All content, design, code, branding, logos, and user interface elements of SmartPDFs Plus are the intellectual property of SmartPDFs Plus and its licensors, protected by copyright and trademark laws.',
      },
      {
        subtitle: 'Your Files',
        text: 'Your uploaded files remain entirely your property. SmartPDFs Plus claims no ownership, license, or rights over any documents you process through our service. We do not use your file content for any purpose other than performing the requested operation.',
      },
      {
        subtitle: 'Open Source Components',
        text: 'SmartPDFs Plus uses open-source libraries including pdf-lib (MIT License) and PDF.js (Apache 2.0 License). These components are used in accordance with their respective licenses.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    color: 'bg-yellow-500',
    title: 'Disclaimer of Warranties',
    content: [
      {
        subtitle: '"As Is" Service',
        text: 'SmartPDFs Plus is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure.',
      },
      {
        subtitle: 'Accuracy of Results',
        text: 'While we strive for high-quality output, we do not guarantee that conversion results will meet your specific requirements. PDF conversion quality depends on the source file format, content complexity, and fonts used.',
      },
      {
        subtitle: 'Service Availability',
        text: 'We do not guarantee 100% uptime. Server-side tools may be temporarily unavailable due to maintenance, API limits, or technical issues. Client-side tools work offline once the page is loaded.',
      },
    ],
  },
  {
    icon: Shield,
    color: 'bg-red-500',
    title: 'Limitation of Liability',
    content: [
      {
        subtitle: 'No Consequential Damages',
        text: 'To the maximum extent permitted by applicable law, SmartPDFs Plus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, loss of business, or business interruption.',
      },
      {
        subtitle: 'Maximum Liability',
        text: 'Since SmartPDFs Plus is a free service, our maximum liability to you for any claim arising from use of the service is limited to INR 0 (zero). This reflects the fact that you have not paid for the service.',
      },
      {
        subtitle: 'Data Loss',
        text: 'We are not responsible for any data loss resulting from use of our tools. Always maintain backups of important documents. Use our service at your own risk.',
      },
    ],
  },
  {
    icon: Globe,
    color: 'bg-teal-500',
    title: 'Third-Party Services',
    content: [
      {
        subtitle: 'ConvertAPI',
        text: 'Server-side conversions are powered by ConvertAPI. By using server-side tools, you also agree to ConvertAPI\'s Terms of Service (convertapi.com/terms). We are not responsible for ConvertAPI\'s service availability or practices.',
      },
      {
        subtitle: 'Supabase',
        text: 'Optional authentication features use Supabase. Use of authentication features is subject to Supabase\'s Terms of Service. We are not responsible for Supabase\'s service availability.',
      },
      {
        subtitle: 'External Links',
        text: 'SmartPDFs Plus may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of any third-party websites. Visiting external links is at your own risk.',
      },
    ],
  },
  {
    icon: RefreshCw,
    color: 'bg-orange-500',
    title: 'Service Modifications & Termination',
    content: [
      {
        subtitle: 'Service Changes',
        text: 'We reserve the right to modify, suspend, or discontinue any part of SmartPDFs Plus at any time, with or without notice. We may add, remove, or change tools and features as we see fit.',
      },
      {
        subtitle: 'Termination of Access',
        text: 'We reserve the right to terminate or restrict your access to SmartPDFs Plus if you violate these Terms, abuse our service, or engage in any activity that harms other users or our infrastructure.',
      },
    ],
  },
  {
    icon: Scale,
    color: 'bg-slate-600',
    title: 'Governing Law & Disputes',
    content: [
      {
        subtitle: 'Governing Law',
        text: 'These Terms shall be governed by and construed in accordance with the laws of India, specifically the Information Technology Act, 2000 and the Indian Contract Act, 1872, without regard to conflict of law principles.',
      },
      {
        subtitle: 'Dispute Resolution',
        text: 'Any disputes arising from these Terms or use of SmartPDFs Plus shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the exclusive jurisdiction of the courts of Gujarat, India.',
      },
      {
        subtitle: 'Severability',
        text: 'If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-xs font-black uppercase tracking-widest mb-6">
          <FileText size={13} /> Terms & Conditions
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto mb-3">
          Please read these terms carefully before using SmartPDFs Plus. By using our service, you agree to these terms.
        </p>
        <p className="text-xs text-slate-400 font-medium">Last updated: April 27, 2026 · Effective immediately · Governed by Indian Law</p>
      </section>

      {/* Allowed / Not Allowed quick summary */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Allowed */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white">
                <CheckCircle2 size={16} />
              </div>
              <h2 className="font-black text-green-800 text-sm uppercase tracking-widest">You Can</h2>
            </div>
            <ul className="space-y-2">
              {ALLOWED.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not Allowed */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white">
                <XCircle size={16} />
              </div>
              <h2 className="font-black text-red-800 text-sm uppercase tracking-widest">You Cannot</h2>
            </div>
            <ul className="space-y-2">
              {NOT_ALLOWED.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed sections */}
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-slate-50">
                <div className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  <section.icon size={17} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <h2 className="font-black text-slate-900 text-base">{section.title}</h2>
                </div>
              </div>
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

        {/* CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
          <Scale size={32} className="mx-auto text-purple-400" />
          <h3 className="text-xl font-black">Questions About Our Terms?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            If you have any questions about these Terms of Service, please contact us. We're happy to clarify anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-black text-sm transition-all">
              Contact Us <ArrowRight size={14} />
            </a>
            <a href="/privacy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-sm transition-all border border-white/20">
              View Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
