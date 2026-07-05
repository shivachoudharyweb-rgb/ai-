'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, absolutely. You can cancel anytime from your billing dashboard. Your plan stays active until the end of the current billing period, and you won\'t be charged again.',
  },
  {
    q: 'Is there a free trial?',
    a: 'All paid plans (Starter, Pro, Pro Plus) come with a 7-day free trial. No credit card required to start. You only get charged if you choose to continue after the trial.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'For INR payments (India): Credit/Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and digital wallets via Razorpay. For international payments: Visa, Mastercard, Amex, Apple Pay, Google Pay via Stripe.',
  },
  {
    q: 'What happens when I hit my daily limit?',
    a: 'Your tools will be paused for the day and you\'ll see a friendly upgrade prompt. Limits reset every day at midnight IST. You can upgrade anytime to instantly unlock more usage.',
  },
  {
    q: 'Can I upgrade or downgrade mid-cycle?',
    a: 'Yes! Upgrades are instant and prorated — you only pay the difference for the remaining days. Downgrades take effect at the start of your next billing cycle.',
  },
  {
    q: 'Is my data safe and processed securely?',
    a: 'All file processing for PDF and Image tools happens in your browser — files never leave your device unless you explicitly save them. AI tools process data through encrypted connections. We never store your documents on our servers without your permission.',
  },
  {
    q: 'Do you offer GST invoices?',
    a: 'Yes, all paid plans include a GST-compliant invoice automatically emailed after each payment. You can also download past invoices from your billing dashboard.',
  },
  {
    q: 'What is the Enterprise plan?',
    a: 'Enterprise is a fully custom plan for organizations — custom storage, custom API limits, on-premise deployment options, SLA guarantees, dedicated account manager, and volume pricing. Contact our sales team to get a quote.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[rgb(var(--foreground-muted))]">
            Everything you need to know about billing and plans
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`
                overflow-hidden rounded-xl border bg-[rgb(var(--background-card))]
                transition-all duration-200
                ${open === i
                  ? 'border-indigo-300 shadow-md shadow-indigo-500/10 dark:border-indigo-700'
                  : 'border-[rgb(var(--border))] hover:border-[rgb(var(--border-strong))]'
                }
              `}
            >
              <button
                className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`font-semibold transition-colors ${
                  open === i
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-[rgb(var(--foreground))]'
                }`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-5 w-5 shrink-0 text-[rgb(var(--foreground-muted))] transition-transform duration-300 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="border-t border-[rgb(var(--border))] px-6 py-4 text-sm leading-relaxed text-[rgb(var(--foreground-muted))]">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
