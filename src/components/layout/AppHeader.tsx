'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, CreditCard, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// ============================================================
// AppHeader — Top navigation with theme toggle
// ============================================================

const NAV_LINKS = [
  { href: '/',        label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/pricing', label: 'Pricing',    icon: Zap },
  { href: '/billing', label: 'Billing',    icon: CreditCard },
];

export function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--background-header))] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-brand shadow-md shadow-indigo-500/30">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold leading-none text-[rgb(var(--foreground))]">
              AI Office Suite
            </p>
            <p className="text-[10px] text-[rgb(var(--foreground-muted))]">
              One AI for Every Document
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                    : 'text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] hover:text-[rgb(var(--foreground))]'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle (dropdown on desktop, icon on mobile) */}
          <div className="hidden md:block">
            <ThemeToggle variant="dropdown" />
          </div>
          <div className="block md:hidden">
            <ThemeToggle variant="icon" />
          </div>

          {/* Upgrade button (desktop) */}
          <Link
            href="/pricing"
            className="
              hidden md:inline-flex items-center gap-2 rounded-xl
              gradient-brand px-4 py-2 text-sm font-bold text-white
              shadow-md shadow-indigo-500/20 hover:opacity-90 transition-opacity
            "
          >
            <Zap className="h-4 w-4" />
            Upgrade Pro
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] transition-colors md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 py-3 md:hidden animate-fade-in-up">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                transition-colors
                ${pathname === href
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                  : 'text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))]'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
