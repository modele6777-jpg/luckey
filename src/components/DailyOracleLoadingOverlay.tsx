import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const THEME_STYLES = {
  orange: {
    glow: 'bg-orange-500/20',
    ring: 'border-orange-500/30',
    orb: 'from-orange-500/30 via-amber-500/20 to-transparent',
    icon: 'text-orange-400',
    subtitle: 'text-orange-300/80',
    accent: '#f97316'
  },
  sky: {
    glow: 'bg-sky-500/20',
    ring: 'border-sky-500/30',
    orb: 'from-sky-500/30 via-cyan-500/20 to-transparent',
    icon: 'text-sky-400',
    subtitle: 'text-sky-300/80',
    accent: '#38bdf8'
  },
  emerald: {
    glow: 'bg-emerald-500/20',
    ring: 'border-emerald-500/30',
    orb: 'from-emerald-500/30 via-teal-500/20 to-transparent',
    icon: 'text-emerald-400',
    subtitle: 'text-emerald-300/80',
    accent: '#34d399'
  },
  blue: {
    glow: 'bg-blue-500/20',
    ring: 'border-blue-500/30',
    orb: 'from-blue-500/30 via-indigo-500/20 to-transparent',
    icon: 'text-blue-400',
    subtitle: 'text-blue-300/80',
    accent: '#60a5fa'
  },
  yellow: {
    glow: 'bg-yellow-500/20',
    ring: 'border-yellow-500/30',
    orb: 'from-yellow-500/30 via-amber-500/20 to-transparent',
    icon: 'text-yellow-400',
    subtitle: 'text-yellow-300/80',
    accent: '#facc15'
  },
} as const;

const SERENE_QUOTES = [
  "마음의 파도를 가만히 가라앉히고 있습니다...",
  "내면의 고요한 주파수와 지혜를 조율하는 시간...",
  "보이지 않는 깊은 곳의 빛을 불러오고 있습니다...",
  "모든 생각과 긴장을 편안하게 내려놓아 보세요...",
  "지금 이 순간, 당신에게 꼭 필요한 영감을 건넵니다..."
];

type DailyOracleTheme = keyof typeof THEME_STYLES;

interface DailyOracleLoadingOverlayProps {
  isLoading: boolean;
  theme?: DailyOracleTheme;
}

export function DailyOracleLoadingOverlay({
  isLoading,
  theme = 'orange',
}: DailyOracleLoadingOverlayProps) {
  const styles = THEME_STYLES[theme] || THEME_STYLES.orange;
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % SERENE_QUOTES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="daily-oracle-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-2xl px-4 sm:px-6"
        >
          <div className="flex flex-col items-center gap-3.5 sm:gap-6 max-w-sm text-center">
            {/* Breathing Aura Orb */}
            <div className="relative w-14 h-14 sm:w-24 sm:h-24 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-0 rounded-full bg-gradient-radial ${styles.orb} blur-xl sm:blur-2xl`}
              />

              {/* Single Delicate Breathing Ring */}
              <motion.div
                animate={{
                  scale: [0.95, 1.06, 0.95],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-0 rounded-full border ${styles.ring}`}
              />

              {/* Inner Star / Soft Icon */}
              <motion.div
                animate={{
                  scale: [0.95, 1.05, 0.95],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-9 h-9 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/40"
              >
                <Sparkles className={`${styles.icon} w-4 h-4 sm:w-5 sm:h-5`} />
              </motion.div>
            </div>

            {/* Poetic & Serene Text */}
            <div className="space-y-1 sm:space-y-2">
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm sm:text-base font-display font-medium text-white/95 tracking-wide"
              >
                영혼의 오라클을 조율하는 중
              </motion.p>
              
              <div className="h-6 sm:h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35 }}
                    className={`text-[11px] sm:text-xs md:text-sm ${styles.subtitle} font-normal tracking-wide leading-relaxed px-2`}
                  >
                    {SERENE_QUOTES[quoteIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Minimal Hairline Progress */}
            <div className="w-16 sm:w-24 h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  background: `linear-gradient(90deg, transparent, ${styles.accent}, transparent)`
                }}
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}