import {
  Ban,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "Cancellation Policy | SmartPDFs Pro",
  description:
    "Read the cancellation policy for SmartPDFs Pro subscriptions, premium plans, renewals, and billing services.",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

const SECTIONS = [
  {
    icon: Ban,
    title: "Subscription Cancellation",
    color: "bg-red-500",
    content: [
      {
        subtitle: "Cancel Anytime",
        text: "Users may cancel their SmartPDFs Pro subscription at any time before the next billing cycle.",
      },
      {
        subtitle: "No Long-Term Lock-In",
        text: "We do not force long-term contracts. You are free to stop using premium services whenever you choose.",
      },
      {
        subtitle: "Access Until Billing Ends",
        text: "After cancellation, premium access remains active until the end of your current billing period.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Renewals & Billing",
    color: "bg-orange-500",
    content: [
      {
        subtitle: "Automatic Renewal",
        text: "Some plans may renew automatically unless cancelled before the renewal date.",
      },
      {
        subtitle: "Billing Responsibility",
        text: "Users are responsible for cancelling subscriptions before renewal to avoid additional charges.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Account Security",
    color: "bg-blue-500",
    content: [
      {
        subtitle: "Secure Payments",
        text: "All subscription payments are securely processed through Razorpay using encrypted HTTPS payment systems.",
      },
      {
        subtitle: "Data Protection",
        text: "SmartPDFs Pro never stores complete debit card, credit card, or banking information on our servers.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Digital Services",
    color: "bg-green-500",
    content: [
      {
        subtitle: "Instant Digital Access",
        text: "SmartPDFs Pro delivers digital software services instantly after successful payment confirmation.",
      },
      {
        subtitle: "Service Availability",
        text: "Premium services remain accessible during active subscription periods subject to platform policies.",
      },
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase tracking-widest mb-6">
          <Ban size={13} /> Cancellation Policy
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Subscription
          <br />
          <span className="text-red-500">Cancellation Policy</span>
        </h1>

        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto">
          Learn how subscription cancellation, billing cycles, and premium
          access work on SmartPDFs Pro.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 p-5 border-b border-slate-50">
                <div
                  className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center text-white`}
                >
                  <section.icon size={17} />
                </div>

                <h2 className="font-black text-slate-900 text-base">
                  {section.title}
                </h2>
              </div>

              <div className="divide-y divide-slate-50">
                {section.content.map((item, j) => (
                  <div key={j} className="p-5">
                    <h3 className="font-bold text-slate-700 text-sm mb-1.5">
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

        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
          <Clock size={32} className="mx-auto text-red-400" />

          <h3 className="text-xl font-bold">
            Need Help With Subscription Cancellation?
          </h3>

          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Contact our support team for billing assistance or cancellation
            related queries.
          </p>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all"
          >
            Contact Support <ArrowRight size={14} />
          </a>

          <p className="text-xs text-slate-500 pt-2">smartpdfpro@gmail.com</p>
        </div>
      </section>
    </div>
  );
}
