'use client';

import { Check, X, Minus, Zap, Crown, Star, Building2 } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import type { PricingTier } from '@/lib/pricing-data';
import {
  formatStorage, formatLimit,
  getSavingsPercent, getYearlySavings,
  SUPPORT_LABELS, ANALYTICS_LABELS,
} from '@/lib/pricing-data';

// ============================================================
// PricingCard — Individual plan card
// ============================================================

interface PricingCardProps {
  tier: PricingTier;
  billingCycle: 'monthly' | 'yearly';
  isCurrentPlan?: boolean;
  onSelect: (tierId: string) => void;
  style?: React.CSSProperties;
}

const TIER_ICONS = {
  free: Zap,
  starter: Star,
  pro: Crown,
  pro_plus: Crown,
  enterprise: Building2,
};

export function PricingCard({
  tier,
  billingCycle,
  isCurrentPlan = false,
  onSelect,
  style,
}: PricingCardProps) {
  const isPopular = tier.isPopular;
  const isBestValue = tier.isBestValue;
  const isEnterprise = tier.id === 'enterprise';
  const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  const savings = getSavingsPercent(tier);
  const yearlySaved = getYearlySavings(tier);

  const Icon = TIER_ICONS[tier.id] ?? Zap;

  return (
    <div
      style={style}
      className={`
        relative flex flex-col rounded-2xl border bg-[rgb(var(--background-card))]
        animate-fade-in-up card-hover
        ${isPopular
          ? 'border-indigo-400 dark:border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.03] z-10 pulse-ring'
          : isBestValue
          ? 'border-purple-400 dark:border-purple-500 shadow-xl shadow-purple-500/15'
          : 'border-[rgb(var(--border))] shadow-sm'
        }
      `}
    >
      {/* Popular / Best Value ribbon */}
      {(isPopular || isBestValue) && (
        <div className={`
          absolute -top-3.5 left-1/2 -translate-x-1/2
          rounded-full px-4 py-1 text-xs font-bold text-white shadow-lg
          ${isPopular
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
            : 'bg-gradient-to-r from-purple-600 to-pink-500'
          }
        `}>
          {tier.badge}
        </div>
      )}

      {/* Card header */}
      <div className="p-6 pb-4">
        {/* Icon + Name */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`
            flex h-10 w-10 items-center justify-center rounded-xl
            bg-gradient-to-br ${tier.color} shadow-lg
          `}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[rgb(var(--foreground))]">
              {tier.name}
            </h3>
            <p className="text-xs text-[rgb(var(--foreground-muted))]">
              {tier.description}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-1">
          {isEnterprise ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[rgb(var(--foreground))]">
                Custom
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[rgb(var(--foreground-muted))]">₹</span>
              <span
                key={`${tier.id}-${billingCycle}`}
                className="animate-count text-4xl font-black tabular-nums text-[rgb(var(--foreground))]"
              >
                {price === 0
                  ? '0'
                  : billingCycle === 'yearly' && price
                  ? Math.round(price / 12).toLocaleString('en-IN')
                  : price?.toLocaleString('en-IN')}
              </span>
              {price !== 0 && (
                <span className="text-sm text-[rgb(var(--foreground-muted))]">/month</span>
              )}
            </div>
          )}

          {/* Yearly billing note */}
          {billingCycle === 'yearly' && !isEnterprise && price !== 0 && (
            <p className="mt-1 text-xs text-[rgb(var(--foreground-muted))]">
              Billed ₹{tier.yearlyPrice?.toLocaleString('en-IN')}/year
              {savings > 0 && (
                <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  Save ₹{yearlySaved.toLocaleString('en-IN')} ({savings}%)
                </span>
              )}
            </p>
          )}
          {billingCycle === 'monthly' && price === 0 && (
            <p className="mt-1 text-xs text-[rgb(var(--foreground-muted))]">Free forever</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgb(var(--border))] mx-6" />

      {/* Highlights */}
      <div className="flex-1 p-6 pt-5">
        <ul className="space-y-2.5">
          {tier.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <div className={`
                mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full
                ${isPopular
                  ? 'bg-indigo-100 dark:bg-indigo-950/60'
                  : isBestValue
                  ? 'bg-purple-100 dark:bg-purple-950/60'
                  : 'bg-[rgb(var(--background-secondary))]'
                }
              `}>
                <Check className={`h-2.5 w-2.5 font-bold ${
                  isPopular
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : isBestValue
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`} />
              </div>
              <span className="text-sm text-[rgb(var(--foreground-muted))]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="p-6 pt-0">
        {isCurrentPlan ? (
          <div className="flex h-11 items-center justify-center rounded-xl border-2 border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400">
            ✓ Current Plan
          </div>
        ) : isEnterprise ? (
          <a
            href="mailto:enterprise@aiofficeSuite.com"
            className="
              flex h-11 w-full items-center justify-center rounded-xl
              bg-[rgb(var(--foreground))] text-sm font-semibold
              text-[rgb(var(--background))]
              hover:opacity-90 transition-opacity
            "
          >
            Contact Sales →
          </a>
        ) : (
          <button
            onClick={() => onSelect(tier.id)}
            className={`
              flex h-11 w-full items-center justify-center rounded-xl
              text-sm font-semibold transition-all duration-200
              active:scale-95
              ${isPopular || isBestValue
                ? `gradient-brand text-white shadow-lg shadow-indigo-500/30
                   hover:shadow-indigo-500/50 hover:opacity-95`
                : tier.id === 'free'
                ? `border-2 border-[rgb(var(--border))] bg-transparent
                   text-[rgb(var(--foreground))]
                   hover:border-indigo-400 hover:text-indigo-600
                   dark:hover:border-indigo-600 dark:hover:text-indigo-400`
                : `bg-blue-600 text-white hover:bg-blue-700`
              }
            `}
          >
            {tier.cta}
            {tier.id !== 'free' && tier.id !== 'enterprise' && (
              <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                7-DAY FREE TRIAL
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
