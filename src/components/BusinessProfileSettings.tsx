import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Building2, Landmark, Upload, Check } from 'lucide-react';

interface BusinessProfileSettingsProps {
  profile: BusinessProfile;
  onSave: (profile: BusinessProfile) => void;
}

export const BusinessProfileSettings: React.FC<BusinessProfileSettingsProps> = ({
  profile,
  onSave,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t.profLogoHint);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('logoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.profTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.profSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" /> {t.profSaveSuccess}
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            {t.profSaveBtn}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Identity & Logo */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>{t.profCompanySection}</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profLogo}</label>
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <div className="relative group w-24 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={formData.logoUrl}
                    alt="Company logo"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('logoUrl', '')}
                    className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  >
                    {t.profRemoveLogo}
                  </button>
                </div>
              ) : (
                <div className="w-24 h-16 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <Building2 className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px]">{t.profNoLogo}</span>
                </div>
              )}

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shadow-sm transition">
                  <Upload className="w-3.5 h-3.5" />
                  {t.profUploadLogo}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">{t.profLogoHint}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.profCompanyName} *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profEmail}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profPhone}</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profAddress}</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="z.B. Friedrichstraße 123"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profCityStateZip}</label>
            <input
              type="text"
              value={formData.cityStateZip}
              onChange={(e) => handleChange('cityStateZip', e.target.value)}
              placeholder="z.B. 10117 Berlin, Deutschland"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Banking Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>{t.profBankSection}</span>
          </h3>

          <p className="text-xs text-slate-500">
            {t.profBankSectionHint}
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.docBank}</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="z.B. Deutsche Bank, Commerzbank..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.docAccountHolder}</label>
            <input
              type="text"
              value={formData.accountHolder}
              onChange={(e) => handleChange('accountHolder', e.target.value)}
              placeholder="z.B. Max Mustermann GmbH"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profAccountNumber}</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.docIbanOrAccount}</label>
              <input
                type="text"
                value={formData.routingOrIban}
                onChange={(e) => handleChange('routingOrIban', e.target.value)}
                placeholder="DE89 3704 0044 0532 0130 00"
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.docBicSwift}</label>
            <input
              type="text"
              value={formData.swiftBic}
              onChange={(e) => handleChange('swiftBic', e.target.value)}
              placeholder="DEUTDEDBFXX"
              className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.profPaymentTerms}</label>
            <textarea
              rows={2}
              value={formData.paymentTermsNote}
              onChange={(e) => handleChange('paymentTermsNote', e.target.value)}
              placeholder="z.B. Zahlbar innerhalb von 14 Tagen nach Rechnungserhalt ohne Abzug."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
