'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, Shield, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { PRICING_TIERS, formatLimit } from '@/lib/pricing-data';
import { useUpgradeSubscription } from '@/hooks/useSubscription';

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  modal?: { ondismiss?: () => void };
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof CreditCard; subtext: string }[] = [
  { id: 'card',       label: 'Card',        icon: CreditCard,  subtext: 'Visa, Mastercard, Amex' },
  { id: 'upi',        label: 'UPI',         icon: Smartphone,  subtext: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', label: 'Net Banking',  icon: Building,    subtext: 'All major banks' },
  { id: 'wallet',     label: 'Wallet',      icon: Wallet,      subtext: 'Paytm, Mobikwik, Freecharge' },
];

// Load Razorpay script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function CheckoutModal() {
  const { checkoutOpen, checkoutTierId, billingCycle, closeCheckout, setPaymentSuccess } =
    useSubscriptionStore();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upgrade = useUpgradeSubscription();

  const tier = PRICING_TIERS.find((t) => t.id === checkoutTierId);

  const price =
    billingCycle === 'monthly' ? tier?.monthlyPrice : tier?.yearlyPrice;

  // Trap focus & close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCheckout(); };
    if (checkoutOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [checkoutOpen, closeCheckout]);

  if (!checkoutOpen || !tier || price === null || price === undefined) return null;

  async function handlePay() {
    if (!tier || price == null) return;
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const orderData = await upgrade.mutateAsync({
        tierId: tier.id,
        billingCycle,
        currency: 'INR', // You might want to make this dynamic based on user location
      });

      if (orderData.provider === 'stripe') {
        // Redirect to Stripe Checkout
        window.location.href = orderData.url;
        return;
      }

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Payment gateway could not be loaded. Please check your connection.');
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,        // paise
        currency: orderData.currency,
        name: 'AI Office Suite',
        description: `${tier.name} Plan — ${billingCycle}`,
        order_id: orderData.orderId,
        handler(response) {
          // Verification happens via webhook in the backend
          console.log('Payment success:', response);
          closeCheckout();
          setPaymentSuccess(true);
        },
        prefill: {
          name: 'Rahul Sharma', // In real app, fetch from auth
          email: 'rahul@example.com',
          contact: '9000000000',
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        onClick={closeCheckout}
        style={{ animationDuration: '150ms' }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="
          fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2
          rounded-2xl bg-[rgb(var(--background-card))] shadow-2xl shadow-black/30
          animate-fade-in-up
        "
        style={{ animationDuration: '200ms' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[rgb(var(--foreground))]">Secure Checkout</h2>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">
                SSL encrypted · Powered by Razorpay
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-5">
          {/* Left: Order summary */}
          <div className="col-span-2 border-r border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]/50 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">
              Order Summary
            </h3>

            <div className={`mb-4 rounded-xl bg-gradient-to-br ${tier.color} p-4 text-white shadow-lg`}>
              <p className="text-xs font-semibold opacity-80">{tier.name} Plan</p>
              <p className="mt-1 text-3xl font-black">
                ₹{price.toLocaleString('en-IN')}
              </p>
              <p className="text-xs opacity-70">
                {billingCycle === 'yearly' ? 'per year (billed annually)' : 'per month'}
              </p>
            </div>

            <div className="space-y-2.5">
              {tier.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-xs text-[rgb(var(--foreground-muted))]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {h}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              🎁 Includes 7-day free trial. Cancel anytime.
            </div>
          </div>

          {/* Right: Payment */}
          <div className="col-span-3 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">
              Payment Method
            </h3>

            {/* Method tabs */}
            <div className="mb-5 grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`
                    flex flex-col items-center gap-1.5 rounded-xl border p-3
                    text-xs font-medium transition-all duration-150
                    ${method === id
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] hover:border-[rgb(var(--border-strong))]'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Method description */}
            <p className="mb-5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]/50 px-4 py-3 text-xs text-[rgb(var(--foreground-muted))]">
              {PAYMENT_METHODS.find((m) => m.id === method)?.subtext} — Your payment will be processed by the Razorpay secure checkout window.
            </p>

            {/* Test mode notice */}
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Test Mode:</strong> Use card <code className="font-mono">5267 3181 8797 5449</code>, any future expiry, any CVV, any OTP.
              </span>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="
                flex w-full items-center justify-center gap-3 rounded-xl
                gradient-brand py-4 text-base font-bold text-white
                shadow-lg shadow-indigo-500/30
                hover:opacity-95 hover:shadow-indigo-500/50
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 active:scale-[0.99]
              "
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening Payment Gateway...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Pay ₹{price.toLocaleString('en-IN')} Securely
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-[rgb(var(--foreground-subtle))]">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
