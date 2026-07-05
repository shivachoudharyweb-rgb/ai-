// ============================================================
// Pricing Data — Source of truth for all subscription tiers
// Mirrors Supabase `subscription_tiers` and `tier_limits` tables
// TODO: Wire to real API → GET /api/v1/subscriptions/tiers
// ============================================================

export type TierId = 'free' | 'starter' | 'pro' | 'pro_plus' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface TierLimit {
  pdfDaily: number | null;       // null = unlimited
  imageDaily: number | null;
  aiDaily: number | null;
  storageMb: number | null;
  maxFileSizeMb: number;
  batchLimit: number | null;
  ocr: boolean;
  chatWithPdf: boolean;
  backgroundRemover: boolean;
  apiAccess: number | null;      // requests/day, null = unlimited, 0 = disabled
  teamMembers: number | null;
  customWatermarks: boolean;
  priorityQueue: boolean;
  supportLevel: 1 | 2 | 3 | 4;  // 1=community, 2=email, 3=live chat, 4=dedicated
  ads: boolean;
  analyticsLevel: 1 | 2 | 3;    // 1=basic, 2=advanced, 3=full+export
}

export interface PricingTier {
  id: TierId;
  name: string;
  monthlyPrice: number | null;   // null = custom/contact
  yearlyPrice: number | null;
  badge: string | null;
  description: string;
  isPopular: boolean;
  isBestValue: boolean;
  color: string;                 // Tailwind gradient class
  accentColor: string;           // For borders/glows
  cta: string;
  ctaVariant: 'outline' | 'primary' | 'gradient' | 'dark';
  limits: TierLimit;
  highlights: string[];          // 3-4 key selling points shown on card
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    description: 'Perfect for trying out AI Office Suite',
    isPopular: false,
    isBestValue: false,
    color: 'from-slate-400 to-slate-600',
    accentColor: '#64748B',
    cta: 'Get Started Free',
    ctaVariant: 'outline',
    highlights: [
      '4 PDF tools/day',
      '4 Image tools/day',
      '2 AI requests/day',
      '100 MB storage',
    ],
    limits: {
      pdfDaily: 4,
      imageDaily: 4,
      aiDaily: 2,
      storageMb: 100,
      maxFileSizeMb: 10,
      batchLimit: 1,
      ocr: false,
      chatWithPdf: false,
      backgroundRemover: false,
      apiAccess: 0,
      teamMembers: 1,
      customWatermarks: false,
      priorityQueue: false,
      supportLevel: 1,
      ads: true,
      analyticsLevel: 1,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    badge: 'Most Affordable',
    description: 'For individuals getting started',
    isPopular: false,
    isBestValue: false,
    color: 'from-blue-500 to-cyan-500',
    accentColor: '#3B82F6',
    cta: 'Start Free Trial',
    ctaVariant: 'primary',
    highlights: [
      '7 PDF tools/day',
      '7 Image tools/day',
      '15 AI requests/day',
      '150 MB storage',
    ],
    limits: {
      pdfDaily: 7,
      imageDaily: 7,
      aiDaily: 15,
      storageMb: 150,
      maxFileSizeMb: 20,
      batchLimit: 3,
      ocr: true,
      chatWithPdf: false,
      backgroundRemover: false,
      apiAccess: 0,
      teamMembers: 1,
      customWatermarks: false,
      priorityQueue: false,
      supportLevel: 2,
      ads: false,
      analyticsLevel: 1,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    badge: 'Recommendation',
    description: 'For power users & professionals',
    isPopular: true,
    isBestValue: false,
    color: 'from-indigo-500 to-purple-600',
    accentColor: '#6366F1',
    cta: 'Start Free Trial',
    ctaVariant: 'gradient',
    highlights: [
      '50 PDF tools/day',
      '25 Image tools/day',
      '60 AI requests/day',
      'Chat with PDF, OCR, AI Summary',
    ],
    limits: {
      pdfDaily: 50,
      imageDaily: 25,
      aiDaily: 60,
      storageMb: 10240,
      maxFileSizeMb: 50,
      batchLimit: 15,
      ocr: true,
      chatWithPdf: true,
      backgroundRemover: true,
      apiAccess: 100,
      teamMembers: 1,
      customWatermarks: true,
      priorityQueue: true,
      supportLevel: 3,
      ads: false,
      analyticsLevel: 2,
    },
  },
  {
    id: 'pro_plus',
    name: 'Pro Plus',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    badge: 'Best Value',
    description: 'For teams & businesses',
    isPopular: false,
    isBestValue: true,
    color: 'from-purple-600 to-pink-500',
    accentColor: '#8B5CF6',
    cta: 'Start Free Trial',
    ctaVariant: 'gradient',
    highlights: [
      'Unlimited PDF & Image tools',
      'Unlimited AI requests',
      '50 GB storage + Team members',
      'API Access',
    ],
    limits: {
      pdfDaily: null,
      imageDaily: null,
      aiDaily: null,
      storageMb: 51200,
      maxFileSizeMb: 100,
      batchLimit: 100,
      ocr: true,
      chatWithPdf: true,
      backgroundRemover: true,
      apiAccess: null,
      teamMembers: 5,
      customWatermarks: true,
      priorityQueue: true,
      supportLevel: 4,
      ads: false,
      analyticsLevel: 3,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    badge: null,
    description: 'Custom solutions for organizations',
    isPopular: false,
    isBestValue: false,
    color: 'from-slate-700 to-slate-900',
    accentColor: '#334155',
    cta: 'Contact Sales',
    ctaVariant: 'dark',
    highlights: [
      'Unlimited usage',
      'Dedicated infrastructure',
      'Custom integrations',
      'SLA support',
    ],
    limits: {
      pdfDaily: null,
      imageDaily: null,
      aiDaily: null,
      storageMb: null,
      maxFileSizeMb: 500,
      batchLimit: null,
      ocr: true,
      chatWithPdf: true,
      backgroundRemover: true,
      apiAccess: null,
      teamMembers: null,
      customWatermarks: true,
      priorityQueue: true,
      supportLevel: 4,
      ads: false,
      analyticsLevel: 3,
    },
  },
];

export const SUPPORT_LABELS: Record<number, string> = {
  1: 'Community',
  2: 'Priority Email',
  3: 'Live Chat',
  4: 'Dedicated Manager',
};

export const ANALYTICS_LABELS: Record<number, string> = {
  1: 'Basic',
  2: 'Advanced',
  3: 'Full + Export',
};

export function formatStorage(mb: number | null): string {
  if (mb === null) return 'Unlimited';
  if (mb >= 1024) return `${mb / 1024} GB`;
  return `${mb} MB`;
}

export function formatLimit(val: number | null, suffix = '/day'): string {
  if (val === null) return 'Unlimited';
  if (val === 0) return '—';
  return `${val}${suffix}`;
}

export function getYearlySavings(tier: PricingTier): number {
  if (!tier.monthlyPrice || !tier.yearlyPrice) return 0;
  return tier.monthlyPrice * 12 - tier.yearlyPrice;
}

export function getSavingsPercent(tier: PricingTier): number {
  if (!tier.monthlyPrice || !tier.yearlyPrice || tier.monthlyPrice === 0) return 0;
  return Math.round((1 - tier.yearlyPrice / (tier.monthlyPrice * 12)) * 100);
}

// Feature rows for comparison table
export const COMPARISON_FEATURES = [
  { key: 'pdfDaily',          label: 'PDF Tools / Day',         category: 'Usage' },
  { key: 'imageDaily',        label: 'Image Tools / Day',       category: 'Usage' },
  { key: 'aiDaily',           label: 'AI Requests / Day',       category: 'Usage' },
  { key: 'storageMb',         label: 'Storage',                 category: 'Storage' },
  { key: 'maxFileSizeMb',     label: 'Max File Size',           category: 'Storage' },
  { key: 'batchLimit',        label: 'Batch Processing',        category: 'Usage' },
  { key: 'ocr',               label: 'OCR (Text Extraction)',   category: 'AI Features' },
  { key: 'chatWithPdf',       label: 'Chat with PDF',           category: 'AI Features' },
  { key: 'backgroundRemover', label: 'Background Remover',      category: 'AI Features' },
  { key: 'apiAccess',         label: 'API Access',              category: 'Developer' },
  { key: 'teamMembers',       label: 'Team Members',            category: 'Collaboration' },
  { key: 'customWatermarks',  label: 'Custom Watermarks',       category: 'Customization' },
  { key: 'priorityQueue',     label: 'Priority Processing',     category: 'Performance' },
  { key: 'supportLevel',      label: 'Support Level',           category: 'Support' },
  { key: 'ads',               label: 'Ad-Free Experience',      category: 'Experience' },
  { key: 'analyticsLevel',    label: 'Analytics',               category: 'Insights' },
] as const;
