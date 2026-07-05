'use client';

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { ShieldAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

// ============================================================
// LimitReachedModal — Shown when daily limits are hit
// ============================================================

export function LimitReachedModal() {
  const { limitReachedModal, closeLimitModal } = useSubscriptionStore();
  const { isOpen, feature } = limitReachedModal;

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={closeLimitModal}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-6 shadow-xl">
          <button 
            onClick={closeLimitModal}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-[rgb(var(--foreground))]">
            Daily Limit Reached
          </h3>
          <p className="mb-6 text-sm text-[rgb(var(--foreground-muted))]">
            You've reached your daily usage limit for <strong>{feature}</strong>. Upgrade to a premium plan to get higher limits and unlock exclusive features like Chat with PDF, OCR, and Priority Processing.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link 
              href="/pricing"
              onClick={closeLimitModal}
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              View Pricing
            </Link>
            <button
              onClick={closeLimitModal}
              className="flex-1 rounded-xl border border-[rgb(var(--border))] bg-transparent px-4 py-2.5 text-sm font-medium text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
