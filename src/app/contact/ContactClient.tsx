"use client";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Loader2,
  FileText,
  CheckCircle2,
  Lock,
  ChevronDown,
  Users,
  Wrench,
  Globe,
  Zap,
} from "lucide-react";

const CONTACT_REASONS = [
  "Technical Support",
  "Billing Questions",
  "Business Partnerships",
  "Feature Requests",
  "Bug Reports",
  "Feedback",
];

const FAQ_ITEMS = [
  {
    q: "How long does support take?",
    a: "We typically respond within 24 hours. Most queries are resolved on the same business day.",
  },
  {
    q: "Are my uploaded PDFs secure?",
    a: "Absolutely. Files are encrypted during transfer and automatically deleted after processing. Most tools run entirely in your browser.",
  },
  {
    q: "Do I need an account?",
    a: "No. Most of our PDF tools work without any registration or sign-up. Premium features require an account.",
  },
  {
    q: "Can I request a new feature?",
    a: "Yes! We love hearing from users. Use the contact form above or email us directly with your suggestions.",
  },
  {
    q: "Is there a file size limit?",
    a: "Free users can process files up to 50MB. Premium plans support files up to 1GB with batch processing.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Contact API error response:", text);
        throw new Error(
          `Server error (${res.status}). Please try again later.`,
        );
      }

      if (!res.ok) throw new Error(data.error || "Failed to send.");
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-xs font-bold uppercase tracking-widest mb-6">
          <MessageSquare size={13} /> Contact Us
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
          We&apos;d Love to Hear From You
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          Have a question, suggestion, or issue? Reach out and we&apos;ll get back to
          you within 24 hours.
        </p>
      </section>

      {/* Social Proof Stats */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, value: "10,000+", label: "Users", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { icon: Wrench, value: "50+", label: "PDF Tools", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
            { icon: Globe, value: "100+", label: "Countries", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: Zap, value: "24 Hours", label: "Avg. Reply", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm text-center">
              <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">{value}</p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content: Contact Info + Form */}
      <section className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Info + Reasons */}
          <div className="space-y-4">
            {/* Contact Reasons */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm">
              <p className="font-bold text-slate-900 dark:text-white text-sm mb-3">We can help with</p>
              <div className="space-y-2">
                {CONTACT_REASONS.map((reason) => (
                  <div key={reason} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info Cards */}
            {[
              {
                icon: Mail,
                title: "Email Us",
                value: "smartpdfpro@gmail.com",
                sub: "24/7 customer assistance",
                color: "bg-red-500",
              },
              {
                icon: MapPin,
                title: "Business Location",
                value: "Gujarat, India",
                sub: "Serving users worldwide",
                color: "bg-blue-500",
              },
              {
                icon: Clock,
                title: "Support Timings",
                value: "24/7 Available",
                sub: "Round-the-clock support",
                color: "bg-green-500",
              },
              {
                icon: FileText,
                title: "Business Name",
                value: "Smart PDF Pro",
                sub: "Online PDF Tools & Automation Platform",
                color: "bg-purple-500",
              },
            ].map(({ icon: Icon, title, value, sub, color }) => (
              <div
                key={title}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shrink-0`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{title}</p>

                  {title === "Email Us" ? (
                    <a
                      href="mailto:smartpdfpro@gmail.com"
                      className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-orange-500 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                      {value}
                    </p>
                  )}

                  <p className="text-slate-400 dark:text-slate-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-3">
              <p className="font-bold text-slate-900 dark:text-white text-sm">Follow Us</p>

              <div className="flex items-center gap-3 pt-1">
                {/* Facebook */}
                <a
                  target="_blank"
                  href="https://www.facebook.com/profile.php?id=61590386471384"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  target="_blank"
                  href="https://www.instagram.com/smartpdfpro/"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-sm">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Send size={28} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Sent!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                  Thanks for reaching out. We&apos;ll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Send a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      key: "name",
                      label: "Your Name",
                      placeholder: "John Doe",
                      type: "text",
                    },
                    {
                      key: "email",
                      label: "Email Address",
                      placeholder: "john@example.com",
                      type: "email",
                    },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {label}
                      </label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, [key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 dark:focus:border-red-700 transition-all"
                        style={{ userSelect: "text", WebkitUserSelect: "text" }}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 dark:focus:border-red-700 transition-all"
                    style={{ userSelect: "text", WebkitUserSelect: "text" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more about your question or issue..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 dark:focus:border-red-700 transition-all resize-none"
                    style={{ userSelect: "text", WebkitUserSelect: "text" }}
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {sending ? "Sending..." : "Send Message"}
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Lock size={13} className="text-emerald-500" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Your information is encrypted. We never share your personal data.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-xs font-bold uppercase tracking-widest mb-4">
              <MessageSquare size={13} /> FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Promise */}
      <section className="border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-3xl p-8 md:p-12 border border-red-100 dark:border-red-900/30 text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Clock size={28} className="text-red-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">
              Our Response Time Promise
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto mb-6">
              We know your time is valuable. Our support team is committed to responding to every query within <span className="font-bold text-slate-900 dark:text-white">24 hours</span>. Most issues are resolved the same day.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: "< 1 Hour", label: "Critical Issues" },
                { value: "< 12 Hours", label: "General Queries" },
                { value: "< 24 Hours", label: "Feature Requests" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-lg md:text-xl font-extrabold text-red-500 font-outfit">{value}</p>
                  <p className="text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
