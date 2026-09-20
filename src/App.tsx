import React, { useState, useEffect } from 'react';
import { Invoice, BusinessProfile, GoogleDriveUser } from './types';
import {
  fetchAllInvoices,
  saveInvoiceToDb,
  deleteInvoiceFromDb,
  updateInvoiceStatusInDb,
  updateInvoiceDriveBackupInDb,
  loadBusinessProfile,
  saveBusinessProfile,
  defaultProfile,
} from './database';
import { exportInvoicesToCSV } from './utils/exportUtils';
import { Dashboard } from './components/Dashboard';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceViewModal } from './components/InvoiceViewModal';
import { BusinessProfileSettings } from './components/BusinessProfileSettings';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './i18n/LanguageContext';
import { initAuth } from './services/firebaseAuth';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Cloud,
  Plus,
  Receipt,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'invoices' | 'settings'>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Active modal/subview states
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Google Drive state
  const [driveUser, setDriveUser] = useState<GoogleDriveUser>({
    isSignedIn: false,
    email: '',
    name: '',
    picture: '',
    accessToken: null,
  });

  // Load database and business profile on mount
  const loadData = async () => {
    try {
      setIsLoading(true);
      setInitError(null);
      const [loadedInvoices, savedProfile] = await Promise.all([
        fetchAllInvoices(),
        loadBusinessProfile(),
      ]);
      setInvoices(loadedInvoices);
      setProfile(savedProfile);
    } catch (err: any) {
      console.error('Error initializing application data:', err);
      setInitError(err?.message || 'Failed to initialize SQLite database engine');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for Firebase auth state changes
    const unsubscribe = initAuth(
      (user, token) => {
        setDriveUser({
          isSignedIn: true,
          email: user.email || '',
          name: user.displayName || user.email || 'Google User',
          picture: user.photoURL || '',
          accessToken: token,
        });
      },
      () => {
        setDriveUser({
          isSignedIn: false,
          email: '',
          name: '',
          picture: '',
          accessToken: null,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Save/Create invoice
  const handleSaveInvoice = async (invoiceToSave: Invoice) => {
    try {
      await saveInvoiceToDb(invoiceToSave);
      const updated = await fetchAllInvoices();
      setInvoices(updated);
      setIsCreatingNew(false);
      setEditingInvoice(null);
      setViewingInvoice(invoiceToSave);
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert('Failed to save invoice into SQLite storage.');
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoiceFromDb(id);
      const updated = await fetchAllInvoices();
      setInvoices(updated);
      if (viewingInvoice?.id === id) {
        setViewingInvoice(null);
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  // Status update
  const handleStatusChange = async (status: Invoice['status'], amountPaid?: number) => {
    if (!viewingInvoice) return;
    try {
      await updateInvoiceStatusInDb(viewingInvoice.id, status, amountPaid);
      const updatedInvoices = await fetchAllInvoices();
      setInvoices(updatedInvoices);
      const found = updatedInvoices.find((i) => i.id === viewingInvoice.id);
      if (found) {
        setViewingInvoice(found);
      }
    } catch (err) {
      console.error('Error changing invoice status:', err);
    }
  };

  // Google Drive Backup recording
  const handleDriveUploaded = async (invoiceId: string, driveFileId: string, driveFileUrl: string) => {
    try {
      await updateInvoiceDriveBackupInDb(invoiceId, driveFileId, driveFileUrl);
      const updatedInvoices = await fetchAllInvoices();
      setInvoices(updatedInvoices);
      if (viewingInvoice && viewingInvoice.id === invoiceId) {
        setViewingInvoice({
          ...viewingInvoice,
          driveFileId,
          driveFileUrl,
        });
      }
    } catch (err) {
      console.error('Error updating drive file reference:', err);
    }
  };

  // Business profile save
  const handleSaveProfile = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    saveBusinessProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight text-slate-950 flex items-center gap-2">
                  <span>{t.appTitle}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" /> SQLite
                  </span>
                </div>
                <div className="text-xs text-slate-400">{t.appSubtitle}</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  setViewingInvoice(null);
                  setIsCreatingNew(false);
                  setEditingInvoice(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'dashboard' && !viewingInvoice && !isCreatingNew && !editingInvoice
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.navDashboard}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('invoices');
                  setViewingInvoice(null);
                  setIsCreatingNew(false);
                  setEditingInvoice(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'invoices' && !viewingInvoice && !isCreatingNew && !editingInvoice
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.navInvoices} ({invoices.length})</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('settings');
                  setViewingInvoice(null);
                  setIsCreatingNew(false);
                  setEditingInvoice(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'settings' && !viewingInvoice && !isCreatingNew && !editingInvoice
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.navCompany}</span>
              </button>
            </nav>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2.5">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Google Drive Status Button */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  driveUser.isSignedIn
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">
                  {driveUser.isSignedIn ? t.driveConnected : t.driveBtn}
                </span>
                {driveUser.isSignedIn && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </button>

              {/* Create Invoice Button */}
              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setViewingInvoice(null);
                  setIsCreatingNew(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.createInvoice}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-slate-200 px-4 py-2 gap-2 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setViewingInvoice(null);
              setIsCreatingNew(false);
              setEditingInvoice(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md ${
              currentTab === 'dashboard' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => {
              setCurrentTab('invoices');
              setViewingInvoice(null);
              setIsCreatingNew(false);
              setEditingInvoice(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md ${
              currentTab === 'invoices' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.navInvoices}
          </button>
          <button
            onClick={() => {
              setCurrentTab('settings');
              setViewingInvoice(null);
              setIsCreatingNew(false);
              setEditingInvoice(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md ${
              currentTab === 'settings' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.navCompany}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="py-24 text-center text-slate-400">
            <Database className="w-8 h-8 animate-pulse mx-auto mb-2 text-indigo-500" />
            <p className="text-xs font-semibold">{t.dbLoading}</p>
          </div>
        ) : initError ? (
          <div className="py-16 max-w-md mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">{t.dbNoticeTitle}</h3>
            <p className="text-xs text-slate-500 mb-4">{initError}</p>
            <button
              onClick={() => loadData()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.dbRetry}</span>
            </button>
          </div>
        ) : isCreatingNew || editingInvoice ? (
          <InvoiceForm
            initialInvoice={editingInvoice}
            profile={profile}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setIsCreatingNew(false);
              setEditingInvoice(null);
            }}
          />
        ) : viewingInvoice ? (
          <InvoiceViewModal
            invoice={viewingInvoice}
            profile={profile}
            driveUser={driveUser}
            onClose={() => setViewingInvoice(null)}
            onEdit={() => {
              setEditingInvoice(viewingInvoice);
              setViewingInvoice(null);
            }}
            onStatusChange={handleStatusChange}
            onDriveUploaded={handleDriveUploaded}
            onRequestGoogleLogin={() => setIsAuthModalOpen(true)}
          />
        ) : currentTab === 'dashboard' ? (
          <Dashboard
            invoices={invoices}
            onSelectInvoice={(inv) => setViewingInvoice(inv)}
            onCreateNew={() => setIsCreatingNew(true)}
          />
        ) : currentTab === 'invoices' ? (
          <InvoiceList
            invoices={invoices}
            onSelectInvoice={(inv) => setViewingInvoice(inv)}
            onEditInvoice={(inv) => setEditingInvoice(inv)}
            onDeleteInvoice={handleDeleteInvoice}
            onCreateNew={() => setIsCreatingNew(true)}
            onExportCSV={exportInvoicesToCSV}
          />
        ) : (
          <BusinessProfileSettings profile={profile} onSave={handleSaveProfile} />
        )}
      </main>

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        driveUser={driveUser}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setDriveUser(user)}
        onLogout={() =>
          setDriveUser({
            isSignedIn: false,
            email: '',
            name: '',
            picture: '',
            accessToken: null,
          })
        }
      />
    </div>
  );
}
