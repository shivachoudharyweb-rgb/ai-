import type { Metadata } from 'next';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingGrid } from '@/components/pricing/PricingGrid';
import { FeatureComparisonTable } from '@/components/pricing/FeatureComparisonTable';
import { FAQSection } from '@/components/pricing/FAQSection';
import { EnterpriseCTA } from '@/components/pricing/EnterpriseCTA';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { PaymentSuccess } from '@/components/checkout/PaymentSuccess';
import { AppHeader } from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the perfect AI Office Suite plan. Free forever, or unlock unlimited PDF, Image, and AI tools from ₹199/month.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <AppHeader />

      <main>
        <PricingHero />
        <PricingGrid />
        <FeatureComparisonTable />
        <FAQSection />
        <EnterpriseCTA />
      </main>

      {/* Global modals (rendered at root so they overlay everything) */}
      <CheckoutModal />
      <PaymentSuccess />
    </div>
  );
}
