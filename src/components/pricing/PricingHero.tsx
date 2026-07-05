'use client';

import { useState } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import type { BillingCycle } from '@/lib/pricing-data';
import { getSavingsPercent, PRICING_TIERS } from '@/lib/pricing-data';

// ============================================================
// PricingHero — Page header with billing cycle toggle
// ============================================================

export function PricingHero() {
  const { billingCycle, setBillingCycle } = useSubscriptionStore();
  const maxSavings = Math.max(
    ...PRICING_TIERS.filter((t) => t.monthlyPrice && t.monthlyPrice > 0)
      .map((t) => getSavingsPercent(t))
  );

  return (
    <section className="relative overflow-hidden py-20 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {/* Eyebrow */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          Simple, Transparent Pricing
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[rgb(var(--foreground))] sm:text-5xl lg:text-6xl">
          Choose Your{' '}
          <span className="gradient-text">Perfect Plan</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-[rgb(var(--foreground-muted))]">
          From free tools to unlimited AI power. Upgrade or downgrade anytime.
          No hidden fees, cancel whenever you want.
        </p>

        {/* Billing Toggle */}
        <BillingToggle
          value={billingCycle}
          onChange={setBillingCycle}
          maxSavings={maxSavings}
        />
      </div>
    </section>
  );
}

// ============================================================
// BillingToggle — Monthly / Yearly pill switcher
// ============================================================
function BillingToggle({
  value,
  onChange,
  maxSavings,
}: {
  value: BillingCycle;
  onChange: (c: BillingCycle) => void;
  maxSavings: number;
}) {
  return (
    <div className="inline-flex items-center gap-4">
      <div
        className="relative inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-1 shadow-sm"
        role="radiogroup"
        aria-label="Billing cycle"
      >
        {/* Sliding pill */}
        <div
          className={`
            absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg
            bg-gradient-to-r from-indigo-500 to-purple-600
            shadow-lg shadow-indigo-500/30
            transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${value === 'monthly' ? 'left-1' : 'left-[calc(50%)]'}
          `}
        />

        {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
          <button
            key={cycle}
            role="radio"
            aria-checked={value === cycle}
            onClick={() => onChange(cycle)}
            className={`
              relative z-10 px-7 py-2.5 text-sm font-semibold capitalize
              transition-colors duration-200 rounded-lg
              ${value === cycle
                ? 'text-white'
                : 'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]'
              }
            `}
          >
            {cycle}
          </button>
        ))}
      </div>

      {/* Savings badge */}
      <div
        className={`
          transition-all duration-300
          ${value === 'yearly'
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-2 scale-95 pointer-events-none'
          }
        `}
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-800">
          🎉 Save up to {maxSavings}%
        </span>
      </div>
    </div>
  );
}
