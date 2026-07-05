'use client';

import { Calendar, RefreshCw, TrendingUp, AlertCircle, Crown, Clock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { PRICING_TIERS } from '@/lib/pricing-data';

// ============================================================
// CurrentPlanCard — Active subscription overview
// ============================================================

export function CurrentPlanCard() {
  const { data: subscription, isLoading } = useSubscription();
  const { openCheckout } = useSubscriptionStore();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-6">
        <div className="space-y-3">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-4 w-56" />
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const tier = PRICING_TIERS.find((t) => t.id === subscription.tierId);
  if (!tier) return null;

  const isActive = subscription.status === 'active';
  const isTrialing = subscription.status === 'trialing';
  const endDate = new Date(subscription.currentPeriodEnd);
  const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const trialEnd = subscription.trialEnd ? new Date(subscription.trialEnd) : null;
  const trialDaysLeft = trialEnd
    ? Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const STATUS_STYLES: Record<string, string> = {
    active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    canceled: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    past_due: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] shadow-sm">
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${tier.color}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm text-[rgb(var(--foreground-muted))]">Current Plan</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-[rgb(var(--foreground))]">
                {tier.name}
              </h2>
              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[subscription.status]}`}>
                {subscription.status.replace('_', ' ')}
              </span>
              {tier.badge && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white bg-gradient-to-r ${tier.color}`}>
                  {tier.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">
              {tier.description}
            </p>
          </div>

          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.color} shadow-lg`}>
            <Crown className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-[rgb(var(--background-secondary))]/60 p-3">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">Billing Cycle</p>
            <p className="mt-1 font-semibold capitalize text-[rgb(var(--foreground))]">
              {subscription.billingCycle}
            </p>
          </div>

          <div className="rounded-xl bg-[rgb(var(--background-secondary))]/60 p-3">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">Next Renewal</p>
            <p className="mt-1 font-semibold text-[rgb(var(--foreground))]">
              {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="rounded-xl bg-[rgb(var(--background-secondary))]/60 p-3">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">Days Remaining</p>
            <p className={`mt-1 font-semibold ${daysLeft <= 5 ? 'text-amber-500' : 'text-[rgb(var(--foreground))]'}`}>
              {daysLeft} days
            </p>
          </div>

          <div className="rounded-xl bg-[rgb(var(--background-secondary))]/60 p-3">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">Price</p>
            <p className="mt-1 font-semibold text-[rgb(var(--foreground))]">
              {subscription.billingCycle === 'monthly'
                ? `₹${tier.monthlyPrice?.toLocaleString('en-IN')}/mo`
                : `₹${tier.yearlyPrice?.toLocaleString('en-IN')}/yr`
              }
            </p>
          </div>
        </div>

        {/* Trial banner */}
        {isTrialing && trialDaysLeft !== null && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <Clock className="h-5 w-5 shrink-0 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Free trial — {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                You won't be charged until your trial ends. Cancel anytime.
              </p>
            </div>
          </div>
        )}

        {/* Cancel notice */}
        {subscription.cancelAtPeriodEnd && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Plan cancellation scheduled
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                Your plan will end on {endDate.toLocaleDateString('en-IN')}. You can reactivate anytime before then.
              </p>
            </div>
            <button className="text-xs font-semibold text-amber-700 underline dark:text-amber-300">
              Reactivate
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-3">
          {tier.id !== 'pro_plus' && tier.id !== 'enterprise' && (
            <button
              onClick={() => openCheckout('pro_plus')}
              className="
                flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5
                text-sm font-bold text-white shadow-md shadow-indigo-500/20
                hover:opacity-90 transition-opacity
              "
            >
              <TrendingUp className="h-4 w-4" />
              Upgrade Plan
            </button>
          )}
          {!subscription.cancelAtPeriodEnd && tier.id !== 'free' && (
            <button className="
              flex items-center gap-2 rounded-xl border border-[rgb(var(--border))]
              bg-transparent px-5 py-2.5 text-sm font-medium text-[rgb(var(--foreground-muted))]
              hover:border-red-300 hover:text-red-500 transition-colors
            ">
              <RefreshCw className="h-4 w-4" />
              Change Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
