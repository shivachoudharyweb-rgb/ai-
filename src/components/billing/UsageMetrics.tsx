'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Brain, HardDrive, RefreshCw } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

// ============================================================
// UsageMetrics — Daily tool usage progress bars
// ============================================================

interface Metric {
  label: string;
  icon: typeof FileText;
  used: number;
  limit: number | null;
  color: string;
  bgColor: string;
  unit?: string;
}

function UsageBar({ metric }: { metric: Metric }) {
  const pct = metric.limit !== null
    ? Math.min(100, Math.round((metric.used / metric.limit) * 100))
    : 0;

  const barColor =
    pct >= 90 ? 'from-red-500 to-red-600'
    : pct >= 70 ? 'from-amber-400 to-amber-500'
    : metric.color;

  const textColor =
    pct >= 90 ? 'text-red-500'
    : pct >= 70 ? 'text-amber-500'
    : 'text-[rgb(var(--foreground-muted))]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.bgColor}`}>
            <metric.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-[rgb(var(--foreground))]">
            {metric.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-sm font-bold tabular-nums ${textColor}`}>
            {metric.unit === 'GB'
              ? (metric.used / 1024).toFixed(2)
              : metric.used.toLocaleString()}
          </span>
          <span className="text-xs text-[rgb(var(--foreground-muted))]">
            {' / '}
            {metric.limit === null
              ? '∞'
              : metric.unit === 'GB'
              ? `${(metric.limit / 1024).toFixed(0)} GB`
              : metric.limit.toLocaleString()}
            {metric.unit === 'GB' ? ' used' : '/day'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--background-secondary))]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: metric.limit === null ? '10%' : `${pct}%` }}
        />
      </div>

      {pct >= 90 && metric.limit !== null && (
        <p className="text-xs text-red-500">
          ⚠ Almost at limit — upgrade to unlock more
        </p>
      )}
    </div>
  );
}

export function UsageMetrics() {
  const { usage, resetUsageIfNewDay } = useSubscriptionStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize and check date
  useEffect(() => {
    resetUsageIfNewDay();
  }, [resetUsageIfNewDay]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    resetUsageIfNewDay();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const metrics: Metric[] = usage
    ? [
        {
          label: 'PDF Tools Today',
          icon: FileText,
          used: usage.pdf.used,
          limit: usage.pdf.limit,
          color: 'from-red-400 to-rose-500',
          bgColor: 'bg-red-50 text-red-500 dark:bg-red-950/40',
        },
        {
          label: 'Image Tools Today',
          icon: Image,
          used: usage.image.used,
          limit: usage.image.limit,
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40',
        },
        {
          label: 'AI Requests Today',
          icon: Brain,
          used: usage.ai.used,
          limit: usage.ai.limit,
          color: 'from-indigo-500 to-purple-600',
          bgColor: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40',
        },
        {
          label: 'Storage Used',
          icon: HardDrive,
          used: usage.storage.usedMb,
          limit: usage.storage.limitMb,
          color: 'from-emerald-400 to-teal-500',
          bgColor: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40',
          unit: 'GB',
        },
      ]
    : [];

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[rgb(var(--foreground))]">Today's Usage</h3>
          <p className="text-xs text-[rgb(var(--foreground-muted))]">
            Resets at midnight IST
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] hover:border-indigo-300 hover:text-indigo-500 transition-colors"
          title="Refresh usage"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!usage ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-4 w-20" />
              </div>
              <div className="skeleton h-2 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {metrics.map((m) => (
            <UsageBar key={m.label} metric={m} />
          ))}
        </div>
      )}
    </div>
  );
}
