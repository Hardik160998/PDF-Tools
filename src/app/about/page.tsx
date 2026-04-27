import { Heart, Shield, Zap, Globe, Users, Lock, FileText, Combine, Scissors, CheckCircle2, Star, ArrowRight } from 'lucide-react';

const STATS = [
  { value: '22+', label: 'PDF Tools', desc: 'Free to use, no sign-up' },
  { value: '100%', label: 'Browser-Based', desc: 'Files never leave your device' },
  { value: '0₹', label: 'Always Free', desc: 'No hidden charges ever' },
  { value: '24/7', label: 'Available', desc: 'Works anytime, anywhere' },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'All core tools run entirely in your browser using WebAssembly. Your files are never uploaded to any server — they stay on your device at all times.',
    color: 'bg-green-500',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    desc: 'Powered by pdf-lib and PDF.js — industry-standard libraries that process documents instantly without any server round-trips or waiting queues.',
    color: 'bg-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    icon: Globe,
    title: 'Always Free',
    desc: 'Every tool on SmartPDFs Plus is completely free. No subscription, no watermarks, no file limits on client-side tools. Built for everyone.',
    color: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'Built for Everyone',
    desc: 'Whether you\'re a student submitting assignments, a professional handling contracts, or a business processing documents — SmartPDFs works for you.',
    color: 'bg-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: Lock,
    title: 'Secure by Design',
    desc: 'Server-side tools (Office conversions, Repair) use encrypted HTTPS connections. Files are processed and permanently deleted within 1 hour.',
    color: 'bg-red-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    desc: 'SmartPDFs Plus is crafted with attention to detail — clean UI, mobile-first design, and a focus on making every interaction feel effortless.',
    color: 'bg-pink-500',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
];

const TOOLS_SHOWCASE = [
  { icon: Combine, label: 'Merge PDF', desc: 'Combine multiple PDFs into one', color: 'bg-orange-500' },
  { icon: Scissors, label: 'Split PDF', desc: 'Divide PDF into separate files', color: 'bg-orange-500' },
  { icon: Zap, label: 'Compress PDF', desc: 'Reduce file size instantly', color: 'bg-green-500' },
  { icon: FileText, label: 'PDF to Word', desc: 'Convert to editable DOCX', color: 'bg-blue-600' },
  { icon: Shield, label: 'Protect PDF', desc: 'Add password encryption', color: 'bg-red-500' },
  { icon: Lock, label: 'Unlock PDF', desc: 'Remove PDF password', color: 'bg-red-500' },
];

const TIMELINE = [
  { year: '2024', title: 'SmartPDFs Plus Founded', desc: 'Started with 5 core tools — Merge, Split, Compress, Watermark, and Protect.' },
  { year: '2025', title: 'Expanded to 15+ Tools', desc: 'Added Office conversions, Image tools, Extract Text, Repair PDF, and Aadhar Cropper.' },
  { year: '2026', title: '22 Tools & Growing', desc: 'Full mobile support, skeleton loading, drag-and-drop organizer, and more on the way.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest mb-6">
          <Heart size={13} className="fill-red-500" /> About SmartPDFs Plus
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
          The Smartest Way to<br />
          <span className="text-red-500">Work with PDFs</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-8">
          SmartPDFs Plus is a free, browser-based PDF toolkit with 22+ tools — from merging and splitting to converting Office files, adding watermarks, and securing documents. No sign-up. No cost. No compromise.
        </p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-red-500/20">
          Explore All Tools <ArrowRight size={16} />
        </a>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
              <div className="text-3xl font-black text-red-500">{value}</div>
              <div className="font-black text-slate-900 text-sm">{label}</div>
              <div className="text-xs text-slate-400 font-medium">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-900 py-16 mb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-widest">
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Powerful PDF Tools Should Be<br />
            <span className="text-red-400">Free for Everyone</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            We built SmartPDFs Plus because we believe document tools shouldn't be locked behind expensive subscriptions. Students, freelancers, small businesses, and enterprises all deserve fast, private, and reliable PDF workflows — at zero cost.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['No Watermarks', 'No File Limits', 'No Sign-up Required', 'No Hidden Fees'].map(item => (
              <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold">
                <CheckCircle2 size={12} className="text-green-400" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">What We Stand For</h2>
          <p className="text-slate-500 mt-2">The principles that guide every decision we make</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map(({ icon: Icon, title, desc, color, bg, text }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="bg-slate-50 py-16 mb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popular Tools</h2>
            <p className="text-slate-500 mt-2">A few of the 22+ tools available — all free, all instant</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TOOLS_SHOWCASE.map(({ icon: Icon, label, desc, color }) => (
              <a key={label} href={`/tool/${label.toLowerCase().replace(/ /g, '-')}`}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:border-slate-200 transition-all group">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm group-hover:text-red-500 transition-colors">{label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-black text-sm transition-all">
              View All 22+ Tools <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 pb-16 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Journey</h2>
          <p className="text-slate-500 mt-2">How SmartPDFs Plus has grown over time</p>
        </div>
        <div className="space-y-4">
          {TIMELINE.map(({ year, title, desc }, i) => (
            <div key={year} className="flex gap-5 items-start">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${i === TIMELINE.length - 1 ? 'bg-red-500' : 'bg-slate-300'}`}>
                  {i === TIMELINE.length - 1 ? <Star size={14} /> : year.slice(2)}
                </div>
                {i < TIMELINE.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex-1 mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-red-500 uppercase tracking-widest">{year}</span>
                </div>
                <h3 className="font-black text-slate-900 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-10 text-center text-white space-y-5 shadow-2xl shadow-red-500/20">
          <h2 className="text-3xl font-black tracking-tight">Ready to Get Started?</h2>
          <p className="text-red-100 text-base leading-relaxed max-w-lg mx-auto">
            Join thousands of users who trust SmartPDFs Plus for their daily document workflows. No account needed — just pick a tool and go.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="px-6 py-3 bg-white text-red-600 rounded-xl font-black text-sm hover:bg-red-50 transition-all shadow-lg">
              Start Using Free Tools
            </a>
            <a href="/contact" className="px-6 py-3 bg-white/20 text-white rounded-xl font-black text-sm hover:bg-white/30 transition-all border border-white/30">
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
