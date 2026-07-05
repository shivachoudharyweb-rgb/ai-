'use client';

import { useState } from 'react';
import { X, AlertTriangle, ChevronRight, ArrowDown } from 'lucide-react';
import { useCancelSubscription } from '@/hooks/useSubscription';
import { PRICING_TIERS } from '@/lib/pricing-data';

// ============================================================
// CancelModal — Multi-step cancellation flow
// Steps: 1. Warning  2. Reason  3. Offer downgrade  4. Confirm
// ============================================================

const CANCEL_REASONS = [
  'Too expensive for my budget',
  'Not using it enough',
  'Found a better alternative',
  'Missing a feature I need',
  'Technical issues / bugs',
  'Just testing, don\'t need it',
  'Prefer another payment option',
  'Other reason',
];

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  currentTierId: string;
}

export function CancelModal({ open, onClose, currentTierId }: CancelModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const cancel = useCancelSubscription();

  const currentTier = PRICING_TIERS.find((t) => t.id === currentTierId);
  const downgradeTier = PRICING_TIERS.find((t) => t.id === 'starter');

  function reset() {
    setStep(1);
    setReason('');
    setConfirmText('');
    onClose();
  }

  async function handleConfirm() {
    await cancel.mutateAsync(reason);
    setStep(4);
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={reset} />

      <div
        role="dialog"
        aria-modal="true"
        className="
          fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
          rounded-2xl bg-[rgb(var(--background-card))] shadow-2xl overflow-hidden
          animate-fade-in-up
        "
      >
        {/* Step indicator */}
        {step < 4 && (
          <div className="flex h-1 w-full bg-[rgb(var(--background-secondary))]">
            <div
              className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-6 py-4">
          <h2 className="font-bold text-[rgb(var(--foreground))]">
            {step === 1 && 'Cancel Subscription'}
            {step === 2 && 'Why are you leaving?'}
            {step === 3 && 'Wait — here\'s an offer'}
            {step === 4 && 'Cancellation Confirmed'}
          </h2>
          <button
            onClick={reset}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Warning */}
          {step === 1 && (
            <div>
              <div className="mb-5 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    You'll lose access to:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-600/80 dark:text-amber-400/80">
                    {currentTier?.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-amber-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mb-5 text-sm text-[rgb(var(--foreground-muted))]">
                Your plan will remain active until the end of your current billing period.
                You won't be charged again after cancellation.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                >
                  Continue with Cancellation
                </button>
                <button
                  onClick={reset}
                  className="w-full rounded-xl gradient-brand py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Keep My Plan
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Reason */}
          {step === 2 && (
            <div>
              <p className="mb-4 text-sm text-[rgb(var(--foreground-muted))]">
                Your feedback helps us improve. What's the main reason?
              </p>

              <div className="mb-5 grid grid-cols-1 gap-2">
                {CANCEL_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`
                      flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm
                      transition-all duration-150
                      ${reason === r
                        ? 'border-red-400 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-300'
                        : 'border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] hover:border-[rgb(var(--border-strong))]'
                      }
                    `}
                  >
                    {r}
                    {reason === r && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-[rgb(var(--border))] py-3 text-sm text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!reason}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Downgrade offer */}
          {step === 3 && (
            <div>
              <p className="mb-4 text-sm text-[rgb(var(--foreground-muted))]">
                Instead of canceling completely, would you like to switch to our{' '}
                <strong className="text-[rgb(var(--foreground))]">Starter Plan</strong> at just ₹199/month?
              </p>

              <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <ArrowDown className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                      Downgrade to Starter — ₹199/month
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      Keep OCR, ad-free experience, and 20 PDF tools/day
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-[rgb(var(--foreground))]">
                  To confirm cancellation, type <code className="rounded bg-[rgb(var(--background-secondary))] px-1.5 py-0.5 text-red-500">CANCEL</code>:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type CANCEL to confirm"
                  className="
                    w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))]
                    px-4 py-3 text-sm outline-none transition-colors
                    focus:border-red-400 focus:ring-2 focus:ring-red-200
                    dark:focus:ring-red-900/50
                    placeholder:text-[rgb(var(--foreground-subtle))]
                    text-[rgb(var(--foreground))]
                  "
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={confirmText !== 'CANCEL' || cancel.isPending}
                  className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                >
                  {cancel.isPending ? 'Canceling...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={reset}
                  className="w-full rounded-xl gradient-brand py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Keep My {currentTier?.name} Plan
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="text-3xl">😔</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-[rgb(var(--foreground))]">
                Your plan has been canceled
              </h3>
              <p className="mb-6 text-sm text-[rgb(var(--foreground-muted))]">
                You'll have access to your current plan until the end of the billing period.
                We hope to see you again!
              </p>
              <button
                onClick={reset}
                className="rounded-xl border border-[rgb(var(--border))] px-6 py-2.5 text-sm font-medium text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
