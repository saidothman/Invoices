import React, { useState } from 'react';
import { Invoice, InvoiceItem, TemplateTheme, BusinessProfile } from '../types';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  profile: BusinessProfile;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  profile,
  onSave,
  onCancel,
}) => {
  const { t, formatAmount } = useLanguage();
  const generateNewId = () => 'inv-' + Math.random().toString(36).substring(2, 9);
  const generateInvoiceNum = () => `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [id] = useState(initialInvoice?.id || generateNewId());
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoice?.invoiceNumber || generateInvoiceNum());
  const [clientName, setClientName] = useState(initialInvoice?.clientName || '');
  const [clientEmail, setClientEmail] = useState(initialInvoice?.clientEmail || '');
  const [clientAddress, setClientAddress] = useState(initialInvoice?.clientAddress || '');
  const [clientCityStateZip, setClientCityStateZip] = useState(initialInvoice?.clientCityStateZip || '');
  const [issueDate, setIssueDate] = useState(initialInvoice?.issueDate || todayStr);
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || defaultDue);
  const [currency, setCurrency] = useState(initialInvoice?.currency || 'EUR');
  const [status, setStatus] = useState<Invoice['status']>(initialInvoice?.status || 'open');
  const [templateTheme, setTemplateTheme] = useState<TemplateTheme>(initialInvoice?.templateTheme || 'modern');

  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items?.length
      ? initialInvoice.items
      : [{ id: '1', description: 'Consulting / Professional Services', quantity: 1, unitPrice: 500, subtotal: 500 }]
  );

  const [taxRate, setTaxRate] = useState<number>(initialInvoice ? initialInvoice.taxRate : 19.0);

  // Downpayment configuration
  const [downpaymentRequired, setDownpaymentRequired] = useState<boolean>(
    initialInvoice?.downpaymentRequired ?? false
  );
  const [downpaymentType, setDownpaymentType] = useState<'fixed' | 'percentage'>(
    initialInvoice?.downpaymentType || 'percentage'
  );
  const [downpaymentValue, setDownpaymentValue] = useState<number>(
    initialInvoice?.downpaymentValue || 30
  );
  const [amountPaid, setAmountPaid] = useState<number>(
    initialInvoice?.amountPaid || 0
  );

  const [notes, setNotes] = useState(
    initialInvoice?.notes || t.formClientNotesPlaceholder
  );
  const [terms, setTerms] = useState(
    initialInvoice?.terms || profile.paymentTermsNote || t.formPaymentTermsPlaceholder
  );

  // Calculate financials dynamically
  const subtotalAmount = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const taxAmount = Number(((subtotalAmount * (taxRate || 0)) / 100).toFixed(2));
  const totalAmount = Number((subtotalAmount + taxAmount).toFixed(2));

  let downpaymentAmount = 0;
  if (downpaymentRequired) {
    if (downpaymentType === 'percentage') {
      downpaymentAmount = Number(((totalAmount * (downpaymentValue || 0)) / 100).toFixed(2));
    } else {
      downpaymentAmount = Math.min(totalAmount, Number(downpaymentValue || 0));
    }
  }

  const balanceDue = Math.max(0, Number((totalAmount - amountPaid).toFixed(2)));

  // Item handlers
  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: val };
      if (field === 'quantity' || field === 'unitPrice') {
        const q = field === 'quantity' ? Number(val) : target.quantity;
        const p = field === 'unitPrice' ? Number(val) : target.unitPrice;
        target.subtotal = Number((Math.max(0, q) * Math.max(0, p)).toFixed(2));
      }
      updated[index] = target;
      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        description: '',
        quantity: 1,
        unitPrice: 100,
        subtotal: 100,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert(t.formClientName);
      return;
    }

    // Auto-update status if amount paid equals total or deposit
    let determinedStatus = status;
    if (amountPaid >= totalAmount && totalAmount > 0) {
      determinedStatus = 'paid';
    } else if (downpaymentRequired && amountPaid >= downpaymentAmount && amountPaid > 0) {
      determinedStatus = 'downpayment';
    } else if (amountPaid === 0) {
      determinedStatus = 'open';
    }

    const newInvoice: Invoice = {
      id,
      invoiceNumber,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientAddress: clientAddress.trim(),
      clientCityStateZip: clientCityStateZip.trim(),
      issueDate,
      dueDate,
      currency,
      items,
      subtotalAmount,
      taxRate: Number(taxRate || 0),
      taxAmount,
      totalAmount,
      downpaymentRequired,
      downpaymentType,
      downpaymentValue: Number(downpaymentValue || 0),
      downpaymentAmount,
      amountPaid: Number(amountPaid || 0),
      status: determinedStatus,
      notes,
      terms,
      templateTheme,
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newInvoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {initialInvoice ? `${t.formTitleEdit}: ${initialInvoice.invoiceNumber}` : t.formTitleNew}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.formSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            {initialInvoice ? t.save : t.formSaveInvoice}
          </button>
        </div>
      </div>

      {/* Invoice Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formInvoiceNumber}</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formCurrency}</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CHF">CHF (CHF)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formIssueDate}</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formDueDate}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>{t.formClientInfo}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.formClientName}
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={t.formClientNamePlaceholder}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formClientEmail}</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder={t.formClientEmailPlaceholder}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formClientAddress}</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder={t.formClientAddressPlaceholder}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formClientCityStateZip}</label>
            <input
              type="text"
              value={clientCityStateZip}
              onChange={(e) => setClientCityStateZip(e.target.value)}
              placeholder={t.formClientCityStateZipPlaceholder}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">{t.formLineItems}</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" /> {t.formAddItem}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                <th className="pb-2 w-[45%] font-semibold">{t.formColDescription}</th>
                <th className="pb-2 w-[15%] text-center font-semibold">{t.formColQty}</th>
                <th className="pb-2 w-[20%] text-right font-semibold">{t.formColPrice} ({currency})</th>
                <th className="pb-2 w-[15%] text-right font-semibold">{t.formColTotal}</th>
                <th className="pb-2 w-[5%] text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={item.id} className="group">
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder={t.formColDescription}
                      className="w-full text-xs px-3 py-2 bg-slate-50 group-hover:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-xs text-center font-mono px-2 py-2 bg-slate-50 group-hover:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full text-xs text-right font-mono px-3 py-2 bg-slate-50 group-hover:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </td>
                  <td className="py-2.5 pl-2 text-right text-xs font-mono font-bold text-slate-800">
                    {formatAmount(item.subtotal, currency)}
                  </td>
                  <td className="py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      title={t.delete}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downpayment & Tax & Template Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Downpayment deposit options & templates */}
        <div className="space-y-4">
          {/* Downpayment Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={downpaymentRequired}
                  onChange={(e) => setDownpaymentRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                {t.formRequireDownpayment}
              </label>
              {downpaymentRequired && (
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {t.statusDownpayment}
                </span>
              )}
            </div>

            {downpaymentRequired && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3 mt-2">
                <div className="flex gap-4 text-xs font-medium text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="downpaymentType"
                      checked={downpaymentType === 'percentage'}
                      onChange={() => setDownpaymentType('percentage')}
                      className="text-indigo-600"
                    />
                    {t.formDownpaymentPercentage}
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="downpaymentType"
                      checked={downpaymentType === 'fixed'}
                      onChange={() => setDownpaymentType('fixed')}
                      className="text-indigo-600"
                    />
                    {t.formDownpaymentFixed}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-1/2">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      {t.formDownpaymentValue}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={downpaymentType === 'percentage' ? 100 : totalAmount}
                        step={downpaymentType === 'percentage' ? 1 : 0.01}
                        value={downpaymentValue}
                        onChange={(e) => setDownpaymentValue(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-8"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">
                        {downpaymentType === 'percentage' ? '%' : currency}
                      </span>
                    </div>
                  </div>

                  <div className="w-1/2 p-2 rounded bg-white border border-slate-200 text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.formCalculatedDeposit}</div>
                    <div className="text-sm font-bold text-indigo-700 font-mono">
                      {formatAmount(downpaymentAmount, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Status & Amount Paid */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t.formStatus}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.formStatus}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Invoice['status'])}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="open">{t.statusOpen}</option>
                  <option value="downpayment">{t.statusDownpayment}</option>
                  <option value="paid">{t.statusPaid}</option>
                  <option value="draft">{t.statusDraft}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.formAmountPaid} ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Helper Button */}
            <div className="flex gap-2 pt-1">
              {downpaymentRequired && downpaymentAmount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setAmountPaid(downpaymentAmount);
                    setStatus('downpayment');
                  }}
                  className="text-[11px] px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
                >
                  {t.viewModalMarkDownpayment} ({formatAmount(downpaymentAmount, currency)})
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setAmountPaid(totalAmount);
                  setStatus('paid');
                }}
                className="text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
              >
                {t.viewModalMarkPaid}
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
              {t.formTheme}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(
                [
                  { id: 'modern', label: t.formThemeModern },
                  { id: 'minimalist', label: t.formThemeMinimalist },
                  { id: 'classic', label: t.formThemeClassic },
                  { id: 'corporate', label: t.formThemeCorporate },
                ] as const
              ).map((tm) => (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => setTemplateTheme(tm.id)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition ${
                    templateTheme === tm.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tax rate & Total Calculations */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>{t.formFinancialSummary}</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </h4>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 text-slate-600">
              <span>{t.formSubtotal}:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatAmount(subtotalAmount, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">{t.formTaxRate}:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20 text-xs font-mono px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none text-right"
                />
              </div>
              <span className="font-mono text-xs font-semibold text-slate-800">
                +{formatAmount(taxAmount, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-2 border-b-2 border-slate-900 font-bold text-slate-950">
              <span>{t.formTotalAmount}:</span>
              <span className="font-mono text-base">{formatAmount(totalAmount, currency)}</span>
            </div>

            {downpaymentRequired && (
              <div className="flex items-center justify-between text-xs py-1.5 text-indigo-700 font-medium">
                <span>{t.formCalculatedDeposit}:</span>
                <span className="font-mono font-bold">
                  {formatAmount(downpaymentAmount, currency)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1.5 text-emerald-700 font-medium">
              <span>{t.formAmountPaid}:</span>
              <span className="font-mono font-bold">-{formatAmount(amountPaid, currency)}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-3 bg-slate-50 px-3 rounded-lg font-black text-slate-950">
              <span>{t.formBalanceDue}:</span>
              <span className="font-mono text-lg text-indigo-600">
                {formatAmount(balanceDue, currency)}
              </span>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.formClientNotes}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.formClientNotesPlaceholder}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.formPaymentTerms}
              </label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder={t.formPaymentTermsPlaceholder}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
