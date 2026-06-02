'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Zap, FileText, Settings, CreditCard, Smartphone, ArrowRight } from 'lucide-react';

import { CATEGORIES } from '@/data/faqData';


export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory)!;
  const totalFaqs = CATEGORIES.reduce((sum, c) => sum + c.faqs.length, 0);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest mb-6">
          <HelpCircle size={13} /> Frequently Asked Questions
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Got Questions?<br />We Have Answers.
        </h1>
        <p className="text-lg text-slate-500 mb-2">
          {totalFaqs} answers covering everything about SmartPDFs Plus.
        </p>
      </section>

      {/* Category tabs + FAQ */}
      <section className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Category sidebar */}
          <div className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {CATEGORIES.map(({ id, label, icon: Icon, color, faqs }) => (
                <button
                  key={id}
                  onClick={() => { setActiveCategory(id); setOpenIndex(0); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all whitespace-nowrap lg:whitespace-normal w-full ${
                    activeCategory === id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 ${activeCategory === id ? 'bg-white/20' : color} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon size={13} className={activeCategory === id ? 'text-white' : 'text-white'} />
                  </div>
                  <span className="text-xs font-black">{label}</span>
                  <span className={`ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                    activeCategory === id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {faqs.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 ${currentCategory.color} rounded-xl flex items-center justify-center text-white`}>
                <currentCategory.icon size={16} />
              </div>
              <h2 className="font-black text-slate-900 text-lg">{currentCategory.label}</h2>
              <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {currentCategory.faqs.length} questions
              </span>
            </div>

            {currentCategory.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between p-5 text-left gap-4"
                >
                  <span className={`font-bold text-sm leading-snug ${openIndex === i ? 'text-red-500' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-red-400' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white space-y-4">
          <HelpCircle size={32} className="mx-auto text-slate-400" />
          <h3 className="text-xl font-black">Still have questions?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Can't find what you're looking for? Our support team is happy to help. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
              Contact Support <ArrowRight size={14} />
            </a>
            <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-sm transition-all border border-white/20">
              Explore Tools
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
