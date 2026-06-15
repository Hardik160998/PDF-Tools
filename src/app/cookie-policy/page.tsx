import {
  Shield,
  Lock,
  Eye,
  Trash2,
  Server,
  Users,
  Bell,
  CheckCircle2,
  ArrowRight,
  FileText,
  Globe,
  Settings,
  CreditCard,
  PieChart,
  Megaphone
} from "lucide-react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "Cookie Policy | SmartPDFs Pro",
  description:
    "Learn about how SmartPDFs Pro uses cookies to improve your experience, serve targeted ads, and process secure payments.",
  alternates: {
    canonical: `${siteUrl}/cookie-policy`,
  },
  openGraph: {
    title: "Cookie Policy | SmartPDFs Pro",
    description:
      "Learn about how SmartPDFs Pro uses cookies to improve your experience, serve targeted ads, and process secure payments.",
    url: `${siteUrl}/cookie-policy`,
  },
};

const HIGHLIGHTS = [
  {
    icon: Settings,
    title: "Full Control",
    desc: "You can manage your cookies at any time",
    color: "bg-green-500",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "We clearly list every cookie we use",
    color: "bg-blue-500",
  },
  {
    icon: Lock,
    title: "100% Secure",
    desc: "Cookies are encrypted and safe",
    color: "bg-indigo-500",
  },
  {
    icon: Users,
    title: "Better Experience",
    desc: "Cookies help us remember your preferences",
    color: "bg-purple-500",
  },
];

const SECTIONS = [
  {
    id: "essential",
    icon: Lock,
    title: "Essential Cookies",
    color: "bg-slate-700",
    content: [
      {
        subtitle: "Required for Functionality",
        text: "These cookies are strictly necessary for the website to function properly. They handle user authentication, active sessions, and core security features. Without these cookies, parts of our site may not work.",
      },
      {
        subtitle: "Theme Preferences",
        text: "We use local storage and cookies to remember whether you prefer light mode or dark mode, ensuring a seamless experience when navigating between tools.",
      },
    ],
  },
  {
    id: "analytics",
    icon: PieChart,
    title: "Analytics Cookies",
    color: "bg-blue-500",
    content: [
      {
        subtitle: "Google Analytics 4 (GA4)",
        text: "We use Google Analytics to understand how visitors interact with our website. These cookies collect anonymous information about the number of visitors, bounce rates, and traffic sources.",
      },
      {
        subtitle: "How It Helps Us",
        text: "This data helps us improve our PDF tools, optimize page load times, and prioritize features that our users love. No personally identifiable information or uploaded file data is collected.",
      },
    ],
  },
  {
    id: "advertising",
    icon: Megaphone,
    title: "Advertising Cookies",
    color: "bg-orange-500",
    content: [
      {
        subtitle: "Google AdSense & DART Cookies",
        text: "We use Google AdSense to serve advertisements. Google uses DART cookies to serve ads based on your visit to our site and other sites on the Internet.",
      },
      {
        subtitle: "Opting Out",
        text: "You can opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at google.com/settings/ads. You can also visit networkadvertising.org to opt out of third-party vendor's use of cookies for personalized advertising.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment Processing Cookies",
    color: "bg-indigo-500",
    content: [
      {
        subtitle: "Razorpay Secure Sessions",
        text: "For users accessing premium features, we use Razorpay as our secure payment gateway. Razorpay sets strictly necessary cookies to securely process transactions, prevent fraud, and manage active checkout sessions.",
      },
    ],
  },
  {
    id: "management",
    icon: Settings,
    title: "Cookie Management",
    color: "bg-green-500",
    content: [
      {
        subtitle: "Browser Settings",
        text: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. Most browsers allow you to block or delete cookies from the settings menu.",
      },
      {
        subtitle: "How to Clear Cookies",
        text: "For Chrome: Settings > Privacy and security > Clear browsing data. For Safari: Preferences > Privacy > Manage Website Data. If you block essential cookies, you may not be able to use certain features on our site.",
      },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold uppercase tracking-widest mb-6">
          <Globe size={13} /> Cookie Policy
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
          How We Use
          <br />
          <span className="text-indigo-500">Cookies & Tracking</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto mb-3">
          We believe in complete transparency. Here is exactly what cookies we use, why we use them, and how you can control them.
        </p>
        <p className="text-xs text-slate-400 font-medium">
          Last updated: April 27, 2026 · Effective immediately
        </p>
      </section>

      {/* Quick highlights */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-3 hover:-translate-y-1 transition-transform"
            >
              <div
                className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white mx-auto shadow-md`}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed sections */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <div
              id={section.id}
              key={section.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden scroll-mt-24"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 p-5 border-b border-slate-50 dark:border-slate-800/50">
                <div
                  className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center text-white shrink-0`}
                >
                  <section.icon size={17} />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-slate-900 dark:text-white text-base">
                    {section.title}
                  </h2>
                </div>
              </div>
              {/* Sub-sections */}
              <div className="p-6 space-y-6">
                {section.content.map((item, j) => (
                  <div key={j}>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-indigo-500" />
                       {item.subtitle}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed ml-5">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-center text-white space-y-4">
          <Shield size={32} className="mx-auto text-indigo-400" />
          <h3 className="text-xl font-bold">Still Have Questions?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            If you have any questions about this Cookie Policy, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              Contact Support <ArrowRight size={14} />
            </a>
            <a
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/20"
            >
              Read Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
