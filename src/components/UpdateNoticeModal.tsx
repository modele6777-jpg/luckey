import { ScreenPortal } from '@/components/layout/ScreenPortal';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, RefreshCw, Check } from 'lucide-react';
import type { ChangelogEntry } from '@/lib/updateNotice';
import type { UpdateNoticeMode } from '@/hooks/useUpdateNotice';
import { APP_VERSION, compareVersions } from '@/lib/appVersion';
import { applyServiceWorkerUpdate } from '@/lib/prismSync';

interface UpdateNoticeModalProps {
  isOpen: boolean;
  entries: ChangelogEntry[];
  mode?: UpdateNoticeMode;
  onClose: () => void;
  onApply?: () => void;
}

export function UpdateNoticeModal({ isOpen, entries, mode = 'auto', onClose, onApply }: UpdateNoticeModalProps) {
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const displayEntries: ChangelogEntry[] = entries.length > 0 ? entries : [
    {
      version: APP_VERSION,
      summary: '현재 최신 버전이 적용되어 있습니다.',
      items: ['클라우드 및 기기간 데이터 동기화 완료', '모든 기능 정상 작동 중'],
      builtAt: new Date().toISOString(),
    }
  ];

  const latestVersion = (
    mode === 'manual' ? displayEntries[0]?.version : displayEntries[displayEntries.length - 1]?.version
  ) || APP_VERSION;

  const isNewVersionAvailable = Boolean(latestVersion && compareVersions(latestVersion, APP_VERSION) > 0);

  const handleApplyUpdate = async () => {
    setIsApplying(true);
    try {
      if (onApply) {
        onApply();
        return;
      }
      await applyServiceWorkerUpdate();
      // Reload to ensure all new assets & scripts are fresh
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      window.location.reload();
    }
  };

  return (
    <ScreenPortal><AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-3 sm:p-4 pb-safe bg-black/70 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-notice-title"
            className="update-notice-modal w-full max-w-md max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-950 border border-amber-500/30 dark:border-yellow-500/20 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] dark:shadow-[0_0_50px_rgba(234,179,8,0.15)] relative backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              aria-label="닫기"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 dark:bg-yellow-500/10 border border-amber-500/35 dark:border-yellow-500/25 flex items-center justify-center text-amber-600 dark:text-yellow-400 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-yellow-400/90 font-mono">
                  PRISM Update
                </p>
                <h3 id="update-notice-title" className="text-lg font-bold text-slate-900 dark:text-white font-sans truncate">
                  {isNewVersionAvailable
                    ? '새로운 버전 업데이트 가능'
                    : mode === 'manual'
                      ? '최신 업데이트 변경점'
                      : '새 버전이 적용되었습니다'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-white/50 font-mono mt-0.5">
                  {isNewVersionAvailable
                    ? `현재 v${APP_VERSION} → 최신 v${latestVersion}`
                    : `v${APP_VERSION} (최신 버전 사용 중)`}
                </p>
              </div>
            </div>

            <div className="max-h-[min(60vh,22rem)] overflow-y-auto overscroll-contain space-y-3 mb-6 text-left pr-1">
              {displayEntries.map((entry) => (
                <div
                  key={entry.version}
                  className="update-notice-entry rounded-2xl border border-amber-900/10 dark:border-white/10 bg-amber-50/60 dark:bg-white/[0.04] px-4 py-3.5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[12px] font-extrabold text-amber-700 dark:text-yellow-300 font-mono tracking-wide">
                      v{entry.version}
                    </p>
                    {entry.builtAt && (
                      <span className="text-[11px] text-slate-400 dark:text-white/40 font-mono font-medium">
                        {new Date(entry.builtAt).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <p className="update-notice-summary text-[13.5px] text-slate-900 dark:text-white/90 leading-snug break-keep font-sans font-bold mb-2">
                    {entry.summary}
                  </p>
                  {entry.items && entry.items.length > 0 ? (
                    <ul className="space-y-1.5 pt-1.5 border-t border-amber-900/10 dark:border-white/5">
                      {entry.items.map((item, idx) => (
                        <li
                          key={`${entry.version}-item-${idx}`}
                          className="update-notice-item text-[12.5px] text-slate-700 dark:text-white/80 leading-relaxed break-keep font-sans flex items-start gap-2"
                        >
                          <span className="text-amber-500 dark:text-yellow-400 shrink-0 font-bold mt-0.5">•</span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    entry.summary === '자동 업데이트' ||
                    /^자동 업데이트\s+\d{4}/.test(entry.summary) ? (
                      <p className="update-notice-note mt-2 text-xs text-slate-500 dark:text-white/50 font-sans">
                        상세 변경 내역이 아직 기록되지 않은 버전입니다.
                      </p>
                    ) : null
                  )}
                </div>
              ))}
            </div>

            {isNewVersionAvailable ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleApplyUpdate}
                  disabled={isApplying}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <RefreshCw size={14} className={isApplying ? "animate-spin" : ""} />
                  {isApplying ? "업데이트 적용 중..." : "새 버전 업데이트 적용"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white/80 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  닫기
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Check size={14} />
                확인
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence></ScreenPortal>
  );
}
