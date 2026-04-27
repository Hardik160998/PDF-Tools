'use client';
import { useState } from 'react';
import { Mail, MapPin, Clock, Send, MessageSquare, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send.');
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest mb-6">
          <MessageSquare size={13} /> Contact Us
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          We'd Love to Hear From You
        </h1>
        <p className="text-lg text-slate-500">Have a question, suggestion, or issue? Reach out and we'll get back to you within 24 hours.</p>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', value: 'support@smartpdfs.com', sub: 'We reply within 24 hours', color: 'bg-red-500' },
              { icon: MapPin, title: 'Location', value: 'India', sub: 'Serving users worldwide', color: 'bg-blue-500' },
              { icon: Clock, title: 'Support Hours', value: 'Mon – Sat', sub: '9:00 AM – 6:00 PM IST', color: 'bg-green-500' },
            ].map(({ icon: Icon, title, value, sub, color }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                  <p className="text-slate-700 text-sm font-medium">{value}</p>
                  <p className="text-slate-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <p className="font-black text-slate-900 text-sm">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'Facebook', color: 'hover:bg-blue-600', svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
                  { label: 'Instagram', color: 'hover:bg-pink-500', svg: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></> },
                  { label: 'WhatsApp', color: 'hover:bg-green-500', svg: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/> },
                ].map(({ label, color, svg }) => (
                  <a key={label} href="#" aria-label={label}
                    className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 ${color} hover:text-white transition-all`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">{svg}</svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Send size={28} className="text-green-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 text-sm max-w-xs">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-black text-slate-900">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Your Name', placeholder: 'John Doe', type: 'text' },
                    { key: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
                      <input
                        type={type} required placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                        style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                  <input
                    type="text" required placeholder="How can we help?"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                    style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                  <textarea
                    required rows={5} placeholder="Tell us more about your question or issue..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none"
                    style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={sending}
                  className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20">
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
