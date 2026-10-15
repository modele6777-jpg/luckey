import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocateFixed, Sparkles } from 'lucide-react';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface SmartScrollResumeButtonProps {
  /**
   * Whether the button should be displayed (usually when isUserOverriding && isSpeaking)
   */
  isVisible: boolean;
  /**
   * Callback fired when user clicks to resume following the spoken sentence
   */
  onResume: () => void;
  /**
   * Countdown remaining seconds (e.g. 3, 2, 1) before auto-resume kicks in
   */
  remainingSeconds?: number;
  /**
   * Custom label text (defaults to '낭독 위치로 이동')
   */
  label?: string;
  /**
   * If true, fixed positioned to the viewport bottom (used on main pages).
   * If false, positioned absolute/relative to the container (used in modals).
   */
  fixed?: boolean;
  /**
   * Additional custom Tailwind classes
   */
  className?: string;
}

export const SmartScrollResumeButton: React.FC<SmartScrollResumeButtonProps> = ({
  isVisible,
  onResume,
  remainingSeconds = 3,
  label = '낭독 위치로 이동',
  fixed = false,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      playAudioHaptic('tap_light');
    } catch (_) {}
    onResume();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={
            fixed
              ? `fixed bottom-20 sm:bottom-24 right-4 sm:right-8 z-50 pointer-events-auto ${className}`
              : `sticky bottom-4 mx-auto z-40 w-fit pointer-events-auto mt-3 ${className}`
          }
        >
          <button
            type="button"
            onClick={handleClick}
            className="group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#12121c]/90 hover:bg-[#1a1a28] active:scale-95 border border-amber-400/50 hover:border-amber-400 text-white shadow-[0_8px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.4)] backdrop-blur-md transition-all cursor-pointer font-sans"
            title="현재 음성 낭독 중인 문장으로 화면을 부드럽게 이동합니다"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute" />
              <LocateFixed size={15} className="text-amber-400 relative z-10 shrink-0 group-hover:rotate-45 transition-transform" />
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-tight text-amber-100">
              <span>{label}</span>
              <Sparkles size={12} className="text-amber-400/80 animate-pulse hidden sm:inline-block" />
            </div>

            {remainingSeconds > 0 && (
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {remainingSeconds}s 후 자동 복귀
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
