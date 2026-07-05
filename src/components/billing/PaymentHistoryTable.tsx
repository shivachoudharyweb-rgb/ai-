'use client';

import { Download, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { usePaymentHistory } from '@/hooks/useSubscription';
import type { MockPayment } from '@/lib/mock-data';

// ============================================================
// PaymentHistoryTable — Transaction list with status badges
// ============================================================

const STATUS_CONFIG: Record<
  MockPayment['status'],
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  success:  { icon: CheckCircle2, label: 'Success',  className: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50' },
  failed:   { icon: XCircle,      label: 'Failed',   className: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/50' },
  pending:  { icon: Clock,        label: 'Pending',  className: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50' },
  refunded: { icon: RefreshCw,    label: 'Refunded', className: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/50' },
};

function StatusBadge({ status }: { status: MockPayment['status'] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

const PLAN_COLORS: Record<string, string> = {
  free:       'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  starter:    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  pro:        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  pro_plus:   'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
  enterprise: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function PaymentHistoryTable() {
  const { data: payments, isLoading } = usePaymentHistory();

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] shadow-sm">
      <div className="border-b border-[rgb(var(--border))] px-6 py-4">
        <h3 className="font-bold text-[rgb(var(--foreground))]">Payment History</h3>
        <p className="text-xs text-[rgb(var(--foreground-muted))]">
          All transactions · GST invoices available for download
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-5 flex-1" />
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-5 w-20" />
            </div>
          ))}
        </div>
      ) : !payments?.length ? (
        <div className="py-12 text-center">
          <p className="text-[rgb(var(--foreground-muted))]">No payment history yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]/40">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Billing</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-muted))]">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, i) => (
                <tr
                  key={pay.id}
                  className={`
                    border-b border-[rgb(var(--border))] last:border-0
                    hover:bg-[rgb(var(--background-secondary))]/40 transition-colors
                  `}
                >
                  <td className="px-6 py-4 text-[rgb(var(--foreground-muted))]">
                    {new Date(pay.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_COLORS[pay.tierId] ?? ''}`}>
                      {pay.tierName}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize text-[rgb(var(--foreground-muted))]">
                    {pay.billingCycle}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-[rgb(var(--foreground))]">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={pay.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pay.invoiceUrl && pay.status === 'success' ? (
                      <a
                        href={pay.invoiceUrl}
                        className="
                          inline-flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border))]
                          px-3 py-1.5 text-xs font-medium text-[rgb(var(--foreground-muted))]
                          hover:border-indigo-300 hover:text-indigo-500 transition-colors
                        "
                        // TODO: Wire to real invoice PDF download endpoint
                        title="Download GST Invoice"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs text-[rgb(var(--foreground-subtle))]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
