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
    <AnimatePresence>
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
            className="w-full max-w-md max-h-[92vh] overflow-y-auto glass border border-yellow-500/20 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_0_50px_rgba(234,179,8,0.12)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="닫기"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-400 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400/80 font-mono">
                  PRISM Update
                </p>
                <h3 className="text-lg font-bold text-white font-sans truncate">
                  {isNewVersionAvailable
                    ? '새로운 버전 업데이트 가능'
                    : mode === 'manual'
                      ? '최신 업데이트 변경점'
                      : '새 버전이 적용되었습니다'}
                </h3>
                <p className="text-[11px] text-white/45 font-mono mt-0.5">
                  {isNewVersionAvailable
                    ? `현재 v${APP_VERSION} → 최신 v${latestVersion}`
                    : `v${APP_VERSION} (최신 버전 사용 중)`}
                </p>
              </div>
            </div>

            <div className="max-h-[min(60vh,20rem)] overflow-y-auto overscroll-contain space-y-3 mb-6 text-left pr-1">
              {displayEntries.map((entry) => (
                <div
                  key={entry.version}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-[11px] font-bold text-yellow-300/90 font-mono">
                      v{entry.version}
                    </p>
                    {entry.builtAt && (
                      <span className="text-[10px] text-white/30 font-mono">
                        {new Date(entry.builtAt).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed break-keep font-sans font-semibold">
                    {entry.summary}
                  </p>
                  {entry.items && entry.items.length > 0 ? (
                    <ul className="mt-2.5 space-y-1.5">
                      {entry.items.map((item, idx) => (
                        <li
                          key={`${entry.version}-item-${idx}`}
                          className="text-[13px] text-white/70 leading-relaxed break-keep font-sans flex gap-2"
                        >
                          <span className="text-yellow-500/70 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    entry.summary === '자동 업데이트' ||
                    /^자동 업데이트\s+\d{4}/.test(entry.summary) ? (
                      <p className="mt-2 text-xs text-white/45 font-sans">
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
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  <RefreshCw size={14} className={isApplying ? "animate-spin" : ""} />
                  {isApplying ? "업데이트 적용 중..." : "새 버전 업데이트 적용"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  닫기
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-yellow-500/90 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={14} />
                확인
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}