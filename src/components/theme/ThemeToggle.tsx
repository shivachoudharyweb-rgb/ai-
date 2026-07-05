'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

// ============================================================
// ThemeToggle — Animated Sun/Moon/System switcher
// Supports: light | dark | system modes
// ============================================================

type Mode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  /** 'icon' = single button cycles through modes (default for header)
   *  'dropdown' = shows all three options  */
  variant?: 'icon' | 'dropdown';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl skeleton ${className}`}
        aria-hidden="true"
      />
    );
  }

  const modes: { id: Mode; icon: typeof Sun; label: string }[] = [
    { id: 'light',  icon: Sun,     label: 'Light'  },
    { id: 'dark',   icon: Moon,    label: 'Dark'   },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  if (variant === 'icon') {
    const cycle: Mode[] = ['light', 'dark', 'system'];
    const currentIdx = cycle.indexOf((theme as Mode) ?? 'system');
    const next = cycle[(currentIdx + 1) % cycle.length];
    const Icon = modes.find((m) => m.id === theme)?.icon ?? Monitor;

    return (
      <button
        onClick={() => setTheme(next)}
        className={`
          relative inline-flex h-9 w-9 items-center justify-center rounded-xl
          border border-[rgb(var(--border))] bg-[rgb(var(--background-card))]
          text-[rgb(var(--foreground-muted))] transition-all duration-200
          hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50
          dark:hover:border-indigo-700 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/40
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          ${className}
        `}
        title={`Switch to ${next} mode`}
        aria-label={`Switch to ${next} mode`}
      >
        <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
          {/* Sun */}
          <Sun
            className={`absolute h-4 w-4 transition-all duration-300 ${
              resolvedTheme === 'light'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-50'
            }`}
          />
          {/* Moon */}
          <Moon
            className={`absolute h-4 w-4 transition-all duration-300 ${
              resolvedTheme === 'dark'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </span>
      </button>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="
          inline-flex h-9 items-center gap-2 rounded-xl px-3
          border border-[rgb(var(--border))] bg-[rgb(var(--background-card))]
          text-sm font-medium text-[rgb(var(--foreground-muted))]
          hover:border-indigo-300 hover:text-indigo-500
          dark:hover:border-indigo-700 dark:hover:text-indigo-400
          transition-all duration-200
        "
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="h-4 w-4" />}
        {theme === 'dark' && <Moon className="h-4 w-4" />}
        {theme === 'system' && <Monitor className="h-4 w-4" />}
        <span className="capitalize">{theme}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="
            absolute right-0 top-11 z-20 min-w-[130px] overflow-hidden rounded-xl
            border border-[rgb(var(--border))] bg-[rgb(var(--background-card))]
            shadow-xl shadow-black/10 dark:shadow-black/40
            animate-fade-in-up
          ">
            {modes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setTheme(id); setOpen(false); }}
                className={`
                  flex w-full items-center gap-3 px-4 py-2.5 text-sm
                  transition-colors duration-150
                  ${theme === id
                    ? 'bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))]'
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {theme === id && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
