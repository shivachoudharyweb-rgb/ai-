'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { MOCK_USAGE } from '@/lib/mock-data';

// ============================================================
// useUsageLimits — Today's usage vs. tier limits
// ============================================================
export function useUsageLimits() {
  const setUsage = useSubscriptionStore((s) => s.setUsage);

  return useQuery({
    queryKey: ['usage-limits'],
    queryFn: async () => {
      // Partially wire to AI credits, keep others mock until their APIs exist
      const res = await fetch('/api/v1/usage/ai-credits');
      const aiData = res.ok ? await res.json() : null;
      
      const usageData = {
        ...MOCK_USAGE,
        ai: aiData ? { used: aiData.used, limit: aiData.limit } : MOCK_USAGE.ai
      };
      
      setUsage(usageData);
      return usageData;
    },
    staleTime: 60 * 1000, // 1 min — usage changes frequently
    refetchInterval: 2 * 60 * 1000, // auto-refresh every 2 min
  });
}

// ============================================================
// useAICredits — Quick credit check
// ============================================================
export function useAICredits() {
  return useQuery({
    queryKey: ['ai-credits'],
    queryFn: async () => {
      const res = await fetch('/api/v1/usage/ai-credits');
      if (!res.ok) throw new Error('Failed to fetch AI credits');
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}

// ============================================================
// useConsumeAICredit — Decrement AI credit before tool usage
// ============================================================
export function useConsumeAICredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v1/usage/ai-credits/consume', { method: 'POST' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to consume AI credit');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-credits'] });
      queryClient.invalidateQueries({ queryKey: ['usage-limits'] });
    },
  });
}
