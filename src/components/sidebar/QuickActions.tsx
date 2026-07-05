'use client';

import { FileText, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { id: 'pdf-to-word', label: 'PDF to Word', icon: FileText, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'compress-pdf', label: 'Compress PDF', icon: FileText, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'remove-bg', label: 'Remove Background', icon: ImageIcon, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">Quick Actions</h3>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={`/${action.id}`}
            className="group flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:border-indigo-100 hover:bg-indigo-50/50 dark:border-gray-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-900/20"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400">
              <Plus className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
