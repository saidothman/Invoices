import React, { useState, useMemo } from 'react';
import { Invoice, PaymentStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Cloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onCreateNew: () => void;
  onExportCSV: (invoices: Invoice[]) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onSelectInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onCreateNew,
  onExportCSV,
}) => {
  const { t, formatDate, formatAmount } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.clientName.toLowerCase().includes(query) ||
          (inv.clientEmail && inv.clientEmail.toLowerCase().includes(query));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        }
        if (sortBy === 'total-desc') {
          return b.totalAmount - a.totalAmount;
        }
        if (sortBy === 'total-asc') {
          return a.totalAmount - b.totalAmount;
        }
        return 0;
      });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Header & Quick CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.invListTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.invListSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCSV(filteredInvoices)}
            title="Export filtered records to CSV"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{t.invListExportCsv}</span>
          </button>

          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.invListNewInvoice}</span>
          </button>
        </div>
      </div>

      {/* Filters, Search & Status Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.invListSearchPlaceholder}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> {t.formStatus}:
          </span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.statusAll} ({invoices.length})
          </button>

          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              statusFilter === 'open'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" /> {t.statusOpen} (
            {invoices.filter((i) => i.status === 'open').length})
          </button>

          <button
            onClick={() => setStatusFilter('downpayment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              statusFilter === 'downpayment'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> {t.statusDownpayment} (
            {invoices.filter((i) => i.status === 'downpayment').length})
          </button>

          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {t.statusPaid} (
            {invoices.filter((i) => i.status === 'paid').length})
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="date-desc">{t.invListSortNewest}</option>
            <option value="date-asc">{t.invListSortOldest}</option>
            <option value="total-desc">{t.invListSortHighest}</option>
            <option value="total-asc">{t.invListSortLowest}</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">{t.invListColNumber}</th>
                <th className="py-3 px-4">{t.invListColClient}</th>
                <th className="py-3 px-4">{t.invListColDates}</th>
                <th className="py-3 px-4 text-right">{t.invListColTotal}</th>
                <th className="py-3 px-4 text-right">{t.docAmountPaid}</th>
                <th className="py-3 px-4 text-right">{t.invListColBalance}</th>
                <th className="py-3 px-4 text-center">{t.invListColStatus}</th>
                <th className="py-3 px-4 text-center">{t.invListDriveSaved}</th>
                <th className="py-3 px-4 text-right">{t.invListColActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const balanceDue = Math.max(0, inv.totalAmount - (inv.amountPaid || 0));
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition group">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inv.clientName}</div>
                        {inv.clientEmail && (
                          <div className="text-[11px] text-slate-400">{inv.clientEmail}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{formatDate(inv.issueDate)}</div>
                        <div className="text-[11px] text-slate-400">{t.invListDue}: {formatDate(inv.dueDate)}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatAmount(inv.totalAmount, inv.currency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-emerald-700 font-semibold">
                          {formatAmount(inv.amountPaid || 0, inv.currency)}
                        </div>
                        {inv.downpaymentRequired && (
                          <div className="text-[10px] text-slate-400">
                            {t.docDepositRequired}: {formatAmount(inv.downpaymentAmount, inv.currency)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatAmount(balanceDue, inv.currency)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {inv.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> {t.statusPaid}
                          </span>
                        ) : inv.status === 'downpayment' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                            <Clock className="w-3 h-3" /> {t.statusDownpayment}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3" /> {t.statusOpen}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {inv.driveFileUrl ? (
                          <a
                            href={inv.driveFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                            title="Open in Google Drive"
                          >
                            <Cloud className="w-3.5 h-3.5" /> {t.invListDriveSaved}
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">Local</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            title={t.invListViewTooltip}
                            className="p-1.5 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditInvoice(inv)}
                            title={t.invListEditTooltip}
                            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`${t.invListDeleteConfirm} ${inv.invoiceNumber}?`)) {
                                onDeleteInvoice(inv.id);
                              }
                            }}
                            title={t.invListDeleteTooltip}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    {t.invListNoResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
