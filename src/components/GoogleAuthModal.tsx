import React, { useState } from 'react';
import { GoogleDriveUser } from '../types';
import { Cloud, LogOut, CheckCircle2, ShieldCheck, Key, Loader2 } from 'lucide-react';
import { googleSignIn, googleSignOut } from '../services/firebaseAuth';
import { useLanguage } from '../i18n/LanguageContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  driveUser: GoogleDriveUser;
  onClose: () => void;
  onLoginSuccess: (user: GoogleDriveUser) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  driveUser,
  onClose,
  onLoginSuccess,
  onLogout,
}) => {
  const { t } = useLanguage();
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuthLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, accessToken } = await googleSignIn();
      onLoginSuccess({
        isSignedIn: true,
        email: user.email || '',
        name: user.displayName || user.email || 'Google User',
        picture: user.photoURL || '',
        accessToken,
      });
      onClose();
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing authorization.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Popup request was cancelled. Please try again.');
      } else {
        setError(err.message || 'Failed to authorize with Google Drive.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenReceived = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Could not fetch Google user profile with provided token.');
      }

      const info = await res.json();
      onLoginSuccess({
        isSignedIn: true,
        email: info.email || 'user@gmail.com',
        name: info.name || 'Google Account',
        picture: info.picture || '',
        accessToken: token,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate token with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    handleTokenReceived(tokenInput.trim());
  };

  const handleDisconnect = async () => {
    try {
      await googleSignOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.driveModalTitle}</h3>
              <p className="text-xs text-slate-500">{t.driveModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          {driveUser.isSignedIn ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-3">
                {driveUser.picture ? (
                  <img
                    src={driveUser.picture}
                    alt={driveUser.name}
                    className="w-10 h-10 rounded-full border border-emerald-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                    {driveUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.driveConnected}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{driveUser.name}</div>
                  <div className="text-xs text-slate-500">{driveUser.email}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.driveConnectedMsg}</span>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-2 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> {t.driveDisconnect}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.driveModalDesc}
              </p>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-lg leading-relaxed">
                  {error}
                </div>
              )}

              {/* Official styled Google Sign In Button */}
              <button
                onClick={handleGoogleAuthLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{loading ? t.driveSigningIn : t.driveSignInBtn}</span>
              </button>

              {/* Direct OAuth Token fallback */}
              <div className="pt-2 border-t border-slate-100">
                <details className="text-xs text-slate-500 cursor-pointer">
                  <summary className="font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Have an OAuth access token?
                  </summary>
                  <form onSubmit={handleManualTokenSubmit} className="mt-2 space-y-2">
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ya29.a0..."
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={loading || !tokenInput.trim()}
                      className="w-full py-1.5 text-xs font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50"
                    >
                      Connect with Token
                    </button>
                  </form>
                </details>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
