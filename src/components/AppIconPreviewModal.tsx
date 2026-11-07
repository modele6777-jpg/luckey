import { ScreenPortal } from '@/components/layout/ScreenPortal';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Smartphone, Download, Check, ExternalLink } from 'lucide-react';

interface AppIconPreviewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AppIconPreviewModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: AppIconPreviewModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  useEffect(() => {
    const handleOpen = () => setInternalIsOpen(true);
    window.addEventListener('prism:open_icon_preview', handleOpen);
    return () => window.removeEventListener('prism:open_icon_preview', handleOpen);
  }, []);

  const handleCopyLink = async () => {
    try {
      const fullUrl = `${window.location.origin}/app-icon.png`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <ScreenPortal><AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-[#0c0d16] border border-white/15 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden text-white z-10"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-20"
            aria-label="닫기"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles size={14} />
            </span>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              Official App Icon
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-4">
            LucKey Prism 공식 앱 아이콘
          </h3>

          {/* Icon Display Area */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative group">
              {/* Outer Breathing Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/40 via-teal-400/40 to-indigo-500/40 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />
              
              {/* Main High-Res Icon */}
              <img
                src="/app-icon.png"
                alt="LucKey Prism App Icon"
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-[28px] shadow-2xl border-2 border-white/20 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-white/70 mt-3 font-medium">
              LucKey 프리즘 열쇠 · 별빛 성운 · 네잎클로버
            </p>
          </div>

          {/* Mobile Home Screen Simulation */}
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-xs text-white/60 font-medium">
              <Smartphone size={14} />
              <span>모바일 홈 화면 시뮬레이션</span>
            </div>
            <div className="flex items-center justify-around py-2 px-1 bg-black/40 rounded-xl border border-white/5">
              {/* App 1 (Sample) */}
              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-xs">
                  App
                </div>
                <span className="text-[10px] text-white/50">메시지</span>
              </div>

              {/* LucKey App Icon (Featured) */}
              <div className="flex flex-col items-center gap-1.5 scale-105">
                <div className="relative">
                  <div className="absolute -inset-1 bg-emerald-400/30 rounded-2xl blur-xs" />
                  <img
                    src="/app-icon.png"
                    alt="LucKey"
                    className="relative w-12 h-12 rounded-2xl shadow-lg border border-white/25 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-semibold text-emerald-300">LucKey</span>
              </div>

              {/* App 3 (Sample) */}
              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-xs">
                  App
                </div>
                <span className="text-[10px] text-white/50">사파리</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2">
            <a
              href="/app-icon.png"
              download="LucKey-Prism-App-Icon.png"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
            >
              <Download size={14} />
              아이콘 이미지 다운로드
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <ExternalLink size={14} />}
              {copied ? '복사됨' : '링크 복사'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence></ScreenPortal>
  );
}
