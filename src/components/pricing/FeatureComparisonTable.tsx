'use client';
import { Fragment } from 'react';

import { Check, X, Minus } from 'lucide-react';
import {
  PRICING_TIERS, COMPARISON_FEATURES,
  formatStorage, formatLimit,
  SUPPORT_LABELS, ANALYTICS_LABELS,
} from '@/lib/pricing-data';
import type { TierLimit } from '@/lib/pricing-data';

// ============================================================
// FeatureComparisonTable — Full feature matrix across all tiers
// ============================================================

function formatCellValue(key: string, limits: TierLimit): React.ReactNode {
  const val = limits[key as keyof TierLimit];

  // Boolean features
  if (typeof val === 'boolean') {
    return val ? (
      <Check className="mx-auto h-4 w-4 text-emerald-500" />
    ) : (
      <X className="mx-auto h-4 w-4 text-[rgb(var(--foreground-subtle))]" />
    );
  }

  // Special formatting
  if (key === 'storageMb') return formatStorage(val as number | null);
  if (key === 'maxFileSizeMb') return `${val} MB`;
  if (key === 'supportLevel') return SUPPORT_LABELS[val as number] ?? '—';
  if (key === 'analyticsLevel') return ANALYTICS_LABELS[val as number] ?? '—';

  // Numeric limits
  if (val === null) return <span className="font-semibold text-indigo-500">Unlimited</span>;
  if (val === 0)    return <Minus className="mx-auto h-4 w-4 text-[rgb(var(--foreground-subtle))]" />;
  if (key === 'apiAccess') return formatLimit(val as number, ' req/day');
  if (key === 'teamMembers') return `${val} member${(val as number) > 1 ? 's' : ''}`;
  return formatLimit(val as number);
}

// Group features by category
const CATEGORIES = [...new Set(COMPARISON_FEATURES.map((f) => f.category))];

export function FeatureComparisonTable() {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Compare All Features
          </h2>
          <p className="mt-2 text-[rgb(var(--foreground-muted))]">
            Everything you need to make the right choice
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-[rgb(var(--border))]">
                <th className="sticky left-0 z-10 bg-[rgb(var(--background-card))] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">
                  Feature
                </th>
                {PRICING_TIERS.map((tier) => (
                  <th
                    key={tier.id}
                    className={`
                      px-4 py-4 text-center text-sm font-bold
                      ${tier.isPopular
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300'
                        : 'text-[rgb(var(--foreground))]'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`
                          inline-block h-2 w-2 rounded-full
                          bg-gradient-to-br ${tier.color}
                        `}
                      />
                      {tier.name}
                      {tier.isPopular && (
                        <span className="rounded bg-indigo-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {CATEGORIES.map((category) => {
                const features = COMPARISON_FEATURES.filter(
                  (f) => f.category === category
                );
                return (
                  <Fragment key={category}>
                    <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]">
                      <td colSpan={6} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-[rgb(var(--foreground-muted))]">
                        {category}
                      </td>
                    </tr>
                    {features.map((feature, rowIdx) => (
                      <tr
                        key={feature.key}
                        className={[
                          'border-b border-[rgb(var(--border))] last:border-0 transition-colors',
                          rowIdx % 2 !== 0 ? 'bg-[rgb(var(--background-secondary))]/30' : '',
                          'hover:bg-[rgb(var(--background-secondary))]/60',
                        ].join(' ')}
                      >
                        <td className="sticky left-0 bg-[rgb(var(--background-card))] px-6 py-3 font-medium text-[rgb(var(--foreground))]">
                          {feature.label}
                        </td>
                        {PRICING_TIERS.map((tier) => (
                          <td
                            key={tier.id}
                            className={[
                              'px-4 py-3 text-center text-[rgb(var(--foreground-muted))]',
                              tier.isPopular ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : '',
                            ].join(' ')}
                          >
                            {formatCellValue(feature.key, tier.limits)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
