'use client';

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { PRICING_TIERS } from '@/lib/pricing-data';
import { PricingCard } from './PricingCard';

// ============================================================
// PricingGrid — 5-column responsive plan grid
// ============================================================

interface PricingGridProps {
  currentTierId?: string;
}

export function PricingGrid({ currentTierId }: PricingGridProps) {
  const { billingCycle, openCheckout } = useSubscriptionStore();

  return (
    <section className="px-4 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="
          grid gap-4 stagger-children
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        ">
          {PRICING_TIERS.map((tier, i) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              isCurrentPlan={tier.id === currentTierId}
              onSelect={(id) => {
                if (id !== 'free') openCheckout(id as Parameters<typeof openCheckout>[0]);
              }}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[rgb(var(--foreground-muted))]">
          {[
            { icon: '🔒', text: '256-bit SSL Encryption' },
            { icon: '↩️', text: '7-day money-back guarantee' },
            { icon: '🚫', text: 'No hidden fees' },
            { icon: '🔄', text: 'Cancel anytime' },
            { icon: '🇮🇳', text: 'GST Invoice included' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
