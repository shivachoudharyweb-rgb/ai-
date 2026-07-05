'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { PRICING_TIERS } from '@/lib/pricing-data';

function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="pointer-events-none absolute h-2 w-2 rounded-full" style={style} />;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

export function PaymentSuccess() {
  const { paymentSuccess, setPaymentSuccess, subscription } = useSubscriptionStore();
  const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  const tier = PRICING_TIERS.find((t) => t.id === (subscription?.tierId ?? 'pro'));

  useEffect(() => {
    if (!paymentSuccess) return;
    const generated = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 40}%`,
        backgroundColor: COLORS[i % COLORS.length],
        transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
        opacity: Math.random() * 0.8 + 0.2,
        animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
        animationDelay: `${Math.random() * 0.8}s`,
      } as React.CSSProperties,
    }));
    setParticles(generated);
    const t = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(t);
  }, [paymentSuccess]);

  if (!paymentSuccess) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {particles.map((p) => <Particle key={p.id} style={p.style} />)}
        </div>

        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-[rgb(var(--background-card))] shadow-2xl animate-fade-in-up">
          <div className={`h-2 w-full bg-gradient-to-r ${tier?.color ?? 'from-indigo-500 to-purple-600'}`} />

          <div className="p-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>

            <div className="mb-1 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h2 className="text-2xl font-extrabold text-[rgb(var(--foreground))]">
                Payment Successful!
              </h2>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>

            <p className="mb-6 text-[rgb(var(--foreground-muted))]">
              Welcome to{' '}
              <span className="font-bold text-[rgb(var(--foreground))]">{tier?.name} Plan</span>!
              Your features are now unlocked.
            </p>

            <div className="mb-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">
                What you just unlocked
              </p>
              <div className="space-y-2">
                {tier?.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-[rgb(var(--foreground))]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setPaymentSuccess(false);
                  window.location.href = '/billing';
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-opacity"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setPaymentSuccess(false)}
                className="text-sm text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))] transition-colors"
              >
                Stay on this page
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
