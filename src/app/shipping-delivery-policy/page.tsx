import {
  Truck,
  Globe,
  Shield,
  CheckCircle2,
  ArrowRight,
  FileText,
  Download,
} from "lucide-react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | SmartPDFs Pro",
  description:
    "Read the shipping and delivery policy for SmartPDFs Pro digital services and premium subscriptions.",
  alternates: {
    canonical: "/shipping-delivery/policy",
  },
};

const SECTIONS = [
  {
    icon: Download,
    title: "Digital Delivery",
    color: "bg-blue-500",
    content: [
      {
        subtitle: "Instant Access",
        text: "All SmartPDFs Pro services are delivered digitally through our website immediately after successful payment processing.",
      },
      {
        subtitle: "No Physical Shipping",
        text: "SmartPDFs Pro does not sell or deliver physical goods, printed products, or hardware devices.",
      },
    ],
  },
  {
    icon: Globe,
    title: "Worldwide Availability",
    color: "bg-green-500",
    content: [
      {
        subtitle: "Global Access",
        text: "Our PDF tools and ecommerce automation services are accessible worldwide through supported web browsers.",
      },
      {
        subtitle: "Cross-Platform Compatibility",
        text: "Services work across desktop computers, tablets, Android devices, iPhones, and modern web browsers.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Secure Service Delivery",
    color: "bg-purple-500",
    content: [
      {
        subtitle: "Encrypted Access",
        text: "All digital services are delivered over secure HTTPS encrypted connections for user safety and privacy.",
      },
      {
        subtitle: "Protected Transactions",
        text: "Payments and subscription activations are securely processed through Razorpay infrastructure.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Delivery Timing",
    color: "bg-orange-500",
    content: [
      {
        subtitle: "Instant Activation",
        text: "Premium plans and digital access are usually activated within minutes after successful payment confirmation.",
      },
      {
        subtitle: "Technical Delays",
        text: "In rare situations, activation delays may occur due to payment verification or server maintenance activities.",
      },
    ],
  },
];

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-6">
          <Truck size={13} /> Shipping & Delivery
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Shipping &
          <br />
          <span className="text-blue-500">Delivery Policy</span>
        </h1>

        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto">
          SmartPDFs Pro provides fully digital services with instant online
          delivery and no physical shipping requirements.
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

        <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
          <CheckCircle2 size={32} className="mx-auto text-blue-400" />

          <h3 className="text-xl font-bold">Fully Digital Service Delivery</h3>

          <p className="text-slate-400 text-sm max-w-md mx-auto">
            All SmartPDFs Pro services are delivered online instantly without
            any physical shipping process.
          </p>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all"
          >
            Contact Support <ArrowRight size={14} />
          </a>

          <p className="text-xs text-slate-500 pt-2">smartpdfpro@gmail.com</p>
        </div>
      </section>
    </div>
  );
}
