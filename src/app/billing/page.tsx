'use client';

import { useState } from 'react';
import { Settings, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard';
import { UsageMetrics } from '@/components/billing/UsageMetrics';
import { PaymentHistoryTable } from '@/components/billing/PaymentHistoryTable';
import { CancelModal } from '@/components/billing/CancelModal';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { PaymentSuccess } from '@/components/checkout/PaymentSuccess';
import { useSubscription } from '@/hooks/useSubscription';

export default function BillingPage() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: subscription } = useSubscription();

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[rgb(var(--foreground))]">
              Billing & Subscription
            </h1>
            <p className="mt-1 text-[rgb(var(--foreground-muted))]">
              Manage your plan, track usage, and view payment history
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="
                hidden sm:inline-flex items-center gap-2 rounded-xl
                border border-indigo-200 bg-indigo-50 px-4 py-2.5
                text-sm font-semibold text-indigo-600
                hover:bg-indigo-100 transition-colors
                dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300
              "
            >
              View All Plans
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            {subscription && subscription.tierId !== 'free' && !subscription.cancelAtPeriodEnd && (
              <button
                onClick={() => setCancelOpen(true)}
                className="
                  inline-flex items-center gap-2 rounded-xl
                  border border-[rgb(var(--border))]
                  px-4 py-2.5 text-sm font-medium text-[rgb(var(--foreground-muted))]
                  hover:border-red-300 hover:text-red-500 transition-colors
                "
              >
                <Settings className="h-4 w-4" />
                Cancel Plan
              </button>
            )}
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current plan — 2/3 width */}
          <div className="lg:col-span-2">
            <CurrentPlanCard />
          </div>

          {/* Quick links — 1/3 width */}
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-[rgb(var(--foreground))]">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Compare Plans', href: '/pricing' },
                { label: 'Download Invoices', href: '#history' },
                { label: 'Contact Support', href: 'mailto:support@aiofficeSuite.com' },
                { label: 'API Documentation', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="
                    flex items-center justify-between rounded-xl px-4 py-3 text-sm
                    text-[rgb(var(--foreground-muted))]
                    hover:bg-[rgb(var(--background-secondary))] hover:text-[rgb(var(--foreground))]
                    transition-colors
                  "
                >
                  {label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Usage metrics */}
        <div className="mt-6">
          <UsageMetrics />
        </div>

        {/* Payment history */}
        <div className="mt-6" id="history">
          <PaymentHistoryTable />
        </div>

        {/* Footnote */}
        <p className="mt-8 text-center text-xs text-[rgb(var(--foreground-subtle))]">
          Payments processed securely via Razorpay & Stripe · GST-compliant invoices ·{' '}
          <a href="#" className="underline hover:text-[rgb(var(--foreground-muted))] transition-colors">
            Refund Policy
          </a>{' '}
          ·{' '}
          <a href="#" className="underline hover:text-[rgb(var(--foreground-muted))] transition-colors">
            Terms of Service
          </a>
        </p>
      </main>

      {/* Modals */}
      <CancelModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        currentTierId={subscription?.tierId ?? 'pro'}
      />
      <CheckoutModal />
      <PaymentSuccess />
    </div>
  );
}
