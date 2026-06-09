import {
  RotateCcw,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "Refund Policy | SmartPDFs Pro",
  description:
    "Read the refund policy of SmartPDFs Pro for subscriptions, premium plans, cancellations, and billing information.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    title: "Refund Policy | SmartPDFs Pro",
    description:
      "Understand our refund eligibility, cancellation terms, and payment handling for SmartPDFs Pro services.",
    url: `${siteUrl}/refund-policy`,
  },
};

const HIGHLIGHTS = [
  {
    icon: CheckCircle2,
    title: "Transparent Billing",
    desc: "No hidden charges or surprise fees",
    color: "bg-green-500",
  },
  {
    icon: RotateCcw,
    title: "Refund Support",
    desc: "Fair and reviewed refund requests",
    color: "bg-orange-500",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Protected by Razorpay encryption",
    color: "bg-blue-500",
  },
  {
    icon: Clock,
    title: "Fast Resolution",
    desc: "Refund reviews within 7 business days",
    color: "bg-purple-500",
  },
];

const SECTIONS = [
  {
    icon: CreditCard,
    title: "General Refund Policy",
    color: "bg-green-500",
    content: [
      {
        subtitle: "Digital Service Policy",
        text: "SmartPDFs Pro provides digital software services and browser-based PDF tools. Due to the instant nature of digital access, refunds are evaluated on a case-by-case basis.",
      },
      {
        subtitle: "Eligible Refund Cases",
        text: "Refunds may be approved for duplicate payments, accidental charges, billing errors, failed premium activations, or technical issues that prevent service delivery.",
      },
      {
        subtitle: "Non-Refundable Situations",
        text: "Refunds are generally not provided for change of mind, partial usage, completed subscriptions, or failure to cancel before renewal dates.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Refund Process",
    color: "bg-orange-500",
    content: [
      {
        subtitle: "Request Submission",
        text: "To request a refund, contact our support team with your payment receipt, registered email address, transaction ID, and reason for the request.",
      },
      {
        subtitle: "Review Timeline",
        text: "All refund requests are reviewed manually within 3–7 business days to ensure fair resolution and fraud prevention.",
      },
      {
        subtitle: "Refund Method",
        text: "Approved refunds are returned through the original payment method used during checkout. Processing time depends on your bank or payment provider.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Payments & Security",
    color: "bg-blue-500",
    content: [
      {
        subtitle: "Secure Payment Gateway",
        text: "All payments on SmartPDFs Pro are securely processed using Razorpay with encrypted HTTPS connections and PCI-compliant payment infrastructure.",
      },
      {
        subtitle: "No Card Storage",
        text: "SmartPDFs Pro does not store your full debit card, credit card, UPI, or banking information on our servers.",
      },
      {
        subtitle: "Fraud Prevention",
        text: "Suspicious, abusive, or fraudulent transactions may be flagged and investigated before refund approval.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Subscriptions & Cancellation",
    color: "bg-indigo-500",
    content: [
      {
        subtitle: "Subscription Cancellation",
        text: "You may cancel your subscription at any time before the next billing cycle to avoid future charges.",
      },
      {
        subtitle: "Access After Cancellation",
        text: "After cancellation, premium access will remain active until the end of the current billing period.",
      },
      {
        subtitle: "Automatic Renewals",
        text: "Some premium plans may renew automatically unless cancelled before the renewal date.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Exceptions",
    color: "bg-red-500",
    content: [
      {
        subtitle: "Service Abuse",
        text: "Refunds may be denied in cases involving abuse, excessive automated usage, malicious activity, policy violations, or fraudulent claims.",
      },
      {
        subtitle: "Third-Party Services",
        text: "Payments processed through third-party platforms may also be subject to their individual refund policies and timelines.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold uppercase tracking-widest mb-6">
          <RotateCcw size={13} /> Refund Policy
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Refund &
          <br />
          <span className="text-orange-500">Cancellation Policy</span>
        </h1>

        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto mb-3">
          SmartPDFs Pro believes in transparent billing and fair refund
          practices for all premium plans and digital services.
        </p>

        <p className="text-xs text-slate-400 font-medium">
          Last updated: April 27, 2026 · Effective immediately
        </p>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center space-y-3"
            >
              <div
                className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white mx-auto shadow-md`}
              >
                <Icon size={18} />
              </div>

              <div>
                <p className="font-bold text-slate-900 text-sm">{title}</p>

                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Policy Sections */}
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-slate-50">
                <div
                  className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center text-white shrink-0`}
                >
                  <section.icon size={17} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>

                  <h2 className="font-black text-slate-900 text-base">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div>
                {section.content.map((item, j) => (
                  <div key={j} className="pb-5 pl-8 pr-8">
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                      {item.subtitle}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
          <RotateCcw size={32} className="mx-auto text-orange-400" />

          <h3 className="text-xl font-bold">
            Need Help With Billing or Refunds?
          </h3>

          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Our support team is available to assist with payment issues,
            subscription cancellations, and refund requests.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all"
            >
              Contact Support <ArrowRight size={14} />
            </a>

            <a
              href="/terms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/20"
            >
              View Terms & Conditions
            </a>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            Support Email: smartpdfpro@gmail.com
          </p>
        </div>
      </section>
    </div>
  );
}
