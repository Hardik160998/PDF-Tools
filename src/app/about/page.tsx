import { Heart, Shield, Zap, Globe, Users, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest mb-6">
          <Heart size={13} className="fill-red-500" /> About SmartPDFs Plus
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
          Built for Everyone Who Works with PDFs
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
          SmartPDFs Plus is a free, browser-based PDF toolkit that lets you merge, split, compress, convert and secure your documents — without uploading anything to a server.
        </p>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: '100% Private', desc: 'All core tools run entirely in your browser. Your files never leave your device.', color: 'bg-green-500' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Powered by modern web APIs for instant processing — no waiting, no queues.', color: 'bg-orange-500' },
            { icon: Globe, title: 'Always Free', desc: 'Every tool is completely free to use. No sign-up required for client-side tools.', color: 'bg-blue-500' },
            { icon: Users, title: 'Built for Everyone', desc: 'Designed for students, professionals, and businesses of all sizes.', color: 'bg-purple-500' },
            { icon: Lock, title: 'Secure by Design', desc: 'Server-side tools use encrypted connections and files are deleted immediately.', color: 'bg-red-500' },
            { icon: Heart, title: 'Made with Love', desc: 'Crafted with care to give you the best PDF experience on the web.', color: 'bg-pink-500' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <Icon size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-base">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Our Mission</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            We believe powerful document tools should be accessible to everyone — not locked behind expensive subscriptions. SmartPDFs Plus was created to give individuals and teams a fast, private, and reliable way to handle PDF workflows.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
            Explore All Tools →
          </a>
        </div>
      </section>
    </div>
  );
}
