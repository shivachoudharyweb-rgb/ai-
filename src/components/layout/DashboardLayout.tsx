'use client';

import { ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { LimitReachedModal } from '../billing/LimitReachedModal';
import { FloatingAIChat } from '../chat/FloatingAIChat';
import { AuthModal } from '../auth/AuthModal';
import { ProfileSettingsModal } from '../profile/ProfileSettingsModal';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[rgb(var(--background))] md:flex-row">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        )}
      >
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <LimitReachedModal />
      <FloatingAIChat />
      <AuthModal />
      <ProfileSettingsModal />
    </div>
  );
}
