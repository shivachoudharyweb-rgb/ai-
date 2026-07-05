'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import {
  Home,
  FileText,
  Image as ImageIcon,
  Brain,
  Folder,
  Clock,
  Star,
  Layers,
  Tag,
  HelpCircle,
  Mail,
  Code,
  Zap,
  ChevronLeft,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const NAV_SECTIONS = [
  {
    title: 'Tools',
    items: [
      { href: '/', label: 'Home', icon: Home },
      { href: '/pdf-tools', label: 'PDF Tools', icon: FileText },
      { href: '/image-tools', label: 'Image Tools', icon: ImageIcon },
      { href: '/ai-tools', label: 'AI Tools', icon: Brain },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { href: '/my-files', label: 'My Files', icon: Folder },
      { href: '/recent-files', label: 'Recent Files', icon: Clock },
      { href: '/favorites', label: 'Favorites', icon: Star },
      { href: '/templates', label: 'Templates', icon: Layers, badge: 'New' },
    ],
  },
  {
    title: 'Support',
    items: [
      { href: '/pricing', label: 'Pricing', icon: Tag },
      { href: '/help', label: 'Help Center', icon: HelpCircle },
      { href: '/contact', label: 'Contact Us', icon: Mail },
      { href: '/api-docs', label: 'API', icon: Code },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--background-card))] transition-all duration-300",
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Header / Logo */}
        <div className={cn("flex h-16 shrink-0 items-center justify-between", sidebarOpen ? "px-4" : "px-4 md:px-0 md:justify-center")}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className={cn(
              "flex shrink-0 items-center justify-center rounded-xl gradient-brand shadow-md shadow-indigo-500/30 transition-all duration-300",
              sidebarOpen ? "h-8 w-8" : "h-10 w-10"
            )}>
              <Zap className={cn("text-white transition-all duration-300", sidebarOpen ? "h-4 w-4" : "h-6 w-6")} />
            </div>
            <div
              className={cn(
                "flex flex-col whitespace-nowrap transition-opacity duration-300",
                !sidebarOpen && "md:opacity-0"
              )}
            >
              <span className="text-sm font-extrabold leading-none text-[rgb(var(--foreground))]">
                AI Office Suite
              </span>
              <span className="text-[10px] text-[rgb(var(--foreground-muted))]">
                One AI for Every Document
              </span>
            </div>
          </Link>
          
          {/* Collapse Toggle (Desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:flex absolute -right-3 top-5 z-10"
          >
            {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={section.title} className={cn("mb-6", !sidebarOpen && "md:flex md:flex-col md:items-center")}>
              <div
                className={cn(
                  "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 transition-opacity duration-300",
                  !sidebarOpen && "md:hidden"
                )}
              >
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={!sidebarOpen ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "gradient-brand text-white shadow-md shadow-indigo-500/20"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100",
                          sidebarOpen 
                            ? "px-3 py-2" 
                            : "px-3 py-2 md:w-12 md:h-12 md:justify-center md:p-0 mx-auto"
                        )}
                      >
                        <Icon
                          className={cn(
                            "shrink-0 transition-transform group-hover:scale-110",
                            sidebarOpen ? "h-4 w-4" : "h-5 w-5",
                            !isActive && "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          )}
                        />
                        <span
                          className={cn(
                            "whitespace-nowrap transition-opacity duration-300",
                            !sidebarOpen && "md:hidden"
                          )}
                        >
                          {item.label}
                        </span>
                        
                        {/* New Badge */}
                        {item.badge && sidebarOpen && (
                          <span className="ml-auto rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {idx < NAV_SECTIONS.length - 1 && !sidebarOpen && (
                <div className="mx-auto mt-6 hidden h-px w-8 bg-gray-200 dark:bg-gray-800 md:block" />
              )}
            </div>
          ))}
        </div>

        {/* Storage Tracker */}
        <div
          className={cn(
            "mt-auto border-t border-[rgb(var(--border))] p-4 transition-opacity duration-300",
            !sidebarOpen && "md:hidden"
          )}
        >
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <HardDrive className="h-3.5 w-3.5" /> Storage
            </span>
            <span className="text-gray-500">2.45 / 10 GB</span>
          </div>
          <Progress value={24.5} className="h-1.5 w-full bg-gray-100 dark:bg-gray-800" />
          <Link
            href="/pricing"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          >
            Upgrade Storage
          </Link>
        </div>
      </aside>
    </>
  );
}
