// ============================================================
// Mock Data — Simulates real API responses
// TODO: Replace each mock with real API calls from:
//   GET /api/v1/subscriptions/me
//   GET /api/v1/usage/limits
//   GET /api/v1/payments/history
// ============================================================

import type { TierId, BillingCycle } from './pricing-data';

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
}

export interface MockSubscription {
  id: string;
  userId: string;
  tierId: TierId;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  razorpaySubscriptionId: string | null;
  stripeSubscriptionId: string | null;
}

export interface MockUsage {
  userId: string;
  date: string;
  pdf: { used: number; limit: number | null };
  image: { used: number; limit: number | null };
  ai: { used: number; limit: number | null };
  storage: { usedMb: number; limitMb: number | null };
}

export interface MockPayment {
  id: string;
  tierId: TierId;
  tierName: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  createdAt: string;
  invoiceUrl: string | null;
}

// Current logged-in user
export const MOCK_USER: MockUser = {
  id: 'usr_demo_001',
  email: 'rahul.sharma@example.com',
  fullName: 'Rahul Sharma',
  avatarUrl: null,
  role: 'user',
};

// Active subscription
export const MOCK_SUBSCRIPTION: MockSubscription = {
  id: 'sub_demo_001',
  userId: 'usr_demo_001',
  tierId: 'pro',
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodStart: '2026-07-01T00:00:00Z',
  currentPeriodEnd: '2026-08-01T00:00:00Z',
  cancelAtPeriodEnd: false,
  trialEnd: null,
  razorpaySubscriptionId: 'sub_Razorpay_test_001',
  stripeSubscriptionId: null,
};

// Today's usage
export const MOCK_USAGE: MockUsage = {
  userId: 'usr_demo_001',
  date: new Date().toISOString().split('T')[0],
  pdf: { used: 23, limit: 100 },
  image: { used: 67, limit: 200 },
  ai: { used: 41, limit: 80 },
  storage: { usedMb: 3420, limitMb: 10240 },
};

// Payment history
export const MOCK_PAYMENTS: MockPayment[] = [
  {
    id: 'pay_001',
    tierId: 'pro',
    tierName: 'Pro',
    amount: 499,
    currency: 'INR',
    billingCycle: 'monthly',
    status: 'success',
    createdAt: '2026-07-01T10:23:00Z',
    invoiceUrl: '#',
  },
  {
    id: 'pay_002',
    tierId: 'pro',
    tierName: 'Pro',
    amount: 499,
    currency: 'INR',
    billingCycle: 'monthly',
    status: 'success',
    createdAt: '2026-06-01T09:15:00Z',
    invoiceUrl: '#',
  },
  {
    id: 'pay_003',
    tierId: 'starter',
    tierName: 'Starter',
    amount: 199,
    currency: 'INR',
    billingCycle: 'monthly',
    status: 'success',
    createdAt: '2026-05-01T11:02:00Z',
    invoiceUrl: '#',
  },
  {
    id: 'pay_004',
    tierId: 'starter',
    tierName: 'Starter',
    amount: 199,
    currency: 'INR',
    billingCycle: 'monthly',
    status: 'failed',
    createdAt: '2026-04-01T08:45:00Z',
    invoiceUrl: null,
  },
];
