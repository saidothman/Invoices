import React from 'react';
import { Invoice, BusinessProfile } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { Building2, Landmark, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface InvoicePreviewDocumentProps {
  invoice: Invoice;
  profile: BusinessProfile;
  previewId?: string;
}

export const InvoicePreviewDocument: React.FC<InvoicePreviewDocumentProps> = ({
  invoice,
  profile,
  previewId = 'invoice-document-render',
}) => {
  const balanceDue = Math.max(0, invoice.totalAmount - (invoice.amountPaid || 0));

  // Color & styling accents based on theme
  const getThemeStyles = () => {
    switch (invoice.templateTheme) {
      case 'classic':
        return {
          primaryBg: 'bg-amber-900 text-white',
          accentBorder: 'border-amber-800',
          accentText: 'text-amber-900',
          tableHeader: 'bg-amber-100/70 text-amber-950 font-serif',
          highlightBox: 'bg-amber-50 border border-amber-200',
          fontFamily: 'font-serif',
        };
      case 'corporate':
        return {
          primaryBg: 'bg-slate-900 text-white',
          accentBorder: 'border-slate-800',
          accentText: 'text-slate-900',
          tableHeader: 'bg-slate-100 text-slate-900 font-semibold',
          highlightBox: 'bg-slate-50 border border-slate-200',
          fontFamily: 'font-sans',
        };
      case 'minimalist':
        return {
          primaryBg: 'bg-neutral-800 text-white',
          accentBorder: 'border-neutral-300',
          accentText: 'text-neutral-900',
          tableHeader: 'bg-transparent border-b-2 border-neutral-900 text-neutral-900 font-medium',
          highlightBox: 'bg-neutral-50 border border-neutral-200',
          fontFamily: 'font-sans',
        };
      case 'modern':
      default:
        return {
          primaryBg: 'bg-indigo-600 text-white',
          accentBorder: 'border-indigo-600',
          accentText: 'text-indigo-600',
          tableHeader: 'bg-indigo-50 text-indigo-950 font-semibold',
          highlightBox: 'bg-indigo-50/60 border border-indigo-100',
          fontFamily: 'font-sans',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      id={previewId}
      className={`w-full max-w-[800px] mx-auto bg-white text-slate-800 p-8 sm:p-12 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 ${theme.fontFamily}`}
      style={{ minHeight: '1050px' }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-start gap-4">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.companyName}
              className="h-16 w-auto max-w-[180px] object-contain rounded"
            />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <Building2 className="w-7 h-7" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {profile.companyName || 'Apex Creative Studio LLC'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
              {profile.address && `${profile.address}, `}
              {profile.cityStateZip}
            </p>
            <div className="text-xs text-slate-500 mt-1">
              {profile.email} {profile.phone && `• ${profile.phone}`}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-2 bg-slate-100 text-slate-800">
            INVOICE
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
            {invoice.invoiceNumber || 'INV-0001'}
          </div>
          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
            <div>
              <span className="text-slate-400">Issue Date:</span>{' '}
              <span className="font-medium text-slate-700">{invoice.issueDate}</span>
            </div>
            <div>
              <span className="text-slate-400">Due Date:</span>{' '}
              <span className="font-medium text-slate-700">{invoice.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To & Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Billed To
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            {invoice.clientName || 'Client Name'}
          </h2>
          <div className="text-sm text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
            {invoice.clientAddress && `${invoice.clientAddress}\n`}
            {invoice.clientCityStateZip}
          </div>
          {invoice.clientEmail && (
            <div className="text-xs text-slate-500 mt-1">{invoice.clientEmail}</div>
          )}
        </div>

        <div className="sm:text-right flex flex-col sm:items-end justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Payment Status
            </span>
            <div className="mt-1 flex sm:justify-end">
              {invoice.status === 'paid' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
                </span>
              ) : invoice.status === 'downpayment' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  <Clock className="w-3.5 h-3.5" /> DEPOSIT RECEIVED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" /> OPEN / UNPAID
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Amount Due</span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(balanceDue, invoice.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Downpayment Highlights if enabled */}
      {invoice.downpaymentRequired && (
        <div className={`my-4 p-4 rounded-lg ${theme.highlightBox}`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Deposit / Downpayment Policy
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                {invoice.downpaymentType === 'percentage'
                  ? `Required upfront deposit: ${invoice.downpaymentValue}% (${formatCurrency(
                      invoice.downpaymentAmount,
                      invoice.currency
                    )})`
                  : `Required upfront fixed deposit: ${formatCurrency(
                      invoice.downpaymentAmount,
                      invoice.currency
                    )}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Deposit Received:</span>
              <span className="ml-2 text-sm font-bold text-slate-900">
                {formatCurrency(invoice.amountPaid, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs uppercase tracking-wider ${theme.tableHeader}`}>
              <th className="py-3 px-3 rounded-l">Item Description</th>
              <th className="py-3 px-3 text-center">Qty</th>
              <th className="py-3 px-3 text-right">Unit Price</th>
              <th className="py-3 px-3 text-right rounded-r">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3 font-medium text-slate-800">
                    {item.description || 'Service/Product'}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-600 font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-600 font-mono">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-900 font-mono">
                    {formatCurrency(item.subtotal, invoice.currency)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400 text-sm">
                  No items listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calculations & Totals */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-8 pt-4 border-t border-slate-200">
        <div className="flex-1 space-y-4">
          {/* Notes */}
          {invoice.notes && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Notes
              </span>
              <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Terms */}
          {(invoice.terms || profile.paymentTermsNote) && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Terms & Conditions
              </span>
              <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">
                {invoice.terms || profile.paymentTermsNote}
              </p>
            </div>
          )}

          {/* Bank Payment Details */}
          {(profile.bankName || profile.accountNumber || profile.routingOrIban) && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-500" /> Remittance / Bank Transfer
              </div>
              {profile.bankName && (
                <div>
                  <span className="text-slate-400">Bank:</span> {profile.bankName}
                </div>
              )}
              {profile.accountHolder && (
                <div>
                  <span className="text-slate-400">Account Name:</span> {profile.accountHolder}
                </div>
              )}
              {profile.accountNumber && (
                <div>
                  <span className="text-slate-400">Account No:</span> {profile.accountNumber}
                </div>
              )}
              {profile.routingOrIban && (
                <div>
                  <span className="text-slate-400">Routing / IBAN:</span> {profile.routingOrIban}
                </div>
              )}
              {profile.swiftBic && (
                <div>
                  <span className="text-slate-400">SWIFT / BIC:</span> {profile.swiftBic}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Financial Breakdown */}
        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatCurrency(invoice.subtotalAmount, invoice.currency)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Tax ({invoice.taxRate}%):</span>
            <span className="font-mono">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total:</span>
            <span className="font-mono">{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
          </div>

          {invoice.downpaymentRequired && (
            <div className="flex justify-between text-slate-600 text-xs pt-1">
              <span>Required Deposit ({invoice.downpaymentType === 'percentage' ? `${invoice.downpaymentValue}%` : 'Fixed'}):</span>
              <span className="font-mono">{formatCurrency(invoice.downpaymentAmount, invoice.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-emerald-700 text-xs">
            <span>Amount Paid / Credited:</span>
            <span className="font-mono">-{formatCurrency(invoice.amountPaid || 0, invoice.currency)}</span>
          </div>

          <div className="flex justify-between items-center text-base font-extrabold text-slate-950 pt-2 border-t-2 border-slate-900">
            <span>Balance Due:</span>
            <span className="font-mono text-lg">{formatCurrency(balanceDue, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer thank you */}
      <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        Thank you for your business! If you have any inquiries regarding this invoice, please reach out to{' '}
        <span className="font-medium text-slate-600">{profile.email}</span>.
      </div>
    </div>
  );
};
