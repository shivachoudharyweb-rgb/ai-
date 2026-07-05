'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { MOCK_PAYMENTS } from '@/lib/mock-data';

// ============================================================
// useSubscription — Fetch active subscription
// ============================================================
export function useSubscription() {
  const setSubscription = useSubscriptionStore((s) => s.setSubscription);

  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await fetch('/api/v1/subscriptions/me');
      if (!res.ok) throw new Error('Failed to fetch subscription');
      const data = await res.json();
      setSubscription(data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

// ============================================================
// useCancelSubscription — Cancel at period end
// ============================================================
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reason: string) => {
      // In a real app, you would call PATCH /api/v1/subscriptions/cancel
      console.log('Cancel reason:', reason);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

// ============================================================
// useUpgradeSubscription — Upgrade tier
// ============================================================
export function useUpgradeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tierId,
      billingCycle,
      currency,
    }: {
      tierId: string;
      billingCycle: string;
      currency: string;
    }) => {
      const res = await fetch('/api/v1/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, billingCycle, currency })
      });
      if (!res.ok) throw new Error('Failed to create checkout');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

// ============================================================
// usePaymentHistory — Fetch payment history list
// ============================================================
export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      // Still using mock until history API is built
      return MOCK_PAYMENTS;
    },
    staleTime: 10 * 60 * 1000,
  });
}
