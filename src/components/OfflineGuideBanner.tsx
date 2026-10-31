import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, X, Wind, Sparkles, BookOpen, Moon } from 'lucide-react';
import { useLocation } from 'wouter';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const DISMISS_KEY = 'offline_guide_banner_dismissed';

const OFFLINE_QUICK_LINKS = [
  { icon: Wind, label: 'Calm 호흡 가이드', path: '/calm' },
  { icon: Sparkles, label: '데일리 모닝 루틴', path: '/prologue' },
  { icon: Moon, label: '여정 기록 결산', path: '/epilogue' },
  { icon: BookOpen, label: '라이브러리', path: '/library' },
];

/**
 * 📴 오프라인 가이드 배너
 * 네트워크가 끊겨도 화면이 깨지거나 빈 화면처럼 보이지 않도록,
 * 오프라인에서 즉시 실행 가능한 로컬 기능(저장된 기록 · Calm 호흡 ·
 * 데일리 모닝 루틴 등)으로의 복귀로를 안내하는 복원력 배너.
 * 같은 세션에서 닫았다면 다시 띄우지 않고, 새로 오프라인이 되면 다시 안내합니다.
 */
export function OfflineGuideBanner() {
  const { isOnline, justBackOnline } = useOnlineStatus();
  const [, navigate] = useLocation();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!isOnline) {
      // 새 오프라인 구간에서는 다시 안내
      try {
        sessionStorage.removeItem(DISMISS_KEY);
      } catch {
        /* noop */
      }
      setDismissed(false);
    }
  }, [isOnline]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* noop */
    }
    setDismissed(true);
  };

  const visible = !isOnline && !dismissed;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="offline-guide-banner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="fixed bottom-0 left-0 right-0 z-[90] flex justify-center pointer-events-none px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-amber-400/25 shadow-[0_16px_48px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="flex items-start gap-3 px-4 pt-3.5 pb-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <WifiOff size={15} className="text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-amber-200 tracking-wide">
                    오프라인 모드 · 네트워크에 연결할 수 없어요
                  </p>
                  <p className="text-[11px] leading-relaxed text-white/60 mt-0.5 break-keep">
                    연결이 복구되면 자동으로 동기화됩니다. 그동안에도 아래 기능은 오프라인에서 그대로 사용할 수 있어요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  title="배너 닫기"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 px-4 pb-3">
                {OFFLINE_QUICK_LINKS.map(({ icon: Icon, label, path }) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      navigate(path);
                      dismiss();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-semibold text-white/80 hover:bg-white/[0.12] hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Icon size={13} className="text-amber-300/90 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {justBackOnline && (
          <motion.div
            key="back-online-toast"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[95] px-4 py-2 rounded-full bg-emerald-950/85 border border-emerald-400/30 backdrop-blur-xl flex items-center gap-2 shadow-lg pointer-events-none"
          >
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-300">다시 연결되었어요 · 동기화를 시작합니다</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default OfflineGuideBanner;
