import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { resetAppScroll } from '@/utils/scrollToTop';
import { playAudioHaptic } from '@/lib/audioHaptics';

export function NotchScrollToTopBar() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const checkScroll = useCallback(() => {
    let maxScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Check data-app-scroll-root elements
    document.querySelectorAll('[data-app-scroll-root]').forEach((node) => {
      const el = node as HTMLElement;
      if (el.scrollTop > maxScroll) {
        maxScroll = el.scrollTop;
      }
    });

    // Check any active overflow-y scroll containers
    document.querySelectorAll('.overflow-y-auto, .overflow-y-scroll').forEach((node) => {
      const el = node as HTMLElement;
      if (el.scrollTop > maxScroll) {
        maxScroll = el.scrollTop;
      }
    });

    setIsScrolledDown(maxScroll > 60);
  }, []);

  useEffect(() => {
    // Passive scroll listeners
    window.addEventListener('scroll', checkScroll, { passive: true });
    document.addEventListener('scroll', checkScroll, { passive: true, capture: true });

    const interval = setInterval(checkScroll, 400);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      document.removeEventListener('scroll', checkScroll, { capture: true });
      clearInterval(interval);
    };
  }, [checkScroll]);

  const handleScrollToTop = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      playAudioHaptic('tap_light');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }

    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);

    resetAppScroll('smooth');
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[120] pointer-events-none flex justify-center items-start select-none"
      style={{
        height: 'max(calc(var(--sat, 0px) + 2rem), 2.75rem)',
        paddingTop: 'max(var(--sat, 0px), 0.25rem)',
      }}
    >
      {/* Full-width top status bar tap target for mobile notch/status-bar tap */}
      <div
        onClick={handleScrollToTop}
        className="pointer-events-auto absolute inset-x-0 top-0 h-full cursor-pointer opacity-0"
        title="화면 상단(노치) 탭: 페이지 최상단으로 이동"
        aria-label="페이지 최상단으로 이동"
      />

      {/* Visual Dynamic Island / Notch Pill when scrolled down */}
      <AnimatePresence>
        {isScrolledDown && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: isTapped ? 0.92 : 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleScrollToTop}
            className="pointer-events-auto relative mt-0.5 px-3 py-1 rounded-full bg-black/75 hover:bg-black/90 active:scale-95 text-white/80 hover:text-white border border-white/15 hover:border-yellow-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-tight cursor-pointer transition-colors"
            title="노치 탭하여 페이지 최상단으로 이동"
            aria-label="페이지 최상단으로 스크롤 이동"
          >
            <motion.div
              animate={{ y: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ChevronUp size={12} className="text-yellow-400 stroke-[3]" />
            </motion.div>
            <span className="font-medium text-white/90">최상단</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
