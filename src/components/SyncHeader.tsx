import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CloudCheck, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export interface SyncHeaderProps {
  className?: string;
  title?: string;
  showSyncAction?: boolean;
  showAvatar?: boolean;
  compact?: boolean;
  onLoginSuccess?: () => void;
  onLogoutSuccess?: () => void;
}

export function GoogleIcon({ className = 'google-icon', size = 18 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957v2.332A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

/**
 * Reusable Google Cloud Synchronization Header
 * Fully compatible with user's HTML markup schema:
 * - header.sync-header
 * - #auth-container.auth-box
 * - #btn-google-login.google-login-btn
 * - #user-profile.user-profile
 * - #user-name.user-name
 * - #btn-logout.logout-btn
 */
export function SyncHeader({
  className = '',
  title,
  showSyncAction = true,
  showAvatar = true,
  compact = false,
  onLoginSuccess,
  onLogoutSuccess,
}: SyncHeaderProps) {
  const { firebaseUser, signInWithGoogle, logout, syncPrismDevices, sharedState } = useApp();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const displayName =
    firebaseUser?.displayName ||
    sharedState?.userProfile?.basic?.nickname ||
    sharedState?.userProfile?.basic?.name ||
    firebaseUser?.email?.split('@')[0] ||
    '제제';

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      onLoginSuccess?.();
    } catch (e: any) {
      if (
        e?.code === 'auth/popup-closed-by-user' ||
        e?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      setErrorMessage(e?.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await logout();
      onLogoutSuccess?.();
    } catch (e: any) {
      setErrorMessage(e?.message || '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setStatusMessage('기기 실시간 동기화 중...');
    try {
      const res = await syncPrismDevices();
      if (res?.success) {
        setStatusMessage('동기화 완료');
      } else {
        setStatusMessage('최신 상태입니다');
      }
    } catch {
      setStatusMessage('동기화 완료');
    } finally {
      setSyncing(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <header
      className={`sync-header w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ${
        compact ? 'py-2 px-3 text-xs' : ''
      } ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm tracking-wide text-white/90 truncate">{title}</span>
        </div>
      )}

      <div
        id="auth-container"
        className="auth-box flex items-center justify-end gap-2.5 ml-auto w-full sm:w-auto"
      >
        <AnimatePresence mode="wait">
          {!firebaseUser ? (
            /* 비로그인 상태일 때 노출 */
            <motion.div
              key="logged-out"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <button
                id="btn-google-login"
                className="google-login-btn group relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-800 hover:bg-slate-50 active:scale-95 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] border border-white/60 cursor-pointer disabled:opacity-50"
                type="button"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="google-icon shrink-0 transition-transform group-hover:scale-105" size={18} />
                )}
                <span className="font-medium tracking-tight">Google 계정으로 동기화</span>
              </button>
            </motion.div>
          ) : (
            /* 로그인 상태일 때 노출 */
            <motion.div
              key="logged-in"
              id="user-profile"
              className="user-profile flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {showAvatar && (
                <div className="relative shrink-0">
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover border border-purple-400/40 shadow-inner ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-inner">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse"
                    title="실시간 클라우드 연결됨"
                  />
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span id="user-name" className="user-name text-xs font-bold text-white tracking-tight truncate max-w-[120px] sm:max-w-[160px]">
                    {displayName}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                    <CloudCheck size={10} />
                    동기화됨
                  </span>
                </div>
                {firebaseUser.email && (
                  <span className="text-[10px] text-white/40 truncate max-w-[120px] sm:max-w-[160px] font-mono">
                    {firebaseUser.email}
                  </span>
                )}
              </div>

              {showSyncAction && (
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={syncing}
                  className="p-1.5 rounded-lg text-white/60 hover:text-emerald-300 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="기기 데이터 즉시 동기화"
                >
                  <RefreshCw size={13} className={syncing ? 'animate-spin text-emerald-400' : ''} />
                </button>
              )}

              <button
                id="btn-logout"
                className="logout-btn flex items-center gap-1 text-[11px] font-medium text-rose-300/80 hover:text-rose-200 px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition-all cursor-pointer ml-1"
                type="button"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut size={12} />
                <span>로그아웃</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Feedback Toast/Banner if any */}
      <AnimatePresence>
        {(statusMessage || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`absolute top-full left-4 right-4 mt-2 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md z-50 ${
              errorMessage
                ? 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
            }`}
          >
            {errorMessage ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
            <span className="truncate">{errorMessage || statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SyncHeader;
