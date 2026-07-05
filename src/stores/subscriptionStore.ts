'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRICING_TIERS, type TierId, type BillingCycle } from '@/lib/pricing-data';
import type { MockSubscription, MockUsage } from '@/lib/mock-data';

// ============================================================
// Subscription Store — Global subscription & billing state
// ============================================================

interface SubscriptionState {
  // Pricing page state
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;

  // User's active subscription
  subscription: MockSubscription | null;
  setSubscription: (sub: MockSubscription | null) => void;

  // Current usage
  usage: MockUsage | null;
  setUsage: (usage: MockUsage | null) => void;
  incrementUsage: (type: 'pdf' | 'image' | 'ai') => void;
  checkLimit: (type: 'pdf' | 'image' | 'ai') => boolean;
  resetUsageIfNewDay: () => void;

  // Limit Reached Modal
  limitReachedModal: { isOpen: boolean; feature: string };
  openLimitModal: (feature: string) => void;
  closeLimitModal: () => void;

  // Checkout state
  checkoutTierId: TierId | null;
  checkoutOpen: boolean;
  openCheckout: (tierId: TierId) => void;
  closeCheckout: () => void;

  // Payment success
  paymentSuccess: boolean;
  setPaymentSuccess: (success: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      billingCycle: 'monthly',
      setBillingCycle: (cycle) => set({ billingCycle: cycle }),

      subscription: {
        id: 'mock-free',
        userId: 'demo',
        tierId: 'free',
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        cancelAtPeriodEnd: false,
        trialEnd: null,
        razorpaySubscriptionId: null,
        stripeSubscriptionId: null,
      },
      setSubscription: (sub) => set({ subscription: sub }),

      usage: null,
      setUsage: (usage) => set({ usage }),

      incrementUsage: (type) => {
        const { usage } = get();
        if (!usage) return;
        set({
          usage: {
            ...usage,
            [type]: {
              ...usage[type],
              used: usage[type].used + 1,
            },
          },
        });
      },

      checkLimit: (type) => {
        const { usage, openLimitModal, resetUsageIfNewDay } = get();
        resetUsageIfNewDay();
        
        const currentUsage = get().usage;
        if (!currentUsage) return true;

        const limit = currentUsage[type].limit;
        if (limit !== null && currentUsage[type].used >= limit) {
          openLimitModal(type === 'pdf' ? 'PDF Tools' : type === 'image' ? 'Image Tools' : 'AI Requests');
          return false; // Limit reached
        }
        return true; // OK to proceed
      },

      resetUsageIfNewDay: () => {
        const { usage, subscription } = get();
        const today = new Date().toISOString().split('T')[0];
        const tierId = subscription?.tierId || 'free';
        const tier = PRICING_TIERS.find(t => t.id === tierId) || PRICING_TIERS[0];
          
        if (!usage) {
          set({
            usage: {
              userId: 'mock-user',
              date: today,
              pdf: { used: 0, limit: tier.limits.pdfDaily },
              image: { used: 0, limit: tier.limits.imageDaily },
              ai: { used: 0, limit: tier.limits.aiDaily },
              storage: { usedMb: 0, limitMb: tier.limits.storageMb }
            }
          });
          return;
        }

        if (usage.date !== today) {
          // It's a new day, reset usage but keep the limits based on current tier
          set({
            usage: {
              ...usage,
              date: today,
              pdf: { used: 0, limit: tier.limits.pdfDaily },
              image: { used: 0, limit: tier.limits.imageDaily },
              ai: { used: 0, limit: tier.limits.aiDaily },
            }
          });
        }
      },

      limitReachedModal: { isOpen: false, feature: '' },
      openLimitModal: (feature) => set({ limitReachedModal: { isOpen: true, feature } }),
      closeLimitModal: () => set({ limitReachedModal: { isOpen: false, feature: '' } }),

      checkoutTierId: null,
      checkoutOpen: false,
      openCheckout: (tierId) => {
        set({ checkoutTierId: tierId, checkoutOpen: true });
        get().closeLimitModal(); // Close limit modal if opening checkout
      },
      closeCheckout: () => set({ checkoutOpen: false, checkoutTierId: null }),

      paymentSuccess: false,
      setPaymentSuccess: (success) => set({ paymentSuccess: success }),
    }),
    {
      name: 'ai-office-subscription-v2',
      partialize: (state) => ({ 
        billingCycle: state.billingCycle,
        usage: state.usage,
        subscription: state.subscription 
      }) as any,
    }
  )
);

