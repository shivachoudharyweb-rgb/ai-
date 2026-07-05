'use client';

import { Search, Crown, Moon, Globe, Menu, LogOut, Settings, UserCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, profile, isLoading, setAuthModalOpen, setProfileModalOpen, signOut } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = profile?.first_name 
    ? profile.first_name 
    : user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--background-header))] px-4 shadow-sm backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>

        {/* Search Bar */}
        <div className="hidden max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900 md:flex md:w-96">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools here..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          <kbd className="hidden rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400 lg:inline-block">
            Ctrl+/
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Upgrade Button */}
        <Link
          href="/pricing"
          className="hidden items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:opacity-90 sm:flex"
        >
          <Crown className="h-4 w-4" />
          Upgrade Pro
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle variant="icon" />

        {/* Language Selector */}
        <button className="hidden items-center gap-1 rounded-xl border border-gray-200 p-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 md:flex">
          <Globe className="h-4 w-4" />
          EN
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>

        {/* User Profile / Auth */}
        {!isLoading && (
          user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    displayName[0].toUpperCase()
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-none text-gray-700 dark:text-gray-200">
                    Hi, {displayName}
                  </p>
                  <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">Free</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] py-1 shadow-lg">
                  <div className="px-4 py-2 border-b border-[rgb(var(--border))]">
                    <p className="text-sm font-semibold truncate text-[rgb(var(--foreground))]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background-secondary))]"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )
        )}
      </div>
    </header>
  );
}
