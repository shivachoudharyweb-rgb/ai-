'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

interface ToolCardProps {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  badge?: string;
  toolCategory?: 'pdf' | 'image' | 'ai'; // Optional explicit category
}

export function ToolCard({ id, title, description, icon: Icon, color, badge, toolCategory }: ToolCardProps) {
  const router = useRouter();
  const { setCurrentTool } = useUIStore();
  const { checkLimit } = useSubscriptionStore();

  const handleClick = () => {
    // Determine category if not explicitly provided
    let category: 'pdf' | 'image' | 'ai' = toolCategory || 'pdf';
    if (!toolCategory) {
      if (id.includes('image') || id === 'remove-bg' || id === 'profile-pic') category = 'image';
      else if (id.includes('ai') || id.includes('chat')) category = 'ai';
    }

    if (!checkLimit(category)) {
      return; // Stop navigation, modal is opened by checkLimit
    }

    setCurrentTool(id);
    router.push(`/${id}`); // Assumes tool processing page is dynamic route
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            color
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {badge && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
