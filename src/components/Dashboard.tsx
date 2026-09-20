import React, { useMemo } from 'react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, DollarSign, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  invoices,
  onSelectInvoice,
  onCreateNew,
}) => {
  // Aggregate Financial Statistics
  const stats = useMemo(() => {
    let totalRevenue = 0; // Total actually collected
    let totalInvoiced = 0; // Grand total invoiced across all time
    let pendingPayments = 0; // Total balance still owed
    let paidCount = 0;
    let downpaymentCount = 0;
    let openCount = 0;

    invoices.forEach((inv) => {
      totalInvoiced += inv.totalAmount;
      const collected = inv.amountPaid || 0;
      totalRevenue += collected;
      const balance = Math.max(0, inv.totalAmount - collected);
      pendingPayments += balance;

      if (inv.status === 'paid') paidCount++;
      else if (inv.status === 'downpayment') downpaymentCount++;
      else openCount++;
    });

    // Monthly breakdown for current and past 5 months
    const now = new Date();
    const monthlyData: { [key: string]: { monthName: string; revenue: number; invoiced: number; pending: number } } = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      monthlyData[key] = { monthName, revenue: 0, invoiced: 0, pending: 0 };
    }

    invoices.forEach((inv) => {
      const monthKey = (inv.issueDate || '').substring(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].invoiced += inv.totalAmount;
        monthlyData[monthKey].revenue += inv.amountPaid || 0;
        monthlyData[monthKey].pending += Math.max(0, inv.totalAmount - (inv.amountPaid || 0));
      }
    });

    const monthsArray = Object.keys(monthlyData).map((k) => ({
      key: k,
      ...monthlyData[k],
    }));

    // Find max value to scale chart bars
    const maxVal = Math.max(
      ...monthsArray.map((m) => Math.max(m.revenue, m.pending, m.invoiced)),
      1000
    );

    return {
      totalRevenue,
      totalInvoiced,
      pendingPayments,
      paidCount,
      downpaymentCount,
      openCount,
      monthsArray,
      maxVal,
    };
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collected Revenue
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.paidCount} fully settled invoices</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono text-amber-600">
              {formatCurrency(stats.pendingPayments)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.openCount + stats.downpaymentCount} awaiting balance</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Invoiced Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {formatCurrency(stats.totalInvoiced)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Across {invoices.length} total invoices
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Downpayment & Deposit Tracking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Downpayments
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono text-sky-600">
              {stats.downpaymentCount}
            </div>
            <div className="text-[11px] text-sky-600 font-medium mt-1">
              Deposits collected; balance open
            </div>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monthly Revenue & Pending Payments Visualizer */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Revenue vs. Pending Payments
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual cash flow breakdown by issue month for accurate deposit and balance tracking.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
              <span className="text-slate-600">Collected Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400"></span>
              <span className="text-slate-600">Pending Receivables</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="mt-8 pt-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-56 border-b border-slate-200 pb-2">
            {stats.monthsArray.map((m) => {
              const revPercent = Math.min(100, Math.round((m.revenue / stats.maxVal) * 100));
              const penPercent = Math.min(100, Math.round((m.pending / stats.maxVal) * 100));

              return (
                <div key={m.key} className="flex flex-col items-center h-full justify-end group">
                  {/* Bars container */}
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-3 h-44">
                    {/* Revenue Bar */}
                    <div
                      className="w-1/2 max-w-[28px] bg-emerald-500 rounded-t-sm transition-all duration-500 relative group-hover:bg-emerald-600"
                      style={{ height: `${Math.max(4, revPercent)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none transition z-10 font-mono">
                        {formatCurrency(m.revenue)}
                      </div>
                    </div>

                    {/* Pending Bar */}
                    <div
                      className="w-1/2 max-w-[28px] bg-amber-400 rounded-t-sm transition-all duration-500 relative group-hover:bg-amber-500"
                      style={{ height: `${Math.max(4, penPercent)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none transition z-10 font-mono">
                        {formatCurrency(m.pending)}
                      </div>
                    </div>
                  </div>

                  {/* Month Label */}
                  <span className="text-xs font-semibold text-slate-600 mt-2">{m.monthName}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 mt-2 px-1">
            <span>Historical 6-Month Timeline</span>
            <span>Scale Peak: {formatCurrency(stats.maxVal)}</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices & Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
          <button
            onClick={onCreateNew}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>+ Create Invoice</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Issue Date</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-right">Deposit / Paid</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{inv.clientName}</td>
                  <td className="py-3 px-3 text-slate-500">{inv.issueDate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(inv.totalAmount, inv.currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    {formatCurrency(inv.amountPaid || 0, inv.currency)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {inv.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Paid
                      </span>
                    ) : inv.status === 'downpayment' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
                        Downpayment
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectInvoice(inv)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                    >
                      View <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
