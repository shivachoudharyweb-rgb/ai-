'use client';

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { AISupportChat } from '@/components/support/AISupportChat';
import { Mail, Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const subscription = useSubscriptionStore(s => s.subscription);
  
  // Check if they have a non-free active subscription
  const isPremium = subscription && subscription.tierId !== 'free' && subscription.status === 'active';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Customer Support</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Need help? Reach out to us via email or use our premium AI live support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Support Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Email Us</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            For general inquiries, billing issues, or feature requests, you can email us directly. We usually respond within 24 hours.
          </p>
          <a
            href="mailto:shivachoudhary.web@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            shivachoudhary.web@gmail.com
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* AI Support Card */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {isPremium ? (
            <AISupportChat />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Premium Live Support</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                Get instant answers to your questions and troubleshooting help with our dedicated AI support agent. Available for Pro and Starter users.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Upgrade to Unlock
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
