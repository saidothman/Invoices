import React from 'react';
import { useLanguage, Language } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'header' | 'compact' }> = ({ variant = 'header' }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleToggle = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div
      className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold"
      role="group"
      aria-label={t.switchLanguage}
    >
      <button
        type="button"
        onClick={() => handleToggle('en')}
        className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
          language === 'en'
            ? 'bg-white text-indigo-700 shadow-xs font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="English"
      >
        <span className="text-[11px]">EN</span>
      </button>
      <button
        type="button"
        onClick={() => handleToggle('de')}
        className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
          language === 'de'
            ? 'bg-white text-indigo-700 shadow-xs font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Deutsch"
      >
        <span className="text-[11px]">DE</span>
      </button>
    </div>
  );
};
